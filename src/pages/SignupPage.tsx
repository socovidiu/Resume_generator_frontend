// src/pages/SignUpPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/auth";
import { useAuth } from "../auth/AuthContext";

const SignUpPage: React.FC = () => {
  const { setSession } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await signup({ username, email, password });
      if (res?.token && res?.user) {
        setSession(res.token, res.user);
        navigate("/cvs", { replace: true });
      } else {
        setError(res?.message || "Sign up failed");
      }
    } catch (err: any) {
      setError(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm mx-auto">
      <h2 className="text-xl font-bold text-center mb-4">Sign Up</h2>
      <form onSubmit={onSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-medium mb-1">Username</label>
          <input id="username" type="text" value={username} onChange={(e)=>setUsername(e.target.value)}
                 required className="w-full px-3 py-2 border rounded-md text-gray-700 bg-gray-200 focus:ring focus:ring-blue-200" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
          <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
                 required className="w-full px-3 py-2 border rounded-md text-gray-700 bg-gray-200 focus:ring focus:ring-blue-200" />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
          <input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}
                 required className="w-full px-3 py-2 border rounded-md text-gray-700 bg-gray-200 focus:ring focus:ring-blue-200" />
        </div>

        <button type="submit" disabled={loading}
                className="w-full text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition py-2 rounded">
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </form>

      <div className="text-center mt-4">
        <p className="text-gray-600">Already have an account?</p>
        <button onClick={() => navigate("/login")} className="text-blue-600 hover:underline" type="button">
          Login
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;
