import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth.store";
import { useNotificationStore } from "../store/notification.store";
import { fetchBoards } from "../api/board.api";
import { socket } from "../socket/socket";

export default function MainLayout() {
  const { accessToken, user, isAuthenticated, logout } = useAuthStore();
  const { unreadCount, increase } = useNotificationStore();
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();

  // WebSocket - 로그인 상태에서만 연결
  useEffect(() => {
    if (accessToken) {
      if (!socket.connected) socket.connect();

      socket.on("notify_user", () => increase());
    } else {
      socket.disconnect();
    }

    return () => {
      socket.off("notify_user");
    };
  }, [accessToken, increase]);

  // 게시판 불러오기
  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const res = await fetchBoards();
      const boardsData = Array.isArray(res.data)
        ? res.data
        : res.data.data ?? [];

      setBoards(boardsData);
    } catch (e) {
      console.error("게시판 불러오기 오류:", e);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0e0f12] text-white flex flex-col">
      {/* Header */}
      <header className="h-14 flex items-center border-b border-gray-800 px-6 justify-between">
        <Link to="/" className="text-xl font-bold text-green-400">
          LiveForum
        </Link>

        <nav className="space-x-4 flex items-center">
          {isAuthenticated && (
            <Link to="/notifications" className="relative text-lg">
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="hover:underline">
                로그인
              </Link>
              <Link to="/register" className="hover:underline">
                회원가입
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-300 font-semibold">
                {user?.username ?? "사용자"}
              </span>
              <Link to="/profile" className="hover:underline">
                프로필
              </Link>
              <button
                onClick={logout}
                className="hover:underline ml-2 text-red-400"
              >
                로그아웃
              </button>
            </>
          )}
        </nav>
      </header>

      {/* Body */}
      <div className="flex flex-1 w-full">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 border-r border-gray-800 p-4 gap-2">
          <h3 className="text-sm text-gray-400 mb-2">📚 게시판</h3>

          {boards.map((b: any) => (
            <button
              key={b.id}
              onClick={() => navigate(`/boards/${b.id}`)}
              className="text-left text-gray-300 hover:bg-gray-800 px-3 py-2 rounded-md transition"
            >
              {b.name}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-10 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
