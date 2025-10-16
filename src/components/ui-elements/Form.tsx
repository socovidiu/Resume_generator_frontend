import React from "react";

export function Field({
  label, htmlFor, error, hint, children,
}: { label: string; htmlFor: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-800">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-600" id={`${htmlFor}-error`}>{error}</p>}
    </div>
  );
}

export function Input({
  id, invalid, className = "", ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={[
        "w-full rounded-lg shadow-sm",
        "bg-white border ring-1 ring-inset",
        invalid
          ? "border-red-300 ring-red-300 focus:ring-2 focus:ring-red-400"
          : "border-gray-300 ring-gray-300 focus:ring-2 focus:ring-blue-400",
        "px-3 py-2 placeholder:text-gray-400 outline-none transition",
        className,
      ].join(" ")}
      {...rest}
    />
  );
}

export function Textarea({
  id, invalid, className = "", ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={[
        "w-full rounded-lg shadow-sm resize-none",
        "bg-white border ring-1 ring-inset min-h-28",
        invalid
          ? "border-red-300 ring-red-300 focus:ring-2 focus:ring-red-400"
          : "border-gray-300 ring-gray-300 focus:ring-2 focus:ring-blue-400",
        "px-3 py-2 placeholder:text-gray-400 outline-none transition",
        className,
      ].join(" ")}
      {...rest}
    />
  );
}

export function Select({
  id, invalid, className = "", ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <select
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={[
        "w-full rounded-lg shadow-sm bg-white border ring-1 ring-inset px-3 py-2",
        invalid
          ? "border-red-300 ring-red-300 focus:ring-2 focus:ring-red-400"
          : "border-gray-300 ring-gray-300 focus:ring-2 focus:ring-blue-400",
        "outline-none transition",
        className,
      ].join(" ")}
      {...rest}
    />
  );
}
