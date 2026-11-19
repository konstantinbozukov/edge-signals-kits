import type { Plugin } from "@elizaos/core";
import { tokenVerdictBeforeSwapAction } from "./actions/tokenVerdictBeforeSwap.js";
import { setEdgeSignalsFetch } from "./client.js";
import { tokenVerdictProvider } from "./providers/tokenVerdictProvider.js";

export const edgeSignalsPlugin: Plugin = {
  name: "edge-signals",
  description:
    "Edge Signals Token Verdict via x402 USDC on Base — screen tokens before swaps.",
  actions: [tokenVerdictBeforeSwapAction],
  providers: [tokenVerdictProvider],
  init: async (_config, runtime) => {
    const pk =
      (runtime.getSetting("X402_PAYER_PRIVATE_KEY") as string | undefined) ??
      process.env.X402_PAYER_PRIVATE_KEY ??
      process.env.EDGE_SIGNALS_PAYER_PRIVATE_KEY;

    if (pk) {
      const { loadX402Fetch } = await import("./loadX402Fetch.js");
      setEdgeSignalsFetch(await loadX402Fetch(pk as string));
    }
  },
};

export default edgeSignalsPlugin;
export { setEdgeSignalsFetch, fetchTokenVerdict } from "./client.js";
export { tokenVerdictBeforeSwapAction } from "./actions/tokenVerdictBeforeSwap.js";
export { tokenVerdictProvider } from "./providers/tokenVerdictProvider.js";