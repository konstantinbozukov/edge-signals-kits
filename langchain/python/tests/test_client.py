from __future__ import annotations

import json

import pytest

from langchain_edge_signals.client import fetch_token_verdict_async
from langchain_edge_signals.constants import token_verdict_url

SAMPLE = {
    "product": "edge-signals-token-verdict",
    "grade": "A",
    "band": "SAFE",
    "score": 92,
    "reasons": ["Listed on DEX"],
    "disclaimer": "Not financial advice.",
}

TOKEN = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"


@pytest.mark.asyncio
async def test_token_verdict_url_matches_openapi():
    assert token_verdict_url(TOKEN) == (
        "https://signals.edge.report/v1/token-verdict?"
        "token=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&chain=base"
    )


@pytest.mark.asyncio
async def test_mocked_402_handshake():
    url = token_verdict_url(TOKEN)
    leg = 0

    async def legs(requested: str):
        nonlocal leg
        leg += 1
        assert requested == url
        if leg == 1:
            payment_required = {
                "x402Version": 1,
                "accepts": [
                    {
                        "scheme": "exact",
                        "network": "eip155:8453",
                        "maxAmountRequired": "10000",
                        "resource": url,
                        "payTo": "0xE2520f1497ee47645072a6214304807BC3340D58",
                    }
                ],
            }
            assert json.loads(json.dumps(payment_required))
            return None
        return SAMPLE

    async def x402_aware(requested: str):
        first = await legs(requested)
        if first is None:
            return await legs(requested)
        return first

    verdict = await fetch_token_verdict_async(TOKEN, get=x402_aware)
    assert verdict.band == "SAFE"
    assert leg == 2