"""Token Verdict — set X402_PAYER_PRIVATE_KEY (Base USDC). Never commit keys."""
import asyncio, os
from eth_account import Account
from x402 import x402Client
from x402.http.clients import x402HttpxClient
from x402.mechanisms.evm.exact.register import register_exact_evm_client

TOKEN = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
URL = f"https://signals.edge.report/v1/token-verdict?token={TOKEN}&chain=base"

async def main() -> None:
    pk = os.environ.get("X402_PAYER_PRIVATE_KEY") or os.environ.get("EDGE_SIGNALS_PAYER_PRIVATE_KEY")
    if not pk:
        raise SystemExit("Set X402_PAYER_PRIVATE_KEY")
    client = register_exact_evm_client(x402Client(), signer=Account.from_key(pk))
    async with x402HttpxClient(client) as http:
        print((await http.get(URL)).json())

asyncio.run(main())