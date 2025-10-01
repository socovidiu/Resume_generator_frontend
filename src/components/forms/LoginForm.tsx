import { useState } from "react";
import { login } from "../../services/auth";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginForm() {
    // "identifier" can be username OR email
    const [identifier, setIdentifier] = useState("");
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
        // We keep the API contract: send "username" even if it's an email.
        const res = await login({ username: identifier, password });
        if (res.token && res.user) {
          setSession(res.token, res.user);
          const to = location.state?.from ?? "/managecvs";
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
          <label htmlFor="identifier" className="block text-gray-700 font-medium mb-1">
            Username or Email
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            placeholder="Enter username or email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
            required
            className="w-full px-3 py-2 border rounded-md text-gray-700 bg-gray-200 focus:ring focus:ring-blue-200"
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
            className="w-full px-3 py-2 border rounded-md text-gray-700 bg-gray-200 focus:ring focus:ring-blue-200"
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
