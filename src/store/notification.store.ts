import { create } from "zustand";

interface NotificationState {
  list: any[];
  unreadCount: number;
  setNotifications: (list: any[]) => void;
  increase: () => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  list: [],
  unreadCount: 0,

  setNotifications: (list) =>
    set({
      list,
      unreadCount: list.filter((n) => !n.isRead).length,
    }),

  increase: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),

  reset: () => set({ unreadCount: 0 }),
}));
