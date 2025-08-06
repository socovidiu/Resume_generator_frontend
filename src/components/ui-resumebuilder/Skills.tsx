import React, { useState } from "react";
import { UseFormRegister, FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { CVData } from "../../types/CVtype";

interface SkillsProps {
    register: UseFormRegister<CVData>;
    errors: FieldErrors<CVData>;
    handleSubmit: UseFormHandleSubmit<CVData>;
    onSubmit: (data: CVData) => void;
    watch: any; // Needed to watch skills array
    setValue: (name: keyof CVData, value: any) => void; // Needed to update skills array
}

const Skills: React.FC<SkillsProps> = ({ register, errors, handleSubmit, onSubmit, watch, setValue }) => {
    const [newSkill, setNewSkill] = useState<string>("");

    const skills = watch("skills") || []; // This watches the skills array directly

    const addSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setValue("skills", [...skills, newSkill.trim()]);
            setNewSkill(""); // Clear input after adding
        }
    };

    const removeSkill = (index: number) => {
        const updatedSkills = [...skills];
        updatedSkills.splice(index, 1);
        setValue("skills", updatedSkills);
    };

    return (
        <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="flex flex-col bg-gray-100 text-black p-6 rounded-lg shadow-md w-full"
        >
            <h2 className="text-2xl font-bold mb-4">Skills</h2>

            {/* Input to add new skill */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    className="w-full border rounded-md p-2"
                />
                <button
                    type="button"
                    onClick={addSkill}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add
                </button>
            </div>

            {/* Skills list */}
            <div className="flex flex-wrap gap-2 mt-4">
                {skills.map((skill: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        {skill}
                        <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="text-red-500"
                        >
                            ✖
                        </button>
                    </div>
                ))}
            </div>

            {/* Validation message */}
            {skills.length === 0 && errors.skills && (
                <p className="text-red-500 text-xs mt-2">{errors.skills.message}</p>
            )}
        </form>
    );
};

export default Skills;
