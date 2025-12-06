import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/axios";
import { fetchComments, createComment } from "../../api/comment.api";
import { socket } from "../../socket/socket";
import { useAuthStore } from "../../store/auth.store";
import CommentItem from "../../components/CommentItem";
import Loading from "../../components/Loading";

export default function PostDetailPage() {
  const { postId } = useParams();
  const { accessToken } = useAuthStore();
  
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState("");

  const loadPost = async () => {
    const res = await api.get(`/post/${postId}`);
    setPost(res.data.data);
  };

  const loadComments = async () => {
    const res = await fetchComments(postId!);
    setComments(res.data.data);
  };

  const sendComment = async () => {
    await createComment(postId!, content);
    setContent("");
  };

  useEffect(() => {
    loadPost();
    loadComments();
  }, [postId]);

  // WebSocket 연결 + 실시간 댓글 반영
  useEffect(() => {
    socket.connect();
    socket.emit("join_post", postId);

    socket.on("comment_added", (data) => {
      setComments((prev) => [...prev, data]);
    });

    return () => {
      socket.emit("leave_post", postId);
      socket.removeAllListeners();
    };
  }, [postId]);

  if (!post) return <Loading />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{post.title}</h2>
      <p className="text-gray-400 mb-8">{post.content}</p>

      <h3 className="text-lg font-semibold mb-4">댓글</h3>

      {/* 댓글 목록 */}
      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="p-3 rounded bg-[#1b1c22] border border-gray-700">
            <span className="text-sm text-gray-400">{c.user.nickname}:</span>
            <p>{c.content}</p>
          </div>
        ))}
        {comments.map((c) => (
          <CommentItem key={c.id} c={c} />
        ))}
      </div>

      {/* 댓글 입력 */}
      {accessToken ? (
        <div className="mt-6 flex gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-gray-800 outline-none"
            placeholder="댓글을 입력하세요"
          />
          <button onClick={sendComment} className="px-4 bg-blue-600 rounded">작성</button>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">로그인 후 댓글 작성 가능</p>
      )}
    </div>
  );
}
