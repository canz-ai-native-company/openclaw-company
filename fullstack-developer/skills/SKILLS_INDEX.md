# Skills Index

Quick reference for all available skills. **Read the relevant SKILL.md before implementing.**

## Skill Registry

| Skill | Trigger Keywords | SKILL.md | References | Templates |
|-------|------------------|----------|------------|-----------|
| **agent-builder** | "build agent", "create bot", "AI agent", "chatbot" | [SKILL.md](agent-builder/SKILL.md) | 10+ files | 11 templates |
| **nextjs-chatkit-ui** | "website", "frontend", "nextjs", "landing page" | [SKILL.md](nextjs-chatkit-ui/SKILL.md) | 13 files | - |
| **chatkit-fastapi-backend** | "backend", "fastapi", "server", "API" | [SKILL.md](chatkit-fastapi-backend/SKILL.md) | Yes | - |
| **pytest-ai-agents** | "pytest", "test", "testing" | [SKILL.md](pytest-ai-agents/SKILL.md) | Yes | - |
| **neon-postgres** | "database", "neon", "postgres" | [SKILL.md](neon-postgres/SKILL.md) | Yes | - |
| **nextjs-animations** | "animation", "motion", "animate" | [SKILL.md](nextjs-animations/SKILL.md) | Yes | - |
| **theme-factory** | "theme", "colors", "styling" | [SKILL.md](theme-factory/SKILL.md) | Yes | - |
| **nextjs-prisma** | "prisma", "orm", "schema" | [SKILL.md](nextjs-prisma/SKILL.md) | Yes | - |
| **nanoclaw-scheduled-tasks** | "schedule", "cron", "reminder" | [SKILL.md](nanoclaw-scheduled-tasks/SKILL.md) | Yes | - |
| **requirements-gathering** | "requirements", "what do you need" | [SKILL.md](requirements-gathering/SKILL.md) | - | - |
| **client-communication** | "hello", "hi", "help" | [SKILL.md](client-communication/SKILL.md) | - | - |

---

## Loading Rules

### Single Skill Task

When user request matches ONE skill:

```
1. Read SKILL.md
2. Read ALL files in references/ folder
3. Check templates/ folder
4. Follow skill instructions
```

### Multi-Skill Task (Full Stack)

When user request requires MULTIPLE skills (e.g., "build complete app"):

```
1. Load agent-builder for AI agent/backend logic
2. Load nextjs-chatkit-ui for frontend
3. Load chatkit-fastapi-backend for API server
4. Load pytest-ai-agents for testing
```

---

## Skill Categories

### AI Agent Development
- **agent-builder** - Core agent architecture, patterns, tools
- **requirements-gathering** - Client requirement collection
- **client-communication** - WhatsApp conversation handling

### Frontend Development
- **nextjs-chatkit-ui** - Next.js + ChatKit integration
- **nextjs-animations** - Motion/Framer animations
- **theme-factory** - Color/typography themes

### Backend Development
- **chatkit-fastapi-backend** - FastAPI + ChatKit server
- **chatkit-server** - ChatKit Python SDK
- **neon-postgres** - Neon PostgreSQL database
- **nextjs-prisma** - Prisma ORM

### Testing & Quality
- **pytest-ai-agents** - pytest for AI agents

### Automation
- **nanoclaw-scheduled-tasks** - Cron/scheduled tasks

---

## Quick Start Commands

### Read a Skill
```
Read /home/node/.claude/skills/{skill-name}/SKILL.md
```

### List References
```
Glob /home/node/.claude/skills/{skill-name}/references/*.md
```

### List Templates
```
Glob /home/node/.claude/skills/{skill-name}/templates/*/
```

---

## Important Notes

1. **Always read SKILL.md first** - Contains required clarifications, forbidden actions, patterns
2. **Read ALL references** - Contains implementation details, code patterns, examples
3. **Use templates when available** - Don't reinvent the wheel
4. **Follow TDD workflow** - Write tests first if skill specifies
5. **Use Context7 for docs** - Verify SDK features with latest documentation

## LMA Build Method skills (client sites — details in SKILLS_INDEX_LMA.md)

| Skill | Use when |
|---|---|
| `design-language-protocol` | MANDATORY for EVERY design task — load BEFORE Phase 1 |
| `lma-lp-structure` | Every client landing-page build (Phase 4 blueprint) |
| `lma-website-structure` | Every client multi-page website build (Phase 4) |
| `lma-visual-implementation` | LMA visual guide -> design tokens (Phase 5) |
