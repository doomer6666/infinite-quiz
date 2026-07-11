import z from "zod";

export const LoginUserShema = z.object({
  email: z.string(),
  password: z.string().min(6),
});

export type LoginUserDto = z.infer<typeof LoginUserShema>;
