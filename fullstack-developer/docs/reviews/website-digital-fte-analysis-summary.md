# Analysis Summary — DB-Aware Andy Website/Landing Page Digital FTE

## What changed after DB schema

The earlier package defined Andy as an AI-native Website/Landing Page Digital FTE, but the DB schema was not finalized yet. After creating the Neon schema, this package updates Andy's operating contract so it uses the actual DB tables and views.

## Important logical decision

No major behavior changed:

- Andy is still specs-first.
- Andy still follows premium landing page workflow.
- Andy still runs TDD and Playwright QA.
- Andy still cannot deploy to production without approval.
- Human feedback still enters through structured change requests.
- Creative handoff still depends on `brand_theme_json`.

The update only makes the agent **DB-aware**.

## DB-aware additions

Andy now explicitly reads:

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

Andy now explicitly writes:

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

## Why these files should still exist

`AGENTS.md` should stay lean and act as the employee's core operating instruction.

Longer operational knowledge should stay outside AGENTS:

- `specs/agents/website-digital-fte.md` = exact worker contract
- `evals/website-digital-fte-evals.md` = pass/fail quality gates
- `runbooks/website-delivery-runbook.md` = operational process
- `docs/reviews/website-digital-fte-analysis-summary.md` = decision history
- `skills/website-delivery-workflow/SKILL.md` = auto-loadable delivery playbook
- `skills/website-quality-evals/SKILL.md` = auto-loadable QA playbook
- `db/001_ai_native_delivery_schema.sql` = database contract

## Next setup sequence

1. Run DB schema in Neon.
2. Save this package into OpenClaw workspace.
3. Make `AGENTS.md` the Website Digital FTE's main agent instruction.
4. Put specs/evals/runbooks/docs/skills/db files in the matching folders.
5. Update the Website Agent tools so it can read/write Neon securely.
6. Test with a manual DB client before connecting CRM.
7. Connect CRM webhook/cron + orchestrator.
