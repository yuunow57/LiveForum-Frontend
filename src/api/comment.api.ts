import { api } from "./axios";

export const fetchComments = (postId: number) =>
  api.get(`/comments/${postId}`);

export const createComment = ({
  postId,
  content,
}: {
  postId: number;
  content: string;
}) =>
  api.post("/comments", { postId, content });
