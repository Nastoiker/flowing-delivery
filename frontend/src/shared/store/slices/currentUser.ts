import { getCurrentUser } from "@/entities/user/api/user.api";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
enum USER_ROLES {}
interface UserAttributes {
  id: number;
  email: string | null;
  password: string | null;
  roles: USER_ROLES | null;
  username: string;
  name: string;
  surname: string;
}

export type CurrentUserState = UserAttributes & {
  profile: Record<string, unknown>;
};

const initialState: CurrentUserState = {
  profile: {},
};

export const fetchCurrentUser = createAsyncThunk(
  "currentUser/fetchCurrentUser",
  async () => {
    try {
      const data = await getCurrentUser();
      console.log(data.profile);
      return data.profile;
    } catch (error) {
      console.log(error);
      throw new Error(error?.response?.data?.message);
    }
  }
);

// export const updateCurrentUser = createAsyncThunk(
//   "currentUser/updateCurrentUser",
//   async (body: any) => {
//     try {
//       return await updateMe(body);
//     } catch (error) {
//       throw new Error(error?.response?.data?.message);
//     }
//   }
// );

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUser: (_, action: PayloadAction<CurrentUserState>) =>
      action.payload,
    removeCurrentUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchCurrentUser.fulfilled,
      (state, { payload }) => payload
    );
  },
});

export const { setCurrentUser, removeCurrentUser } = currentUserSlice.actions;

export default currentUserSlice.reducer;
