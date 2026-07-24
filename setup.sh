#!/usr/bin/env bash
#
# ONE-FILE company provisioner.
#
# ── ONE-TIME PREP (admin, per laptop) ──────────────────────────────────────
#   1. (AUTO) setup.sh installs OpenClaw (npm) + Node 24 (nvm) itself if missing. Still manual once: `sudo npx playwright install-deps`
#   2. Authenticate openclaw to the model provider (codex/openai login)  [interactive]
#   3. Give this laptop READ access to the repo (deploy key, or `gh auth login`, or public repo)
#   4. Put real secrets in  ~/.openclaw/.env  (use the company .env file you were given)
#
# ── THEN the non-technical user runs ONLY this: ────────────────────────────
#        bash setup.sh
# ----------------------------------------------------------------------------
set -euo pipefail

# ============ CONFIG ============
REPO_URL="${REPO_URL:-https://github.com/canz-ai-native-company/openclaw-company.git}"
NODE_BIN="$(ls -d "$HOME"/.nvm/versions/node/v*/bin 2>/dev/null | sort -V | tail -1)"; NODE_BIN="${NODE_BIN:-$HOME/.nvm/versions/node/v24.15.0/bin}"
OPENCLAW_HOME="${OPENCLAW_HOME:-$HOME/.openclaw}"
WORKSPACE="$OPENCLAW_HOME/workspace"
AGENTS=(research fullstack-developer designer-and-creatives marketing website-qa evaluator)
ALL7='["main","research","fullstack-developer","designer-and-creatives","marketing","website-qa","evaluator"]'
SPECIALISTS='["research","fullstack-developer","designer-and-creatives","marketing","website-qa","evaluator"]'
MODEL="openai/gpt-5.5"
RUNTIME_ID="codex"
THINKING="high"
TIMEOUT_SECONDS=1800
CLONE_DIR="$(mktemp -d)/company-brain"

log(){ printf '\n\033[1;36m> %s\033[0m\n' "$*"; }

# ============ 0. AUTO-INSTALL OpenClaw + Node (skipped if already installed) ============
export NVM_DIR="$HOME/.nvm"
set +u; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; set -u
if ! command -v openclaw >/dev/null 2>&1; then
  log "OpenClaw not found - auto-installing (Node 24 via nvm -> npm install -g openclaw@latest)..."
  if ! command -v nvm >/dev/null 2>&1; then
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    set +u; . "$NVM_DIR/nvm.sh"; set -u
  fi
  NODE_MAJ="$( (node -v 2>/dev/null || echo v0) | sed 's/^v//' | cut -d. -f1 )"
  if [ "$NODE_MAJ" -lt 24 ]; then
    log "Installing Node 24 (OpenClaw default target; requires 22.22.3+/24.15+/25.9+)..."
    set +u; nvm install 24; nvm alias default 24; nvm use 24; set -u
  fi
  npm install -g openclaw@latest
  openclaw onboard --install-daemon \
    || echo "  (onboard needs a terminal - run manually later: openclaw onboard --install-daemon)"
  NODE_BIN="$(ls -d "$HOME"/.nvm/versions/node/v*/bin 2>/dev/null | sort -V | tail -1)"
  echo "  Installed: openclaw $(openclaw --version 2>/dev/null || echo '?') on node $(node -v)"
else
  echo "OpenClaw already installed: $(openclaw --version 2>/dev/null) (node $(node -v 2>/dev/null))"
fi

# ============ 0. PREFLIGHT ============
export PATH="$NODE_BIN:$PATH"
for b in openclaw node git; do
  command -v "$b" >/dev/null || { echo "ERROR: '$b' not found. Complete the one-time admin prep first."; exit 1; }
done
OPENCLAW_JSON="$(openclaw config file)"
mkdir -p "$WORKSPACE"
echo "Config:    $OPENCLAW_JSON"
echo "Workspace: $WORKSPACE"

# ============ 1. CLONE the brain to a TEMP dir ============
log "Cloning company brain..."
rm -rf "$CLONE_DIR"
if ! git clone --depth 1 "$REPO_URL" "$CLONE_DIR" 2>/tmp/oc_clone.err; then
  echo "ERROR: could not clone the repo. If private, this laptop needs read access:"
  echo "   - a read-only Deploy Key,  OR   - run: gh auth login   (one time)"
  cat /tmp/oc_clone.err; exit 1
fi

# ============ 2. Load secrets (.env lives OUTSIDE git) ============
if   [ -f "$OPENCLAW_HOME/.env" ]; then set -a; . "$OPENCLAW_HOME/.env"; set +a; echo ".env loaded";
else echo "NOTE: ~/.openclaw/.env not found - MCP secret servers (step 8) will be skipped."; fi

# ============ 3. DEFAULT model: codex / gpt-5.5 / thinking=high ============
log "Setting company default model -> $MODEL via $RUNTIME_ID, thinkingDefault=$THINKING..."
openclaw config set agents.defaults.model           "$MODEL"
openclaw config set agents.defaults.models          "{\"$MODEL\":{\"agentRuntime\":{\"id\":\"$RUNTIME_ID\"}}}" --strict-json
openclaw config set agents.defaults.thinkingDefault "$THINKING"
openclaw config set agents.defaults.timeoutSeconds  "$TIMEOUT_SECONDS"

# ============ 4. ADD each specialist agent (scaffolds default workspace) ============
log "Creating the 6 specialist agents..."
EXISTING="$(openclaw config get agents.list 2>/dev/null || echo '')"
for a in "${AGENTS[@]}"; do
  if printf '%s' "$EXISTING" | grep -q "\"$a\""; then
    echo "  - $a already exists - skip add"
  else
    openclaw agents add "$a" --non-interactive --workspace "$WORKSPACE/$a" --model "$MODEL" >/dev/null
    echo "  - $a added"
  fi
done

# ============ 5. OVERLAY the REAL brain over the scaffolded default files ============
log "Overlaying the real brain over scaffolded files..."
rm -rf "$CLONE_DIR/.git"
rm -f  "$CLONE_DIR/setup.sh" "$CLONE_DIR/README.md" "$CLONE_DIR/.gitignore" \
       "$CLONE_DIR/.gitattributes" "$CLONE_DIR/.env.example"
cp -a "$CLONE_DIR/." "$WORKSPACE/"
echo "  brain installed into $WORKSPACE"

# ============ 6. FORCE the model on EVERY agent (codex/gpt-5.5/high) ============
log "Pinning model on every agent..."
MODEL="$MODEL" RT="$RUNTIME_ID" THINK="$THINKING" FILE="$OPENCLAW_JSON" node <<'NODE'
const fs = require('fs');
const { MODEL, RT, THINK, FILE } = process.env;
const j = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const runner = { [MODEL]: { agentRuntime: { id: RT } } };
const apply = (o) => { if (!o) return; o.model = MODEL; o.models = runner; o.thinkingDefault = THINK; };
if (j.agents) { apply(j.agents.defaults); for (const ag of j.agents.list || []) apply(ag); }
fs.writeFileSync(FILE, JSON.stringify(j, null, 2));
console.log(`  every agent -> ${MODEL} via "${RT}", thinkingDefault=${THINK}`);
NODE

# ============ 7. Swarm allowlist + agent-to-agent messaging ============
#   Sets the swarm allowlist (sessions_spawn), agent-to-agent messaging (sessions_send),
#   AND aligns any per-agent override (e.g. a pre-existing main) so it can't block delegation.
log "Setting swarm allowlist + agent-to-agent permissions..."
FILE="$OPENCLAW_JSON" node <<'NODE'
const fs = require('fs');
const FILE = process.env.FILE;
const A = ["main","research","fullstack-developer","designer-and-creatives","marketing","website-qa","evaluator"];
const j = JSON.parse(fs.readFileSync(FILE, 'utf8'));
j.agents = j.agents || {}; j.agents.defaults = j.agents.defaults || {};
j.agents.defaults.subagents = j.agents.defaults.subagents || {};
j.agents.defaults.subagents.allowAgents = A;                 // swarm allowlist (sessions_spawn)
j.tools = j.tools || {}; j.tools.agentToAgent = j.tools.agentToAgent || {};
j.tools.agentToAgent.allow = A;                              // agent-to-agent messaging (sessions_send)
for (const a of (j.agents.list || [])) if (a.subagents && a.subagents.allowAgents) a.subagents.allowAgents = A; // fix per-agent overrides
fs.writeFileSync(FILE, JSON.stringify(j, null, 2));
console.log("  swarm allowlist + agent-to-agent set; per-agent overrides aligned");
NODE

# ============ 8. MCP SERVERS (second-last) — exact live config; secrets from .env ============
log "Adding the 6 MCP servers..."

openclaw config set mcp.servers.context7 \
  "{\"command\":\"npx\",\"args\":[\"-y\",\"@upstash/context7-mcp\"],\"codex\":{\"agents\":$ALL7,\"defaultToolsApprovalMode\":\"approve\"}}" --strict-json \
  && echo "  - context7 (all 7)"

if [ -n "${NEON_DATABASE_URL:-}" ]; then
  openclaw config set mcp.servers.neon-postgres \
    "{\"command\":\"npx\",\"args\":[\"-y\",\"@yawlabs/postgres-mcp@latest\"],\"env\":{\"DATABASE_URL\":\"$NEON_DATABASE_URL\",\"ALLOW_WRITES\":\"1\",\"POSTGRES_STATEMENT_TIMEOUT_MS\":\"30000\",\"POSTGRES_MAX_ROWS\":\"1000\"},\"codex\":{\"agents\":$ALL7,\"defaultToolsApprovalMode\":\"approve\"}}" --strict-json \
    && echo "  - neon-postgres (all 7)"
else echo "  ! neon-postgres SKIPPED (NEON_DATABASE_URL missing in .env)"; fi

if [ -n "${HIGGSFIELD_AUTH:-}" ]; then
  openclaw config set mcp.servers.higgsfield \
    "{\"url\":\"https://mcp.higgsfield.ai/mcp\",\"transport\":\"streamable-http\",\"headers\":{\"Authorization\":\"$HIGGSFIELD_AUTH\"},\"oauth\":{},\"codex\":{\"agents\":[\"designer-and-creatives\"],\"defaultToolsApprovalMode\":\"approve\"}}" --strict-json \
    && echo "  - higgsfield (designer-and-creatives)"
else echo "  ! higgsfield SKIPPED (HIGGSFIELD_AUTH missing in .env)"; fi

if [ -n "${HUBSPOT_TOKEN:-}" ]; then
  openclaw config set mcp.servers.hubspot \
    "{\"command\":\"npx\",\"args\":[\"-y\",\"@hubspot/mcp-server\"],\"env\":{\"PRIVATE_APP_ACCESS_TOKEN\":\"$HUBSPOT_TOKEN\"},\"codex\":{\"agents\":[\"main\"],\"defaultToolsApprovalMode\":\"approve\"}}" --strict-json \
    && echo "  - hubspot (main)"
else echo "  ! hubspot SKIPPED (HUBSPOT_TOKEN missing in .env)"; fi

if [ -n "${GEMINI_API_KEY:-}" ]; then
  openclaw config set mcp.servers.nanobanana \
    "{\"command\":\"npx\",\"args\":[\"-y\",\"nano-banana-2-mcp\"],\"env\":{\"GEMINI_API_KEY\":\"$GEMINI_API_KEY\"},\"codex\":{\"agents\":[\"designer-and-creatives\",\"fullstack-developer\"],\"defaultToolsApprovalMode\":\"approve\"}}" --strict-json \
    && echo "  - nanobanana (designer-and-creatives, fullstack-developer)"
else echo "  ! nanobanana SKIPPED (GEMINI_API_KEY missing in .env)"; fi

if true; then
  CHROME_BIN=$(ls -d $HOME/.cache/ms-playwright/chromium-*/chrome-linux64/chrome 2>/dev/null | sort -V | tail -1)
  if [ -n "$CHROME_BIN" ]; then
    CDT_ARGS="[\"-y\",\"chrome-devtools-mcp@latest\",\"--isolated\",\"--headless\",\"--executable-path\",\"$CHROME_BIN\"]"
  else
    CDT_ARGS="[\"-y\",\"chrome-devtools-mcp@latest\",\"--isolated\",\"--headless\"]"
    echo "  (no playwright chromium found - chrome-devtools-mcp will use its own browser)"
  fi
  openclaw config set mcp.servers.chrome-devtools \
    "{\"command\":\"npx\",\"args\":$CDT_ARGS,\"codex\":{\"agents\":[\"fullstack-developer\",\"website-qa\"],\"defaultToolsApprovalMode\":\"approve\"}}" --strict-json \
    && echo "  - chrome-devtools (fullstack-developer, website-qa)"
fi

openclaw mcp reload 2>/dev/null || true

# ============ 9. VALIDATE config ============
log "Validating final config..."
openclaw config validate || { echo "config validate failed - review above."; exit 1; }
rm -rf "$(dirname "$CLONE_DIR")"
echo "  config valid."

# Apply the new permissions (config was edited directly above)
openclaw gateway restart 2>/dev/null || true

# ============ 10. WAKEUP TEST — every agent replies directly with its name ============
log "Wakeup test - each of the 7 agents should reply 'Hi, I am <name>'..."
for a in main research fullstack-developer designer-and-creatives marketing website-qa evaluator; do
  echo "--- $a ---"
  openclaw agent --agent "$a" --message "Wakeup check. Reply ONLY with: Hi, I am $a" --thinking low \
    || echo "  ($a did not respond - is the gateway running?)"
done

# ============ 11. SWARM TEST (final) — ask the Hub to roll-call every agent via the swarm ============
log "Swarm test - asking the Hub to roll-call all agents (this exercises agent-to-agent delegation)..."
openclaw agent --agent main \
  --message "Quick roll call - have every agent reply with one line: Hi, I'm <name>, ready to work." --thinking low \
  || echo "  (Hub did not respond - start the gateway, then re-run this command)"
echo
echo "Manual swarm check (optional) - send this to the Hub on Slack:"
echo "  Quick roll call - have every agent reply with one line: Hi, I'm <name>, ready to work."

echo
echo "DONE - Hub + 6 agents on codex / $MODEL / thinkingDefault=$THINKING, 6 MCP servers, swarm enabled."
echo "Brain installed at: $WORKSPACE"
