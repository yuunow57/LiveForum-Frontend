import { api } from "./axios";

export const registerRequest = (data: {
  email: string;
  password: string;
  nickname: string;
}) => api.post("/auth/register", data);

export const loginRequest = (data: {
  email: string;
  password: string;
}) =>
  api.post("/auth/login", data);
