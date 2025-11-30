import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#0e0f12] text-white flex flex-col">

      <header className="h-14 flex items-center border-b border-gray-800 px-6 justify-between">
        <Link to="/" className="text-xl font-bold">
          LiveForum
        </Link>

        <nav className="space-x-4">
          <Link to="/login" className="hover:underline">로그인</Link>
          <Link to="/register" className="hover:underline">회원가입</Link>
        </nav>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto py-8 px-4">
        <Outlet />
      </main>

    </div>
  );
}
