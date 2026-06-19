# Definition of Done - Backend

Quality gates specific to backend/API development tasks.

---

## Applicability

Use this checklist when changes include:
- API endpoints (REST, GraphQL)
- Database schemas/migrations
- Server-side business logic
- Background jobs/workers
- Authentication/Authorization
- Third-party integrations

---

## Code Quality

### Standards
- [ ] ESLint/linter passes (0 errors, 0 warnings)
- [ ] TypeScript compiles (0 errors)
- [ ] Prettier/formatter applied
- [ ] No `console.log` in production code

### Architecture
- [ ] Separation of concerns (routes/controllers/services)
- [ ] Business logic in service layer
- [ ] No business logic in route handlers
- [ ] Dependencies injected (testable)

### Error Handling
- [ ] All errors caught and handled
- [ ] Appropriate HTTP status codes
- [ ] Error responses follow consistent format
- [ ] No stack traces in production responses

### Performance
- [ ] Database queries optimized (no N+1)
- [ ] Indexes added for query patterns
- [ ] Pagination implemented for lists
- [ ] Caching considered where appropriate

---

## Testing

### Unit Tests
- [ ] Service layer unit tests pass
- [ ] Business logic tested
- [ ] Edge cases covered
- [ ] Error paths tested

### Integration Tests
- [ ] API endpoint tests pass
- [ ] Database operations tested
- [ ] External service mocks realistic
- [ ] Transaction rollback tested

### Contract Tests
- [ ] API contracts verified
- [ ] Request validation tested
- [ ] Response schemas correct

### Coverage
- [ ] Test coverage maintained
- [ ] Critical paths >80% coverage
- [ ] Error handlers tested

---

## API Design

### RESTful Conventions
- [ ] Proper HTTP methods (GET, POST, PUT, DELETE)
- [ ] Resource-based URLs
- [ ] Consistent naming conventions
- [ ] Proper status codes

### Request Handling
- [ ] Input validation present
- [ ] Request body schema validated
- [ ] Query parameters validated
- [ ] Path parameters validated

### Response Format
- [ ] Consistent response structure
- [ ] Proper pagination metadata
- [ ] HATEOAS links (if applicable)
- [ ] Versioning strategy followed

### Documentation
- [ ] OpenAPI/Swagger updated
- [ ] Endpoint documented
- [ ] Request/response examples provided

---

## Database

### Schema
- [ ] Migrations created (not manual changes)
- [ ] Migrations reversible
- [ ] Indexes appropriate for queries
- [ ] Constraints in place (FK, unique, not null)

### Data Integrity
- [ ] Transactions used for multi-step operations
- [ ] Cascade rules appropriate
- [ ] Soft delete considered (if applicable)
- [ ] Audit fields updated (createdAt, updatedAt)

### Performance
- [ ] No N+1 queries
- [ ] Explain plans reviewed for complex queries
- [ ] Connection pooling configured
- [ ] Query timeouts set

---

## Security (Critical for Backend)

### Authentication
- [ ] Auth required on protected endpoints
- [ ] Token validation correct
- [ ] Session handling secure
- [ ] Password hashing appropriate (bcrypt/argon2)

### Authorization
- [ ] Permission checks in place
- [ ] Role-based access working
- [ ] Resource ownership verified
- [ ] No privilege escalation possible

### Input Security
- [ ] SQL injection prevented (parameterized queries)
- [ ] NoSQL injection prevented
- [ ] Command injection prevented
- [ ] Path traversal prevented

### Data Security
- [ ] No secrets in code/config
- [ ] Sensitive data encrypted at rest
- [ ] PII logging prevented
- [ ] HTTPS enforced

### Rate Limiting
- [ ] Rate limiting on public endpoints
- [ ] Rate limiting on auth endpoints
- [ ] Appropriate limits set

### Dependencies
- [ ] `npm audit` passes (no critical)
- [ ] Dependencies up to date
- [ ] Lockfile committed

---

## Reliability

### Error Recovery
- [ ] Graceful degradation for external services
- [ ] Retry logic with backoff
- [ ] Circuit breakers (if applicable)
- [ ] Timeouts configured

### Observability
- [ ] Logging in place (structured)
- [ ] Error tracking configured
- [ ] Metrics exposed (if applicable)
- [ ] Health check endpoint working

### Idempotency
- [ ] POST endpoints idempotent (if needed)
- [ ] Retry-safe operations
- [ ] Duplicate request handling

---

## Build & Deploy

### Build
- [ ] Production build passes
- [ ] No build warnings
- [ ] Environment variables documented

### Deployment
- [ ] Database migrations run automatically
- [ ] Zero-downtime deployment possible
- [ ] Rollback tested
- [ ] Health checks configured

### Configuration
- [ ] All secrets in environment variables
- [ ] `.env.example` updated
- [ ] Config validation on startup

---

## Documentation

- [ ] API documentation updated (OpenAPI/Swagger)
- [ ] README updated (if setup changed)
- [ ] CHANGELOG entry added
- [ ] Breaking changes documented

---

## Quick Verification Commands

```bash
# Code Quality
npm run lint
npm run typecheck

# Testing
npm test
npm run test:integration
npm run test:api

# Security
npm audit
npx snyk test  # if configured

# Database
npm run db:migrate:status
npm run db:migrate  # apply pending

# Build
npm run build

# API Docs
npm run docs:generate
```

---

## Backend-Specific Gates

| Gate | Required | Notes |
|------|----------|-------|
| Auth/Authz | Yes | Every protected endpoint |
| Input validation | Yes | Every endpoint |
| SQL injection prevention | Yes | Every query |
| Error handling | Yes | Consistent format |
| API docs | Yes | OpenAPI/Swagger |
| Migrations | Yes | No manual DB changes |
| Rate limiting | Critical endpoints | Auth, public APIs |

---

## Sign-off

```
Task: ________________________________
Endpoints changed: ___________________
Date: ________________________________

[ ] Security review complete
[ ] API documentation updated
[ ] Database migrations tested
[ ] Ready for review
```
