import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchPosts } from "../../api/post.api";
import { getLikeCount } from "../../api/like.api";

export default function PostListPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<any[]>([]);
  const [boardName, setBoardName] = useState("");

  useEffect(() => {
    if (!boardId) return;
    loadPosts();
  }, [boardId]);

  const loadPosts = async () => {
    const res = await fetchPosts({
      boardId: String(boardId),
      page: 1,
      sort: "latest",
    });

    const list = res.data.data ?? [];

    // 좋아요 카운트 병렬 로딩 🔥
    const postsWithLikes = await Promise.all(
      list.map(async (post: any) => {
        const likeRes = await getLikeCount(post.id, "post");
        const likeCount = likeRes.data.data?.count ?? 0;
        return { ...post, likeCount };
      })
    );

    setPosts(postsWithLikes);
    setBoardName(list[0]?.board?.name ?? "게시판");
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">📌 {boardName}</h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate(`/posts/create?boardId=${boardId}`)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md text-sm"
        >
          ✍ 글쓰기
        </button>
      </div>

      <ul className="space-y-3">
        {posts.length > 0 ? (
          posts.map((post) => (
            <li
              key={post.id}
              className="px-4 py-3 bg-[#1c1d22] rounded-lg hover:bg-[#2a2b30] transition"
            >
              <Link to={`/posts/${post.id}`} className="text-lg font-semibold">
                {post.title}
              </Link>

              <p className="text-gray-400 text-sm mt-1 truncate">
                {post.content}
              </p>

              {/* 좋아요 표시 😎 */}
              <div className="text-xs text-gray-500 mt-2">
                👍 {post.likeCount}
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500">작성된 게시글이 없습니다.</p>
        )}
      </ul>
    </div>
  );
}
