# Case Study Mapping

Load this when running Step 7 (case study and offer angle matching).

The goal is to match the prospect's primary pain to the case study most likely to resonate. Two modes:

1. **User has provided case studies** — match from the user's library
2. **User has not provided case studies** — recommend an angle only, and clearly mark that no specific case study is available

Never invent case studies, fake clients, or made-up metrics.

## How to Use This File

1. Identify the prospect's primary pain from Step 6
2. Look up the pain in the mapping table below
3. If the user provided a matching case study, use it
4. If not, output the angle and mark `No verified case study provided. Recommended case-study angle: {{angle}}`

## Pain → Solution Mapping

### Sales / Outbound Pain

**Signals to detect:**
- Posts about low reply rates, "outbound is broken", SDR cost, scaling outreach
- Hiring SDRs, BDR coordination posts
- Frustration with manual prospecting or tooling

**Best-fit solution angle:** AI SDR / Research Employee
**Positioning:** "Pulls verified prospect intelligence and drafts personalized messages so AEs/SDRs spend time selling, not researching."
**Key outcomes to mention (only if user has data):** research time per lead, reply rate lift, message personalization at scale

---

### Slow Follow-Up / Lead Decay Pain

**Signals to detect:**
- Posts about deals going cold, lead response time, "first to respond wins"
- Marketing complaining sales isn't following up
- Inbound leads not getting fast enough attention

**Best-fit solution angle:** AI Follow-Up / Booking Employee
**Positioning:** "Handles inbound lead follow-up + meeting booking the moment a lead lands, before the lead cools."
**Key outcomes to mention:** time-to-first-response, meetings booked per lead, after-hours capture rate

---

### Lead Qualification Pain

**Signals to detect:**
- Posts about SDRs wasting time on unqualified leads
- Bad-fit demos burning AE time
- Form-fill spam, low-intent leads, "MQL ≠ SQL" complaints

**Best-fit solution angle:** AI Qualification Agent
**Positioning:** "Pre-qualifies inbound leads against ICP before they hit AE calendars — saves rep time, raises demo show-up quality."

---

### Client Delivery / Operations Bottleneck Pain

**Signals to detect:**
- Agency owners complaining about delivery capacity
- "Hiring is hard", "team can't scale fast enough"
- Service-business margin compression
- Project management overhead complaints

**Best-fit solution angle:** AI Operations Employee
**Positioning:** "Handles the repetitive delivery operations layer — reporting, status updates, client comms drafts — so senior people spend time on strategy, not admin."

---

### Content / Research Pain

**Signals to detect:**
- Posts about content factory bottlenecks
- "Research takes forever"
- Marketing/content team struggling with output volume

**Best-fit solution angle:** AI Content Intelligence Agent
**Positioning:** "Researches topics, briefs writers, drafts first versions — content team finalizes and ships."

---

### Agency Scaling Pain

**Signals to detect:**
- Agency founder posts about hitting capacity ceiling
- Team-cost-vs-margin tension
- "Doing it all myself" / can't delegate the standard

**Best-fit solution angle:** AI Client Delivery System
**Positioning:** "Multi-agent system that handles client delivery operations end-to-end with human approval gates — agencies scale without proportional headcount."

---

### B2B SaaS — Trial-to-Paid / Pipeline Recovery Pain

**Signals to detect:**
- Posts about trial conversion rates
- Free-to-paid friction
- Stalled deals, pipeline that doesn't close

**Best-fit solution angle:** Trial-to-Paid / Pipeline Recovery Agent
**Positioning:** "Engages trial users at the right moments + reactivates stalled deals in pipeline with personalized, evidence-based outreach."

---

### Healthcare / Clinic Pain

**Signals to detect:**
- Clinic/practice owner posts about booking, no-shows, front-desk workload
- Patient communication overhead
- Appointment scheduling complaints

**Best-fit solution angle:** AI Receptionist / Booking Agent
**Positioning:** "Handles patient inquiries, scheduling, reminders 24/7 — clinic staff focus on in-person care."

---

### Software Company / Multi-Process Pain

**Signals to detect:**
- CTO/founder posts about engineering team being a bottleneck
- Multiple repetitive workflows across departments
- "We need to automate more"

**Best-fit solution angle:** Multi-Agent Delivery Framework
**Positioning:** "Custom multi-agent system built on Claude / OpenAI Agents SDK that automates the repetitive parts of your specific workflow, with engineering oversight."

---

## When to Combine Multiple Solutions

If the prospect shows 2+ pains, do not pitch all of them. Pick the **most urgent** pain (based on Step 6 urgency score) and lead with that solution. Mention the second briefly only if there's a natural bridge.

Prospects buy solutions to one pain at a time. Pitching three solutions makes you look like a vendor, not a partner.

## When User Has No Case Studies Yet

If the user is early-stage and doesn't have case studies, output:

```
No verified case study provided.
Recommended angle: {{angle from above}}
Suggested first-version positioning: "{{1-2 sentence positioning the user can adapt}}"
```

Then in the report's "Missing Data" section, note: "Add 1-2 case studies (industry + outcome + mechanism) to make Section 12 stronger in future reports."

## When User Has Multiple Case Studies

If the user has provided multiple case studies, rank them by:
1. Industry match with prospect
2. Pain match with prospect
3. Outcome relevance to prospect's role

Pick the top 1 for Section 12. Mention the runner-up only if it adds a different angle for Follow-up #2.

## Format for Output

For Section 12 of the report:

```
Best collaboration angle: {{specific to this prospect}}
Best offer angle: {{which solution}}
Best case study to send: {{name + industry + outcome + mechanism}}
  OR
  No verified case study provided. Recommended angle: {{angle}}
```

For Follow-up #2 in Section 15:
Use the actual case study (or angle if none available) as the proof point.
