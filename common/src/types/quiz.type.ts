export const QuizStatusEnum = {
  published: "published",
  draft: "draft",
};
export type QuizStatus = (typeof QuizStatusEnum)[keyof typeof QuizStatusEnum];

export const QuizCategoryEnum = {
  science: "science",
  history: "history",
  technologies: "technologies",
  geography: "geography",
  movie: "movie",
  sports: "sports",
};

export type QuizCategory =
  (typeof QuizCategoryEnum)[keyof typeof QuizCategoryEnum];

export type Answer = {
  text: string;
  isCorrect: boolean;
};

export type Question = {
  text: string;
  points: number;
  timeLimit: number;
  answers: Answer[];
};

export type Quiz = {
  hostId: string;
  title: string;
  imageFilename: string;
  questions: Question[];
  questionCount: number;
  pointsCount: number;
  status: QuizStatus;
  category: QuizCategory;
};
