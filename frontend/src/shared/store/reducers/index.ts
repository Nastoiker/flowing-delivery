import { combineReducers } from "@reduxjs/toolkit";
import currentUser from "../slices/currentUser";

const reducers = { currentUser };
const combinedReducer = combineReducers(reducers);

export type RootState = ReturnType<typeof combinedReducer>;

// export const rootReducer: Reducer = (state: RootState, action: never) => {
//   // if (action.type === "RESET_STORE") {
//   //   return combinedReducer(undefined, action);
//   // }
//   return combinedReducer(state, action);
// };
