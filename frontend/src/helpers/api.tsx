import type { AxiosHeaders } from "axios";
import axios from "axios";
import { getItem } from "./localStorage";
const PREFIX = "http://localhost:3444/api/" as const;
export const api = axios.create({
  baseURL: PREFIX,
  paramsSerializer: {
    indexes: true,
  },
  validateStatus: (v) => v < 400,
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  (config.headers as AxiosHeaders).set(
    "Authorization",
    `Bearer ${getItem("token")}`
  );

  return config;
});
