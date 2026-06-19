# Commit Message Convention

Based on the [Conventional Commits](https://www.conventionalcommits.org/) specification.

---

## Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

---

## Quick Reference

```bash
# Feature
git commit -m "feat(auth): add password reset functionality"

# Bug fix
git commit -m "fix(cart): resolve quantity sync issue"

# Breaking change
git commit -m "feat(api)!: change response format to JSON:API"

# With body
git commit -m "fix(auth): handle expired token gracefully

Previously, expired tokens caused a 500 error.
Now returns 401 with clear message.

Closes #123"
```

---

## Commit Types

| Type | Description | Triggers |
|------|-------------|----------|
| `feat` | New feature | Minor version bump |
| `fix` | Bug fix | Patch version bump |
| `docs` | Documentation only | No version bump |
| `style` | Formatting, no code change | No version bump |
| `refactor` | Code change, no feature/fix | No version bump |
| `perf` | Performance improvement | Patch version bump |
| `test` | Adding/updating tests | No version bump |
| `chore` | Maintenance tasks | No version bump |
| `ci` | CI/CD changes | No version bump |
| `build` | Build system changes | No version bump |
| `revert` | Reverting previous commit | Depends on reverted |

---

## Type Details

### feat
New feature for the user.

```bash
feat(auth): add OAuth2 Google login
feat(dashboard): implement real-time notifications
feat(api): add user preferences endpoint
feat(ui): add dark mode toggle
```

### fix
Bug fix for the user.

```bash
fix(cart): handle empty cart checkout gracefully
fix(login): resolve session persistence issue
fix(search): escape special characters in query
fix(api): return correct status code for validation errors
```

### docs
Documentation changes only.

```bash
docs(readme): add installation instructions
docs(api): document rate limiting headers
docs(contributing): update PR guidelines
docs(changelog): add v2.0.0 release notes
```

### style
Code style changes (formatting, semicolons, etc).

```bash
style(lint): fix eslint warnings
style(format): apply prettier to all files
style(imports): sort imports alphabetically
style(whitespace): remove trailing spaces
```

### refactor
Code restructuring without feature/fix.

```bash
refactor(auth): extract token validation logic
refactor(api): simplify error handling middleware
refactor(utils): consolidate date formatting functions
refactor(database): optimize query builder
```

### perf
Performance improvements.

```bash
perf(query): add index for user lookup
perf(images): implement lazy loading
perf(bundle): enable tree shaking
perf(cache): add Redis caching layer
```

### test
Test additions or modifications.

```bash
test(auth): add unit tests for login service
test(api): add integration tests for user endpoint
test(e2e): add checkout flow scenarios
test(coverage): increase branch coverage to 80%
```

### chore
Maintenance tasks.

```bash
chore(deps): upgrade express to v4.18.2
chore(config): update eslint rules
chore(cleanup): remove deprecated methods
chore(release): bump version to 2.0.0
```

### ci
CI/CD configuration changes.

```bash
ci(github): add caching to build workflow
ci(docker): optimize Dockerfile layers
ci(test): run tests in parallel
ci(deploy): add staging environment
```

---

## Scope

Scope indicates the section of codebase affected.

### Common Scopes

| Area | Scopes |
|------|--------|
| Frontend | `ui`, `components`, `pages`, `styles`, `forms` |
| Backend | `api`, `services`, `database`, `auth`, `middleware` |
| Infrastructure | `ci`, `docker`, `config`, `deploy` |
| General | `core`, `utils`, `types`, `models`, `tests` |

### Scope Rules

1. **Lowercase**: `auth` not `Auth`
2. **Single word preferred**: `auth` not `user-auth`
3. **Optional but recommended**: Helps filter commits
4. **Consistent within project**: Pick scopes and stick with them

---

## Description

The description is a short summary of the change.

### Rules

1. **Imperative mood**: "add" not "added" or "adds"
2. **Lowercase first letter**: "add feature" not "Add feature"
3. **No period at end**: "add login" not "add login."
4. **Max 50 characters**: Keep it concise

### Good Examples

```
add user authentication flow
fix null pointer in checkout
update API response format
remove deprecated helper functions
```

### Bad Examples

```
Added user authentication  # Past tense
Fix.                       # Period + vague
Update stuff               # Vague
This commit adds a new feature for user authentication which allows users to log in  # Too long
```

---

## Body

Explain **what** and **why**, not how.

### Format

- Blank line between subject and body
- Wrap at 72 characters
- Use bullet points for multiple items

### Example

```
fix(auth): handle expired refresh token gracefully

Previously, an expired refresh token caused the application
to throw an unhandled exception, resulting in a 500 error.

This change:
- Catches the expired token error specifically
- Returns a 401 status with clear error message
- Triggers automatic logout on the client

The user experience is now much cleaner when sessions expire.
```

---

## Footer

Used for metadata like issue references and breaking changes.

### Issue References

```bash
# Close issue
Closes #123

# Reference without closing
Refs #123

# Multiple issues
Closes #123, #456
```

### Breaking Changes

```bash
# Method 1: In footer
BREAKING CHANGE: API response format changed from XML to JSON

# Method 2: With ! in type
feat(api)!: change response format to JSON
```

---

## Complete Examples

### Simple Commit

```
feat(auth): add password reset email
```

### With Body

```
fix(cart): prevent duplicate item addition

When rapidly clicking "Add to Cart", multiple requests could
complete before the UI updated, causing duplicate items.

Added debounce to the click handler and server-side idempotency
check to prevent this race condition.
```

### With Breaking Change

```
feat(api)!: change authentication to JWT

BREAKING CHANGE: Session-based authentication removed.
All clients must now send Bearer token in Authorization header.

Migration guide: https://docs.example.com/jwt-migration

Closes #234
```

### Revert

```
revert: feat(auth): add OAuth2 Google login

This reverts commit abc123def456.

OAuth2 integration causing login failures for existing users.
Rolling back while investigating root cause.

Refs #345
```

---

## Git Hooks

### commitlint Configuration

`.commitlintrc.json`:

```json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [2, "always", [
      "feat", "fix", "docs", "style", "refactor",
      "perf", "test", "chore", "ci", "build", "revert"
    ]],
    "scope-case": [2, "always", "lowercase"],
    "subject-case": [2, "always", "lowercase"],
    "subject-max-length": [2, "always", 50],
    "body-max-line-length": [2, "always", 72]
  }
}
```

### Husky Pre-Commit Hook

```bash
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```
