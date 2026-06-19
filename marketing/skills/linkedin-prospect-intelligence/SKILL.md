---
name: linkedin-prospect-intelligence
description: Generate verified, sales-ready LinkedIn prospect intelligence reports with psychology profiling, ICP fit scoring, timeline-based content analysis, red-flag disqualification, and personalized outreach drafts (comments + 3 DM variants + timed follow-ups). Use this skill whenever the user provides a LinkedIn profile URL, profile text, screenshots, recent posts, company page, or CRM notes — or asks for prospect research, buyer psychology analysis, ICP scoring, personalized comments, DM drafts, follow-up sequences, sales angles, fit scoring, outreach recommendations, "should I pursue this lead", "what should I message this person", "analyze this prospect", or "is this lead worth pursuing". Strict authenticity rule: every field is either verifiable from provided/authorized sources, explicitly inferred from verified evidence, or marked `Not verified / insufficient data` — never fabricated.
allowed-tools: WebSearch, WebFetch, Read, Write
---

# LinkedIn Prospect Intelligence

A verified, psychology-aware prospect intelligence system that converts a LinkedIn profile into a sales-ready report with personalized outreach drafts — without scraping, automation, or fabrication.

## Mission

Convert any LinkedIn profile (URL, text, or screenshot) into a structured intelligence report that helps the user decide:
- Who the prospect is and what they do
- What pain points and buying triggers are visible
- Whether the prospect is worth pursuing right now
- What to comment, DM, and follow up with — matched to their professional psychology
- Which case study and offer angle will resonate

Output is always sales-actionable but never speculative.

## The Core Authenticity Rule (Non-Negotiable)

Every claim in the report must trace back to evidence. Three statuses only:

- **Verified** — directly supported by provided content or authorized public source
- **Inferred from verified evidence** — logical business inference clearly grounded in verified facts
- **Not verified / insufficient data** — no reliable evidence

If a field cannot be verified or reasonably inferred, write exactly:
`Not verified / insufficient data`

Never guess. Never invent posts, dates, metrics, engagement numbers, response rates, or private behavior. Never fill gaps with assumptions. This rule overrides the desire to produce a "complete" report — an honest partial report is the goal.

## What This Skill Will NOT Do

- No scraping, bot automation, browser-extension scraping, or fake accounts
- No login bypassing, captcha bypassing, or rate-limit bypassing
- No automated LinkedIn messaging
- No inference of religion, ethnicity, political affiliation, health condition, personal trauma, private financial status, or sensitive personal attributes
- No fabricated quotes, posts, or engagement data

If the environment cannot safely access a profile, ask the user to provide profile text, screenshots, exported data, recent posts, or the company website.

## Inputs Accepted

Any combination of:
- LinkedIn profile URL or company page URL
- Pasted profile text (headline, about, experience)
- Recent posts, comments, replies
- Screenshots of profile or posts
- Company website URL or content
- User's own offer/case-study document
- CRM notes or prior outreach history
- ICP definition document
- Brand voice token (user's preferred tone, sample messages they've written)

## Source Priority

When evidence sources conflict, trust this order:

1. User-provided profile text, screenshots, or exports
2. Public LinkedIn pages accessible via authorized web/search tools
3. Company website (primary source)
4. Official company press releases, interviews, podcasts, blogs
5. Public web search results
6. User's CRM/outreach history
7. User's offer/case-study documents (for matching, not for inferring prospect facts)

Never treat third-party summaries as final truth unless they link to primary evidence.

## Workflow

Follow this sequence. Each step references a file in `references/` — load it only when you reach that step.

### Step 1 — Identity & Company Resolution
Identify the prospect's name, current role, company, location. Identify company type (Product / Service / Hybrid), industry, target audience, and business model from the company website. Mark anything unverifiable.

### Step 2 — Timeline-Based Content Analysis
Load `references/timeline-analysis.md`.
Bucket the prospect's posts into 4 windows: last 7 days, last 30 days, last 6 months, last 12 months. Identify topic drift, frequency, and any signals that suggest a recent shift in priorities — these are the buying triggers.

### Step 3 — Psychology Profiling
Load `references/psychology-frameworks.md`.
Match the prospect against the 7 archetypes (Educational, Technical, Founder/Operator, Motivational/Thought-Leader, Sales-Heavy, Cautious/Compliance, Analytical). For the matched archetype, extract: communication style, motivational drivers, trust triggers, message angle to use, message angle to avoid.

### Step 4 — ICP Fit Scoring (Against User's Offer)
Load `references/icp-fit-matrix.md`.
Score the prospect on 6 dimensions against the user's stated offer/ICP: industry match, company size match, tech adoption signal, pain-offer fit, budget likelihood, authority match. Produce a total fit score and verdict (Strong fit / Marginal / Skip).

If the user has not provided their offer/ICP yet, ask for it once at the start. If they decline, score what's possible and mark missing dimensions.

### Step 5 — Red Flag Check (Disqualification)
Load `references/red-flags.md`.
Check for disqualification signals: recent layoff/exit, company contraction, visible competitor relationship, audience mismatch, tone/values incompatibility, legal/PR trouble. If any critical red flag is found, recommend skipping and explain why — even if other scores are high.

### Step 6 — Pain Points & Buying Triggers
From timeline analysis + content + company signals, identify:
- Primary pain point (the one most visible and most addressable)
- Secondary pain points
- Buying triggers (recent funding, hiring, role change, public frustration, product launch, expansion)
- Urgency level with reasoning

### Step 7 — Case Study & Offer Angle Matching
Load `references/case-study-mapping.md`.
Match the prospect's primary pain to the best case study/AI employee solution. If the user provided their own case studies, use those; otherwise use the angle-only recommendation.

### Step 8 — Outreach Drafting
Load `references/message-templates.md`.
Generate:
- 1 personalized comment (for a real recent post if visible)
- 3 DM variants (Insight / Pain-tap / Curiosity angles)
- A recommended DM variant with reasoning
- 3 follow-ups with timing (Day 3-4, Day 7-10, Day 21+)

Match the prospect's language (English / Hindi / Urdu / Roman Urdu / other) based on their visible posts. If the user provided a brand voice token, adapt all messages to that voice.

### Step 9 — Assemble Report
Load `assets/report-template.md` and fill every section. For any field without evidence, write `Not verified / insufficient data` and explain what data is needed in the "Missing Data" section.

Load `references/output-schema.md` if you need the full field-by-field schema reference while assembling.

## Confidence Labels (Use Throughout)

Tag every non-trivial claim with one of:
- `[Verified]` — directly supported by evidence in this session
- `[Inferred]` — reasoned from verified evidence (state the inference logic briefly)
- `[Not verified]` — no reliable evidence

For scores: never present as facts. Frame as "AI-estimated score based on X, Y, Z signals" with the reasoning attached.

## Best First Move Logic

After completing the workflow, recommend the next step using this logic:

- Strong recent post + topic matches user's offer → **Comment first**, then DM in 2-3 days
- Strong buying trigger visible (funding, hiring spree, public pain) → **Send DM with audit/breakdown offer**
- Founder/CEO with high offer relevance + warm signals → **Direct DM after a single comment**
- Low recent activity but strong company fit → **Send personalized audit DM**
- Marginal fit / unclear → **Nurture** (follow, like, comment occasionally)
- No verified info → **Ask user for more data** or mark report incomplete
- Red flags present → **Skip** with reasoning

## Multi-Prospect / Batch Mode

If the user provides multiple profiles in one request:
1. Run the full workflow on each prospect
2. Produce individual reports
3. At the end, produce a ranking table (Name | Company | ICP Fit Score | Urgency | Recommended Action) sorted by combined ICP fit + urgency
4. Offer to export as CSV if the user wants CRM-ready output

## Brand Voice Token

If the user has provided a brand voice token (sample messages they've written, tone preferences, banned words), apply it to every comment and DM generated. Do not produce generic messages when a brand voice is available.

If no brand voice is provided, ask once whether the user wants to provide one. If they decline, proceed with neutral professional tone.

## Output Style

Be direct. Be useful. Never hide uncertainty.

When data is missing, write `Not verified / insufficient data` and move on. Do not pad the report with filler. A short honest report beats a long fabricated one.

Always separate clearly:
- Verified facts
- Evidence-backed inferences
- Sales recommendations
- Missing data

## File Map

```
linkedin-prospect-intelligence/
├── SKILL.md                          ← you are here
├── references/
│   ├── output-schema.md              ← full report field schema
│   ├── timeline-analysis.md          ← post bucketing + drift detection
│   ├── psychology-frameworks.md      ← 7 archetypes + message angles
│   ├── message-templates.md          ← comment/DM/follow-up rules
│   ├── case-study-mapping.md         ← pain → solution matrix
│   ├── icp-fit-matrix.md             ← 6-dimension scoring rubric
│   └── red-flags.md                  ← disqualification logic
├── assets/
│   └── report-template.md            ← fill-in markdown template
└── examples/
    ├── example-saas-founder.md       ← worked example: SaaS founder
    └── example-agency-owner.md       ← worked example: agency owner
```

Load reference files only when the workflow step requires them. Do not pre-load everything — that defeats progressive disclosure.
