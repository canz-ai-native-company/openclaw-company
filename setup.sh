#!/usr/bin/env bash
#
# setup.sh — Provision a fresh laptop into the SAME OpenClaw AI-native company.
#
# RUN ORDER on a new laptop:
#   1. Install openclaw (MUST be the same version: 2026.6.8) + Node v24.15.0 + Playwright deps.
#   2. Run openclaw once (init) so ~/.openclaw exists.
#   3. git clone this repo and copy ./workspace -> ~/.openclaw/workspace
#   4. cp .env.example .env  and fill REAL secrets (this file is gitignored).
#   5. bash setup.sh
#
# This script configures the LOCAL openclaw.json only. It makes no outbound calls.
# Secrets are referenced from the environment (.env) — NEVER hard-coded here.
#
set -euo pipefail

# --- 0. Locate openclaw + its config file ---
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"
command -v openclaw >/dev/null || { echo "ERROR: openclaw not on PATH"; exit 1; }
OPENCLAW_JSON="$(openclaw config file)"
echo "Config file: $OPENCLAW_JSON"

# --- 1. Load secrets from .env (values stay in the environment, not in git) ---
if [ -f .env ]; then set -a; . ./.env; set +a; echo ".env loaded";
else echo "WARNING: .env not found — MCP/secret steps will be skipped (copy .env.example -> .env first)."; fi

# ============================================================================
# 2. MODEL: EVERY agent uses Codex CLI -> openai/gpt-5.5 , thinking = high
#    (The Codex harness/plugin is assumed already enabled on this machine.)
# ============================================================================
MODEL="openai/gpt-5.5"
RUNTIME_ID="codex"      # Codex CLI harness (schema-valid agentRuntime id)
THINKING="high"         # reasoning / thinking level

# 2a. Set the company DEFAULT first, so any newly-added agent inherits it.
openclaw config set agents.defaults.model  "$MODEL"
openclaw config set agents.defaults.models "{\"$MODEL\":{\"agentRuntime\":{\"id\":\"$RUNTIME_ID\"}}}" --strict-json
openclaw config set agents.defaults.thinking "$THINKING"

# --- 3. Create the specialist agents (main exists by default) ---
for a in research fullstack-developer designer-and-creatives marketing website-qa evaluator; do
  openclaw agents add "$a" 2>/dev/null || echo "  (agent '$a' already exists — skip)"
done

# --- 4. EXPLICITLY set the model on EVERY agent (per requirement: codex / gpt-5.5 / thinking=high) ---
MODEL="$MODEL" RT="$RUNTIME_ID" THINK="$THINKING" FILE="$OPENCLAW_JSON" node <<'NODE'
const fs = require('fs');
const { MODEL, RT, THINK, FILE } = process.env;
const j = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const runner = { [MODEL]: { agentRuntime: { id: RT } } };
const apply = (o) => { if (!o) return; o.model = MODEL; o.models = runner; o.thinking = THINK; };
if (j.agents) { apply(j.agents.defaults); for (const ag of j.agents.list || []) apply(ag); }
fs.writeFileSync(FILE, JSON.stringify(j, null, 2));
console.log(`Model set on EVERY agent -> ${MODEL} via "${RT}" runtime, thinking=${THINK}`);
NODE

# --- 5. Swarm allowlist: which workers main/Hub may spawn ---
openclaw config set agents.defaults.subagents.allowAgents \
  '["research","fullstack-developer","designer-and-creatives","marketing","website-qa","evaluator"]' --strict-json

# --- 6. Timeout (example value 90000 — confirm exact key/unit for your runtime) ---
# openclaw config set agents.defaults.runTimeoutSeconds 90000     # seconds
# openclaw config set agents.defaults.announceTimeoutMs 90000     # milliseconds

# ============================================================================
# 7. MCP servers — tokens come from .env as ENV REFS, never hard-coded.
#    Fill the real endpoints; repeat the pattern per server.
#    Servers in this company + their agents:
#      neon-postgres -> all agents (system of record)
#      hubspot       -> main
#      ghl           -> fullstack-developer
#      higgsfield    -> designer-and-creatives
#      nanobanana    -> fullstack-developer, designer-and-creatives
# ----------------------------------------------------------------------------
# Example (env-ref pattern, no secret in git):
#   openclaw config set mcp.servers.neon-postgres.token \
#     --ref-provider default --ref-source env --ref-id NEON_DATABASE_URL
#   openclaw config set mcp.servers.hubspot.token \
#     --ref-provider default --ref-source env --ref-id HUBSPOT_TOKEN
# (See README "MCP servers" for the full list.)

# --- 8. Validate the final config ---
openclaw config validate && echo "OK — config valid. Every agent on codex / gpt-5.5 / thinking=high."
