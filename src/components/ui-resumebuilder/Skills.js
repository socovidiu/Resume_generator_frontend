import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
const Skills = ({ register, errors, handleSubmit, onSubmit, watch, setValue, }) => {
    const [newSkill, setNewSkill] = useState("");
    // Ensure RHF knows about the 'skills' field (and silences the unused warning)
    useEffect(() => {
        register("skills");
    }, [register]);
    const skills = (watch("skills") ?? []);
    const addSkill = () => {
        const s = newSkill.trim();
        if (s && !skills.includes(s)) {
            setValue("skills", [...skills, s], { shouldDirty: true, shouldValidate: true });
            setNewSkill("");
        }
    };
    const removeSkill = (index) => {
        const updated = [...skills];
        updated.splice(index, 1);
        setValue("skills", updated, { shouldDirty: true, shouldValidate: true });
    };
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "form-shell", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Skills" }), _jsxs("div", { className: "form-section", children: [_jsx("input", { type: "text", value: newSkill, onChange: (e) => setNewSkill(e.target.value), placeholder: "Add a skill...", className: "w-full border rounded-md p-2" }), _jsx("button", { type: "button", onClick: addSkill, className: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600", children: "Add" })] }), _jsx("div", { className: "flex flex-wrap gap-2 mt-4", children: skills.map((skill, index) => (_jsxs("div", { className: "flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full", children: [skill, _jsx("button", { type: "button", onClick: () => removeSkill(index), className: "text-red-500", children: "\u2716" })] }, `${skill}-${index}`))) }), skills.length === 0 && errors.skills?.message && (_jsx("p", { className: "text-red-500 text-xs mt-2", children: String(errors.skills.message) }))] }));
};
export default Skills;
