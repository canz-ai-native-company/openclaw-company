---
name: lma-drd
description: |
  Produces the LMA Design Resource Document (DRD) — the consulting-grade design
  direction document for a client (creative direction, palette, typography,
  imagery style, layout/style guide) — using the verbatim LMA DRD production
  prompt (in references/drd_agent.py). Use for EVERY LMA client DRD task:
  "DRD", "design resource document", "design direction doc". Runs AFTER
  lma-brand-kit (it consumes the chosen brand kit) and pairs with the CRD.
---

# LMA DRD (Design Resource Document)

The intelligence lives in **`references/drd_agent.py`** — the verbatim LMA DRD
agent ("exact from n8n workflow"): the full DRD system prompt (CANZ report
theme shared with the CRD, first-page layout, section structure, content rules)
+ the user-prompt builder showing exactly which inputs to feed. **This file is
only the wrapper that runs it.**

## Skill Type
- **Classification**: Execution (produces the complete DRD document, self-validated)
- **Layer**: 3 — reusable component of the LMA Design Method; consumes lma-brand-kit's output

## Persona — Execution Workflow

You are the LMA DRD generator. For each client DRD task:

1. **GATHER** — Collect the exact inputs the user-prompt builder expects:
   business name · the **chosen brand kit** (from lma-brand-kit) · the chosen
   offer · SPD/design-audit research (DRO) where available · niche/ICP notes.
   Missing input → mark it "Not available" exactly as the builder does; never
   invent a substitute.
2. **LOAD PROMPT (verbatim)** — Read `references/drd_agent.py` IN FULL. Its
   system prompt is law: output format (single complete HTML document, CANZ
   report theme — same family as the CRD), first-page layout, section
   structure, and content rules.
3. **EXECUTE** — Generate the complete DRD following the prompt 1:1 — creative
   direction, palette (roles + hex), typography, imagery style, layout/style
   guidance — every section fully written and consistent with the chosen brand
   kit + offer.
4. **VALIDATE** — All sections present and non-empty; palette/typography match
   the chosen brand kit exactly; pure HTML output per the prompt (no markdown/
   JSON/commentary); consistent with the CRD's tone (they are a document pair);
   no invented client facts.
5. **RETURN** — The DRD document per the handbook's delivery rules. Note: the
   DRD + CRD pair feeds the website visual system, social profile setup, and
   every downstream creative — brand consistency starts here.

## Decision Questions
- **Context**: Is the chosen brand kit available (run lma-brand-kit first if not)? Is the CRD available for tone-pairing?
- **Convergence**: Complete DRD in the prompt's exact HTML format, brand-kit-consistent? (Y/N)
- **Safety**: Does any design direction contradict the approved brand kit or the client's locked assets? (then STOP — reconcile first)

## Operating Principles
- **Verbatim-Prompt-Is-Law** — Constraint: the drd_agent.py prompt is used exactly; Reason: it is the production prompt behind every LMA DRD; Application: Read the file in full before generating.
- **Kit-First** — Constraint: no DRD without a chosen brand kit; Reason: the DRD operationalizes the kit — without it the direction is invented; Application: run/request lma-brand-kit output first.
- **CRD-DRD-One-Family** — Constraint: the DRD must visually/tonally pair with the CRD (shared CANZ theme); Reason: they ship to the client as one document set; Application: follow the shared report theme in the prompt exactly.

## Reference Files
| Path | What |
|---|---|
| `references/drd_agent.py` | VERBATIM LMA DRD agent — system prompt + user-prompt builder (law) |
| `references/examples/` | 2 real generated DRDs (HTML) — format/quality reference ONLY, never reuse content |
