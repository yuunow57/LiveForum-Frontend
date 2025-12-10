import React, { useState } from "react";
import { createComment } from "../../api/comment.api";
import { useAuthStore } from "../../store/auth.store";

interface CommentFormProps {
  postId: number;
  onSuccess: () => void; // 성공 시 부모에게 알려주기
}

export default function CommentForm({ postId, onSuccess }: CommentFormProps) {
  const { accessToken } = useAuthStore();
  const [content, setContent] = useState("");

  if (!accessToken)
    return <p className="text-gray-500 text-sm">로그인 후 댓글 작성 가능</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await createComment({postId, content});
      setContent("");
      onSuccess(); // 부모에서 reloadKey 올리게 함
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 bg-[#2b2c30] text-white p-2 rounded"
        placeholder="댓글을 입력하세요..."
      />
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 px-4 rounded text-sm font-semibold"
      >
        등록
      </button>
    </form>
  );
}
