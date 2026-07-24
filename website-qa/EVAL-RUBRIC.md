# Self-Check Rubric — website-qa (qa_agent) · with Design QA

Answer Y/N for EVERY item BEFORE returning any audit (or writing the qa_reports
row in Mode A). If any answer is N, fix it first or state explicitly why it
cannot be fixed. Always include this scorecard in your completion summary
(e.g. "Self-check: 8/9 Y — item 4 N because staging unreachable") and store it
in `agent_runs.self_check_score` when a run row exists.

*(Note: this rubric file was referenced by the Worker Contract but did not
previously exist — items 1–7 codify the existing handbook's Definition of Done;
items 8–11 add the Design QA checks.)*

1. The page was actually OBSERVED (live browser pass desktop 1280 + mobile 390, chrome-devtools-mcp first / playwright fallback) — or the degradation was stated and assumption-based dimensions flagged?
2. The relevant skill(s) were loaded and read (`website-cro-audit` + browser skill; flow/technical skills as needed; `design-qa-audit` for design QA)?
3. Product/audience/goal context considered (product-marketing-context read when available)?
4. All applicable dimensions scored per the rubric (CRO: 7 weighted dims + final /100 + grade) and the single biggest constraint named?
5. EVERY finding cites real evidence (screenshot, DOM/computed value, measured number, or quoted copy) — zero invented screenshots/values/verdicts?
6. Recommendations specific and prioritized (Issue/Impact/Evidence/Fix/Priority; current → exact recommended), with expected impact + how to measure?
7. Limitations and assumptions explicitly stated; Mode A: only `agent_runs` + one `qa_reports` row written, state machine untouched?

## Design QA items (mandatory for EVERY website/page audit)

8. `design-qa-audit` loaded and the VERBATIM reviewer prompt read in full and followed exactly — its rules (cite hex/px/rem/tokens, why-it-matters, prioritize, judgment calls labeled), its exact output format, its tone — no paraphrase?
9. All applicable design dimensions (of the 12) scored /10 with the weighted final /100, severity per finding (Blocker/High/Medium/Polish), and the LAUNCH VERDICT computed (≥80, no dim <6, zero Blockers) — skipped dims named with reasons?
10. Measured against the concrete thresholds (WCAG 4.5:1 / 3:1, ≥44px tap targets, breakpoints 375/390/768/1280, reduced-motion) — and against the project's LOCKED tokens/visual guide when one exists (ad-hoc values flagged)?
11. Design score kept SEPARATE from the CRO score (never blended), `Keep` (real strengths) + `Next step` (safe auto-fixes vs judgment calls) present?
