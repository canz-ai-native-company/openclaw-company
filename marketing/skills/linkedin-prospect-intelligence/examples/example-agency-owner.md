# Example: Agency Owner (with limited data)

> This example shows what the skill does when input data is sparse. The point is to demonstrate the authenticity rule in action — when most fields are unverifiable, the report is still useful and explicitly tells the user what's missing. Names and details are fictional.

---

## Input (what the user provided)

> "Can you research this person? I only have the LinkedIn URL — I don't have the patience to copy/paste the whole profile. URL: linkedin.com/in/[fictional]/karim-hassan-agency
>
> My offer: I build AI Operations Employees for digital marketing agencies — handles client reporting, status updates, internal docs. Price $2.5k-$8k/mo setup + monthly. ICP is agency founders 5-30 people who feel they're hitting a delivery capacity ceiling."

---

## Output Report

# Prospect Intelligence Report

**Report generated:** 2026-05-20
**For user/seller:** [user's company]
**About prospect:** Karim Hassan (per provided URL handle)

> ⚠️ **Important — limited data session.** The user provided only a LinkedIn URL with no pasted profile content. The skill does not scrape LinkedIn or use unauthorized automation. Below is what can be inferred from the URL handle alone, plus a clear request for more data. Most fields are marked `Not verified`.

## 1. Identity

- **Name:** Karim Hassan [Inferred from URL handle — needs confirmation]
- **Role:** Not verified / insufficient data
- **Company:** "agency" appears in handle but actual company name is Not verified
- **Location:** Not verified / insufficient data
- **Profile URL:** linkedin.com/in/karim-hassan-agency [Verified — provided]
- **Company URL:** Not verified / insufficient data
- **Mutual connections:** Not verified / insufficient data
- **Source confidence:** Not verified — only URL provided

## 2. Company & Industry

- **Company type:** Not verified / insufficient data — handle suggests agency but unconfirmed
- **Industry:** Not verified / insufficient data
- **Company summary:** Not verified / insufficient data
- **Services/products:** Not verified / insufficient data
- **Target audience:** Not verified / insufficient data
- **Business model:** Not verified / insufficient data
- **Company maturity:** Not verified / insufficient data
- **Tech stack signals:** Not verified / insufficient data
- **Funding/growth signals:** Not verified / insufficient data

## 3. Buyer Role

- **Likely buyer type:** Not verified / insufficient data — handle hints at agency owner/founder but unconfirmed
- **Decision-maker confidence:** Not verified
- **Reason:** No role/title data provided

## 4. Current Focus

- **Current focus:** Not verified / insufficient data
- **Evidence:** None available

## 5. Content Intelligence

- **Post frequency:** Not verified
- **Top-performing visible post:** Not verified
- **Engagement level:** Not verified
- **Audience type:** Not verified

## 6. Content Timeline Analysis

All windows: Not verified / insufficient data. No post content provided.

## 7. Pain & Trigger Analysis

- **Primary pain point:** Not verified / insufficient data
- **Secondary pain points:** Not verified
- **Buying trigger found:** Not verified
- **Urgency:** Not verified

## 8. Personality & Professional Psychology

- **Primary archetype:** Not verified / insufficient data
- **Sentiment:** Not verified
- All sub-fields: Not verified / insufficient data — no content available to read psychology from

## 9. Sales Fit

- **Interest alignment score:** Not verified — cannot score without pain/content evidence
- **Closing probability score:** Not verified
- **Relationship health:** Cold [Default — no verified interaction history]
- **Best contact time:** Not verified
- **Reason this prospect is a good fit:** Not verified — needs profile data
- **Reason this prospect may not buy:** Not verified

## 10. ICP Fit Matrix

| Dimension | Score | Reason |
|---|---|---|
| Industry match | Not verified | No industry data provided |
| Company size match | Not verified | No size data provided |
| Tech adoption signal | Not verified | No content to assess |
| Pain-offer fit | Not verified | No pain evidence |
| Budget likelihood | Not verified | No company financials visible |
| Authority match | Not verified | No role/title confirmed |

**Total: Cannot score reliably with current data**
**Verdict: Need more data — specifically: profile text (headline + about + experience), recent posts (last 5-10), and company URL or company page text**

## 11. Red Flags & Disqualifiers

All flags: Not verified / insufficient data — cannot run red-flag check without profile content.

**Should you skip this prospect?** Cannot decide with current data
**Reason:** No content available to evaluate either pursuit or skip.

## 12. Outreach Recommendation

- **Best collaboration angle:** Not verified — needs psychology and pain data
- **Best offer angle:** Not verified — needs ICP fit confirmed
- **Best case study to send:** Not verified
- **Next step:** **Get more data first.** Recommended action: paste the profile's About + Experience + last 5-10 posts, then re-run this report.
- **Reasoning:** Cold outreach without verified context is the exact pattern the skill is designed to prevent.

## 13. Personalized Comment

Cannot generate. No verified post to comment on.

If user wants a generic "warm introduction" comment for a future post, they need to provide at least one of the prospect's actual posts first.

## 14. First DM — 3 Variants

Cannot generate verified-quality DMs without:
- Profile headline + About
- At least 3-5 recent posts
- Company context

> The skill will not generate generic DMs as a placeholder. Generic DMs are the failure mode this skill exists to avoid.

## 15. Follow-Up Sequence

Not applicable until first DM is generated with verified context.

## 16. Verification Table

| Field | Value | Status | Evidence |
|---|---|---|---|
| Profile URL | linkedin.com/in/karim-hassan-agency | Verified | User-provided |
| Name | Karim Hassan | Inferred from URL handle | Handle pattern — needs confirmation |
| Everything else | — | Not verified | No content provided |

## 17. Missing Data

To make this report useful, please provide at minimum:

1. **Profile headline** (the line below the name)
2. **About section** (the long-form description)
3. **Current experience** (current role + company + 1-2 sentences from their description)
4. **Last 5-10 posts** (paste the text or send screenshots)
5. **Company website URL** (so I can verify industry, size, services)

Optional but valuable:

6. **Engagement numbers** on top posts (likes/comments)
7. **Post timestamps** (for best contact time)
8. **Your own case studies** (so Section 12 and Follow-up #2 can be specific)
9. **Any prior interaction history** with this person

---

**Final note to user:** This report is intentionally empty in most sections because the skill's authenticity rule prevents fabricating data. Please paste at least the profile headline + About + last 5-10 posts. With that, I can produce a complete intelligence report including comment, 3 DM variants, and a real ICP fit score. The current ICP fit cannot be scored honestly.

---

## What This Example Demonstrates

This example shows the skill behaving correctly under data scarcity:

1. **No fabrication.** Even with strong incentives to look helpful, the skill refuses to invent fields.
2. **Clear request for what's needed.** The Missing Data section tells the user *exactly* what to provide.
3. **No fake messages.** Generic DMs are explicitly refused as the failure mode.
4. **Verdict is honest.** "Need more data" is the verdict, not a fake score.
5. **The user is not left empty-handed.** They get a clear next step (paste profile content and re-run).

This is the difference between a tool that always produces "complete-looking" output and a tool that earns the user's trust over time.
