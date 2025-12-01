import { Outlet, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function MainLayout() {
  const { accessToken, user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#0e0f12] text-white flex flex-col">
      <header className="h-14 flex items-center border-b border-gray-800 px-6 justify-between">
        <Link to="/" className="text-xl font-bold">LiveForum</Link>

        <nav className="space-x-4">
          {!accessToken ? (
            <>
              <Link to="/login" className="hover:underline">로그인</Link>
              <Link to="/register" className="hover:underline">회원가입</Link>
            </>
          ) : (
            <>
              <span className="text-gray-400">{user?.nickname}님</span>
              <button onClick={logout} className="hover:underline">로그아웃</button>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto py-8 px-4">
        <Outlet />
      </main>
    </div>
  );
}
