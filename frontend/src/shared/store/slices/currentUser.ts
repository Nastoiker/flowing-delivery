import { fetchMe, updateMe } from "@/entities/user/api/user.api";
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
  createdAt?: Date;
  updatedAt?: Date;
  Role: {
    id: number;
    name: string;
  } | null;
};

// FIXME: Старый initial state
const initialState: CurrentUserState = {
  createdAt: undefined,
  email: "",
  id: 0,
  password: "",

  updatedAt: undefined,

  roles: null,
};

export const fetchCurrentUser = createAsyncThunk(
  "currentUser/fetchCurrentUser",
  async () => {
    try {
      const { user } = await fetchMe();

      return user;
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  }
);

export const updateCurrentUser = createAsyncThunk(
  "currentUser/updateCurrentUser",
  async (body: any) => {
    try {
      return await updateMe(body);
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  }
);

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
    builder.addCase(updateCurrentUser.fulfilled, (state, { payload }) => ({
      ...state,
      ...payload,
    }));
  },
});

export const { setCurrentUser, removeCurrentUser } = currentUserSlice.actions;

export default currentUserSlice.reducer;
