import React from "react";
import { UseFormRegister, FieldErrors, UseFormHandleSubmit, useFieldArray } from "react-hook-form";
import { CVData } from "../../types/CVtype";

interface EducationProps {
    register: UseFormRegister<CVData>;
    errors: FieldErrors<CVData>;
    handleSubmit: UseFormHandleSubmit<CVData>;
    onSubmit: (data: CVData) => void;
    control: any; // Required for useFieldArray
}

const Education: React.FC<EducationProps> = ({ register, errors, handleSubmit, onSubmit, control }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "educations"
    });

    return (
        <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="flex flex-col bg-gray-100 text-black  p-6 rounded-lg shadow-md w-full"   
        >
            <h2 className="text-2xl font-bold mb-4">Education</h2>

            {fields.map((field, index) => (
                <div key={field.id} className="mb-4 border-b pb-4">
                    <div>
                        <label className="block text-xs font-semibold">Degree</label>
                        <input
                            {...register(`educations.${index}.degree`, { required: "Degree is required" })}
                            className="w-full border rounded-md p-2"
                            placeholder="e.g., Bachelor of Science"
                        />
                        {errors.educations?.[index]?.degree && (
                            <p className="text-red-500 text-xs">{errors.educations[index]?.degree?.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold">School</label>
                        <input
                            {...register(`educations.${index}.school`, { required: "School is required" })}
                            className="w-full border rounded-md p-2"
                            placeholder="e.g., University of Bucharest"
                        />
                        {errors.educations?.[index]?.school && (
                            <p className="text-red-500 text-xs">{errors.educations[index]?.school?.message}</p>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <div>
                            <label className="block text-xs font-semibold">Start Date</label>
                            <input
                                type="date"
                                {...register(`educations.${index}.startDate`, { required: "Start date is required" })}
                                className="w-full border rounded-md p-2"
                            />
                            {errors.educations?.[index]?.startDate && (
                                <p className="text-red-500 text-xs">{errors.educations[index]?.startDate?.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold">End Date</label>
                            <input
                                type="date"
                                {...register(`educations.${index}.endDate`)}
                                className="w-full border rounded-md p-2"
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => remove(index)}
                        className="mt-2 text-red-500 hover:underline text-sm"
                    >
                        Remove Education
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={() => append({ degree: "", school: "", startDate: "", endDate: "" })}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                + Add Another Education
            </button>
        </form>
    );
};

export default Education;
