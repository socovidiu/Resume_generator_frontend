import React from "react";

export default function PasswordField({
  id, value, onChange, placeholder, label = "Password",
}: {
  id: string; value: string; onChange: (v: string) => void; placeholder?: string; label?: string;
}) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        placeholder={placeholder ?? "••••••••"}
        className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 pr-14"
      />
      <button
        type="button"
        onClick={()=>setShow(s=>!s)}
        className="absolute right-2 bottom-2 text-sm text-gray-500 hover:text-gray-700"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}