import type { Plugin } from "@elizaos/core";

import { tokenVerdictAction } from "./actions/tokenVerdict.js";

export const edgeSignalsPlugin: Plugin = {
  name: "edge-signals",
  description: "Edge Signals Token Verdict (x402) before swap",
  actions: [tokenVerdictAction],
};

export default edgeSignalsPlugin;
export { tokenVerdictAction } from "./actions/tokenVerdict.js";