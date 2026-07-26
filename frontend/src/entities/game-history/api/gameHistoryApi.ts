import { baseApi } from "@/shared/index";
import type { GameHistory } from "@infinite-quiz/common";

export const gameHistoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyHistory: builder.query<GameHistory[], void>({
      query: () => "/history/my",
    }),
    getAllHistory: builder.query<GameHistory[], void>({
      query: () => "/history",
    }),
  }),
});

export const { useGetMyHistoryQuery, useGetAllHistoryQuery } = gameHistoryApi;
