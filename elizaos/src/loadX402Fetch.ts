// @ts-nocheck — optional @x402 subpath imports resolved at runtime
import type { FetchLike } from "./types.js";

export async function loadX402Fetch(privateKey: string): Promise<FetchLike> {
  const { privateKeyToAccount } = await import("viem/accounts");
  const { x402Client, wrapFetchWithPayment } = await import("@x402/fetch");
  const { registerExactEvmScheme } = await import(
    "@x402/evm/exact/client/register"
  );
  const client = registerExactEvmScheme(new x402Client(), {
    signer: privateKeyToAccount(privateKey),
  });
  return wrapFetchWithPayment(fetch, client);
}