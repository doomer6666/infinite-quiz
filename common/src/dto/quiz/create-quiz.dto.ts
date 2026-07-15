import z from "zod";
import { QuizCategoryEnum, QuizStatusEnum } from "../../types/index";

export const CreateQuizSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  imageFilename: z.string().optional(),
  category: z.enum(QuizCategoryEnum).optional(),
  status: z.enum(QuizStatusEnum),
  questions: z
    .array(
      z.object({
        text: z.string().min(1, "Вопрос не может быть пустым"),
        points: z.number().min(1),
        timeLimit: z.number().min(1),
        answers: z
          .array(
            z.object({
              text: z.string().min(1, "Ответ не может быть пустым"),
              isCorrect: z.boolean(),
            }),
          )
          .min(2, "Минимум 2 варианта ответа"),
      }),
    )
    .optional(),
});

export type CreateQuizDto = z.infer<typeof CreateQuizSchema>;
