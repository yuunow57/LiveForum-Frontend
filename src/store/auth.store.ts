import { create } from "zustand";
import { api } from "../api/axios";

type AuthState = {
  user: any | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string) => Promise<void>;
  setUser: (user: any) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem("access_token"),
  isAuthenticated: false,

  // 로그인 시 토큰 저장 + 사용자 정보 로드
  setAuth: async (token: string) => {
    localStorage.setItem("access_token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    set({ accessToken: token });

    try {
      const res = await api.get("/auth/me");
      set({
        user: res.data.data,
        isAuthenticated: true
      });
    } catch (error) {
      console.error("setAuth에서 사용자 정보 갱신 실패:", error);
    }
  },

  // LoginPage 에서 호출될 함수
  setUser: (user: any) => {
    set({
      user,
      isAuthenticated: true
    });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    delete api.defaults.headers.common.Authorization;
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    try {
      const res = await api.get("/auth/me");
      set({
        user: res.data.data,
        isAuthenticated: true,
      });
    } catch (e) {
      console.warn("토큰 검증 실패 → 로그아웃 처리");
      localStorage.removeItem("access_token");
      delete api.defaults.headers.common.Authorization;
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
    }
  },
}));
