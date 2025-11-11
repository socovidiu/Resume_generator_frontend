import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useLogout } from "../hooks/useLogout";
import ProfileForm from "../components/forms/ProfileForm";
function Section({ title, children, actions, }) {
    return (_jsxs("section", { className: "rounded-2xl border bg-white/90 backdrop-blur shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between gap-4 p-5 border-b", children: [_jsx("h2", { className: "text-base sm:text-lg font-semibold text-gray-900", children: title }), actions] }), _jsx("div", { className: "p-5", children: children })] }));
}
const Profile = () => {
    const { user } = useAuth();
    const doLogout = useLogout();
    const [profile, setProfile] = useState({
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
    const [avatarUrl, setAvatarUrl] = useState(null);
    const fileRef = useRef(null);
    const nameFallback = useMemo(() => {
        const raw = user?.username || user?.email || "Member";
        return raw.split("@")[0];
    }, [user]);
    function handlePatch(patch) {
        setProfile((p) => ({ ...p, ...patch }));
    }
    async function saveProfile(e) {
        e.preventDefault();
        try {
            setSavingProfile(true);
            // await api.updateProfile(profile)
            // optionally refresh user context
        }
        finally {
            setSavingProfile(false);
        }
    }
    async function savePassword(e) {
        e.preventDefault();
        if (!newPwd || newPwd.length < 8 || newPwd !== confirmPwd)
            return;
        try {
            setSavingPwd(true);
            // await api.changePassword({ current: currentPwd, next: newPwd })
            setCurrentPwd("");
            setNewPwd("");
            setConfirmPwd("");
        }
        finally {
            setSavingPwd(false);
        }
    }
    function handleAvatarFile(file) {
        if (!file)
            return;
        const url = URL.createObjectURL(file);
        setAvatarUrl(url);
        // Optionally upload:
        // const form = new FormData(); form.append("file", file);
        // await api.uploadAvatar(form)
    }
    return (_jsx("div", { className: "min-h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-slate-50 via-white to-indigo-50", children: _jsxs("div", { className: "mx-auto max-w-6xl px-4 sm:px-6 py-8", children: [_jsxs("div", { className: "mb-8 flex flex-wrap items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx("img", { src: avatarUrl ??
                                                "https://api.dicebear.com/8.x/initials/svg?seed=" +
                                                    encodeURIComponent(nameFallback), alt: "Avatar", className: "h-16 w-16 rounded-full border object-cover" }), _jsx("button", { onClick: () => fileRef.current?.click(), className: "absolute -bottom-1 -right-1 rounded-full border bg-white p-1 shadow hover:bg-gray-50", title: "Change avatar", type: "button", children: _jsx("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v12m6-6H6" }) }) }), _jsx("input", { ref: fileRef, type: "file", accept: "image/*", onChange: (e) => handleAvatarFile(e.target.files?.[0]), className: "hidden" })] }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Profile" }), _jsx("p", { className: "text-gray-600", children: user?.email })] })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsx("button", { onClick: () => doLogout({ confirm: true }), className: "rounded-lg border px-3 py-2 text-sm text-red-600 hover:bg-red-50", type: "button", children: "Logout" }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsx(Section, { title: "Basic information", children: _jsx(ProfileForm, { values: profile, onChange: handlePatch, onSubmit: saveProfile, saving: savingProfile }) }), _jsx(Section, { title: "Notifications", children: _jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "flex items-start gap-3 text-sm text-gray-700", children: [_jsx("input", { type: "checkbox", className: "mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500", checked: notifProduct, onChange: (e) => setNotifProduct(e.target.checked) }), _jsxs("span", { children: ["Product tips & updates", _jsx("span", { className: "block text-gray-500 text-xs", children: "Occasional emails about features and improvements." })] })] }), _jsxs("label", { className: "flex items-start gap-3 text-sm text-gray-700", children: [_jsx("input", { type: "checkbox", className: "mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500", checked: notifReminders, onChange: (e) => setNotifReminders(e.target.checked) }), _jsxs("span", { children: ["Reminders", _jsx("span", { className: "block text-gray-500 text-xs", children: "Expiring links, export reminders, and helpful nudges." })] })] }), _jsxs("label", { className: "flex items-start gap-3 text-sm text-gray-700", children: [_jsx("input", { type: "checkbox", className: "mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500", checked: notifNews, onChange: (e) => setNotifNews(e.target.checked) }), _jsxs("span", { children: ["News & offers", _jsx("span", { className: "block text-gray-500 text-xs", children: "Occasional announcements and discounts." })] })] })] }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsx(Section, { title: "Account", children: _jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Email" }), _jsx("input", { value: user?.email ?? "", disabled: true, className: "mt-1 w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm text-gray-700" }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Email changes are managed from your account settings." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Username" }), _jsx("input", { value: user?.username ?? nameFallback, disabled: true, className: "mt-1 w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm text-gray-700" })] })] }) }), _jsx(Section, { title: "Security", actions: _jsx("span", { className: "text-xs text-gray-500", children: "Min 8 characters" }), children: _jsxs("form", { onSubmit: savePassword, className: "grid gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Current password" }), _jsx("input", { type: "password", value: currentPwd, onChange: (e) => setCurrentPwd(e.target.value), className: "mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "New password" }), _jsx("input", { type: "password", value: newPwd, onChange: (e) => setNewPwd(e.target.value), className: "mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Confirm new password" }), _jsx("input", { type: "password", value: confirmPwd, onChange: (e) => setConfirmPwd(e.target.value), className: "mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { type: "submit", disabled: savingPwd || !newPwd || newPwd !== confirmPwd || newPwd.length < 8, className: "rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white disabled:opacity-60 hover:bg-indigo-700 disabled:hover:bg-indigo-600", children: savingPwd ? "Saving…" : "Update password" }), _jsx("button", { type: "button", className: "text-sm text-gray-600 hover:underline", children: "Forgot password?" })] })] }) }), _jsx(Section, { title: "Danger zone", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "Delete account" }), _jsx("p", { className: "text-xs text-gray-500", children: "This action is permanent and cannot be undone." })] }), _jsx("button", { type: "button", onClick: () => {
                                                    const ok = window.confirm("This will permanently delete your account and data. Continue?");
                                                    if (!ok)
                                                        return;
                                                    // await api.deleteAccount();
                                                    doLogout({ redirectTo: "/signup" });
                                                }, className: "rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700", children: "Delete" })] }) })] })] })] }) }));
};
export default Profile;
