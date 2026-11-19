import { describe, expect, it, vi } from "vitest";

import { tokenVerdictAction } from "./tokenVerdict.js";

vi.mock("../client.js", () => ({
  paidTokenVerdictGet: vi.fn(async () => ({
    grade: "A",
    band: "SAFE",
    score: 91,
    reasons: [],
  })),
}));

describe("TOKEN_VERDICT action", () => {
  it("handles mocked paid response after 402 flow", async () => {
    const ok = await tokenVerdictAction.validate?.(
      {} as never,
      { content: { text: "swap 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" } } as never,
    );
    expect(ok).toBe(true);
    const result = await tokenVerdictAction.handler?.(
      {} as never,
      { content: { text: "before swap 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" } } as never,
    );
    expect(result?.success).toBe(true);
    expect(String(result?.text)).toContain("SAFE");
  });
});