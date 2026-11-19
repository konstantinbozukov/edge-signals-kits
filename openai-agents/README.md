# OpenAI Agents SDK example

Register `TokenVerdictFunctionTool(...).definition` with your agent and route calls to `.invoke(token=...)`.

Use an x402-enabled HTTP client in production; read the payer key from `X402_PAYER_PRIVATE_KEY` — never commit it.