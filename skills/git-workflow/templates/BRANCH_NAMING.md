# Branch Naming Convention

## Pattern

```
<type>/<scope>/<description>
```

Or with ticket reference:

```
<type>/<ticket-id>/<description>
```

---

## Branch Types

### feature/
New functionality being added to the codebase.

```bash
# Examples
feature/user-auth/oauth-integration
feature/AUTH-123/oauth-integration
feature/checkout/stripe-payment-gateway
feature/dashboard/analytics-widgets
```

### fix/
Bug fixes that are not time-critical.

```bash
# Examples
fix/login/session-timeout-error
fix/BUG-456/cart-quantity-sync
fix/api/rate-limiting-header
fix/mobile/responsive-navbar
```

### hotfix/
Urgent production fixes requiring immediate attention.

```bash
# Examples
hotfix/payment-null-pointer
hotfix/INCIDENT-789/database-connection-leak
hotfix/security-xss-vulnerability
hotfix/production-memory-leak
```

### refactor/
Code improvements without changing functionality.

```bash
# Examples
refactor/api/response-handler-cleanup
refactor/utils/date-formatting-simplify
refactor/database/query-optimization
refactor/TECH-101/extract-service-layer
```

### docs/
Documentation changes only.

```bash
# Examples
docs/readme/installation-guide
docs/api/endpoint-documentation
docs/contributing/code-standards
docs/changelog/v2-release-notes
```

### test/
Test additions or modifications.

```bash
# Examples
test/unit/user-service-coverage
test/integration/checkout-flow
test/e2e/login-scenarios
test/performance/api-load-testing
```

### chore/
Maintenance tasks, dependency updates.

```bash
# Examples
chore/deps/upgrade-lodash
chore/ci/optimize-build-pipeline
chore/config/eslint-rules-update
chore/cleanup/remove-deprecated-code
```

---

## Naming Rules

### DO

1. **Use lowercase**: `feature/auth/login` not `Feature/Auth/Login`
2. **Use hyphens**: `user-authentication` not `user_authentication`
3. **Be concise**: 3-5 words maximum for description
4. **Be descriptive**: Branch name should indicate purpose
5. **Include scope**: `feature/api/user-endpoint` not `feature/user-endpoint`

### DON'T

1. **Avoid generic names**: not `feature/update` or `fix/bug`
2. **Avoid personal names**: not `johns-feature-branch`
3. **Avoid special characters**: no `@`, `#`, `&`, spaces
4. **Avoid long descriptions**: not `feature/implement-the-new-user-authentication-with-oauth`
5. **Avoid ambiguity**: not `feature/stuff` or `fix/changes`

---

## Scope Categories

Common scope values by area:

| Area | Scope Examples |
|------|----------------|
| Frontend | `ui`, `components`, `pages`, `styles` |
| Backend | `api`, `services`, `database`, `auth` |
| Infrastructure | `ci`, `config`, `deploy`, `docker` |
| General | `core`, `utils`, `types`, `models` |

---

## Examples by Project Type

### Web Application

```bash
feature/auth/google-oauth-login
feature/dashboard/real-time-notifications
fix/cart/quantity-update-race-condition
hotfix/checkout/payment-gateway-timeout
refactor/api/standardize-error-responses
```

### API Service

```bash
feature/endpoints/user-preferences-crud
feature/middleware/rate-limiting
fix/validation/email-format-edge-case
hotfix/auth/token-refresh-loop
refactor/handlers/extract-common-logic
```

### Mobile App

```bash
feature/screens/onboarding-flow
feature/ui/dark-mode-support
fix/navigation/back-button-android
hotfix/crash/null-user-profile
refactor/state/migrate-to-redux-toolkit
```

---

## Branch Lifecycle

```
CREATE → DEVELOP → PR → MERGE → DELETE

main
  │
  └── feature/auth/oauth ──┐
       │                   │
       ├── commit         PR
       ├── commit          │
       ├── commit          │
       └── commit ─────────┤
                           │
main ◄─────────────────────┘
```

### Commands

```bash
# Create branch
git checkout -b feature/auth/oauth-integration

# Push to remote
git push -u origin feature/auth/oauth-integration

# After merge, delete local
git branch -d feature/auth/oauth-integration

# Delete remote
git push origin --delete feature/auth/oauth-integration
```

---

## Team Conventions

### With Ticket System

If using Jira, Linear, GitHub Issues:

```bash
feature/AUTH-123/oauth-integration
fix/BUG-456/cart-sync-issue
hotfix/INC-789/payment-failure
```

### Without Ticket System

Use descriptive names:

```bash
feature/user-profile/avatar-upload
fix/search/special-characters-escape
hotfix/security/sql-injection-fix
```

---

## Validation Regex

For CI/CD enforcement:

```regex
^(feature|fix|hotfix|refactor|docs|test|chore)\/[a-z0-9-]+\/[a-z0-9-]+$
```

With optional ticket ID:

```regex
^(feature|fix|hotfix|refactor|docs|test|chore)\/([A-Z]+-[0-9]+\/)?[a-z0-9-]+$
```
