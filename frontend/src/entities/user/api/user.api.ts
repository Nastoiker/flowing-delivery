import { api } from "@/helpers/api";

export const getCurrentUser = async () => {
  const { data } = await api.get("auth/authByJwt");
  return data;
};
export const fetchMe = async () => {};
export const updateMe = async () => {};
