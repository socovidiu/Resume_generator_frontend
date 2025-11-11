import React, { useMemo, useState } from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormWatch,
  UseFormSetValue
} from "react-hook-form";
import { CVData } from "../../types/CVtype";
import {
  CanonicalProfile,
  KeywordsResponse,
} from "../../types/llm";
import { extractKeywords, generateCoverLetter } from "../../services/llm";

interface ReviewProps {
  register: UseFormRegister<CVData>;
  errors: FieldErrors<CVData>;
  handleSubmit: UseFormHandleSubmit<CVData>;
  onSubmit: (data: CVData) => void;
  watch: UseFormWatch<CVData>;
  setValue: UseFormSetValue<CVData>;
}

type UnknownRec = Record<string, unknown>;

function str(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function strOrNull(v: unknown): string | null {
  if (v == null) return null;
  return typeof v === "string" ? v : String(v);
}

function strArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
}

/** CVData -> CanonicalProfile (uses your actual field names) */
function useCanonicalProfile(watch: UseFormWatch<CVData>): CanonicalProfile {
  const firstName = watch("firstName");
  const lastName  = watch("lastName");
  const jobTitle  = watch("jobTitle");
  const summary   = watch("summary");

  const skills = Array.isArray(watch("skills")) ? (watch("skills") as string[]) : [];

  const workExperiences = (watch("workExperiences") ?? []) as UnknownRec[];
  const educations      = (watch("educations") ?? []) as UnknownRec[];

  const name = [firstName, lastName].filter(Boolean).join(" ").trim();

  const experience = workExperiences.map((w) => {
    const company = str(w.company) ?? str(w.employer) ?? "";
    const role    = str(w.title) ?? str(w.position) ?? jobTitle ?? "";
    const start   = strOrNull(w.startDate) ?? strOrNull(w.from);
    const end     = strOrNull(w.endDate) ?? strOrNull(w.to);

    const rawBullets =
      (w.bullets ?? w.responsibilities ?? w.highlights ?? w.description) as unknown;

    let bullets: string[] = [];
    if (Array.isArray(rawBullets)) {
      bullets = strArray(rawBullets);
    } else if (typeof rawBullets === "string") {
      bullets = rawBullets
        .split(/\r?\n|•|- /)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return { company, role, start, end, bullets };
  });

  const education = educations.map((ed) => {
    const school = str(ed.school) ?? str(ed.institution) ?? "";
    const degree = strOrNull(ed.degree) ?? strOrNull(ed.qualification);

    const year =
      strOrNull(ed.year) ??
      strOrNull(ed.graduationYear) ??
      strOrNull(ed.endDate) ??
      (typeof ed.date === "string" ? ed.date : strOrNull(ed.date));

    return { school, degree, year };
  });

  return {
    name,
    title: jobTitle ?? "",
    summary: summary ?? "",
    skills,
    experience,
    education,
  };
}


const Review: React.FC<ReviewProps> = ({ handleSubmit, onSubmit, watch }) => {
  // ---- UI-only local state (NOT part of the form) ----
  const [jd, setJd] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  const [loadingKW, setLoadingKW] = useState(false);
  const [loadingCL, setLoadingCL] = useState(false);

  const [kw, setKw] = useState<KeywordsResponse | null>(null);
  const [coverLetter, setCoverLetter] = useState("");

  // Build the profile payload on-the-fly from the current form values
  const profile = useCanonicalProfile(watch);

  const allCandidates = useMemo(() => {
    if (!kw) return [];
    const seq = [...(kw.skills || []), ...(kw.nice_to_have || []), ...(kw.keywords || [])];
    const uniq: string[] = [];
    const seen = new Set<string>();
    for (const s of seq) {
      const k = (s || "").trim().toLowerCase();
      if (!k || seen.has(k)) continue;
      seen.add(k);
      uniq.push(s);
    }
    return uniq;
  }, [kw]);

  async function onExtractKeywords() {
    if (!jd.trim()) return;
    try {
      setLoadingKW(true);
      const res = await extractKeywords({ job_description: jd });
      setKw(res ?? null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to extract keywords";
      alert(msg);
    } finally {
      setLoadingKW(false);
    }
  }

  async function onGenerateCoverLetter() {
    if (!jd.trim()) return;
    try {
      setLoadingCL(true);
      const res = await generateCoverLetter({
        profile,
        job_description: jd,
        company: company || undefined,
        role: role || undefined,
      });
      setCoverLetter(res?.cover_letter ?? "");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to generate cover letter";
      alert(msg);
    } finally {
      setLoadingCL(false);
    }
  }

  return (
    <div className="space-y-8 text-black">
      <div>
        <h2 className="text-xl font-semibold">Review</h2>
        <p className="text-sm text-gray-600">
          Use this space to analyze a Job Description and generate a tailored cover letter.
          These inputs are UI-only and won’t be saved to your CV.
        </p>
      </div>

      {/* ---- Inputs: JD / Company / Role (NOT registered with react-hook-form) ---- */}
      <div className="grid grid-cols-1 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Job Description</span>
          <textarea
            className="mt-1 w-full min-h-[140px] rounded border p-3 bg-white"
            placeholder="Paste the job description here…"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Company (optional)</span>
            <input
              className="mt-1 w-full rounded border p-2 bg-white"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="ACME Inc."
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Role (optional)</span>
            <input
              className="mt-1 w-full rounded border p-2 bg-white"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Senior Frontend Engineer"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onExtractKeywords}
            disabled={!jd.trim() || loadingKW}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {loadingKW ? "Extracting…" : "Extract keywords"}
          </button>

          <button
            type="button"
            onClick={onGenerateCoverLetter}
            disabled={!jd.trim() || loadingCL}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {loadingCL ? "Generating…" : "Generate cover letter"}
          </button>
        </div>
      </div>

      {/* ---- Results: Keywords (read-only) ---- */}
      {kw && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Keywords result</h3>

          <div className="text-sm text-gray-700">
            {kw.seniority && (
              <span className="inline-flex items-center rounded border px-2 py-1 mr-2">
                Seniority: <b className="ml-1">{kw.seniority}</b>
              </span>
            )}
            <span className="inline-flex items-center rounded border px-2 py-1">
              {(kw.keywords?.length ?? 0)} keywords, {(kw.skills?.length ?? 0)} skills,{" "}
              {(kw.nice_to_have?.length ?? 0)} nice-to-have
            </span>
          </div>

          {/* We show a text field to keep everything “formless” as requested */}
          <label className="block">
            <span className="text-sm font-medium">All extracted (read-only)</span>
            <textarea
              className="mt-1 w-full min-h-[120px] rounded border p-3 bg-gray-50"
              readOnly
              value={allCandidates.join(", ")}
            />
          </label>
        </div>
      )}

      {/* ---- Results: Cover Letter (editable text area, still not in RHF) ---- */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Cover Letter</h3>
        <textarea
          className="w-full min-h-[260px] rounded border p-3 bg-white"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Generate a cover letter above to populate this field…"
        />
        <div className="flex gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded border"
            onClick={() => coverLetter && navigator.clipboard.writeText(coverLetter)}
            disabled={!coverLetter}
          >
            Copy to clipboard
          </button>
        </div>
      </div>

      {/* Keep your existing Save/Continue from CvEditFormPanel; this component is not submitting anything */}
      <div className="hidden">
        {/* In case you want to keep the form context happy, we expose a no-op submit */}
        <form onSubmit={handleSubmit(onSubmit)} />
      </div>
    </div>
  );
};

export default Review;
