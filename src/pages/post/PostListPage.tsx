import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPosts } from "../../api/post.api";
import { Link } from "react-router-dom";

export default function PostListPage() {
  const { boardId } = useParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("latest");

  const loadPosts = async () => {
    try {
      const res = await fetchPosts({ boardId: boardId!, page, sort });
      setPosts(res.data.data.items);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [page, sort, boardId]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">게시판 {boardId}</h2>

      {/* 정렬 버튼 */}
      <div className="flex space-x-3 mb-6">
        <button
          onClick={() => setSort("latest")}
          className={`px-3 py-2 rounded ${
            sort === "latest" ? "bg-blue-600" : "bg-[#1b1c22]"
          }`}
        >
          최신순
        </button>

        <button
          onClick={() => setSort("popular")}
          className={`px-3 py-2 rounded ${
            sort === "popular" ? "bg-blue-600" : "bg-[#1b1c22]"
          }`}
        >
          인기순
        </button>
      </div>

      {/* 게시글 목록 */}
      <div className="space-y-3">
        {posts.map((p) => (
          <Link
            to={`/post/${p.id}`}
            key={p.id}
            className="block p-4 rounded bg-[#1b1c22] border border-gray-700 hover:bg-[#232429]"
          >
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <div className="text-gray-400 text-sm flex justify-between mt-2">
              <span>댓글 {p.commentCount}</span>
              <span>조회수 {p.viewCount}</span>
              <span>좋아요 {p.likeCount}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 rounded bg-[#1b1c22] border border-gray-700 disabled:opacity-50"
        >
          이전
        </button>

        <span className="px-3 py-1">Page {page}</span>

        <button
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 rounded bg-[#1b1c22] border border-gray-700"
        >
          다음
        </button>
      </div>
    </div>
  );
}
