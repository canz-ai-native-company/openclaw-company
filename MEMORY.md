# MEMORY.md — Main Agent (Cross-Session Orchestration Memory)

This file persists important orchestration state across sessions. Main agent reads this on startup and writes durable decisions here.

**Keep this file lean.** Strategic memory only — not task-level chatter.

---

## How To Use This File

| When to write | When NOT to write |
|---|---|
| New agent added/removed | Routine routing decisions |
| Major user preference confirmed | One-off task details |
| Specialist availability changed | Casual conversation |
| Approval gate decisions | Tool call logs |
| Project state milestones | Specialist's work content |
| User explicitly says "remember this" | Anything you can re-derive from files |

---

## Active Agents (current registration)

| Agent ID | Name | Role | Status | Last verified |
|---|---|---|---|---|
| `main` | Hub | Router/orchestrator | ✅ Active | (set on first run) |
| `marketing` | Mira | Marketing specialist | ✅ Active | (set on first run) |
| `fullstack-developer` | Andy | Full-stack dev | ✅ Active | (set on first run) |
| `research` | research | Client/local market research specialist | ✅ Active | 2026-06-01 |
| `designer-and-creatives` | designer-and-creatives | Design and creative specialist | ✅ Active; Hub routing smoke test passed; Higgsfield + Nano Banana MCP scoped | 2026-06-02 |

> **Update when:** new agent added, agent renamed, agent removed.

---

## Active Channels

| Channel | Account/Number | Bound to agent |
|---|---|---|
| WhatsApp default | +923492128287 | main (default) |

> **Update when:** new channel bound, account changed, routing rule added.

---

## User Preferences (durable)

> Mirror of key items from USER.md — quick recall during routing.

- Language: English only
- Length: inshort by default
- Style: direct, no fluff
- Approval rule: ask before destructive/external/paid actions
- Architecture rule: "OpenClaw disturb na ho na version na functionality"
- Skills/.md files: protect, don't auto-modify
- Routing rule: Hub/main must not do specialist fallback for creative/image/video work; route to `designer-and-creatives`, and if unavailable report blocked instead of generating directly.

---

## Active Projects (state tracking)

> Track which project is in flight per specialist. Update when major milestones happen.

| Project | Path | Owner agent | Status | Last update |
|---|---|---|---|---|
| medspa-lead-ai | `~/.openclaw/workspace/projects/medspa-lead-ai` | fullstack-developer | (state TBD) | — |
| dental-landing | `~/.openclaw/workspace/projects/dental-landing` | fullstack-developer | (state TBD) | — |
| mark-jellison-coaching | `~/.openclaw/agents/fullstack-developer/workspace/projects/mark-jellison-coaching` | fullstack-developer | spec phase (delegated 2026-05-08) | 2026-05-08 |
| canz-crd-drd | `~/.openclaw/workspace/fullstack-developer/projects/canz-crd-drd` | fullstack-developer | tests green; prior live generation used old DB runtime env; new DB retest pending approval | 2026-05-25 |

> **Update when:** project starts, hits milestone, or completes. Don't log every commit.

---

## Recent Major Decisions

> Strategic decisions only — architecture, agent setup, big config changes. Not task-level work.

- (placeholder — populate as decisions are made)
- 2026-06-01: Higgsfield MCP moved/scoped to `designer-and-creatives`; smoke test passed via non-mutating `models_explore` metadata check. Config path: `/home/raza/.openclaw/openclaw.json`. Tokens not logged.
- 2026-06-03: Higgsfield MCP re-auth completed after Raza bought Plus plan. Old auth fields were removed/replaced, OAuth device flow succeeded, config validates, and non-generating MCP initialize smoke test returned authenticated server capabilities. Backup: `/home/raza/.openclaw/openclaw.json.bak-higgsfield-reauth-20260603112806`. Tokens not logged.
- 2026-06-01: Higgsfield skills package installed in `designer-and-creatives` project scope: `higgsfield-generate`, `higgsfield-marketplace-cards`, `higgsfield-product-photoshoot`, `higgsfield-soul-id`. Path: `/home/raza/.openclaw/workspace/designer-and-creatives/.agents/skills`.
- 2026-06-01: Nano Banana MCP scoped to both `fullstack-developer` and `designer-and-creatives` with the same server command/env config. Non-generating smoke tests passed for both agents; no image generation or paid call run.
- 2026-06-02: Raza corrected Hub behavior after Spa Bliss creative fallback: main/Hub must not directly generate creative assets because it lacks that specialist expertise. Future image/video creative tasks must be delegated to `designer-and-creatives`; if specialist handoff/tooling is unavailable, Hub should report blocked and ask next step.
- 2026-06-02: `/home/raza/.openclaw/openclaw.json` includes `designer-and-creatives` in both `agents.defaults.subagents.allowAgents` and `tools.agentToAgent.allow`. After gateway restart/reset, Hub live `sessions_spawn` smoke test passed: `designer-and-creatives` replied from `/home/raza/.openclaw/workspace/designer-and-creatives`. No creative/generative call was run.
- 2026-06-03: Official HubSpot MCP added to main/Hub only using `@hubspot/mcp-server` and private app token env. Config path: `/home/raza/.openclaw/openclaw.json`. Local MCP initialize + `tools/list` smoke test passed with 21 tools, and read-only user metadata auth check succeeded; no CRM records read or updated. Backup: `/home/raza/.openclaw/openclaw.json.bak-main-hubspot-202606031608`. Secrets not logged.
- 2026-06-03: Existing official `neon-postgres` MCP was additionally scoped to main/Hub while keeping `fullstack-developer`; same server command and existing DB URL entry are reused. Config path: `/home/raza/.openclaw/openclaw.json`. JSON validation passed; live Hub tool visibility may require runtime restart/reset. Secrets not logged.
- 2026-06-04: `neon-postgres` MCP switched from deprecated/read-only `@modelcontextprotocol/server-postgres` to write-capable `@yawlabs/postgres-mcp@latest` with `ALLOW_WRITES=1`, scoped only to `main` and `fullstack-developer`. MCP initialize/tools smoke test passed with read and write tools, plus non-persistent temp-table write probe. Backup: `/home/raza/.openclaw/openclaw.json.bak-postgres-rw-2026-06-04T08-54-50-677Z`. Secrets not logged.
- 2026-06-04: Fresh `fullstack-developer`/Andy smoke check confirmed `neon-postgres` tool surface is visible with read tools and write-capable tools. No data was read or mutated. Writes remain controlled by DB role plus `ALLOW_WRITES`.

Example format:
```
- 2026-05-02: Patched OpenClaw output buffer 2MB → 30MB (CLAUDE_LIVE_MAX_TURN_RAW_CHARS).
  Reason: long deliverables were failing. Patch script: ~/openclaw-output-patch.sh.
- 2026-05-02: fullstack-developer agent added with workspace at ~/.openclaw/agents/fullstack-developer/workspace.
- 2026-05-02: main router architecture adopted. AGENTS.md/SOUL.md updated to delegate-only role.
```

---

## Pending Approvals / Open Loops

> Things waiting on user input. Clear when resolved.

- **GHL/HighLevel MCP for Andy — read/write-send validation partially passed** (updated 2026-05-26).
  - Official hosted endpoint exists: `https://services.leadconnectorhq.com/mcp/`.
  - GHL server is configured in local OpenClaw config with Authorization header; token was not logged in memory.
  - Read validation passed for the provided location via `locations_get_location` HTTP 200; contacts search also worked.
  - With explicit WhatsApp approval, one persistent contact was created and Email-channel hello messages were queued successfully to approved contacts; no SMS/social/workflow/payment action was performed.
  - Follow-up options: rotate the PIT shared in chat, then confirm cleanup/delete capability before further disposable write testing.

- **operators-dashboard-landing — Vercel alias decision** (Phase 2C completed 2026-05-07).
  - `vercel deploy --yes` auto-targeted production: alias `https://operators-dashboard-landing.vercel.app` is publicly live (200). Preview URL gated 401.
  - No secrets wired (`/api/lead` only console-logs); no commits made.
  - Awaiting Raza decision: keep / kill / repoint alias.
  - Lighthouse intentionally deferred — runbook has the command for next turn.
  - Project: `~/.openclaw/agents/fullstack-developer/workspace/projects/operators-dashboard-landing` · last report: `output/phase-2c-report.md`.

- **canz-crd-drd — new DB live retest approval needed** (DB URL verification 2026-05-25).
  - Local pytest is green after storage test contract fix: 96 passed, 1 warning.
  - Prior approved/live `/api/v1/generate` runs returned HTTP 200 but used the old container runtime DB env, not the newly supplied DB URL.
  - Current project `.env` has the new DB URL components, but the running container was not restarted/recreated after the change.
  - Next step: with approval, recreate/restart the container using updated `.env`, verify runtime DB components read-only, then run a fresh approved live generate test. Manual CRD/DRD content quality review remains needed after a valid new-DB run.

---

## Known Issues / Workarounds

> Persistent issues that affect routing decisions.

- `designer-and-creatives` routing is live. Spa Bliss final creative assets are usable, including a locally rendered 8s MP4; the external video provider auth in Vega's agent profile still needs fixing for future provider-rendered videos.

Example format:
```
- Marketing agent workspace path is /workspace/marketing (inside main's workspace). Architectural mess but functional. Re-add planned later.
- fullstack-developer workspace path has typo from interactive add. Plan: delete + re-add with clean path.
```

---

## Specialist Health Notes

> Track if a specialist has been flaky or has known limitations.

- **marketing (Mira):** memory folder empty until first real task; relies on manual `Read` for skills (registration not auto)
- **fullstack-developer (Andy):** new — bootstrap completed, persona files populated

---

## Recurring Tasks / Routines

> Cron-style or scheduled orchestration tasks main coordinates.

- (placeholder — populate when scheduled tasks added)

---

## Long-Term Context (rarely updated)

- **System:** OpenClaw 2026.4.26 on WSL2 Ubuntu-24.04 (Windows 11)
- **Backend:** claude-cli (OAuth via Claude Max) — auto-refresh from `~/.claude/.credentials.json`
- **Output buffer:** patched to 30 MB / 50K lines (re-apply after openclaw upgrades via `~/openclaw-output-patch.sh`)
- **Architecture:** main = router, marketing + fullstack-developer = specialists

---

## Synthesis Notes (cross-conversation patterns)

> If main notices Raza repeatedly asks for the same thing in different sessions — record it here so future routing is faster.

- (placeholder)

Example:
```
- Raza often asks for "inshort" replies. Default to bullets/tables, never long prose.
- Raza uses English for all OpenClaw operations, code, and architecture discussions.
```

---

## Memory Discipline Rules

1. **Strategic > tactical.** If a decision affects future routing, write it. If it's just one task's details, don't.
2. **Lean is better.** Aim for ~5 KB. If this file grows beyond 10 KB, prune.
3. **No secrets.** Never write API keys, tokens, OAuth values, or customer data.
4. **No raw transcripts.** Specialist outputs go in their own workspace `output/` — main only references paths here.
5. **Update on close.** When a project milestone hits, update status. When an agent state changes, update.
6. **Tell user on file change.** If you update this file, mention it in the next reply briefly.

---

## Quick Read Order (for fresh sessions)

1. **Active Agents** table → know who's available
2. **User Preferences** → know how to communicate
3. **Active Projects** → know what's in flight
4. **Recent Major Decisions** → know recent context
5. **Pending Approvals** → know if user has open loops
6. **Known Issues** → factor into routing decisions

Skip the rest unless directly relevant.
