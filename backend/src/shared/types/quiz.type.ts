export type Answer = {
  _id?: string;
  text: string;
  isCorrect: boolean;
};

export type Question = {
  _id?: string;
  text: string;
  timeLimit: number;
  points: number;
  answers: Answer[];
};

export type Quiz = {
  hostId: string;
  title: string;
  questions: Question[];
};
