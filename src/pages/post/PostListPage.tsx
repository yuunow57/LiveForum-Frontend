import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchPosts } from "../../api/post.api";
import { fetchBoards } from "../../api/board.api";

export default function PostListPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [board, setBoard] = useState<any>(null);

  useEffect(() => {
    if (!boardId) return;
    loadBoardInfo();
    loadPosts();
  }, [boardId]);

  const loadBoardInfo = async () => {
    const res = await fetchBoards();
    const boards = res.data.data ?? res.data ?? [];
    const found = boards.find((b: any) => b.id === Number(boardId));
    setBoard(found);
  };

  const loadPosts = async () => {
    const res = await fetchPosts({
      boardId: String(boardId),
      page: 1,
      sort: "latest",
    });

    const data = res.data.data ?? res.data ?? [];
    setPosts(data);
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">
        📌 {board?.name ?? "게시판"}
      </h2>

      {/* 글쓰기 버튼 */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() =>
            navigate(`/posts/create?boardId=${boardId}`)
          }
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md text-sm"
        >
          ✍ 글쓰기
        </button>
      </div>

      <ul className="space-y-3">
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <li
              key={post.id}
              className="px-4 py-3 bg-[#1c1d22] rounded-lg hover:bg-[#2a2b30] transition"
            >
              <Link
                to={`/posts/${post.id}?boardId=${boardId}`}
                className="text-lg font-semibold"
              >
                {post.title}
              </Link>
              <p className="text-gray-400 text-sm mt-1 truncate">{post.content}</p>
            </li>
          ))
        ) : (
          <p className="text-gray-500">작성된 게시글이 없습니다.</p>
        )}
      </ul>
    </div>
  );
}
