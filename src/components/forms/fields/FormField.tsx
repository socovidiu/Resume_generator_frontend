import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helperText?: string;
};

export default function FormField({ id, label, helperText, ...inputProps }: Props) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        id={id}
        {...inputProps}
        className={
          "mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm " +
          "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 " +
          (inputProps.className ?? "")
        }
      />
      {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}