import { useEffect, useState } from "react";
import { fetchMyInfo, fetchMyPosts, fetchMyComments } from "../../api/user.api";

export default function ProfilePage() {
  const [tab, setTab] = useState<"posts" | "comments">("posts");
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);

  const loadData = async () => {
    const userRes = await fetchMyInfo();
    setUser(userRes.data.data);

    const postsRes = await fetchMyPosts();
    setPosts(postsRes.data.data);

    const commentsRes = await fetchMyComments();
    setComments(commentsRes.data.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!user) return <p>로딩중...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{user.nickname}님의 프로필</h2>

      <div className="flex space-x-3 mb-6">
        <button
          onClick={() => setTab("posts")}
          className={`px-3 py-2 rounded ${tab === "posts" ? "bg-blue-600" : "bg-[#1b1c22]"}`}
        >
          작성 글
        </button>

        <button
          onClick={() => setTab("comments")}
          className={`px-3 py-2 rounded ${tab === "comments" ? "bg-blue-600" : "bg-[#1b1c22]"}`}
        >
          작성 댓글
        </button>
      </div>

      {tab === "posts" ? (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="p-3 rounded bg-[#1b1c22] border border-gray-700">
              <p className="font-semibold">{p.title}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="p-3 rounded bg-[#1b1c22] border border-gray-700">
              <p>{c.content}</p>
              <p className="text-xs text-gray-400">게시글 #{c.postId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
