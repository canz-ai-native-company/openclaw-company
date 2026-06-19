# Prevention Templates Guide

How to write effective prevention strategies.

---

## Prevention Strategy Structure

Every prevention strategy MUST have:

1. **What to Check** - What should be verified
2. **When to Check** - At what point in workflow
3. **How to Prevent** - Specific action to take
4. **Where to Add** - Which skill/file to update

---

## Prevention Template

```markdown
**Prevention Strategy:**
1. [Specific check to perform]
2. [When in workflow to check]
3. [Action to prevent recurrence]

**Skill Updated:** [skill-name]
**Section Updated:** [FORBIDDEN/Checklist/Constraints]
```

---

## Example Preventions

### Example 1: Import Error

```markdown
**Error:** Cannot import from agents.tools
**Root Cause:** Wrong import path in OpenAI Agents SDK

**Prevention Strategy:**
1. Check all imports use "from agents import X" not "from agents.tools"
2. Verify at code generation time
3. Add to FORBIDDEN imports list

**Skill Updated:** agent-builder
**Section Updated:** FORBIDDEN
```

### Example 2: Build Error

```markdown
**Error:** Turbopack path error on Windows
**Root Cause:** Missing turbopack.root in next.config.ts

**Prevention Strategy:**
1. Check next.config.ts has turbopack.root setting
2. Verify before running build
3. Add to next.config.ts template

**Skill Updated:** nextjs-chatkit-ui
**Section Updated:** Templates/next.config.ts
```

### Example 3: Runtime Error

```markdown
**Error:** ChatKit widget not showing
**Root Cause:** npm package requires domainKey

**Prevention Strategy:**
1. Never use npm install for @openai/chatkit-react
2. Check at project setup time
3. Use CDN approach only

**Skill Updated:** nextjs-chatkit-ui
**Section Updated:** FORBIDDEN
```

---

## Prevention Categories

### FORBIDDEN Additions

Add to skill FORBIDDEN section when:
- A specific approach should NEVER be used
- Alternative approach always works
- Error is severe (breaks functionality)

```markdown
## FORBIDDEN (Add these)

- NEVER use [specific approach]
- ALWAYS use [correct approach] instead
```

### Checklist Additions

Add to Output Checklist when:
- Something needs verification before completion
- Missing step causes errors
- Can be checked mechanically

```markdown
## Output Checklist (Add these)

- [ ] [New check item]
```

### Constraint Additions

Add to Constraints when:
- Behavioral rule needed
- Applies to multiple scenarios
- Guides decision-making

```markdown
## Constraints (Add these)

- ALWAYS [do this thing]
- NEVER [do that thing]
```

---

## Prevention Quality Checklist

- [ ] Prevention is specific (not vague)
- [ ] Prevention is actionable (can be done)
- [ ] Prevention has clear timing (when to check)
- [ ] Prevention identifies skill to update
- [ ] Prevention identifies section to update
