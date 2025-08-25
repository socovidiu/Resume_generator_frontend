// src/pages/CvEditPage.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

// UI blocks you already have
import ContactInfo from "../components/ui-resumebuilder/ContactInfo";
import Summary from "../components/ui-resumebuilder/Summary";
import WorkExperience from "../components/ui-resumebuilder/WorkExperience";
import Education from "../components/ui-resumebuilder/Education";
import Skills from "../components/ui-resumebuilder/Skills";
import ResumePreview from "../components/ui-resumebuilder/ResumePreview";
import StepProgressBar from "../components/ui-resumebuilder/StepProgressBar";
import Button from "../components/ui-elements/Button";
import ErrorBoundary from "../components/ErrorBoundary";

// Data / services
import { resumeTemplates } from "../CV templates/resumeTemplates";
import type { CVData } from "../types/CVtype"; // your local type used by the form/preview
import { createCV, getCV, updateCV } from "../services/cv"; // from services we set up earlier
import type { CVResponse } from "../services/types";

// ---------- Step labels ----------
const steps = ["Contact Info", "Summary", "Work Experience", "Education", "Skills"];


// ---------- Link types and initial form defaults ----------
const LINK_TYPES = ["LinkedIn", "GitHub", "Website"] as const;
type LinkType = (typeof LINK_TYPES)[number];

function asLinkType(t: string): LinkType {
  return (LINK_TYPES as readonly string[]).includes(t) ? (t as LinkType) : "Website";
}

// ---------- Initial form defaults ----------
const INITIAL_FORM: CVData = {
  firstName: "",
  lastName: "",
  jobTitle: "",
  city: "",
  country: "",
  postcode: "",
  phone: "",
  email: "",
  photo: null,               // base64 or null
  colorHex: "#3b82f6",       // used only by preview/UI
  borderStyle: "rounded",    // used only by preview/UI
  summary: "",
  workExperiences: [
    // { position:"", company:"", startDate:"", endDate:"", description:"" }
  ],
  educations: [
    // { degree:"", school:"", startDate:"", endDate:"" }
  ],
  skills: [],
  links: [],                 // if your UI collects them; otherwise leave []
};

const CvEditPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !params.id || params.id === "new";
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof resumeTemplates>("classic");
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<CVData>({ defaultValues: INITIAL_FORM });

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
        // Map API -> form shape (strings for dates are fine)
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
          colorHex: "#3b82f6",
          borderStyle: "rounded",
          summary: data.summary ?? "",
          skills: data.skills ?? [],
          workExperiences: (data.workExperiences ?? []).map(w => ({
            position: w.position ?? "",
            company: w.company ?? "",
            startDate: (w.startDate as unknown as string) ?? "",
            endDate: (w.endDate as unknown as string) ?? "",
            description: w.description ?? "",
          })),
          educations: (data.educations ?? []).map(e => ({
            degree: e.degree ?? "",
            school: e.school ?? "",
            startDate: (e.startDate as unknown as string) ?? "",
            endDate: (e.endDate as unknown as string) ?? "",
          })),
          links: (data.links ?? []).map(l => ({ type: asLinkType(l.type), url: l.url })),
        };
        reset(mapped);
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

  // Prepare payload with only backend fields
  function toApiPayload(values: CVData) {
    return {
      firstName: values.firstName,
      lastName: values.lastName,
      city: values.city,
      country: values.country,
      postcode: values.postcode,
      phone: values.phone,
      email: values.email,
      photo: values.photo,              // string | null
      jobTitle: values.jobTitle,
      summary: values.summary,
      skills: values.skills ?? [],
      workExperiences: (values.workExperiences ?? []).map(w => ({
        position: w.position,
        company: w.company,
        // Dates: backend expects DateTime; ISO strings are fine
        startDate: w.startDate ? new Date(w.startDate).toISOString() : new Date().toISOString(),
        endDate: w.endDate ? new Date(w.endDate).toISOString() : null,
        description: w.description,
      })),
      educations: (values.educations ?? []).map(e => ({
        degree: e.degree,
        school: e.school,
        startDate: e.startDate ? new Date(e.startDate).toISOString() : new Date().toISOString(),
        endDate: e.endDate ? new Date(e.endDate).toISOString() : null,
      })),
      links: (values.links ?? []).map(l => ({ type: l.type, url: l.url })),
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
        // go to the newly created CV editor
        navigate(`/cvs/${saved.id}`, { replace: true });
      } else {
        saved = await updateCV(params.id!, payload);
        // keep user here, but refresh form with whatever backend returns
        reset({
          ...values,
          // keep UI-only fields as-is
          ...{
            colorHex: formValues.colorHex,
            borderStyle: formValues.borderStyle,
          },
        });
      }
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  // Button handlers for stepper
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
        <StepProgressBar steps={steps} currentStep={currentStep} />

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
            onSubmit={onSubmit}
            photo={formValues.photo ?? null}
            setPhoto={(v: string | null) => setValue("photo", v)}
          />
        )}

        {currentStep === 1 && (
          <Summary
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
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
            {/* explicit Save button (doesn't move steps) */}
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
            onChange={(e) =>
              setSelectedTemplate(e.target.value as keyof typeof resumeTemplates)
            }
          >
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      {/* Right: live preview */}
      <div className="w-full min-h-full p-8 bg-gray-700 flex justify-center items-center">
        <ErrorBoundary>
          <ResumePreview resumeData={formValues} />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default CvEditPage;
