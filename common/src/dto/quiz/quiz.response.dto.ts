import z from "zod";
import { QuizCategoryEnum, QuizStatusEnum } from "../../types/index";

export const MongoIdSchema = z.unknown().transform((val) => {
  if (val === null || val === undefined) return "";
  if (
    typeof val === "object" &&
    "toString" in val &&
    typeof val.toString === "function"
  ) {
    return val.toString();
  }
  return String(val);
});

export const AnswerSchema = z.object({
  _id: MongoIdSchema,
  text: z.string().min(1, "Ответ не может быть пустым"),
  isCorrect: z.boolean(),
});
export type AnswerDto = z.infer<typeof AnswerSchema>;

export const QuestionSchema = z.object({
  _id: MongoIdSchema,
  text: z.string().min(1, "Вопрос не может быть пустым"),
  points: z.number().min(1),
  imageFilename: z.string().optional(),
  timeLimit: z.number().min(1),
  answers: z.array(AnswerSchema).min(2, "Минимум 2 варианта ответа"),
});
export type QuestionDto = z.infer<typeof QuestionSchema>;

export const QuizSchema = z.object({
  _id: MongoIdSchema,
  hostId: z.string(),
  title: z.string(),
  imageFilename: z.string(),
  questionCount: z.number(),
  pointsCount: z.number(),
  status: z.enum(QuizStatusEnum),
  category: z.enum(QuizCategoryEnum),
});
export type QuizDto = z.infer<typeof QuizSchema>;

export const QuizWithQuestionsSchema = QuizSchema.extend({
  questions: z.array(QuestionSchema),
});
export type QuizWithQuestionsDto = z.infer<typeof QuizWithQuestionsSchema>;
