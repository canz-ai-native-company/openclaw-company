# Lesson Extraction Guide

How to generalize lessons for GLOBAL_LESSONS.md.

---

## When to Extract to Global

Extract to GLOBAL_LESSONS.md when:

| Condition | Extract? |
|-----------|----------|
| Error applies to technology (not client) | Yes |
| Error can occur in any project | Yes |
| Fix is reusable | Yes |
| Error is client-specific | No |
| Error contains sensitive data | No |
| Error is one-time user mistake | No |

---

## Extraction Process

### Step 1: Identify Pattern

Ask: "Can this error occur in other projects?"

- If YES -> Continue extraction
- If NO -> Keep in LESSONS_LEARNED only

### Step 2: Sanitize Data

Remove:
- Client names
- Project names
- Specific URLs
- API keys or secrets
- Personal information

Replace with:
- Generic descriptions
- [placeholder] tokens
- Category names

### Step 3: Categorize

Assign to category:

| Category | Prefix | Examples |
|----------|--------|----------|
| ChatKit | CK- | Widget, npm, CDN |
| Docker | DK- | Build, permissions |
| Next.js | NX- | Config, build, SSR |
| Database | DB- | Connection, query |
| API | API- | CORS, auth, rate limit |
| OpenAI SDK | SDK- | Imports, agents |
| General | GEN- | TypeScript, linting |

### Step 4: Format Entry

```markdown
| ID | Pattern | Problem | Solution | Prevention |
|----|---------|---------|----------|------------|
| [PREFIX]-[NUM] | [Short name] | [Generic description] | [Reusable fix] | [Skill section to update] |
```

---

## Extraction Examples

### Before (Project-Specific)

```
Error in Ahmads restaurant website:
npm install @openai/chatkit-react failed
because it needs domainKey from OpenAI
Fixed by using CDN script tag
```

### After (Global Pattern)

```
| CK-001 | npm import fails | Package requires domainKey | Use CDN approach | FORBIDDEN in nextjs-chatkit-ui |
```

---

### Before (Project-Specific)

```
Juniors dental clinic project:
Build failed on Windows because turbopack
could not resolve path. Added turbopack.root
to next.config.ts
```

### After (Global Pattern)

```
| NX-001 | Windows build fail | Turbopack path issue | Add turbopack.root config | next.config.ts template |
```

---

## Pattern Naming Convention

Format: `[CATEGORY]-[NUMBER]: [Short Description]`

Examples:
- CK-001: npm import fails
- DK-001: MCP not loading
- NX-001: Windows build fail
- SDK-001: Wrong imports
- DB-001: Connection timeout
- API-001: CORS error
- GEN-001: Type error any

---

## Initial Global Lessons

Create GLOBAL_LESSONS.md with these known patterns:

```markdown
# Global Lessons

**Last Updated:** [Today]
**Total Patterns:** 8

---

## ChatKit Patterns

| ID | Pattern | Problem | Solution | Prevention |
|----|---------|---------|----------|------------|
| CK-001 | npm import fails | Package requires domainKey | Use CDN approach | FORBIDDEN |
| CK-002 | Empty greeting | startScreen not shown | Add greeting text | Validation |
| CK-003 | Script onLoad | Event handlers error | Use useEffect | Code pattern |

---

## Docker Patterns

| ID | Pattern | Problem | Solution | Prevention |
|----|---------|---------|----------|------------|
| DK-001 | MCP not loading | Root owns .claude | chown in Dockerfile | Checklist |
| DK-002 | Cache issue | Old layers cached | Use --no-cache | Build script |

---

## Next.js Patterns

| ID | Pattern | Problem | Solution | Prevention |
|----|---------|---------|----------|------------|
| NX-001 | Windows build fail | Turbopack path issue | Add turbopack.root | Template |
| NX-002 | ESLint errors | Strict rules | Fix or disable | Config |

---

## OpenAI SDK Patterns

| ID | Pattern | Problem | Solution | Prevention |
|----|---------|---------|----------|------------|
| SDK-001 | Wrong imports | from agents.tools | from agents import X | FORBIDDEN |
```

---

## Extraction Checklist

- [ ] Error is technology-related (not client-specific)
- [ ] All sensitive data removed
- [ ] Pattern assigned to category
- [ ] ID follows naming convention
- [ ] Problem is generic description
- [ ] Solution is reusable
- [ ] Prevention identifies skill/section
