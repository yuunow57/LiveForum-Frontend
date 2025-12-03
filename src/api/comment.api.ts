import { api } from "./axios";

export const fetchComments = (postId: string) =>
  api.get(`/comment/${postId}`);

export const createComment = (postId: string, content: string) =>
  api.post(`/comment/${postId}`, { content });
