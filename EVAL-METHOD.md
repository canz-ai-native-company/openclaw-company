# Eval Method — Golden Datasets (how this company measures quality)

Faithful to the Agent Factory book (Eval-Driven Development): evals are the moat —
"a repeatable test that checks whether an agent's output is genuinely good
(correct, compliant, useful), not merely plausible-sounding." The founder's
non-delegable work is to read traces, label them right/wrong, and feed that
judgment back. These golden datasets ARE that judgment, encoded as code.

## What a golden case contains (every case in each `golden-set.json`)
- **id** — stable id (e.g. RS-001)
- **category** — task type (mirror production traffic mix)
- **difficulty** — easy | medium | hard (so we track whether fixes help hard cases)
- **input** — the natural-language task / CRM brief the agent receives
- **expected_behavior** — what the agent should DO (the process, not just the text)
- **expected_tools** — which tools/MCPs it should use
- **expected_response_traits** — key traits the deliverable MUST have
- **unacceptable_patterns** — explicit failure modes to reject

## Dataset size & authoring
- Start with ~8–12 curated cases per agent (≈20–50 total across the company),
  stratified by category AND difficulty, and INCLUDE known failure modes (the
  edge cases where the agent commonly fails). Start small + representative, not
  large + random. "Eval quality is bounded by dataset quality."
- These files are version-controlled artifacts (review them alongside prompt/skill
  changes), like code.

## Scoring (how an output is graded vs the golden case)
- **Method: LLM-as-judge** (balanced cost/speed). Grader = `claude-cli/claude-opus-4-8`
  (Opus-class judges Sonnet/Opus-class workers). The grader receives: the case,
  the agent's actual output, and the rubric.
- **Scale: 1–5.** 5 = fully correct, 3 = partially correct, 1 = fundamentally wrong.
- **Pass threshold: 3** (scores 3–5 pass). Thresholds are set BEFORE running, not
  after seeing results. Safety/compliance items are binary pass/fail.
- Deterministic exact-match is used where possible (did it call the right tool?
  write the right Neon row? produce the required sections?).

## Where scores go
The evaluator (Step 3 — a shared `evaluator` agent + website-qa for websites)
writes each graded result to the Neon `eval_results` table (score, pass/fail,
rubric notes, case id, agent_id, workflow_id). The weekly `weekly-eval-review`
cron then reports per-agent pass rate, variance, and repeated failure modes.

## Growing the golden set (the closed loop)
Production traces → sample the ones that reveal NEW failure modes or that Raza
rejected/revised → grade them with these rubrics → if they expose a gap, ADD them
as new cases here → re-run the suite so the fix generalizes and never regresses.
Real failures become permanent test cases.

## Per-agent files
- `research/evals/golden-set.json`
- `fullstack-developer/evals/golden-set.json`
- `designer-and-creatives/evals/golden-set.json`
- `marketing/evals/golden-set.json`
- (`website-qa` already ships `website-cro-audit/evals/evals.json` — same shape.)

> This is SEED content authored from best practice + each agent's job. Raza is the
> SME: refine these cases via the weekly eval loop — that encoded taste is the moat.
