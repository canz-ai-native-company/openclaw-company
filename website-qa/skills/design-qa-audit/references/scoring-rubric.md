# Design QA — Scoring Rubric, Thresholds & Evidence Protocol

This wraps the verbatim reviewer prompt (design-qa-prompt.md) with the agent's
audit machinery: measurable evidence, scores, severity, and a launch verdict.
The prompt defines HOW to review; this file defines how to MEASURE and SCORE it.

## 1. The 12 dimensions — score each /10, weighted total /100

| # | Dimension | Weight | Scored on |
|---|---|---|---|
| 1 | Type & hierarchy | 12 | Scale consistency, clear H1→body ladder, line-height/measure, one type system |
| 2 | Color & contrast (WCAG) | 12 | Measured ratios vs thresholds below; palette discipline (token roles, not ad-hoc) |
| 3 | Spacing & rhythm | 10 | Consistent spacing scale (4/8px grid), section rhythm, breathing room, no cramped/orphan blocks |
| 4 | Layout & composition | 10 | One eye-path, alignment/grid discipline, balanced density, no accidental asymmetry |
| 5 | Responsive / mobile | 10 | True mobile pass at the breakpoints below — layout integrity, no overflow/clipping, mobile-first patterns |
| 6 | Buttons & states | 8 | Hierarchy (primary vs secondary), hover/focus/active/disabled states exist and are visible |
| 7 | Motion & interaction | 8 | Purposeful only (guides the eye), sleek not heavy, `prefers-reduced-motion` respected |
| 8 | Forms & conversion | 8 | Field styling/labels/validation states, error clarity, keyboard types on mobile |
| 9 | Imagery & icons | 6 | Consistent style/quality, no stretched/pixelated/generic-stock feel, icon set coherence |
| 10 | Shape & elevation | 6 | Consistent radii, shadow system (one elevation language), no mixed metaphors |
| 11 | Accessibility (beyond contrast) | 6 | Focus visibility, alt text, heading order, tap targets, zoom/reflow |
| 12 | Brand fit | 4 | Does the look match the audience + message? Judged against the LOCKED tokens/visual guide when the project has them |

- **Skipped dimensions** (genuinely N/A — e.g. no forms on the page): mark `n/a`,
  redistribute the weight proportionally across the scored ones, and SAY which were
  skipped and why.
- **Added dimensions** (the prompt allows adding what applies): score them /10,
  weight 4 each, taken proportionally from the pool — name them explicitly.

## 2. Verdict

- **Final score** = weighted total /100.
- **Grade**: A ≥90 · B ≥80 · C ≥70 · D ≥60 · F <60.
- **Launch-ready** = final ≥80 AND no scored dimension <6 AND zero Blocker findings.
- Severity per finding: **Blocker** (ship-stopper: broken layout, illegible text,
  failed contrast on primary content/CTA, unusable mobile) · **High** (hurts
  conversion/credibility) · **Medium** · **Polish**.

## 3. Concrete thresholds (cite the MEASURED value against these)

- **Contrast (WCAG 2.1 AA):** normal text ≥ **4.5:1** · large text (≥24px, or
  ≥18.66px bold) ≥ **3:1** · UI components & graphical objects ≥ **3:1**.
- **Tap targets:** ≥ **44×44px** on mobile (measure the actual computed box).
- **Breakpoints for the responsive pass:** **375 · 390 · 768 · 1280** (Canz standard).
- **Motion:** every animation has a stated purpose; emulate
  `prefers-reduced-motion: reduce` and verify transforms stop.
- **Type:** a consistent scale (e.g. 1.2–1.333 ratio); body line-height ≈1.5–1.7;
  line length ~45–75ch on desktop.
- **Spacing:** values fall on the project's spacing scale (typically 4/8px steps) —
  flag one-off values (e.g. `margin: 13px`).

## 4. Tokens anchor (Canz/LMA projects — audit AGAINST the declared system)

If the project has a locked design system — `specs/<project>/05-visual-system.md`,
a DRD, or a brand kit — the audit is measured **against it**:

- Every color/font/radius/shadow in the CSS should trace to a declared token.
  **Ad-hoc values that bypass the token table are findings** (cite the value and
  the token it should have used).
- Brand fit (dim 12) = does the executed page match the DECLARED direction
  (palette roles, type pairing, tone) — not the reviewer's taste.
- No such system available → say so under Limitations and judge brand fit from
  the stated audience/context only, labeled as a judgment call.

## 5. Evidence protocol (an uncited finding is an opinion, not QA)

Reuse the agent's live-browser spine (chrome-devtools-mcp first, playwright
fallback; localhost for local builds — never a bare file path):

1. Desktop pass **1280**: full-page screenshot; computed styles for type scale,
   spacing, colors (hex), radii, shadows; contrast measurements on real
   text/background pairs; button state inspection (hover/focus via DOM).
2. Mobile pass **390** (spot-check 375/768): full-page screenshot; overflow check;
   tap-target measurements; sticky/fixed behavior.
3. Motion: observe transitions; toggle `prefers-reduced-motion`.
4. Record every finding's evidence: screenshot name + the measured value(s).
   Static-only input (screenshots/code, no live page)? State it in Limitations —
   measure what is measurable from the code (hex, px) and label the rest.

## 6. Output = the verbatim prompt's format, PLUS

After the prompt's `Keep` / `Next step` sections, append:

- **Score card** — the 12 dimensions (each /10 or n/a), weighted final /100, grade,
  and the **launch verdict** (launch-ready: yes/no + why).
- **Severity index** — findings grouped Blocker / High / Medium / Polish (numbers
  reference the findings above).
- **Limitations** — what could not be observed/measured and why.
