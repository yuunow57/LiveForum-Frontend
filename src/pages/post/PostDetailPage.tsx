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

  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (!postId) return;

    loadPost();
    loadComments();
    loadPostLike();

    if (isAuthenticated) {
      loadPostLiked();
    }
  }, [postId, isAuthenticated]);

  /* ---------------- 게시글 ---------------- */

  const loadPost = async () => {
    try {
      const res = await fetchPost(Number(postId));
      setPost(res.data.data ?? res.data);
    } catch (e) {
      console.error("게시글 로딩 실패", e);
    }
  };

  const loadPostLike = async () => {
    const res = await getLikeCount(Number(postId), "post");
    setLikeCount(res.data.data?.count ?? 0);
  };

  const loadPostLiked = async () => {
    try {
      const res = await checkLiked(Number(postId), "post");
      setIsLiked(res.data.data?.liked ?? false);
    } catch {}
  };

  const togglePostLike = async () => {
    if (!isAuthenticated) return alert("로그인이 필요합니다.");

    const res = await toggleLike(Number(postId), "post");
    const data = res.data.data;

    setLikeCount(data.likeCount);
    setIsLiked(data.liked);
  };

  /* ---------------- 댓글 ---------------- */

  const loadComments = async () => {
    try {
      const res = await fetchComments(Number(postId));
      const base = res.data.data ?? res.data ?? [];

      const enriched = await Promise.all(
        base.map(async (c: any) => {
          try {
            const countRes = await getLikeCount(c.id, "comment");
            const count = countRes.data.data?.count ?? 0;

            let liked = false;
            if (isAuthenticated) {
              const likedRes = await checkLiked(c.id, "comment");
              liked = likedRes.data.data?.liked ?? false;
            }

            return { ...c, likeCount: count, isLiked: liked };
          } catch {
            return { ...c, likeCount: 0, isLiked: false };
          }
        })
      );

      setComments(enriched);
    } catch (e) {
      console.error("댓글 로딩 실패", e);
      setComments([]);
    }
  };

  const toggleCommentLike = async (commentId: number) => {
    if (!isAuthenticated) return alert("로그인이 필요합니다.");

    try {
      const res = await toggleLike(commentId, "comment");
      const data = res.data.data;

      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, likeCount: data.likeCount, isLiked: data.liked }
            : c
        )
      );
    } catch (e) {
      console.error("댓글 좋아요 실패", e);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return alert("로그인이 필요합니다.");
    if (!commentText.trim()) return;

    await createComment({
      postId: Number(postId),
      content: commentText,
    });

    setCommentText("");
    loadComments();
  };

  if (!post) {
    return <p className="text-gray-400">게시글을 불러오는 중...</p>;
  }

  return (
    <div className="text-white space-y-6 max-w-4xl mx-auto">
      {/* 제목 */}
      <h1 className="text-3xl font-bold">{post.title}</h1>

      {/* 작성자 */}
      <div className="text-sm text-gray-400">
        ✍ {post.author?.username ?? "알 수 없음"} ·{" "}
        {new Date(post.createAt).toLocaleString()}
      </div>

      {/* 본문 (HTML 렌더링) */}
      <div
        className="prose prose-invert max-w-none bg-[#1c1d22] p-5 rounded"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 게시글 좋아요 */}
      <button
        onClick={togglePostLike}
        className={`px-4 py-2 rounded font-semibold ${
          isLiked ? "bg-red-600" : "bg-blue-600"
        }`}
      >
        {isLiked ? "❤️ 좋아요 취소" : "👍 좋아요"} {likeCount}
      </button>

      {/* 댓글 */}
      <h3 className="text-xl mt-10">💬 댓글</h3>

      <ul className="space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="bg-[#1a1b1f] p-4 rounded">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-400">
                {c.author?.username ?? "알 수 없음"}
              </span>

              <button
                onClick={() => toggleCommentLike(c.id)}
                className={`text-xs px-3 py-1 rounded ${
                  c.isLiked ? "bg-red-500" : "bg-gray-700"
                }`}
              >
                👍 {c.likeCount}
              </button>
            </div>

            <p className="whitespace-pre-line">{c.content}</p>
          </li>
        ))}
      </ul>

      {/* 댓글 작성 */}
      <form onSubmit={submitComment} className="space-y-3">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded"
          rows={3}
          placeholder="댓글을 입력하세요"
        />
        <button className="px-4 py-2 bg-green-600 rounded">
          댓글 작성
        </button>
      </form>
    </div>
  );
}
