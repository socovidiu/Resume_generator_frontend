import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { updateUser } from "../services/user";
import { deleteUser } from "../services/user";

const ProfilePage: React.FC = () => {
    const { user, setSession, clearSession, token } = useAuth();
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    if (!user) {
        return (
        <div className="flex justify-center items-center h-[60vh]">
            <p className="text-lg text-gray-700 animate-pulse">Loading profile…</p>
        </div>
        );
    }

    async function onSave(e: React.FormEvent) {
        e.preventDefault();
        if (!user || saving) return;
        setSaving(true);
        setError(null);
        setMessage(null);

        try {
            const updated = await updateUser(user.id, { username, email /*, password?*/ });
            setSession(localStorage.getItem("auth_token")!, { ...user, ...updated });
            setMessage("Profile updated!");
        } catch (err: any) {
        setError(err?.message || "Could not save changes");
        } finally {
        setSaving(false);
        }
    }

    async function onDelete() {
        if (!user) return;
        if (!confirm("This will permanently delete your account. Continue?")) return;
    
        try {
            await deleteUser(user.id);
            // then clear session + navigate to /signup or /login
            clearSession();
            navigate("/", { replace: true });
        } catch (e: any) {
            setError(e.message || "Could not delete account");
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-lg bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>
        <form onSubmit={onSave} className="space-y-4" noValidate>
            <div>
            <label htmlFor="username" className="block text-gray-700 font-medium mb-1">
                Username
            </label>
            <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md text-gray-700 bg-gray-50 focus:ring focus:ring-blue-200"
            />
            </div>
            <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Email
            </label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md text-gray-700 bg-gray-50 focus:ring focus:ring-blue-200"
            />
            </div>

            <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-60"
            >
            {saving ? "Saving…" : "Save changes"}
            </button>

            {message && <p className="text-green-600 text-sm">{message}</p>}
            {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
        </div>
    );
};

export default ProfilePage;
