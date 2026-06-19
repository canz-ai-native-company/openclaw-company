# Global Lessons

**Purpose:** Patterns learned across ALL projects (no client-specific data)
**Last Updated:** 2026-03-23
**Total Patterns:** 8

---

## ChatKit Patterns

| ID | Pattern | Problem | Solution | Prevention |
|----|---------|---------|----------|------------|
| CK-001 | npm import fails | @openai/chatkit-react requires domainKey | Use CDN approach | FORBIDDEN in nextjs-chatkit-ui |
| CK-002 | Empty greeting | startScreen not displayed | Add greeting text | Validation check |
| CK-003 | Script onLoad error | Event handlers not allowed in script tag | Use useEffect hook | Code pattern in skill |

---

## Docker Patterns

| ID | Pattern | Problem | Solution | Prevention |
|----|---------|---------|----------|------------|
| DK-001 | MCP not loading | /home/node/.claude owned by root | Add to chown command in Dockerfile | Dockerfile checklist |
| DK-002 | Cache not invalidating | Build uses cached layers | Use --no-cache flag | Build script |

---

## Next.js Patterns

| ID | Pattern | Problem | Solution | Prevention |
|----|---------|---------|----------|------------|
| NX-001 | Windows build fail | Turbopack path issue | Add turbopack.root to next.config.ts | next.config.ts template |
| NX-002 | ESLint errors | no-unused-vars, no-explicit-any strict | Fix errors or disable rules | ESLint config |

---

## OpenAI Agents SDK Patterns

| ID | Pattern | Problem | Solution | Prevention |
|----|---------|---------|----------|------------|
| SDK-001 | Wrong imports | from agents.tools import X fails | from agents import X | FORBIDDEN in agent-builder |

---

## Database Patterns

| ID | Pattern | Problem | Solution | Prevention |
|----|---------|---------|----------|------------|
| DB-001 | Connection timeout | Pool exhausted | Increase pool size | Config template |

---

## API Patterns

| ID | Pattern | Problem | Solution | Prevention |
|----|---------|---------|----------|------------|
| API-001 | CORS error | Missing headers | Add CORS middleware | Backend template |

---

## General Patterns

| ID | Pattern | Problem | Solution | Prevention |
|----|---------|---------|----------|------------|
| GEN-001 | Type error any | ESLint strict mode rejects any | Define proper types | TypeScript config |

---

## Pattern Categories Summary

| Category | Count | Last Updated |
|----------|-------|--------------|
| ChatKit | 3 | 2026-03-23 |
| Docker | 2 | 2026-03-23 |
| Next.js | 2 | 2026-03-23 |
| OpenAI SDK | 1 | 2026-03-23 |
| Database | 1 | 2026-03-23 |
| API | 1 | 2026-03-23 |
| General | 1 | 2026-03-23 |

---

## How to Add New Pattern

1. Identify category (or create new)
2. Assign ID: [CATEGORY]-[NUMBER]
3. Fill all columns: Pattern, Problem, Solution, Prevention
4. Update category count
5. Update Last Updated date
