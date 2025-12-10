import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPost } from "../../api/post.api";
import { fetchComments, createComment } from "../../api/comment.api";
import { toggleLike, getLikeCount, checkLiked } from "../../api/like.api";
import { useAuthStore } from "../../store/auth.store";

export default function PostDetailPage() {
  const { postId } = useParams();
  const { isAuthenticated } = useAuthStore();

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [likeCount, setLikeCount] = useState(0); // 게시글 좋아요 수
  const [isLiked, setIsLiked] = useState(false); // 게시글 좋아요 여부
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (!postId) return;

    loadPost();
    loadComments();
    loadLikeCount();

    if (isAuthenticated) {
      loadIsLiked(); // 게시글 좋아요 최초 상태 반영
    }
  }, [postId, isAuthenticated]);

  // 게시글 정보
  const loadPost = async () => {
    try {
      const res = await fetchPost(Number(postId));
      setPost(res.data.data ?? res.data);
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
    }
  };

  // 댓글 + 각 댓글 좋아요 정보
  const loadComments = async () => {
    try {
      const res = await fetchComments(Number(postId));
      const base = res.data.data ?? res.data ?? [];
      const list = Array.isArray(base) ? base : [];

      if (list.length === 0) {
        setComments([]);
        return;
      }

      // 댓글별 좋아요 수 + 내가 눌렀는지 여부까지 붙이기
      const enriched = await Promise.all(
        list.map(async (c: any) => {
          try {
            const likeRes = await getLikeCount(c.id, "comment");
            const count = likeRes.data.data?.count ?? 0;

            let liked = false;
            if (isAuthenticated) {
              const likedRes = await checkLiked(c.id, "comment");
              liked = likedRes.data.data?.liked ?? likedRes.data.liked ?? false;
            }

            return { ...c, likeCount: count, isLiked: liked };
          } catch {
            return { ...c, likeCount: 0, isLiked: false };
          }
        })
      );

      setComments(enriched);
    } catch (err) {
      console.error("댓글 불러오기 실패:", err);
      setComments([]);
    }
  };

  // 게시글 좋아요 수
  const loadLikeCount = async () => {
    const res = await getLikeCount(Number(postId), "post");
    setLikeCount(res.data.data?.count ?? 0);
  };

  // 게시글 좋아요 여부
  const loadIsLiked = async () => {
    try {
      const res = await checkLiked(Number(postId), "post");
      setIsLiked(res.data.data?.liked ?? res.data.liked ?? false);
    } catch (err) {
      console.error("좋아요 여부 확인 실패:", err);
    }
  };

  // 게시글 좋아요 토글
  const onToggleLike = async () => {
    if (!isAuthenticated) return alert("로그인이 필요합니다.");

    const res = await toggleLike(Number(postId), "post");
    const updated = res.data.data;

    setLikeCount(updated.likeCount);
    setIsLiked(updated.liked);
  };

  // 댓글 좋아요 토글
  const onToggleCommentLike = async (commentId: number) => {
    if (!isAuthenticated) return alert("로그인이 필요합니다.");

    try {
      const res = await toggleLike(commentId, "comment");
      const updated = res.data.data;

      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                likeCount: updated.likeCount,
                isLiked: updated.liked,
              }
            : c
        )
      );
    } catch (err) {
      console.error("댓글 좋아요 실패:", err);
      alert("댓글 좋아요 실패");
    }
  };

  // 댓글 작성
  const onSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return alert("로그인이 필요합니다.");

    await createComment({
      postId: Number(postId),
      content: commentText,
    });

    setCommentText("");
    await loadComments(); // 새 댓글 + 댓글 좋아요까지 다시 로딩
  };

  if (!post) return <p className="text-gray-400">게시글 불러오는 중...</p>;

  return (
    <div className="text-white space-y-6">
      <h2 className="text-3xl font-bold">{post.title}</h2>

      <div className="text-gray-400 text-sm">
        ✍ 작성자: {post.author?.username ?? "알 수 없음"}
      </div>

      <p className="bg-[#1c1d22] p-5 rounded-lg leading-7 whitespace-pre-line">
        {post.content}
      </p>

      {/* 👍 게시글 좋아요 버튼 */}
      <button
        onClick={onToggleLike}
        className={`px-4 py-2 rounded font-semibold transition ${
          isLiked ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLiked ? "❤️ 좋아요 취소" : "👍 좋아요"} {likeCount}
      </button>

      <h3 className="text-xl mt-10 mb-4">💬 댓글</h3>

      <ul className="space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="bg-[#1a1b1f] p-4 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400 text-sm">
                {c.author?.username ?? "알 수 없음"}
              </span>

              {/* 👍 댓글 좋아요 버튼 */}
              <button
                onClick={() => onToggleCommentLike(c.id)}
                className={`text-xs px-3 py-1 rounded transition ${
                  c.isLiked ? "bg-red-500" : "bg-gray-700"
                }`}
              >
                👍 {c.likeCount ?? 0}
              </button>
            </div>
            <p>{c.content}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={onSubmitComment} className="space-y-3 mt-6">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="w-full p-3 bg-gray-800 rounded"
          rows={3}
        />
        <button className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">
          댓글 작성
        </button>
      </form>
    </div>
  );
}
