import React from "react";

const AuthLayout: React.FC<{ children: React.ReactNode; title?: string; blurb?: string }> = ({
  children,
  title = "Welcome",
  blurb = "Create, edit, and manage your CVs with ease."
}) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — marketing panel */}
          <div className="hidden lg:flex flex-col justify-center rounded-2xl bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-blue-50 to-white p-10 border">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600">{blurb}</p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• ATS-friendly templates</li>
                <li>• One-click export to PDF</li>
                <li>• Version history & quick edits</li>
              </ul>
            </div>
          </div>

          {/* Right — form card */}
          <div className="flex items-center">
            <div className="w-full lg:max-w-md mx-auto bg-white/90 backdrop-blur rounded-2xl border shadow-lg p-6 sm:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
