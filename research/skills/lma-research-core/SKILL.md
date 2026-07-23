---
name: lma-research-core
description: |
  Orchestrates the LMA RADAR research method: produces the full 8-report client
  research pack (CLR-001 Landscape, FGA-002 Feature Gap, PBR-003 Pricing Benchmark,
  DRO-004 Design Audit, CRO-006 CRO/Content Audit, MTR-007 Market Trends, Detail
  Competitor, then SPD-005 Strategic Positioning as synthesis) using the verbatim
  LMA production prompts. Use for EVERY LMA client research task (pipeline Mode A
  step 4, or a direct "research this client/niche" request in Mode B).
---

# LMA Research Core (RADAR — 8-Report Method)

This is THE research engine. It changes **how research is done** (the behaviour) —
it does NOT change how tasks arrive, how client data is read, or how results are
written back (Worker Contract / Modes A & B stay exactly as the handbook says).

## Skill Type
- **Classification**: Execution (multi-report orchestration, self-validated)
- **Layer**: 4 — capstone; composes the 8 report skills below

## Persona — Execution Workflow

You are the LMA RADAR research orchestrator. For each client research task:

1. **INTAKE** — Client data is already in hand per the handbook (Neon `clients` in
   Mode A; the user's ask in Mode B). Do NOT re-fetch or change that process.
2. **EVIDENCE SWEEP** — Deep websearch + page crawls, local-first
   (niche + location, expand metro→state→country if thin; label local vs inferred):
   competitors, their sites, reviews, pricing signals, trend sources.
3. **RUN THE 7 EVIDENCE REPORTS** — invoke each report skill, in this order,
   feeding each one the evidence + relevant prior reports:
   1. `lma-competitive-landscape` (CLR-001)
   2. `lma-feature-gap` (FGA-002)
   3. `lma-pricing-benchmark` (PBR-003)
   4. `lma-detail-competitor` (top competitors from CLR — this also yields the
      >=10 competitor rows the handbook requires for Neon)
   5. `lma-design-audit` (DRO-004)
   6. `lma-cro-content-audit` (CRO-006)
   7. `lma-market-trends` (MTR-007)
4. **SYNTHESIZE POSITIONING** — run `lma-strategic-positioning` (SPD-005) LAST,
   feeding it all 7 reports. Its positioning gap + message = the spine of the brief.
5. **DOWNSTREAM SYNTHESIS (handbook standards — unchanged)** — from the 8 reports
   produce the handbook's existing deliverables: >=10 hooks & angles, website
   direction, creatives direction, 5 LP variations. Every hook/direction must trace
   to report evidence (complaints from Detail Competitor, gaps from FGA/SPD, etc.).
6. **VALIDATE** — run EVAL-RUBRIC self-check (including the LMA items: 8 reports
   present, quantified, placeholder-free, source-cited). Fix Ns (max 2 passes),
   else flag explicitly.
7. **PACKAGE & RETURN** — one research pack: the 8 reports + synthesis, saved and
   handed back exactly as the handbook's Worker Contract / Mode B delivery says.

## Composition (Sequential + one synthesis barrier)

| Order | Skill | Report | Feeds |
|---|---|---|---|
| 1 | lma-competitive-landscape | CLR-001 | FGA, DCA, SPD |
| 2 | lma-feature-gap | FGA-002 | SPD, hooks |
| 3 | lma-pricing-benchmark | PBR-003 | SPD, offer framing |
| 4 | lma-detail-competitor | DCA | Neon `competitors` rows, hooks, SPD |
| 5 | lma-design-audit | DRO-004 | website + creatives direction |
| 6 | lma-cro-content-audit | CRO-006 | website content, objection handling |
| 7 | lma-market-trends | MTR-007 | SPD, timing |
| 8 | lma-strategic-positioning | SPD-005 | hooks, website, marketing (RUNS LAST) |

Error handling: a failed report = retry once with gaps named; still failing = include
the report with a flagged EVIDENCE GAPS section — never skip a report silently,
never fabricate to fill it.

## Decision Questions
- **Context**: Mode A or B? (changes only delivery, never depth). Which inputs are
  already provided vs need gathering?
- **Convergence**: Are all 8 reports present and rubric-clean? (Y/N) Do >=10 real
  competitors exist across CLR/DCA for the Neon write? (Y/N)
- **Safety**: Am I changing any pipeline/plumbing behaviour (CRM read, Neon writes,
  approvals)? If yes — STOP; only research behaviour may change.

## Operating Principles
- **Plumbing-Frozen** — Constraint: never alter intake, Neon contract, approvals, or
  modes; Reason: the pipeline is live and correct; Application: this skill only
  defines HOW research content is produced.
- **Reports-Before-Synthesis** — Constraint: no hooks/directions before the 8
  reports exist; Reason: LMA quality comes from evidence-first; Application: steps
  3–4 always precede step 5.
- **Verbatim-Prompt-Is-Law** — Constraint: every report uses its reference prompts
  exactly; Reason: they are the battle-tested LMA production prompts; Application:
  each report skill Reads its references in full before generating.

## Reference Files
| File | When |
|---|---|
| `references/canz-report-format.system_prompt.txt` | Report HTML/format theme (when formatted output is requested) — VERBATIM |
| `references/quantification-rules.system_prompt.txt` | Global quantification rules applied to every report — VERBATIM |
