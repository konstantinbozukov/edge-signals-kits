import type { Action, HandlerCallback, IAgentRuntime, Memory, State } from "@elizaos/core";

import { paidTokenVerdictGet } from "../client.js";

const BASE = "https://signals.edge.report";
const DEFAULT_TOKEN = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

function extractToken(text: string): string | null {
  const match = text.match(/0x[a-fA-F0-9]{40}/);
  return match ? match[0] : null;
}

export const tokenVerdictAction: Action = {
  name: "TOKEN_VERDICT",
  similes: ["TOKEN_VERDICT", "PRE_SWAP_CHECK", "EDGE_SIGNALS_VERDICT"],
  description:
    "Run Edge Signals Token Verdict ($0.01 x402) before swapping or approving an ERC-20.",
  validate: async (_runtime: IAgentRuntime, message: Memory) => {
    const text = message.content.text ?? "";
    return Boolean(extractToken(text)) || /swap|buy|approve/i.test(text);
  },
  handler: async (
    _runtime: IAgentRuntime,
    message: Memory,
    _state?: State,
    _options?: Record<string, unknown>,
    callback?: HandlerCallback,
  ) => {
    const text = message.content.text ?? "";
    const token = extractToken(text) ?? DEFAULT_TOKEN;
    const chain = /ethereum|mainnet/i.test(text) ? "ethereum" : "base";
    const url = `${BASE}/v1/token-verdict?token=${token}&chain=${chain}`;
    const verdict = await paidTokenVerdictGet(url);
    const summary = JSON.stringify(verdict, null, 2);
    if (callback) {
      await callback({ text: summary, action: "TOKEN_VERDICT" });
    }
    return {
      success: true,
      text: summary,
      data: { verdict: summary },
    };
  },
  examples: [
    [
      { name: "{{user}}", content: { text: "Check 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 before I swap" } },
      { name: "{{agent}}", content: { text: "Running Token Verdict on Base…", action: "TOKEN_VERDICT" } },
    ],
  ],
};