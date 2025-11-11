import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import StepProgressBar from "./StepProgressBar";
import ContactInfo from "./ContactInfo";
import Summary from "./Summary";
import WorkExperience from "./WorkExperience";
import Education from "./Education";
import Skills from "./Skills";
import Review from "./Review";
import Button from "../ui-elements/Button";
export default function CvEditFormPanel({ defaultValues, steps = ["Contact Info", "Summary", "Work Experience", "Education", "Skills", "Review"], initialStep = 0, saving = false, isNew = false, onSubmit, onChange, onUiChange, className, }) {
    const { register, handleSubmit, control, setValue, watch, formState: { errors }, } = useForm({
        defaultValues: defaultValues ?? {},
        mode: "onSubmit",
    });
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [error, setError] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState("classic");
    const [renderMode, setRenderMode] = useState("react");
    const goBack = () => setCurrentStep((s) => Math.max(0, s - 1));
    const goNext = () => setCurrentStep((s) => Math.min(steps.length - 1, s + 1));
    // Stable submit to satisfy hooks/exhaustive-deps
    const submit = useCallback(async (data) => {
        setError(null);
        try {
            onChange?.(data);
            await onSubmit?.(data);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong while saving.";
            setError(message);
        }
    }, [onChange, onSubmit]);
    // bubble UI state up when it changes (useful for preview)
    React.useEffect(() => {
        onUiChange?.({ selectedTemplate, renderMode, step: currentStep });
    }, [selectedTemplate, renderMode, currentStep, onUiChange]);
    // emit changes when form values update
    React.useEffect(() => {
        const sub = watch((data) => {
            onChange?.(data);
        });
        return () => sub.unsubscribe();
    }, [watch, onChange]);
    // memoized steps nodes (RHF bits passed to step components)
    const stepNode = useMemo(() => {
        switch (currentStep) {
            case 0:
                return (_jsx(ContactInfo, { register: register, errors: errors, handleSubmit: handleSubmit, control: control, setValue: setValue, onSubmit: submit, photo: photo, setPhoto: setPhoto }));
            case 1:
                return (_jsx(Summary, { register: register, errors: errors, handleSubmit: handleSubmit, onSubmit: submit }));
            case 2:
                return (_jsx(WorkExperience, { register: register, errors: errors, handleSubmit: handleSubmit, onSubmit: submit, control: control }));
            case 3:
                return (_jsx(Education, { register: register, errors: errors, handleSubmit: handleSubmit, onSubmit: submit, control: control }));
            case 4:
                return (_jsx(Skills, { register: register, errors: errors, handleSubmit: handleSubmit, onSubmit: submit, watch: watch, setValue: setValue }));
            case 5:
                return (_jsx(Review, { register: register, errors: errors, handleSubmit: handleSubmit, onSubmit: submit, watch: watch, setValue: setValue }));
            default:
                return null;
        }
    }, [
        currentStep,
        register,
        errors,
        handleSubmit,
        control,
        setValue,
        submit, // now stable (useCallback)
        photo,
        watch,
    ]);
    return (_jsxs("div", { className: ["w-full p-8 bg-white flex flex-col min-h-full", className || ""].join(" "), children: [_jsx(StepProgressBar, { steps: steps, currentStep: currentStep }), error && (_jsx("div", { className: "mt-3 mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-red-700", children: error })), stepNode, _jsxs("div", { className: "form-actions", children: [_jsx(Button, { type: "button", onClick: goBack, variant: "secondary", size: "lg", children: "BACK" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Button, { type: "button", onClick: handleSubmit(submit), variant: "primary", size: "lg", disabled: saving, children: saving ? "Saving…" : isNew ? "Save Draft" : "Save" }), _jsx(Button, { type: "button", onClick: goNext, variant: "navigation", size: "lg", children: currentStep === steps.length - 1 ? "FINISH" : "CONTINUE" })] })] }), _jsxs("div", { className: "mt-6 text-black", children: [_jsx("h3", { className: "text-lg font-bold mb-2", children: "Choose Template:" }), _jsxs("select", { className: "p-2 border rounded-lg bg-gray-100", value: selectedTemplate, onChange: (e) => setSelectedTemplate(e.target.value), children: [_jsx("option", { value: "classic", children: "Classic" }), _jsx("option", { value: "modern", children: "Modern" }), _jsx("option", { value: "dark", children: "Dark" })] })] }), _jsxs("div", { className: "mt-4 flex gap-3 text-black", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "radio", checked: renderMode === "react", onChange: () => setRenderMode("react") }), "React Template"] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "radio", checked: renderMode === "markup", onChange: () => setRenderMode("markup") }), "Markup Template"] })] })] }));
}
