import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Props = { redirectTo?: string };
export default function ProtectedRoute({ redirectTo = "/login" }: Props) {
  const { token, isAuthReady } = useAuth();

  // Show nothing (or a spinner) until we know if the user is logged in.
  if (!isAuthReady) return null;

  return token ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
