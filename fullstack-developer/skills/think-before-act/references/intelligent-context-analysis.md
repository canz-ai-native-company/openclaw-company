# Intelligent Context Analysis — Phase 0

The agent's FIRST action before asking any questions. Parse, detect, decide.

---

## Step A: User Message Deep Parse

Extract EVERYTHING the user's message contains:

| Extract | How | Example |
|---------|-----|---------|
| **Project type** | Keywords: "website", "agent", "bot", "app", "API" | "bakery website" → website |
| **Tech stack** | Framework names: "Next.js", "FastAPI", "React" | "Next.js 15 with Prisma" → Next.js + Prisma |
| **Audience/niche** | Business context | "bakery", "SaaS", "pharmacy" |
| **Design hints** | Colors, style, references | "dark theme", "modern", "like Stripe" |
| **Features** | Explicit requests | "login", "payments", "chat" |
| **Reference sites** | URLs or company names | "like Vercel's landing page" |
| **Language level** | Simple vs technical | "website banao" = non-tech |

### Parse Template

```
PARSED FROM USER MESSAGE:
- Project: [website / agent / backend / fullstack]
- Stack: [mentioned or "not specified"]
- Niche: [business type]
- Features: [list]
- Design: [any hints]
- User Level: [tech / non-tech / mixed]
- Gaps: [what's missing]
```

---

## Step B: Self-Capability Check

Before asking user, check what YOU can do:

### Skills Scan

```bash
# List available skills
ls ~/.claude/skills/

# For each relevant skill, read DESCRIPTION only (first 5 lines)
head -5 ~/.claude/skills/[skill-name]/SKILL.md
```

### MCP Server Check

| Server | Check | If Available |
|--------|-------|--------------|
| Context7 | `mcp__context7__resolve-library-id` | Query tech docs |
| GitHub | `mcp__github__*` | Create repos, branches |
| Neon | `mcp__neon__*` | Database provisioning |

### Tools Check

| Tool | Available? | Use For |
|------|-----------|---------|
| Bash | Always | Project scaffolding |
| Read/Write | Always | File operations |
| WebSearch | Check | Research if needed |
| Browser | Check | Reference site analysis |

---

## Step C: Smart Question Decision

### Decision Matrix

```
Context from user message = X%

IF X >= 80%:
  ┌─────────────────────────────────────────────────┐
  │ ZERO QUESTIONS                                   │
  │ Agent decides everything. Tell user:             │
  │ "Maine samjha [summary]. Ye decisions maine      │
  │  liye: [decisions]. Plan bana raha hoon..."      │
  └─────────────────────────────────────────────────┘

IF 50% <= X < 80%:
  ┌─────────────────────────────────────────────────┐
  │ 1-2 TARGETED QUESTIONS                          │
  │ Only ask what's genuinely unknown.               │
  │ "Maine ye samjha [summary]. Bas ye batao:        │
  │  1. [specific question]                          │
  │  2. [specific question]                          │
  │  Baaki mai handle karta hoon."                   │
  └─────────────────────────────────────────────────┘

IF X < 50%:
  ┌─────────────────────────────────────────────────┐
  │ 3 QUESTIONS MAX                                  │
  │ Start with what you DO understand.               │
  │ "Mujhe ye samajh aaya: [summary].                │
  │  Confirm karo aur ye batao:                      │
  │  1. [question]                                   │
  │  2. [question]                                   │
  │  3. [question]"                                  │
  └─────────────────────────────────────────────────┘

IF completely vague:
  ┌─────────────────────────────────────────────────┐
  │ OFFER OPTIONS                                    │
  │ "Kya banana hai? 3 options:                      │
  │  A) Website/Landing page                         │
  │  B) AI Agent/Bot                                 │
  │  C) Full-stack application                       │
  │  Bata do main plan banata hoon."                 │
  └─────────────────────────────────────────────────┘
```

### Question Quality Rules

| Good Question | Bad Question | Why Bad |
|---------------|-------------|---------|
| "Brand colors hain koi?" | "What tech stack?" | User already said Next.js |
| "Online ordering chahiye ya sirf showcase?" | "Who is target user?" | Obvious from context |
| "Stripe ya Razorpay?" | "Authentication chahiye?" | If user said "login" already |

### What to NEVER Ask

- "What technology?" → when user specified it
- "What is the project?" → when user described it
- "Who is the audience?" → when niche is obvious
- "Do you need auth?" → when user said "login"
- Generic questions that show you didn't read the message

---

## Step D: Non-Tech User Detection

### Detection Signals

| Signal | Score | Example |
|--------|-------|---------|
| Simple language | +3 | "website banao", "app chahiye" |
| No framework names | +2 | "portfolio website" (no mention of React/Next) |
| Business-first thinking | +2 | "customers ko dikhana hai" |
| Roman Urdu / Hindi | +1 | "mujhe chahiye" |
| Technical terms | -3 | "Next.js", "Prisma", "API endpoint" |
| File/path mentions | -2 | "src/components", ".env" |
| Architecture terms | -2 | "microservices", "REST", "WebSocket" |

**Score >= 3 → Non-tech mode**
**Score <= -2 → Tech mode**
**Between → Adaptive mode**

### Non-Tech Mode Behavior

| Aspect | What to Do |
|--------|-----------|
| **Communication** | Simple language, no jargon |
| **Tech decisions** | YOU choose everything (framework, DB, architecture) |
| **Questions** | Only BUSINESS questions ("Features?", "Colors?", "Content?") |
| **Plan presentation** | Show technical plan but explain in simple terms |
| **Explanations** | "Ye database hai jahan data save hota hai" not "PostgreSQL with Prisma ORM" |

### Tech Mode Behavior

| Aspect | What to Do |
|--------|-----------|
| **Communication** | Full technical language |
| **Tech decisions** | Discuss options, recommend with tradeoffs |
| **Questions** | Technical questions OK ("SSR or SSG?", "REST or tRPC?") |
| **Plan presentation** | Full technical depth |
| **Explanations** | Architecture diagrams, ADRs, specific versions |

---

## Phase 0 Output

After completing Steps A-D, you should have:

```
CONTEXT ANALYSIS COMPLETE:
- Project: [type]
- Stack: [decided or user-specified]
- Niche: [identified]
- User Level: [tech / non-tech]
- Questions Needed: [0 / 1-2 / 3]
- Questions: [if any]
- Decisions Made: [list what agent decided]
```

Then proceed to Phase 1 (Skill Loading).
