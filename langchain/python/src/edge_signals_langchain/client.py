from __future__ import annotations

from typing import Any, Callable, Literal

from pydantic import BaseModel, Field

SIGNALS_BASE = "https://signals.edge.report"

TokenVerdictBand = Literal["SAFE", "CAUTION", "AVOID"]
TokenVerdictGrade = Literal["A", "B", "C", "D", "F"]

HttpGet = Callable[[str], Any]


class TokenVerdictResponse(BaseModel):
    grade: TokenVerdictGrade
    band: TokenVerdictBand
    score: int = Field(ge=0, le=100)
    reasons: list[str]
    disclaimer: str
    product: str | None = None
    summary: str | None = None
    metrics: dict[str, Any] | None = None


def build_token_verdict_url(token: str, chain: str = "base", base_url: str = SIGNALS_BASE) -> str:
    return f"{base_url.rstrip('/')}/v1/token-verdict?token={token}&chain={chain}"


def fetch_token_verdict(
    token: str,
    *,
    chain: str = "base",
    http_get: HttpGet | None = None,
    base_url: str = SIGNALS_BASE,
) -> TokenVerdictResponse:
    url = build_token_verdict_url(token, chain, base_url)
    if http_get is None:
        raise ValueError("http_get is required (use x402-enabled httpx in production)")

    response = http_get(url)
    status = getattr(response, "status_code", None)
    if status is not None and status >= 400:
        raise RuntimeError(f"Token Verdict failed: HTTP {status}")

    if hasattr(response, "json"):
        payload = response.json()
    elif isinstance(response, dict):
        payload = response
    else:
        raise TypeError("http_get must return a response with .json() or a dict")

    return TokenVerdictResponse.model_validate(payload)