import React from "react";
import { useNavigate } from "react-router-dom";

export type CvCardData = {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
};

export default function CvCard({ cv }: { cv: CvCardData }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/resume/${cv.id}`)}
      className="group w-full text-left rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition shadow-sm hover:shadow-md overflow-hidden"
    >
      {/* Thumbnail / placeholder */}
      <div className="aspect-[3/4] bg-gray-100 relative">
        <div className="absolute inset-0 grid place-items-center">
          {/* simple doc preview placeholder */}
          <div className="h-16 w-12 bg-white border rounded-sm shadow" />
        </div>
      </div>

      {/* Meta */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {cv.firstName || cv.lastName ? `${cv.firstName} ${cv.lastName}` : "Fără titlu"}
          </h3>
        </div>
        <p className="mt-1 text-sm text-gray-600 line-clamp-1">{cv.jobTitle || "—"}</p>

        <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-500" /> Draft
          </span>
        </div>
      </div>
    </button>
  );
}
