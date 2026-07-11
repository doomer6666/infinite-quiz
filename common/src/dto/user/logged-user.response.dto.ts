import z from "zod";

export const LoggedUserShema = z.object({
  token: z.string(),
  email: z.string(),
});

export type LoggedUserDto = z.infer<typeof LoggedUserShema>;
