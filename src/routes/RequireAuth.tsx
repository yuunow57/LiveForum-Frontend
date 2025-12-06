import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function RequireAuth() {
  const { accessToken } = useAuthStore();
  return accessToken ? <Outlet /> : <Navigate to="/login" />;
}
