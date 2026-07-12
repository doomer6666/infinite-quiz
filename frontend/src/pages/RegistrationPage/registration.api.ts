import { baseApi } from "@/shared/api";
import type { CreateUserDto, UserWithTokenDto } from "@infinite-quiz/common";

export const registrationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createUser: build.mutation<UserWithTokenDto, CreateUserDto>({
      query: (userData) => ({
        url: "/users/register",
        method: "POST",
        body: userData,
      }),

      invalidatesTags: ["CurrentUser"],
    }),
  }),
});

export const { useCreateUserMutation } = registrationApi;
