"""OpenAI Agents SDK–style function tool for Token Verdict (mockable HTTP)."""

from __future__ import annotations

import json
from typing import Any, Callable

from dataclasses import dataclass


def _verdict_url(token: str, chain: str = "base") -> str:
    return f"https://signals.edge.report/v1/token-verdict?token={token}&chain={chain}"


@dataclass
class TokenVerdictFunctionTool:
    """Expose `.definition` and `.invoke()` like Agents SDK function tools."""

    http_get: Callable[[str], Any]
    chain: str = "base"

    @property
    def definition(self) -> dict[str, Any]:
        return {
            "type": "function",
            "name": "edge_signals_token_verdict",
            "description": (
                "Paid Edge Signals Token Verdict ($0.01 x402 USDC on Base) before swap or buy."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "token": {
                        "type": "string",
                        "description": "ERC-20 contract address (0x…)",
                    },
                    "chain": {
                        "type": "string",
                        "description": "EVM chain (default base)",
                    },
                },
                "required": ["token"],
            },
        }

    def invoke(self, token: str, chain: str | None = None) -> str:
        url = _verdict_url(token, chain or self.chain)
        response = self.http_get(url)
        if getattr(response, "status_code", 200) >= 400:
            raise RuntimeError(f"HTTP {getattr(response, 'status_code', '?')}")
        payload = response.json() if hasattr(response, "json") else response
        return json.dumps(payload)