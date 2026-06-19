---
name: website-delivery-workflow
description: Use this for every client website or landing page delivery job. Covers DB intake, spec-first workflow, TDD, staging, Playwright QA, Neon writes, human approval, and production deploy gates.
---

# Website Delivery Workflow Skill

## Load first for

- New landing page
- Website update
- Website revision
- Staging delivery
- Production deploy request

## Required source files

Read these before planning:

```text
specs/agents/website-digital-fte.md
runbooks/website-delivery-runbook.md
db/001_ai_native_delivery_schema.sql
```

## Process

1. Read DB state from `v_pending_website_jobs` or exact `workflow_step_id`.
2. Validate client/workflow/step status.
3. Insert/update `agent_runs` and set step running.
4. Write/update specs before code.
5. Build using the premium landing page workflow.
6. Run TDD checks and build.
7. Run Playwright live QA.
8. Save `brand_themes`, `websites`, `qa_reports`, and `approvals`.
9. Set workflow/step to waiting review.
10. Emit `outbox_events.approval.requested`.
11. Stop until human approval/change request exists.

## Do not

- Guess missing client/research data.
- Deploy production without approval.
- Accept direct edit requests unless converted to `change_requests`.
- Mark work done without QA evidence.
