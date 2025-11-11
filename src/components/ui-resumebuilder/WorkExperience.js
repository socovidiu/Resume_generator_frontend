import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useFieldArray } from "react-hook-form";
const WorkExperience = ({ register, errors, handleSubmit, onSubmit, control }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "workExperiences",
    });
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "form-shell", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Work Experience" }), fields.map((field, index) => (_jsxs("div", { className: "form-section", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold", children: "Job Title" }), _jsx("input", { ...register(`workExperiences.${index}.position`, {
                                    required: "Job title is required",
                                }), className: "w-full border rounded-md p-2", placeholder: "e.g., Software Engineer" }), errors.workExperiences?.[index]?.position && (_jsx("p", { className: "text-red-500 text-xs", children: errors.workExperiences[index]?.position?.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold", children: "Company" }), _jsx("input", { ...register(`workExperiences.${index}.company`, {
                                    required: "Company is required",
                                }), className: "w-full border rounded-md p-2", placeholder: "Company Name" }), errors.workExperiences?.[index]?.company && (_jsx("p", { className: "text-red-500 text-xs", children: errors.workExperiences[index]?.company?.message }))] }), _jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold", children: "Start Date" }), _jsx("input", { type: "date", ...register(`workExperiences.${index}.startDate`, {
                                            required: "Start date is required",
                                        }), className: "w-full border rounded-md p-2" }), errors.workExperiences?.[index]?.startDate && (_jsx("p", { className: "text-red-500 text-xs", children: errors.workExperiences[index]?.startDate?.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold", children: "End Date" }), _jsx("input", { type: "date", ...register(`workExperiences.${index}.endDate`), className: "w-full border rounded-md p-2" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold", children: "Description" }), _jsx("textarea", { ...register(`workExperiences.${index}.description`), className: "w-full border rounded-md p-2 resize-none", placeholder: "Brief description of your role" })] }), _jsx("button", { type: "button", onClick: () => remove(index), className: "mt-2 text-red-500 hover:underline text-sm", children: "Remove Experience" })] }, field.id))), _jsx("button", { type: "button", onClick: () => append({
                    position: "",
                    company: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                }), className: "mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600", children: "+ Add Another Job" })] }));
};
export default WorkExperience;
