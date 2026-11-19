from __future__ import annotations

import json
from typing import Any, Callable

from langchain_core.tools import StructuredTool

from .client import HttpGet, fetch_token_verdict


def create_token_verdict_tool(
    http_get: HttpGet,
    *,
    chain: str = "base",
    name: str = "edge_signals_token_verdict",
) -> StructuredTool:
    def _run(token: str) -> str:
        verdict = fetch_token_verdict(token, chain=chain, http_get=http_get)
        return json.dumps(verdict.model_dump())

    return StructuredTool.from_function(
        func=_run,
        name=name,
        description=(
            "Paid Edge Signals Token Verdict ($0.01, x402 USDC on Base): "
            "grade, SAFE|CAUTION|AVOID band, score, reasons before buy/swap."
        ),
    )