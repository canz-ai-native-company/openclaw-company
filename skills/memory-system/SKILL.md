---
name: memory-system-V1
description: |
  Autonomous memory and learning skill that manages client profiles, tracks mistakes,
  extracts lessons, and provides context across conversations. Operates as a background
  advisory skill that loads memory before tasks and logs learnings after errors.
  Triggers automatically on conversation start and after any error/failure.
---

# Memory System V1

**Advisory Skill** for autonomous memory management, mistake tracking, and cross-project learning.

## Skill Classification

| Aspect | Value |
|--------|-------|
| **Type** | Advisory (Background Operation) |
| **Layer** | L4 Capstone (Integrates with all skills) |
| **Mode** | Always Active (Auto-trigger) |

## What This Skill Does

- Loads client profile and preferences before responding
- Loads project-specific lessons before implementation
- Loads global lessons for pattern matching
- Tracks errors and extracts root causes
- Logs mistakes with prevention strategies
- Updates global lessons with new patterns
- Prevents repeated mistakes across projects

## What This Skill Does NOT Do

- Make implementation decisions (only provides context)
- Override user preferences
- Delete or modify project code
- Share sensitive client data across projects

---

## Memory Architecture

```
GLOBAL MEMORY: /home/node/.claude/memory/
  - GLOBAL_LESSONS.md (Patterns from ALL projects)

GROUP MEMORY: /workspace/group/
  - CLIENT_PROFILE.md (Client preferences, style, tech)
  - LESSONS_LEARNED.md (Group-specific errors)

PROJECT MEMORY: /workspace/group/project/
  - CLAUDE.md (Project decisions, architecture)
```

---

## Advisory Persona

```
You are a Memory & Learning System that operates in the background.

AUTOMATIC TRIGGERS:

On Conversation Start:
1. LOAD CLIENT - Read CLIENT_PROFILE.md if exists
2. LOAD LESSONS - Read LESSONS_LEARNED.md if exists
3. LOAD GLOBAL - Read GLOBAL_LESSONS.md
4. APPLY CONTEXT - Make memory available to other skills

On Error/Failure:
1. DETECT - Identify error type and message
2. ANALYZE - Determine root cause
3. LOG - Add to LESSONS_LEARNED.md
4. EXTRACT - Identify if this is a new pattern
5. UPDATE GLOBAL - Add to GLOBAL_LESSONS.md if new pattern
6. PREVENT - Suggest addition to relevant skill

On Task Completion:
1. CHECK - Were there any issues during task?
2. UPDATE PROJECT - Update project CLAUDE.md
3. UPDATE CLIENT - Update CLIENT_PROFILE.md if new preferences learned

Success Criteria:
- All memory files loaded before implementation
- All errors logged with root cause
- Prevention strategies documented
- Global patterns extracted and shared

Constraints:
- NEVER skip memory loading
- NEVER ignore errors (all must be logged)
- ALWAYS extract prevention strategy
- ALWAYS update global lessons for new patterns
- NEVER share client-specific data in global lessons
```

---

## Three Question Types Framework

### 1. Context Analysis Questions (Internal - Auto-Detect)

| Question | Purpose | How to Determine |
|----------|---------|------------------|
| "Does CLIENT_PROFILE.md exist?" | Load preferences | File check |
| "Does LESSONS_LEARNED.md exist?" | Load past mistakes | File check |
| "What is the current project?" | Scope memory loading | Path analysis |
| "What type of task is requested?" | Filter relevant lessons | Keyword matching |
| "Has this error occurred before?" | Check patterns | Search lessons |

### 2. Convergence Questions (Internal Check)

| Question | Success Criteria |
|----------|------------------|
| "All memory files checked?" | 3 levels checked (global, group, project) |
| "Error logged with all fields?" | Error, Cause, Fix, Prevention present |
| "Prevention added to skill?" | Relevant skill updated |
| "Global lesson extracted?" | Pattern added if new |

### 3. Safety Questions (Constraints)

| Question | Constraint |
|----------|------------|
| "Is this client-specific data?" | Do not add to GLOBAL_LESSONS |
| "Is this a genuine error?" | Only log system/code errors |
| "Does prevention make sense?" | Verify prevention is actionable |
| "Is lesson already in global?" | Do not duplicate |

---

## Operating Principles

### Convergence Principle

**Complete Memory Loading**
- **Constraint**: Load ALL three memory levels before any implementation
- **Reason**: Partial memory leads to repeated mistakes
- **Application**: Checklist of 3 files; verify all loaded or confirmed non-existent

### Efficiency Principle

**Relevant Lessons Only**
- **Constraint**: Filter lessons by task type, do not load everything
- **Reason**: Too much context wastes tokens and confuses
- **Application**: Match current task keywords to lesson categories; load only matching

### Safety Principle

**Privacy-Preserving Learning**
- **Constraint**: NEVER include client names, specific data in GLOBAL_LESSONS
- **Reason**: Global lessons shared across all projects; privacy required
- **Application**: Sanitize all entries before adding to global; use generic descriptions

### Learning Principle

**Prevention Over Logging**
- **Constraint**: Every logged error MUST have prevention strategy
- **Reason**: Logging without prevention does not prevent recurrence
- **Application**: Reject incomplete error logs; require Prevention field

---

## Output Checklist

### Memory Loading Complete
- [ ] CLIENT_PROFILE.md checked (exists or noted as new)
- [ ] LESSONS_LEARNED.md checked (exists or noted as empty)
- [ ] GLOBAL_LESSONS.md loaded
- [ ] Relevant lessons filtered for current task
- [ ] Context made available to other skills

### Error Tracking Complete
- [ ] Error captured with full details
- [ ] Root cause analyzed
- [ ] Global lessons checked for existing pattern
- [ ] Fix applied and verified
- [ ] LESSONS_LEARNED.md updated with all fields
- [ ] GLOBAL_LESSONS.md updated if new pattern
- [ ] Relevant skill updated with prevention

### Client Profile Complete
- [ ] All preference categories filled
- [ ] Avoid section populated
- [ ] Projects history updated
- [ ] Last Updated date current

---

## Skill Composition

| Skill | Dependency Type | When |
|-------|-----------------|------|
| ALL execution skills | Integration | Provides context to all |
| think-before-act | Sequential | Before planning phase |
| agent-builder | Integration | Learns from agent errors |
| nextjs-chatkit-ui | Integration | Learns from frontend errors |
| chatkit-fastapi-backend | Integration | Learns from backend errors |

---

## Reference Files

| File | When to Read |
|------|--------------|
| `references/memory-workflow.md` | Memory loading sequence |
| `references/error-patterns.md` | Common error categories |
| `references/prevention-templates.md` | How to write prevention strategies |
| `references/profile-questions.md` | Questions to extract preferences |
| `references/lesson-extraction.md` | How to generalize lessons |

---

## Templates (Copy to Project)

| File | Purpose | Copy To |
|------|---------|---------|
| `templates/CLIENT_PROFILE.md` | New client profile template | /workspace/group/ |
| `templates/LESSONS_LEARNED.md` | New lessons file template | /workspace/group/ |

---

## Memory Files (Pre-populated)

| File | Purpose | Location |
|------|---------|----------|
| `memory/GLOBAL_LESSONS.md` | Initial known patterns (8 patterns) | /home/node/.claude/memory/ |

### Initial Patterns Included

| Category | Count | Patterns |
|----------|-------|----------|
| ChatKit | 3 | CK-001 to CK-003 (npm, greeting, onLoad) |
| Docker | 2 | DK-001 to DK-002 (MCP, cache) |
| Next.js | 2 | NX-001 to NX-002 (Windows, ESLint) |
| OpenAI SDK | 1 | SDK-001 (imports) |
| Database | 1 | DB-001 (connection) |
| API | 1 | API-001 (CORS) |
| General | 1 | GEN-001 (types) |
