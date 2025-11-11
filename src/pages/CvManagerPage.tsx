import React, { useEffect, useState } from "react";
import { listCVs } from "../services/cv";
import type { CVResponse } from "../services/types";
import CvCard, { CvCardData } from "../components/ui-cvmanagement/CvCard";
import NewCvCard from "../components/ui-cvmanagement/NewCvCard";

function errorMessage(e: unknown, fallback: string): string {
  if (e && typeof e === "object") {
    const obj = e as Record<string, unknown>;
    const resp = obj["response"] as Record<string, unknown> | undefined;
    const data = resp?.["data"];
    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
      const msg = (data as Record<string, unknown>)["message"];
      if (typeof msg === "string") return msg;
    }
    const direct = obj["message"];
    if (typeof direct === "string") return direct;
  }
  return fallback;
}

export default function CvManager() {
  const [items, setItems] = useState<CVResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listCVs();
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch (e: unknown) {
        setError(errorMessage(e, "Could not load CVs"));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="py-6">
      {/* Tabs like the screenshot */}
      <div className="mb-6 border-b">
        <nav className="flex gap-6">
          <button className="pb-3 -mb-px border-b-2 border-blue-500 text-blue-600 font-medium">
            CV-uri
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] rounded-xl bg-gray-200" />
              <div className="mt-3 h-4 w-2/3 bg-gray-200 rounded" />
              <div className="mt-2 h-3 w-1/3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : items.length === 0 ? (
        <div className="space-y-6">
          <div className="text-gray-600">No CVs yet — create your first one!</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <NewCvCard />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Existing CVs */}
          {items.map((cv) => {
            const cardData: CvCardData = {
              id: cv.id!,
              firstName: cv.firstName,
              lastName: cv.lastName,
              jobTitle: cv.jobTitle,
            };
            return <CvCard cv={cardData} key={cv.id} />;
          })}

          {/* New CV Card */}
          <NewCvCard />
        </div>
      )}
    </div>
  );
}
