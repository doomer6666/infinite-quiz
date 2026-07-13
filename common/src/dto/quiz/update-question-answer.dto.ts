import z from "zod";
import { CreateQuestionSchema } from "./create-question.dto";

export const UpdateQuestionSchema = CreateQuestionSchema.partial().extend({
  imageFilename: z.string().optional(),
});

export type UpdateQuestionDto = z.infer<typeof UpdateQuestionSchema>;

export const UpdateAnswerSchema = z.object({
  text: z.string().min(1).optional(),
  isCorrect: z.boolean().optional(),
});

export type UpdateAnswerDto = z.infer<typeof UpdateAnswerSchema>;
