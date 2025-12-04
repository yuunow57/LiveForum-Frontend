import { Outlet, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store";
import { useNotificationStore } from "../store/notification.store";
import { socket } from "../socket/socket";

export default function MainLayout() {
  const { accessToken, user, logout } = useAuthStore();
  const { unreadCount, increase } = useNotificationStore();

  useEffect(() => {
    if (!accessToken) return; // 로그인 상태일 때만 WebSocket 연결
    socket.connect();

    socket.on("notify_user", () => {
      increase();
    });

    return () => {
      socket.off("notify_user");
      socket.disconnect();
    };
  }, [accessToken, increase]);

  return (
    <div className="min-h-screen bg-[#0e0f12] text-white flex flex-col">
      {/* Header */}
      <header className="h-14 flex items-center border-b border-gray-800 px-6 justify-between">
        <Link to="/" className="text-xl font-bold">LiveForum</Link>

        <nav className="space-x-4 flex items-center">

          {accessToken && (
            <Link to="/notifications" className="relative text-lg">
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          {!accessToken ? (
            <>
              <Link to="/login" className="hover:underline">로그인</Link>
              <Link to="/register" className="hover:underline">회원가입</Link>
            </>
          ) : (
            <>
              <span className="text-gray-400">{user?.nickname}님</span>
              <button onClick={logout} className="hover:underline ml-2">
                로그아웃
              </button>
            </>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto py-8 px-4">
        <Outlet />
      </main>
    </div>
  );
}
