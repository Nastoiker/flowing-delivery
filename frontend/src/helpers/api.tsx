import type { AxiosHeaders } from "axios";
import axios from "axios";
const PREFIX = "http://localhost:3444/api/";
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
    `Bearer ${localStorage.getItem("token")}`
  );

  return config;
});
