import { useState } from "react";
import { login } from "../services/auth";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await login({ username, password });
      if (res.token && res.user) {
        setSession(res.token, res.user);
        // go back to intended page or default to /cvs
        const to = location.state?.from ?? "/cvs";
        navigate(to, { replace: true });
      } else {
        setError(res.message || "Login failed");
      }
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700 font-medium mb-1">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
          className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
          aria-invalid={!!error}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
          aria-invalid={!!error}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition py-2 rounded"
      >
        {loading ? "Signing in..." : "Login"}
      </button>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </form>
  );
}
