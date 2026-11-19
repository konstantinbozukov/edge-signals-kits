/** Token Verdict — set X402_PAYER_PRIVATE_KEY (Base USDC). Never commit keys. */
import { privateKeyToAccount } from "viem/accounts";
import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client/register";

const pk = process.env.X402_PAYER_PRIVATE_KEY ?? process.env.EDGE_SIGNALS_PAYER_PRIVATE_KEY;
if (!pk) throw new Error("Set X402_PAYER_PRIVATE_KEY");
const token = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const url = `https://signals.edge.report/v1/token-verdict?token=${token}&chain=base`;
const client = registerExactEvmScheme(new x402Client(), { signer: privateKeyToAccount(pk) });
const res = await wrapFetchWithPayment(fetch, client)(url);
console.log(await res.json());