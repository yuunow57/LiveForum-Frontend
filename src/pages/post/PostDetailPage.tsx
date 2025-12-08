import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPost } from "../../api/post.api";
import { fetchComments, createComment } from "../../api/comment.api";
import { useAuthStore } from "../../store/auth.store";

export default function PostDetailPage() {
  const { postId } = useParams();
  const { accessToken } = useAuthStore();

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]); // ⭐ 배열로 초기화
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    if (!postId) return;
    loadPost();
    loadComments();
  }, [postId]);

  const loadPost = async () => {
    try {
      const res = await fetchPost(Number(postId));
      const postData = res.data.data ?? res.data;
      setPost(postData);
    } catch (error) {
      console.error("게시글 가져오기 실패:", error);
    }
  };

  const loadComments = async () => {
    try {
      const res = await fetchComments(Number(postId));
      const commentData = res.data.data ?? res.data ?? [];
      setComments(Array.isArray(commentData) ? commentData : []);
    } catch (error) {
      console.error("댓글 가져오기 실패:", error);
      setComments([]); // 실패시 빈 배열
    }
  };

  const handleCreateComment = async () => {
    if (!accessToken) return alert("로그인이 필요합니다!");
    if (!commentInput.trim()) return;

    try {
      await createComment({
        postId: Number(postId),
        content: commentInput,
      });

      setCommentInput("");
      loadComments(); 
    } catch (error) {
      console.error(error);
      alert("댓글 작성 실패");
    }
  };

  if (!post) return <p className="text-gray-400">게시글을 불러오는 중...</p>;

  return (
    <div className="text-white space-y-6">
      {/* 제목 */}
      <h2 className="text-3xl font-bold">{post.title}</h2>

      {/* 내용 */}
      <p className="text-gray-300 whitespace-pre-line">{post.content}</p>

      <hr className="border-gray-700" />

      {/* 댓글 목록 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">💬 댓글</h3>

        {comments.length === 0 ? (
          <p className="text-gray-500">댓글이 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {comments.map((c: any) => (
              <li key={c.id} className="p-3 bg-[#1e1f25] rounded-md">
                <p className="text-sm text-gray-300">{c.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {c.user?.nickname ?? "알 수 없음"} ·{" "}
                  {new Date(c.createAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 댓글 입력 */}
      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded bg-gray-800 outline-none"
          placeholder="댓글을 입력하세요"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <button
          onClick={handleCreateComment}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
        >
          작성
        </button>
      </div>
    </div>
  );
}
