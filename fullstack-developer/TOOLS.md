# TOOLS.md - Local Notes

Skills define _how_ tools work. This file stores setup-specific notes for this full-stack AI developer agent.

Keep this file practical and safe. Do not store secrets here.

## Purpose

Use this file for environment-specific details that help the agent work faster without leaking private infrastructure.

Examples:
- local project paths
- preferred dev commands
- workspace conventions
- deployment targets
- local tool aliases
- test commands
- MCP/server notes
- non-secret integration notes

## Current Agent Setup

- Agent role: Full-stack AI developer employee
- Primary work: websites, backends, APIs, AI agents, databases, automations, tests, security, deployment
- Development style: specs-driven, TDD-first, security-first, production-aware
- Before implementation: create or update project specs
- Before coding: load relevant skills, references, and templates
- After coding: run relevant tests/build/checks and report results

## Preferred Project Structure

Use this when creating new projects unless the existing repo has its own convention:

```text
projects/<project-name>/
├── specs/
│   ├── project-spec.md
│   ├── frontend-spec.md
│   ├── backend-spec.md
│   ├── agent-spec.md
│   └── acceptance-criteria.md
├── apps/
│   ├── web/
│   └── api/
├── packages/
├── docs/
├── tests/
├── .env.example
└── README.md
```

For existing projects:
- inspect existing structure first
- do not force this structure if the project already has a better convention
- place specs in `specs/` or `docs/specs/`

## Common Tech Preferences

### Frontend

- Next.js
- Tailwind CSS
- Framer Motion / Motion
- Clean component architecture
- Responsive-first layouts
- Accessibility and SEO basics by default

### Backend

- FastAPI / Python
- REST APIs unless another pattern is justified
- Pydantic validation
- Structured logging
- Health checks
- Rate limits where public endpoints exist

### Database

- PostgreSQL / Neon preferred
- Use migrations
- Define relationships, indexes, constraints, and soft-delete where needed
- Never store secrets or sensitive data in plaintext

### AI Agents

- OpenAI Agents SDK when appropriate
- Tool calls must have clear parameters, permission boundaries, errors, and safe defaults
- Use guardrails for prompt injection, data leakage, unsafe tool calls, and hidden instruction override
- Keep memory explicit and privacy-safe

## Local Safety Notes

Never store these in `TOOLS.md`:
- API keys
- tokens
- database URLs
- passwords
- private SSH keys
- client secrets
- production credentials
- personal sensitive data

Use `.env` for local secrets and `.env.example` for documented variables.

## Verification Commands

Use the commands that match the repo. Common examples:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pytest -q
ruff check .
mypy .
```

If a command cannot be run, explain why and provide the exact command the user should run.

## Output Handling

For long reports, audits, generated specs, or multi-file plans:
- save full content to a file
- reply with short summary + file path
- avoid dumping huge content inline

Preferred output locations:

```text
output/
projects/<project-name>/specs/
projects/<project-name>/docs/
projects/<project-name>/reports/
```

---

This file is the agent's setup cheat sheet. Keep it useful, short, and free of secrets.
