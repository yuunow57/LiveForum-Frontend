import { api } from "./axios";

export const fetchNotifications = () => api.get("/notifications");
export const readNotification = (id: number) =>
  api.patch(`/notifications/${id}/read`);
