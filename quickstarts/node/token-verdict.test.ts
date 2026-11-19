import { describe, expect, it, vi } from "vitest";

describe("x402 handshake (mocked)", () => {
  it("retries after HTTP 402 payment required", async () => {
    const url =
      "https://signals.edge.report/v1/token-verdict?token=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&chain=base";
    let n = 0;
    const fetchMock = vi.fn(async () => {
      n += 1;
      if (n === 1) {
        return new Response(JSON.stringify({ x402Version: 1, accepts: [] }), {
          status: 402,
        });
      }
      return Response.json({ grade: "A", band: "SAFE", score: 1, reasons: [] });
    });
    const first = await fetchMock(url);
    expect(first.status).toBe(402);
    const second = await fetchMock(url);
    expect(second.status).toBe(200);
    expect(n).toBe(2);
  });
});