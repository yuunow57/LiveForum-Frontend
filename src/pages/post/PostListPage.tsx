import { useParams } from "react-router-dom";

export default function PostListPage() {
  const { boardId } = useParams();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">게시판 {boardId}</h2>
      <p className="text-gray-400">게시글 목록</p>
    </div>
  );
}
