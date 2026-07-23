# SKILLS_INDEX (LMA) — Marketing Agent (Mira) · LMA Marketing Method skills

Three LMA skills with VERBATIM LMA production prompts in `references/`. Load on
demand (the runtime does not auto-load). These ADD to Mira's existing 41 skills —
nothing is replaced. On deploy, append these rows to the workspace `SKILLS_INDEX.md`.

## Trigger map

| Skill | Use when |
|---|---|
| `lma-offer` | Client offer creation — "create the offer", "what should <client> promise" — produces 3 offers + unique mechanism. **Runs FIRST** (feeds CRD + ads). |
| `lma-crd` | The Copy Resource Document — "CRD", "copy resource document", "brand copy doc". **Needs the chosen offer** (run lma-offer first). |
| `lma-ad-copies` | Client ad copies — "ad copies", "FB ads", "write ads for <client>" — 5 copies via the matched niche prompt (23 niches + OTHER fallback). |

## Order (when a client needs all three)

```
approved research (SPD/CRO) → lma-offer → lma-crd → lma-ad-copies
```

## Rules
1. Read the skill's `references/` files IN FULL before generating — the prompts are law; never paraphrase.
2. Ad copies: exact niche folder or `OTHER` — never a "close" niche's prompt.
3. Examples in any `references/examples/` are shape/quality reference ONLY — another client's copy, claims, or numbers never leak into a new client's work.
4. Every claim grounded in client data / approved research — no invented stats, testimonials, or guarantees.
