import z from "zod";
import { QuizCategoryEnum } from "../types/index.js";

const PublishedAnswerSchema = z.object({
  text: z.string().min(1, "Текст ответа не может быть пустым"),
  isCorrect: z.boolean(),
});
const categories = Object.values(QuizCategoryEnum) as [string, ...string[]];

const PublishedQuestionSchema = z
  .object({
    text: z
      .string()
      .min(5, "Текст вопроса слишком короткий (минимум 5 символов)"),
    points: z.number().min(1, "Баллы должны быть больше 0"),
    timeLimit: z.number().min(5, "Лимит времени должен быть не менее 5 секунд"),
    answers: z
      .array(PublishedAnswerSchema)
      .min(2, "Вопрос должен содержать минимум 2 варианта ответа"),
  })
  .refine((question) => question.answers.some((ans) => ans.isCorrect), {
    message: "Необходимо указать хотя бы один правильный вариант ответа",
    path: ["answers"],
  });

export const PublishQuizSchema = z.object({
  title: z
    .string()
    .min(3, "Название квиза слишком короткое (минимум 3 символа)"),
  category: z.enum(categories),

  imageFilename: z.string().refine((img) => img !== "default.png", {
    message: "Необходимо загрузить обложку квиза",
  }),
  questions: z
    .array(PublishedQuestionSchema)
    .min(2, "Квиз должен содержать минимум 2 вопроса для публикации"),
});
