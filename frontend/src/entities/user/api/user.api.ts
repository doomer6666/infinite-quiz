import { baseApi } from "@/shared/api";
import type {
  CreateUserDto,
  LoginUserDto,
  PublicUserDto,
  UpdateUserDto,
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
    logoutUser: build.mutation<void, string>({
      query: (token) => ({
        url: "/users/logout",
        method: "POST",
        body: token,
      }),
    }),
    getUserById: build.query<PublicUserDto, string>({
      query: (id) => `users/${id}`,
    }),
    me: build.query<UserDto, void>({
      query: () => "/users/me",
      providesTags: ["CurrentUser"],
    }),

    updateUser: build.mutation<
      PublicUserDto,
      { id: string; data: UpdateUserDto }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CurrentUser"],
    }),

    uploadAvatar: build.mutation<PublicUserDto, { id: string; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("avatar", file);
        return {
          url: `/users/${id}/avatar`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["CurrentUser"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useLoginUserMutation,
  useGetUserByIdQuery,
  useMeQuery,
  useLogoutUserMutation,
  useUpdateUserMutation,
  useUploadAvatarMutation,
} = userApi;
