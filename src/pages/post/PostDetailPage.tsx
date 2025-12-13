// src/pages/post/PostDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPost, deletePost } from "../../api/post.api";
import { fetchComments, createComment } from "../../api/comment.api";
import { toggleLike, getLikeCount, checkLiked } from "../../api/like.api";
import { useAuthStore } from "../../store/auth.store";

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

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

    if (isAuthenticated) loadPostLiked();
  }, [postId, isAuthenticated]);

  /* ---------------- 게시글 ---------------- */

  const loadPost = async () => {
    const res = await fetchPost(Number(postId));
    setPost(res.data.data ?? res.data);
  };

  const loadPostLike = async () => {
    const res = await getLikeCount(Number(postId), "post");
    setLikeCount(res.data.data?.count ?? 0);
  };

  const loadPostLiked = async () => {
    const res = await checkLiked(Number(postId), "post");
    setIsLiked(res.data.data?.liked ?? false);
  };

  const togglePostLike = async () => {
    if (!isAuthenticated) return alert("로그인이 필요합니다.");
    const res = await toggleLike(Number(postId), "post");
    setLikeCount(res.data.data.likeCount);
    setIsLiked(res.data.data.liked);
  };

  const onDeletePost = async () => {
    if (!confirm("정말 게시글을 삭제하시겠습니까?")) return;
    await deletePost(Number(postId));
    alert("게시글이 삭제되었습니다.");
    navigate(`/boards/${post.board.id}`);
  };

  /* ---------------- 댓글 ---------------- */

  const loadComments = async () => {
    const res = await fetchComments(Number(postId));
    const base = res.data.data ?? res.data ?? [];

    const enriched = await Promise.all(
      base.map(async (c: any) => {
        const countRes = await getLikeCount(c.id, "comment");
        const count = countRes.data.data?.count ?? 0;

        let liked = false;
        if (isAuthenticated) {
          const likedRes = await checkLiked(c.id, "comment");
          liked = likedRes.data.data?.liked ?? false;
        }

        return { ...c, likeCount: count, isLiked: liked };
      })
    );

    setComments(enriched);
  };

  const toggleCommentLike = async (commentId: number) => {
    if (!isAuthenticated) return;
    const res = await toggleLike(commentId, "comment");
    const data = res.data.data;

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, likeCount: data.likeCount, isLiked: data.liked }
          : c
      )
    );
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    await createComment({
      postId: Number(postId),
      content: commentText,
    });

    setCommentText("");
    loadComments();
  };

  if (!post) return <p className="text-gray-400">로딩중...</p>;

  const isAuthor =
    isAuthenticated && user?.id === post.author?.id;

  return (
    <div className="text-white space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">{post.title}</h1>

      <div className="text-sm text-gray-400">
        ✍ {post.author?.username} ·{" "}
        {new Date(post.createAt).toLocaleString()}
      </div>

      <div
        className="prose prose-invert max-w-none bg-[#1c1d22] p-5 rounded"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <button
        onClick={togglePostLike}
        className={`px-4 py-2 rounded ${
          isLiked ? "bg-red-600" : "bg-blue-600"
        }`}
      >
        👍 {likeCount}
      </button>

      {/* 🔥 수정 / 삭제 버튼 */}
      {isAuthor && (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/posts/edit/${post.id}`)}
            className="px-4 py-2 bg-blue-600 rounded"
          >
            수정
          </button>
          <button
            onClick={onDeletePost}
            className="px-4 py-2 bg-red-600 rounded"
          >
            삭제
          </button>
        </div>
      )}

      {/* 댓글 */}
      <h3 className="text-xl mt-10">💬 댓글</h3>

      <ul className="space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="bg-[#1a1b1f] p-4 rounded">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">
                {c.author?.username}
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
            <p>{c.content}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={submitComment} className="space-y-3">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded"
        />
        <button className="px-4 py-2 bg-green-600 rounded">
          댓글 작성
        </button>
      </form>
    </div>
  );
}
