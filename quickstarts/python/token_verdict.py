"""Pay $0.01 USDC on Base for Edge Signals Token Verdict via x402."""

import asyncio
import json
import os

from eth_account import Account
from x402 import x402Client
from x402.http.clients import x402HttpxClient
from x402.mechanisms.evm import EthAccountSigner
from x402.mechanisms.evm.exact import ExactEvmScheme

TOKEN = os.getenv("TOKEN", "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913")
KEY = os.environ.get("X402_EVM_PRIVATE_KEY") or os.environ.get("EVM_PRIVATE_KEY")
if not KEY:
    raise SystemExit("Set X402_EVM_PRIVATE_KEY or EVM_PRIVATE_KEY")

URL = f"https://signals.edge.report/v1/token-verdict?token={TOKEN}&chain=base"


async def main() -> None:
    signer = EthAccountSigner(Account.from_key(KEY))
    client = x402Client().register("eip155:8453", ExactEvmScheme(signer))
    async with x402HttpxClient(client) as http:
        r = await http.get(URL)
        print(json.dumps(r.json(), indent=2))


asyncio.run(main())