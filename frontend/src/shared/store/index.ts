import type { Dispatch } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/currentUser";

// When you want add middlewares see https://redux-toolkit.js.org/api/getDefaultMiddleware
export const store = configureStore({
  reducer: {
    currentUser: userSlice,
    // cart: cartSlice
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    // Этот middleware для того, чтобы убрать ворнинги о несерелизуемых объектах
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "chatUnreadMessagesCount/setUnreadMessagesCount/fulfilled",
        ],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;

// костыль
export const dispatchStore = store.dispatch as Dispatch<any>;
