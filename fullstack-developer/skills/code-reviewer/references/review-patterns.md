# Code Review Patterns

Patterns to check during code review organized by category.

---

## Code Smells

### Complexity Smells

| Smell | Detection | Fix |
|-------|-----------|-----|
| Long Function | >50 lines | Extract into smaller functions |
| Deep Nesting | >3 levels | Early returns, extract methods |
| God Class | >500 lines, >10 methods | Split into focused classes |
| Feature Envy | Uses other class more than own | Move method to other class |
| Long Parameter List | >4 parameters | Use object/config pattern |

### Duplication Smells

| Smell | Detection | Fix |
|-------|-----------|-----|
| Copy-Paste Code | Similar blocks in multiple places | Extract to shared function |
| Magic Numbers | Hardcoded values without names | Create named constants |
| Repeated Conditionals | Same if/switch in multiple places | Strategy pattern or lookup table |

### Naming Smells

| Smell | Detection | Fix |
|-------|-----------|-----|
| Single Letter Variables | `x`, `i`, `d` | Use descriptive names |
| Misleading Names | Name doesn't match behavior | Rename to match actual behavior |
| Generic Names | `data`, `temp`, `result` | Use domain-specific names |
| Inconsistent Naming | Mixed camelCase/snake_case | Follow language conventions |

---

## Error Handling Patterns

### Must Check

| Pattern | Why Critical |
|---------|--------------|
| Unhandled Promise | Crashes app silently |
| Empty Catch Block | Hides errors |
| Catch and Throw Same | Pointless try-catch |
| No Error Boundary (React) | Whole app crashes |
| Missing Null Check | TypeError crashes |

### Good Patterns

```typescript
// Good: Specific error handling
try {
  await fetchUser(id);
} catch (error) {
  if (error instanceof NotFoundError) {
    return null;
  }
  throw error; // Re-throw unexpected errors
}

// Good: Error boundary in React
<ErrorBoundary fallback={<ErrorPage />}>
  <UserProfile />
</ErrorBoundary>

// Good: Null check with optional chaining
const name = user?.profile?.name ?? 'Unknown';
```

### Bad Patterns

```typescript
// Bad: Empty catch
try {
  await riskyOperation();
} catch (e) {
  // Silent failure - NEVER DO THIS
}

// Bad: Catching and ignoring
} catch (e) {
  console.log(e); // Log but no handling
}

// Bad: No async error handling
async function getData() {
  const data = await fetch(url); // Unhandled rejection
  return data.json();
}
```

---

## Type Safety Patterns

### TypeScript Issues

| Issue | Severity | Fix |
|-------|----------|-----|
| `any` type | Warning | Use specific type or `unknown` |
| Missing return type | Suggestion | Add explicit return type |
| Type assertion `as` | Warning | Use type guard instead |
| Non-null assertion `!` | Warning | Add null check |
| Implicit `any` | Warning | Enable `noImplicitAny` |

### Good Type Patterns

```typescript
// Good: Type guard
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
}

// Good: Discriminated union
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: Error };

// Good: Generic with constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

---

## Performance Patterns

### React Performance

| Issue | Detection | Fix |
|-------|-----------|-----|
| Missing key prop | `key={index}` or no key | Use unique stable ID |
| Inline function in JSX | `onClick={() => ...}` | useCallback |
| Object/Array in deps | New reference each render | useMemo |
| Missing memo | Re-renders unnecessarily | React.memo |
| Large bundle | Slow initial load | Code splitting |

### General Performance

| Issue | Detection | Fix |
|-------|-----------|-----|
| N+1 queries | Loop with DB calls | Batch queries |
| No pagination | Loading all data | Add limit/offset |
| Sync file I/O | `fs.readFileSync` | Use async version |
| Memory leak | Growing memory | Clean up subscriptions |

---

## Security Patterns

### Critical Security Issues

| Issue | Example | Fix |
|-------|---------|-----|
| SQL Injection | `query(userInput)` | Parameterized queries |
| XSS | `innerHTML = userInput` | Sanitize or use textContent |
| Exposed Secrets | `apiKey = "sk-..."` | Environment variables |
| Insecure Dependencies | Outdated packages | Update dependencies |
| Missing Auth Check | No authorization | Add middleware |

### Secure Patterns

```typescript
// Good: Parameterized query
const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

// Good: Sanitized output
const safeHtml = DOMPurify.sanitize(userContent);

// Good: Environment variable
const apiKey = process.env.API_KEY;

// Good: Input validation
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(150),
});
const validated = schema.parse(input);
```

---

## Testing Patterns

### Test Coverage Gaps

| Gap | Why Important | Fix |
|-----|---------------|-----|
| No edge case tests | Bugs in boundaries | Add boundary tests |
| No error path tests | Errors unhandled | Test error scenarios |
| No integration tests | Components don't work together | Add integration tests |
| Mocking everything | Tests don't reflect reality | Use real implementations where possible |

### Good Test Patterns

```typescript
// Good: Descriptive test names
describe('UserService', () => {
  it('should return null when user not found', async () => {
    const result = await userService.findById('nonexistent');
    expect(result).toBeNull();
  });

  it('should throw ValidationError for invalid email', async () => {
    await expect(userService.create({ email: 'invalid' }))
      .rejects.toThrow(ValidationError);
  });
});

// Good: Test edge cases
it('should handle empty array', () => {
  expect(sum([])).toBe(0);
});

it('should handle negative numbers', () => {
  expect(sum([-1, -2, -3])).toBe(-6);
});
```

---

## Documentation Patterns

### Required Documentation

| Element | When Required |
|---------|---------------|
| Function JSDoc | Public API functions |
| Type comments | Complex types |
| README | Every package/module |
| API docs | External APIs |
| Inline comments | Non-obvious logic |

### Good Documentation

```typescript
/**
 * Calculates the total price including tax and discounts.
 *
 * @param items - Array of cart items with price and quantity
 * @param taxRate - Tax rate as decimal (e.g., 0.1 for 10%)
 * @param discountCode - Optional discount code
 * @returns Total price in cents
 * @throws {InvalidDiscountError} If discount code is invalid
 *
 * @example
 * const total = calculateTotal(items, 0.1, 'SAVE10');
 */
function calculateTotal(
  items: CartItem[],
  taxRate: number,
  discountCode?: string
): number {
  // Implementation
}
```
