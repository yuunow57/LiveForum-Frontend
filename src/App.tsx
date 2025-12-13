import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import MainLayout from "./layouts/MainLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import PostListPage from "./pages/post/PostListPage";
import PostDetailPage from "./pages/post/PostDetailPage";
import PostCreatePage from "./pages/post/PostCreatePage";
import PostEditPage from "./pages/post/PostEditPage";

import ProfilePage from "./pages/user/ProfilePage";
import NotificationPage from "./pages/notification/NotificationPage";

import RequireAuth from "./routes/RequireAuth";
import { useAuthStore } from "./store/auth.store";

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // 앱 시작할 때 서버에 토큰 검증
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 레이아웃 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/boards/:boardId" element={<PostListPage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />

          {/* 로그인 필요 */}
          <Route element={<RequireAuth />}>
            <Route path="/posts/create" element={<PostCreatePage />} />
            <Route path="/posts/edit/:postId" element={<PostEditPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationPage />} />
          </Route>
        </Route>

        {/* 인증 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
