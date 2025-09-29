// src/pages/CvEditPage.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

// UI blocks
import ContactInfo from "../components/ui-resumebuilder/ContactInfo";
import Summary from "../components/ui-resumebuilder/Summary";
import WorkExperience from "../components/ui-resumebuilder/WorkExperience";
import Education from "../components/ui-resumebuilder/Education";
import Skills from "../components/ui-resumebuilder/Skills";
import ResumePreview from "../components/ui-preview/ResumePreview";
import StepProgressBar from "../components/ui-resumebuilder/StepProgressBar";
import Button from "../components/ui-elements/Button";
import ErrorBoundary from "../components/ErrorBoundary";
import TemplatePreview from "../components/ui-preview/TemplatePreview";

// Data / services
import { resumeTemplates } from "../CV templates/resumeTemplates";
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
  links: [], // managed by RHF (ContactInfo)
};

const CvEditPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !params.id || params.id === "new";

  const [renderMode, setRenderMode] = useState<"react" | "markup">("react");
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof resumeTemplates>("classic");
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);

  // photo preview lives here; ContactInfo syncs it to the form via setValue("photo", ...)
  const [photo, setPhoto] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<CVData>({
    defaultValues: INITIAL_FORM,
  });

  // live preview
  const formValues = watch();

  // Load existing CV for edit
  useEffect(() => {
    let mounted = true;
    if (isNew) {
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

        reset(mapped);
        setPhoto(mapped.photo ?? null);
      } catch (e: any) {
        setError(e?.response?.data ?? "Failed to load CV.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isNew, params.id, reset]);

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

  async function onSubmit(values: CVData) {
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
        // reset the form with what the user has (or you can map back from `saved`)
        reset(values);
      }
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  // Stepper handlers
  const goBack = () => setCurrentStep((s) => Math.max(0, s - 1));
  const goNext = () =>
    handleSubmit((data) => {
      if (currentStep === steps.length - 1) {
        onSubmit(data);
      } else {
        setCurrentStep((s) => Math.min(steps.length - 1, s + 1));
      }
    })();

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <p className="text-gray-600">Loading CV…</p>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen">
      {/* Left: form/steps */}
      <div className="w-full p-8 bg-white flex flex-col justify-center">
        <StepProgressBar steps={[...steps]} currentStep={currentStep} />

        {error && (
          <div className="mt-3 mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-red-700">
            {error}
          </div>
        )}

        {currentStep === 0 && (
          <ContactInfo
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            control={control}
            setValue={setValue}
            onSubmit={onSubmit}
            photo={photo}
            setPhoto={setPhoto}
          />
        )}

        {currentStep === 1 && (
          <Summary register={register} errors={errors} handleSubmit={handleSubmit} onSubmit={onSubmit} />
        )}

        {currentStep === 2 && (
          <WorkExperience
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            control={control}
          />
        )}

        {currentStep === 3 && (
          <Education
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            control={control}
          />
        )}

        {currentStep === 4 && (
          <Skills
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            watch={watch}
            setValue={setValue}
          />
        )}

        {/* Navigation + Save */}
        <div className="mt-6 flex items-center justify-between">
          <Button type="button" onClick={goBack} variant="secondary" size="lg">
            BACK
          </Button>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              variant="primary"
              size="lg"
              disabled={saving}
            >
              {saving ? "Saving…" : isNew ? "Save Draft" : "Save"}
            </Button>

            <Button type="button" onClick={goNext} variant="navigation" size="lg">
              {currentStep === steps.length - 1 ? "FINISH" : "CONTINUE"}
            </Button>
          </div>
        </div>

        {/* Template selector (UI-only) */}
        <div className="mt-6 text-black">
          <h3 className="text-lg font-bold mb-2">Choose Template:</h3>
          <select
            className="p-2 border rounded-lg bg-gray-100"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value as keyof typeof resumeTemplates)}
          >
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        {/* Render mode selector*/}
        <div className="mt-4 flex gap-3 text-black">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={renderMode === "react"}
              onChange={() => setRenderMode("react")}
            />
            React Template
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={renderMode === "markup"}
              onChange={() => setRenderMode("markup")}
            />
            Markup Template
          </label>
        </div>
      </div>

      {/* Right: live preview */}
      <div className="w-full min-h-full p-8 bg-gray-700 flex justify-center items-center">
        <ErrorBoundary>
          {renderMode === "react" ? (
            <ResumePreview resumeData={formValues} />
          ) : (
            <TemplatePreview
              template={resumeTemplates[selectedTemplate].markup}
              css={`
                .resume { width: 210mm; min-height: 297mm; padding: 16mm; }
                ${resumeTemplates[selectedTemplate].css}
              `}
              data={formValues}
              documentTitle="My_CV"
            />
          )}        
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default CvEditPage;
