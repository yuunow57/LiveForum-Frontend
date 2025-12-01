import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  user: any | null;
  setAuth: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("access_token"),
  user: null,

  setAuth: (token, user) => {
    localStorage.setItem("access_token", token);
    set({ accessToken: token, user });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    set({ accessToken: null, user: null });
  },
}));
