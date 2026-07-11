import type { LoggedUserDto, LoginUserDto } from "@infinite-quiz/common";
import { baseApi } from "../../shared/ui/api";

export const loginApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation<LoggedUserDto, LoginUserDto>({
      query: (loginData) => ({
        url: "/users/login",
        method: "POST",
        body: loginData,
      }),
    }),
  }),
});
export const { useLoginUserMutation } = loginApi;
