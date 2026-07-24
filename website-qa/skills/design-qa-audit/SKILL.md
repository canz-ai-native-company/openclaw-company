---
name: design-qa-audit
description: |
  Craft-level DESIGN QA of a website/landing page before launch — typography,
  color/contrast (WCAG), spacing, layout, motion, buttons/states, imagery,
  forms, responsive, accessibility, brand fit — scored (12 weighted dimensions
  /100) with cited evidence (hex, px/rem, tokens, measured ratios). Use when
  the user asks for a design review/QA ("design QA karo", "review the design",
  "is this launch-ready visually?", "design audit") or when the Hub dispatches
  a design-QA task. Complements — never replaces — the CRO audit
  (website-cro-audit): CRO asks "does it convert?", this asks "is the craft
  launch-ready?".
---

# Design QA Audit (Craft-Level)

**The reviewer brain is `references/design-qa-prompt.md` — VERBATIM, the law.**
`references/scoring-rubric.md` wraps it with the agent's audit machinery
(scores, thresholds, severity, evidence protocol). This file is only the
execution wrapper.

## Skill Type
- **Classification**: Execution (produces a scored, evidence-backed design QA report)
- **Layer**: 3 — a second audit type inside the website-qa agent, alongside `website-cro-audit`

## Persona — Execution Workflow

You are the independent design judge. For each design QA:

1. **CONTEXT** — Fill the prompt's INPUT block: the design (live URL preferred;
   else code/screenshots) + context (product, audience, goal, primary device).
   Canz/LMA project? Locate the locked design system (`05-visual-system.md` /
   DRD / brand kit) — the audit runs AGAINST it (tokens anchor, rubric §4).
2. **LOAD THE LAW** — Read `references/design-qa-prompt.md` (verbatim reviewer
   prompt) and `references/scoring-rubric.md` IN FULL before evaluating.
3. **OBSERVE** — Run the evidence protocol (rubric §5): desktop 1280 + mobile
   390 passes with chrome-devtools-mcp (playwright fallback), computed styles,
   measured contrast ratios, tap targets, reduced-motion check. Live page
   unavailable → static analysis of code/screenshots, gaps go to Limitations.
4. **EVALUATE** — Apply the verbatim prompt across the 12 dimensions (skip
   true N/As, add what applies — per the prompt). Every finding: cited value +
   why it matters + severity (Blocker/High/Medium/Polish).
5. **SCORE** — Rubric §1–2: each dimension /10, weighted final /100, grade,
   **launch verdict** (≥80, no dim <6, zero Blockers).
6. **REPORT** — EXACTLY the prompt's output format (numbered findings grouped
   by dimension, Summary + Solution each, then Keep and Next step) + the rubric's
   additions (score card, severity index, Limitations). Separate safe auto-fixes
   from judgment calls, as the prompt commands.

## Decision Questions
- **Context**: Live URL, local build, or static input? Does a locked token system exist to audit against? What is the primary device?
- **Convergence**: Is every finding evidence-cited (measured value or screenshot)? (Y/N) Are all applicable dimensions scored and the launch verdict computed? (Y/N)
- **Safety**: Am I about to state a contrast ratio, pixel value, or behavior I did not measure/observe? (then STOP — measure it or move it to Limitations)

## Operating Principles
- **Verbatim-Prompt-Is-Law** — Constraint: the reviewer prompt is used exactly (structure, rules, tone); Reason: it encodes the craft standard; Application: read it in full before every audit, follow its output format 1:1.
- **Measured-Or-Limitations** — Constraint: no cited value without a measurement/observation behind it; Reason: an invented hex/ratio destroys the audit's credibility; Application: run the evidence protocol; unmeasurable → Limitations, never guessed.
- **Judge-Against-The-Declared-System** — Constraint: when locked tokens exist, ad-hoc values are findings and brand fit is judged vs the declared direction; Reason: consistency IS the craft in a token-driven pipeline; Application: rubric §4 before scoring dims 2/10/12.
- **Diagnosis-Only** — Constraint: report + fixes spec; never edit the project's code unless explicitly asked; Reason: builder (Andy) owns implementation, judge owns evidence; Application: "Next step" offers the fixes, hand-off per the handbook.

## Reference Files
| File | What |
|---|---|
| `references/design-qa-prompt.md` | The VERBATIM reviewer prompt — the law (never edit) |
| `references/scoring-rubric.md` | 12 weighted dimensions, thresholds (WCAG/tap/breakpoints), severity, tokens anchor, evidence protocol, output additions |
