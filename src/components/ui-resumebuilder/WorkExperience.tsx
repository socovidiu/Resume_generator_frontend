import React from "react";
import { UseFormRegister, FieldErrors, UseFormHandleSubmit, useFieldArray } from "react-hook-form";
import { CVData } from "../../types/CVtype";

interface WorkExperienceProps {
    register: UseFormRegister<CVData>;
    errors: FieldErrors<CVData>;
    handleSubmit: UseFormHandleSubmit<CVData>;
    onSubmit: (data: CVData) => void;
    control: any; // Needed for useFieldArray
}

const WorkExperience: React.FC<WorkExperienceProps> = ({ register, errors, handleSubmit, onSubmit, control }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "workExperiences"
    });

    return (
        <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="flex flex-col bg-gray-100 text-black p-6 rounded-lg shadow-md w-full"
        >
            <h2 className="text-2xl font-bold mb-4">Work Experience</h2>

            {fields.map((field, index) => (
                <div key={field.id} className="mb-4 border-b pb-4">
                    <div>
                        <label className="block text-xs font-semibold">Job Title</label>
                        <input
                            {...register(`workExperiences.${index}.position`, { required: "Job title is required" })}
                            className="w-full border rounded-md p-2"
                            placeholder="e.g., Software Engineer"
                        />
                        {errors.workExperiences?.[index]?.position && (
                            <p className="text-red-500 text-xs">{errors.workExperiences[index]?.position?.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold">Company</label>
                        <input
                            {...register(`workExperiences.${index}.company`, { required: "Company is required" })}
                            className="w-full border rounded-md p-2"
                            placeholder="Company Name"
                        />
                        {errors.workExperiences?.[index]?.company && (
                            <p className="text-red-500 text-xs">{errors.workExperiences[index]?.company?.message}</p>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <div>
                            <label className="block text-xs font-semibold">Start Date</label>
                            <input
                                type="date"
                                {...register(`workExperiences.${index}.startDate`, { required: "Start date is required" })}
                                className="w-full border rounded-md p-2"
                            />
                            {errors.workExperiences?.[index]?.startDate && (
                                <p className="text-red-500 text-xs">{errors.workExperiences[index]?.startDate?.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold">End Date</label>
                            <input
                                type="date"
                                {...register(`workExperiences.${index}.endDate`)}
                                className="w-full border rounded-md p-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold">Description</label>
                        <textarea
                            {...register(`workExperiences.${index}.description`)}
                            className="w-full border rounded-md p-2 resize-none"
                            placeholder="Brief description of your role"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => remove(index)}
                        className="mt-2 text-red-500 hover:underline text-sm"
                    >
                        Remove Experience
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={() => append({ position: "", company: "", startDate: "", endDate: "", description: "" })}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                + Add Another Job
            </button>
        </form>
    );
};

export default WorkExperience;
