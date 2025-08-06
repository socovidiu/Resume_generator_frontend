import React from "react";
import { UseFormRegister, FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { CVData } from "../../types/CVtype";

interface SummaryProps {
    register: UseFormRegister<CVData>;
    errors: FieldErrors<CVData>;
    handleSubmit: UseFormHandleSubmit<CVData>;
    onSubmit: (data: CVData) => void;
}

const Summary: React.FC<SummaryProps> = ({ register, errors, handleSubmit, onSubmit }) => {
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center bg-gray-100 text-black p-6 rounded-lg shadow-md w-full"
        >
            <h2 className="text-2xlfont-bold mb-4">Professional Summary</h2>

            {/* Job tytle */}
            <div className="w-full">
                <label className="block text-xs  text-left  font-semibold">Job Tytle</label>
                <textarea
                    {...register("jobTitle", { required: "Job tytle is required" })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Software Developer"
                />
                {errors.summary && <p className="text-red-500 text-xs">{errors.summary.message}</p>}
            </div>
            {/* Summary Textarea */}
            <div className="w-full">
                <label className="block text-xs  text-left  font-semibold">About me</label>
                <textarea
                    {...register("summary", { required: "Summary is required" })}
                    className="w-full border rounded-md p-2 resize-none h-32"
                    placeholder="Write a brief professional summary..."
                />
                {errors.summary && <p className="text-red-500 text-xs">{errors.summary.message}</p>}
            </div>

           
        </form>
    );
};

export default Summary;
