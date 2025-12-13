import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPost, updatePost } from "../../api/post.api";
import PostEditor from "../../components/editor/PostEditor";

export default function PostEditPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const loadPost = async () => {
      const res = await fetchPost(Number(postId));
      const post = res.data.data ?? res.data;

      setTitle(post.title);
      setContent(post.content);
      setLoading(false);
    };

    loadPost();
  }, [postId]);

  const onSubmit = async () => {
    if (!title.trim()) return alert("제목을 입력하세요.");

    await updatePost(Number(postId), {
      title,
      content,
    });

    alert("게시글이 수정되었습니다.");
    navigate(`/posts/${postId}`);
  };

  if (loading) return <p className="text-gray-400">로딩중...</p>;

  return (
    <div className="max-w-3xl mx-auto text-white space-y-4">
      <h2 className="text-2xl font-bold">✏ 게시글 수정</h2>

      <input
        className="w-full p-2 bg-gray-800 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <PostEditor value={content} onChange={setContent} />

      <div className="flex justify-end gap-2">
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-700 rounded">
          취소
        </button>
        <button onClick={onSubmit} className="px-4 py-2 bg-green-600 rounded">
          수정 완료
        </button>
      </div>
    </div>
  );
}
