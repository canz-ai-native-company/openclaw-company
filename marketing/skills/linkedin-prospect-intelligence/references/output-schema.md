# Output Schema Reference

Complete field-by-field schema for the prospect intelligence report. Load this when assembling the final report or when you need to confirm exact field definitions.

## Table of Contents

1. Identity
2. Company & Industry
3. Buyer Role
4. Current Focus
5. Content Intelligence
6. Content Timeline Analysis *(new)*
7. Pain & Trigger Analysis
8. Personality & Professional Psychology
9. Sales Fit
10. ICP Fit Matrix *(new)*
11. Red Flags & Disqualifiers *(new)*
12. Outreach Recommendation
13. Personalized Comment
14. First DM (3 Variants) *(expanded)*
15. Follow-up Sequence (with timing) *(expanded)*
16. Verification Table
17. Missing Data

---

## 1. Identity

```
Name: {{name}}
Role: {{role}}
Company: {{company}}
Location: {{location}}
Profile URL: {{profile_url}}
Company URL: {{company_url}}
Mutual connections: {{mutual_or_not_verified}}
Source confidence: Verified / Partially verified / Not verified
```

## 2. Company & Industry

```
Company type: Product / Service / Hybrid / Not verified
Industry: {{industry}}
Company summary: {{1-2 sentences}}
Services/products: {{list}}
Target audience: {{their customer profile}}
Business model clues: {{B2B SaaS / agency / marketplace / etc.}}
Company maturity signal: {{startup / scaling / established / enterprise}}
Tech stack signals: {{detected tools, or Not verified}}
Funding/growth signals: {{recent raise, hiring, expansion — or Not verified}}
```

## 3. Buyer Role

```
Likely buyer type: Founder / CEO / Marketing Head / Sales Head / Ops Head / Other
Founder/decision-maker confidence: High / Medium / Low / Not verified
Reason: {{why this confidence level — title, equity signals, ownership language in posts, etc.}}
```

## 4. Current Focus

```
Current focus: {{1-2 sentence summary of what they're actively working on}}
Evidence: {{specific posts, role description, or company initiatives that support this}}
```

## 5. Content Intelligence

```
Post frequency: {{daily / weekly / monthly / inactive / Not verified}}
Top-performing visible post: {{topic + approximate engagement if visible}}
Engagement level: High / Medium / Low / Not verified
Audience type: {{who they speak to — founders, marketers, devs, etc.}}
```

## 6. Content Timeline Analysis

This section is critical — recent topic shifts often signal buying triggers.

```
Last 7 days:
  Themes: {{themes or "no posts in this window"}}
  Posts: {{count}}
  Engagement avg: {{level or Not verified}}

Last 30 days:
  Themes: {{themes}}
  Shift detected vs prior period: Yes / No / Not verified
  What changed: {{description if shift detected}}

Last 6 months:
  Themes: {{themes}}
  Core obsessions: {{topics they return to repeatedly}}

Last 12 months:
  Themes: {{themes}}
  Strategic narrative arc: {{1-2 sentences on the story their content tells}}

Topic drift signal: {{has their content shifted toward a new theme? what theme?}}
Buying trigger inference: {{what this drift suggests about their current priorities}}
```

## 7. Pain & Trigger Analysis

```
Primary pain point: {{the most visible, most addressable pain}}
Secondary pain points: {{list, up to 3}}
Buying trigger found: Yes / No / Not verified
Buying trigger details: {{funding, hiring, role change, public frustration, product launch, expansion, etc.}}
Urgency: Low / Medium / High / Not verified
Urgency reason: {{why this urgency level}}
```

## 8. Personality & Professional Psychology

Match to one (or hybrid of two) of the 7 archetypes from `psychology-frameworks.md`.

```
Primary archetype: Educational / Technical / Founder-Operator / Motivational-Thought-Leader / Sales-Heavy / Cautious-Compliance / Analytical
Secondary archetype: {{if hybrid, else "none"}}
Sentiment: Positive / Neutral / Frustrated / Growth-focused / Not verified

Communication style: {{2-3 lines on how they write/speak}}
Motivational drivers: {{what they seem to chase — leverage, validation, mastery, impact, revenue, mission, etc.}}
Trust triggers: {{what makes them trust a stranger — specificity, social proof, mutual connections, technical depth, etc.}}
Values expressed in content: {{what they celebrate/criticize publicly}}

Message angle to use: {{the angle that will resonate}}
Message angle to avoid: {{the angle that will get you ignored or blocked}}
```

## 9. Sales Fit

```
Interest alignment score: {{0-100 or Not verified}}
Closing probability score: {{0-100 or Not verified}}
Relationship health: Cold / Warm / Engaged / Active / Not verified
Best contact time: {{based on visible posting/reply timing — or Not verified}}
Reason this prospect is a good fit: {{1-2 sentences}}
Reason this prospect may not buy: {{1-2 sentences — honest objections}}
```

## 10. ICP Fit Matrix

Score each dimension 0-10 against the user's offer/ICP. See `icp-fit-matrix.md` for rubric.

```
Industry match:           {{score}}/10  — {{reason}}
Company size match:       {{score}}/10  — {{reason}}
Tech adoption signal:     {{score}}/10  — {{reason}}
Pain-offer fit:           {{score}}/10  — {{reason}}
Budget likelihood:        {{score}}/10  — {{reason}}
Authority match:          {{score}}/10  — {{reason}}

Total ICP score:          {{x}}/60
Verdict: Strong fit (45+) / Marginal (25-44) / Skip (<25) / Not enough data
```

## 11. Red Flags & Disqualifiers

See `red-flags.md` for full list.

```
Recent layoff/exit signals:        Yes / No / Not verified — {{evidence}}
Company contraction signals:       Yes / No / Not verified — {{evidence}}
Competitor relationship visible:   Yes / No / Not verified — {{evidence}}
Audience mismatch:                 Yes / No — {{evidence}}
Tone/values incompatibility:       Yes / No — {{evidence}}
Legal/PR trouble:                  Yes / No / Not verified — {{evidence}}

Should you skip this prospect? Yes / No
Reason: {{1-2 sentences}}
```

## 12. Outreach Recommendation

```
Best collaboration angle: {{how to frame initial value-add}}
Best offer angle: {{which offer to lead with}}
Best case study to send: {{specific case study from user's library, or angle if none provided}}
Next step: Connect / Comment first / Send audit / Invite to call / Nurture / Skip / Not enough data
Reasoning: {{1-2 sentences}}
```

## 13. Personalized Comment

Single high-quality comment for a verified recent post. Follow rules in `message-templates.md`.

```
Post being commented on: {{topic + date if known}}
Comment:
{{comment text — 2-4 sentences, no pitch, references a real idea}}
Why this works: {{1 line tying it to their psychology}}
```

## 14. First DM (3 Variants)

Generate three variants, each 60-90 words. See `message-templates.md` for full rules.

```
Variant A — Insight angle:
{{dm_text}}

Variant B — Pain-tap angle:
{{dm_text}}

Variant C — Curiosity angle:
{{dm_text}}

Recommended variant: {{A / B / C}}
Why: {{1-2 sentences tying choice to prospect's psychology + urgency level}}
Language: {{English / Hindi / Urdu / matched to prospect}}
```

## 15. Follow-up Sequence

```
Follow-up 1 (Day 3-4 after first DM, if no reply):
Angle: Gentle value-add
Message: {{text — under 60 words}}

Follow-up 2 (Day 7-10, if no reply):
Angle: Case study / proof
Message: {{text — under 80 words, include 1 specific case study reference}}

Follow-up 3 (Day 21+, if still no reply):
Angle: Soft exit / breakup
Message: {{text — under 50 words, leave door open}}
```

## 16. Verification Table

Build a table showing the status of every major claim:

| Field | Value | Status | Evidence |
|---|---|---|---|
| Name | ... | Verified | Profile header |
| Current role | ... | Verified | Profile experience section |
| Company type | ... | Inferred | Website services page |
| Primary pain | ... | Inferred | Posts X, Y on date Z |
| Budget likelihood | ... | Not verified | No funding/revenue data accessible |

Status must be one of: `Verified` / `Inferred from verified evidence` / `Not verified`

## 17. Missing Data

List every field that could not be verified, and explain exactly what data would be needed.

Example format:
```
- Response rate: Need past sent messages, replies, accepted connection history, or CRM data.
- Best contact time: Need post timing history or outreach engagement data.
- Budget likelihood: Need company revenue range, funding round info, or hiring patterns.
- Mutual connections: Need user's LinkedIn network data to compute.
```

This section signals to the user where to feed in more data for a sharper report.
