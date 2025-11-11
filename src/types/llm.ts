// ---- Canonical Profile
export type ExperienceItem = {
  company: string;
  role: string;
  start?: string | null;
  end?: string | null;
  bullets: string[];
};

export type EducationItem = {
  school: string;
  degree?: string | null;
  year?: string | null;
};

export type CanonicalProfile = {
  name?: string | null;
  title?: string | null;
  summary?: string | null;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
};

// ---- Keywords
export type JDRequest = { job_description: string };

export type KeywordsResponse = {
  skills: string[];
  keywords: string[];
  seniority?: string | null;
  nice_to_have: string[];
};

// ---- Cover Letter
export type CoverLetterRequest = {
  profile: CanonicalProfile;
  job_description: string;
  company?: string | null;
  role?: string | null;
};

export type CoverLetterResponse = { cover_letter: string };
