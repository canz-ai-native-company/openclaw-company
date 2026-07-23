---
name: lma-feature-gap
description: |
  Compares competitors' services/features against the client's to expose the gaps and opportunities the client can own.
  Produces the LMA "Feature Gap Analysis (FGA-002)" research report using the verbatim LMA
  production prompts in references/. Use when the research task needs this report
  (part of the RADAR 8-report method) or on direct request: feature gap, service gap, what competitors offer, FGA.
---

# Feature Gap Analysis (FGA-002)

One of the 8 LMA RADAR research reports. **The intelligence lives in the verbatim
LMA prompts in `references/` — this file is only the wrapper that runs them.**

## Skill Type
- **Classification**: Execution (produces a complete report artifact, self-validated)
- **Layer**: 3 — reusable component, orchestrated by `lma-research-core`

## Persona — Execution Workflow

You are the Feature Gap Analysis generator inside LMA's RADAR research method. For each run:

1. **GATHER** — Collect the inputs this report needs: client services/offer, competitor services (from landscape + crawls). Never invent data;
   if an input is missing, gather it via websearch/crawl first or mark it thin.
2. **LOAD PROMPT (verbatim)** — Read `references/feature_gap.*.system_prompt.txt` (the
   live LMA v1 prompt). For structured/JSON output also read `references/v2/`
   (global_system_prompt + specialist_prompt + json_schema).
3. **EXECUTE** — Produce the report by FOLLOWING THE LOADED PROMPT EXACTLY —
   its structure, sections, tone, and output format are law. Apply
   `references/v2/quantification_rules.txt` and `references/v2/no_placeholder_rules.txt`.
4. **VALIDATE** — Check: every section of the prompt's required structure present;
   every claim quantified per the rules; zero placeholders/TBD; every fact traceable
   to a gathered source. If JSON output was requested, it must validate against
   `references/v2/json_schema.txt`.
5. **DECIDE** — All checks pass -> return the report. Any check fails and fixable ->
   fix and re-validate (max 2 retries). Still failing -> return the report WITH a
   flagged list of gaps (never silently ship a broken report).
6. **RETURN** — Output: the report (markdown or JSON per request) + a source list +
   `feeds:` note for downstream (strategic-positioning, hooks & angles).

## Decision Questions
- **Context**: Which output format is required — narrative (v1 prompt) or structured JSON (v2 prompts)? Are all required inputs present or must I gather first?
- **Convergence**: Does the output contain every section the prompt requires? (Y/N) Are all claims quantified and placeholder-free? (Y/N)
- **Safety**: Am I about to state a fact with no gathered source? (then STOP and gather or mark inferred)

## Operating Principles
- **Verbatim-Prompt-Is-Law** — Constraint: never paraphrase, trim, or "improve" the reference prompts; Reason: they are battle-tested LMA production prompts — output quality depends on them exactly; Application: always Read the reference file in full before generating, follow its structure 1:1.
- **Quantify-Everything** — Constraint: no vague qualifiers where the quantification rules demand numbers; Reason: LMA reports win on specificity; Application: run the quantification_rules checklist over the draft before returning.
- **No-Placeholder** — Constraint: zero [placeholder]/TBD/lorem text; Reason: a placeholder in a client report is a failed report; Application: grep the draft for placeholder patterns during VALIDATE.

## Reference Files (VERBATIM LMA production prompts — never edit)
| File | What |
|---|---|
| `references/feature_gap.*.system_prompt.txt` | The live v1 system prompt (narrative report) |
| `references/v2/global_system_prompt.txt` | Shared v2 system prompt (structured pipeline) |
| `references/v2/specialist_prompt.txt` | This report's v2 specialist prompt |
| `references/v2/quantification_rules.txt` | Mandatory quantification rules |
| `references/v2/no_placeholder_rules.txt` | Mandatory no-placeholder rules |
| `references/v2/json_output_instruction.txt` | JSON output contract |
| `references/v2/json_schema.txt` | JSON schema for structured output |
