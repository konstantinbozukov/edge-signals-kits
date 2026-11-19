# @konstantinbozukov/plugin-edge-signals

ElizaOS plugin: **`TOKEN_VERDICT_BEFORE_SWAP`** action (paid Edge Signals) and **`EDGE_SIGNALS_TOKEN_VERDICT`** provider.

Configure `X402_PAYER_PRIVATE_KEY` via `agentConfig` (sensitive) — never commit keys.

```typescript
import edgeSignalsPlugin from "@konstantinbozukov/plugin-edge-signals";

export default {
  plugins: [edgeSignalsPlugin],
};
```