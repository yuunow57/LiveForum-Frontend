import { useEffect, useState } from "react";
import { fetchComments } from "../../api/comment.api";

interface CommentListProps {
  postId: number;
  reloadKey: number; // 변경되면 다시 불러옴
}

export default function CommentList({ postId, reloadKey }: CommentListProps) {
  const [comments, setComments] = useState<any[]>([]);

  const loadComments = async () => {
    try {
      const res = await fetchComments(postId);
      const data = res.data?.data ?? res.data ?? [];
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("댓글 로드 실패:", err);
    }
  };

  useEffect(() => {
    if (postId) loadComments();
  }, [postId, reloadKey]);

  return (
    <div className="bg-[#1f2024] p-5 rounded-lg space-y-3 mt-6">
      <h3 className="font-semibold text-lg">💬 댓글</h3>

      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm">댓글이 없습니다.</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="border-b border-gray-700 pb-2">
            <p className="text-gray-200">{c.content}</p>
            <span className="text-gray-500 text-xs">
              {c.user?.nickname ?? "익명"} ·{" "}
              {new Date(c.createAt).toLocaleString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
