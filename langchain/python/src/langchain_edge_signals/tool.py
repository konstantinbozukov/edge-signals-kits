from __future__ import annotations

from typing import Literal, Type

from langchain_core.tools import BaseTool
from pydantic import BaseModel, Field

from langchain_edge_signals.client import fetch_token_verdict_async
from langchain_edge_signals.constants import DEFAULT_CHAIN


class TokenVerdictInput(BaseModel):
    token: str = Field(description="ERC-20 contract address (0x…)")
    chain: Literal[
        "base", "ethereum", "bsc", "arbitrum", "optimism", "polygon"
    ] = Field(default=DEFAULT_CHAIN)


class TokenVerdictTool(BaseTool):
    name: str = "edge_signals_token_verdict"
    description: str = (
        "Graded token due-diligence ($0.01 USDC on Base via x402): "
        "grade A–F, SAFE|CAUTION|AVOID, score 0–100, reasons."
    )
    args_schema: Type[BaseModel] = TokenVerdictInput

    def _run(self, token: str, chain: str = DEFAULT_CHAIN) -> str:
        import asyncio

        result = asyncio.run(fetch_token_verdict_async(token, chain))  # type: ignore[arg-type]
        return result.model_dump_json()

    async def _arun(self, token: str, chain: str = DEFAULT_CHAIN) -> str:
        result = await fetch_token_verdict_async(token, chain)  # type: ignore[arg-type]
        return result.model_dump_json()


def make_token_verdict_tool() -> TokenVerdictTool:
    return TokenVerdictTool()