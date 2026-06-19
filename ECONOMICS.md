# Economics & COGS — AI Operating Leverage

Per the Agent Factory book: as product sophistication rises, cost-of-goods-sold
should fall. The proof of an AI-native company is that **margin expands as a
function of engineering, not headcount.** This layer measures that — it is a
read-only measurement layer over the existing system of record; it changes
nothing in the delivery pipeline.

## What we measure (the 3 COGS lines)

| COGS line (book) | How we measure it here |
| --- | --- |
| **1. Model cost per outcome** | `agent_runs.tokens_input/tokens_output/cost_usd` per workflow. On a flat AI subscription these are 0 (no per-call charge); we instead report **amortized cost-per-output** = monthly AI cost / outputs that month. |
| **2. Hosting cost per unit** | `economics_config.monthly_hosting_cost_usd` / outputs (optional). |
| **3. Outputs-per-human** | Raza's approvals/revises per output (`human_touches`). Fewer human touches per output = more leverage. |

Plus operational efficiency signals: **runs per output**, **wall-clock minutes
per output**, **revisions per output**. As the product improves, these should
trend DOWN.

## Neon objects (created for this)

- **`v_workflow_economics`** — per workflow: total_runs, total_wallclock_min,
  total_revisions, human_touches, tokens_in, tokens_out, cost_usd, business_name,
  niche, status. Built from `agent_runs`, `change_requests`, `approvals` — no new
  agent work; the data is already written by the normal pipeline.
- **`v_economics_weekly`** — one-row 7-day rollup: outputs completed, workflows
  started, and the averages above.
- **`economics_config`** — key/value: `monthly_ai_cost_usd`, `monthly_hosting_cost_usd`.
  Set these to enable amortized cost-per-output.

## Weekly report

The `weekly-eval-review` cron now includes an **Economics / COGS** section:
outputs this week, avg runs / minutes / revisions / human-touches per output,
outputs-per-human, and amortized cost-per-output with its trend (it should FALL
as volume rises = operating leverage). It flags rising revisions/human-touches
per output (efficiency dropping).

## To enable amortized cost-per-output

Set your monthly AI subscription cost once:
```sql
UPDATE economics_config SET value = <your monthly AI cost in USD>, updated_at = now()
  WHERE key = 'monthly_ai_cost_usd';
```

## Future: connecting API billing (tokens + real $) — no redesign needed

Today the agents run on a flat subscription, so `tokens_*` and `cost_usd` are 0.
The views and the weekly report **already read these columns**, so the moment
they are populated, real tokens and dollars appear automatically — **nothing in
the views or report changes.**

The only change required when you move to per-token API billing is a small
one-time **hook** that writes the per-run usage into the existing columns: when a
worker finishes its run, record the API's reported usage on its `agent_runs` row:
```sql
UPDATE agent_runs
   SET tokens_input = <in>, tokens_output = <out>, cost_usd = <usd>
 WHERE id = '<run_id>';
```
That is an additive write to columns that already exist and that the economics
layer already consumes — not a redesign.
