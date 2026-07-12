import type { UserWithTokenDto, LoginUserDto } from "@infinite-quiz/common";
import { baseApi } from "@/shared/api";

export const loginApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation<UserWithTokenDto, LoginUserDto>({
      query: (loginData) => ({
        url: "/users/login",
        method: "POST",
        body: loginData,
      }),
    }),
  }),
});
export const { useLoginUserMutation } = loginApi;
