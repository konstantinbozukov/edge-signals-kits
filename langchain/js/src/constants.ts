export const EDGE_SIGNALS_BASE = "https://signals.edge.report";
export const TOKEN_VERDICT_PATH = "/v1/token-verdict";
export const TOKEN_VERDICT_PRICE_USD = "0.01";
export const DEFAULT_CHAIN = "base";

export type SupportedChain =
  | "base"
  | "ethereum"
  | "bsc"
  | "arbitrum"
  | "optimism"
  | "polygon";

export function tokenVerdictUrl(token: string, chain: SupportedChain = DEFAULT_CHAIN): string {
  const q = new URLSearchParams({ token, chain });
  return `${EDGE_SIGNALS_BASE}${TOKEN_VERDICT_PATH}?${q.toString()}`;
}

export type TokenVerdictResponse = {
  product?: string;
  grade: "A" | "B" | "C" | "D" | "F";
  band: "SAFE" | "CAUTION" | "AVOID";
  score: number;
  reasons: string[];
  metrics?: Record<string, unknown>;
  disclaimer?: string;
  summary?: string;
};