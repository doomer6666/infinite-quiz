import { GameStatus, Player } from "./game.type";
import { Question } from "./quiz.type";

export interface ClientToServerEvents {
  "game:create": (data: { quizId: string; hostId: string }) => void;
  "game:join": (data: { code: string; userId: string }) => void;
  "game:reconnect": (data: {
    code: string;
    userId: string;
    role: string;
  }) => void;
  "game:start": (data: { code: string }) => void;
  "game:show-question": (data: { code: string }) => void;
  "game:start-answering": (data: { code: string }) => void;
  "game:answer": (data: {
    code: string;
    answerId: string;
    userId: string;
  }) => void;
  "game:next": (data: { code: string }) => void;
}

export interface ServerToClientEvents {
  "game:created": (data: { code: string }) => void;
  "game:joined": (data: { code: string }) => void;
  "game:reconnected": (data: {
    status: GameStatus;
    questionIndex?: number;
  }) => void;
  "game:status": (data: { status: GameStatus }) => void;
  "game:players": (data: { players: Player[] }) => void;
  "game:question": (data: {
    question: Question;
    index: number;
    total: number;
  }) => void;
  "game:answering": (data: { timeLimit: number; endsAt: number }) => void;
  "game:answer-accepted": () => void;
  "game:results": (data: {
    scores: Record<string, number>;
    leaderboard: Player[];
  }) => void;
  "game:end": (data: { leaderboard: Player[] }) => void;
  "game:destroyed": (data: { reason: string }) => void;
  error: (data: { message: string }) => void;
}
