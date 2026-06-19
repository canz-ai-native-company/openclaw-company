# ICP Fit Matrix

Load this when running Step 4 of the workflow.

The point of this matrix is to stop wasting time on prospects who aren't a real fit, regardless of how nice the conversation might feel. Six dimensions, scored 0-10 each, total out of 60.

## Prerequisite: User's Offer / ICP

Before scoring, you need the user's offer definition. Ask once at the start of the conversation if not already provided:

> "To score ICP fit accurately, I need a quick read on your offer: what's the core thing you sell, who's your ideal customer (industry + size + role), what pain do you solve, and what's the typical price range? If you've got an ICP doc, paste that."

If the user declines or can't provide, score only the dimensions you can verify and mark the rest `Not enough data`. Skip the total score and verdict in that case.

## The 6 Dimensions

### 1. Industry Match (0-10)

How closely does the prospect's industry match the user's stated target industries?

- **10** — Exact match with a stated primary target industry
- **7-8** — Adjacent industry with strong overlap (e.g., user targets B2B SaaS, prospect is B2B services)
- **4-6** — Tangentially related, would require positioning translation
- **1-3** — Different industry, weak overlap
- **0** — No overlap, or industry the user has explicitly excluded

**Evidence to use:** company website, prospect's "About" section, post topics, company services page

---

### 2. Company Size Match (0-10)

How well does the company size match the user's ICP?

Size indicators (use what's visible):
- Employee count on LinkedIn
- Funding stage signals
- Office presence
- Public revenue/customer count

Scoring:
- **10** — In the sweet spot the user has defined
- **7-9** — One bracket above or below sweet spot
- **4-6** — Adjacent — could work but not ideal
- **1-3** — Significantly off
- **0** — Way too small or way too large to buy

If size is not visible, mark `Not verified` and score 0 with a note — don't guess.

---

### 3. Tech Adoption Signal (0-10)

How likely is this prospect to adopt AI/automation/new tools?

Signals to look for:
- Posts about AI, automation, new tools
- Tech stack mentions (modern vs legacy)
- "First-mover" language vs "wait and see" language
- Speed of past adoption (do they post about trying new things?)
- Industry baseline (tech-forward industries score higher by default)

Scoring:
- **9-10** — Active AI/automation adopter, posts about it positively, has implemented similar tools
- **6-8** — Open and curious, talks about tech adoption thoughtfully
- **3-5** — Neutral, no strong signal either way
- **1-2** — Skeptical or risk-averse signals
- **0** — Explicitly anti-AI / anti-automation in their content

This dimension matters because even a perfect-fit prospect won't buy if they're not ready to adopt the category.

---

### 4. Pain-Offer Fit (0-10)

How directly does the prospect's primary pain (from Step 6) map to what the user's offer solves?

Scoring:
- **10** — Their primary pain is literally what the user's offer is designed for, and they've expressed it publicly
- **7-9** — Strong match, evidence-based but pain not explicitly stated by prospect
- **4-6** — Plausible match based on role/industry, but no direct evidence
- **1-3** — Tangential — offer could help but pain isn't central
- **0** — Offer doesn't address their pain

This is the highest-weighted dimension in practice. A high pain-offer fit can carry a marginal score elsewhere.

---

### 5. Budget Likelihood (0-10)

Can they actually afford the user's offer, and is budget likely unlocked?

Signals to look for:
- Funding stage (post-Series-A signals available budget)
- Recent hiring (signals expansion budget)
- Company maturity (revenue-stage company vs pre-revenue)
- Industry economics
- Public price-sensitive complaints (red flag — they don't want to pay)

Scoring:
- **10** — Strong budget signals: funded, hiring, expanding, in user's price range
- **7-9** — Plausible budget, signals reasonable
- **4-6** — Unclear, need discovery to confirm
- **1-3** — Tight signals — bootstrap, small team, frugal language
- **0** — Likely cannot afford OR pre-revenue without funding

Mark `Not verified` if no signals are visible — don't guess at finances.

---

### 6. Authority Match (0-10)

Is this person the actual decision-maker for the user's offer?

Scoring:
- **10** — Founder/CEO of a company in user's ICP, or VP-level direct buyer for this offer
- **7-9** — Director/Head with high autonomy for this type of purchase
- **4-6** — Influencer / champion but needs to escalate (e.g., Sr. Manager in a larger org)
- **1-3** — Individual contributor in a large org — would need to build a coalition
- **0** — No buying authority, would need full sale up the chain

For founder/operator companies, authority is usually high. For enterprise, it's almost always a multi-stakeholder process — score accordingly.

---

## Total Score & Verdict

```
Sum all 6 dimensions = X / 60
```

Verdict thresholds:

| Total | Verdict | What it means |
|---|---|---|
| **45-60** | **Strong fit** | Pursue actively. Match outreach urgency to fit score. |
| **35-44** | **Good fit** | Worth pursuing. Lead with discovery, not pitch. |
| **25-34** | **Marginal** | Nurture, don't push. Watch for trigger signals. |
| **15-24** | **Weak fit** | Skip unless there's a specific trigger or warm intro path. |
| **0-14** | **Skip** | Not a fit. Move on. |
| **Insufficient data** | **Cannot score** | Score the dimensions you can; mark the rest. |

## How to Output

For Section 10 of the report:

```
Industry match:           {{X}}/10 — {{1-line reason}}
Company size match:       {{X}}/10 — {{1-line reason}}
Tech adoption signal:     {{X}}/10 — {{1-line reason}}
Pain-offer fit:           {{X}}/10 — {{1-line reason}}
Budget likelihood:        {{X}}/10 — {{1-line reason}}
Authority match:          {{X}}/10 — {{1-line reason}}

Total: {{X}}/60
Verdict: {{verdict}}
```

If 3+ dimensions are `Not verified`, do not output a total. Output the verified dimensions only and write:

```
Total: Cannot score reliably with current data
Verdict: Need more data — specifically: {{list missing dimensions}}
```

## Honesty Rule

Do not inflate scores to make a prospect look better than they are. If pain-offer fit is a 4, write 4 — that's the user's signal to deprioritize. Scoring exists to filter, not to validate every prospect.
