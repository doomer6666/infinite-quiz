import { inject, injectable } from "inversify";
import { Component } from "../../shared/types/conponent.js";
import { ILogger } from "../../shared/libs/logger/logger.interface.js";
import {
  CreateRoomInput,
  GameState,
  GameStatus,
  Player,
} from "@infinite-quiz/common";

function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

@injectable()
export class GameRoomManager {
  private roomState = new Map<string, GameState>();
  constructor(@inject(Component.Logger) private readonly logger: ILogger) {}

  public createRoom(input: CreateRoomInput): GameState {
    const code = generateRoomCode();
    const state: GameState = {
      code: code,
      quizId: input.quizId,
      hostId: input.hostId,
      hostSocketId: input.hostSocketId,
      status: "LOBBY",
      players: new Map(),
      questions: input.questions,
      currentQuestionIndex: -1,
      currentAnswers: [],
      timer: null,
      timerEndsAt: null,
    };

    this.roomState.set(code, state);
    this.logger.info(`Room created: ${code}, host: ${input.hostId}`);
    return state;
  }

  public getRoom(code: string): GameState | undefined {
    return this.roomState.get(code);
  }

  public findRoomBySocketId(socketId: string): GameState | undefined {
    for (const room of this.roomState.values()) {
      if (room.hostSocketId === socketId) return room;
      for (const player of room.players.values()) {
        if (player.socketId === socketId) return room;
      }
    }
    return undefined;
  }

  public addPlayer(code: string, newPlayer: Player): GameState | undefined {
    const room = this.roomState.get(code);
    if (!room || room.status !== "LOBBY") return undefined;

    room.players.set(newPlayer._id, newPlayer);
    this.logger.info(
      `Player ${newPlayer.name} joined room ${code} (${room.players.size} total)`,
    );
    return room;
  }

  public removePlayer(socketId: string): GameState | undefined {
    const room = this.findRoomBySocketId(socketId);
    if (!room) return undefined;

    if (room.hostSocketId === socketId) {
      this.clearTimer(room.code);
      this.roomState.delete(room.code);
      this.logger.info(`Room ${room.code} destroyed: host disconnected`);
      return undefined;
    }

    for (const [id, player] of room.players) {
      if (player.socketId === socketId) {
        room.players.delete(id);
        this.logger.info(
          `Player ${player.name} left room ${room.code} (${room.players.size} remaining)`,
        );
        break;
      }
    }

    return room;
  }

  public setStatus(code: string, newStatus: GameStatus): GameState | undefined {
    const room = this.roomState.get(code);
    if (!room) return undefined;

    const oldStatus = room.status;
    room.status = newStatus;
    this.logger.info(`Room ${code}: ${oldStatus} -> ${newStatus}`);
    return room;
  }

  public nextQuestion(code: string): GameState | undefined {
    const room = this.roomState.get(code);
    if (!room) return undefined;

    room.currentQuestionIndex++;
    room.currentAnswers = [];

    return room;
  }

  public submitAnswer(
    code: string,
    playerId: string,
    answerId: string,
  ): GameState | undefined {
    const room = this.roomState.get(code);

    if (!room || room.status !== "QUESTION_ANSWERING") return undefined;
    if (room.currentAnswers.some((a) => a.playerId === playerId)) return room;

    const question = room.questions[room.currentQuestionIndex];
    const answer = question.answers.find((a) => a._id === answerId);
    const isCorrect = answer?.isCorrect ?? false;

    if (isCorrect) {
      const player = room.players.get(playerId);
      if (player) {
        player.score += question.points;
      }
    }

    room.currentAnswers.push({
      playerId,
      answerId,
      answeredAt: Date.now(),
    });

    return room;
  }

  public allAnswered(code: string): boolean {
    const room = this.roomState.get(code);
    if (!room) return false;
    return room.currentAnswers.length >= room.players.size;
  }

  public getLeaderboard(code: string): Player[] | undefined {
    const room = this.roomState.get(code);
    if (!room) return undefined;

    const liders = [];
    for (let [_, val] of room.players) {
      liders.push(val);
    }
    return liders.sort((a, b) => b.score - a.score);
  }

  public startTimer(code: string, seconds: number, onExpire: () => void): void {
    const room = this.roomState.get(code);
    if (!room) return;

    this.clearTimer(code);

    room.timerEndsAt = Date.now() + seconds * 1000;
    room.timer = setTimeout(() => {
      room.timer = null;
      room.timerEndsAt = null;
      onExpire();
    }, seconds * 1000);
  }

  public clearTimer(code: string): void {
    const room = this.roomState.get(code);
    if (!room) return;

    if (room.timer) {
      clearTimeout(room.timer);
      room.timer = null;
    }
    room.timerEndsAt = null;
  }

  public getRemainingTime(code: string): number {
    const room = this.roomState.get(code);
    if (!room || !room.timerEndsAt) return 0;
    return Math.max(0, Math.ceil((room.timerEndsAt - Date.now()) / 1000));
  }
}
