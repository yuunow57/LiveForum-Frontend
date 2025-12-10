import  { useEffect, useState } from "react";
import { fetchComments } from "../../api/comment.api";
import CommentItem from "../CommentItem";

interface CommentListProps {
  postId: number;
  reloadKey?: number; // 부모에서 변경되면 다시 불러옴
}

export default function CommentList({ postId, reloadKey }: CommentListProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadComments = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const res = await fetchComments(postId);
      // backend 응답 형식: res.data.data OR res.data
      const data = res.data?.data ?? res.data ?? [];
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("댓글 로드 실패:", err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, reloadKey]);

  return (
    <div className="bg-[#1f2024] p-5 rounded-lg space-y-3 mt-6">
      <h3 className="font-semibold text-lg">💬 댓글</h3>

      {loading ? (
        <p className="text-gray-400 text-sm">댓글 불러오는 중...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-sm">댓글이 없습니다.</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="border-b border-gray-700 pb-3">
            <CommentItem comment={c} onReload={loadComments} />
          </div>
        ))
      )}
    </div>
  );
}
