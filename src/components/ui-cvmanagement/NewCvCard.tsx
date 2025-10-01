import React from "react";
import { useNavigate } from "react-router-dom";

export default function NewCvCard() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/resume/new")}
      className="w-full rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 bg-white hover:bg-blue-50/40 transition grid place-items-center aspect-[3/4] shadow-sm"
    >
      <div className="text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-gray-100">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <p className="font-semibold text-gray-800">CV nou</p>
        <p className="text-sm text-gray-600">Începe un CV personalizat</p>
      </div>
    </button>
  );
}
