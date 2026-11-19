from typing import Literal
from urllib.parse import urlencode

EDGE_SIGNALS_BASE = "https://signals.edge.report"
TOKEN_VERDICT_PATH = "/v1/token-verdict"
TOKEN_VERDICT_PRICE_USD = "0.01"
DEFAULT_CHAIN: Literal["base"] = "base"

SupportedChain = Literal[
    "base", "ethereum", "bsc", "arbitrum", "optimism", "polygon"
]


def token_verdict_url(token: str, chain: SupportedChain = DEFAULT_CHAIN) -> str:
    query = urlencode({"token": token, "chain": chain})
    return f"{EDGE_SIGNALS_BASE}{TOKEN_VERDICT_PATH}?{query}"