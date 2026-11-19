import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

import { fetchTokenVerdict } from "./client.js";
import { DEFAULT_CHAIN } from "./constants.js";

const chainEnum = z.enum(["base", "ethereum", "bsc", "arbitrum", "optimism", "polygon"]);

const schema = z.object({
  token: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "ERC-20 contract address"),
  chain: chainEnum.default(DEFAULT_CHAIN),
});

export function createTokenVerdictTool() {
  return new DynamicStructuredTool({
    name: "edge_signals_token_verdict",
    description:
      "Graded pre-trade token due-diligence ($0.01 USDC on Base via x402): grade A–F, SAFE|CAUTION|AVOID, score 0–100, reasons.",
    schema,
    func: async ({ token, chain }) => {
      const verdict = await fetchTokenVerdict({ token, chain });
      return JSON.stringify(verdict);
    },
  });
}