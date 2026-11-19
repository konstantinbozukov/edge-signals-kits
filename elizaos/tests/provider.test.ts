import { describe, expect, it } from "vitest";
import { tokenVerdictProvider } from "../src/providers/tokenVerdictProvider.js";
import { LAST_VERDICT_KEY } from "../src/types.js";

describe("EDGE_SIGNALS_TOKEN_VERDICT provider", () => {
  it("surfaces cached verdict", async () => {
    const runtime = {
      getSetting: (key: string) =>
        key === LAST_VERDICT_KEY
          ? JSON.stringify({
              token: "0xabc",
              chain: "base",
              verdict: {
                grade: "B",
                band: "CAUTION",
                score: 75,
                reasons: [],
                disclaimer: "NFA",
              },
            })
          : undefined,
    } as never;

    const ctx = await tokenVerdictProvider.get!(runtime, {} as never);
    expect(ctx.text).toContain("CAUTION");
    expect(ctx.values?.tokenVerdictBand).toBe("CAUTION");
  });
});