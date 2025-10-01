import React, { useMemo, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useLogout } from "../hooks/useLogout";
import ProfileForm, { ProfileValues } from "../components/forms/ProfileForm";

function Section({
  title,
  children,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white/90 backdrop-blur shadow-sm">
      <div className="flex items-center justify-between gap-4 p-5 border-b">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h2>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const doLogout = useLogout();

  const [profile, setProfile] = useState<ProfileValues>({
    firstName: "",
    lastName: "",
    headline: "",
    location: "",
    website: "",
    linkedIn: "",
    github: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [notifProduct, setNotifProduct] = useState(true);
  const [notifReminders, setNotifReminders] = useState(true);
  const [notifNews, setNotifNews] = useState(false);

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const nameFallback = useMemo(() => {
    const raw = user?.username || user?.email || "Member";
    return raw.split("@")[0];
  }, [user]);

  function handlePatch(patch: Partial<ProfileValues>) {
    setProfile((p) => ({ ...p, ...patch }));
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSavingProfile(true);
      // await api.updateProfile(profile)
      // optionally refresh user context
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!newPwd || newPwd.length < 8 || newPwd !== confirmPwd) return;
    try {
      setSavingPwd(true);
      // await api.changePassword({ current: currentPwd, next: newPwd })
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } finally {
      setSavingPwd(false);
    }
  }

  function handleAvatarFile(file?: File | null) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    // Optionally upload:
    // const form = new FormData(); form.append("file", file);
    // await api.uploadAvatar(form)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={
                  avatarUrl ??
                  "https://api.dicebear.com/8.x/initials/svg?seed=" +
                    encodeURIComponent(nameFallback)
                }
                alt="Avatar"
                className="h-16 w-16 rounded-full border object-cover"
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 rounded-full border bg-white p-1 shadow hover:bg-gray-50"
                title="Change avatar"
                type="button"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleAvatarFile(e.target.files?.[0])}
                className="hidden"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => doLogout({ confirm: true })}
              className="rounded-lg border px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: profile + notifications */}
          <div className="lg:col-span-2 space-y-6">
            <Section
              title="Basic information"
              actions={
                <button
                  form="profile-form"
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700 disabled:opacity-60"
                  disabled={savingProfile}
                >
                  {savingProfile ? "Saving…" : "Save changes"}
                </button>
              }
            >
              <form id="profile-form" onSubmit={saveProfile}>
                <ProfileForm
                  values={profile}
                  onChange={handlePatch}
                  onSubmit={saveProfile}
                  saving={savingProfile}
                />
              </form>
            </Section>

            <Section title="Notifications">
              <div className="space-y-3">
                <label className="flex items-start gap-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={notifProduct}
                    onChange={(e) => setNotifProduct(e.target.checked)}
                  />
                  <span>
                    Product tips & updates
                    <span className="block text-gray-500 text-xs">
                      Occasional emails about features and improvements.
                    </span>
                  </span>
                </label>
                <label className="flex items-start gap-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={notifReminders}
                    onChange={(e) => setNotifReminders(e.target.checked)}
                  />
                  <span>
                    Reminders
                    <span className="block text-gray-500 text-xs">
                      Expiring links, export reminders, and helpful nudges.
                    </span>
                  </span>
                </label>
                <label className="flex items-start gap-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={notifNews}
                    onChange={(e) => setNotifNews(e.target.checked)}
                  />
                  <span>
                    News & offers
                    <span className="block text-gray-500 text-xs">
                      Occasional announcements and discounts.
                    </span>
                  </span>
                </label>
              </div>
            </Section>
          </div>

          {/* Right: account & security */}
          <div className="space-y-6">
            <Section title="Account">
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    value={user?.email ?? ""}
                    disabled
                    className="mt-1 w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm text-gray-700"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email changes are managed from your account settings.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    value={user?.username ?? nameFallback}
                    disabled
                    className="mt-1 w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm text-gray-700"
                  />
                </div>
              </div>
            </Section>

            <Section title="Security" actions={<span className="text-xs text-gray-500">Min 8 characters</span>}>
              <form onSubmit={savePassword} className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current password</label>
                  <input
                    type="password"
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New password</label>
                  <input
                    type="password"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm new password</label>
                  <input
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={savingPwd || !newPwd || newPwd !== confirmPwd || newPwd.length < 8}
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white disabled:opacity-60 hover:bg-indigo-700 disabled:hover:bg-indigo-600"
                  >
                    {savingPwd ? "Saving…" : "Update password"}
                  </button>
                  <button type="button" className="text-sm text-gray-600 hover:underline">
                    Forgot password?
                  </button>
                </div>
              </form>
            </Section>

            <Section title="Danger zone">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Delete account</p>
                  <p className="text-xs text-gray-500">This action is permanent and cannot be undone.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const ok = window.confirm(
                      "This will permanently delete your account and data. Continue?"
                    );
                    if (!ok) return;
                    // await api.deleteAccount();
                    doLogout({ redirectTo: "/signup" });
                  }}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
