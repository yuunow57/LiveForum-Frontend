import { useEffect } from "react";
import { fetchNotifications, readNotification } from "../../api/notification.api";
import { useNotificationStore } from "../../store/notification.store";

export default function NotificationPage() {
  const { list, setNotifications, reset } = useNotificationStore();

  const loadNotifications = async () => {
    const res = await fetchNotifications();
    setNotifications(res.data.data);
  };

  const handleRead = async (id: number) => {
    await readNotification(id);
    loadNotifications();
  };

  useEffect(() => {
    loadNotifications();
    reset(); // 알림 아이콘 초기화
  }, []);

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold mb-4">알림</h2>

      {list.length === 0 && (
        <p className="text-gray-400">알림이 없습니다.</p>
      )}

      {list.map((n) => (
        <div
          key={n.id}
          onClick={() => handleRead(n.id)}
          className={`p-3 border rounded cursor-pointer ${
            n.isRead ? "border-gray-700" : "border-blue-600"
          }`}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}
