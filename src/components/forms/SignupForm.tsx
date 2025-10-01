import React, { useState } from "react";
import FormField from "./fields/FormField";
import PasswordField from "./fields/PasswordField";
// import { signup } from "../../services/auth"; // wire later
// import { useAuth } from "../../auth/AuthContext";
// import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [tos, setTos]           = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true); setError(null);
    try {
      // const res = await signup({ username, email, password });
      // handle session + navigate…
    } catch (e: any) {
      setError("Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <FormField id="username" label="Username" value={username} onChange={(e)=>setUsername(e.currentTarget.value)} placeholder="Your display name" required />
      <FormField id="email" label="Email" type="email" value={email} onChange={(e)=>setEmail(e.currentTarget.value)} placeholder="name@example.com" required />
      <PasswordField id="password" value={password} onChange={setPassword} />
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input type="checkbox" checked={tos} onChange={(e)=>setTos(e.target.checked)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
        I agree to the Terms and Privacy Policy
      </label>
      <button type="submit" disabled={loading || !tos} className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 transition disabled:opacity-60">
        {loading ? "Creating account…" : "Create account"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}