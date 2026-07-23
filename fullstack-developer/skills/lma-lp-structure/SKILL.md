---
name: lma-lp-structure
description: |
  The LMA landing-page blueprint: how an LMA client LP is structured — the 10+
  section flow, alternating visual rhythm (image-led vs plain content sections),
  hero pattern, offer/proof placement, form & CTA conventions, and the LMA
  standard pages (Privacy Policy & Terms). Use for EVERY client landing-page
  build (pipeline Mode A or direct Mode B) — it feeds the existing 9-phase
  premium workflow, it does not replace it.
---

# LMA LP Structure (Landing-Page Blueprint)

Teaches the STRUCTURE an LMA landing page follows. **The real knowledge is in
`references/examples/` — 4 verbatim production blueprints from different niches
(Cybersecurity, Healthcare/Wellness, SaaS, Services). Study them before building.**

## Skill Type
- **Classification**: Execution support (structure standard applied during a build)
- **Layer**: 3 — reusable component, used inside the `premium-landing-page` 9-phase workflow

## Persona — Execution Workflow

You are implementing an LMA-standard landing page. For each LP build:

1. **STUDY** — Read at least 2 blueprints in `references/examples/` (pick the
   closest niche + one other). Note the pattern, not the client's content:
   section order, how sections alternate visually, where proof/offer/FAQ sit.
2. **MAP CONTENT** — Take the copy/hooks from the APPROVED research brief (Mode A)
   or the user's brief (Mode B). Never reuse an example's client copy — examples
   give SHAPE, research gives WORDS.
3. **BLUEPRINT** — Lay out the page in the LMA pattern before coding
   (this becomes/extends spec doc `04-sections-and-copy.md`):
   - **10+ sections** in the LMA flow: Hero → Problem/Pain → Promise/Outcome →
     Unique mechanism → How it works → Benefits → Proof/Trust → Offer + CTA →
     Objection handling/FAQ → Risk reversal → Final CTA.
   - **Alternating rhythm**: image/parallax-led sections alternate with plain
     high-contrast content sections (see examples).
   - **Hero pattern**: one chosen hook as headline, subline with mechanism,
     single primary CTA, trust strip.
   - **Form/CTA conventions**: one conversion goal; form fields minimal;
     CTA repeated at hero, mid-page, final.
   - **LMA standard pages**: Privacy Policy & Terms included; form redirects to a
     thank-you state.
4. **BUILD** — Implement via the existing 9-phase premium workflow (static
   HTML/CSS/JS Canz standard, mobile as its own breakpoint, purposeful motion).
5. **VALIDATE** — Structure check: all blueprint sections present, in order,
   alternation respected, zero placeholder copy, one conversion goal.

## Decision Questions
- **Context**: Which example blueprint is the closest niche? What copy/hooks does the approved brief provide for each section?
- **Convergence**: Are 10+ LMA-flow sections present and visually alternating? (Y/N) Does every section carry real, brief-sourced copy? (Y/N)
- **Safety**: Am I copying an example's client-specific copy/claims? (then STOP — examples are structure-only)

## Operating Principles
- **Structure-From-Examples, Words-From-Research** — Constraint: examples supply the pattern only; Reason: each client's copy must come from their own approved research; Application: never let example copy/claims leak into the build.
- **Blueprint-Before-Code** — Constraint: the section blueprint exists in the spec before any scaffolding; Reason: LMA quality comes from deliberate structure; Application: extend `04-sections-and-copy.md` with the LMA flow first.
- **One-Conversion-Goal** — Constraint: a single primary conversion action per page; Reason: split goals kill conversion; Application: every CTA points to the same action.

## Reference Files (VERBATIM LMA production outputs — structure reference only)
| File | Niche |
|---|---|
| `references/examples/Greenlight-Media__95cbb74a__lp_copy.md` | Cybersecurity |
| `references/examples/interconnect-international-llc__ef972fb9__lp_copy.md` | Healthcare/Wellness |
| `references/examples/ClarusIQ__9d5a14ec__lp_copy.md` | SaaS |
| `references/examples/Prospectus-Growth-Strategies__c3f5b283__lp_copy.md` | Services (general) |
