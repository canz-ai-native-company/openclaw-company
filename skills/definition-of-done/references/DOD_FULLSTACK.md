# Definition of Done - Fullstack

Quality gates for tasks spanning both frontend and backend.

---

## Applicability

Use this checklist when changes include:
- Frontend UI + Backend API changes together
- Feature implementations end-to-end
- Full vertical slices
- Integration between client and server

---

## Code Quality

### General
- [ ] ESLint passes (frontend + backend)
- [ ] TypeScript compiles (frontend + backend)
- [ ] Prettier formatted (all files)
- [ ] No `console.log` in production

### Frontend
- [ ] Components follow standards
- [ ] State management appropriate
- [ ] No unnecessary re-renders

### Backend
- [ ] Separation of concerns
- [ ] Error handling consistent
- [ ] No business logic in routes

---

## Testing

### Unit Tests
- [ ] Frontend unit tests pass
- [ ] Backend unit tests pass
- [ ] Coverage maintained

### Integration Tests
- [ ] Frontend integration tests pass
- [ ] Backend integration tests pass
- [ ] API contract tests pass

### E2E Tests (Critical for Fullstack)
- [ ] E2E tests pass
- [ ] Full user flow tested
- [ ] API + UI integration verified
- [ ] Error scenarios tested

### Coverage
- [ ] Test coverage maintained
- [ ] Critical paths tested E2E

---

## API Contract

### Request/Response
- [ ] Frontend uses correct API contract
- [ ] Request payloads match schema
- [ ] Response handling correct
- [ ] Error responses handled in UI

### Types
- [ ] Shared types between FE/BE
- [ ] API types auto-generated (if applicable)
- [ ] No type mismatches

### Versioning
- [ ] API version consistent
- [ ] Backwards compatibility (if needed)
- [ ] Deprecation warnings (if applicable)

---

## UX States (From Frontend DoD)

### Loading States
- [ ] Loading indicators during API calls
- [ ] Skeleton loaders for content
- [ ] Buttons disabled during submission
- [ ] Optimistic UI where appropriate

### Error States
- [ ] API errors displayed to user
- [ ] Form validation errors shown
- [ ] Retry options available
- [ ] Error boundaries in place

### Empty States
- [ ] Empty state UI present
- [ ] Helpful messaging
- [ ] Call-to-action buttons

### Success States
- [ ] Success confirmations shown
- [ ] Clear feedback provided
- [ ] Next steps indicated

---

## Security (Combined)

### Frontend Security
- [ ] No sensitive data in client code
- [ ] XSS prevention (output encoding)
- [ ] CSRF tokens used

### Backend Security
- [ ] Authentication enforced
- [ ] Authorization checks in place
- [ ] Input validation present
- [ ] SQL injection prevented

### Data Flow
- [ ] Sensitive data not logged
- [ ] HTTPS enforced
- [ ] No secrets exposed to client

### Dependencies
- [ ] `npm audit` passes (both packages)
- [ ] No known vulnerabilities

---

## Database (From Backend DoD)

- [ ] Migrations created
- [ ] Migrations reversible
- [ ] Indexes appropriate
- [ ] No N+1 queries

---

## Build & Deploy

### Frontend Build
- [ ] Frontend production build passes
- [ ] Bundle size acceptable
- [ ] Assets optimized

### Backend Build
- [ ] Backend production build passes
- [ ] No build warnings

### Integration
- [ ] Frontend can connect to backend
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] API base URL configurable

### Deployment
- [ ] Deploy order documented (DB → BE → FE)
- [ ] Rollback plan exists
- [ ] Health checks pass

---

## Documentation

### API Documentation
- [ ] OpenAPI/Swagger updated
- [ ] New endpoints documented
- [ ] Request/response examples

### Frontend Documentation
- [ ] Component documentation updated
- [ ] Complex UI logic commented

### Project Documentation
- [ ] README updated
- [ ] CHANGELOG updated
- [ ] Setup instructions current
- [ ] CLAUDE.md updated (if architecture changed)

---

## Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets standards
- [ ] Focus states visible

---

## Responsive Design

- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works

---

## Quick Verification Commands

```bash
# Frontend
cd frontend  # or client/
npm run lint
npm run typecheck
npm test
npm run build

# Backend
cd backend  # or server/
npm run lint
npm run typecheck
npm test
npm run build

# E2E (from root)
npm run test:e2e

# Security
npm audit --workspaces  # if monorepo
```

---

## Fullstack-Specific Gates

| Gate | Required | Notes |
|------|----------|-------|
| E2E tests | Yes | Full user flow |
| API contract | Yes | FE/BE type match |
| UX states | Yes | All four states |
| Security (both) | Yes | FE + BE checks |
| Integration deploy | Yes | FE can reach BE |

---

## Integration Checklist

```
[ ] Frontend fetches from correct API endpoint
[ ] Authentication flows work end-to-end
[ ] Error handling works across stack
[ ] Loading states show during real API calls
[ ] Empty states show for real empty data
[ ] Success flows complete without errors
```

---

## Sign-off

```
Task: ________________________________
Frontend changes: ____________________
Backend changes: _____________________
Date: ________________________________

[ ] E2E tests pass
[ ] API contract verified
[ ] All UX states handled
[ ] Security reviewed (FE + BE)
[ ] Ready for review
```
