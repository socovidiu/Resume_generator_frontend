import React, { useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

type ResumeItem = {
  id: string;
  title: string;
  updatedAt: string; // ISO
  template: string;
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const doLogout = useLogout();

  // Mock data placeholder (you'll later replace with API)
  const [resumes] = useState<ResumeItem[]>([]);

  const name = useMemo(() => {
    const raw = user?.username || user?.email || "there";
    return raw.split("@")[0];
  }, [user]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 shrink-0 rounded-full bg-indigo-600 text-white grid place-items-center font-semibold">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {greeting}, {name} 
              </h1>
              <p className="text-gray-600">Build, edit, and export your resumes.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/templates")}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-white"
            >
              Browse templates
            </button>
            <button
              onClick={() => navigate("/resume/new")}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              + Create resume
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent resumes */}
          <section className="lg:col-span-8">
            <div className="rounded-2xl border bg-white shadow-sm">
              <div className="flex items-center justify-between p-4 sm:p-5 border-b">
                <h2 className="text-base sm:text-lg font-semibold">Recent resumes</h2>
                <button
                  onClick={() => navigate("/resumes")}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  View all
                </button>
              </div>

              <div className="p-4 sm:p-5">
                {resumes.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-indigo-50 grid place-items-center">
                      <svg
                        className="h-6 w-6 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v12m6-6H6"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Create your first resume
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      You don’t have any resumes yet.
                    </p>
                    <button
                      onClick={() => navigate("/resume/new")}
                      className="mt-4 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Get started
                    </button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {resumes.map((r) => (
                      <article
                        key={r.id}
                        className="rounded-lg border p-4 hover:shadow transition"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{r.title}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Updated {new Date(r.updatedAt).toLocaleString()}
                            </p>
                          </div>
                          <span className="text-xs rounded-full border px-2 py-0.5 text-gray-600">
                            {r.template}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            onClick={() => navigate(`/resume/${r.id}/edit`)}
                            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => navigate(`/resume/${r.id}/preview`)}
                            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => navigate(`/resume/${r.id}/export`)}
                            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
                          >
                            Export PDF
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right rail */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Templates spotlight */}
            <div className="rounded-2xl border bg-white shadow-sm">
              <div className="p-4 sm:p-5 border-b">
                <h2 className="text-base sm:text-lg font-semibold">
                  Templates spotlight
                </h2>
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex gap-4 overflow-x-auto pb-1">
                  {["Classic", "Modern", "Compact"].map((t) => (
                    <button
                      key={t}
                      onClick={() =>
                        navigate(`/templates?pick=${encodeURIComponent(t)}`)
                      }
                      className="min-w-[160px] rounded-xl border aspect-[3/4] overflow-hidden hover:shadow transition grid place-items-center"
                    >
                      <span className="text-sm text-gray-700">{t}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Account card */}
            <div className="rounded-2xl border bg-white shadow-sm">
              <div className="p-4 sm:p-5">
                <h3 className="font-semibold text-gray-900">Account</h3>
                <p className="text-sm text-gray-600 mt-1 break-all">{user?.email}</p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate("/profile")}
                    className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    Profile settings
                  </button>
                  <button
                    onClick={() => doLogout({ confirm: true })}
                    className="rounded-md bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
