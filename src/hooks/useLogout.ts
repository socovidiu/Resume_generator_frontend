import * as React from "react";
import { useNavigate } from "react-router-dom";
import { logout as apiLogout } from "../services/auth";
import { useAuth } from "../auth/AuthContext";

type Options = {
  confirm?: boolean;           // ask the user first
  redirectTo?: string;         // where to send them after logout
  onError?: (err: unknown) => void;
};

export function useLogout() {
  const { clearSession } = useAuth();
  const navigate = useNavigate();

  // single place that knows how to log out + navigate
  return React.useCallback(
    async (opts: Options = {}) => {
      const { confirm = false, redirectTo = "/login", onError } = opts;

      if (confirm) {
        const ok = window.confirm("Are you sure you want to log out?");
        if (!ok) return;
      }

      try {
        await apiLogout();       // best-effort server logout
      } catch (e) {
        onError?.(e);
        // don't early return; we still clear local session
      } finally {
        clearSession();          // clear tokens/user in context/localStorage
        navigate(redirectTo);
      }
    },
    [clearSession, navigate]
  );
}
