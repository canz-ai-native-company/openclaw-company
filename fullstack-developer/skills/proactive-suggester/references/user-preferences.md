# User Preferences Tracking

Guidelines for tracking and respecting user preferences for suggestions.

---

## Session Memory Structure

Track these during each session to avoid repeating suggestions:

```typescript
interface SessionMemory {
  // Suggestions already made
  suggestedItems: {
    category: string;      // "performance", "security", etc.
    pattern: string;       // "caching", "validation", etc.
    file: string;          // File suggestion was about
    timestamp: Date;
  }[];

  // User responses
  accepted: string[];      // Patterns user said "yes" to
  rejected: string[];      // Patterns user said "no" to
  ignored: string[];       // Patterns user didn't respond to (2+ times = soft reject)

  // User preferences expressed
  preferences: {
    focusAreas: string[];  // "I care about performance"
    avoidAreas: string[];  // "Don't suggest testing stuff"
    effort_tolerance: "quick" | "moderate" | "any";
  };
}
```

---

## Preference Detection

### Explicit Preferences

Look for direct statements:

| User Says | Preference |
|-----------|------------|
| "Focus on performance" | `focusAreas: ["performance"]` |
| "I don't need tests right now" | `avoidAreas: ["testing"]` |
| "Only quick fixes please" | `effort_tolerance: "quick"` |
| "Security is top priority" | `focusAreas: ["security"]` (boost multiplier) |

### Implicit Preferences

Infer from behavior:

| User Behavior | Inferred Preference |
|--------------|---------------------|
| Always accepts caching suggestions | +0.5 to performance suggestions |
| Never responds to doc suggestions | -0.5 to documentation suggestions |
| Quickly implements quick wins | `effort_tolerance: "quick"` |
| Engages with complex suggestions | `effort_tolerance: "any"` |

---

## Rejection Handling

### Hard Rejections

User explicitly says "no":
- "No thanks"
- "I don't want to do that"
- "Skip this"
- "Not now"

**Action**: Add to `rejected` list. Never suggest same pattern for same file again in session.

### Soft Rejections

User ignores suggestion:
- No response after 2 interactions
- Moved on without acknowledging

**Action**: After 2 ignores of same pattern type, reduce priority by 50%.

### Conditional Rejections

User says "not now but later":
- "Maybe later"
- "I'll think about it"
- "Good idea but not right now"

**Action**: Don't repeat in next 3 interactions. Can re-suggest if still relevant.

---

## Preference Priority Rules

### Rule 1: Explicit Over Inferred

```
User says "focus on security" > user often accepts security suggestions
```

### Rule 2: Recent Over Historical

```
Rejection 5 minutes ago > Acceptance 1 hour ago
```

### Rule 3: Current Task Context

```
If user working on API → API-related suggestions boosted
If user working on UI → UI-related suggestions boosted
```

---

## Do Not Suggest Filters

### Absolute Filters (Never Suggest)

| Condition | Reason |
|-----------|--------|
| User explicitly rejected pattern | Respect user decision |
| Pattern already implemented | Don't suggest existing code |
| Pattern doesn't fit tech stack | React patterns in Vue = useless |
| Same exact suggestion in session | Don't repeat |

### Soft Filters (Reduce Priority)

| Condition | Adjustment |
|-----------|------------|
| User ignored similar pattern 2x | -50% priority |
| Pattern unrelated to current work | -30% priority |
| High effort, user prefers quick | -40% priority |

---

## Preference Persistence

### Within Session

All preferences persist for entire session:
- Rejections never repeat
- Accepted patterns can be expanded upon
- Ignored patterns get reduced priority

### Across Sessions

For persistent preference tracking (if implemented):

```typescript
interface PersistentPreferences {
  // Long-term patterns
  preferredCategories: string[];
  avoidedCategories: string[];

  // Per-project settings
  projectOverrides: {
    [projectPath: string]: {
      focus: string[];
      avoid: string[];
    };
  };
}
```

**Note**: Persistent preferences require external storage. Session memory is default.

---

## Adaptation Algorithm

```
1. Start with default scoring
2. Apply explicit preferences (from current session)
3. Apply inferred preferences (from behavior)
4. Apply rejection filters
5. Apply context boost (current work relevance)
6. Sort by adjusted priority
7. Take top 3
```

### Example Adaptation

```
Session state:
- User rejected: ["documentation"]
- User accepted: ["caching"]
- User ignored 2x: ["testing"]
- User said: "Focus on performance"

Available suggestions:
1. Add caching (performance): 3.9 → 3.9 + 0.5 (accepted category) = 4.4
2. Add tests (testing): 2.4 → 2.4 * 0.5 (soft reject) = 1.2
3. Add docs (documentation): 1.6 → FILTERED (hard reject)
4. Fix N+1 query (performance): 3.6 → 3.6 + 0.5 (focus area) = 4.1
5. Add rate limiting (security): 4.5 → 4.5 (no adjustment)

Final order: Rate limiting (4.5), Caching (4.4), N+1 fix (4.1)
Filtered: Docs (rejected), Tests (too low after adjustment)
```

---

## Communication Patterns

### When User Prefers Quick Wins

```
Focus on effort=1 suggestions
Use language like: "Quick fix:", "2-minute improvement:"
Provide copy-paste ready code
```

### When User Prefers Deep Improvements

```
Can suggest effort=2-3 items
Use language like: "For long-term improvement:"
Provide design overview, not just code
```

### When User Expresses Fatigue

```
User says: "Okay okay" / "I get it" / "Too many suggestions"
Action: Reduce to 1 suggestion per interaction
Or: Ask "Would you like me to pause suggestions for now?"
```

---

## Reset Conditions

### Full Reset

- New project opened
- User explicitly requests: "Reset preferences"
- Session timeout (implementation defined)

### Partial Reset

- User says "Suggest that again" → Remove from rejected
- User changes focus: "Now let's work on security" → Boost security
