import z from "zod";

export const PublicUserShema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
});

export type PublicUserDto = z.infer<typeof PublicUserShema>;
