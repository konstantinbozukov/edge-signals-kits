from edge_signals_tool import EdgeSignalsTokenVerdictTool


class Resp:
    status_code = 200

    def json(self):
        return {"grade": "B", "band": "CAUTION", "score": 70, "reasons": [], "disclaimer": "NFA"}


def test_crew_tool_mock():
    tool = EdgeSignalsTokenVerdictTool(http_get=lambda _u: Resp())
    out = tool.run("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913")
    assert "CAUTION" in out