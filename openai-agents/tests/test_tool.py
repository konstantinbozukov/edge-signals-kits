from edge_signals_function_tool import TokenVerdictFunctionTool


class Resp:
    status_code = 200

    def json(self):
        return {
            "grade": "F",
            "band": "AVOID",
            "score": 12,
            "reasons": ["Honeypot flag"],
            "disclaimer": "NFA",
        }


def test_openai_agents_tool():
    tool = TokenVerdictFunctionTool(http_get=lambda _u: Resp())
    assert tool.definition["name"] == "edge_signals_token_verdict"
    out = tool.invoke("0x0000000000000000000000000000000000000001")
    assert "AVOID" in out