# SKILLS_INDEX — Research Agent (Atlas) · LMA RADAR skills

Skills live in `skills/<id>/SKILL.md` with the VERBATIM LMA production prompts in
`references/`. The runtime does not auto-load them — match the task against this
map, then `Read` the SKILL.md (and its references) before doing the work.

## Trigger map

| Skill | Report | Use when |
|---|---|---|
| `lma-research-core` | ALL (orchestrator) | **Every LMA client research task** (pipeline step or direct "research X"). Entry point — it invokes the rest. |
| `lma-competitive-landscape` | CLR-001 | Only the competitive landscape is asked for |
| `lma-feature-gap` | FGA-002 | Only a feature/service gap analysis is asked for |
| `lma-pricing-benchmark` | PBR-003 | Only market pricing benchmarking is asked for |
| `lma-detail-competitor` | DCA | Deep-dive teardown of specific competitor(s) |
| `lma-design-audit` | DRO-004 | Only a design/UX audit is asked for |
| `lma-cro-content-audit` | CRO-006 | Only a CRO/content audit is asked for |
| `lma-market-trends` | MTR-007 | Only market trends/demand is asked for |
| `lma-strategic-positioning` | SPD-005 | Positioning synthesis (needs the other reports' evidence) |

## Rules
1. Full client research → ALWAYS `lma-research-core` (never hand-pick a subset).
2. Single-report request → use that one skill directly; gather its inputs first.
3. Read the skill's `references/` files IN FULL before generating — the prompts are
   law; never paraphrase them.
4. Quantification + no-placeholder rules apply to every report.
