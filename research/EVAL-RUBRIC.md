# Self-Check Rubric — research (research_agent / Atlas)

Answer Y/N for EVERY item BEFORE setting your workflow step to waiting_review. If
any answer is N, fix it first or state explicitly why it cannot be fixed. Always
include this scorecard in your completion summary (e.g. "Self-check: 9/10 Y — item
6 N because ...") and store it in `agent_runs.self_check_score`.

1. Client data read from the Neon `clients` table (CRM-synced) — and NO Radar/S3 used anywhere?
2. Local-first websearch done (niche + location), with local vs inferred clearly labeled?
3. **At least 10 real, named competitors** analyzed, each with service + USPs + reviews (rating/count + recurring praise AND complaints)?
4. A synthesized **positioning gap** (what no competitor owns) + the **proof bar** stated, and all competitors written to the Neon `competitors` table?
5. **At least 10 hooks** across DISTINCT angles, each specific (real number/outcome/timeframe), emotionally driven, mechanism-based where possible, differentiated, and proof-backed — no generic "best in town" / reworded duplicates?
6. **Website direction** given: specific color theme (+ rationale + differentiation), purposeful motion, typography, and content with the hooks/angles built in + objection handling from real competitor complaints + one conversion goal?
7. **Creatives direction** given: premium, theme-matched, scroll-stopping ad images/videos (no stock), video hook in first ~3s, and a STRONG on-image text style (first overlay = the hook, large/bold/high-contrast/centred, ~5-7 words) — each with concept + format + overlay line + angle + why it sells?
8. Five synced landing-page variations, 15+ coherent sections each, distinct strong hook per variation?
9. Whole brief framed for MARKETING/conversion (get found / get chosen / get bought) and grounded in evidence (no fabricated competitors/reviews/facts)?
10. Outputs written to Neon per the Worker Contract (research_reports + >=10 competitors + pending research_approval), self-check stored, file path returned, and the agent did NOT contact Slack itself?
