import React, { useEffect, useState } from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { CVData } from "../../types/CVtype";

interface SkillsProps {
  register: UseFormRegister<CVData>;
  errors: FieldErrors<CVData>;
  handleSubmit: UseFormHandleSubmit<CVData>;
  onSubmit: (data: CVData) => void;
  watch: UseFormWatch<CVData>;            // ✅ no more any
  setValue: UseFormSetValue<CVData>;      // ✅ no more any
}

const Skills: React.FC<SkillsProps> = ({
  register,
  errors,
  handleSubmit,
  onSubmit,
  watch,
  setValue,
}) => {
  const [newSkill, setNewSkill] = useState<string>("");

  // Ensure RHF knows about the 'skills' field (and silences the unused warning)
  useEffect(() => {
    register("skills");
  }, [register]);

  const skills = (watch("skills") ?? []) as string[];

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) {
      setValue("skills", [...skills, s], { shouldDirty: true, shouldValidate: true });
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    const updated = [...skills];
    updated.splice(index, 1);
    setValue("skills", updated, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-shell">
      <h2 className="text-2xl font-bold mb-4">Skills</h2>

      {/* Input to add new skill */}
      <div className="form-section">
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
        {skills.map((skill, index) => (
          <div
            key={`${skill}-${index}`}
            className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
          >
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
      {skills.length === 0 && errors.skills?.message && (
        <p className="text-red-500 text-xs mt-2">{String(errors.skills.message)}</p>
      )}
    </form>
  );
};

export default Skills;
