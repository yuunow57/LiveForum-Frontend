import { api } from "./axios";

export const registerRequest = (data: {
  username: string;
  email: string;
  password: string;
}) => api.post("/auth/register", data);

export const loginRequest = (data: {
  email: string;
  password: string;
}) =>
  api.post("/auth/login", data);
