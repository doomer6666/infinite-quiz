import z from "zod";
import { CreateQuizSchema } from "./create-quiz.dto";

export const UpdateQuizSchema = CreateQuizSchema.partial();

export type UpdateQuizDto = z.infer<typeof UpdateQuizSchema>;
