from __future__ import annotations

import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import openai_agents_token_verdict as tool_mod
from langchain_edge_signals import client as client_mod
from openai_agents_token_verdict import token_verdict_impl


@pytest.mark.asyncio
async def test_openai_agents_tool_mocked(monkeypatch):
    async def fake_fetch(token: str, chain="base", **kwargs):
        return client_mod.TokenVerdictResponse.model_validate(
            {
                "grade": "A",
                "band": "SAFE",
                "score": 95,
                "reasons": [],
                "disclaimer": "Not financial advice.",
            }
        )

    monkeypatch.setattr(tool_mod, "fetch_token_verdict_async", fake_fetch)
    result = await token_verdict_impl("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913")
    assert "SAFE" in result