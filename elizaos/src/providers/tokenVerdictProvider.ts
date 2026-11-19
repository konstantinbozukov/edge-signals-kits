import type {
  IAgentRuntime,
  Memory,
  Provider,
  ProviderDataRecord,
  State,
} from "@elizaos/core";
import { LAST_VERDICT_KEY } from "../types.js";

interface StoredVerdict {
  token: string;
  chain: string;
  verdict: {
    grade: string;
    band: string;
    score: number;
    reasons: string[];
    disclaimer: string;
    summary?: string;
  };
}

export const tokenVerdictProvider: Provider = {
  name: "EDGE_SIGNALS_TOKEN_VERDICT",
  description: "Latest Edge Signals Token Verdict cached from the pre-swap action",
  get: async (runtime: IAgentRuntime, _message: Memory, _state?: State) => {
    const raw = runtime.getSetting(LAST_VERDICT_KEY) as string | undefined;
    if (!raw) {
      return {
        text: "No Token Verdict cached yet. Run TOKEN_VERDICT_BEFORE_SWAP first.",
        values: {},
        data: {},
      };
    }

    let stored: StoredVerdict;
    try {
      stored = JSON.parse(raw) as StoredVerdict;
    } catch {
      return { text: "Token Verdict cache corrupted.", values: {}, data: {} };
    }

    const { verdict, token, chain } = stored;
    const line = `${verdict.band} (${verdict.grade}, ${verdict.score}/100) for ${token} on ${chain}`;
    return {
      text: `Latest Token Verdict: ${line}. ${verdict.disclaimer}`,
      values: {
        tokenVerdictBand: verdict.band,
        tokenVerdictGrade: verdict.grade,
        tokenVerdictToken: token,
      },
      data: {
        token,
        chain,
        grade: verdict.grade,
        band: verdict.band,
        score: verdict.score,
        reasons: verdict.reasons,
        disclaimer: verdict.disclaimer,
      } satisfies ProviderDataRecord,
    };
  },
};