import type {
  Action,
  ActionResult,
  HandlerCallback,
  IAgentRuntime,
  Memory,
  State,
} from "@elizaos/core";
import {
  extractErc20Address,
  fetchTokenVerdict,
} from "../client.js";
import { LAST_VERDICT_KEY, type TokenVerdictResponse } from "../types.js";

export const tokenVerdictBeforeSwapAction: Action = {
  name: "TOKEN_VERDICT_BEFORE_SWAP",
  similes: [
    "CHECK_TOKEN_BEFORE_SWAP",
    "EDGE_SIGNALS_VERDICT",
    "SCREEN_TOKEN_BEFORE_TRADE",
  ],
  description:
    "Pay $0.01 for Edge Signals Token Verdict on an ERC-20 before approving or swapping.",
  validate: async (_runtime, message: Memory) => {
    const text = message.content?.text ?? "";
    return /swap|buy|trade|verdict|risk/i.test(text) && !!extractErc20Address(text);
  },
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state?: State,
    _options?: Record<string, unknown>,
    callback?: HandlerCallback,
  ): Promise<ActionResult> => {
    const text = message.content?.text ?? "";
    const token = extractErc20Address(text);
    if (!token) {
      return { success: false, text: "No ERC-20 address found in message.", error: "NO_TOKEN" };
    }

    const chain =
      (runtime.getSetting("EDGE_SIGNALS_CHAIN") as string | undefined) ?? "base";

    let verdict: TokenVerdictResponse;
    try {
      verdict = await fetchTokenVerdict(token, chain);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, text: `Token Verdict failed: ${msg}`, error: msg };
    }

    runtime.setSetting(LAST_VERDICT_KEY, JSON.stringify({ token, chain, verdict }));

    const allowSwap = verdict.band !== "AVOID";
    const summary =
      verdict.summary ??
      `${verdict.band} — grade ${verdict.grade} (score ${verdict.score}/100)`;

    const responseText = allowSwap
      ? `Token Verdict OK to proceed with caution: ${summary}. Reasons: ${verdict.reasons.join("; ")}`
      : `Swap blocked — ${summary}. Reasons: ${verdict.reasons.join("; ")}`;

    await callback?.({ text: responseText, action: "TOKEN_VERDICT_BEFORE_SWAP" });

    return {
      success: true,
      text: responseText,
      data: { token, chain, verdict, allowSwap },
      values: { allowSwap, tokenVerdictBand: verdict.band },
    };
  },
  examples: [
    [
      {
        name: "{{user}}",
        content: {
          text: "Run token verdict before I swap 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 on Base",
        },
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll call Edge Signals Token Verdict before the swap.",
          action: "TOKEN_VERDICT_BEFORE_SWAP",
        },
      },
    ],
  ],
};