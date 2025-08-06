import React from "react";
import { 
    UserIcon, 
    ClipboardDocumentListIcon, 
    BriefcaseIcon, 
    AcademicCapIcon, 
    StarIcon 
} from "@heroicons/react/24/outline";

interface StepProgressBarProps {
    steps: string[];
    currentStep: number;
}

const stepIcons = [
    <UserIcon className="w-5 h-5" />,
    <ClipboardDocumentListIcon className="w-5 h-5" />,
    <BriefcaseIcon className="w-5 h-5" />,
    <AcademicCapIcon className="w-5 h-5" />,
    <StarIcon className="w-5 h-5" />
];

const StepProgressBar: React.FC<StepProgressBarProps> = ({ steps, currentStep }) => {
    return (
        <div className="flex items-center justify-between w-full mb-6">
            {steps.map((step, index) => {
                const isActive = index <= currentStep;

                return (
                    <div key={step} className="flex-1 flex flex-col items-center">
                        {/* Step Number Circle */}
                        <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold
                                ${isActive ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-700"}
                            `}
                        >
                            {index + 1}
                        </div>

                        {/* Step Name + Icon */}
                        <div className="flex items-center gap-2 mt-1">
                            <span
                                className={`w-5 h-5 ${isActive ? "text-orange-500" : "text-gray-400"}`}
                            >
                                {stepIcons[index]}
                            </span>
                            <p className={`text-xs ${isActive ? "font-bold text-gray-800" : "text-gray-500"}`}>
                                {step}
                            </p>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length && (
                            <div className={`w-full h-1 ${isActive ? "bg-orange-500" : "bg-gray-300"}`}></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default StepProgressBar;
