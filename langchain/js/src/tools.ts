import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import {
  fetchTokenVerdict,
  type FetchLike,
  type TokenVerdictClientOptions,
} from "./client.js";

const tokenSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "ERC-20 contract address");

export interface EdgeSignalsLangChainOptions extends TokenVerdictClientOptions {
  chain?: string;
}

export function createTokenVerdictTool(options: EdgeSignalsLangChainOptions = {}) {
  return new DynamicStructuredTool({
    name: "edge_signals_token_verdict",
    description:
      "Paid Edge Signals Token Verdict ($0.01, x402 USDC on Base): grade A–F, SAFE|CAUTION|AVOID, score, reasons before buy/swap.",
    schema: z.object({
      token: tokenSchema,
      chain: z.string().optional().default(options.chain ?? "base"),
    }),
    func: async ({ token, chain }) => {
      const verdict = await fetchTokenVerdict(token, { ...options, chain });
      return JSON.stringify(verdict);
    },
  });
}

export function createTokenVerdictToolWithFetch(
  fetchFn: FetchLike,
  chain = "base",
): DynamicStructuredTool {
  return createTokenVerdictTool({ fetchFn, chain });
}