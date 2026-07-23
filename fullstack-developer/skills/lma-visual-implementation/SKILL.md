---
name: lma-visual-implementation
description: |
  How to turn an LMA Visual Guide (typography, palette, imagery direction,
  rated style variants) into concrete design tokens and implemented styles for
  a landing page or website build. Use during Phase 5 (visual system) of every
  LMA client build, alongside lma-lp-structure / lma-website-structure.
---

# LMA Visual Implementation (Visual Guide → Design Tokens)

Teaches how an LMA Visual Guide is read and APPLIED in a build. **The real
knowledge is in `references/examples/` — 3 verbatim production visual guides
from different niches. Study their format before implementing.**

## Skill Type
- **Classification**: Execution support (design-system standard applied during a build)
- **Layer**: 3 — reusable component, feeds Phase 5 (`05-visual-system.md`) of the 9-phase workflow

## Persona — Execution Workflow

You are implementing the visual system for an LMA client build. For each build:

1. **STUDY** — Read at least 2 visual guides in `references/examples/`. Note the
   format: each guide proposes rated style variants (e.g. "Calm & Trustworthy —
   9.8/10") with Typography (heading/body fonts), Palette (hex roles), and
   imagery/mood direction.
2. **SELECT** — If the client's approved research/brand direction names a style,
   follow it. Otherwise pick the highest-rated variant PATTERN that fits the
   niche + the research's website direction (palette differentiation vs
   competitors matters).
3. **TOKENIZE** — Convert the chosen direction into concrete design tokens in
   `05-visual-system.md`: font families + scale, color roles (bg/surface/text/
   accent/muted/border), spacing rhythm, radius/shadow, imagery treatment rules.
4. **IMPLEMENT** — Apply tokens via the existing workflow (CSS custom properties,
   static HTML/CSS/JS Canz standard). Typography and palette must render exactly
   as tokenized — no ad-hoc colors/fonts mid-build.
5. **VALIDATE** — Contrast passes accessibility gates; one palette sitewide; type
   scale consistent; imagery follows the guide's mood; motion respects
   reduced-motion.

## Decision Questions
- **Context**: Does the approved brief already fix the palette/typography, or am I selecting a variant? Which example guide's FORMAT do I mirror?
- **Convergence**: Are all styles driven by tokens (zero hardcoded one-off values)? (Y/N) Do contrast/accessibility gates pass? (Y/N)
- **Safety**: Am I copying an example's exact brand palette for a DIFFERENT client? (only if the research direction independently calls for those values — differentiation from the client's competitors is the rule)

## Operating Principles
- **Tokens-Before-Styling** — Constraint: no visual styling before tokens exist in the spec; Reason: consistency and revisability; Application: complete `05-visual-system.md` first.
- **Differentiate-From-Competitors** — Constraint: the palette must be justified against the research's competitor analysis; Reason: LMA visual direction is a positioning tool; Application: state in the spec how the palette differs from the top competitors.
- **Guide-Format-Fidelity** — Constraint: document the chosen system in the LMA visual-guide format (variant name, rating rationale, typography, palette roles); Reason: downstream agents (creatives) consume this format; Application: mirror the example structure in the spec.

## Reference Files (VERBATIM LMA production outputs — format/quality reference)
| File | Niche |
|---|---|
| `references/examples/Zeff-Media__175a34dd__visual_guide.md` | E-commerce |
| `references/examples/Byte-Craft__7910b207__visual_guide.md` | HVAC |
| `references/examples/Revenue-Rocket-Agency__de8da7cf__visual_guide.md` | Med Spa |
