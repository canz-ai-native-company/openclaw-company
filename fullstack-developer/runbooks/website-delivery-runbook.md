# Runbook — DB-Aware Website/Landing Page Digital FTE

## Recommended Production Flow

```text
1. CRM creates/updates client.
2. Nervous system/orchestrator writes `clients`, `crm_events`, `workflows`, and `workflow_steps` in Neon.
3. Website step becomes queued.
4. Andy receives `workflow_step_id` or reads `v_pending_website_jobs`.
5. Andy marks step/run as running.
6. Andy reads client context, approved research, existing theme, website version, and change requests.
7. Andy writes/updates specs.
8. Andy builds or updates landing page.
9. Andy runs fast TDD checks.
10. Andy starts local/staging server.
11. Andy runs Playwright live QA.
12. Andy saves screenshots, QA report, brand_theme record, website record, and approval request.
13. Human approves or requests changes.
14. Orchestrator resumes deploy or revision/creative step.
```

## Read Query for Next Website Job

```sql
select *
from v_pending_website_jobs
order by queued_at
limit 1;
```

## Start Run DB Steps

```sql
update workflow_steps
set status = 'running', started_at = now(), updated_at = now()
where id = :workflow_step_id;
```

```sql
insert into agent_runs (
  workflow_id, workflow_step_id, client_id, worker_key, runtime, status, input, started_at
)
values (
  :workflow_id, :workflow_step_id, :client_id, 'website_agent', 'openclaw', 'running', :input_json, now()
)
returning id;
```

## Build Output DB Steps

After build/test/staging succeeds:

1. Insert/update `brand_themes`.
2. Insert/update `websites` with `staging_url` and `status = 'ready_for_review'`.
3. Insert `qa_reports`.
4. Insert `approvals` with `gate_key = 'website_staging_approval'`, `status = 'pending'`.
5. Update `workflow_steps.status = 'waiting_review'`.
6. Update `workflows.status = 'waiting_review'`, `current_stage = 'website_review'`.
7. Insert `outbox_events` with `event_type = 'approval.requested'`.
8. Update `agent_runs.status = 'succeeded'`.

## Minimal Command Checklist Inside Workspace

Exact commands depend on the project stack, but the worker should look for package scripts first:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

If Playwright is configured:

```bash
npx playwright test
```

If using the `browsing-with-playwright` skill server:

```bash
bash skills/browsing-with-playwright/scripts/start-server.sh

python3 skills/browsing-with-playwright/scripts/mcp-client.py call \
  -u http://localhost:8808 \
  -t browser_navigate \
  -p '{"url":"http://localhost:3000"}'

python3 skills/browsing-with-playwright/scripts/mcp-client.py call \
  -u http://localhost:8808 \
  -t browser_take_screenshot \
  -p '{"type":"png","fullPage":true,"filename":"desktop-1280.png"}'
```

## Viewport QA Checklist

Run screenshots and interaction checks at:

```text
375x812
390x844
768x1024
1280x900
```

Check:

- hero readable
- nav works
- CTAs work
- forms safe-test correctly
- no horizontal overflow
- no visual overlap
- footer links work
- reduced motion works

## Human Review Protocol

Reviewer should not directly prompt the worker for random edits. Reviewer should create structured change requests in `change_requests`:

```text
issue_type: copy/design/mobile/CTA/form/link/performance/bug/compliance
requested_change: exact change
acceptance_criteria: how reviewer knows it is fixed
priority: low/medium/high/urgent
assigned_worker_key: website_agent
```

## Status Mapping

Use DB enum statuses, not ad-hoc text statuses.

```text
workflow_steps.status:
queued | running | waiting_review | revision_requested | completed | failed | skipped | cancelled

workflows.status:
queued | running | waiting_review | waiting_dependency | revision_requested | blocked | completed | failed | cancelled

websites.status:
draft | ready_for_review | approved | revision_requested | rejected | archived

approvals.status:
pending | approved | changes_requested | rejected | cancelled
```

## When to Escalate to Human

Escalate when:

- client info is missing
- research is missing or contradictory
- approval is missing
- tests fail after 2 fix attempts
- production deploy is requested but approval/rollback path is unclear
- claim could be legal/medical/financial/compliance-sensitive
- secret or credential issue appears

## Production Deploy Rule

Never deploy to production unless this is true:

```text
approvals.gate_key = production_deploy_approval
approvals.status = approved
```
