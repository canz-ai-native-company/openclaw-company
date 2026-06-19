# Definition of Done

Quality gate enforcement that validates task completion criteria before marking work as done.

## Skill Classification

| Attribute | Value |
|-----------|-------|
| **Type** | Execution |
| **Layer** | L3 (Reusable Component) |
| **Trigger** | AUTO - runs after every significant task |
| **Domain** | Quality Assurance / Development Workflow |

---

## Execution Persona

You are a Definition of Done enforcement orchestrator.

For each completed task:
1. **DETECT** - Identify task type (frontend, backend, fullstack, docs-only)
2. **SELECT** - Choose appropriate DoD checklist for task type
3. **EXECUTE** - Run automated checks (lint, typecheck, tests, build)
4. **VALIDATE** - Verify manual criteria (UX states, security, docs)
5. **REPORT** - Generate pass/fail status with specific failures
6. **DECIDE** - Block completion if critical gates fail, or approve

Continue validation until all gates pass or blockers are escalated to user.

---

## Quality Gates

| Gate | Checks | Priority |
|------|--------|----------|
| **Code Quality** | Lint, TypeCheck, Format | Critical |
| **Testing** | Unit, Integration, E2E | Critical |
| **Security** | No secrets, No vulnerabilities | Critical |
| **UX** | Error states, Loading states, Empty states | High |
| **Docs** | README updated, API docs | Medium |
| **Build** | Production build passes | Critical |

---

## Decision Questions

### Context Analysis Questions

1. **What type of task was completed?**
   - Frontend-only (UI components, styling)
   - Backend-only (API, database, services)
   - Fullstack (both frontend and backend)
   - Documentation-only (no code changes)
   - Infrastructure (CI/CD, deployment)

2. **What is the project's tech stack?**
   - Package manager (npm, yarn, pnpm)
   - Linter (ESLint, Biome)
   - Type system (TypeScript, Flow, none)
   - Test framework (Jest, Vitest, Playwright)

3. **Are there existing check scripts in package.json?**
   - `lint` / `eslint` command available?
   - `typecheck` / `tsc` command available?
   - `test` / `test:unit` / `test:e2e` commands?
   - `build` command available?

### Convergence Questions

4. **Do ALL critical gates pass?**
   - ESLint: 0 errors, 0 warnings?
   - TypeScript: 0 compile errors?
   - Tests: All passing?
   - Build: Exits with code 0?

5. **Are all applicable manual checks verified?**
   - Loading states handled (if UI changed)?
   - Error states handled (if UI changed)?
   - No hardcoded secrets (if auth/config changed)?

6. **Is documentation updated to reflect changes?**
   - README updated if public API changed?
   - CHANGELOG entry added?
   - CLAUDE.md updated if architecture changed?

### Safety Questions

7. **What checks should NEVER be skipped?**
   - Security: Never skip secret detection
   - Build: Never skip production build verification
   - Types: Never skip TypeScript compilation

8. **What constitutes a blocking failure?**
   - Any security vulnerability
   - Any failing test
   - TypeScript compilation errors
   - ESLint errors (warnings may pass)

---

## Principles

### 1. Fail Fast, Fail Loud

**Constraint**: Stop execution immediately on critical failures.

**Reason**: Cascading failures waste time and obscure root cause. A failed lint check makes test results meaningless.

**Application**: Run checks in dependency order (format → lint → typecheck → test → build). Exit on first critical failure with clear error message.

### 2. Automated Before Manual

**Constraint**: Run all automatable checks before requesting manual verification.

**Reason**: Human attention is expensive. Automated checks catch 80% of issues instantly.

**Application**: Execute `lint`, `typecheck`, `test`, `build` scripts first. Only prompt for UX/security review if automated checks pass.

### 3. Context-Appropriate Validation

**Constraint**: Apply only relevant checks for the task type.

**Reason**: Running E2E tests for a README change wastes resources and time.

**Application**: Detect changed files → Map to task type → Select appropriate DoD template. Documentation-only changes skip code quality gates.

### 4. No Silent Failures

**Constraint**: Every check must produce visible pass/fail output.

**Reason**: Silent failures create false confidence. A skipped check looks like a passed check.

**Application**: Log each gate with explicit status: `[PASS]`, `[FAIL]`, `[SKIP: reason]`. Never suppress error output.

### 5. Escalate, Don't Block Forever

**Constraint**: Maximum 2 retry attempts before escalating to user.

**Reason**: Some failures require human judgment. Infinite retries waste time.

**Application**: On persistent failure, present clear options: fix suggestion, skip with justification, or abort task.

---

## Execution Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    TASK COMPLETED                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. DETECT TASK TYPE                                         │
│    - Analyze changed files                                  │
│    - Classify: frontend | backend | fullstack | docs        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. SELECT DOD TEMPLATE                                      │
│    - DOD_FRONTEND.md for UI changes                        │
│    - DOD_BACKEND.md for API/service changes                │
│    - DOD_FULLSTACK.md for mixed changes                    │
│    - DOD_CHECKLIST.md for general/docs                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. EXECUTE AUTOMATED CHECKS (in order)                      │
│    a. Format check (prettier --check)                       │
│    b. Lint check (eslint)                                   │
│    c. Type check (tsc --noEmit)                            │
│    d. Unit tests (npm test)                                │
│    e. Build (npm run build)                                │
│                                                             │
│    [STOP on first CRITICAL failure]                        │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    │               │
                 PASS            FAIL
                    │               │
                    ▼               ▼
┌───────────────────────┐  ┌───────────────────────┐
│ 4. MANUAL VALIDATION  │  │ REPORT FAILURE        │
│    - UX states        │  │ - Show error output   │
│    - Security review  │  │ - Suggest fix         │
│    - Docs check       │  │ - Offer retry/skip    │
└───────────────────────┘  └───────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. GENERATE REPORT                                          │
│    ┌──────────────────────────────────────────────────┐    │
│    │ ## Definition of Done Report                      │    │
│    │                                                   │    │
│    │ ### Code Quality                                  │    │
│    │ - [PASS] ESLint: 0 errors, 0 warnings            │    │
│    │ - [PASS] TypeScript: compiled successfully       │    │
│    │ - [PASS] Prettier: all files formatted           │    │
│    │                                                   │    │
│    │ ### Testing                                       │    │
│    │ - [PASS] Unit tests: 42 passed                   │    │
│    │ - [SKIP] E2E: no UI changes                      │    │
│    │                                                   │    │
│    │ ### Security                                      │    │
│    │ - [PASS] No hardcoded secrets detected           │    │
│    │                                                   │    │
│    │ ### Result: APPROVED                             │    │
│    └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Templates

| Template | Purpose | Use When |
|----------|---------|----------|
| `references/DOD_CHECKLIST.md` | Full checklist | General tasks, unknown type |
| `references/DOD_FRONTEND.md` | Frontend specific | UI/component changes |
| `references/DOD_BACKEND.md` | Backend specific | API/service changes |
| `references/DOD_FULLSTACK.md` | Full stack | Mixed frontend+backend |

---

## Auto-Detection Rules

```
Changed files contain:
  *.tsx, *.jsx, *.css, *.scss  →  Frontend
  *.ts (in /api, /server)      →  Backend
  Both patterns                 →  Fullstack
  *.md only                     →  Documentation
  Dockerfile, *.yml (CI)        →  Infrastructure
```

---

## Quick Commands

```bash
# Run all checks in sequence
npm run lint && npm run typecheck && npm test && npm run build

# Individual checks
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm test              # Unit tests
npm run build         # Production build

# Format check
npx prettier --check .
```

---

## Failure Recovery

| Failure Type | Recovery Action |
|--------------|-----------------|
| Lint errors | Run `npm run lint -- --fix`, review changes |
| Type errors | Show error locations, suggest fixes |
| Test failures | Show failing tests, offer to run in watch mode |
| Build failure | Show build output, check for missing deps |
| Security issue | Block completion, require explicit fix |

---

## Output Format

Always produce a structured report:

```markdown
## Definition of Done Report

**Task**: [Task description]
**Type**: [Frontend | Backend | Fullstack | Docs]
**Date**: [Timestamp]

### Code Quality
- [STATUS] ESLint: [details]
- [STATUS] TypeScript: [details]
- [STATUS] Prettier: [details]

### Testing
- [STATUS] Unit tests: [count] passed, [count] failed
- [STATUS] Integration tests: [details]
- [STATUS] E2E tests: [details]

### Security
- [STATUS] Secret scan: [details]
- [STATUS] Dependency audit: [details]

### UX States (if applicable)
- [STATUS] Loading states: [details]
- [STATUS] Error states: [details]
- [STATUS] Empty states: [details]

### Documentation
- [STATUS] README: [updated | no changes needed]
- [STATUS] CHANGELOG: [updated | no changes needed]

---

**Result**: [APPROVED | BLOCKED]
**Blocking Issues**: [List if any]
```

---

## Reference Files

| File | Purpose |
|------|---------|
| `references/DOD_CHECKLIST.md` | Full comprehensive checklist |
| `references/DOD_FRONTEND.md` | Frontend-specific checks |
| `references/DOD_BACKEND.md` | Backend-specific checks |
| `references/DOD_FULLSTACK.md` | Fullstack checks |
