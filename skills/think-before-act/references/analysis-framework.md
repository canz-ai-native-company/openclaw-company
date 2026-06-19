# Smart Question Framework

Context-aware questions — NOT fixed lists. 0-3 questions max based on Phase 0 analysis.

---

## Core Principle: Parse First, Ask Later

```
OLD WAY (WRONG):
  User says anything → Ask 5-6 fixed questions → Plan

NEW WAY (PhD Level):
  User says anything → Parse message → Check what you know → 
  Decide question count (0-3) → Ask only unknowns → Plan
```

---

## Question Budget by Context Clarity

| Clarity | Questions | Approach |
|---------|-----------|----------|
| 80%+ | 0 | Decide everything, inform user |
| 50-80% | 1-2 | Ask only genuine gaps |
| <50% | 3 max | Start with what you understood |
| ~0% | Options | Offer A/B/C choices |

---

## Questions by Project Type (Pick from, NOT ask all)

### Website — Possible Questions (pick 0-2)

| Question | Ask When |
|----------|----------|
| Brand colors? | No color/style hints in message |
| Key features? (ordering, booking, etc.) | Business type unclear |
| Content ready? (photos, text) | For content-heavy sites |
| Reference website? | When style preference unclear |

**NEVER ask**: "What framework?" (you choose), "What is the project?" (they told you)

### Agent — Possible Questions (pick 0-2)

| Question | Ask When |
|----------|----------|
| Data source? (API, database, custom) | Core functionality depends on it |
| Deployment platform? | When not mentioned |
| Multi-agent needed? | Complex workflow described |
| Budget for API calls? | Cost-sensitive context |

**NEVER ask**: "What LLM?" (you recommend), "What framework?" (you choose)

### Backend — Possible Questions (pick 0-2)

| Question | Ask When |
|----------|----------|
| Who consumes the API? | Multiple possible clients |
| Auth method preference? | Security-critical context |
| Expected scale? | Affects architecture choice |
| Existing database? | Migration scenario possible |

### Full-Stack — Possible Questions (pick 0-3)

Combine relevant questions from website + backend/agent.
Still max 3 total.

---

## MUST-Clarify Topics (Override Budget)

These topics get asked even if clarity is high — but only if relevant:

| Topic | When Relevant | Question |
|-------|---------------|----------|
| **Payments** | E-commerce, SaaS, pricing | "Stripe ya Razorpay? Test ya live?" |
| **Auth provider** | Login mentioned | "Google/GitHub OAuth ya email/password?" |
| **Data sensitivity** | Healthcare, finance, legal | "HIPAA/GDPR compliance needed?" |

If NOT relevant (portfolio site, simple agent), skip entirely.

---

## Non-Tech User Questions (Business Only)

When Phase 0 detects non-tech user, ONLY ask:

| OK to Ask | NOT OK |
|-----------|--------|
| "Kya features chahiye?" | "SSR ya SSG?" |
| "Brand colors hain?" | "REST ya GraphQL?" |
| "Online booking/ordering?" | "Which ORM?" |
| "Photos/content ready hain?" | "Database preference?" |
| "Budget hai koi?" | "Deployment platform?" |

---

## Tech User Questions (Full Range)

When Phase 0 detects tech user:

| OK to Ask | Still NOT OK |
|-----------|-------------|
| "SSR for SEO pages?" | Anything they already answered |
| "Prisma ya Drizzle?" | "What is the project?" |
| "PostgreSQL ya SQLite?" | "Who is the audience?" when obvious |
| "Vercel ya Railway?" | Rehashing what they said |

---

## Question Phrasing Rules

### Good Phrasing

```
"Maine ye samjha: [summary]. Bas ye batao:
1. [specific question]
Baaki mai handle karta hoon."
```

### Bad Phrasing

```
"Please answer the following questions before I can proceed:
1. What is the project about?
2. What tech stack do you want?
3. Who is the target audience?
4. What features do you need?
5. What is the budget?
6. When is the deadline?"
```

---

## Smart Decision Examples

### Example: "pharmacy agent banao"

```
Known: agent, pharmacy niche, non-tech user
Unknown: data source, deployment

Decision: 2 questions (business only)
1. "Drug database kahan se aayega? (koi API hai ya custom data?)"
2. "Users kaun hain? Pharmacists ya patients?"

NOT: "What LLM?", "What framework?", "REST or WebSocket?"
```

### Example: "Next.js 15 portfolio with dark theme, deploy on Vercel"

```
Known: Next.js 15, portfolio, dark theme, Vercel, tech user
Unknown: nothing significant

Decision: 0 questions
Agent: "Sab clear hai. Loading skills... Here's the plan:"
```

### Example: "website chahiye"

```
Known: website
Unknown: niche, features, everything else

Decision: offer options first
Agent: "Kis type ki website?
A) Business/Company
B) Portfolio/Personal
C) E-commerce/Store
D) SaaS/Product

Bata do, plan banata hoon!"
```

---

## After Questions Answered → Phase 1

Once questions are answered (or skipped):

1. Proceed to Phase 1: Skill Loading
2. Do NOT ask follow-up questions
3. Make remaining decisions yourself
4. If something unclear during planning, make best judgment and note it in plan
