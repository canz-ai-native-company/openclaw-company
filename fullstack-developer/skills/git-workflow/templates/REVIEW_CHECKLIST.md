# Code Review Checklist

Use this checklist when reviewing pull requests to ensure thorough, consistent reviews.

---

## Quick Checklist

```markdown
### Correctness
- [ ] Code does what PR claims
- [ ] Edge cases handled
- [ ] Error handling appropriate

### Security
- [ ] No secrets committed
- [ ] Input validated
- [ ] No injection vulnerabilities

### Performance
- [ ] No obvious inefficiencies
- [ ] Database queries optimized
- [ ] No memory leaks

### Maintainability
- [ ] Code is readable
- [ ] Tests included
- [ ] No code smells

### Documentation
- [ ] Complex logic explained
- [ ] API changes documented
```

---

## Detailed Checklist

### 1. Correctness

**Does the code work as intended?**

| Check | Question |
|-------|----------|
| Functionality | Does it do what the PR description claims? |
| Edge Cases | What happens with null, empty, max values? |
| Error Paths | Are errors handled gracefully? |
| Regression | Could this break existing functionality? |
| Requirements | Does it meet acceptance criteria? |

**Red Flags**:
- No tests for new functionality
- Only happy path tested
- Catches exceptions without handling them
- Magic numbers without explanation

### 2. Security

**Is the code secure?**

| Check | Question |
|-------|----------|
| Secrets | Any API keys, passwords, tokens committed? |
| Input | Is user input validated and sanitized? |
| SQL | Parameterized queries used? |
| XSS | Output properly escaped? |
| Auth | Proper authorization checks in place? |
| CORS | Appropriate cross-origin policies? |
| Dependencies | Any known vulnerabilities? |

**Red Flags**:
- String concatenation in SQL queries
- `innerHTML` with user data
- Hardcoded credentials
- Missing authentication on endpoints
- Overly permissive CORS

### 3. Performance

**Is the code efficient?**

| Check | Question |
|-------|----------|
| Complexity | Appropriate algorithm complexity? |
| Database | N+1 queries? Missing indexes? |
| Memory | Large objects held unnecessarily? |
| Network | Excessive API calls? |
| Caching | Appropriate caching used? |
| Async | Blocking operations on main thread? |

**Red Flags**:
- Nested loops over large datasets
- Fetching all records when one needed
- Synchronous file I/O in request handlers
- Missing pagination

### 4. Maintainability

**Can others understand and modify this code?**

| Check | Question |
|-------|----------|
| Readability | Can you understand it in one read? |
| Naming | Do names convey intent? |
| Functions | Single responsibility? |
| DRY | Unnecessary duplication? |
| Complexity | Cyclomatic complexity reasonable? |
| Tests | Adequate test coverage? |

**Red Flags**:
- Functions > 50 lines
- > 3 levels of nesting
- Cryptic variable names (`x`, `temp`, `data`)
- Copy-pasted code blocks
- No tests for critical paths

### 5. Documentation

**Is the code properly documented?**

| Check | Question |
|-------|----------|
| Comments | Complex logic explained? |
| API Docs | Public interfaces documented? |
| README | Setup instructions updated? |
| Changelog | Notable changes recorded? |
| Types | Type annotations where helpful? |

**Red Flags**:
- Comments that say "what" not "why"
- Outdated comments
- Undocumented public APIs
- Missing type information in dynamic languages

---

## Review Flow

### Before Reviewing

1. **Read the PR description** - Understand the goal
2. **Check related issue** - Know the context
3. **Review the diff size** - Set aside appropriate time

### During Review

1. **First pass**: Overall structure and approach
2. **Second pass**: Line-by-line details
3. **Third pass**: Tests and edge cases

### Providing Feedback

#### Comment Types

| Prefix | Meaning | Action Required |
|--------|---------|-----------------|
| `[blocking]` | Must fix before merge | Yes |
| `[suggestion]` | Improvement idea | Optional |
| `[question]` | Need clarification | Response needed |
| `[nitpick]` | Minor style preference | Optional |
| `[praise]` | Good work callout | None |

#### Good Feedback Examples

```markdown
[blocking] This SQL query is vulnerable to injection.
Please use parameterized queries:
`db.query('SELECT * FROM users WHERE id = ?', [userId])`

[suggestion] Consider extracting this logic into a separate function
for reusability. Not blocking, but would improve clarity.

[question] What happens if `user` is null here? Should we add
a guard clause?

[nitpick] Prefer `const` over `let` since this value isn't reassigned.

[praise] Great test coverage here! The edge cases are well thought out.
```

#### Feedback to Avoid

```markdown
# Too vague
"This could be better"

# Too harsh
"This is wrong"

# Not actionable
"I don't like this approach"
```

---

## Review by PR Type

### Feature PR

Focus on:
- [ ] Does it meet requirements?
- [ ] Is the approach appropriate?
- [ ] Tests cover new functionality?
- [ ] Documentation updated?

### Bug Fix PR

Focus on:
- [ ] Does it fix the actual root cause?
- [ ] Regression test added?
- [ ] Could the fix introduce new bugs?

### Hotfix PR

Focus on:
- [ ] Is the fix minimal and focused?
- [ ] Does it address the immediate issue?
- [ ] Is rollback plan clear?
- Skip: Style nitpicks, minor improvements

### Refactor PR

Focus on:
- [ ] Behavior unchanged?
- [ ] Tests still pass?
- [ ] Is the code actually better?
- [ ] No scope creep?

---

## Approval Guidelines

### Approve When

- All blocking comments addressed
- Tests pass
- No security concerns
- Code is maintainable

### Request Changes When

- Security vulnerabilities present
- Tests missing for critical paths
- Breaking changes undocumented
- Significant bugs in logic

### Don't Block For

- Style preferences (unless egregious)
- Minor naming improvements
- Optional refactoring
- "I would have done it differently"

---

## Time Guidelines

| PR Size | Review Time | Approach |
|---------|-------------|----------|
| XS (< 50 lines) | 5-10 min | Quick review |
| S (50-200 lines) | 15-30 min | Standard review |
| M (200-500 lines) | 30-60 min | Thorough review |
| L (500+ lines) | 1+ hour | Consider splitting |

**Best Practice**: Review within 24 hours of request. Blocked PRs slow the whole team.
