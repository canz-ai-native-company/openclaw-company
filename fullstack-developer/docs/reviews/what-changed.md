# What Changed — v3 DB-Aware Update

## Reason

The previous Website Digital FTE package was created before the Neon schema existed. Now that the schema exists, the agent files need to reference actual tables/views and DB status flow.

## Files updated

- `AGENTS.md`
- `specs/agents/website-digital-fte.md`
- `evals/website-digital-fte-evals.md`
- `runbooks/website-delivery-runbook.md`
- `skills/website-delivery-workflow/SKILL.md`
- `skills/website-quality-evals/SKILL.md`
- `docs/reviews/website-digital-fte-analysis-summary.md`
- `db/001_ai_native_delivery_schema.sql`

## Logic preserved

- Specs-first development
- Premium landing page workflow
- TDD fast approach
- Playwright live QA
- Human review gates
- No production deploy without approval
- Structured change requests
- Brand theme handoff for Creative Digital FTE

## Main addition

The agent is now aligned with the Neon schema:

- Reads `v_pending_website_jobs`
- Writes `agent_runs`, `brand_themes`, `websites`, `qa_reports`, `approvals`, `workflow_steps`, `workflows`, `outbox_events`
- Uses DB enum statuses instead of ad-hoc status text
