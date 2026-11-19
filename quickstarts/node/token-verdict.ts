import type { Hex } from "viem";
import { createSigner, wrapFetchWithPayment } from "x402-fetch";

const token = process.env.TOKEN ?? "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const pk = process.env.X402_EVM_PRIVATE_KEY ?? process.env.EVM_PRIVATE_KEY;
if (!pk) throw new Error("Set X402_EVM_PRIVATE_KEY or EVM_PRIVATE_KEY");

const url = `https://signals.edge.report/v1/token-verdict?token=${token}&chain=base`;
const signer = await createSigner("base", pk as Hex);
const get = wrapFetchWithPayment(fetch, signer, 20_000n);
const res = await get(url);
console.log(await res.json());