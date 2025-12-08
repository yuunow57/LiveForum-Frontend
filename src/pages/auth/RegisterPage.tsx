import { useState } from "react";
import { registerRequest } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await registerRequest({ email, password, username });
      alert("회원가입 성공!");
      nav("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "회원가입 실패");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-[#17171c] p-8 rounded-xl border border-gray-700">
      <h2 className="text-2xl font-semibold mb-6">회원가입</h2>

      <form className="space-y-4" onSubmit={onSubmit}>
        <input
          className="w-full px-3 py-2 rounded bg-gray-800 outline-none"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full px-3 py-2 rounded bg-gray-800 outline-none"
          placeholder="닉네임"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full px-3 py-2 rounded bg-gray-800 outline-none"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700">
          회원가입
        </button>
      </form>
    </div>
  );
}
