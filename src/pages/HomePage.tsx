import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBoards } from "../api/board.api";
import { fetchPosts } from "../api/post.api";

export default function HomePage() {
  const [boards, setBoards] = useState([]);
  const [sectionPosts, setSectionPosts] = useState({} as any);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const res = await fetchBoards();
      const boardsData = Array.isArray(res.data)
        ? res.data
        : res.data.data ?? [];

      setBoards(boardsData);

      boardsData.forEach((b: any) => {
        loadSectionPosts(b.id);
      });
    } catch (err) {
      console.error("게시판 목록 로드 오류:", err);
    }
  };

  const loadSectionPosts = async (boardId: number) => {
    try {
      const res = await fetchPosts({
        boardId: String(boardId),
        page: 1,
        sort: "latest",
      });

      const posts = res.data.data ?? res.data;

      setSectionPosts((prev: any) => ({
        ...prev,
        [boardId]: posts.slice(0, 3),
      }));
    } catch (err) {
      console.error("게시판별 최신글 로드 오류:", err);
    }
  };

  return (
    <div className="w-full space-y-10">
      <h1 className="text-3xl font-bold mb-6">🏠 메인 페이지</h1>

      {boards.map((board: any) => (
        <section key={board.id}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">{board.name}</h2>
            <Link
              to={`/boards/${board.id}`}
              className="text-sm text-green-400 hover:underline"
            >
              더보기 →
            </Link>
          </div>

          <div className="bg-[#1c1d22] p-5 rounded-lg">
            {sectionPosts[board.id]?.length > 0 ? (
              <ul className="space-y-2">
                {sectionPosts[board.id].map((post: any) => (
                  <li key={post.id}>
                    <Link
                      to={`/posts/${post.id}`}
                      className="block text-gray-200 hover:text-white truncate"
                    >
                      • {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">게시글이 없습니다.</p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
