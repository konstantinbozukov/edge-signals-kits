import { describe, expect, it, vi } from "vitest";
import {
  buildTokenVerdictUrl,
  createTokenVerdictToolWithFetch,
  fetchTokenVerdict,
} from "../src/index.js";

const sample = {
  product: "edge-signals-token-verdict",
  grade: "A",
  band: "SAFE",
  score: 92,
  reasons: ["Listed on DEX"],
  disclaimer: "Not financial advice.",
  summary: "SAFE — grade A",
};

describe("fetchTokenVerdict", () => {
  it("calls injectable fetch and parses JSON", async () => {
    const fetchFn = vi.fn(async () =>
      new Response(JSON.stringify(sample), { status: 200 }),
    );
    const verdict = await fetchTokenVerdict(
      "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      { fetchFn },
    );
    expect(verdict.band).toBe("SAFE");
    expect(fetchFn).toHaveBeenCalledWith(
      buildTokenVerdictUrl("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
      { method: "GET" },
    );
  });
});

describe("createTokenVerdictToolWithFetch", () => {
  it("returns tool JSON from mocked HTTP", async () => {
    const tool = createTokenVerdictToolWithFetch(
      async () => new Response(JSON.stringify(sample), { status: 200 }),
    );
    const out = await tool.invoke({
      token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    });
    expect(JSON.parse(out).grade).toBe("A");
  });
});