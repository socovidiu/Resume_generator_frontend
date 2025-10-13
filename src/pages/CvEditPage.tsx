import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// UI blocks
import CvEditFormPanel from "../components/ui-resumebuilder/CvEditFormPanel";
import ResumePreview from "../components/ui-preview/ResumePreview";
import ErrorBoundary from "../components/ErrorBoundary";
import CvEditLayout from "../layouts/CvEditLayout";

// Data / services
import type { CVData } from "../types/CVtype";
import { createCV, getCV, updateCV } from "../services/cv";
import type { CVResponse } from "../services/types";

// ---------- Steps ----------
const steps = ["Contact Info", "Summary", "Work Experience", "Education", "Skills"] as const;

// ---------- Helpers ----------
const LINK_TYPES = ["LinkedIn", "GitHub", "Website"] as const;
type LinkType = (typeof LINK_TYPES)[number];
function asLinkType(t: string): LinkType {
  return (LINK_TYPES as readonly string[]).includes(t as any) ? (t as LinkType) : "Website";
}

const resumeTemplates = ["Dark", "classic"]; // Placeholder for template selection

// format for API (ISO)
function toISO(dateStr?: string | null): string | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

// ---------- Initial form values ----------
const INITIAL_FORM: CVData = {
  firstName: "",
  lastName: "",
  jobTitle: "",
  city: "",
  country: "",
  postcode: "",
  phone: "",
  email: "",
  photo: null,
  summary: "",
  workExperiences: [],
  educations: [],
  skills: [],
  links: [],
};

const CvEditPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !params.id || params.id === "new";

  // UI-only state controlled here (CvEditFormPanel will bubble updates)
  const [renderMode, setRenderMode] = useState<"react" | "markup">("react");
  const [selectedTemplate, setSelectedTemplate] = useState<string>(resumeTemplates[0]);
  const [currentStep, setCurrentStep] = useState(0);

  // loading/saving/errors
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);

  // Initial values to hydrate the form panel
  const [initialValues, setInitialValues] = useState<CVData>(INITIAL_FORM);

  // Live preview data (fed by the form panel via onChangeLive)
  const [previewData, setPreviewData] = useState<CVData>(INITIAL_FORM);

  // Load existing CV for edit
  useEffect(() => {
    let mounted = true;
    if (isNew) {
      setInitialValues(INITIAL_FORM);
      setPreviewData(INITIAL_FORM);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await getCV(params.id!);

        if (!mounted) return;

        // Map API -> form shape
        const mapped: CVData = {
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          jobTitle: data.jobTitle ?? "",
          city: data.city ?? "",
          country: data.country ?? "",
          postcode: data.postcode ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          photo: data.photo ?? null,
          summary: data.summary ?? "",
          skills: data.skills ?? [],
          workExperiences: (data.workExperiences ?? []).map((w) => ({
            position: w.position ?? "",
            company: w.company ?? "",
            startDate: w.startDate ? w.startDate.slice(0, 10) : "",
            endDate: w.endDate ? w.endDate.slice(0, 10) : "",
            description: w.description ?? "",
          })),
          educations: (data.educations ?? []).map((e) => ({
            degree: e.degree ?? "",
            school: e.school ?? "",
            startDate: e.startDate ? e.startDate.slice(0, 10) : "",
            endDate: e.endDate ? e.endDate.slice(0, 10) : "",
          })),
          links: (data.links ?? []).map((l) => ({ type: asLinkType(l.type), url: l.url })),
        };

        setInitialValues(mapped);
        setPreviewData(mapped);
      } catch (e: any) {
        setError(e?.response?.data ?? "Failed to load CV.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isNew, params.id]);

  // Prepare payload with only backend fields (ISO dates, no UI extras)
  function toApiPayload(values: CVData) {
    return {
      firstName: values.firstName,
      lastName: values.lastName,
      city: values.city,
      country: values.country,
      postcode: values.postcode,
      phone: values.phone,
      email: values.email,
      photo: values.photo,
      jobTitle: values.jobTitle,
      summary: values.summary,
      skills: values.skills ?? [],
      workExperiences: (values.workExperiences ?? []).map((w) => ({
        position: w.position,
        company: w.company,
        startDate: toISO(w.startDate)!,
        endDate: toISO(w.endDate),
        description: w.description,
      })),
      educations: (values.educations ?? []).map((e) => ({
        degree: e.degree,
        school: e.school,
        startDate: toISO(e.startDate)!,
        endDate: toISO(e.endDate),
      })),
      links: (values.links ?? []).map((l) => ({ type: l.type, url: l.url })),
    };
  }

  // Save handler (called by the panel)
  const handleSave = async (values: CVData) => {
    setSaving(true);
    setError(null);
    try {
      const payload = toApiPayload(values);
      let saved: CVResponse;

      if (isNew) {
        saved = await createCV(payload);
        navigate(`/cvs/${saved.id}`, { replace: true });
      } else {
        saved = await updateCV(params.id!, payload);
        // keep preview in sync with what user sees after save
        setPreviewData(values);
      }
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <p className="text-gray-600">Loading CV…</p>
      </div>
    );
  }

  return (
    <CvEditLayout
      form={
        <CvEditFormPanel
          // hydrate the form
          defaultValues={initialValues}
          steps={[...steps]}
          isNew={isNew}
          saving={saving}
          // main submit
          onSubmit={handleSave}
          // keep preview live as the user types (if your panel implements this)
          onChange={(data: CVData) => setPreviewData(data)}
          // reflect UI-only bits (template/mode/step) from inside the panel
          onUiChange={({ selectedTemplate: t, renderMode: m, step }) => {
            setSelectedTemplate(t);
            setRenderMode(m);
            setCurrentStep(step);
          }}
        />
      }
      preview={
        <ErrorBoundary>
          {renderMode === "react" ? (
            <ResumePreview resumeData={previewData} template={selectedTemplate} />
          ) : (
            // If you later support markup mode, render your MarkupPreview component here.
            <div className="p-6 text-sm text-gray-600">Markup preview coming soon…</div>
          )}
          {error && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-red-700">
              {error}
            </div>
          )}
        </ErrorBoundary>
      }
    />
  );
};

export default CvEditPage;
