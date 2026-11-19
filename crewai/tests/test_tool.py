from __future__ import annotations

import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from crewai_token_verdict_tool import EdgeSignalsTokenVerdictTool


def test_tool_formats_verdict(monkeypatch):
    from langchain_edge_signals import client as client_mod
    import crewai_token_verdict_tool as tool_mod

    async def fake_fetch(token: str, chain="base", **kwargs):
        return client_mod.TokenVerdictResponse.model_validate(
            {
                "grade": "B",
                "band": "CAUTION",
                "score": 70,
                "reasons": ["elevated sell tax"],
                "disclaimer": "Not financial advice.",
            }
        )

    monkeypatch.setattr(tool_mod, "fetch_token_verdict_async", fake_fetch)
    out = EdgeSignalsTokenVerdictTool()._run(
        "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
    )
    assert "CAUTION" in out