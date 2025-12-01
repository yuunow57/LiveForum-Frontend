import { useState } from "react";
import { loginRequest } from "../../api/auth.api";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const nav = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await loginRequest({ email, password });
      const { accessToken, user } = res.data;

      setAuth(accessToken, user);
      alert("로그인 성공!");
      nav("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "로그인 실패");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-[#17171c] p-8 rounded-xl border border-gray-700">
      <h2 className="text-2xl font-semibold mb-6">로그인</h2>

      <form className="space-y-4" onSubmit={onSubmit}>
        <input
          className="w-full px-3 py-2 rounded bg-gray-800 outline-none"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full px-3 py-2 rounded bg-gray-800 outline-none"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700">
          로그인
        </button>
      </form>
    </div>
  );
}
