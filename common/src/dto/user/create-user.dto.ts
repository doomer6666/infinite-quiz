import { z } from "zod";
import { UserRoleEnum } from "../../enums/index.js";

export const CreateUserSchema = z.object({
  email: z.string(),
  name: z.string(),
  password: z.string().min(6),
  avatar: z.string().optional(),
  role: z.enum(UserRoleEnum),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
