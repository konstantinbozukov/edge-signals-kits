# @konstantinbozukov/langchain-edge-signals

LangChain `DynamicStructuredTool` for [Edge Signals](https://signals.edge.report) **Token Verdict** (`GET /v1/token-verdict`, $0.01 USDC on Base via x402).

## Install

```bash
npm install @konstantinbozukov/langchain-edge-signals @langchain/core
```

## Usage

```typescript
import { createTokenVerdictTool } from "@konstantinbozukov/langchain-edge-signals";

const tool = createTokenVerdictTool();
```

Set `X402_EVM_PRIVATE_KEY` or `EVM_PRIVATE_KEY` in the environment (Base USDC wallet).

## Publish

```bash
npm publish --access public
```