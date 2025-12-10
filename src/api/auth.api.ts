import { api } from "./axios";

export const loginRequest = (dto: { email: string; password: string }) =>
  api.post("/auth/login", dto);

export const registerRequest = (dto: {
  email: string;
  username: string;
  password: string;
}) => api.post("/auth/register", dto);

// 새로 추가된 사용자 조회 API
export const fetchMe = () => api.get("/auth/me");
