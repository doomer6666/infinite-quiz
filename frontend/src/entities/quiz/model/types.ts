import type { QuizCategory } from "@infinite-quiz/common";

export type QuizWizardState = {
  title: string;
  imageFile: File | null;
  category: QuizCategory;
  pointsPerQuestion: number;
  timePerQuestion: number;
};
export interface StepData {
  id: number;
  title: string;
  desc: string;
  name: string;
}

export const QUIZ_STEPS: StepData[] = [
  {
    id: 1,
    title: "Основное",
    desc: "Название",
    name: "Основная информация",
  },
  {
    id: 2,
    title: "Категория",
    desc: "Тема квиза",
    name: "Категория квиза",
  },
  {
    id: 3,
    title: "Баллы",
    desc: "Оценивание",
    name: "Система баллов",
  },
  {
    id: 4,
    title: "Время",
    desc: "Лимиты на вопрос",
    name: "Настройка времени",
  },
];

export type QuestionType = "text" | "image";
export type AnswerMode = "single" | "multi";

export interface EditorAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface EditorQuestion {
  id: string;
  type: QuestionType;
  answerMode: AnswerMode;
  text: string;
  imageUrl?: string | null;
  answers: EditorAnswer[];
  timeLimit: number;
  points: number;
}
