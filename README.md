# OpenClaw AI-Native Company — Brain

This repo is the **portable brain** of the company: every agent's definition,
skills, evals, and learned lessons — plus `setup.sh` to configure a fresh laptop
into the **same** company.

It does **NOT** contain secrets, client project builds, generated media, or
backups. Those are excluded by design (see `.gitignore`).

---

## What's inside

| Path | What |
|------|------|
| `AGENTS.md`, `IDENTITY.md`, `SOUL.md`, `TOOLS.md`, `USER.md`, `HEARTBEAT.md`, `ECONOMICS.md`, `EVAL-METHOD.md`, `MEMORY.md` | Hub / company-level brain |
| `research/`, `fullstack-developer/`, `designer-and-creatives/`, `marketing/`, `website-qa/`, `evaluator/` | The 6 specialist agents: `AGENTS.md`, `EVAL-RUBRIC.md`, `evals/`, `skills/`, `MEMORY.md` (lessons) |
| `skills/`, `memory/` | Shared skills + memory |
| `setup.sh` | Configures a fresh openclaw into this company (model + agents + allowlist) |
| `.env.example` | Template of required secrets (copy to `.env`, never commit) |

## Model

`setup.sh` sets **every agent** to **Codex CLI → `openai/gpt-5.5`, thinking = `high`**.

## Setup on a NEW laptop (order matters)

1. Install **openclaw `2026.6.8`** (same version) + Node `v24.15.0` + Playwright deps
   (`sudo npx playwright install-deps` — fixes the `libnspr4.so` error).
2. Run `openclaw` once so `~/.openclaw` exists.
3. `git clone` this repo, then copy `./workspace`* into `~/.openclaw/workspace`.
   (*this repo's root files ARE the workspace contents — clone and copy accordingly.)
4. `cp .env.example .env` and fill the real secrets. **Never commit `.env`.**
5. `bash setup.sh`

## Single-active rule (IMPORTANT)

All laptops share the **same Neon system-of-record**. To avoid double-dispatch /
double-cron / double-Slack, **only ONE laptop runs the company (Hub + heartbeat +
cron) at a time.** The others are synced standby copies.

## Keeping lessons in sync

The agents' learning lives in each `MEMORY.md` (in this repo). On handoff, the
active laptop **pushes** its workspace; standby laptops **pull** — so lessons travel.

## Access model

- **Push:** owner only.
- **Employees:** **Read** role (org) or a **read-only deploy key** — they can
  `clone`/`pull`, not push. Improvements come back via **Pull Request**.
- Secrets never appear here, so read access never exposes tokens.

## MCP servers (filled by `setup.sh` step 7, tokens from `.env`)

| Server | Agents |
|--------|--------|
| `neon-postgres` | all agents (system of record) |
| `hubspot` | main |
| `ghl` | fullstack-developer |
| `higgsfield` | designer-and-creatives |
| `nanobanana` | fullstack-developer, designer-and-creatives |
