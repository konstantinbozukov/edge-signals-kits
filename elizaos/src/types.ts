export type TokenVerdictBand = "SAFE" | "CAUTION" | "AVOID";
export type TokenVerdictGrade = "A" | "B" | "C" | "D" | "F";

export interface TokenVerdictResponse {
  grade: TokenVerdictGrade;
  band: TokenVerdictBand;
  score: number;
  reasons: string[];
  disclaimer: string;
  summary?: string;
}

export type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export const LAST_VERDICT_KEY = "edgeSignals:lastTokenVerdict";