import z from "zod";

export const UpdateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().optional(),
  password: z.string().min(6).optional(),
  avatar: z.string().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
