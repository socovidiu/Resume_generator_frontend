import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CVData } from "../types/CVtype";
import ContactInfo from "../components/ui-resumebuilder/ContactInfo"; 
import Summary from "../components/ui-resumebuilder/Summary"; 
import WorkExperience from "../components/ui-resumebuilder/WorkExperience"; 
import Education from "../components/ui-resumebuilder/Education"; 
import Skills from "../components/ui-resumebuilder/Skills"; 
import ResumePreview from "../components/ui-resumebuilder/ResumePreview"; 
import StepProgressBar from "../components/ui-resumebuilder/StepProgressBar";
import Button from "../components/ui-elements/Button"
import {resumeTemplates} from "../CV templates/resumeTemplates"
import ErrorBoundary from "../components/ErrorBoundary";


const borderStyle: "square" | "circle" | "rounded" = "rounded";

// Example
const resumeData = {
    firstName: "John",
    lastName: "Doe",
    jobTitle: "Software Engineer",
    city: "Bucharest",
    country: "Romania",
    phone: "123-456-789",
    email: "john.doe@example.com",
    photo: null, // This can be a base64 string, file object, or null if no photo is uploaded.
    colorHex: "#3b82f6", // Default color theme for the CV (blue here)
    borderStyle: borderStyle,  // ✅ This is correct
    summary: "Experienced software engineer with expertise in building scalable web applications.",
    workExperiences: [
        {
            position: "Frontend Developer",
            company: "TechCorp",
            startDate: "2022-01-01",
            endDate: "2024-01-01",
            description: "Built and maintained the company's front-end platform using React and Tailwind CSS."
        }
    ],
    educations: [
        {
            degree: "Bachelor of Computer Science",
            school: "University of Bucharest",
            startDate: "2018-09-01",
            endDate: "2022-06-15"
        }
    ],
    skills: ["React", "TypeScript", "Tailwind CSS", "Git"]
};
const steps = ["Contact Info", "Summary", "Work Experience", "Education", "Skills"];

const CvManager: React.FC = () => {
    const { register, handleSubmit, setValue, watch, reset, formState: { errors }, control  } = useForm<CVData>();
    
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof resumeTemplates>("classic");
    const [photo, setPhoto] = useState<string | null>(null);
    // Step state to track which section is active
    const [currentStep, setCurrentStep] = useState(0);

    // Watch form values for live preview
    const formValues = watch();

    const onSubmit = async (cvData: CVData) => {
        console.log("CV Submitted:", cvData);
        reset();
    };

    return (
        <div className="flex w-full min-h-screen">
            {/* Left Section - Contact Form */}
            <div className="w-1/2 p-8 bg-white flex flex-col justify-center ">
                {/* Progress bar */}
                <StepProgressBar steps={steps} currentStep={currentStep} />
                {/* Show component based on the current step */}
                {currentStep === 0 && (
                    <ContactInfo
                        register={register}
                        errors={errors}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                        photo={photo}
                        setPhoto={setPhoto}
                    />
                )}
                {currentStep === 1 && (
                    <Summary
                        register={register}
                        errors={errors}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                    />
                )}
                {currentStep === 2 && (
                    <WorkExperience
                        register={register}
                        errors={errors}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                        control={control} // Required for useFieldArray
                    />
                )}
                {currentStep === 3 && (
                    <Education
                        register={register}
                        errors={errors}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                        control={control} // Required for useFieldArray
                    />
                )}
                {currentStep === 4 && (
                    <Skills
                        register={register}
                        errors={errors}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                        watch={watch}
                        setValue={setValue}
                    />
                )}

                {/* Navigation and Submit Section */}
                <div className="flex justify-between mt-4">
                    <Button
                        type="button"
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        variant="secondary"
                        size="lg"
                    >
                        BACK
                    </Button> 

                    <Button
                        type="button"
                        onClick={() => {
                            handleSubmit((data) => {
                                if (currentStep === steps.length - 1) {
                                    // Final submit
                                    onSubmit(data);
                                } else {
                                    // Move to next step
                                    setCurrentStep(currentStep + 1);
                                }
                            })();
                        }}
                        variant="navigation"
                        size="lg"
                    >
                        {currentStep === steps.length - 1 ? "FINISH" : "CONTINUE"}
                    </Button>
                </div>

                {/* Template Selector */}
                <div className="mt-6 text-black justify-center">
                    <h3 className="text-lg font-bold mb-2">Choose Template:</h3>
                    <select className="p-2 border rounded-lg bg-gray-400" 
                        onChange={(e) => setSelectedTemplate(e.target.value as keyof typeof resumeTemplates)}
                    >
                        <option value="classic">Classic</option>
                        <option value="modern">Modern</option>
                        <option value="dark">Dark</option> 
                    </select>
                </div>
            </div>
        
            {/* Right Section - CV Preview */}
            <div className="w-1/2 min-h-full p-8 bg-gray-700 flex justify-center items-center">
                <ErrorBoundary>
                    <ResumePreview resumeData={formValues} />
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default CvManager;
