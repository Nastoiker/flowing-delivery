import { getItem } from "@/helpers/localStorage";
import type { AxiosHeaders } from "axios";
import axios from "axios";
export const PREFIX = "http://localhost:3444/api" as const;
const instance = axios.create({
  baseURL: PREFIX,
  paramsSerializer: {
    indexes: true,
  },
  validateStatus: (v) => v < 400,
  withCredentials: true,
});
instance.interceptors.request.use((config) => {
  (config.headers as AxiosHeaders).set(
    "Authorization",
    `Bearer ${getItem("token")}`
  );

  return config;
});
export const dev = "dev";
export default instance;
