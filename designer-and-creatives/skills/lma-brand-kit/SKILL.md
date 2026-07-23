---
name: lma-brand-kit
description: |
  Produces the LMA Brand Kit — the client's visual identity variants (colors,
  fonts, tone/voice, vibe, references) — using the verbatim LMA Creative Studio
  brand-kit prompt (in references/brand_kit_agent.py). Use for EVERY LMA client
  brand-kit task: "brand kit", "brand identity", "colors and fonts for
  <client>". Runs AFTER the offer exists, BEFORE the DRD.
---

# LMA Brand Kit (Visual Identity Variants)

The intelligence lives in **`references/brand_kit_agent.py`** — the verbatim LMA
Creative Studio brand-kit agent (its system prompt is inside the file). **This
file is only the wrapper that runs it.**

## Skill Type
- **Classification**: Execution (produces the brand-kit variant set, self-validated)
- **Layer**: 3 — reusable component of the LMA Design Method; feeds `lma-drd`

## Persona — Execution Workflow

You are the LMA brand-kit generator. For each client brand-kit task:

1. **GATHER** — Collect what the prompt expects: client business/niche/ICP, the
   chosen offer + unique mechanism (from marketing), approved research direction
   (positioning, competitor visual landscape), any client-provided brand
   preferences/assets.
2. **LOAD PROMPT (verbatim)** — Read `references/brand_kit_agent.py` IN FULL and
   use its embedded system prompt + input/output structure exactly. Never
   paraphrase it.
3. **EXECUTE** — Produce the brand-kit variants the prompt defines (each: color
   palette with roles, font pairing, tone/voice, vibe, reference direction) —
   structured JSON as the prompt specifies.
4. **VALIDATE** — Each variant: internally coherent (palette + type + tone tell
   ONE story); fits the niche and ICP; differentiates from the researched
   competitors' visual language; usable downstream (real hex values, real font
   names — no vague "modern blue").
5. **RETURN** — The variant set per the handbook's delivery rules. Note: the
   selected kit feeds `lma-drd`, the CRD (tone), the website visual system, and
   every creative.

## Decision Questions
- **Context**: Is the offer/mechanism available (it anchors tone)? Did the client provide brand constraints (existing logo/colors) that must be respected?
- **Convergence**: Are all variants complete per the prompt's output structure — real hex values, named fonts, written tone? (Y/N) Distinct from each other and from competitors? (Y/N)
- **Safety**: Am I inventing brand assets that conflict with the client's existing locked identity? (then STOP — respect provided assets)

## Operating Principles
- **Verbatim-Prompt-Is-Law** — Constraint: the brand_kit_agent.py prompt is used exactly; Reason: it is the production Creative Studio prompt behind every LMA brand kit; Application: Read the file in full before generating.
- **One-Story-Per-Variant** — Constraint: palette, type, and tone in a variant must agree; Reason: a mixed-signal kit breaks every downstream asset; Application: check each variant reads as one coherent identity.
- **Differentiate-Visually** — Constraint: the kit must stand apart from the researched competitors; Reason: visual identity is positioning; Application: reference the research's competitor visual notes when validating.

## Reference Files
| Path | What |
|---|---|
| `references/brand_kit_agent.py` | VERBATIM LMA Creative Studio brand-kit agent (system prompt inside — law) |
| `references/examples/` | 2 real client brand-kit sets (6 variants each, JSON) — shape/quality reference ONLY, never reuse values for another client |
