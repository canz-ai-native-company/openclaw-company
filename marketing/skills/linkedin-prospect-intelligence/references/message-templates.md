# Message Templates

Load this when running Step 8 (outreach drafting).

The goal is messages a prospect would actually want to receive. That means: specific, short, no pitch in message #1, matched to their psychology, in their language, in the user's brand voice.

## Hard-Banned Phrases

Never use any of these — they signal spam instantly:

- "I came across your profile and was impressed"
- "I hope this message finds you well"
- "We help companies like yours"
- "Just checking in"
- "Just following up"
- "Can I pick your brain?"
- "Quick question..."
- "Are you the right person to talk to about...?"
- "I'd love to connect"
- "Let me know if this resonates"
- "Circling back"
- "Touching base"
- Any opening that starts with "I" and a self-introduction
- Any compliment that could apply to 1000 other people
- Any urgency that isn't real ("limited spots", "last chance", "only today")

## Language Matching

Detect the prospect's primary content language from their posts:
- If posts are in English → write in English
- If posts are in Hindi (Devanagari) → write in Hindi
- If posts are in Urdu (Nastaliq) → write in Urdu
- If posts are in Roman Urdu / Hinglish → match that exact register
- If posts mix languages → mirror the same mix

If no posts are visible, default to English.

If the user specifies a target language regardless of prospect content, honor the user's instruction.

## Brand Voice Application

If the user has provided a brand voice token (sample messages they've written, tone notes, banned words specific to their brand), apply these rules to all generated messages:

- Match their sentence length pattern
- Match their vocabulary register (casual vs formal vs technical)
- Use their preferred opening style
- Avoid their banned words
- Match their punctuation patterns (e.g., they always use em dashes; they never use exclamation marks)

If no brand voice is provided, use neutral professional tone with the prospect's archetype-matched angle.

---

## Comment Template

Write **one** comment on a verified recent post.

Rules:
- 2-4 sentences
- Reference a specific idea from their post (not the title — an actual idea inside)
- Add a smart perspective: extend, sharpen, or thoughtfully challenge
- No pitch, no link, no CTA
- No generic praise ("great post", "love this", "so true")
- No fake familiarity
- Sound like a peer, not a fan

Structure that works:

```
[Specific observation about their idea]. [Your perspective or extension]. [Optional: a sharp question that opens a real conversation.]
```

**Example — Technical archetype:**

> Bad: "Great breakdown of microservices! Really useful 👍"
>
> Good: "The point about service boundaries failing at the data layer matches what we saw migrating to event sourcing — most teams plan the API contracts carefully but treat shared state as someone else's problem. Did you end up using a single source-of-truth pattern or accept eventual consistency across services?"

**Example — Founder archetype:**

> Bad: "Such an inspiring post! Keep going!"
>
> Good: "The 'fire fast, hire slow' line landed — but in practice the firing part is what breaks most early founders, not the hiring part. Curious if you found a process that made the calls cleaner, or if it just stayed gut every time."

---

## DM Templates — Generate All 3 Variants

Every first DM must:
- Be 60-90 words
- Open with something specific to them (not a self-intro)
- Reference verified profile/post/company context
- Have one clear point — not three
- Ask permission before sending anything substantive
- No hype, no hard pitch, no fake claim
- No links in first message (unless requested by them)

Generate three variants with different psychological angles, then recommend one based on the prospect's archetype + urgency.

### Variant A — Insight Angle

Lead with an observation or extension of something they posted/said. Use when archetype is Educational, Thought-Leader, Technical, or Analytical.

Structure:
```
[Specific reference to their content/work.] [Your insight or extension — one sentence that adds value.] [Soft permission-based CTA — "happy to share the rough breakdown if useful" or "curious if you've thought about X angle".]
```

### Variant B — Pain-Tap Angle

Lead with a pain you've noticed they're navigating (only if there's verified evidence). Use when archetype is Founder-Operator, Sales-Heavy, or there's a strong recent buying trigger.

Structure:
```
[Reference to a specific pain visible in their content/role.] [One sentence on how others in their position solved it — without pitching yourself.] [Permission-based CTA — "want me to send the 2-minute version of what worked for [similar company]?"]
```

Only use pain-tap if you have actual evidence of the pain. If pain is inferred-but-not-verified, mark the variant and let the user decide whether to send it.

### Variant C — Curiosity Angle

Lead with a smart, specific question that signals you've done your homework. Use when archetype is Cautious/Compliance, when relationship is cold, or when other angles feel too forward.

Structure:
```
[Specific reference showing you've read their work.] [A real question — not rhetorical — that you'd genuinely like their take on.] [Optional: "no agenda, just curious how you're thinking about it."]
```

The curiosity variant works because it creates no pressure to respond with a yes/no — they can respond with their actual thinking, which starts a conversation.

### Variant Selection Logic

```
If archetype is Educational/Thought-Leader/Analytical → recommend Variant A
If archetype is Founder-Operator/Sales-Heavy AND verified pain exists → recommend Variant B
If archetype is Cautious/Compliance OR relationship is fully cold OR no pain evidence → recommend Variant C
If hybrid archetype → recommend the variant that matches the dominant lens
```

Always explain the recommendation in 1-2 sentences tied to the prospect's psychology + urgency.

---

## Follow-Up Sequence

Three follow-ups, each with a specific angle and specific timing. Send only if no reply.

### Follow-up 1 — Day 3 to 4 after first DM

Angle: Gentle value-add. No "just checking in" — actually add something.

Rules:
- Under 60 words
- Add a small, useful piece of context they didn't have before (a relevant article, a quick observation, a single data point)
- No "did you see my message?"
- No guilt
- No CTA stronger than the first message

Structure:
```
[Reference to the topic of your first DM.] [One genuinely useful addition — a stat, a link, a quick observation.] [Same permission-based CTA as before, or even softer.]
```

### Follow-up 2 — Day 7 to 10 after first DM

Angle: Case study / proof. Show, don't tell.

Rules:
- Under 80 words
- Reference one specific case study (use case study from `case-study-mapping.md` matched to their pain)
- Mention the actual outcome with a real number if available
- Still no hard pitch — frame as "thought you might find this useful given your context"
- Permission-based CTA: "want the 3-line summary?" or "happy to send if useful"

Structure:
```
[One-line bridge to your earlier context.] [Case study one-liner — company type + outcome + mechanism, no fluff.] [Permission-based CTA.]
```

### Follow-up 3 — Day 21+ after first DM

Angle: Soft exit / breakup. Closes the loop and leaves the door open.

Rules:
- Under 50 words
- Acknowledge the silence without guilt
- Leave the door clearly open for the future
- No final pitch, no "last chance"
- Frame as your part being done, not their failure to respond

Structure:
```
[One line acknowledging you've reached out a few times.] [One line releasing the pressure — "totally understand if not a fit/timing".] [One line leaving the door open — "happy to reconnect whenever it's relevant, no follow-ups from my side".]
```

---

## Message Quality Self-Check

Before finalizing any message, run it through these questions:

1. Could this message have been sent to 100 other people verbatim? If yes → rewrite
2. Does it pitch in the first message? If yes → soften to permission-based
3. Does it use any banned phrase? If yes → rewrite
4. Does it match their archetype's preferred angle? If no → rewrite
5. Is it in the right language? If no → rewrite
6. Is it under the word limit? If no → cut
7. Does it sound like a human, or like a sales template? If template → rewrite

If a message fails 2+ of these checks, scrap it and start over rather than patching.

## Output Format

For Section 14 of the report, output all three variants clearly labeled, then the recommended variant with reasoning. Do not output only the recommended one — the user should see all three to choose or A/B test.

For Section 15, output all three follow-ups with their day-timing labels.
