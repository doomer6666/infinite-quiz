import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");

    const token = localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/users/refresh",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const data = refreshResult.data as { token: string };
      localStorage.setItem("token", data.token);

      result = await baseQuery(args, api, extraOptions);
    } else {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["CurrentUser", "QuizList", "CurrentQuiz"],
  endpoints: (build) => ({
    refreshToken: build.mutation<{ token: string }, void>({
      query: () => ({
        url: "/users/refresh",
        method: "POST",
      }),
    }),
  }),
});

export const { useRefreshTokenMutation } = baseApi;
