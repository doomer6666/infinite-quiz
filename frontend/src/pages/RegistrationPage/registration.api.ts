import { baseApi } from "../../shared/ui/api";
import type { CreateUserDto, UserDto } from "@infinite-quiz/common";

export const registrationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createUser: build.mutation<UserDto, CreateUserDto>({
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
