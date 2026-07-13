import { baseApi } from "@/shared/api";
import type { PublicUserDto } from "@infinite-quiz/common";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserById: build.query<PublicUserDto, string>({
      query: (id) => `users/${id}`,
    }),
  }),
});

export const { useGetUserByIdQuery } = userApi;
