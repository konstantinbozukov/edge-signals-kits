from __future__ import annotations

import asyncio
import json
import os
from typing import Any, Awaitable, Callable, TypeAlias

from eth_account import Account
from pydantic import BaseModel, Field

from langchain_edge_signals.constants import (
    DEFAULT_CHAIN,
    SupportedChain,
    token_verdict_url,
)
from x402 import x402Client
from x402.http.clients import x402HttpxClient
from x402.mechanisms.evm import EthAccountSigner
from x402.mechanisms.evm.exact import ExactEvmScheme

PaidGetAsync: TypeAlias = Callable[[str], Awaitable[Any]]


class TokenVerdictResponse(BaseModel):
    product: str | None = None
    grade: str
    band: str
    score: int = Field(ge=0, le=100)
    reasons: list[str]
    metrics: dict[str, Any] | None = None
    disclaimer: str | None = None
    summary: str | None = None


def _load_private_key() -> str:
    key = os.environ.get("X402_EVM_PRIVATE_KEY") or os.environ.get("EVM_PRIVATE_KEY")
    if not key:
        raise RuntimeError(
            "Set X402_EVM_PRIVATE_KEY or EVM_PRIVATE_KEY (Base USDC wallet; never commit keys)."
        )
    return key


def create_x402_client(private_key: str | None = None) -> x402Client:
    key = private_key or _load_private_key()
    account = Account.from_key(key)
    signer = EthAccountSigner(account)
    return (
        x402Client()
        .register("eip155:8453", ExactEvmScheme(signer))
        .register("eip155:*", ExactEvmScheme(signer))
    )


async def fetch_token_verdict_async(
    token: str,
    chain: SupportedChain = DEFAULT_CHAIN,
    *,
    client: x402Client | None = None,
    get: PaidGetAsync | None = None,
) -> TokenVerdictResponse:
    url = token_verdict_url(token, chain)

    async def default_get(requested: str) -> Any:
        x402 = client or create_x402_client()
        async with x402HttpxClient(x402) as http:
            response = await http.get(requested)
            await response.aread()
            if response.status_code != 200:
                raise RuntimeError(
                    f"Token Verdict failed ({response.status_code}): {response.text[:500]}"
                )
            return json.loads(response.text)

    payload = await (get or default_get)(url)
    return TokenVerdictResponse.model_validate(payload)


def fetch_token_verdict(
    token: str,
    chain: SupportedChain = DEFAULT_CHAIN,
    **kwargs: Any,
) -> TokenVerdictResponse:
    return asyncio.run(fetch_token_verdict_async(token, chain, **kwargs))