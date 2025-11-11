import React, { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

// ---- Adjust these import paths to match your project structure ----
import StepProgressBar from "./StepProgressBar";
import ContactInfo from "./ContactInfo";
import Summary from "./Summary";
import WorkExperience from "./WorkExperience";
import Education from "./Education";
import Skills from "./Skills";
import Review from "./Review";
import Button from "../ui-elements/Button";

// -------------------------------------------------------------------
type RenderMode = "react" | "markup";

// Shape of your overall CV form data (use your existing type if you have one)
export type CvFormValues = any;

type Props = {
  defaultValues?: Partial<CvFormValues>;
  steps?: string[];
  initialStep?: number;
  saving?: boolean;
  isNew?: boolean;

  // callbacks
  onSubmit?: (data: CvFormValues) => Promise<any> | void;
  onChange?: (data: CvFormValues) => void; // emits on valid submit only; add live change if you want
  onUiChange?: (ui: { selectedTemplate: string; renderMode: RenderMode; step: number }) => void;

  className?: string;
};

export default function CvEditFormPanel({
  defaultValues,
  steps = ["Contact Info", "Summary", "Work Experience", "Education", "Skills", "Review"],
  initialStep = 0,
  saving = false,
  isNew = false,
  onSubmit,
  onChange,
  onUiChange,
  className,
}: Props) {
  // react-hook-form lives HERE now
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CvFormValues>({
    defaultValues: (defaultValues as CvFormValues) ?? {},
    mode: "onSubmit",
  });

  // wizard state + UI-only bits live HERE too
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<"classic" | "modern" | "dark">("classic");
  const [renderMode, setRenderMode] = useState<RenderMode>("react");

  const goBack = () => setCurrentStep((s) => Math.max(0, s - 1));
  const goNext = () => setCurrentStep((s) => Math.min(steps.length - 1, s + 1));

  const submit: SubmitHandler<CvFormValues> = async (data) => {
    setError(null);
    try {
      onChange?.(data);
      await onSubmit?.(data);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong while saving.");
    }
  };

  // bubble UI state up when it changes (useful for preview)
  React.useEffect(() => {
    onUiChange?.({ selectedTemplate, renderMode, step: currentStep });
  }, [selectedTemplate, renderMode, currentStep, onUiChange]);

  React.useEffect(() => {
    const sub = watch((data) => {
      onChange?.(data as CvFormValues);
    });
    return () => sub.unsubscribe();
  }, [watch, onChange]);
  // memoized steps nodes (we still pass RHF bits to your existing step components)
  const stepNode = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <ContactInfo
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            control={control}
            setValue={setValue}
            onSubmit={submit}
            photo={photo}
            setPhoto={setPhoto}
          />
        );
      case 1:
        return <Summary register={register} errors={errors} handleSubmit={handleSubmit} onSubmit={submit} />;
      case 2:
        return (
          <WorkExperience
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={submit}
            control={control}
          />
        );
      case 3:
        return (
          <Education
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={submit}
            control={control}
          />
        );
      case 4:
        return (
          <Skills
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={submit}
            watch={watch}
            setValue={setValue}
          />
        );
      case 5:
        return (
          <Review
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={submit}
            watch={watch}
            setValue={setValue}
          />
        );
      default:
        return null;
    }
  }, [currentStep, register, errors, handleSubmit, control, setValue, submit, photo, watch]);

  return (
    <div className={["w-full p-8 bg-white flex flex-col min-h-full", className || ""].join(" ")}>
      <StepProgressBar steps={steps} currentStep={currentStep} />

      {error && (
        <div className="mt-3 mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-red-700">
          {error}
        </div>
      )}

      {stepNode}

      {/* Navigation + Save */}
      <div className="form-actions">
        <Button type="button" onClick={goBack} variant="secondary" size="lg">
          BACK
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={handleSubmit(submit)}
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
          onChange={(e) => setSelectedTemplate(e.target.value as any)}
        >
          <option value="classic">Classic</option>
          <option value="modern">Modern</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* Render mode selector */}
      <div className="mt-4 flex gap-3 text-black">
        <label className="flex items-center gap-2">
          <input type="radio" checked={renderMode === "react"} onChange={() => setRenderMode("react")} />
          React Template
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" checked={renderMode === "markup"} onChange={() => setRenderMode("markup")} />
          Markup Template
        </label>
      </div>
    </div>
  );
}