import { baseApi } from "@/shared/api";
import type {
  CreateUserDto,
  LoginUserDto,
  PublicUserDto,
  UserDto,
  UserWithTokenDto,
} from "@infinite-quiz/common";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createUser: build.mutation<UserWithTokenDto, CreateUserDto>({
      query: (userData) => ({
        url: "/users/register",
        method: "POST",
        body: userData,
      }),

      invalidatesTags: ["CurrentUser"],
    }),
    loginUser: build.mutation<UserWithTokenDto, LoginUserDto>({
      query: (loginData) => ({
        url: "/users/login",
        method: "POST",
        body: loginData,
      }),
    }),
    getUserById: build.query<PublicUserDto, string>({
      query: (id) => `users/${id}`,
    }),
    me: build.query<UserDto, void>({
      query: () => "/users/me",
      providesTags: ["CurrentUser"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useLoginUserMutation,
  useGetUserByIdQuery,
  useMeQuery,
} = userApi;
