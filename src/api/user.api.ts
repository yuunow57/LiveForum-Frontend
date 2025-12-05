import { api } from "./axios";

export const fetchMyInfo = () => api.get("/user/me");
export const fetchMyPosts = () => api.get("/user/me/posts");
export const fetchMyComments = () => api.get("/user/me/comments");
