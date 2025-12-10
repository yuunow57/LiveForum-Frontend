import { api } from "./axios";

// 좋아요 토글
export const toggleLike = async (targetId: number, targetType: "post" | "comment") => {
  return api.post("/likes", { targetId, targetType });
};

// 좋아요 개수 조회
export const getLikeCount = (targetId: number, targetType: "post" | "comment") => {
  return api.post("/likes/count", { targetId, targetType });
};

// 현재 유저가 좋아요 눌렀는지
export const checkLiked = (targetId: number, targetType: "post" | "comment") => {
  return api.post("/likes/isLiked", { targetId, targetType });
};
