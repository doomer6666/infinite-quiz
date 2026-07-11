import z from "zod";
import { UserRoleEnum } from "../../enums/index";

export const UserDtoShema = z.object({
  id: z.string(),
  email: z.string(),
  avatar: z.string(),
  role: z.enum(UserRoleEnum),
  name: z.string(),
  password: z.string(),
});

export type UserDto = z.infer<typeof UserDtoShema>;
