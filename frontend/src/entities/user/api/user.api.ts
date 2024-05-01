import { api } from "@/helpers/api";
import { getItem } from "@/helpers/localStorage";
import { IUser } from "@/shared/interfaces/user.interface";

export const getCurrentUser = async () => {
  if (!getItem("token")) {
    throw new Error("token must be provided");
  }
  const { data } = await api.get("user/me");
  return data;
};
export const fetchMe = async () => {};
export const updateMe = async () => {};
export async function getUsers(): Promise<{
  data: { users: IUser[] };
}> {
  return api.get("user");
}
