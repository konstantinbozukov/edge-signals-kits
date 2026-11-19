import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: [
    "@elizaos/core",
    "@x402/fetch",
    "@x402/evm",
    "@x402/evm/exact/client/register",
    "viem",
    "viem/accounts",
  ],
});