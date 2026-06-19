# Heartbeat Task

ONE task runs on every heartbeat/cron trigger: **Read the CRM → Hub decides → delegate.** Read new CRM records, let **Hub** decide which specialist each record needs, hand it off, track in Neon, and report to Raza. It is **NOT always a website** — Hub chooses the right agent per record. Stay silent if nothing is pending.

## CRM Intake → Hub Decides → Delegate

You run as the **Hub** orchestrator (HubSpot MCP + neon-postgres MCP). Neon is the system of record — never infer state from chat. Follow your AGENTS.md routing + "Program: Dispatch + Approval". Cap 1–2 worker spawns in flight.

### 1. READ the CRM
- HubSpot MCP: find new/ready records (deals/contacts marked ready for an AI workflow, e.g., `ai_workflow_status=ready`).
- Extract the client + the request: business name, niche, location, current website, **required service / what the client actually wants**, notes.
- Dedup against Neon by HubSpot ID. If already handled → skip.

### 2. RECORD + DECIDE (Hub's job — choose the agent, not always website)
- INSERT the client + a `crm_events` row + a `workflows` row into Neon (the system of record).
- **Hub reads the required service / query and DECIDES which specialist(s) this record needs.** Map the intent to a worker, e.g.:
  - research / market intelligence / client_id work → `worker_key='research_agent'` → **research (Atlas)**
  - website / landing page / web build/update → `worker_key='website_agent'` → **fullstack-developer (Andy)**
  - marketing / SEO / ads/copy / content/campaign → `worker_key='marketing_agent'` → **marketing (Mira)**
  - images / video / ad creatives / product shots → `worker_key='creative_agent'` → **designer-and-creatives (Vega)**
  - multi-service / full delivery → create several steps with the right `worker_key`s + `depends_on_step_id` so they run in order (e.g. research → website → creatives).
- Create the `workflow_steps` with the chosen `worker_key`(s), status `queued`, and a `outbox_events` row. Do NOT do any specialist work here.

> Note: today only **website_agent (Andy)** is wired for execution (testing phase). research/marketing/creative agents map in later — the decision logic above is already generic, so adding them is just: register the agent + give it a Worker Contract + (if needed) add its pending-jobs view.

### 3. DELEGATE (dispatch)
Run the **Program: Dispatch + Approval** from your AGENTS.md: read pending queued/revision_requested jobs (any worker), claim atomically, map `worker_key → agent`, `sessions_spawn` that agent with `workflow_step_id=<id>` in the task text, mark running, then EXIT (the worker's completion auto-wakes you). Re-queue stuck jobs (running > 25 min with no result).

### 4. APPROVALS + NOTIFY
- Surface pending approvals to Raza on Slack.
- **DM Raza ONLY** — direct IM to Slack user `slack:U0B263YNJNA`. NEVER post in the `#canz-ai-employee` channel. DM only on meaningful events: delegated, needs-approval, failed, completed.
- If nothing changed (no new record, no queued job, no pending approval) → reply only `NO_REPLY`. No noise, no duplicates.
