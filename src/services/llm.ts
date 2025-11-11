import api from "./http"; // your axios instance file
import {
  JDRequest,
  KeywordsResponse,
  CoverLetterRequest,
  CoverLetterResponse,
} from "../types/llm";

/** Extract keywords from a job description */
export async function extractKeywords(req: JDRequest): Promise<KeywordsResponse | null> {
  const { data } = await api.post<KeywordsResponse | null>(
    "/api/llmconnection/extract-keywords",
    req
  );
  return data;
}

/** Generate a tailored cover letter from profile + JD */
export async function generateCoverLetter(
  req: CoverLetterRequest
): Promise<CoverLetterResponse | null> {
  const { data } = await api.post<CoverLetterResponse | null>(
    "/api/llmconnection/cover-letter",
    req
  );
  return data;
}
