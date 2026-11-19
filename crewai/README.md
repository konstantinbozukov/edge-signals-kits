# CrewAI example

```python
from edge_signals_tool import EdgeSignalsTokenVerdictTool
# http_get = your x402-aware GET (e.g. x402HttpxClient)
tool = EdgeSignalsTokenVerdictTool(http_get=http_get)
```

Set `X402_PAYER_PRIVATE_KEY` in the environment when wiring a real payer — never hardcode keys.