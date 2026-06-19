# TDD Planning Guide

How to plan tests BEFORE writing code — for Step 8 of the Design Thinking Protocol.

---

## TDD Principle

```
WRITE TESTS ──► RUN (FAIL) ──► IMPLEMENT ──► RUN (PASS) ──► REFACTOR
     │                              │                            │
     └──────────────────────────────┴────────────────────────────┘
                          (Iterate for each feature)
```

**Key**: Tests are written in Phase 3. Implementation in Phase 4. Tests MUST fail initially.

---

## Test Categories

### Unit Tests

Test individual functions/methods in isolation.

| Test | Focus | Example |
|------|-------|---------|
| Business logic | Core algorithms | `validateEmail()` returns true/false |
| Data transformation | Input → Output | `formatCurrency(1000)` → `"$1,000.00"` |
| State management | State transitions | `addToCart()` updates count |
| Utility functions | Helpers | `slugify("Hello World")` → `"hello-world"` |

### Integration Tests

Test component interactions.

| Test | Focus | Example |
|------|-------|---------|
| API endpoints | Request → Response | `POST /api/users` creates user |
| Database operations | CRUD queries | `createUser()` inserts into DB |
| Service interactions | Service A → Service B | Auth service validates with DB |
| Middleware chains | Request pipeline | Auth middleware blocks unauthorized |

### End-to-End Tests

Test complete user flows.

| Test | Focus | Example |
|------|-------|---------|
| User registration | Full signup flow | Fill form → Submit → Email → Verify |
| Authentication | Login/logout | Enter credentials → Dashboard → Logout |
| CRUD operations | Full lifecycle | Create → Read → Update → Delete |
| Payment flow | Checkout | Add to cart → Checkout → Pay → Confirm |

---

## Test Planning by Project Type

### Fullstack Web App

```markdown
### Tests to Write BEFORE Code

#### Unit Tests
| Test File | Test Cases | What It Validates |
|-----------|-----------|-------------------|
| `tests/unit/auth.test.ts` | validatePassword, hashPassword, verifyToken | Auth logic |
| `tests/unit/user.test.ts` | createUser, updateUser, deleteUser | User CRUD |
| `tests/unit/validators.test.ts` | email, phone, URL validators | Input validation |

#### Integration Tests
| Test File | Test Cases | What It Validates |
|-----------|-----------|-------------------|
| `tests/integration/api/users.test.ts` | POST, GET, PUT, DELETE /api/users | User API contract |
| `tests/integration/api/auth.test.ts` | POST /login, POST /register | Auth API contract |
| `tests/integration/db/user.test.ts` | Create, read, update, delete | Database operations |

#### E2E Tests
| Test File | Test Cases | What It Validates |
|-----------|-----------|-------------------|
| `tests/e2e/auth.test.ts` | Register, login, logout | Auth flow |
| `tests/e2e/dashboard.test.ts` | View, create, edit | CRUD flow |
```

### Backend API

```markdown
#### Unit Tests
| Test File | Test Cases | What It Validates |
|-----------|-----------|-------------------|
| `tests/unit/services/user.test.py` | create, get, update, delete | Business logic |
| `tests/unit/validators.test.py` | Input validation rules | Data validation |

#### Integration Tests
| Test File | Test Cases | What It Validates |
|-----------|-----------|-------------------|
| `tests/integration/test_api.py` | All endpoint contracts | API correctness |
| `tests/integration/test_db.py` | CRUD operations | Database layer |

#### Load Tests
| Test File | Test Cases | What It Validates |
|-----------|-----------|-------------------|
| `tests/load/test_endpoints.py` | Concurrent requests | Performance |
```

### AI Agent

```markdown
#### Unit Tests
| Test File | Test Cases | What It Validates |
|-----------|-----------|-------------------|
| `tests/unit/test_agent.py` | Tool selection, response format | Agent logic |
| `tests/unit/test_tools.py` | Each tool function | Tool correctness |

#### Integration Tests
| Test File | Test Cases | What It Validates |
|-----------|-----------|-------------------|
| `tests/integration/test_pipeline.py` | Input → Agent → Output | Full pipeline |
| `tests/integration/test_api.py` | API endpoints | Agent API |

#### Mock Strategy
| What | How | Why |
|------|-----|-----|
| LLM calls | respx mock | Deterministic, no cost |
| External APIs | respx mock | Isolated testing |
| Database | Test database | Real schema validation |
```

---

## Mock Strategy Guide

### What to Mock

| Component | Mock? | Why |
|-----------|-------|-----|
| External APIs | Always | Unreliable, costs money, rate limits |
| LLM calls | Always | Non-deterministic, expensive |
| Email services | Always | Don't send real emails in tests |
| Payment APIs | Always | Don't charge real money |
| File uploads | Usually | Avoid filesystem dependencies |

### What NOT to Mock

| Component | Why Real? |
|-----------|-----------|
| Database (dev) | Schema validation, query correctness |
| Validation logic | Core business rules |
| Data transformations | Must work correctly |
| Internal services | Test actual integration |

### Mock Patterns

#### JavaScript/TypeScript (MSW)

```typescript
// Mock API calls
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([{ id: 1, name: 'Test' }]);
  }),
];

const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

#### Python (respx)

```python
import respx
from httpx import Response

@respx.mock
async def test_external_api():
    respx.get("https://api.example.com/data").mock(
        return_value=Response(200, json={"result": "ok"})
    )
    # Test code that calls the API
```

---

## Framework Selection

### JavaScript/TypeScript

| Framework | Use For | When |
|-----------|---------|------|
| **Vitest** | Unit + Integration | Default for Vite projects |
| **Jest** | Unit + Integration | Default for most projects |
| **Playwright** | E2E | Browser testing |
| **Cypress** | E2E | Component + E2E testing |
| **MSW** | API mocking | Mock external APIs |

### Python

| Framework | Use For | When |
|-----------|---------|------|
| **pytest** | Unit + Integration | Default for Python |
| **pytest-asyncio** | Async tests | FastAPI, async code |
| **respx** | HTTP mocking | Mock external HTTP calls |
| **httpx** | API testing | FastAPI TestClient |

---

## Test Plan Template

Use this template for Step 8 output:

```markdown
## 9. Testing Strategy (TDD)

### Framework & Tools

| Tool | Purpose | Version |
|------|---------|---------|
| [framework] | Unit + Integration | [version] |
| [e2e tool] | End-to-end | [version] |
| [mock tool] | API mocking | [version] |

### Tests to Write BEFORE Code

#### Unit Tests (Phase 3)

| Test File | Test Cases | What It Validates |
|-----------|-----------|-------------------|
| [file] | [cases] | [validates] |

#### Integration Tests (Phase 3)

| Test File | Test Cases | What It Validates |
|-----------|-----------|-------------------|
| [file] | [cases] | [validates] |

#### E2E Tests (Phase 3)

| Test File | Test Cases | What It Validates |
|-----------|-----------|-------------------|
| [file] | [cases] | [validates] |

### Mock Strategy

| What | Mock? | Real? | Why |
|------|-------|-------|-----|
| [component] | [yes/no] | [yes/no] | [reason] |

### Coverage Target

| Type | Target | Minimum |
|------|--------|---------|
| Unit | 80% | 60% |
| Integration | 70% | 50% |
| E2E | Critical paths | Happy path + errors |
```

---

## Test Naming Convention

```
test_[unit]_[function]_[scenario]_[expected]

# Examples
test_user_createUser_validInput_returnsUser
test_user_createUser_duplicateEmail_throwsError
test_auth_validateToken_expiredToken_returnsFalse
test_api_postUsers_missingEmail_returns400
```

---

## What Makes a Good Test Plan

### Do

- List specific test cases, not vague categories
- Include edge cases and error paths
- Define mock strategy per external dependency
- Map tests to requirements (traceability)
- Set realistic coverage targets

### Don't

- Write "test everything" without specifics
- Skip error/edge case tests
- Mock internal logic (defeats the purpose)
- Set 100% coverage target (diminishing returns)
- Forget to plan for async/concurrent tests
