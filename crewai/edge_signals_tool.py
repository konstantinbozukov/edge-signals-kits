"""CrewAI-compatible tool for Edge Signals Token Verdict (inject payment-enabled HTTP)."""

from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any, Callable

VERDICT_URL_TEMPLATE = (
    "https://signals.edge.report/v1/token-verdict?token={token}&chain={chain}"
)


@dataclass
class EdgeSignalsTokenVerdictTool:
    """Drop into a Crew `tools=[...]` list (subclass pattern)."""

    http_get: Callable[[str], Any]
    chain: str = "base"
    name: str = "edge_signals_token_verdict"
    description: str = (
        "Paid Token Verdict ($0.01 x402 on Base): grade A–F, band, score, reasons before trading."
    )

    def run(self, token: str) -> str:
        url = VERDICT_URL_TEMPLATE.format(token=token, chain=self.chain)
        response = self.http_get(url)
        if getattr(response, "status_code", 200) >= 400:
            raise RuntimeError(f"HTTP {response.status_code}")
        payload = response.json() if hasattr(response, "json") else response
        return json.dumps(payload)