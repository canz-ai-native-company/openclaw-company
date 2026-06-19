# Smart Flow Examples

Real examples showing how Phase 0 works for different user types.

---

## Example 1: Non-Tech User — Bakery Website

### User Message
```
"mujhe apni bakery ke liye website chahiye"
```

### Phase 0 Analysis

**Step A — Parse:**
```
Project: website
Stack: not specified
Niche: bakery
Features: not specified
Design: not specified
User Level: non-tech (simple language, Roman Urdu, no framework names)
Gaps: features, design, content
```

**Step B — Capability Check:**
```
Skills available: nextjs-chatkit-ui-V4 ✓, nextjs-animations ✓, theme-factory ✓
MCP: Context7 ✓
Decision: Can build full bakery website
```

**Step C — Smart Decision:**
Context clarity: ~40% (we know: website + bakery)
But user is NON-TECH → don't ask tech questions
→ Ask 2 BUSINESS questions only

**Step D — Non-tech mode ON**

### Agent Response
```
Bakery website banata hoon! Bas 2 cheezein batao:

1. Brand colors hain koi? Ya mujhe choose karne do?
2. Online ordering chahiye ya sirf showcase?

Baaki sab mai handle karta hoon — design, sections, animations, SEO sab included hoga.
```

### After User Answers → Phase 1

```
Skills loaded for bakery website:

CORE: nextjs-chatkit-ui-V4 (8 refs), nextjs-animations (5 refs), theme-factory (4 refs)
SUPPORT: file-change-planner, env-secrets-manager, git-workflow
QUALITY: definition-of-done, security-auditor

Key standards extracted:
- Minimum 13 sections with bakery-specific content
- Warm/cozy design system (browns, creams, warm serif fonts)
- SEO: LocalBusiness JSON-LD for bakery
- Mobile-first: online ordering must work on phone

Building plan now...
```

### Plan Highlights (Phase 2)
- Design: Warm tones (#8B4513 brown scale), serif headings, cream backgrounds
- 13 sections: Hero, Menu, About Our Story, Gallery, Testimonials, Custom Cakes, Process, Team, Locations, FAQ, Newsletter, Contact, Footer
- Each section with specific animation (TextReveal hero, StaggeredList menu, ScrollReveal gallery)
- Bakery-specific copy: "Freshly Baked, Made with Love Since 2010"

---

## Example 2: Tech User — SaaS Landing Page

### User Message
```
"Build a Next.js 15 SaaS landing page with Stripe integration, dark theme, Tailwind CSS. Target audience is developers."
```

### Phase 0 Analysis

**Step A — Parse:**
```
Project: website
Stack: Next.js 15, Tailwind CSS, Stripe
Niche: SaaS (developer tools)
Features: Stripe payments, dark theme
Design: dark theme specified
User Level: tech (framework names, specific versions)
Gaps: NONE — everything clear
```

**Step B — Capability Check:**
```
Skills: nextjs-chatkit-ui-V4 ✓, theme-factory ✓, nextjs-animations ✓
MCP: Context7 ✓ (query Next.js 15, Stripe)
```

**Step C — Smart Decision:**
Context clarity: 90%+ → ZERO QUESTIONS
Agent decides everything.

**Step D — Tech mode ON**

### Agent Response (No Questions!)
```
All context clear. Loading skills...

Skills loaded for SaaS landing page:

CORE: nextjs-chatkit-ui-V4 (8 refs), nextjs-animations (5 refs), theme-factory (4 refs)
SUPPORT: file-change-planner, env-secrets-manager
QUALITY: definition-of-done, security-auditor

Key decisions I made:
- Next.js 15 App Router with TypeScript
- Tailwind CSS + dark mode via class strategy
- Stripe Checkout for payments
- Vercel deployment

Here's the plan:
[Full 14-section plan with dark design system, Stripe pricing integration,
developer-focused copy, specific animations per section]
```

---

## Example 3: Tech User — AI Agent

### User Message
```
"Build a pharmacy assistant agent using OpenAI Agents SDK. It should look up drug information, check interactions, and provide dosage guidance. Need FastAPI backend."
```

### Phase 0 Analysis

**Step A — Parse:**
```
Project: agent
Stack: OpenAI Agents SDK, FastAPI
Niche: pharmacy/healthcare
Features: drug lookup, interaction check, dosage guidance
Design: N/A (backend agent)
User Level: tech
Gaps: database choice, deployment platform
```

**Step B — Capability Check:**
```
Skills: agent-builder-V5 ✓, chatkit-fastapi-backend ✓, api-design ✓
MCP: Context7 ✓ (query OpenAI Agents SDK, FastAPI)
```

**Step C — Smart Decision:**
Context clarity: 75% → 1-2 questions

### Agent Response
```
Pharmacy agent samajh gaya. 2 quick questions:

1. Drug database kahan se aayega? (API like RxNorm, or custom database?)
2. Deploy karna hai to platform preference? (Railway / AWS / Vercel?)

Stack decisions already made:
- OpenAI Agents SDK (Python) with gpt-4o
- FastAPI backend with streaming
- SQLiteSession for conversation memory
- Input guardrail for emergency keywords (overdose, suicide → helpline)
- Output guardrail for mandatory medical disclaimer
```

---

## Example 4: Vague Request

### User Message
```
"kuch banao"
```

### Phase 0 Analysis

**Step A — Parse:**
```
Project: UNKNOWN
Stack: UNKNOWN
Niche: UNKNOWN
User Level: non-tech (simple language)
Gaps: EVERYTHING
```

**Step C — Smart Decision:**
Context clarity: <10% → Offer options

### Agent Response
```
Kya banana hai? 3 options:

A) 🌐 Website / Landing Page — business ya portfolio ke liye
B) 🤖 AI Agent / Bot — customer support ya specific task ke liye
C) 🔧 Full-stack Application — complete app with database

Bata do, main plan banata hoon!
```

---

## Example 5: Existing Project Addition

### User Message
```
"Add a dark mode toggle to my Next.js app. Already using Tailwind."
```

### Phase 0 Analysis

**Step A — Parse:**
```
Project: existing project modification
Stack: Next.js + Tailwind (already set up)
Feature: dark mode toggle
User Level: tech
Gaps: NONE
```

**Step C — Smart Decision:**
Context clarity: 95% → ZERO QUESTIONS
This is a small feature (2-4 files) → Use file-change-planner, NOT full Design Document

### Agent Response
```
Dark mode toggle add karta hoon. File change plan:

Files to Create:
- src/components/DarkModeToggle.tsx — Toggle switch component
- src/hooks/useDarkMode.ts — Theme state management

Files to Modify:
- tailwind.config.js — Add darkMode: 'class'
- src/app/layout.tsx — Add ThemeProvider wrapper

Risk: Theme flash on page load → blocking script in <head>

Proceed? [Yes/No]
```

**Note**: Small features skip the full Design Document and use file-change-planner directly.

---

## Decision Summary

| Scenario | Questions | Mode | Plan Type |
|----------|-----------|------|-----------|
| Non-tech + vague niche | 2 business | Non-tech | Full Design Doc |
| Tech + full context | 0 | Tech | Full Design Doc |
| Tech + minor gaps | 1-2 targeted | Tech | Full Design Doc |
| Completely vague | Options menu | Adaptive | After clarification |
| Small feature (1-4 files) | 0 | Auto | File change plan only |

---

## Communication Style by Mode

### Non-Tech Mode

```
✓ "Bakery website banata hoon!"
✓ "Ye section mein aapki photos dikhein gi"
✓ "Brand colors choose karo ya mujhe karne do"
✗ "I'll implement a Next.js App Router with SSR"
✗ "Using Prisma ORM for the database layer"
```

### Tech Mode

```
✓ "Next.js 15 App Router, Tailwind with dark mode class strategy"
✓ "Prisma with PostgreSQL, deploying on Vercel"
✓ "SSR for SEO pages, CSR for dashboard"
✗ "Website bana deta hoon aapke liye"
✗ Oversimplified explanations
```

### Adaptive Mode

```
✓ Technical plan with simplified summaries
✓ "Ye database hai (PostgreSQL) — jahan saara data safe rehta hai"
✓ Technical details in plan, simple language in conversation
```
