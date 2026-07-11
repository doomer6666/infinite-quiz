import { baseApi } from "../../shared/ui/api";
import type { CreateUserDto, LoggedUserDto } from "@infinite-quiz/common";

export const registrationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createUser: build.mutation<LoggedUserDto, CreateUserDto>({
      query: (userData) => ({
        url: "/users/register",
        method: "POST",
        body: userData,
      }),

      invalidatesTags: ["User"],
    }),
  }),
});

export const { useCreateUserMutation } = registrationApi;
