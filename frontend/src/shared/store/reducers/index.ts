import { combineReducers, type Reducer } from "@reduxjs/toolkit";

const reducers = {};
const combinedReducer = combineReducers(reducers);

export type RootState = ReturnType<typeof combinedReducer>;

export const rootReducer: Reducer = (state: RootState, action: never) => {
  if (action.type === "RESET_STORE") {
    return combinedReducer(undefined, action);
  }
  return combinedReducer(state, action);
};
