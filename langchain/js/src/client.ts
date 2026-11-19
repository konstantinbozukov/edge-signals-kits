import type { Hex } from "viem";
import { createSigner, wrapFetchWithPayment } from "x402-fetch";

import {
  DEFAULT_CHAIN,
  type SupportedChain,
  type TokenVerdictResponse,
  tokenVerdictUrl,
} from "./constants.js";

export type PaidHttpGet = (url: string) => Promise<Response>;

const MAX_TOKEN_VERDICT_USDC = 20_000n; // $0.02 atomic USDC cap (0.01 + headroom)

export async function createPaidFetchFromEnv(
  privateKey = process.env.X402_EVM_PRIVATE_KEY ?? process.env.EVM_PRIVATE_KEY,
): Promise<PaidHttpGet> {
  if (!privateKey) {
    throw new Error(
      "Set X402_EVM_PRIVATE_KEY or EVM_PRIVATE_KEY with a Base-funded USDC wallet (never commit keys).",
    );
  }
  const signer = await createSigner("base", privateKey as Hex);
  const fetchWithPay = wrapFetchWithPayment(fetch, signer, MAX_TOKEN_VERDICT_USDC);
  return (url: string) => fetchWithPay(url, { method: "GET" });
}

export type FetchTokenVerdictOptions = {
  token: string;
  chain?: SupportedChain;
  get?: PaidHttpGet;
};

export async function fetchTokenVerdict(
  options: FetchTokenVerdictOptions,
): Promise<TokenVerdictResponse> {
  const url = tokenVerdictUrl(options.token, options.chain ?? DEFAULT_CHAIN);
  const get = options.get ?? (await createPaidFetchFromEnv());
  const response = await get(url);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Token Verdict failed (${response.status}): ${body.slice(0, 500)}`);
  }
  return (await response.json()) as TokenVerdictResponse;
}