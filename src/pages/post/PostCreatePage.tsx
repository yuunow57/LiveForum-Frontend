import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPost } from "../../api/post.api";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

export default function PostCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get("boardId");

  const [title, setTitle] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "min-h-[250px] p-4 bg-gray-800 rounded outline-none text-white",
      },
    },
  });

  if (!boardId) {
    return (
      <div className="text-red-400 text-center">
        잘못된 접근입니다 (boardId 없음)
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return alert("제목을 입력하세요.");
    if (!editor || editor.isEmpty) return alert("내용을 입력하세요.");

    try {
      await createPost({
        boardId: Number(boardId),
        title,
        content: editor.getHTML(), // 🔥 HTML 저장
      });

      alert("게시글이 작성되었습니다.");
      navigate(`/boards/${boardId}`);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "게시글 작성 실패");
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-6">✍ 게시글 작성</h2>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* 제목 */}
        <input
          className="w-full px-3 py-2 rounded bg-gray-800 outline-none"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* 🔥 툴바 */}
        <div className="flex flex-wrap gap-2 bg-gray-900 p-2 rounded">
          <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}
            className="px-2 py-1 bg-gray-700 rounded">B</button>

          <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}
            className="px-2 py-1 bg-gray-700 rounded italic">I</button>

          <button type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className="px-2 py-1 bg-gray-700 rounded underline">U</button>

          <button type="button" onClick={() => editor?.chain().focus().setColor("#ef4444").run()}
            className="px-2 py-1 bg-red-500 rounded">A</button>

          <button type="button" onClick={() => editor?.chain().focus().setColor("#22c55e").run()}
            className="px-2 py-1 bg-green-500 rounded">A</button>

          <button type="button" onClick={() => editor?.chain().focus().unsetColor().run()}
            className="px-2 py-1 bg-gray-600 rounded">Reset</button>
        </div>

        {/* 🔥 에디터 본문 */}
        <EditorContent editor={editor} />

        {/* 버튼 */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-700 rounded"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 rounded"
          >
            작성하기
          </button>
        </div>
      </form>
    </div>
  );
}
