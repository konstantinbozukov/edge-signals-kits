import { describe, expect, it, vi } from "vitest";

import { fetchTokenVerdict, type PaidHttpGet } from "./client.js";
import { tokenVerdictUrl } from "./constants.js";

const SAMPLE = {
  product: "edge-signals-token-verdict",
  grade: "A",
  band: "SAFE",
  score: 92,
  reasons: ["Listed on DEX"],
  disclaimer: "Not financial advice.",
};

describe("fetchTokenVerdict", () => {
  it("builds the live Token Verdict URL", () => {
    expect(tokenVerdictUrl("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913")).toBe(
      "https://signals.edge.report/v1/token-verdict?token=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&chain=base",
    );
  });

  it("uses an x402-aware HTTP getter (mocked 402 then 200)", async () => {
    const url = tokenVerdictUrl("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913");
    let leg = 0;
    const get: PaidHttpGet = vi.fn(async () => {
      leg += 1;
      if (leg === 1) {
        return new Response(
          JSON.stringify({
            x402Version: 1,
            accepts: [
              {
                scheme: "exact",
                network: "eip155:8453",
                maxAmountRequired: "10000",
                resource: url,
                payTo: "0xE2520f1497ee47645072a6214304807BC3340D58",
              },
            ],
          }),
          { status: 402, headers: { "content-type": "application/json" } },
        );
      }
      return Response.json(SAMPLE);
    });

    // Simulate wrapFetchWithPayment: retry inside getter before returning to caller
    const x402AwareGet: PaidHttpGet = async (requestUrl) => {
      const first = await get(requestUrl);
      if (first.status === 402) {
        return get(requestUrl);
      }
      return first;
    };

    const verdict = await fetchTokenVerdict({
      token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      get: x402AwareGet,
    });
    expect(verdict.grade).toBe("A");
    expect(leg).toBe(2);
  });
});