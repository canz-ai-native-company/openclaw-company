# Skill & MCP Server Phase Mapping

Maps every skill and MCP server to the 7-phase implementation workflow.

---

## The 7 Phases

| Phase | Name | Purpose | Gate |
|-------|------|---------|------|
| **Phase 1** | Design | Design Document | User approval |
| **Phase 2** | Setup | Project scaffolding | Build passes |
| **Phase 3** | Tests First | Write tests (TDD) | Tests fail (no impl) |
| **Phase 4** | Build | Implementation | Tests pass |
| **Phase 5** | Review | Quality assurance | All checks pass |
| **Phase 6** | Deploy | Production release | Health check passes |
| **Phase 7** | Complete | Definition of Done | All items checked |

---

## Phase 1: Design

**Goal**: Produce approved Design Document before any code.

### Skills

| Skill | Task |
|-------|------|
| **think-before-act** | Run 10-step Design Thinking Protocol |
| **interview** | Clarify ambiguous requirements |
| **system-design-V1** | Architecture patterns |
| **database-design-V1** | Schema design |
| **api-design-V1** | API contract specification |
| **file-change-planner** | File structure planning |
| **requirements-gathering** | Agent project requirements |
| **agent-builder-V5** | Agent architecture (if agent project) |

### MCP Servers

| Server | Task |
|--------|------|
| **context7** | Query docs for all tech stack components |

### Output

- Complete 14-section Design Document
- User approval to proceed

---

## Phase 2: Setup

**Goal**: Scaffold project, configure tools, create branch.

### Skills

| Skill | Task |
|-------|------|
| **git-workflow** | Create feature branch, set commit conventions |
| **file-change-planner** | Verify file structure before creating |
| **env-secrets-manager** | Create .env.example, configure .gitignore |
| **nextjs-prisma** | Setup Prisma schema (if Next.js + DB) |

### MCP Servers

| Server | Task |
|--------|------|
| **github** | Create branch, initialize repository |
| **neon-postgres** | Provision database (if Neon) |
| **context7** | Query setup/config docs if needed |

### Output

- Repository with branch created
- Project initialized with dependencies
- .env.example configured
- Database schema created
- CI/CD pipeline configured

---

## Phase 3: Tests First (TDD)

**Goal**: Write all tests BEFORE implementation code.

### Skills

| Skill | Task |
|-------|------|
| **pytest-ai-agents** | Write Python/agent tests |
| (jest/vitest patterns) | Write JavaScript/TypeScript tests |

### MCP Servers

| Server | Task |
|--------|------|
| **context7** | Query testing library docs |

### Output

- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical flows
- All tests FAILING (no implementation yet)

---

## Phase 4: Build

**Goal**: Implement features until all tests pass.

### Skills

| Skill | Task |
|-------|------|
| **nextjs-chatkit-ui-V4** | Build Next.js website |
| **chatkit-fastapi-backend** | Build FastAPI backend |
| **chatkit-server** | Build chat server |
| **code-generation** | Generate agent code |
| **nextjs-animations** | Add animations |
| **nextjs-prisma** | Database operations |
| **fetch-library-docs** | Get correct API patterns |

### MCP Servers

| Server | Task |
|--------|------|
| **context7** | Lookup API patterns during implementation |
| **nanobanana** | Generate images (if needed) |
| **neon-postgres** | Database operations |

### Output

- All features implemented
- All tests passing
- Code follows patterns from Design Document

---

## Phase 5: Review

**Goal**: Quality assurance — code review, security, optimization.

### Skills

| Skill | Task |
|-------|------|
| **code-reviewer-V1** | Code quality review |
| **security-auditor-V1** | Security vulnerability scan |
| **simplify** | Code optimization |
| **env-secrets-manager** | Verify no secrets in code |

### MCP Servers

| Server | Task |
|--------|------|
| **github** | Create PR for review |

### Output

- Code review passed
- Security scan clean
- No hardcoded secrets
- PR created and ready

---

## Phase 6: Deploy

**Goal**: Production deployment with monitoring.

### Skills

| Skill | Task |
|-------|------|
| **ci-cd-pipeline** | Configure GitHub Actions |
| **deployment-engineer** | Deploy to platform |
| **env-secrets-manager** | Configure production secrets |
| **git-workflow** | Merge PR to main |

### MCP Servers

| Server | Task |
|--------|------|
| **github** | Merge PR, manage releases |

### Output

- CI/CD pipeline running
- Deployed to production
- Health check passing
- Production secrets configured

---

## Phase 7: Complete

**Goal**: Verify Definition of Done, close project.

### Skills

| Skill | Task |
|-------|------|
| **definition-of-done** | Run completion checklist |
| **git-workflow** | Clean up branches |

### MCP Servers

| Server | Task |
|--------|------|
| **github** | Close issues, update labels |

### Output

- All DoD items checked
- Branches cleaned up
- Issues closed
- Project complete

---

## MCP Server Summary

| Server | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 | Phase 6 | Phase 7 |
|--------|---------|---------|---------|---------|---------|---------|---------|
| **context7** | Tech docs | Setup docs | Test docs | API patterns | - | - | - |
| **github** | - | Create branch | - | - | Create PR | Merge PR | Close issues |
| **neon-postgres** | - | Provision DB | - | DB ops | - | - | - |
| **nanobanana** | - | - | - | Images | - | - | - |

---

## Phase Flow Diagram

```
Phase 1: DESIGN ──────────────────────────────────────► User Approval
    │                                                        │
    ▼                                                        ▼
Phase 2: SETUP ──► Phase 3: TESTS ──► Phase 4: BUILD ──► Phase 5: REVIEW
                       (TDD)              (Implement)        │
                                                             ▼
                                          Phase 6: DEPLOY ──► Phase 7: DONE
```

### Gate Requirements

| Gate | Requirement | Blocks |
|------|-------------|--------|
| Phase 1 → 2 | User approves Design Document | All implementation |
| Phase 2 → 3 | Project scaffolded, deps installed | Test writing |
| Phase 3 → 4 | Tests written and failing | Implementation |
| Phase 4 → 5 | All tests passing | Review |
| Phase 5 → 6 | Code review + security scan pass | Deployment |
| Phase 6 → 7 | Health check passes | Completion |
