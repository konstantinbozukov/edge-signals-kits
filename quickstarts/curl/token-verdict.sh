#!/usr/bin/env bash
# Token Verdict — $0.01 via x402. Step 1: unpaid probe (expect HTTP 402).
set -euo pipefail
TOKEN="${TOKEN:-0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913}"
URL="https://signals.edge.report/v1/token-verdict?token=${TOKEN}&chain=base"
echo "Unpaid probe (expect HTTP 402):"
curl -sS -D /tmp/token-verdict.hdr -o /tmp/token-verdict.body "$URL" || true
head -1 /tmp/token-verdict.hdr
export URL
# Step 2: pay + retry (x402 signs USDC on Base; curl cannot sign alone — short Python helper):
exec python3 - <<'PY'
import asyncio, json, os
from eth_account import Account
from x402 import x402Client
from x402.http.clients import x402HttpxClient
from x402.mechanisms.evm import EthAccountSigner
from x402.mechanisms.evm.exact import ExactEvmScheme
url = os.environ["URL"]
key = os.environ.get("X402_EVM_PRIVATE_KEY") or os.environ.get("EVM_PRIVATE_KEY")
assert key, "Set X402_EVM_PRIVATE_KEY"
async def main():
    c = x402Client().register("eip155:8453", ExactEvmScheme(EthAccountSigner(Account.from_key(key))))
    async with x402HttpxClient(c) as http:
        print(json.dumps((await http.get(url)).json(), indent=2))
asyncio.run(main())
PY