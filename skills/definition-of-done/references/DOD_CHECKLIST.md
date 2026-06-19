# Definition of Done - Full Checklist

Comprehensive quality gate checklist for all task types.

---

## Code Quality

### Linting
- [ ] ESLint passes (0 errors, 0 warnings)
- [ ] No `eslint-disable` comments without justification
- [ ] No `@ts-ignore` comments without justification

### Type Safety
- [ ] TypeScript compiles (0 errors)
- [ ] No `any` types without justification
- [ ] Strict mode enabled and passing

### Formatting
- [ ] Prettier formatted (all files)
- [ ] Consistent indentation
- [ ] No trailing whitespace

### Code Hygiene
- [ ] No `console.log` in production code
- [ ] No commented-out code blocks
- [ ] No TODO comments for current task (resolved or tracked)
- [ ] No unused imports/variables
- [ ] No dead code paths

---

## Testing

### Unit Tests
- [ ] Unit tests pass (100%)
- [ ] New code has unit tests
- [ ] Edge cases covered
- [ ] Mocks are realistic

### Integration Tests
- [ ] Integration tests pass
- [ ] API contracts verified
- [ ] Database interactions tested

### E2E Tests (if applicable)
- [ ] E2E tests pass
- [ ] Critical user flows covered
- [ ] Cross-browser tested (if required)

### Coverage
- [ ] Test coverage maintained (not decreased)
- [ ] Critical paths have >80% coverage
- [ ] No untested error handlers

---

## Security

### Secrets
- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] No secrets in git history
- [ ] Environment variables used for sensitive data
- [ ] `.env.example` updated if new vars added

### Data Protection
- [ ] No sensitive data in logs
- [ ] PII handled according to policy
- [ ] Encryption used where required

### Input Validation
- [ ] User input validated
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (output encoding)
- [ ] CSRF protection in place

### Auth/Authz
- [ ] Authentication required where needed
- [ ] Authorization checks in place
- [ ] Session handling secure
- [ ] Rate limiting considered

### Dependencies
- [ ] No known vulnerabilities (`npm audit`)
- [ ] Dependencies up to date (or justified)
- [ ] Lockfile committed

---

## UX States

### Loading States
- [ ] Loading indicators shown during async operations
- [ ] Skeleton loaders for content
- [ ] Progress indicators for long operations
- [ ] Buttons disabled during submission

### Error States
- [ ] User-friendly error messages
- [ ] Retry options where applicable
- [ ] Error boundaries in place (React)
- [ ] Graceful degradation

### Empty States
- [ ] Empty state UI for lists/tables
- [ ] Helpful empty state messages
- [ ] Call-to-action in empty states
- [ ] First-time user guidance

### Success Feedback
- [ ] Success confirmations shown
- [ ] Appropriate success messages
- [ ] Clear next steps after success

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Sufficient color contrast
- [ ] Focus states visible

---

## Build & Deploy

### Production Build
- [ ] Production build passes (`npm run build`)
- [ ] No build warnings
- [ ] Build artifacts generated correctly

### Bundle Size
- [ ] Bundle size acceptable (no major increase)
- [ ] Code splitting implemented where beneficial
- [ ] Tree shaking working

### Environment
- [ ] Environment variables documented
- [ ] All required env vars present
- [ ] No dev-only configs in production

### Deployment
- [ ] Deployment scripts work
- [ ] Rollback plan exists
- [ ] Health checks pass

---

## Documentation

### Code Documentation
- [ ] Complex logic commented
- [ ] Public APIs documented (JSDoc/TSDoc)
- [ ] Type definitions complete

### Project Documentation
- [ ] README updated (if public API changed)
- [ ] Setup instructions current
- [ ] Architecture docs updated (if changed)

### Change Documentation
- [ ] CHANGELOG updated
- [ ] Breaking changes documented
- [ ] Migration guide (if needed)

### Internal Documentation
- [ ] CLAUDE.md updated (if architecture changed)
- [ ] Decision records added (if major decisions made)

---

## Quick Verification Commands

```bash
# Code Quality
npm run lint
npm run typecheck
npx prettier --check .

# Testing
npm test
npm run test:integration
npm run test:e2e

# Security
npm audit
npx secretlint .

# Build
npm run build
```

---

## Gate Summary

| Gate | Must Pass | Can Warn |
|------|-----------|----------|
| ESLint | Errors | Warnings |
| TypeScript | All | - |
| Tests | All | - |
| Build | Yes | Warnings |
| Security | Vulnerabilities | Advisories |
| Prettier | Yes | - |

---

## Sign-off

```
Task: ________________________________
Date: ________________________________
Verified by: _________________________

[ ] All critical gates pass
[ ] All applicable checks verified
[ ] Ready for merge/deploy
```
