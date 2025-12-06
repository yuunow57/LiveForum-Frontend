import { Link } from "react-router-dom";

export default function PostCard({ post }: any) {
  return (
    <Link
      to={`/post/${post.id}`}
      className="block p-4 rounded bg-[#1b1c22] border border-gray-700 hover:bg-[#232429]"
    >
      <h3 className="text-lg font-semibold">{post.title}</h3>

      <div className="text-gray-400 text-sm flex gap-4 mt-2">
        <span>댓글 {post.commentCount}</span>
        <span>조회수 {post.viewCount}</span>
        <span>좋아요 {post.likeCount}</span>
      </div>
    </Link>
  );
}
