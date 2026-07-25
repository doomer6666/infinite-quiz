import { Question } from "./quiz.type.js";

export const GameStatusEnum = {
  LOBBY: "LOBBY",
  INTRO: "INTRO",
  QUESTION_SHOW: "QUESTION_SHOW",
  QUESTION_ANSWERING: "QUESTION_ANSWERING",
  QUESTION_RESULTS: "QUESTION_RESULTS",
  GAME_END: "GAME_END",
} as const;

export type GameStatus = (typeof GameStatusEnum)[keyof typeof GameStatusEnum];

export interface Player {
  _id: string;
  name: string;
  avatar: string;
  score: number;
  socketId: string;
}

export interface PlayerAnswer {
  playerId: string;
  answerId: string;
  answeredAt: number;
}

export interface CreateRoomInput {
  quizId: string;
  hostId: string;
  hostSocketId: string;
  questions: Question[];
}

export interface GameState {
  code: string;
  quizId: string;
  hostId: string;
  hostSocketId: string;
  status: GameStatus;
  players: Map<string, Player>;
  questions: Question[];
  currentQuestionIndex: number;
  currentAnswers: PlayerAnswer[];
  timer: ReturnType<typeof setTimeout> | null;
  timerEndsAt: number | null;
}
