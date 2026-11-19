# edge-signals-kits

Drop-in integrations so AI agents can pay for and call [Edge Signals](https://signals.edge.report) and [Pathmint](https://pathmint.edge.report) over **x402** (USDC on Base, `eip155:8453`).

Headline SKU: **Token Verdict** — graded pre-trade due diligence (`GET /v1/token-verdict`, **$0.01** per call). Discovery (live, do not guess routes):

| Doc | URL |
|-----|-----|
| OpenAPI | https://signals.edge.report/openapi.json |
| x402 | https://signals.edge.report/.well-known/x402 |
| LLMs | https://signals.edge.report/llms.txt |
| Agent card | https://signals.edge.report/.well-known/agent.json |

**Payment:** USDC on Base to `0xE2520f1497ee47645072a6214304807BC3340D58` (see `.well-known/x402`). **Wallet:** set `X402_EVM_PRIVATE_KEY` or `EVM_PRIVATE_KEY` locally — never commit keys.

## Pick your stack

| Stack | Path | Pay + call Token Verdict |
|-------|------|---------------------------|
| **MCP (remote)** | — | Edge Signals or Pathmint HTTP MCP (no local install) |
| **curl + x402** | [`quickstarts/curl/`](quickstarts/curl/) | Shell probe + Python x402 retry |
| **Node / TS** | [`quickstarts/node/`](quickstarts/node/) | `x402-fetch` + `viem` |
| **Python** | [`quickstarts/python/`](quickstarts/python/) | `x402[httpx,evm]` |
| **LangChain (JS)** | [`langchain/js/`](langchain/js/) | `@konstantinbozukov/langchain-edge-signals` |
| **LangChain (Py)** | [`langchain/python/`](langchain/python/) | `langchain-edge-signals` on PyPI |
| **CrewAI** | [`crewai/`](crewai/) | `BaseTool` wrapper |
| **OpenAI Agents SDK** | [`openai-agents/`](openai-agents/) | `@function_tool` |
| **ElizaOS** | [`elizaos/`](elizaos/) | `@konstantinbozukov/plugin-edge-signals` (`TOKEN_VERDICT`) |

Official HTTP clients: [`x402-fetch`](https://www.npmjs.com/package/x402-fetch) / [`x402-axios`](https://www.npmjs.com/package/x402-axios) (JS), [`x402`](https://pypi.org/project/x402/) (Python).

## MCP config blocks

Registry IDs: `io.github.konstantinbozukov/edge-signals`, `io.github.konstantinbozukov/pathmint`. Both are **Streamable HTTP** remotes (no API key).

### Cursor

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

### Claude Desktop

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

CLI:

```bash
claude mcp add --transport http edge-signals https://signals.edge.report/mcp
claude mcp add --transport http pathmint https://pathmint.edge.report/mcp
```

### Docker MCP Toolkit

Add community-registry remotes to a profile (Streamable HTTP):

```bash
docker mcp profile server add agents \
  --server "https://registry.modelcontextprotocol.io/v0/servers/io.github.konstantinbozukov%2Fedge-signals" \
  --server "https://registry.modelcontextprotocol.io/v0/servers/io.github.konstantinbozukov%2Fpathmint"
```

Or declare custom remote entries (same URLs as the registry):

```yaml
# edge-signals-remote.yaml
name: edge-signals
title: Edge Signals
type: remote
remote:
  transport_type: streamable-http
  url: https://signals.edge.report/mcp
---
# pathmint-remote.yaml
name: pathmint
title: Pathmint
type: remote
remote:
  transport_type: streamable-http
  url: https://pathmint.edge.report/mcp
```

Gateway stdio bridge:

```json
{
  "mcpServers": {
    "MCP_DOCKER": {
      "command": "docker",
      "args": ["mcp", "gateway", "run", "--profile", "agents"]
    }
  }
}
```

## Token Verdict (HTTP)

```
GET https://signals.edge.report/v1/token-verdict?token={0x…}&chain=base
```

- **Price:** $0.01 (`x-payment-info` in OpenAPI)
- **200 body:** `grade` (A–F), `band` (`SAFE`|`CAUTION`|`AVOID`), `score` (0–100), `reasons[]`, `disclaimer`
- **402:** x402 payment required before retry

**Pathmint** (MCP) complements paid HTTP: tools such as `ping_x402_before_pay` and `x402_pay_clearance` help validate endpoints before larger USDC spends.

## Repo layout

- `quickstarts/` — minimal pay-and-call examples (~10 lines)
- `langchain/` — publishable LangChain tools (JS + Python)
- `crewai/`, `openai-agents/`, `elizaos/` — framework-specific wrappers
- `shared/constants.json` — canonical URLs and registry names from live discovery

## Tests & CI

Each package includes tests that **mock the HTTP 402 handshake** (no live payments in CI). GitHub Actions: [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## License

MIT — see [`LICENSE`](LICENSE).

## Publish (not done by this repo)

| Package | Name | How to publish |
|---------|------|----------------|
| LangChain JS | `@konstantinbozukov/langchain-edge-signals` | `cd langchain/js && npm publish --access public` |
| LangChain Py | `langchain-edge-signals` | `cd langchain/python && python -m build && twine upload dist/*` |
| ElizaOS | `@konstantinbozukov/plugin-edge-signals` | `cd elizaos && npm publish --access public` |

`crewai/` and `openai-agents/` are example modules in-repo (not separate registry packages).