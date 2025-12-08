import { api } from "./axios";

export const fetchPosts = ({
  boardId,
  page,
  sort,
}: {
  boardId: string;
  page: number;
  sort: string;
}) =>
  api.get("/posts", {
    params: {
      boardId,
      page,
      sort,
    },
  });

export const fetchPost = (id: number) =>
  api.get(`/posts/${id}`);

export const createPost = (dto: {
  title: string;
  content: string;
  boardId: number;
}) => api.post("/posts", dto);
