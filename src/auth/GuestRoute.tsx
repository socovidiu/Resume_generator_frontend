import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function GuestRoute({ redirectTo = "/" }: { redirectTo?: string }) {
  const { token, isAuthReady } = useAuth();
  if (!isAuthReady) return null; // or a spinner
  return token ? <Navigate to={redirectTo} replace /> : <Outlet />;
}
