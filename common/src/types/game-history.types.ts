import z from "zod";

export const GameHistorySchema = z.object({
  _id: z.string().optional(),
  quizId: z.string(),
  quizTitle: z.string(),
  hostId: z.string(),
  hostName: z.string(),
  players: z.array(
    z.object({
      userId: z.string(),
      name: z.string(),
      avatar: z.string(),
      score: z.number(),
      place: z.number(),
    }),
  ),
  questionCount: z.number(),
  totalPoints: z.number(),
  duration: z.number(),
  playedAt: z.string(),
});

export type GameHistory = z.infer<typeof GameHistorySchema>;

export const CreateGameHistorySchema = GameHistorySchema.omit({ _id: true });
export type CreateGameHistoryDto = z.infer<typeof CreateGameHistorySchema>;

export const GameHistoryResponseSchema = GameHistorySchema;
export type GameHistoryResponseDto = z.infer<typeof GameHistoryResponseSchema>;
