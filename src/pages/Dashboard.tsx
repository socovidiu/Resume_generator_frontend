import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const DashboardPage: React.FC = () => {
  const { user, clearSession } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg text-gray-700 animate-pulse">Loading your dashboard…</p>
      </div>
    );
  }

  const onLogout = async () => {
    const ok = window.confirm("Are you sure you want to log out?");
    if (!ok) return;
    try {
      setIsLoggingOut(true);
      clearSession();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className=" p-6 max-w-3xl bg-white shadow-lg rounded-lg">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
          {user.username?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Welcome, {user.username}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/cvs/new"
          className="block rounded-lg border bg-blue-50 hover:bg-blue-100 transition p-4 text-center font-medium"
        >
          ➕ Create new CV
        </Link>
        <Link
          to="/managecvs"
          className="block rounded-lg border bg-blue-50 hover:bg-blue-100 transition p-4 text-center font-medium"
        >
          🗂️ Manage my CVs
        </Link>
        <Link
          to="/profile"
          className="block rounded-lg border bg-blue-50 hover:bg-blue-100 transition p-4 text-center font-medium"
        >
          👤 Profile & settings
        </Link>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate("/profile")}
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit Profile
        </button>
        <button
          onClick={onLogout}
          disabled={isLoggingOut}
          className={`w-full sm:w-auto px-4 py-2 rounded text-white ${
            isLoggingOut ? "bg-red-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isLoggingOut ? "Logging out…" : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
