import { useEffect, useState } from "react";
import { fetchBoards } from "../api/board.api";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [boards, setBoards] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchBoards();
        setBoards(res.data.data); // 백엔드 response 형태에 맞게 조정
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <div className="mt-6">
      <h1 className="text-3xl font-bold mb-6">게시판 목록</h1>

      <div className="space-y-3">
        {boards.map((b) => (
          <Link
            to={`/board/${b.id}`}
            key={b.id}
            className="block p-4 rounded-lg bg-[#1b1c22] border border-gray-700 hover:bg-[#22232a]"
          >
            <h3 className="text-lg font-semibold">{b.name}</h3>
            <p className="text-gray-400 text-sm">{b.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
