import type { UserWithTokenDto, UserDto } from "@infinite-quiz/common";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CurrentUserState {
  token: string | null;
  info: {
    id: string;
    email: string;
    name: string;
    avatar: string;
    role: string;
  } | null;
}

const initialState: CurrentUserState = {
  token: localStorage.getItem("token"),
  info: null,
};

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserWithTokenDto>) => {
      const { token, ...userInfo } = action.payload;
      state.token = token;
      state.info = userInfo;
      localStorage.setItem("token", token);
    },
    setCurrentUserInfo: (state, action: PayloadAction<UserDto>) => {
      state.info = action.payload;
    },
    setToken: (state, action: { payload: string }) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    clearCurrentUser: (state) => {
      state.token = null;
      state.info = null;
      localStorage.removeItem("token");
    },
  },
});

export const {
  setCurrentUser,
  setCurrentUserInfo,
  setToken,
  clearCurrentUser,
} = currentUserSlice.actions;
export const currentUserReducer = currentUserSlice.reducer;
