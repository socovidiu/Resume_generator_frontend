import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { extractKeywords, generateCoverLetter } from "../../services/llm";
function str(v) {
    return typeof v === "string" ? v : null;
}
function strOrNull(v) {
    if (v == null)
        return null;
    return typeof v === "string" ? v : String(v);
}
function strArray(v) {
    if (!Array.isArray(v))
        return [];
    return v.filter((x) => typeof x === "string" && x.trim().length > 0);
}
/** CVData -> CanonicalProfile (uses your actual field names) */
function useCanonicalProfile(watch) {
    const firstName = watch("firstName");
    const lastName = watch("lastName");
    const jobTitle = watch("jobTitle");
    const summary = watch("summary");
    const skills = Array.isArray(watch("skills")) ? watch("skills") : [];
    const workExperiences = (watch("workExperiences") ?? []);
    const educations = (watch("educations") ?? []);
    const name = [firstName, lastName].filter(Boolean).join(" ").trim();
    const experience = workExperiences.map((w) => {
        const company = str(w.company) ?? str(w.employer) ?? "";
        const role = str(w.title) ?? str(w.position) ?? jobTitle ?? "";
        const start = strOrNull(w.startDate) ?? strOrNull(w.from);
        const end = strOrNull(w.endDate) ?? strOrNull(w.to);
        const rawBullets = (w.bullets ?? w.responsibilities ?? w.highlights ?? w.description);
        let bullets = [];
        if (Array.isArray(rawBullets)) {
            bullets = strArray(rawBullets);
        }
        else if (typeof rawBullets === "string") {
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
        const year = strOrNull(ed.year) ??
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
const Review = ({ handleSubmit, onSubmit, watch }) => {
    // ---- UI-only local state (NOT part of the form) ----
    const [jd, setJd] = useState("");
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [loadingKW, setLoadingKW] = useState(false);
    const [loadingCL, setLoadingCL] = useState(false);
    const [kw, setKw] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");
    // Build the profile payload on-the-fly from the current form values
    const profile = useCanonicalProfile(watch);
    const allCandidates = useMemo(() => {
        if (!kw)
            return [];
        const seq = [...(kw.skills || []), ...(kw.nice_to_have || []), ...(kw.keywords || [])];
        const uniq = [];
        const seen = new Set();
        for (const s of seq) {
            const k = (s || "").trim().toLowerCase();
            if (!k || seen.has(k))
                continue;
            seen.add(k);
            uniq.push(s);
        }
        return uniq;
    }, [kw]);
    async function onExtractKeywords() {
        if (!jd.trim())
            return;
        try {
            setLoadingKW(true);
            const res = await extractKeywords({ job_description: jd });
            setKw(res ?? null);
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : "Failed to extract keywords";
            alert(msg);
        }
        finally {
            setLoadingKW(false);
        }
    }
    async function onGenerateCoverLetter() {
        if (!jd.trim())
            return;
        try {
            setLoadingCL(true);
            const res = await generateCoverLetter({
                profile,
                job_description: jd,
                company: company || undefined,
                role: role || undefined,
            });
            setCoverLetter(res?.cover_letter ?? "");
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : "Failed to generate cover letter";
            alert(msg);
        }
        finally {
            setLoadingCL(false);
        }
    }
    return (_jsxs("div", { className: "space-y-8 text-black", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold", children: "Review" }), _jsx("p", { className: "text-sm text-gray-600", children: "Use this space to analyze a Job Description and generate a tailored cover letter. These inputs are UI-only and won\u2019t be saved to your CV." })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4", children: [_jsxs("label", { className: "block", children: [_jsx("span", { className: "text-sm font-medium", children: "Job Description" }), _jsx("textarea", { className: "mt-1 w-full min-h-[140px] rounded border p-3 bg-white", placeholder: "Paste the job description here\u2026", value: jd, onChange: (e) => setJd(e.target.value) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("label", { className: "block", children: [_jsx("span", { className: "text-sm font-medium", children: "Company (optional)" }), _jsx("input", { className: "mt-1 w-full rounded border p-2 bg-white", value: company, onChange: (e) => setCompany(e.target.value), placeholder: "ACME Inc." })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: "text-sm font-medium", children: "Role (optional)" }), _jsx("input", { className: "mt-1 w-full rounded border p-2 bg-white", value: role, onChange: (e) => setRole(e.target.value), placeholder: "Senior Frontend Engineer" })] })] }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx("button", { type: "button", onClick: onExtractKeywords, disabled: !jd.trim() || loadingKW, className: "px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50", children: loadingKW ? "Extracting…" : "Extract keywords" }), _jsx("button", { type: "button", onClick: onGenerateCoverLetter, disabled: !jd.trim() || loadingCL, className: "px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50", children: loadingCL ? "Generating…" : "Generate cover letter" })] })] }), kw && (_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Keywords result" }), _jsxs("div", { className: "text-sm text-gray-700", children: [kw.seniority && (_jsxs("span", { className: "inline-flex items-center rounded border px-2 py-1 mr-2", children: ["Seniority: ", _jsx("b", { className: "ml-1", children: kw.seniority })] })), _jsxs("span", { className: "inline-flex items-center rounded border px-2 py-1", children: [(kw.keywords?.length ?? 0), " keywords, ", (kw.skills?.length ?? 0), " skills,", " ", (kw.nice_to_have?.length ?? 0), " nice-to-have"] })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: "text-sm font-medium", children: "All extracted (read-only)" }), _jsx("textarea", { className: "mt-1 w-full min-h-[120px] rounded border p-3 bg-gray-50", readOnly: true, value: allCandidates.join(", ") })] })] })), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Cover Letter" }), _jsx("textarea", { className: "w-full min-h-[260px] rounded border p-3 bg-white", value: coverLetter, onChange: (e) => setCoverLetter(e.target.value), placeholder: "Generate a cover letter above to populate this field\u2026" }), _jsx("div", { className: "flex gap-2", children: _jsx("button", { type: "button", className: "px-3 py-1.5 rounded border", onClick: () => coverLetter && navigator.clipboard.writeText(coverLetter), disabled: !coverLetter, children: "Copy to clipboard" }) })] }), _jsx("div", { className: "hidden", children: _jsx("form", { onSubmit: handleSubmit(onSubmit) }) })] }));
};
export default Review;
