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
  api.get("/post", {
    params: { boardId, page, sort },
  });
