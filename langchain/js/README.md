# @konstantinbozukov/edge-signals-langchain

```typescript
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { createTokenVerdictToolWithFetch } from "@konstantinbozukov/edge-signals-langchain";

// Pass a payment-enabled fetch (wallet from X402_PAYER_PRIVATE_KEY via your x402 client setup).
const tool = createTokenVerdictToolWithFetch(paidFetch);
```

`npm run build && npm test`