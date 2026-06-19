# Spec — Website/Landing Page Digital FTE

## Purpose

This spec defines Andy as a DB-aware Website/Landing Page Digital FTE inside the AI-native delivery factory.

Andy receives a website job from the nervous system/orchestrator, reads the official state from Neon Postgres, builds or updates a website/landing page, runs TDD and Playwright QA, writes artifacts back to the DB, and waits for human approval before production deployment.

## System of Record

Neon Postgres is the operational source of truth. The schema contract is:

```text
db/001_ai_native_delivery_schema.sql
```

Andy must not rely on chat memory for client/workflow state.

## Actors

- **CRM:** source of client events.
- **Nervous System / Orchestrator:** receives CRM events, creates workflows/steps, wakes agents, waits for approvals, resumes next steps.
- **Neon Postgres:** system of record for clients, workflow state, artifacts, approvals, change requests, QA, runs, and outbox events.
- **Research Digital FTE:** produces approved market research.
- **Andy Website Digital FTE:** builds/tests/stages websites.
- **Human Reviewer:** approves or requests changes through the system.
- **Creative Digital FTE:** consumes approved website + brand theme.

## Main DB Tables

### Read

```text
v_pending_website_jobs
clients
workflows
workflow_steps
research_reports
competitors
brand_themes
websites
change_requests
approvals
```

### Write

```text
agent_runs
artifacts
brand_themes
websites
qa_reports
approvals
change_requests
eval_results
workflow_steps
workflows
outbox_events
```

## Data Flow

```text
CRM client event
  -> orchestrator creates/updates clients, workflows, workflow_steps
  -> website step becomes queued or revision_requested
  -> Andy receives workflow_step_id or reads v_pending_website_jobs
  -> Andy reads client + approved research + change requests
  -> Andy writes/updates specs
  -> Andy builds/revises website
  -> Andy runs TDD + Playwright QA
  -> Andy writes brand theme, website, QA report, artifacts, approval request
  -> human approves or requests changes
  -> orchestrator resumes deploy or creative step
```

## Input Contract

Preferred DB-native input:

```json
{
  "workflow_step_id": "uuid",
  "workflow_id": "uuid",
  "client_id": "uuid"
}
```

Fallback query when the orchestrator asks Andy to pick next work:

```sql
select *
from v_pending_website_jobs
order by queued_at
limit 1;
```

## Intake Rules

Before implementation, Andy must verify:

1. Client exists in `clients`.
2. Workflow exists in `workflows`.
3. Website step exists in `workflow_steps` and is `queued` or `revision_requested`.
4. Required client fields exist: business name, niche, location or explicit reason why missing is acceptable.
5. If research is required, an approved `research_reports` record exists.
6. If this is a revision, at least one open/resolvable `change_requests` record exists.
7. Production deployment is not attempted without approved production approval.

If required data is missing, Andy must stop safely and record the missing fields in the step output / agent run output.

## Start Run DB Writes

When work begins:

```sql
update workflow_steps
set status = 'running', started_at = now(), updated_at = now()
where id = :workflow_step_id;
```

Insert an `agent_runs` row:

```sql
insert into agent_runs (
  workflow_id, workflow_step_id, client_id, worker_key, runtime, status, input, started_at
)
values (
  :workflow_id, :workflow_step_id, :client_id, 'website_agent', 'openclaw', 'running', :input_json, now()
)
returning id;
```

## Website Build Outputs

After successful staging build, Andy must write:

### `brand_themes`

Required fields:

- client_id
- workflow_id
- status = `ready_for_review` or `approved` only if separately approved
- version
- primary_color
- secondary_color
- accent_color
- tone
- cta
- design_tokens
- created_by_run_id

The `design_tokens` JSON must include typography, button style, image style, layout style, do-not-use list, and creative handoff notes.

### `websites`

Required fields:

- client_id
- workflow_id
- brand_theme_id
- status = `ready_for_review`
- staging_url
- repo_url / branch_name / commit_sha where available
- build_status
- qa_status
- lighthouse_summary where available
- created_by_run_id

### `qa_reports`

Required fields:

- client_id
- workflow_id
- target_type = `website`
- target_id = website id
- status = `passed` or `failed`
- score
- checks JSON
- screenshots JSON
- playwright_report_url where available
- lighthouse_report_url where available
- created_by_run_id

### `approvals`

Create a pending human approval:

```text
target_type = website
gate_key = website_staging_approval
status = pending
requested_by_worker = website_agent
```

### `workflow_steps`

Set:

```text
status = waiting_review
completed_at = now()
output = website_id, staging_url, brand_theme_id, qa_report_id, approval_id
```

### `workflows`

Set:

```text
status = waiting_review
current_stage = website_review
```

### `outbox_events`

Insert:

```text
event_type = approval.requested
aggregate_type = approval
aggregate_id = approval_id
```

## Revision Flow

For `revision_requested` steps:

1. Read open `change_requests` assigned to `website_agent`.
2. Update relevant spec before implementation.
3. Patch smallest safe surface.
4. Re-run affected tests, build, and Playwright checks.
5. Mark change request `resolved` only when acceptance criteria pass.
6. Create or update website version according to project convention.
7. Create new pending approval.

## Production Deploy Gate

Andy may not deploy to production unless this exists:

```text
approvals.gate_key = production_deploy_approval
approvals.status = approved
```

If missing, Andy must create/request approval and stop.

## TDD Plan

Run in this order where available:

1. Spec acceptance checks.
2. Lint.
3. Typecheck.
4. Unit/component tests.
5. Build.
6. Playwright smoke test.
7. Playwright interaction test: nav, CTAs, forms.
8. Responsive screenshots: 375, 390, 768, 1280.
9. Accessibility/Lighthouse where available.
10. UI/UX audit and design polish.

## Playwright Evidence

Required screenshot artifacts:

```text
screenshots/<client>/<workflow_step_id>/mobile-375.png
screenshots/<client>/<workflow_step_id>/mobile-390.png
screenshots/<client>/<workflow_step_id>/tablet-768.png
screenshots/<client>/<workflow_step_id>/desktop-1280.png
```

Required checks:

- page loads without severe console errors
- all nav items resolve
- all CTAs click to correct target
- forms validate safely in test mode
- no overlapping elements
- no horizontal scroll on mobile
- sticky/fixed elements do not block key content

## Security and Privacy

- Use `.env` / `.env.example`; never hardcode secrets.
- Never log DB URL, CRM tokens, API keys, or PII.
- Sanitize user/client content before rendering.
- Avoid unsafe HTML injection.
- Do not fetch arbitrary URLs from backend contexts without SSRF controls.
- Do not invent compliance-sensitive claims.

## Definition of Done

A website step is complete only when:

- DB state was read and respected.
- Specs exist and match implementation.
- TDD/build/browser QA were run or clearly reported as unavailable.
- Playwright screenshots are saved.
- QA report is saved in `qa_reports`.
- Brand theme is saved in `brand_themes`.
- Website staging URL is saved in `websites`.
- Approval request is saved in `approvals`.
- `agent_runs`, `workflow_steps`, `workflows`, and `outbox_events` are updated.
- Production deploy did not happen without approval.
