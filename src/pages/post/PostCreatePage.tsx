import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPost } from "../../api/post.api";

export default function PostCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 🔥 URL: /posts/create?boardId=2 에서 boardId 읽기
  const boardId = searchParams.get("boardId");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  if (!boardId) {
    return (
      <div className="text-red-400 text-center">
        잘못된 접근입니다 (boardId 없음).
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createPost({
        boardId: Number(boardId),
        title,
        content,
      });

      alert("게시글이 작성되었습니다.");
      navigate(`/boards/${boardId}`);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "게시글 작성에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">✍ 게시글 작성</h2>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block mb-1 text-sm text-gray-300">제목</label>
          <input
            className="w-full px-3 py-2 rounded bg-gray-800 outline-none"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">내용</label>
          <textarea
            className="w-full min-h-[200px] px-3 py-2 rounded bg-gray-800 outline-none resize-y"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-sm"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-sm"
          >
            작성하기
          </button>
        </div>
      </form>
    </div>
  );
}
