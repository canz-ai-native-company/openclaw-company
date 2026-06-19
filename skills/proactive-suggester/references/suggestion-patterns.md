# Suggestion Patterns

Common improvement patterns organized by category for the Proactive Suggester skill.

---

## Performance Patterns

### Caching Patterns

| Pattern | When to Suggest | Impact | Effort |
|---------|-----------------|--------|--------|
| API Response Caching | Repeated identical API calls | High | Quick |
| Memoization | Expensive pure function computations | High | Quick |
| Database Query Caching | Same queries repeated | High | Moderate |
| Static Asset Caching | No cache headers | Medium | Quick |

**Detection Signals:**
- Same API endpoint called multiple times
- `useMemo`/`useCallback` missing on expensive operations
- Database queries inside loops
- No `Cache-Control` headers

### Loading Optimization

| Pattern | When to Suggest | Impact | Effort |
|---------|-----------------|--------|--------|
| Lazy Loading | Large components loaded upfront | High | Quick |
| Code Splitting | Bundle > 500KB | High | Moderate |
| Image Optimization | Unoptimized images | Medium | Quick |
| Pagination | Loading all records | High | Moderate |

**Detection Signals:**
- `import Component from './HeavyComponent'` (not dynamic)
- Large bundle size warnings
- `<img src="..." />` without optimization
- `SELECT * FROM table` without LIMIT

### Query Optimization

| Pattern | When to Suggest | Impact | Effort |
|---------|-----------------|--------|--------|
| N+1 Query Fix | Loop with queries inside | High | Moderate |
| Index Addition | Slow query patterns | High | Quick |
| Batch Operations | Individual operations in loop | High | Moderate |
| Eager Loading | Multiple related queries | Medium | Moderate |

**Detection Signals:**
- Database query inside `for`/`forEach`/`map`
- `SELECT` without proper `JOIN`
- Missing index on frequently filtered columns

---

## Security Patterns

### Input Validation

| Pattern | When to Suggest | Impact | Effort |
|---------|-----------------|--------|--------|
| SQL Parameterization | String concatenation in queries | Critical | Quick |
| XSS Prevention | Unescaped user content | Critical | Quick |
| Schema Validation | No input validation | High | Moderate |
| Rate Limiting | No rate limits on API | High | Moderate |

**Detection Signals:**
- `query(\`SELECT ... ${userInput}\`)` patterns
- `dangerouslySetInnerHTML` without sanitization
- API endpoints without validation middleware
- No rate limiting middleware

### Authentication/Authorization

| Pattern | When to Suggest | Impact | Effort |
|---------|-----------------|--------|--------|
| Password Hashing | Plain text passwords | Critical | Quick |
| HTTPS Enforcement | HTTP allowed | High | Quick |
| Token Validation | Missing auth checks | Critical | Moderate |
| CORS Configuration | Open CORS | High | Quick |

**Detection Signals:**
- Storing passwords without bcrypt/argon2
- No HTTPS redirect
- Routes without auth middleware
- `cors({ origin: '*' })`

---

## Architecture Patterns

### Code Organization

| Pattern | When to Suggest | Impact | Effort |
|---------|-----------------|--------|--------|
| Extract Component | Component > 300 lines | Medium | Moderate |
| Extract Hook | Repeated stateful logic | Medium | Moderate |
| Extract Utility | Same helper in multiple files | Medium | Quick |
| Service Layer | Business logic in components | High | Significant |

**Detection Signals:**
- Component file > 300 lines
- Same `useState` + `useEffect` combo in 3+ places
- Same function copy-pasted
- API calls directly in components

### Design Patterns

| Pattern | When to Suggest | Impact | Effort |
|---------|-----------------|--------|--------|
| Factory Pattern | Complex object creation | Medium | Moderate |
| Strategy Pattern | Large switch statements | Medium | Moderate |
| Repository Pattern | Direct database access everywhere | High | Significant |
| Observer Pattern | Manual event handling | Medium | Moderate |

**Detection Signals:**
- `switch` with 5+ cases
- Object creation with many conditionals
- `db.query()` scattered across codebase
- Manual callback management

---

## Maintainability Patterns

### Code Quality

| Pattern | When to Suggest | Impact | Effort |
|---------|-----------------|--------|--------|
| DRY Extraction | Same code in 3+ places | Medium | Quick |
| Named Constants | Magic numbers/strings | Low | Quick |
| Error Handling | Missing try-catch | Medium | Quick |
| Type Safety | Using `any` type | Medium | Moderate |

**Detection Signals:**
- Identical or near-identical code blocks
- Hardcoded values like `3600`, `"admin"`
- No error boundaries or try-catch
- TypeScript with `any` overuse

### Naming Improvements

| Pattern | When to Suggest | Impact | Effort |
|---------|-----------------|--------|--------|
| Descriptive Names | Single letter variables | Low | Quick |
| Verb-based Functions | Noun function names | Low | Quick |
| Boolean Naming | `flag`, `status` booleans | Low | Quick |
| Consistent Casing | Mixed naming conventions | Low | Quick |

**Detection Signals:**
- Variables like `x`, `temp`, `data`
- Functions like `user()` instead of `getUser()`
- Booleans like `flag` instead of `isValid`
- Mix of camelCase and snake_case

---

## Documentation Patterns

| Pattern | When to Suggest | Impact | Effort |
|---------|-----------------|--------|--------|
| JSDoc/Docstring | Complex function undocumented | Low | Quick |
| README Update | Outdated or missing README | Medium | Moderate |
| API Documentation | No endpoint docs | Medium | Moderate |
| Inline Comments | Complex algorithm unexplained | Low | Quick |

**Detection Signals:**
- Function > 50 lines without comments
- README references old features
- API has no OpenAPI/Swagger
- Complex regex or algorithm without explanation

---

## Testing Patterns

| Pattern | When to Suggest | Impact | Effort |
|---------|-----------------|--------|--------|
| Unit Test Addition | Critical function untested | High | Moderate |
| Edge Case Coverage | No edge case tests | Medium | Quick |
| Integration Test | API endpoints untested | High | Moderate |
| Mock Improvement | Brittle test mocks | Medium | Moderate |

**Detection Signals:**
- Functions in `src/` without corresponding test
- Tests only for happy path
- No test files for API routes
- Tests failing on minor changes

---

## Developer Experience Patterns

| Pattern | When to Suggest | Impact | Effort |
|---------|-----------------|--------|--------|
| TypeScript Strict | Non-strict mode | Medium | Quick |
| ESLint Rules | No linting | Medium | Quick |
| Prettier Setup | Inconsistent formatting | Low | Quick |
| Path Aliases | Deep relative imports | Low | Quick |

**Detection Signals:**
- `"strict": false` in tsconfig
- No `.eslintrc` file
- No `.prettierrc` file
- `../../../../` in imports

---

## Pattern Selection Algorithm

```
1. Detect signals in current code context
2. Match signals to patterns
3. Filter by project type (web/api/cli/etc.)
4. Score by impact/effort
5. Take top 3
6. Generate specific suggestion with file references
```
