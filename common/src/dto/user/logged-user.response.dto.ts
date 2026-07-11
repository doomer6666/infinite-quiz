import z from "zod";
import { UserRoleEnum } from "../../enums/index.js";

export const LoggedUserSсhema = z.object({
  token: z.string(),
  id: z.string(),
  email: z.string(),
  avatar: z.string(),
  role: z.enum(UserRoleEnum),
  name: z.string(),
});

export type LoggedUserDto = z.infer<typeof LoggedUserSсhema>;
