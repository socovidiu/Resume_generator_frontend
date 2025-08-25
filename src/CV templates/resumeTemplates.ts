export const resumeTemplates = {
    classic: {
        container: "resume-container p-6 bg-white text-black border border-gray-300",
        header: "text-center border-b-2 border-black pb-2",
        sectionTitle: "text-lg font-semibold border-b pb-1 mt-4",
        text: "text-sm",
    },
    modern: {
        container: "resume-container p-6 bg-gray-100 text-gray-800 shadow-lg rounded-lg",
        header: "text-center border-b-2 border-blue-500 pb-2",
        sectionTitle: "text-lg font-semibold text-blue-600 border-b pb-1 mt-4",
        text: "text-sm text-gray-700",
    },
    dark: {
        container: "resume-container p-6 bg-gray-900 text-white border border-gray-700",
        header: "text-center border-b-2 border-gray-400 pb-2",
        sectionTitle: "text-lg font-semibold text-gray-300 border-b pb-1 mt-4",
        text: "text-sm text-gray-200",
    }
};


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