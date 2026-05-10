export type Answer = {
  text: string;
  isCorrect: boolean;
};

export type Question = {
  text: string;
  timeLimit: number;
  points: number;
  answers: Answer[];
};

export type Quiz = {
  hostId: number;
  title: string;
  questions: Question[];
};
