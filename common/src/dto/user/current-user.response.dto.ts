import z from "zod";
import { UserRoleEnum } from "../../enums/index.js";

export const UserSсhema = z.object({
  id: z.string(),
  email: z.string(),
  avatar: z.string(),
  role: z.enum(UserRoleEnum),
  name: z.string(),
});
export type UserDto = z.infer<typeof UserSсhema>;

export const UserWithTokenSсhema = UserSсhema.extend({
  token: z.string(),
});
export type UserWithTokenDto = z.infer<typeof UserWithTokenSсhema>;
