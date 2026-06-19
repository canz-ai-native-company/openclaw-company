# Severity Classification Guide

How to classify code review issues by severity level.

---

## Severity Levels Overview

| Level | Symbol | Action | Approval |
|-------|--------|--------|----------|
| **Critical** | Red | Must fix before merge | BLOCKS |
| **Warning** | Yellow | Should fix, can defer | Approve with comments |
| **Suggestion** | Green | Nice to have | Approve |

---

## Critical Issues (Must Fix)

### Definition

Issues that:
- Cause security vulnerabilities
- Lead to data loss or corruption
- Break existing functionality
- Cause crashes or unhandled errors
- Violate compliance requirements

### Examples

| Category | Issue | Why Critical |
|----------|-------|--------------|
| **Security** | SQL injection | Attacker can access/delete data |
| **Security** | Exposed credentials | Secrets in code get leaked |
| **Security** | XSS vulnerability | Attacker can execute code |
| **Security** | No auth check | Unauthorized access |
| **Error Handling** | Unhandled exception | App crashes |
| **Error Handling** | Silent failure | Data lost without notice |
| **Error Handling** | No error boundary | Whole UI crashes |
| **Data** | No validation | Corrupt data in database |
| **Data** | Race condition | Data inconsistency |
| **Data** | Missing transaction | Partial updates |
| **Breaking** | API contract broken | Clients break |
| **Breaking** | Removed required field | Backwards incompatible |

### Detection Patterns

```typescript
// CRITICAL: SQL injection
db.query(`SELECT * FROM users WHERE id = ${userId}`); // User input in query

// CRITICAL: Exposed secret
const apiKey = "sk-1234567890abcdef"; // Hardcoded secret

// CRITICAL: Unhandled async error
async function getData() {
  const data = await fetch(url); // No try-catch
  return data.json();
}

// CRITICAL: No null check on required data
function processUser(user) {
  return user.profile.name; // Will crash if profile is null
}
```

### Response Template

```markdown
### CRITICAL: [Issue Title]
**File:** `path/to/file.ts:42`
**Issue:** [Clear description]
**Why Critical:** [Security/Crash/Data loss reason]
**Impact:** [What could go wrong]
**Suggested Fix:**
\`\`\`typescript
// Fixed code here
\`\`\`
**Action:** MUST fix before merge
```

---

## Warning Issues (Should Fix)

### Definition

Issues that:
- Reduce code quality or maintainability
- May cause bugs in edge cases
- Violate best practices
- Create technical debt
- Impact performance significantly

### Examples

| Category | Issue | Why Warning |
|----------|-------|-------------|
| **Quality** | Code duplication | Maintenance burden |
| **Quality** | Long function (>50 lines) | Hard to understand |
| **Quality** | Deep nesting (>3 levels) | Complexity |
| **Quality** | Magic numbers | Unclear meaning |
| **Naming** | Poor variable names | Readability |
| **Naming** | Misleading names | Confusion |
| **Types** | Using `any` | Defeats type safety |
| **Types** | Missing return type | Unclear contract |
| **Types** | Type assertion `as` | Bypasses checking |
| **Performance** | N+1 query | Slow with data growth |
| **Performance** | Missing pagination | Memory issues |
| **Performance** | Unnecessary re-render | UI lag |
| **Testing** | No tests for new code | Risk of regression |
| **Testing** | Insufficient coverage | Hidden bugs |

### Detection Patterns

```typescript
// WARNING: Code duplication
function validateEmail(email) { /* same logic */ }
function checkEmail(email) { /* same logic */ }

// WARNING: Using any
function process(data: any) { // Loses type safety
  return data.value;
}

// WARNING: Poor naming
const d = new Date(); // What is d?
const temp = calculate(); // Temp what?

// WARNING: Missing error handling
const result = await api.call(); // What if it fails?
```

### Response Template

```markdown
### WARNING: [Issue Title]
**File:** `path/to/file.ts:42`
**Issue:** [Clear description]
**Why Warning:** [Quality/Performance/Maintainability reason]
**Suggested Fix:**
\`\`\`typescript
// Improved code here
\`\`\`
**Action:** Should fix, can defer with tech debt ticket
```

---

## Suggestion Issues (Nice to Have)

### Definition

Issues that:
- Are minor style preferences
- Could slightly improve readability
- Add nice-to-have documentation
- Are micro-optimizations
- Follow stricter conventions

### Examples

| Category | Issue | Why Suggestion |
|----------|-------|----------------|
| **Style** | Formatting inconsistency | Minor readability |
| **Style** | Import order | Convention |
| **Style** | Trailing comma | Preference |
| **Documentation** | Missing JSDoc | Good to have |
| **Documentation** | Could add comment | Helpful context |
| **Simplification** | Could use shorthand | Slightly cleaner |
| **Simplification** | Verbose syntax | Can simplify |
| **Testing** | Additional test case | Extra coverage |

### Detection Patterns

```typescript
// SUGGESTION: Could use object shorthand
const user = { name: name, email: email };
// Better: const user = { name, email };

// SUGGESTION: Could use template literal
const message = "Hello " + name + "!";
// Better: const message = `Hello ${name}!`;

// SUGGESTION: Missing JSDoc
function calculate(a, b) { // What does this do?
  return a * b + TAX_RATE;
}
```

### Response Template

```markdown
### SUGGESTION: [Issue Title]
**File:** `path/to/file.ts:42`
**Current:**
\`\`\`typescript
// Current code
\`\`\`
**Could be:**
\`\`\`typescript
// Suggested improvement
\`\`\`
**Reason:** [Brief explanation]
**Action:** Optional improvement
```

---

## Classification Decision Tree

```
Is there a security vulnerability?
├─ Yes → CRITICAL
└─ No ↓

Can this cause a crash or data loss?
├─ Yes → CRITICAL
└─ No ↓

Does this break existing functionality?
├─ Yes → CRITICAL
└─ No ↓

Does this violate best practices significantly?
├─ Yes → WARNING
└─ No ↓

Will this cause issues at scale?
├─ Yes → WARNING
└─ No ↓

Does this affect maintainability?
├─ Yes → WARNING
└─ No ↓

Is this a style or convention preference?
├─ Yes → SUGGESTION
└─ No → No issue
```

---

## Common Misclassifications

### Often Marked Critical but is Warning

| Issue | Why Actually Warning |
|-------|---------------------|
| Using `any` | Doesn't crash, reduces safety |
| Missing tests | Doesn't break current code |
| Poor naming | Readability, not correctness |

### Often Marked Warning but is Critical

| Issue | Why Actually Critical |
|-------|----------------------|
| Empty catch block | Hides errors, causes data loss |
| Missing null check | Will crash |
| No input validation | Security + data corruption |

### Often Marked Warning but is Suggestion

| Issue | Why Actually Suggestion |
|-------|------------------------|
| Could use newer syntax | Preference |
| Import order | Convention |
| Extra whitespace | Formatting |

---

## Severity Override Rules

### Always Critical (No Override)

- Security vulnerabilities
- Credential exposure
- Data loss potential
- Crash conditions

### Context-Dependent

| Issue | Critical If | Warning If |
|-------|-------------|------------|
| Missing validation | User input | Internal data |
| No error handling | Production code | Test code |
| Performance issue | High traffic path | Rare path |

### Team Standards

Document team-specific overrides:

```yaml
# Team severity overrides
overrides:
  - pattern: "console.log"
    default: WARNING
    override: CRITICAL
    reason: "No console.log in production code"

  - pattern: "TODO"
    default: WARNING
    override: SUGGESTION
    reason: "TODOs tracked in issues"
```
