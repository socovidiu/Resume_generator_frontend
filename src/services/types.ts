// Auth
export type LoginRequest = { username: string; password: string };
export type SignUpRequest = { username: string; email: string; password: string };
export type UserResponse = { id: string; username: string; email: string };
export type AuthResponse = { message: string; token?: string; user?: UserResponse };

// CVs
export type WorkExperience = {
  position: string;
  company: string;
  startDate: string;   // ISO string
  endDate?: string | null;
  description: string;
};

export type Education = {
  degree: string;
  school: string;
  startDate: string;   // ISO string
  endDate?: string | null;
};

export type Link = {
  // backend expects string union like "LinkedIn" | "GitHub" | "Website"
  type: string;
  url: string;
};

export type CVBase = {
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  postcode: string;
  phone: string;
  email: string;
  photo?: string | null;
  jobTitle: string;
  summary: string;
  skills: string[];
  workExperiences: WorkExperience[];
  educations: Education[];
  links: Link[];
};

export type CreateCVRequest = CVBase;
export type UpdateCVRequest = CVBase;

export type CVResponse = CVBase & { id: string };
