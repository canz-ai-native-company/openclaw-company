# Website CRO Audit — Report Template

Fill every `{placeholder}`. Keep the section order. This template merges the
**7-part audit contract** (Executive summary → … → Next actions) with the **CRO
house-style** output (Quick Wins / High-Impact / Test Ideas / Copy Alternatives)
and a **score card**. Every recommendation must be specific and actionable —
quote the current text/element and explain *why* the change helps.

---

# CRO Audit — {Site / Page name}

**URL:** {url}
**Audit date:** {date}
**Page type:** {homepage | landing | pricing | feature | blog | other}
**Traffic context:** {organic | paid | email | social | direct} · goal = {conversion goal}
**Viewports tested:** desktop {1280px} · mobile {390px}
**Overall score:** **{NN}/100 — Grade {A–F}**

> Evidence basis: live browser capture via `browsing-with-playwright`
> (screenshots, accessibility snapshot, DOM `browser_evaluate`). Anything not
> verifiable in the live page is flagged as an assumption.

## 1. Executive summary
{3–5 sentences: what the page does well, the single biggest thing holding back
conversion, and the expected upside of fixing the top items.}

## 2. Biggest constraint
{The ONE thing most limiting conversion right now, with the evidence that points
to it. This is what to fix first.}

## 3. Score card

| # | Dimension                       | Score /10 | Grade | Key issue |
| - | ------------------------------- | --------- | ----- | --------- |
| 1 | Value Proposition Clarity       | {n}       | {A–F} | {one line} |
| 2 | Hero Section                    | {n}       | {A–F} | {one line} |
| 3 | CTA Effectiveness               | {n}       | {A–F} | {one line} |
| 4 | Trust Signals & Social Proof    | {n}       | {A–F} | {one line} |
| 5 | Friction & Flow                 | {n}       | {A–F} | {one line} |
| 6 | Visual Hierarchy & Scannability | {n}       | {A–F} | {one line} |
| 7 | Mobile & Performance            | {n}       | {A–F} | {one line} |
|   | **Final (weighted ×10)**        | **{NN}/100** | **{A–F}** | |

## 4. Quick Wins (implement now)
Easy changes, likely immediate impact. 3–6 items.

| # | Fix | Impact | Effort | Current | Recommended | Why |
| - | --- | ------ | ------ | ------- | ----------- | --- |
| 1 | {action} | High/Med | <15m / <30m / <1h | "{quoted current}" | "{quoted new}" | {reason} |

## 5. High-Impact Changes (prioritize)
Bigger changes that meaningfully move conversion. For each:
- **{Change}** — *Issue:* {what's wrong} · *Evidence:* {screenshot ref / DOM
  selector value} · *Fix:* {specific change} · *Expected impact:* {direction +
  rough magnitude} · *Priority:* {High/Med/Low}

## 6. Hero Section breakdown
Score the hero against `references/hero-breakdown.md` (7 components + 5-second
test). For each component state present/absent and quality:

| Component       | Present? | Assessment | Recommendation |
| --------------- | -------- | ---------- | -------------- |
| Eyebrow         | {y/n}    | {…}        | {…}            |
| Headline        | {y/n}    | {…}        | {…}            |
| Subheadline     | {y/n}    | {…}        | {…}            |
| Primary CTA     | {y/n}    | {…}        | {…}            |
| Secondary CTA   | {y/n}    | {…}        | {…}            |
| Hero visual     | {y/n}    | {…}        | {…}            |
| Trust strip     | {y/n}    | {…}        | {…}            |

**5-second test verdict:** {pass/fail + what a stranger would say it does}.
**Above-the-fold (mobile + desktop):** {is H1 + sub + CTA visible without scroll?}

## 7. Detailed findings (per dimension)
For each of the 7 dimensions: **Current** (quote the live copy/element + evidence)
→ **Issues found** → **Recommended fix**.

## 8. Copy Alternatives
2–3 variants with rationale for the highest-leverage elements:
- **Headline:** A) {…} B) {…} C) {…} — *why*
- **Primary CTA:** A) {…} B) {…} C) {…} — *why*
- **Subheadline / microcopy:** {…}

## 9. Test Ideas (A/B hypotheses)
Hypotheses worth testing rather than assuming. (Pull patterns from
`page-cro/references/experiments.md` and hand off setup to `ab-test-setup`.)

| Test | Hypothesis | Primary metric |
| ---- | ---------- | -------------- |
| {hero headline A/B} | {if … then …} | {signup rate} |

## 10. Flow & multi-page notes
{If a form / signup flow / multiple pages were walked: field count, validation,
steps, drop-off risks, message-match across pages. Reference form-cro /
signup-flow-cro / onboarding-cro findings.}

## 11. Expected impact & how to measure
- **Expected impact:** {which fixes move which metric, and roughly how much}.
- **How to measure:** {events to track — clicks, scroll depth, form starts,
  conversion rate; the primary metric per test; minimum runtime/sample}.

## 12. Priority action plan
- **Do this week:** {…}
- **Do this month:** {…}
- **Plan for next quarter:** {…}

## 13. Next actions
{The immediate, concrete next steps for the user — e.g. "ship Quick Wins 1–3,
set up the hero headline A/B via ab-test-setup, re-audit in 2 weeks."}

## Limitations
{What could NOT be assessed and why — e.g. Playwright unavailable, login-gated
page, real analytics/heatmaps not provided, true device emulation not run, third-
party scripts blocked. Be explicit so the reader knows the audit's boundaries.}
