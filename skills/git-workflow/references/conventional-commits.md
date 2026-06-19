# Conventional Commits Specification

Complete reference for the Conventional Commits standard.

---

## Specification

Based on [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

### Structure

```
<type>[optional scope][optional !]: <description>

[optional body]

[optional footer(s)]
```

### Components

| Component | Required | Description |
|-----------|----------|-------------|
| `type` | Yes | Category of change |
| `scope` | No | Section of codebase affected |
| `!` | No | Indicates breaking change |
| `description` | Yes | Short summary |
| `body` | No | Detailed explanation |
| `footer` | No | Metadata (issues, breaking changes) |

---

## Types

### Standard Types

| Type | Description | SemVer Impact |
|------|-------------|---------------|
| `feat` | New feature | MINOR |
| `fix` | Bug fix | PATCH |

### Extended Types (Angular Convention)

| Type | Description | SemVer Impact |
|------|-------------|---------------|
| `docs` | Documentation only | None |
| `style` | Formatting, white-space | None |
| `refactor` | Neither feat nor fix | None |
| `perf` | Performance improvement | PATCH |
| `test` | Adding/correcting tests | None |
| `build` | Build system/dependencies | None |
| `ci` | CI configuration | None |
| `chore` | Other maintenance | None |
| `revert` | Reverts previous commit | Depends |

---

## Breaking Changes

Two ways to indicate breaking changes:

### Method 1: Footer

```
feat(api): add user endpoint

BREAKING CHANGE: The user endpoint now requires authentication.
All requests must include Bearer token.
```

### Method 2: ! After Type

```
feat(api)!: require authentication on user endpoint
```

### Method 3: Both

```
feat(api)!: require authentication on user endpoint

BREAKING CHANGE: All requests to /api/users must now include
a Bearer token in the Authorization header.
```

---

## Scope

Scope provides context about what part of the codebase changed.

### Scope Guidelines

1. **Use nouns**: `auth`, `api`, `database`
2. **Be specific**: `cart`, not `feature`
3. **Be consistent**: Pick scopes and reuse them
4. **Keep short**: Single word preferred

### Example Scopes by Domain

```
# Frontend
ui, components, pages, forms, styles, routing

# Backend
api, auth, database, cache, queue, middleware

# Infrastructure
ci, docker, k8s, terraform, config

# Cross-cutting
core, utils, types, models, i18n
```

---

## Description

The description is the commit subject line.

### Rules

1. **Imperative mood**: "add" not "added" or "adds"
2. **Lowercase**: Start with lowercase letter
3. **No period**: Don't end with period
4. **Max 50 chars**: Keep it brief
5. **Complete sentence**: Should complete "This commit will..."

### Good Descriptions

```
add user authentication flow
fix null pointer in checkout
update API response format
remove deprecated helper functions
implement rate limiting middleware
```

### Bad Descriptions

```
Added user authentication     # Past tense
Fix.                          # Too vague + period
Update stuff                  # Too vague
Adding user authentication    # Gerund form
User authentication feature   # Not imperative
```

---

## Body

The body provides additional context.

### Rules

1. **Blank line**: Separate from subject with blank line
2. **Wrap at 72**: Hard wrap at 72 characters
3. **Explain why**: Focus on motivation, not mechanics
4. **Use bullets**: For multiple points

### Example

```
fix(auth): handle expired refresh token gracefully

Previously, an expired refresh token caused the application
to throw an unhandled exception, resulting in a 500 error
shown to the user.

This change:
- Catches the specific TokenExpiredError
- Returns a 401 with clear error message
- Triggers automatic re-authentication on client

The error was affecting approximately 5% of returning users
who had been inactive for more than 24 hours.
```

---

## Footer

Footers contain metadata about the commit.

### Issue References

```
# Close issue on merge
Closes #123
Fixes #123
Resolves #123

# Reference without closing
Refs #123
See #123
Related to #123

# Multiple issues
Closes #123, #456, #789
```

### Breaking Change Footer

```
BREAKING CHANGE: <description>

<detailed explanation>
```

### Co-authors

```
Co-authored-by: Name <email@example.com>
Co-authored-by: Other Name <other@example.com>
```

### Signed-off-by

```
Signed-off-by: Name <email@example.com>
```

---

## Complete Examples

### Simple Feature

```
feat(auth): add password reset functionality
```

### Feature with Scope and Body

```
feat(dashboard): add real-time notification bell

Users can now see unread notifications in real-time without
refreshing the page. Notifications appear in a dropdown
when clicking the bell icon in the header.

Uses WebSocket connection for instant updates.

Closes #234
```

### Bug Fix

```
fix(cart): prevent duplicate item addition on rapid clicks

Added debounce to the "Add to Cart" button and server-side
idempotency check to handle race conditions.

Fixes #456
```

### Breaking Change

```
feat(api)!: change response format to JSON:API

BREAKING CHANGE: All API responses now follow JSON:API spec.

Previous format:
{ "user": { "id": 1, "name": "John" } }

New format:
{ "data": { "type": "user", "id": "1", "attributes": { "name": "John" } } }

Migration guide: https://docs.example.com/api-v2-migration

Closes #567
```

### Revert

```
revert: feat(auth): add OAuth2 Google login

This reverts commit a1b2c3d4e5f6.

OAuth2 integration causing login failures for subset of users.
Reverting while root cause is investigated.

Refs #678
```

---

## Automation Benefits

### Semantic Versioning

Conventional commits enable automatic version bumps:

| Commit Type | Version Bump |
|-------------|--------------|
| `fix:` | PATCH (1.0.0 → 1.0.1) |
| `feat:` | MINOR (1.0.0 → 1.1.0) |
| `feat!:` or `BREAKING CHANGE:` | MAJOR (1.0.0 → 2.0.0) |

### Changelog Generation

Tools like `standard-version` or `semantic-release` can auto-generate:

```markdown
## [2.1.0] - 2024-01-15

### Features
- **auth**: add OAuth2 Google login (#123)
- **dashboard**: add real-time notifications (#234)

### Bug Fixes
- **cart**: prevent duplicate item addition (#456)

### BREAKING CHANGES
- **api**: response format changed to JSON:API
```

---

## Tools

### commitlint

Validates commit messages against conventional commits:

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

`.commitlintrc.json`:
```json
{
  "extends": ["@commitlint/config-conventional"]
}
```

### Husky

Git hooks to enforce commit messages:

```bash
npx husky install
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

### Commitizen

Interactive commit message builder:

```bash
npm install -D commitizen cz-conventional-changelog
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

Use with `git cz` instead of `git commit`.

---

## Why Conventional Commits?

1. **Automatic CHANGELOGs**: Generate release notes automatically
2. **Semantic Versioning**: Determine version bumps from commits
3. **Communication**: Clear history of what changed and why
4. **CI/CD Triggers**: Different pipelines based on commit type
5. **Searchability**: Filter commits by type or scope
6. **Team Alignment**: Consistent format across contributors
