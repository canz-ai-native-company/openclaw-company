# Memory Workflow Guide

Detailed workflows for memory loading, error tracking, and profile updates.

---

## Workflow 1: Memory Loading (On Conversation Start)

```
START
  |
  v
[1. Check /workspace/group/ path]
  - Extract group name from path
  |
  v
[2. Load CLIENT_PROFILE.md]
  - Path: /workspace/group/CLIENT_PROFILE.md
  - If exists -> Parse preferences
  - If not -> Note: "New client"
  |
  v
[3. Load LESSONS_LEARNED.md]
  - Path: /workspace/group/LESSONS_LEARNED.md
  - If exists -> Parse lessons
  - If not -> Note: "No lessons yet"
  |
  v
[4. Load GLOBAL_LESSONS.md]
  - Path: /home/node/.claude/memory/GLOBAL_LESSONS.md
  - Parse all patterns
  |
  v
[5. Filter relevant lessons]
  - Match current task keywords
  - Return matching lessons only
  |
  v
END (Memory loaded, context available)
```

---

## Workflow 2: Error Tracking (On Failure)

```
START (Error Detected)
  |
  v
[1. Capture Error]
  - Error message
  - Stack trace
  - File/line if available
  - Command that failed
  |
  v
[2. Analyze Root Cause]
  - What triggered the error?
  - Is it code, config, or env?
  - Is it new or known pattern?
  |
  v
[3. Check GLOBAL_LESSONS.md]
  - Is this pattern already known?
  - If yes -> Apply known fix
  - If no -> Continue to log
  |
  v
[4. Fix the Error]
  - Apply fix
  - Verify fix works
  - Document what was done
  |
  v
[5. Log to LESSONS_LEARNED.md]
  - Error description
  - Root cause
  - Fix applied
  - Prevention strategy
  |
  v
[6. Check if New Pattern]
  - Is this generalizable?
  - Can other projects benefit?
  - If yes -> Add to GLOBAL_LESSONS
  |
  v
[7. Update Relevant Skill]
  - Add to FORBIDDEN section
  - Or add to Output Checklist
  - Or add to Constraints
  |
  v
END (Error logged, prevention added)
```

---

## Workflow 3: Client Profile Update

```
START (New Preference Learned)
  |
  v
[1. Detect New Preference]
  - User explicitly states preference
  - User corrects output style
  - User chooses specific option
  |
  v
[2. Categorize Preference]
  - Communication? (tone, language)
  - Technical? (framework, db)
  - Design? (colors, style)
  - Business? (industry, audience)
  |
  v
[3. Update CLIENT_PROFILE.md]
  - Add/update relevant section
  - Update "Last Updated" date
  |
  v
END (Profile updated)
```

---

## Memory File Paths

| Memory Level | Path | File |
|--------------|------|------|
| Global | /home/node/.claude/memory/ | GLOBAL_LESSONS.md |
| Group | /workspace/[group]/ | CLIENT_PROFILE.md |
| Group | /workspace/[group]/ | LESSONS_LEARNED.md |
| Project | /workspace/[group]/[project]/ | CLAUDE.md |

---

## Loading Priority

1. **Always Load**: GLOBAL_LESSONS.md (contains universal patterns)
2. **Load if Exists**: CLIENT_PROFILE.md (client preferences)
3. **Load if Exists**: LESSONS_LEARNED.md (group-specific lessons)
4. **Load if Exists**: CLAUDE.md (project-specific decisions)

---

## Keyword Matching for Filtering

| Task Keywords | Load Lessons Tagged |
|---------------|---------------------|
| nextjs, react, frontend | NX-*, CK-*, Frontend |
| fastapi, backend, api | API-*, Backend |
| database, postgres, schema | DB-*, Database |
| docker, deployment | DK-*, Deploy |
| agent, openai, sdk | SDK-*, Agent |
