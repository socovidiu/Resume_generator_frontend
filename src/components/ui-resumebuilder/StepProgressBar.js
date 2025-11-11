import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { UserIcon, ClipboardDocumentListIcon, BriefcaseIcon, AcademicCapIcon, StarIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
const stepIcons = [
    _jsx(UserIcon, { className: "w-5 h-5" }),
    _jsx(ClipboardDocumentListIcon, { className: "w-5 h-5" }),
    _jsx(BriefcaseIcon, { className: "w-5 h-5" }),
    _jsx(AcademicCapIcon, { className: "w-5 h-5" }),
    _jsx(StarIcon, { className: "w-5 h-5" }),
    _jsx(CheckCircleIcon, { className: "w-5 h-5" })
];
const StepProgressBar = ({ steps, currentStep }) => {
    return (_jsx("div", { className: "flex items-center justify-between w-full mb-6", children: steps.map((step, index) => {
            const isActive = index <= currentStep;
            return (_jsxs("div", { className: "flex-1 flex flex-col items-center", children: [_jsx("div", { className: `w-8 h-8 flex items-center justify-center rounded-full font-bold
                                ${isActive ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-700"}
                            `, children: index + 1 }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("span", { className: `w-5 h-5 ${isActive ? "text-orange-500" : "text-gray-400"}`, children: stepIcons[index] }), _jsx("p", { className: `text-xs ${isActive ? "font-bold text-gray-800" : "text-gray-500"}`, children: step })] }), index < steps.length && (_jsx("div", { className: `w-full h-1 ${isActive ? "bg-orange-500" : "bg-gray-300"}` }))] }, step));
        }) }));
};
export default StepProgressBar;
