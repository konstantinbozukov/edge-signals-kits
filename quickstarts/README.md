# Quickstarts — Token Verdict ($0.01)

Set **`X402_PAYER_PRIVATE_KEY`** to a Base wallet funded with USDC. Never hardcode or commit keys.

| File | Runtime |
| --- | --- |
| `node.mjs` | Node 20+ with `@x402/fetch` + `@x402/evm` |
| `python.py` | Python 3.11+ with `x402` + `httpx` |
| `curl.sh` | Unpaid probe (expect HTTP 402); use Node/Python or AgentCash for paid JSON |

Paid URL shape: `GET https://signals.edge.report/v1/token-verdict?token=<0x…>&chain=base`