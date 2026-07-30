# Self-Check Rubric — fullstack-developer (website_agent) · LMA Edition

Answer Y/N for EVERY item BEFORE setting your workflow step to waiting_review.
If any answer is N, fix it first or state explicitly why it cannot be fixed.
Always include this scorecard in your completion summary
(e.g. "Self-check: 10/11 Y — item 5 N: staging URL pending DNS").

1. Spec written/updated BEFORE implementation (specs-driven discipline)?
2. Correct IDs used everywhere (workflow_step_id, client_id, workflow_id)?
3. Full premium-design brief followed (not a basic 5-section page)?
4. Tests/TDD executed and passing (or failures explained honestly)?
5. Outputs written to Neon per Worker Contract (agent_runs, websites, qa_reports, artifacts)?
6. Approval row created (pending) and workflow_steps set to waiting_review?
7. Staging URL verified reachable before requesting approval?
8. Self-check scorecard included in the completion summary AND stored in agent_runs.self_check_score?

## LMA Build Method items (mandatory since the LMA structure skills)

9. LMA structure skill loaded and followed — `lma-lp-structure` (LP) or `lma-website-structure` (multi-page) — with at least 2 reference examples studied (closest niche + one other) BEFORE blueprinting?
10. Page structure matches the LMA blueprint: 10+ sections in the LMA flow (Hero → Pain → Promise → Mechanism → How it works → Benefits → Proof → Offer/CTA → Objections/FAQ → Risk reversal → Final CTA), alternating visual rhythm, one conversion goal, standard pages (Privacy & Terms) present?
11. `lma-visual-implementation` applied at Phase 5 — visual system documented in the LMA visual-guide format and implemented as design tokens (no ad-hoc colors/fonts), palette justified against the research's competitor analysis?
12. Zero reference-example copy/claims/numbers reused — every section's copy traces to the APPROVED research brief (or the user's direct brief in Mode B)? **AND** every section in `04-sections-and-copy.md` carries a `Source:` line naming where its words came from (client brief / context interview / earlier design doc) — at least 6 sourced, none naming material this build never gathered (canz-sor `WEB-INV-013`)?

## Design Language Protocol items (mandatory for every design task)

13. `design-language-protocol` loaded BEFORE Phase 1, a chosen reference's design LANGUAGE extracted (never copied) — or, for unconventional briefs, audience profile compiled + 2–3 concepts/skeleton approved BEFORE code?
14. Tokens locked in `05-visual-system.md` AND the shipped CSS uses ONLY those declared tokens (no ad-hoc colors/fonts) — full system finalized on one page first?
15. Every animation has a written PURPOSE in `07-motion.md` (no decoration-only motion), and the client site ships as static HTML/CSS/JS (Canz standard, no frameworks)?

## System of Record checks (canz-sor, mandatory since 2026-07-29)

16. **Re-tested after every change** — if any code file changed after the audit passed,
    the browser test AND the audit were run again in full, and both score sets reported?
    (An approved page that was edited afterwards was never approved — canz-sor
    `WEB-INV-011`.)
17. **Method record checked** — at the start of the job you consulted canz-sor
    (`sor_get_map` for the website vertical), and when something went wrong you followed
    the matching exception entry rather than improvising? (If canz-sor was unreachable you
    may answer Y and say so — the record helps, it never blocks.)
