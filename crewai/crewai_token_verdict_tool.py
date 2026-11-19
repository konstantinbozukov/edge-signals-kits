"""CrewAI tool — Edge Signals Token Verdict ($0.01 x402 on Base)."""

from __future__ import annotations

from crewai.tools import BaseTool
from pydantic import BaseModel, Field

from langchain_edge_signals.client import fetch_token_verdict_async


class _Schema(BaseModel):
    token: str = Field(description="ERC-20 contract address")
    chain: str = Field(default="base", description="EVM chain id name")


class EdgeSignalsTokenVerdictTool(BaseTool):
    name: str = "edge_signals_token_verdict"
    description: str = (
        "Pre-trade Token Verdict: grade A–F, SAFE|CAUTION|AVOID before swapping."
    )
    args_schema: type[BaseModel] = _Schema

    def _run(self, token: str, chain: str = "base") -> str:
        import asyncio

        verdict = asyncio.run(fetch_token_verdict_async(token, chain))  # type: ignore[arg-type]
        return verdict.model_dump_json()