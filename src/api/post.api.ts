// src/api/post.api.ts
import { api } from "./axios";

/* ===================== 조회 ===================== */

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
    params: { boardId, page, sort },
  });

export const fetchPost = (id: number) =>
  api.get(`/posts/${id}`);

/* ===================== 작성 ===================== */

export const createPost = (dto: {
  title: string;
  content: string;
  boardId: number;
}) => {
  const formData = new FormData();

  formData.append("title", dto.title);
  formData.append("content", dto.content);
  formData.append("boardId", String(dto.boardId));

  return api.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ===================== 수정 ===================== */

export const updatePost = (
  id: number,
  dto: {
    title?: string;
    content?: string;
    keepImageIds?: number[];
  }
) => {
  const formData = new FormData();

  if (dto.title !== undefined) {
    formData.append("title", dto.title);
  }

  if (dto.content !== undefined) {
    formData.append("content", dto.content);
  }

  // 🔥 배열은 반드시 하나씩 append
  if (dto.keepImageIds && dto.keepImageIds.length > 0) {
    dto.keepImageIds.forEach((imageId) => {
      formData.append("keepImageIds[]", String(imageId));
    });
  }

  return api.patch(`/posts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ===================== 삭제 ===================== */

export const deletePost = (id: number) =>
  api.delete(`/posts/${id}`);
