export const SIGNALS_BASE = "https://signals.edge.report";

export type TokenVerdictBand = "SAFE" | "CAUTION" | "AVOID";
export type TokenVerdictGrade = "A" | "B" | "C" | "D" | "F";

export interface TokenVerdictResponse {
  product?: string;
  grade: TokenVerdictGrade;
  band: TokenVerdictBand;
  score: number;
  reasons: string[];
  disclaimer: string;
  summary?: string;
  metrics?: Record<string, unknown>;
}

export type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export interface TokenVerdictClientOptions {
  /** Injectable fetch (e.g. `wrapFetchWithPayment(fetch, x402Client)`). */
  fetchFn?: FetchLike;
  baseUrl?: string;
}

export function buildTokenVerdictUrl(
  token: string,
  chain = "base",
  baseUrl = SIGNALS_BASE,
): string {
  const url = new URL("/v1/token-verdict", baseUrl);
  url.searchParams.set("token", token);
  url.searchParams.set("chain", chain);
  return url.toString();
}

export async function fetchTokenVerdict(
  token: string,
  options: TokenVerdictClientOptions & { chain?: string } = {},
): Promise<TokenVerdictResponse> {
  const fetchFn = options.fetchFn ?? globalThis.fetch.bind(globalThis);
  const target = buildTokenVerdictUrl(token, options.chain, options.baseUrl);
  const res = await fetchFn(target, { method: "GET" });
  if (!res.ok) {
    throw new Error(`Token Verdict failed: HTTP ${res.status}`);
  }
  return (await res.json()) as TokenVerdictResponse;
}