import React, { useRef } from "react";
import { CVData } from "../../types/CVtype";
import { useReactToPrint } from "react-to-print";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaDownload, FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";

const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
        case "linkedin": return <FaLinkedin className="text-blue-400" />;
        case "github": return <FaGithub className="text-gray-300" />;
        case "website": return <FaGlobe className="text-green-400" />;
        default: return null;
    }
};

const SidebarHeader = ({ resumeData }: { resumeData: CVData }) => (
    <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">{resumeData.firstName} {resumeData.lastName}</h1>
        <p className="text-md text-gray-400">{resumeData.jobTitle}</p>
    </div>
);

const SidebarContent = ({ resumeData }: { resumeData: CVData }) => (
    <div>
        <h2 className="text-lg font-semibold border-b pb-1">Contact</h2>
        <p className="flex items-center gap-2 mt-2"><FaMapMarkerAlt /> {resumeData.city}, {resumeData.country}</p>
        <p className="flex items-center gap-2 mt-2"><FaPhone /> {resumeData.phone}</p>
        <p className="flex items-center gap-2 mt-2"><FaEnvelope /> {resumeData.email}</p>

        <h2 className="text-lg font-semibold border-b pb-1 mt-4">Links</h2>
        {resumeData.links?.map((link, index) => (
            <p key={index} className="flex items-center gap-2 mt-2">
                {getIcon(link.type)} <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{link.url}</a>
            </p>
        ))}

        <h2 className="text-lg font-semibold border-b pb-1 mt-4">Skills</h2>
        <ul className="mt-2 space-y-1">
            {resumeData.skills?.map((skill, index) => (
                <li key={index} className="text-sm">• {skill}</li>
            ))}
        </ul>
    </div>
);

const MainContent = ({ resumeData }: { resumeData: CVData; }) => (
    <div className="w-2/3 p-6 flex flex-col" >
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-700">Work Experience</h2>
            <button  className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                <FaDownload /> Download
            </button>
        </div>
        {resumeData.workExperiences?.map((exp, index) => (
            <div key={index} className="mt-4">
                <div className="flex justify-between">
                    <p className="text-lg font-bold">{exp.position}</p>
                    <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate || "Present"}</p>
                </div>
                <p className="text-md text-gray-700">{exp.company}</p>
                <p className="text-sm">{exp.description}</p>
            </div>
        ))}

        <div className="mt-6">
            <h2 className="text-xl font-bold text-gray-700">Education</h2>
            {resumeData.educations?.map((edu, index) => (
                <div key={index} className="mt-4">
                    <div className="flex justify-between">
                        <p className="text-md font-bold">{edu.degree}</p>
                        <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate || "Present"}</p>
                    </div>
                    <p className="text-md text-gray-700">{edu.school}</p>
                </div>
            ))}
        </div>
    </div>
);

const ResumePreview: React.FC<{ resumeData: CVData }> = ({ resumeData }) => {
    const previewRef = useRef<HTMLDivElement>(null);
    const handleDownload = useReactToPrint({ contentRef:  previewRef, documentTitle: "My_CV" });

    return (
        <div className="flex justify-center items-center w-full h-full overflow-auto p-6 bg-gray-100">
            <div className="relative w-[210mm] h-[297mm] bg-white shadow-lg border border-gray-300 flex">
                {/* Sidebar */}
                <div className="w-1/3 bg-gray-800 text-white p-6 flex flex-col">
                    <SidebarHeader resumeData={resumeData} />
                    <SidebarContent resumeData={resumeData} />
                </div>

                {/* Main Content */}
                <MainContent resumeData={resumeData}  />
            </div>
        </div>
    );
};

export default ResumePreview;
