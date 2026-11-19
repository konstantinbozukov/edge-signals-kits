"""OpenAI Agents SDK tool — Token Verdict before swap."""

from __future__ import annotations

from agents import function_tool

from langchain_edge_signals.client import fetch_token_verdict_async


async def token_verdict_impl(token: str, chain: str = "base") -> str:
    verdict = await fetch_token_verdict_async(token, chain)  # type: ignore[arg-type]
    return verdict.model_dump_json()


edge_signals_token_verdict = function_tool(token_verdict_impl)