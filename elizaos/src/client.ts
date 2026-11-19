import type { Hex } from "viem";
import { createSigner, wrapFetchWithPayment } from "x402-fetch";

export async function paidTokenVerdictGet(url: string): Promise<Record<string, unknown>> {
  const pk = process.env.X402_EVM_PRIVATE_KEY ?? process.env.EVM_PRIVATE_KEY;
  if (!pk) {
    throw new Error("Set X402_EVM_PRIVATE_KEY or EVM_PRIVATE_KEY");
  }
  const signer = await createSigner("base", pk as Hex);
  const get = wrapFetchWithPayment(fetch, signer, 20_000n);
  const res = await get(url);
  if (!res.ok) {
    throw new Error(`Token Verdict HTTP ${res.status}`);
  }
  return (await res.json()) as Record<string, unknown>;
}