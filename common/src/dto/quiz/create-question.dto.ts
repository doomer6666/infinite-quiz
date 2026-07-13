import z from "zod";

export const CreateQuestionSchema = z.object({
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
});

export type CreateQuestionDto = z.infer<typeof CreateQuestionSchema>;
