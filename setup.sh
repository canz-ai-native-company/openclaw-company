#!/usr/bin/env bash
#
# ONE-FILE company provisioner.
#
# ── ONE-TIME PREP (admin, per laptop) ──────────────────────────────────────
#   1. Install openclaw 2026.6.8 + Node v24.15.0 + `sudo npx playwright install-deps`
#   2. Authenticate openclaw to the model provider (codex/openai login)  [interactive]
#   3. Give this laptop READ access to the private repo:
#        a read-only Deploy Key, OR run `gh auth login` once
#   4. Put real secrets in  ~/.openclaw/.env  (copy from .env.example)
#
# ── THEN the non-technical user runs ONLY this: ────────────────────────────
#        bash setup.sh
# ----------------------------------------------------------------------------
set -euo pipefail

# ============ CONFIG ============
REPO_URL="${REPO_URL:-https://github.com/canz-ai-native-company/openclaw-company.git}"
NODE_BIN="$HOME/.nvm/versions/node/v24.15.0/bin"
OPENCLAW_HOME="${OPENCLAW_HOME:-$HOME/.openclaw}"
WORKSPACE="$OPENCLAW_HOME/workspace"
AGENTS=(research fullstack-developer designer-and-creatives marketing website-qa evaluator)
MODEL="openai/gpt-5.5"
RUNTIME_ID="codex"            # Codex CLI harness
THINKING="high"              # thinkingDefault (off|minimal|low|medium|high|xhigh|adaptive|max)
TIMEOUT_SECONDS=1800          # 30 min
CLONE_DIR="$(mktemp -d)/company-brain"

log(){ printf '\n\033[1;36m> %s\033[0m\n' "$*"; }

# ============ 0. PREFLIGHT ============
export PATH="$NODE_BIN:$PATH"
for b in openclaw node git; do
  command -v "$b" >/dev/null || { echo "ERROR: '$b' not found. Complete the one-time admin prep first."; exit 1; }
done
OPENCLAW_JSON="$(openclaw config file)"
mkdir -p "$WORKSPACE"
echo "Config:    $OPENCLAW_JSON"
echo "Workspace: $WORKSPACE"

# ============ 1. CLONE the brain to a TEMP dir (never the wrong place) ============
log "Cloning company brain..."
rm -rf "$CLONE_DIR"
if ! git clone --depth 1 "$REPO_URL" "$CLONE_DIR" 2>/tmp/oc_clone.err; then
  echo "ERROR: could not clone the private repo. This laptop needs read access:"
  echo "   - a read-only Deploy Key,  OR   - run: gh auth login   (one time)"
  cat /tmp/oc_clone.err; exit 1
fi

# ============ 2. Load secrets (.env lives OUTSIDE git) ============
if   [ -f "$OPENCLAW_HOME/.env" ]; then set -a; . "$OPENCLAW_HOME/.env"; set +a; echo ".env loaded";
else echo "NOTE: ~/.openclaw/.env not found - MCP/secret steps (8) will be skipped."; fi

# ============ 3. DEFAULT model: codex / gpt-5.5 / thinking=high (new agents inherit this) ============
log "Setting company default model -> $MODEL via $RUNTIME_ID, thinkingDefault=$THINKING..."
openclaw config set agents.defaults.model           "$MODEL"
openclaw config set agents.defaults.models          "{\"$MODEL\":{\"agentRuntime\":{\"id\":\"$RUNTIME_ID\"}}}" --strict-json
openclaw config set agents.defaults.thinkingDefault "$THINKING"
openclaw config set agents.defaults.timeoutSeconds  "$TIMEOUT_SECONDS"

# ============ 4. ADD each specialist agent (this scaffolds default workspace files) ============
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
#   agents add just wrote default AGENTS.md/SOUL.md/skills -> replace them with ours.
#   (Hub/root files -> $WORKSPACE ; each agent -> $WORKSPACE/<agent>. No --delete:
#    openclaw's own state/auth that it scaffolded stays intact.)
log "Overlaying the real brain over scaffolded files..."
rm -rf "$CLONE_DIR/.git"
rm -f  "$CLONE_DIR/setup.sh" "$CLONE_DIR/README.md" "$CLONE_DIR/.gitignore" \
       "$CLONE_DIR/.gitattributes" "$CLONE_DIR/.env.example"
cp -a "$CLONE_DIR/." "$WORKSPACE/"
echo "  brain installed into $WORKSPACE"

# ============ 6. FORCE the model on EVERY agent (explicit codex/gpt-5.5/high) ============
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

# ============ 7. Swarm allowlist (which workers main/Hub may spawn) ============
log "Setting swarm allowlist..."
openclaw config set agents.defaults.subagents.allowAgents \
  '["research","fullstack-developer","designer-and-creatives","marketing","website-qa","evaluator"]' --strict-json

# ============ 8. MCP servers - tokens from .env as ENV REFS (fill real endpoints) ============
# Scaffold (repeat per server; secret stays in .env, never in git):
#   openclaw config set mcp.servers.neon-postgres.token --ref-provider default --ref-source env --ref-id NEON_DATABASE_URL
#   openclaw config set mcp.servers.hubspot.token       --ref-provider default --ref-source env --ref-id HUBSPOT_TOKEN
#   ... ghl / higgsfield / nanobanana ...

# ============ 9. VALIDATE + cleanup ============
log "Validating final config..."
if openclaw config validate; then
  rm -rf "$(dirname "$CLONE_DIR")"
  echo
  echo "DONE - Hub + 6 agents on codex / $MODEL / thinkingDefault=$THINKING."
  echo "Brain installed at: $WORKSPACE"
else
  echo "config validate failed - review the errors above."; exit 1
fi
