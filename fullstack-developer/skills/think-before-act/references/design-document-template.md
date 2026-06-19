# Design Document Template — V2 (PhD Level)

Complete output template with project-type-specific sections.

---

## Template

```markdown
# Design Document: [Project Name]

**Version**: 1.0
**Date**: [Date]
**Status**: Awaiting Approval
**Project Type**: [website | agent | backend | fullstack]
**User Level**: [tech | non-tech | adaptive]

---

## 1. Problem Statement & Requirements

- **What**: [Precise description]
- **Why**: [Business goal / user need]
- **Who**: [Target user]
- **MVP Scope**:
  - [ ] [Must-have 1]
  - [ ] [Must-have 2]
  - [ ] [Must-have 3]
- **Out of Scope**: [for later]

### Decisions Made by Agent
| Decision | Reasoning |
|----------|-----------|
| [e.g., Chose Next.js 15] | [User said "website", Next.js is our standard] |
| [e.g., PostgreSQL] | [Relational data, Prisma ORM compatibility] |

---

## 2. Tech Stack

| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| Frontend | Next.js | 15 | App Router, SSR, React Server Components |
| Styling | Tailwind CSS | 3.x | Utility-first, dark mode support |
| Database | PostgreSQL | 16 | Relational, Prisma support |
| ORM | Prisma | 6.x | Type-safe, migrations, schema-first |
| Auth | NextAuth.js | 5.x | OAuth + credentials |
| Deployment | Vercel | - | Next.js optimized |

---

## 3. Design System (Website Plans)

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| primary-50 | #f0f9ff | Lightest background |
| primary-100 | #e0f2fe | Light background |
| primary-500 | #0ea5e9 | Primary buttons |
| primary-900 | #0c4a6e | Dark text |
| accent-500 | [value] | CTA, highlights |
| background-light | [value] | Light sections |
| background-dark | [value] | Dark sections |

### Typography
| Token | Value |
|-------|-------|
| Heading Font | [e.g., Inter] |
| Body Font | [e.g., Plus Jakarta Sans] |
| Size Scale | clamp() based fluid |

### Spacing
8px grid: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128

### Shadows
| Level | Value |
|-------|-------|
| xs | 0 1px 2px rgba(0,0,0,0.05) |
| sm | 0 2px 4px rgba(0,0,0,0.1) |
| md | 0 4px 8px rgba(0,0,0,0.12) |
| lg | 0 8px 24px rgba(0,0,0,0.15) |
| xl | 0 16px 48px rgba(0,0,0,0.2) |

---

## 4. Sections Plan (Website — Minimum 12-15)

| # | Section | Purpose | Animation | Content Outline |
|---|---------|---------|-----------|-----------------|
| 1 | Navigation | Site navigation | Sticky + blur backdrop | Logo, links, mobile drawer |
| 2 | Hero | First impression | TextReveal + gradient orbs | "[Niche headline]", subtext, CTA |
| 3 | Features | Core offerings | StaggeredList + hover | 4-6 features with icons |
| 4 | About | Brand story | ScrollReveal + parallax | Story, values, team photo |
| 5 | Services | Detailed offerings | FadeIn cards | Service cards with pricing |
| 6 | Testimonials | Social proof | Carousel + fade | 3-5 real quotes |
| 7 | Stats | Credibility | AnimatedCounter | 4 key metrics |
| 8 | Process | How it works | Timeline + steps | 3-5 step process |
| 9 | Gallery | Visual showcase | Masonry + lightbox | 8-12 images |
| 10 | Pricing | Plans/packages | Toggle + AnimatedCounter | 2-3 tiers |
| 11 | FAQ | Common questions | Accordion + smooth | 6-8 Q&As |
| 12 | CTA | Conversion | Floating + glow | "Get Started" with form |
| 13 | Contact | Get in touch | Form + floating labels | Form + map + info |
| 14 | Newsletter | Email capture | Input + animated submit | Email input + CTA |
| 15 | Footer | Site links | FadeIn | Links, social, copyright |

---

## 5. Agent Architecture (Agent Plans)

### Agent Definition
```python
from agents import Agent, Runner, SQLiteSession

agent = Agent(
    name="[Agent Name]",
    instructions="[System prompt outline]",
    model="gpt-4o",
    tools=[tool1, tool2, tool3],
)
```

### Tools
| Tool | Description | Parameters | Returns |
|------|-------------|------------|---------|
| [name] | [what it does] | [params with types] | [return type] |

### Guardrails
| Type | Trigger | Action |
|------|---------|--------|
| Input | [pattern/condition] | [block/warn/redirect] |
| Output | [pattern/condition] | [filter/append disclaimer] |
| Emergency | [keywords] | [short-circuit to helpline] |

### Memory
| Aspect | Choice |
|--------|--------|
| Session Type | SQLiteSession / Redis |
| Persist | conversation history, user preferences |
| Session ID | user-based / conversation-based |

### Handoff Pattern (if multi-agent)
| Pattern | Agents | Flow |
|---------|--------|------|
| Manager / Handoffs | [agent list] | [flow description] |

---

## 6. Database Schema

```prisma
// From Context7 Prisma patterns
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}
```

| Table | Key Columns | Relationships |
|-------|-------------|---------------|
| [table] | [columns] | [relations] |

Migration: Prisma Migrate / [tool]
Seed: [yes/no — describe]

---

## 7. API Contract

| Method | Endpoint | Request | Response | Auth | Rate |
|--------|----------|---------|----------|------|------|
| [method] | [path] | [body] | [response] | [auth] | [limit] |

Error format: `{ "error": "message", "code": "ERROR_CODE" }`

---

## 8. File Structure

```
project-root/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Home page
│   │   └── api/
│   ├── components/
│   │   ├── sections/           # Page sections
│   │   └── ui/                 # Reusable UI
│   ├── hooks/
│   ├── lib/
│   └── types/
├── prisma/
├── tests/
├── .env.example
└── .github/workflows/ci.yml
```

| File | Purpose |
|------|---------|
| [every file listed] | [purpose] |

---

## 9. Skill Bundle Map

| Skill | Phase | Purpose |
|-------|-------|---------|
| [skill] | [phase] | [what it does] |

---

## 10. MCP Server Map

| Server | Phase | Task |
|--------|-------|------|
| context7 | Phase 1 | Query [tech] docs |
| github | Phase 2 | Create branch |

---

## 11. Testing Strategy (TDD)

### Tests to Write BEFORE Code

| Test File | Test Cases | Validates |
|-----------|-----------|-----------|
| [file] | [cases] | [what] |

Framework: [jest/vitest/pytest]
Mock strategy: [what to mock]

Implementation: Write ALL tests (Red) → Implement (Green) → Refactor

---

## 12. Security Plan

| Threat | Risk | Mitigation |
|--------|------|------------|
| [threat] | [level] | [action] |

Secret management: .env + env-secrets-manager
Input validation: [library] on all user input

---

## 13. CI/CD & Deployment

| Aspect | Plan |
|--------|------|
| CI/CD | GitHub Actions: lint → typecheck → test → build → deploy |
| Platform | [Vercel/Railway/AWS] |
| Health Check | GET /api/health |
| Rollback | git revert + redeploy |

---

## 14. Pre-Implementation Checklist

### User Must Provide:
- [ ] API keys → .env
- [ ] Brand assets (logo, images) → if available
- [ ] Video URL → if video section
- [ ] Pricing details → if pricing section
- [ ] Domain info → if deploying
- [ ] Content → if user wants specific text

*Agar kuch nahi hai to mai placeholder use karunga — baad mein replace kar lena.*

---

## 15. Definition of Done

- [ ] All tests pass
- [ ] Lint 0 errors
- [ ] Security scan pass
- [ ] Build succeeds
- [ ] .env.example complete
- [ ] Health endpoint works
- [ ] No hardcoded secrets
- [ ] Error states handled
- [ ] [project-specific items]

---

## 16. Implementation Phases

### Phase 2: Setup
- [ ] [tasks]

### Phase 3: Tests First
- [ ] [tasks]

### Phase 4: Build
- [ ] [tasks]

### Phase 5: Review
- [ ] [tasks]

### Phase 6: Deploy
- [ ] [tasks]

---

**Does this plan look good? Any changes?**
```

---

## Section Requirements by Project Type

| Section | Website | Agent | Backend | Full-stack |
|---------|---------|-------|---------|------------|
| 1. Requirements | Always | Always | Always | Always |
| 2. Tech Stack | Always | Always | Always | Always |
| 3. Design System | Always | Skip | Skip | Always |
| 4. Sections Plan | Always | Skip | Skip | Always |
| 5. Agent Architecture | Skip | Always | Skip | If agent |
| 6. Database | If needed | Always | Always | Always |
| 7. API Contract | If needed | Always | Always | Always |
| 8. File Structure | Always | Always | Always | Always |
| 9. Skill Bundle | Always | Always | Always | Always |
| 10. MCP Server Map | Always | Always | Always | Always |
| 11. Testing | Always | Always | Always | Always |
| 12. Security | Always | Always | Always | Always |
| 13. CI/CD | Always | Always | Always | Always |
| 14. Pre-Implementation | Always | Always | Always | Always |
| 15. Definition of Done | Always | Always | Always | Always |
| 16. Implementation Phases | Always | Always | Always | Always |

Sections marked "Skip" should appear with "N/A — [reason]".
