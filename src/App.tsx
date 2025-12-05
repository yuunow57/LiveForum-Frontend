import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import PostListPage from "./pages/post/PostListPage.tsx";
import PostDetailPage from "./pages/post/PostDetailPage.tsx";
import PostCreatePage from "./pages/post/PostCreatePage.tsx";
import ProfilePage from "./pages/user/ProfilePage.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 메인 레이아웃 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/board/:boardId" element={<PostListPage />} />
          <Route path="/post/:postId" element={<PostDetailPage />} />
          <Route path="/post/create" element={<PostCreatePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* 인증 관련 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
