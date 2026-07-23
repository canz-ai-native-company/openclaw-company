---
name: design-language-protocol
description: |
  MANDATORY for EVERY design task (landing page, website, page addition, or
  redesign — client work AND direct requests). The Canz design discipline:
  extract design language instead of copying, lock tokens, skeleton-before-code
  for unconventional briefs, one-page-first, designer-grade feedback, and
  purposeful animations. Load BEFORE Phase 1 of the premium workflow; its rules
  govern all 9 phases. Source principles preserved verbatim in references/.
---

# Design Language Protocol (MANDATORY)

The design discipline behind every Canz/LMA build. **The full source principles
are in `references/The-Art-of-AI-Design-video-notes.md` (verbatim) — read them
once per session; this file operationalizes them into the workflow.**

## Skill Type
- **Classification**: Execution support (always-on design discipline across the 9 phases)
- **Layer**: 3 — cross-cutting; MANDATORY companion to `premium-landing-page`

## Persona — The 8 Rules (applied across the phases)

1. **References BEFORE AI** *(Phase 2)* — Never start generating blind. Gather
   aesthetic references first; pick the one that genuinely fits. Name the CHOSEN
   reference in `02-references.md`.
2. **Extract, never copy** *(Phase 2→5)* — From the chosen reference (URL /
   screenshot / existing site), do NOT "make it like this". **Extract its design
   language**: color palette + roles, type scale, spacing, density, radius,
   shadows, motion feel. Adopt the language — never steal the design.
3. **Lock the tokens** *(Phase 5)* — Write a REAL token table in
   `05-visual-system.md`: hex codes, font families + sizes (heading/subheading/
   body), spacing rhythm, radius, shadows. The shipped CSS must USE these
   declared tokens — no ad-hoc values mid-build.
4. **Rules persist** — The locked tokens govern EVERY page and every revision.
   Consistency is the point: one system across the whole site.
5. **Unconventional briefs → audience + skeleton first** *(Phases 1, 3)* — For
   "something never made before" there is no reference, so compile the audience
   context in `01-discovery.md` (who, age, mindset, education/tech level) and
   present **2–3 design-language CONCEPTS + a layout skeleton** in
   `03-direction.md`. Get the pick BEFORE writing any code — never render first.
6. **One page first** — Finalize the complete token system on `index.html`
   alone. Every other page then gets CONTENT only — never a new design
   discussion per page. (100-page portal = design effort on one page.)
7. **Feedback like a designer, not a client** — Never iterate with "make it more
   beautiful / modern / professional" (that forces template output). State what
   you LIKE, what you DON'T (fonts? colors? layout? density?), reference the
   tokens, revise the concept. Stuck in a variation loop → "Think deep. Think
   different. Think out of the box." + restate the purpose + name what's wrong.
8. **Animations with purpose** *(Phase 7)* — "An animation without a purpose is
   just noise." Every animation in `07-motion.md` states its PURPOSE (guide the
   eye, show connectivity, reveal hierarchy). Concept in writing first, then
   build. Sleek > heavy; never decoration-only.

**Color/theme decisions**: derive from audience + product nature + category
(e.g. hi-tech audiences skew purple/neon; health audiences skew flat/green) —
justified in the spec, differentiated from competitors.

**Implementation stack (client websites/LPs)**: semantic HTML + modern CSS using
the locked tokens (custom properties) + vanilla JavaScript — the Canz static
standard. No frameworks or build steps for client sites.

## Decision Questions
- **Context**: Is a chosen reference named (or, for unconventional briefs, is the audience profile compiled + skeleton approved)? Which tokens are locked?
- **Convergence**: Does the shipped CSS use ONLY the declared tokens? (Y/N) Does every animation have a written purpose? (Y/N) Was the full design finalized on one page before inner pages? (Y/N)
- **Safety**: Am I about to say/accept "make it more beautiful"-style feedback, copy a reference outright, or introduce an ad-hoc color/font? (then STOP — apply rules 2/3/7)

## Operating Principles
- **Language-Not-Design** — Constraint: adopt the reference's language, never its design; Reason: copying breeds dependence, language-extraction builds vocabulary and originality; Application: always run the extraction step and record it in the spec.
- **Tokens-Are-Law** — Constraint: no styling outside the locked token table; Reason: token drift = template-looking, inconsistent pages; Application: validate CSS against `05-visual-system.md` before QA.
- **Skeleton-Before-Render** — Constraint: unconventional briefs get concepts + skeleton approval before code; Reason: rendering first wastes cycles and anchors on the wrong direction; Application: block Phase 8 until the concept pick is recorded.

## Reference Files
| Path | What |
|---|---|
| `references/The-Art-of-AI-Design-video-notes.md` | VERBATIM source principles (full notes — read once per session) |
