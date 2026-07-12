import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {
  clearCurrentUser,
  setCurrentUserInfo,
  setToken,
} from "../entities/user/index";
import type { UserDto } from "@infinite-quiz/common";

const baseUrl = import.meta.env.VITE_BASE_URL;
interface StateWithToken {
  currentUser: {
    token: string | null;
  };
}

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");
    const state = getState() as StateWithToken;
    const token = state.currentUser.token;

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
      const newToken = data.token;

      api.dispatch(setToken(newToken));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCurrentUser());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["CurrentUser"],
  endpoints: (build) => ({
    refreshToken: build.mutation<{ token: string }, void>({
      query: () => ({
        url: "/users/refresh",
        method: "POST",
      }),
    }),
    me: build.query<UserDto, void>({
      query: () => "users/me",
      providesTags: ["CurrentUser"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCurrentUserInfo(data));
        } catch {
          dispatch(clearCurrentUser());
        }
      },
    }),
  }),
});

export const { useRefreshTokenMutation, useMeQuery } = baseApi;
