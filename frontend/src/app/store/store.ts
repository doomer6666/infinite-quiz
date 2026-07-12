import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../../shared/ui/api";
import { setupListeners } from "@reduxjs/toolkit/query";
import { currentUserSlice } from "../../entities/user/index";

export const store = configureStore({
  reducer: {
    currentUser: currentUserSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
