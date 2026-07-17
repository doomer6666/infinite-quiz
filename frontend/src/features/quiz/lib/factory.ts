import type { EditorQuestion } from "@/entities/quiz/index";

let idCounter = 100;
export const genId = () => `q-${idCounter++}`;

export const createDefaultAnswers = () => [
  { id: genId(), text: "", isCorrect: true },
  { id: genId(), text: "", isCorrect: false },
];

export const createEmptyQuestion = (
  points: number,
  time: number,
): EditorQuestion => ({
  id: genId(),
  type: "text",
  answerMode: "single",
  text: "",
  imageUrl: null,
  answers: createDefaultAnswers(),
  timeLimit: time,
  points: points,
});
