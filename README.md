# edge-signals-kits

Drop-in integrations so AI agents can **pay** for and call [**Edge Signals**](https://signals.edge.report) (HTTP + MCP, x402 USDC on Base) and [**Pathmint**](https://pathmint.edge.report) (verify-before-pay, MCP).

No API keys — fund a Base wallet with USDC and pay per call. **Never commit a private key**; all examples read the payer from `X402_PAYER_PRIVATE_KEY` (or `EDGE_SIGNALS_PAYER_PRIVATE_KEY`).

## Token Verdict (hero SKU)

**Token Verdict** is a $0.01 pre-trade due-diligence call for ERC-20s on Base (and other EVM chains): `GET /v1/token-verdict?token={contract}&chain=base` returns a letter grade (A–F), band (`SAFE` | `CAUTION` | `AVOID`), score 0–100, and human-readable reasons combining honeypot/security scanners, on-chain metadata, and liquidity signals — use it before swaps, bridges, or treasury allocation instead of guessing from a contract address alone.

Discovery: [catalog](https://signals.edge.report/v1/catalog) · [OpenAPI](https://signals.edge.report/openapi.json) · [agent card](https://signals.edge.report/.well-known/agent.json)

## Repo layout

| Path | Purpose |
| --- | --- |
| [`quickstarts/`](quickstarts/) | ~10-line paid Token Verdict calls (Node, Python, curl) |
| [`langchain/js`](langchain/js/) | npm `@konstantinbozukov/edge-signals-langchain` |
| [`langchain/python`](langchain/python/) | PyPI-style `edge-signals-langchain` |
| [`crewai/`](crewai/) | CrewAI tool example |
| [`openai-agents/`](openai-agents/) | OpenAI Agents SDK tool example |
| [`elizaos/`](elizaos/) | `@konstantinbozukov/plugin-edge-signals` (pre-swap action + verdict provider) |

## MCP configuration

Both services expose **Streamable HTTP MCP**. Wire them in your host; payment for tool calls still uses x402 on the underlying HTTP resources (configure wallet env vars in the host or use AgentCash: `npx agentcash add https://signals.edge.report`).

### Cursor (`~/.cursor/mcp.json` or project MCP)

```json
{
  "mcpServers": {
    "edge-signals": {
      "url": "https://signals.edge.report/mcp"
    },
    "pathmint": {
      "url": "https://pathmint.edge.report/mcp"
    }
  }
}
```

### Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "edge-signals": {
      "type": "http",
      "url": "https://signals.edge.report/mcp"
    },
    "pathmint": {
      "type": "http",
      "url": "https://pathmint.edge.report/mcp"
    }
  }
}
```

### Docker (MCP gateway / `docker-mcp`)

```yaml
# Example: extend your MCP catalog with remote HTTP servers
services:
  mcp-gateway:
    image: ghcr.io/modelcontextprotocol/gateway:latest
    environment:
      MCP_SERVERS: |
        {
          "edge-signals": { "url": "https://signals.edge.report/mcp" },
          "pathmint": { "url": "https://pathmint.edge.report/mcp" }
        }
    ports:
      - "8080:8080"
```

Pathmint tools (from [`/v1/agent-tools.json`](https://pathmint.edge.report/v1/agent-tools.json)): `ping_x402_before_pay` ($0.01), listing check, seller payments, pay-clearance (stake ≥ $0.50), live-seller compile, Messari gate. Edge Signals MCP tools include `token_verdict_before_buy` and `token_risk_before_buy`.

## Quick start

```bash
export X402_PAYER_PRIVATE_KEY=0x...   # Base wallet with USDC — never commit this
cd quickstarts && node node.mjs       # or python3 python.py
```

## x402 reference

| Service | Base URL | Pay to | Network |
| --- | --- | --- | --- |
| Edge Signals | `https://signals.edge.report` | `0xE2520f1497ee47645072a6214304807BC3340D58` | `eip155:8453` (Base USDC) |
| Pathmint | `https://pathmint.edge.report` | same | same |

Facilitator (CDP): `https://api.cdp.coinbase.com/platform/v2/x402`

## License

MIT