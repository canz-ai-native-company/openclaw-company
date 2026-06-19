# Pull Request Template

Copy this template when creating PRs. Place in `.github/PULL_REQUEST_TEMPLATE.md` for automatic use.

---

## Template

```markdown
## Summary

<!-- One or two sentences describing what this PR does -->

## Type of Change

<!-- Check relevant boxes -->
- [ ] Feature (new functionality)
- [ ] Bug fix (fixes an issue)
- [ ] Hotfix (urgent production fix)
- [ ] Refactor (code improvement, no behavior change)
- [ ] Documentation (docs only)
- [ ] Test (test additions/changes)
- [ ] Chore (maintenance, dependencies)

## Changes

<!-- Bulleted list of specific changes -->
-
-
-

## Testing

<!-- How were these changes tested? -->
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed
- [ ] No tests needed (explain why)

### Test Instructions

<!-- Steps for reviewers to test -->
1.
2.
3.

## Screenshots

<!-- If UI changes, add before/after screenshots -->
| Before | After |
|--------|-------|
|        |       |

## Checklist

### Code Quality
- [ ] Code follows project style guidelines
- [ ] Self-reviewed my own code
- [ ] Commented hard-to-understand areas
- [ ] No new warnings introduced

### Security
- [ ] No secrets/credentials committed
- [ ] Input validation added where needed
- [ ] No new security vulnerabilities

### Documentation
- [ ] README updated if needed
- [ ] API docs updated if needed
- [ ] Changelog entry added if needed

### Dependencies
- [ ] No unnecessary dependencies added
- [ ] Package versions pinned appropriately
- [ ] Breaking changes documented

## Related

<!-- Links to related items -->
- Issue: #
- Docs:
- Depends on: #

## Notes for Reviewers

<!-- Any additional context for reviewers -->

```

---

## Examples by Type

### Feature PR

```markdown
## Summary

Adds OAuth2 Google login as an alternative authentication method.

## Type of Change

- [x] Feature (new functionality)

## Changes

- Add Google OAuth2 client configuration
- Create `/auth/google` and `/auth/google/callback` endpoints
- Add "Sign in with Google" button to login page
- Store Google profile data in user record

## Testing

- [x] Unit tests added/updated
- [x] Integration tests added/updated
- [x] Manual testing performed

### Test Instructions

1. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
2. Navigate to login page
3. Click "Sign in with Google"
4. Complete OAuth flow
5. Verify user is logged in and profile shows Google data

## Screenshots

| Before | After |
|--------|-------|
| ![Login without Google](url) | ![Login with Google](url) |

## Checklist

### Code Quality
- [x] Code follows project style guidelines
- [x] Self-reviewed my own code
- [x] Commented hard-to-understand areas
- [x] No new warnings introduced

### Security
- [x] No secrets/credentials committed
- [x] Input validation added where needed
- [x] No new security vulnerabilities

### Documentation
- [x] README updated if needed
- [ ] API docs updated if needed
- [ ] Changelog entry added if needed

## Related

- Issue: #123
- Docs: https://developers.google.com/identity/protocols/oauth2

## Notes for Reviewers

OAuth configuration requires Google Cloud Console setup.
See setup instructions in `docs/oauth-setup.md`.
```

### Bug Fix PR

```markdown
## Summary

Fixes race condition causing duplicate items in cart when rapidly clicking "Add to Cart".

## Type of Change

- [x] Bug fix (fixes an issue)

## Changes

- Add debounce to "Add to Cart" button (300ms)
- Add server-side idempotency check using request ID
- Add optimistic UI update to prevent confusion

## Testing

- [x] Unit tests added/updated
- [x] Manual testing performed

### Test Instructions

1. Navigate to product page
2. Rapidly click "Add to Cart" multiple times
3. Verify cart shows only one item
4. Check network tab - only one successful request

## Checklist

### Code Quality
- [x] Code follows project style guidelines
- [x] Self-reviewed my own code
- [x] No new warnings introduced

## Related

- Issue: #456
- Reported by: Customer support ticket #789

## Notes for Reviewers

Root cause was async state update completing after multiple clicks registered.
Debounce alone wasn't sufficient due to network latency, hence the server-side check.
```

### Hotfix PR

```markdown
## Summary

**URGENT**: Fixes null pointer exception in payment processing causing checkout failures.

## Type of Change

- [x] Hotfix (urgent production fix)

## Changes

- Add null check for `paymentMethod.details` before accessing
- Add fallback error message for missing payment details
- Add monitoring alert for this error pattern

## Testing

- [x] Unit tests added/updated
- [x] Manual testing performed

### Test Instructions

1. Create order with payment method that has null details
2. Verify graceful error handling instead of 500

## Checklist

- [x] Minimal, focused changes
- [x] No unrelated changes included
- [x] Monitoring added for future detection

## Related

- Incident: INC-001
- PagerDuty: https://pagerduty.com/incident/xyz

## Notes for Reviewers

**Fast-track review requested.**
This is affecting ~5% of checkout attempts.
Rollback plan: Revert this commit.
```

---

## PR Labels

Use labels to communicate PR status and type:

| Label | Description | Color |
|-------|-------------|-------|
| `feature` | New functionality | `#0E8A16` green |
| `bug` | Bug fix | `#D93F0B` red |
| `hotfix` | Urgent fix | `#B60205` dark red |
| `breaking` | Breaking changes | `#FBCA04` yellow |
| `wip` | Work in progress | `#CCCCCC` gray |
| `ready-for-review` | Needs review | `#0052CC` blue |
| `needs-changes` | Requires updates | `#E99695` pink |
| `approved` | Ready to merge | `#0E8A16` green |

---

## PR Size Guidelines

| Size | Lines Changed | Review Time |
|------|---------------|-------------|
| XS | < 50 | Minutes |
| S | 50-200 | < 1 hour |
| M | 200-500 | Few hours |
| L | 500-1000 | Half day |
| XL | > 1000 | Consider splitting |

**Best Practice**: Keep PRs small. Easier to review, faster to merge, lower risk.
