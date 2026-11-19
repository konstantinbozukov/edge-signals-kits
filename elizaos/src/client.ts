import type { FetchLike, TokenVerdictResponse } from "./types.js";

const BASE = "https://signals.edge.report";

let fetchFn: FetchLike | null = null;

export function setEdgeSignalsFetch(fn: FetchLike): void {
  fetchFn = fn;
}

export function getEdgeSignalsFetch(): FetchLike {
  if (!fetchFn) {
    throw new Error(
      "Edge Signals fetch not configured. Set X402_PAYER_PRIVATE_KEY in plugin init or call setEdgeSignalsFetch in tests.",
    );
  }
  return fetchFn;
}

export function buildTokenVerdictUrl(token: string, chain = "base"): string {
  const url = new URL("/v1/token-verdict", BASE);
  url.searchParams.set("token", token);
  url.searchParams.set("chain", chain);
  return url.toString();
}

export async function fetchTokenVerdict(
  token: string,
  chain = "base",
): Promise<TokenVerdictResponse> {
  const res = await getEdgeSignalsFetch()(buildTokenVerdictUrl(token, chain));
  if (!res.ok) throw new Error(`Token Verdict HTTP ${res.status}`);
  return (await res.json()) as TokenVerdictResponse;
}

export function extractErc20Address(text: string): string | null {
  const match = text.match(/0x[a-fA-F0-9]{40}/);
  return match?.[0] ?? null;
}