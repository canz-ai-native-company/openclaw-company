# Impact Scoring Guide

How to accurately assess and score improvement suggestions.

---

## Scoring Dimensions

### Impact Score (1-3)

| Score | Level | Definition | Examples |
|-------|-------|------------|----------|
| 3 | High | Measurable significant improvement | 50%+ performance gain, security vulnerability fixed, critical bug prevented |
| 2 | Medium | Noticeable improvement | Better readability, minor performance gain, reduced complexity |
| 1 | Low | Nice to have | Formatting consistency, minor DX improvement, documentation |

### Effort Score (1-3)

| Score | Level | Time Estimate | Complexity |
|-------|-------|---------------|------------|
| 1 | Quick | < 5 minutes | Single file, few lines changed |
| 2 | Moderate | 5-30 minutes | Multiple files, some refactoring |
| 3 | Significant | 30+ minutes | Architectural change, extensive testing needed |

---

## Category Multipliers

Different categories have different inherent value:

| Category | Multiplier | Rationale |
|----------|------------|-----------|
| Security | 1.5x | Security issues can be catastrophic |
| Performance | 1.3x | User experience directly affected |
| Testing | 1.2x | Prevents future bugs, high ROI |
| Architecture | 1.2x | Long-term maintainability |
| Maintainability | 1.1x | Developer productivity |
| DX | 0.9x | Nice but not critical |
| Documentation | 0.8x | Important but lower urgency |

---

## Priority Formula

```
Priority Score = (Impact Score * Category Multiplier) / Effort Score
```

### Example Calculations

| Suggestion | Impact | Category | Effort | Calculation | Priority |
|------------|--------|----------|--------|-------------|----------|
| Add API caching | 3 | Performance (1.3x) | 1 | (3 * 1.3) / 1 | **3.9** |
| Fix SQL injection | 3 | Security (1.5x) | 1 | (3 * 1.5) / 1 | **4.5** |
| Add unit tests | 2 | Testing (1.2x) | 2 | (2 * 1.2) / 2 | **1.2** |
| Refactor large component | 2 | Architecture (1.2x) | 3 | (2 * 1.2) / 3 | **0.8** |
| Add JSDoc comments | 1 | Documentation (0.8x) | 1 | (1 * 0.8) / 1 | **0.8** |

**Result**: Suggest SQL injection fix, then API caching, then unit tests.

---

## Impact Assessment Guidelines

### How to Determine High Impact (Score: 3)

Ask these questions:
- Does it fix a **security vulnerability**?
- Does it provide **50%+ performance improvement**?
- Does it prevent **data loss or corruption**?
- Does it fix a **user-facing bug**?
- Does it significantly **reduce error rates**?

If YES to any: Impact = 3

### How to Determine Medium Impact (Score: 2)

Ask these questions:
- Does it **measurably improve** something (but < 50%)?
- Does it **reduce code complexity** significantly?
- Does it prevent **future bugs** (but not critical)?
- Does it **improve developer velocity**?

If YES to any: Impact = 2

### How to Determine Low Impact (Score: 1)

If neither high nor medium criteria met:
- Formatting/style improvements
- Minor documentation additions
- Cosmetic refactoring
- "Would be nice" changes

Impact = 1

---

## Effort Assessment Guidelines

### How to Determine Quick Effort (Score: 1)

- Change is in **1 file**
- Change is **< 20 lines**
- **No tests needed** to update
- **No dependencies** to consider
- Can be done in **< 5 minutes**

### How to Determine Moderate Effort (Score: 2)

- Change is in **2-5 files**
- Change is **20-100 lines**
- **Some tests** may need updates
- Might affect **1-2 other components**
- Takes **5-30 minutes**

### How to Determine Significant Effort (Score: 3)

- Change is in **6+ files**
- Change is **100+ lines**
- **Extensive testing** required
- **Architectural implications**
- Takes **30+ minutes**

---

## Contextual Adjustments

### Project Phase Adjustments

| Phase | Adjustment |
|-------|------------|
| Early development | Architecture suggestions +0.5 |
| Pre-launch | Security/Performance suggestions +0.5 |
| Production | Stability over features +0.5 |
| Maintenance | Quick wins preferred +0.5 |

### Team Size Adjustments

| Team Size | Adjustment |
|-----------|------------|
| Solo developer | Maintainability +0.3 |
| Small team (2-5) | Documentation +0.3 |
| Large team (6+) | Architecture/Standards +0.3 |

### Recent Activity Adjustments

| Activity | Adjustment |
|----------|------------|
| File recently modified | +0.5 (user already in context) |
| Part of current task | +0.5 (relevant to work) |
| Unrelated to current work | -0.5 (context switch cost) |

---

## Anti-Patterns: What NOT to Suggest

### Low Value Suggestions

| Pattern | Why to Skip |
|---------|-------------|
| Formatting only | Let Prettier handle it |
| Style without function | Personal preference |
| Premature optimization | No evidence of bottleneck |
| Over-engineering | YAGNI applies |

### Wrong Context

| Pattern | Why to Skip |
|---------|-------------|
| React patterns in Vue project | Wrong framework |
| Async patterns in sync-only code | Not applicable |
| Enterprise patterns in MVP | Overkill |
| Tests for prototype code | Premature |

---

## Scoring Examples

### Example 1: API Without Rate Limiting

```
Observation: Express API without rate limiting
Impact: 3 (DOS protection, security)
Category: Security (1.5x)
Effort: 1 (add middleware, ~10 lines)
Priority: (3 * 1.5) / 1 = 4.5 (HIGH)
SUGGEST: Yes
```

### Example 2: Console.log Cleanup

```
Observation: Debug console.logs in production code
Impact: 1 (cleanliness only)
Category: Maintainability (1.1x)
Effort: 1 (find and delete)
Priority: (1 * 1.1) / 1 = 1.1 (LOW)
SUGGEST: Only if no higher priority items
```

### Example 3: Massive Refactor

```
Observation: Monolith could be microservices
Impact: 3 (long-term scalability)
Category: Architecture (1.2x)
Effort: 3 (weeks of work)
Priority: (3 * 1.2) / 3 = 1.2 (LOW)
SUGGEST: No (effort too high for proactive suggestion)
```
