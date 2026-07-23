# SKILLS_INDEX (LMA) — Designer & Creatives · LMA Design Method skills

Two LMA skills with VERBATIM LMA production prompts in `references/`. Load on
demand (the runtime does not auto-load). These ADD to the existing Higgsfield
skills — nothing is replaced. On deploy, register these in the workspace skill
index / handbook routing.

## Trigger map

| Skill | Use when |
|---|---|
| `lma-brand-kit` | Client brand identity — "brand kit", "brand identity", "colors/fonts for <client>" — produces the brand-kit variant set. **Runs FIRST** (feeds DRD + all creatives). |
| `lma-drd` | The Design Resource Document — "DRD", "design resource document", "design direction doc". **Needs the chosen brand kit** (run lma-brand-kit first). |

## Order (when a client needs both)

```
chosen offer (from marketing) → lma-brand-kit → lma-drd
                                      ↓
                    (kit + DRD feed website visual system,
                     social profiles, and every creative)
```

## Rules
1. Read the skill's `references/` files IN FULL before generating — the prompts are law; never paraphrase.
2. Examples in `references/examples/` are shape/quality reference ONLY — another client's palette, fonts, or content never leak into new work.
3. The DRD pairs with the CRD (marketing) — same CANZ report theme, one document family.
4. Creative production (Higgsfield images/videos) stays exactly as the handbook says — these skills only add the brand-kit + DRD deliverables.
