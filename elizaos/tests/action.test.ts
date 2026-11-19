import { describe, expect, it, vi } from "vitest";
import { tokenVerdictBeforeSwapAction } from "../src/actions/tokenVerdictBeforeSwap.js";
import { setEdgeSignalsFetch } from "../src/client.js";
import { LAST_VERDICT_KEY } from "../src/types.js";

const sample = {
  grade: "A",
  band: "SAFE",
  score: 90,
  reasons: ["OK"],
  disclaimer: "NFA",
};

function mockRuntime() {
  const settings = new Map<string, string>();
  return {
    getSetting: (key: string) => settings.get(key),
    setSetting: (key: string, value: string) => settings.set(key, value),
    settings,
  };
}

describe("TOKEN_VERDICT_BEFORE_SWAP", () => {
  it("fetches verdict and blocks AVOID swaps", async () => {
    setEdgeSignalsFetch(async () =>
      new Response(JSON.stringify({ ...sample, band: "AVOID", grade: "F" }), {
        status: 200,
      }),
    );

    const runtime = mockRuntime() as never;
    const message = {
      content: {
        text: "swap 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 please",
      },
    } as never;

    const result = await tokenVerdictBeforeSwapAction.handler!(
      runtime,
      message,
    );

    expect(result.success).toBe(true);
    expect(result.values?.allowSwap).toBe(false);
    expect(runtime.settings.get(LAST_VERDICT_KEY)).toContain("AVOID");
  });

  it("validates swap messages with an address", async () => {
    const ok = await tokenVerdictBeforeSwapAction.validate!(
      {} as never,
      {
        content: { text: "check before swap 0x" + "1".repeat(40) },
      } as never,
    );
    expect(ok).toBe(true);
  });
});