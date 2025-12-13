import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPost } from "../../api/post.api";
import PostEditor from "../../components/editor/PostEditor";

export default function PostCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get("boardId");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  if (!boardId) return <p className="text-red-400">잘못된 접근입니다.</p>;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("제목을 입력하세요.");
    if (!content || content === "<p></p>") return alert("내용을 입력하세요.");

    await createPost({
      boardId: Number(boardId),
      title,
      content,
    });

    navigate(`/boards/${boardId}`);
  };

  return (
    <div className="max-w-3xl mx-auto text-white space-y-4">
      <h2 className="text-2xl font-bold">✍ 게시글 작성</h2>

      <input
        className="w-full p-2 bg-gray-800 rounded"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <PostEditor value={content} onChange={setContent} />

      <div className="flex justify-end gap-2">
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-700 rounded">
          취소
        </button>
        <button onClick={onSubmit} className="px-4 py-2 bg-green-600 rounded">
          작성하기
        </button>
      </div>
    </div>
  );
}
