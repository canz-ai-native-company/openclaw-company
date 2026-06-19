# Available Skills Index

Complete index of all skills with when to use each, mapped to the 7-phase workflow.

---

## Skills by Category

### Design & Planning Skills

| Skill | Purpose | Primary Phase | Trigger |
|-------|---------|---------------|---------|
| **think-before-act** | Design Document gate | Phase 1 | New feature / architecture |
| **file-change-planner** | Map all file changes | Phase 1, 2 | Before any implementation |
| **interview** | Discovery conversation | Phase 1 | Unclear requirements |

### Architecture Skills

| Skill | Purpose | Primary Phase | Trigger |
|-------|---------|---------------|---------|
| **system-design-V1** | System architecture | Phase 1 | "system design", "architecture" |
| **database-design-V1** | Schema design | Phase 1 | "database", "schema", "tables" |
| **api-design-V1** | API specification | Phase 1 | "API design", "endpoints" |

### Code Generation Skills

| Skill | Purpose | Primary Phase | Trigger |
|-------|---------|---------------|---------|
| **code-generation** | Generate agent code | Phase 4 | After architecture confirmed |
| **nextjs-chatkit-ui-V4** | Next.js website gen | Phase 4 | "nextjs", "website" |
| **chatkit-react** | Chat widget | Phase 4 | "chat widget" |
| **chatkit-fastapi-backend** | FastAPI backend | Phase 4 | "fastapi", "backend" |
| **chatkit-server** | Chat server | Phase 4 | "chat server" |

### Quality & Review Skills

| Skill | Purpose | Primary Phase | Trigger |
|-------|---------|---------------|---------|
| **code-reviewer-V1** | Code quality review | Phase 5 | "review code", "code quality" |
| **security-auditor-V1** | Security scanning | Phase 5 | "security audit", "vulnerability" |
| **simplify** | Code optimization | Phase 5 | After code written |
| **skill-validator** | Skill quality check | Phase 5 | Reviewing skills |

### Testing Skills

| Skill | Purpose | Primary Phase | Trigger |
|-------|---------|---------------|---------|
| **pytest-ai-agents** | Python agent testing | Phase 3 | pytest, async tests, mocking |

### DevOps Skills

| Skill | Purpose | Primary Phase | Trigger |
|-------|---------|---------------|---------|
| **git-workflow** | Branch/commit/PR | Phase 2, 5 | "branch", "commit", "PR" |
| **ci-cd-pipeline** | CI/CD setup | Phase 6 | "pipeline", "CI/CD" |
| **deployment-engineer** | Deployment config | Phase 6 | "deploy", "production" |
| **env-secrets-manager** | Environment vars | Phase 2, 6 | ".env", "secrets" |
| **definition-of-done** | Completion checklist | Phase 7 | "done", "checklist" |

### Agent Building Skills

| Skill | Purpose | Primary Phase | Trigger |
|-------|---------|---------------|---------|
| **requirements-gathering** | Client requirements | Phase 1 | "build agent", "need agent" |
| **agent-builder-V5** | Agent architecture | Phase 1 | "AI agent", "agent design" |
| **client-communication** | Client handling | Any | WhatsApp messages |

### Documentation Skills

| Skill | Purpose | Primary Phase | Trigger |
|-------|---------|---------------|---------|
| **doc-coauthoring** | Co-write docs | Any | "write docs", "documentation" |
| **internal-comms** | Internal communications | Any | "status report", "update" |

### Utility Skills

| Skill | Purpose | Primary Phase | Trigger |
|-------|---------|---------------|---------|
| **skill-creator-max** | Create advanced skills | Any | "create skill" |
| **skill-creator-pro** | Create standard skills | Any | "create skill" |
| **fetch-library-docs** | Get library docs | Phase 1, 4 | Using external library |
| **context7-docs** | Context7 doc fetch | Phase 1, 4 | Need official docs |
| **browsing-with-playwright** | Web automation | Any | "browse", "scrape" |

### Document Generation Skills

| Skill | Purpose | Primary Phase | Trigger |
|-------|---------|---------------|---------|
| **pdf** | PDF manipulation | Any | PDF processing |
| **docx** | Word documents | Any | Document creation |
| **pptx** | Presentations | Any | Slide creation |
| **xlsx** | Spreadsheets | Any | Data/spreadsheet work |

### Media Skills

| Skill | Purpose | Primary Phase | Trigger |
|-------|---------|---------------|---------|
| **nanobanana-images** | AI image generation | Phase 4 | "generate image" |
| **remotion** | Video production | Phase 4 | "create video" |
| **nextjs-animations** | UI animations | Phase 4 | "animations" |
| **theme-factory** | Styling/theming | Phase 4 | "theme", "styling" |

### Advisory Skills

| Skill | Purpose | Primary Phase | Trigger |
|-------|---------|---------------|---------|
| **proactive-suggester-V1** | Improvement suggestions | Any | Auto-triggered |
| **memory-system-V1** | Context management | Any | Auto-triggered |

---

## Skill Selection by Project Type

### Fullstack Web App

| Phase | Skills |
|-------|--------|
| Phase 1 | think-before-act, database-design, api-design, system-design |
| Phase 2 | git-workflow, file-change-planner, env-secrets-manager |
| Phase 3 | pytest-ai-agents (or jest equivalent in skill) |
| Phase 4 | nextjs-chatkit-ui-V4, nextjs-prisma, nextjs-animations |
| Phase 5 | code-reviewer, security-auditor, simplify |
| Phase 6 | ci-cd-pipeline, deployment-engineer |
| Phase 7 | definition-of-done |

### Backend API

| Phase | Skills |
|-------|--------|
| Phase 1 | think-before-act, database-design, api-design |
| Phase 2 | git-workflow, file-change-planner, env-secrets-manager |
| Phase 3 | pytest-ai-agents |
| Phase 4 | chatkit-fastapi-backend / code-generation |
| Phase 5 | code-reviewer, security-auditor |
| Phase 6 | ci-cd-pipeline, deployment-engineer |
| Phase 7 | definition-of-done |

### AI Agent

| Phase | Skills |
|-------|--------|
| Phase 1 | think-before-act, requirements-gathering, agent-builder-V5 |
| Phase 2 | git-workflow, file-change-planner, env-secrets-manager |
| Phase 3 | pytest-ai-agents |
| Phase 4 | code-generation, chatkit-server |
| Phase 5 | code-reviewer, security-auditor |
| Phase 6 | ci-cd-pipeline, deployment-engineer |
| Phase 7 | definition-of-done |

### Frontend Only

| Phase | Skills |
|-------|--------|
| Phase 1 | think-before-act, system-design (simplified) |
| Phase 2 | git-workflow, file-change-planner |
| Phase 3 | Testing (jest/vitest) |
| Phase 4 | nextjs-chatkit-ui-V4, nextjs-animations, theme-factory |
| Phase 5 | code-reviewer, simplify |
| Phase 6 | ci-cd-pipeline, deployment-engineer |
| Phase 7 | definition-of-done |
