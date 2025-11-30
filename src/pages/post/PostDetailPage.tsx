import { useParams } from "react-router-dom";

export default function PostDetailPage() {
  const { postId } = useParams();
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">게시글 {postId}</h2>
      <p className="text-gray-400">게시글 내용 불러오기 예정</p>
    </div>
  );
}
