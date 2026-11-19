from edge_signals_langchain import create_token_verdict_tool, fetch_token_verdict

SAMPLE = {
    "product": "edge-signals-token-verdict",
    "grade": "A",
    "band": "SAFE",
    "score": 92,
    "reasons": ["Listed on DEX"],
    "disclaimer": "Not financial advice.",
}


class MockResponse:
    status_code = 200

    def json(self):
        return SAMPLE


def test_fetch_token_verdict_mock():
    verdict = fetch_token_verdict(
        "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        http_get=lambda _url: MockResponse(),
    )
    assert verdict.band == "SAFE"
    assert verdict.score == 92


def test_langchain_tool_mock():
    tool = create_token_verdict_tool(lambda _url: MockResponse())
    out = tool.invoke({"token": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"})
    assert '"grade": "A"' in out or '"grade":"A"' in out.replace(" ", "")