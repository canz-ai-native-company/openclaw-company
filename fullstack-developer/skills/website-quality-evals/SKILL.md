---
name: website-quality-evals
description: Use before marking any website or landing page ready. Covers DB-aware QA report, Playwright screenshots, responsive testing, links/buttons/forms, content truthfulness, theme handoff, and production safety.
---

# Website Quality Evals Skill

## Required eval source

Read:

```text
evals/website-digital-fte-evals.md
```

## Mandatory QA checks

- Spec exists and matches implementation.
- No fake testimonials/reviews/stats/unsupported claims.
- Hero is strong and niche/location specific.
- Mobile screenshots pass at 375 and 390.
- Tablet screenshot passes at 768.
- Desktop screenshot passes at 1280.
- No horizontal overflow.
- All nav links work.
- All CTAs work.
- Forms validate safely.
- Build/lint/typecheck/tests pass or failures are reported.
- `brand_themes` record is usable by Creative Digital FTE.
- `qa_reports` record is written with screenshots/checks.
- Approval request exists before human review.
- Production deploy blocked unless approved.

## Output

Write QA evidence to:

```text
qa_reports
eval_results
agent_runs.output
workflow_steps.output
```

If any mandatory gate fails, set workflow/step output with exact failure and do not mark ready.
