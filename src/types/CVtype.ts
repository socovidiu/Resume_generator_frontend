export type LinkType = "LinkedIn" | "GitHub" | "Website";
export type LinkItem = { type: LinkType; url: string };

export interface CVData {
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    postcode: string;
    phone: string;
    email: string;
    photo: string | null;
    jobTitle: string;
    summary: string;
    skills: string[];

    workExperiences: {
        position: string;
        company: string;
        startDate: string;
        endDate?: string;
        description: string;
    }[];

    educations: {
        degree: string;
        school: string;
        startDate: string;
        endDate?: string;
    }[];

    links: LinkItem[];

    colorHex?: string;
    borderStyle?: "square" | "circle" | "rounded";
}