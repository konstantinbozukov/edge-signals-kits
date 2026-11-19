#!/usr/bin/env bash
# Unpaid probe — expect HTTP 402 + PAYMENT-REQUIRED. For paid JSON use node.mjs or:
#   npx agentcash try 'https://signals.edge.report/v1/token-verdict?token=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&chain=base'
set -euo pipefail
curl -sS -D - -o /dev/null \
  "https://signals.edge.report/v1/token-verdict?token=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&chain=base"