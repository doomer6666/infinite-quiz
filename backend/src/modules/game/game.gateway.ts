import { inject, injectable } from "inversify";
import { Component } from "../../shared/types/conponent.js";
import { GameRoomManager } from "./game-room.manager.js";
import { ILogger } from "../../shared/libs/logger/index.js";
import { IQuizService } from "../quiz/quiz-service.interface.js";
import { IUserService } from "../user/user-service.interface.js";
import http from "http";
import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  Player,
  ServerToClientEvents,
} from "@infinite-quiz/common";

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;

@injectable()
export class GameGateway {
  private io!: TypedServer;

  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.GameRoomManager)
    private readonly manager: GameRoomManager,
    @inject(Component.QuizService) private quizService: IQuizService,
    @inject(Component.UserService) private userService: IUserService,
  ) {}

  public init(httpServer: http.Server) {
    this.io = new Server<ClientToServerEvents, ServerToClientEvents>(
      httpServer,
      {
        cors: {
          origin: "http://localhost:5173",
          credentials: true,
        },
      },
    );

    this.io.on("connection", (socket: TypedSocket) => {
      this.logger.info(`Socket connected: ${socket.id}`);
      this.handleConnection(socket);
    });
  }

  private handleConnection(socket: TypedSocket) {
    socket.on("game:create", async (data) => {
      this.logger.info("game:create received:", data);
      const quiz = await this.quizService.findById(data.quizId);
      if (!quiz) {
        socket.emit("error", { message: "Quiz not found" });
        return;
      }

      const room = this.manager.createRoom({
        quizId: data.quizId,
        hostId: data.hostId,
        hostSocketId: socket.id,
        questions: quiz.questions.map((q) => ({
          id: q._id.toString(),
          text: q.text,
          points: q.points,
          timeLimit: q.timeLimit,
          answers: q.answers.map((a) => ({
            id: a._id.toString(),
            text: a.text,
            isCorrect: a.isCorrect,
          })),
        })),
      });

      socket.join(room.code);
      socket.emit("game:created", { code: room.code });
    });

    socket.on("game:join", async (data) => {
      const user = await this.userService.findById(data.userId);
      if (!user) {
        socket.emit("error", { message: "User not found" });
        return;
      }

      const player: Player = {
        _id: user._id.toString(),
        name: user.name,
        avatar: user.avatar,
        score: 0,
        socketId: socket.id,
      };

      const room = this.manager.addPlayer(data.code, player);
      if (!room) {
        socket.emit("error", { message: "Cannot join room" });
        return;
      }

      socket.join(data.code);
      socket.emit("game:joined", { code: data.code });
      this.broadcastPlayers(data.code);
    });

    socket.on("game:start", (data) => {
      if (!this.isHost(socket.id, data.code)) return;

      this.manager.setStatus(data.code, "INTRO");
      this.io.to(data.code).emit("game:status", { status: "INTRO" });
    });

    socket.on("game:show-question", (data) => {
      if (!this.isHost(socket.id, data.code)) return;

      const room = this.manager.nextQuestion(data.code);
      if (!room) return;

      if (room.currentQuestionIndex >= room.questions.length) {
        this.manager.clearTimer(data.code);
        this.manager.setStatus(data.code, "GAME_END");
        this.io.to(data.code).emit("game:end", {
          leaderboard: this.manager.getLeaderboard(data.code)!,
        });
        return;
      }

      this.manager.setStatus(data.code, "QUESTION_SHOW");
      const question = room.questions[room.currentQuestionIndex];

      this.io.to(data.code).emit("game:question", {
        question,
        index: room.currentQuestionIndex,
        total: room.questions.length,
      });
    });

    socket.on("game:start-answering", (data) => {
      if (!this.isHost(socket.id, data.code)) return;

      const room = this.manager.getRoom(data.code);
      if (!room) return;

      this.manager.setStatus(data.code, "QUESTION_ANSWERING");
      const question = room.questions[room.currentQuestionIndex];

      this.manager.startTimer(data.code, question.timeLimit, () => {
        this.onTimeUp(data.code);
      });

      this.io.to(data.code).emit("game:answering", {
        timeLimit: question.timeLimit,
        endsAt: room.timerEndsAt!,
      });
    });

    socket.on("game:next", (data) => {
      if (!this.isHost(socket.id, data.code)) return;
      this.handleShowQuestion(socket, data.code);
    });

    socket.on("game:answer", (data) => {
      this.manager.submitAnswer(data.code, data.userId, data.answerId);

      socket.emit("game:answer-accepted");

      if (this.manager.allAnswered(data.code)) {
        this.manager.clearTimer(data.code);
        this.onTimeUp(data.code);
      }
    });

    socket.on("disconnect", () => {
      const room = this.manager.findRoomBySocketId(socket.id);
      if (!room) return;

      const code = room.code;
      const wasHost = room.hostSocketId === socket.id;

      this.manager.removePlayer(socket.id);

      if (wasHost) {
        this.io
          .to(code)
          .emit("game:destroyed", { reason: "Host disconnected" });
      } else {
        this.broadcastPlayers(code);
      }
    });
  }

  private isHost(socketId: string, code: string): boolean {
    const room = this.manager.getRoom(code);
    return room?.hostSocketId === socketId;
  }

  private broadcastPlayers(code: string) {
    const room = this.manager.getRoom(code);
    if (!room) return;

    const players = Array.from(room.players.values()).map((p) => ({
      id: p._id,
      name: p.name,
      avatar: p.avatar,
      score: p.score,
    }));

    this.io.to(code).emit("game:players", { players });
  }

  private onTimeUp(code: string) {
    this.manager.setStatus(code, "QUESTION_RESULTS");

    const room = this.manager.getRoom(code);
    if (!room) return;

    this.io.to(code).emit("game:results", {
      scores: this.getScores(code),
      leaderboard: this.manager.getLeaderboard(code)!,
    });
  }

  private getScores(code: string): Record<string, number> {
    const room = this.manager.getRoom(code);
    if (!room) return {};

    const scores: Record<string, number> = {};
    for (const player of room.players.values()) {
      scores[player._id] = player.score;
    }
    return scores;
  }

  private handleShowQuestion(socket: TypedSocket, code: string) {
    const room = this.manager.nextQuestion(code);
    if (!room) return;

    if (room.currentQuestionIndex >= room.questions.length) {
      this.manager.clearTimer(code);
      this.manager.setStatus(code, "GAME_END");
      this.io.to(code).emit("game:end", {
        leaderboard: this.manager.getLeaderboard(code)!,
      });
      return;
    }

    this.manager.setStatus(code, "QUESTION_SHOW");
    const question = room.questions[room.currentQuestionIndex];

    this.io.to(code).emit("game:question", {
      question,
      index: room.currentQuestionIndex,
      total: room.questions.length,
    });
  }
}
