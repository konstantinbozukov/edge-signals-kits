"""Mock 402 then paid 200 for Token Verdict URL."""

import json

TOKEN = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
URL = f"https://signals.edge.report/v1/token-verdict?token={TOKEN}&chain=base"


def test_handshake_shape():
    unpaid = {
        "x402Version": 1,
        "accepts": [
            {
                "scheme": "exact",
                "network": "eip155:8453",
                "maxAmountRequired": "10000",
                "resource": URL,
                "payTo": "0xE2520f1497ee47645072a6214304807BC3340D58",
            }
        ],
    }
    paid = {
        "grade": "A",
        "band": "SAFE",
        "score": 92,
        "reasons": [],
        "disclaimer": "Not financial advice.",
    }
    steps = [402, 200]
    bodies = [unpaid, paid]
    for status, body in zip(steps, bodies, strict=True):
        if status == 402:
            assert body["accepts"][0]["resource"] == URL
        else:
            assert json.loads(json.dumps(body))["grade"] == "A"