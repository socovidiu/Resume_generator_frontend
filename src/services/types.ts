// services/types.ts

// Auth
export type LoginRequest = { username: string; password: string };
export type SignUpRequest = { username: string; email: string; password: string };
export type UserResponse = { id: string; username: string; email: string };
export type AuthResponse = { message: string; token?: string; user?: UserResponse };

//  (used by PUT /api/users/{id})
export type UpdateUserRequest = {
  username: string;
  email: string;
  password?: string; // omit/empty to keep password server-side
};

// localStorage "auth_session"
export type AuthSession = UserResponse;

// CVs
export type WorkExperience = {
  position: string;
  company: string;
  startDate: string;
  endDate?: string | null;
  description: string;
};

export type Education = {
  degree: string;
  school: string;
  startDate: string;
  endDate?: string | null;
};

export type LinkType = "LinkedIn" | "GitHub" | "Website";
export type Link = { type: LinkType; url: string };

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
