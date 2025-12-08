import { create } from "zustand";
import { api } from "../api/axios";

type AuthState = {
  user: any | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: any) => void;
  logout: () => void;
  checkAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem("access_token"),
  isAuthenticated: false,

  setAuth: (token, user) => {
    localStorage.setItem("access_token", token);
    set({ accessToken: token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    set({ accessToken: null, user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await api.get("/auth/me");
      set({ user: res.data.data, isAuthenticated: true });
    } catch (e) {
      console.log("토큰 에러 → 로그아웃");
      localStorage.removeItem("access_token");
      set({ accessToken: null, user: null, isAuthenticated: false });
    }
  },
}));
