# Timeline-Based Content Analysis

Load this when running Step 2 of the workflow.

Recent topic shifts are the strongest predictor of buying triggers. A founder who started posting about "scaling sales" two weeks ago, when six months ago they were posting about product, is showing a buying signal — they're feeling the pain right now. This section tells you how to extract that signal.

## The 4-Window Bucketing

Bucket every visible post into these four time windows:

| Window | Purpose |
|---|---|
| **Last 7 days** | Current acute focus — what's on their mind right now |
| **Last 30 days** | Active priorities — what they're working on this month |
| **Last 6 months** | Strategic priorities — what their team is building |
| **Last 12 months** | Strategic narrative arc — who they are professionally |

For each window, capture:
- Themes (3-5 recurring topics)
- Post count
- Engagement level (high/medium/low — relative to their own baseline, not absolute)
- Notable individual posts (only if visible and verifiable)

If a window has no visible posts, write `No posts visible in this window` — do not fabricate.

## Topic Drift Detection

The most valuable insight comes from comparing windows.

Ask:
- What themes appear in the last 30 days that were absent or rare in the prior 5 months?
- What themes from 6+ months ago have disappeared?
- Has their tone shifted (more frustrated, more excited, more cautious)?
- Are they speaking to a different audience now than a year ago?

If a meaningful shift is detected, that's a **topic drift signal**. Document it explicitly with the before/after comparison.

Examples of valuable drift signals:

| Before → After | Likely Buying Trigger |
|---|---|
| Product features → Hiring/team scaling | Need for sales or ops infrastructure |
| Generic motivation → Specific operational pain | Ready to buy a solution to that pain |
| Customer wins → Customer churn complaints | Retention/onboarding pain |
| Personal brand → Company brand | Company entering growth mode |
| Industry observations → Hiring announcements | Budget unlocked, expansion phase |
| Solo work → Team dynamics | Just hired or restructured |

## Frequency Analysis

Note their posting cadence:
- **Daily/multi-times daily** → Active operator, content is part of their go-to-market
- **2-3 times/week** → Consistent builder, content matters but isn't primary channel
- **Weekly** → Light engagement, content is one of many priorities
- **Sporadic/monthly+** → Either junior in content or extremely senior with limited time
- **Inactive (no posts in 90+ days)** → Content is not their channel; use other signals

Frequency tells you the best *channel* for outreach. Heavy posters often respond to thoughtful comments. Light posters often respond better to DMs.

## Engagement Pattern

If engagement numbers are visible:
- Note which topics earn higher engagement vs lower
- This reveals which topics their network cares about — and which they care about (high-engagement posts are usually high-effort posts)

If only relative signals are visible (some posts have many comments, others have few), document the pattern without fabricating numbers.

## Best Contact Time Inference

If post and reply timestamps are visible:
- What time of day do they post most?
- What time do they reply to comments?
- What day of week are they most active?

A founder who consistently posts and replies between 6-8am suggests:
- They're an early-morning operator
- DMs sent at 6am local time are likely to be seen first

If timestamps are not visible, write `Not verified` for best contact time. Do not guess.

## What to Output for Step 2

Fill the "Content Timeline Analysis" section of the report schema. Every claim must trace to a visible post or be marked `Not verified`.

If the user has provided no post content and you have no authorized access:
- Write `Not verified / insufficient data` for the entire section
- In the Missing Data section, request: "Please share their last 5-10 LinkedIn posts (paste text or screenshots) so I can run timeline analysis."

## Common Trap to Avoid

Do not infer drift from a single post. A drift signal requires:
- At least 2-3 posts in the "after" period showing the new theme
- A visible absence (or rarity) of that theme in earlier periods

A one-off post is noise. A pattern is signal.
