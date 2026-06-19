# Skill Loading Protocol — Phase 1

Load ALL relevant skills BEFORE planning. This ensures plans are reference-based, not training-based.

---

## Why Load Before Plan?

| Without Loading | With Loading |
|----------------|-------------|
| Generic 6-7 section website | 12-15 sections from section-components reference |
| Training-knowledge patterns | Latest patterns from skill references |
| Missing quality standards | Extracted standards from references |
| Inconsistent output | Reference-verified consistent output |

---

## Loading Protocol

### Step 1: Identify Skills

Based on project type from Phase 0:

```
Website project:
  CORE:    nextjs-chatkit-ui-V4, nextjs-animations, theme-factory
  SUPPORT: file-change-planner, env-secrets-manager, git-workflow
  QUALITY: definition-of-done, security-auditor, code-reviewer
  DEPLOY:  ci-cd-pipeline, deployment-engineer

Agent project:
  CORE:    agent-builder-V5, requirements-gathering, chatkit-server
  BACKEND: chatkit-fastapi-backend, api-design, database-design
  SUPPORT: file-change-planner, env-secrets-manager, git-workflow
  QUALITY: definition-of-done, security-auditor, pytest-ai-agents
  DEPLOY:  ci-cd-pipeline, deployment-engineer

Backend API:
  CORE:    api-design, database-design, chatkit-fastapi-backend
  SUPPORT: file-change-planner, env-secrets-manager, git-workflow
  QUALITY: definition-of-done, security-auditor, pytest-ai-agents
  DEPLOY:  ci-cd-pipeline, deployment-engineer

Full-stack:
  ALL of the above combined
```

### Step 2: Read Each Skill

For EACH identified skill:

```bash
# a. Read SKILL.md completely
Read ~/.claude/skills/[skill-name]/SKILL.md

# b. List references/ folder
ls ~/.claude/skills/[skill-name]/references/

# c. Read EVERY reference file
Read ~/.claude/skills/[skill-name]/references/[each-file].md

# d. List templates/ folder
ls ~/.claude/skills/[skill-name]/templates/

# e. Read relevant templates
Read ~/.claude/skills/[skill-name]/templates/[relevant-file].md
```

### Step 3: Extract Quality Standards

From each skill's references, extract MANDATORY standards:

#### From nextjs-chatkit-ui-V4 References

| Reference File | Extract |
|---------------|---------|
| nextjs-professional-guide.md | Minimum 12-15 sections rule |
| nextjs-section-components.md | 14+ section types with specific animations |
| nextjs-design-system.md | Design token structure (colors, fonts, spacing) |
| nextjs-seo-performance.md | JSON-LD, Open Graph, sitemap requirements |
| nextjs-responsive-patterns.md | Mobile nav, touch targets, fluid typography |
| nextjs-copy-guide.md | Niche-specific copywriting patterns |

#### From agent-builder-V5 References

| Reference File | Extract |
|---------------|---------|
| agent-patterns.md | Manager vs Handoffs patterns |
| tool-design.md | Tool parameters + return types |
| guardrail-patterns.md | Input + output guardrail design |
| memory-patterns.md | SQLiteSession / Redis strategies |
| safety-patterns.md | Emergency handling, PII protection |

#### From theme-factory References

| Reference File | Extract |
|---------------|---------|
| color-system.md | Full 50-950 color scale |
| typography-system.md | Heading + body fonts, fluid sizes |
| spacing-system.md | 8px grid system |
| shadow-system.md | 5-level shadow system |

### Step 4: Post Confirmation

After loading, tell user:

```
Skills loaded for [project type] plan:

CORE: [skill names] (X reference files)
SUPPORT: [skill names] (Y reference files)
QUALITY: [skill names] (Z reference files)

Key standards extracted:
- [standard 1 from references]
- [standard 2 from references]
- [standard 3 from references]

Building plan now...
```

---

## Loading Checklist

Before proceeding to Phase 2, verify:

- [ ] All CORE skills read completely
- [ ] All reference files in CORE skills read
- [ ] Relevant templates read
- [ ] Quality standards extracted and noted
- [ ] Confirmation posted to user
- [ ] Context7 queried for stack technologies

---

## Context7 Integration During Loading

After identifying tech stack, query Context7:

```python
# For each technology in the stack
1. mcp__context7__resolve-library-id(libraryName="Next.js", query="...")
2. mcp__context7__query-docs(libraryId="/vercel/next.js", query="app router structure")

# Common queries per tech
Next.js  → "app router API routes project structure metadata"
Prisma   → "schema models relations migrations indexes"
FastAPI  → "endpoints middleware dependencies async"
OpenAI   → "agent tools guardrails handoffs sessions"
Tailwind → "configuration dark mode custom colors"
```

---

## What NOT to Do

| Wrong | Right |
|-------|-------|
| Read only SKILL.md | Read SKILL.md + ALL references + templates |
| Skip loading, plan from memory | Always load, always reference |
| Load after planning | Load BEFORE planning |
| Load only core skills | Load core + support + quality skills |
| Skip confirmation | Always confirm what was loaded |
