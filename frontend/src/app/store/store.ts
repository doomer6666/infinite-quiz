import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../../shared/api";
import { setupListeners } from "@reduxjs/toolkit/query";
import { errorLoggerMiddleware } from "./middlewares/errorLoggerMiddleware";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(errorLoggerMiddleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
