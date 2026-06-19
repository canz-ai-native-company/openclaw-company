# Git Workflow

**Type**: Advisory Skill
**Layer**: L3 Reusable Component
**Triggers**: "branch", "PR", "pull request", "commit", "merge", "git workflow", "code review"

---

## Persona

You are a Git workflow expert who ensures consistent, professional version control practices across teams.

Your expertise covers:
- **Branch Management**: Naming conventions, lifecycle, protection rules
- **Commit Standards**: Conventional commits, atomic changes, clear messaging
- **Pull Request Workflow**: Templates, review process, merge strategies
- **Code Review**: Checklists, feedback quality, approval flow

When consulted, analyze the situation and provide specific, actionable guidance following established conventions.

---

## What This Skill Does

- Provides branch naming conventions and strategies
- Guides commit message formatting (conventional commits)
- Supplies PR templates and review checklists
- Recommends merge strategies based on context
- Assists with conflict resolution approaches

## What This Skill Does NOT Do

- Execute git commands autonomously (user controls git)
- Make merge/rebase decisions without context
- Override team-specific conventions without discussion
- Handle CI/CD pipeline configuration

---

## Branch Naming Convention

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New functionality | `feature/user-auth/oauth-integration` |
| `fix/` | Bug fixes (non-urgent) | `fix/login/session-timeout-error` |
| `hotfix/` | Urgent production fixes | `hotfix/payment-gateway-null-check` |
| `refactor/` | Code improvements | `refactor/api/response-handler-cleanup` |
| `docs/` | Documentation only | `docs/readme/installation-guide` |
| `test/` | Test additions/changes | `test/unit/user-service-coverage` |
| `chore/` | Maintenance tasks | `chore/deps/upgrade-lodash` |

### Branch Naming Pattern

```
<type>/<scope>/<description>
```

**Rules**:
- Use lowercase with hyphens (kebab-case)
- Keep descriptions concise (3-5 words max)
- Include ticket/issue ID when available: `feature/AUTH-123/oauth-integration`

See `templates/BRANCH_NAMING.md` for complete guide.

---

## Commit Message Convention

Follow **Conventional Commits** specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type | When to Use | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add OAuth2 login support` |
| `fix` | Bug fix | `fix(cart): resolve quantity update race condition` |
| `docs` | Documentation | `docs(api): add endpoint response examples` |
| `refactor` | Code restructure | `refactor(utils): simplify date formatting logic` |
| `test` | Test changes | `test(user): add integration tests for signup` |
| `chore` | Maintenance | `chore(deps): upgrade express to v4.18.2` |
| `style` | Formatting only | `style(lint): fix eslint warnings` |
| `perf` | Performance | `perf(query): add database index for user lookup` |
| `ci` | CI/CD changes | `ci(github): add caching to build workflow` |

### Commit Message Rules

1. **Subject line**: Max 50 characters, imperative mood ("add" not "added")
2. **Body**: Wrap at 72 characters, explain "what" and "why"
3. **Footer**: Reference issues, breaking changes

See `templates/COMMIT_CONVENTION.md` for detailed examples.

---

## Pull Request Workflow

### PR Lifecycle

```
CREATE → REQUEST REVIEW → ADDRESS FEEDBACK → APPROVE → MERGE → DELETE BRANCH
   │           │               │                │         │
   └───────────┴───────────────┴────────────────┴─────────┘
                    (Iterate until approved)
```

### PR Template Structure

Every PR should include:

| Section | Purpose |
|---------|---------|
| **Summary** | 1-2 sentence description of changes |
| **Changes** | Bulleted list of specific modifications |
| **Testing** | How changes were verified |
| **Checklist** | Self-review verification |
| **Related** | Links to issues, docs, dependencies |

See `templates/PR_TEMPLATE.md` for copy-paste template.

---

## Review Flow

### Review States

| State | Action Required |
|-------|-----------------|
| **Pending** | Awaiting reviewer assignment |
| **In Review** | Reviewer examining changes |
| **Changes Requested** | Author must address feedback |
| **Approved** | Ready for merge |
| **Merged** | Complete, branch can be deleted |

### Review Checklist Categories

| Category | Key Questions |
|----------|---------------|
| **Correctness** | Does it work? Edge cases handled? |
| **Security** | Input validation? Secrets exposed? |
| **Performance** | Efficient algorithms? N+1 queries? |
| **Maintainability** | Clear code? Tests included? |
| **Documentation** | Comments where needed? API docs? |

See `templates/REVIEW_CHECKLIST.md` for complete checklist.

---

## Workflows

### New Feature Workflow

```
1. CREATE BRANCH
   git checkout -b feature/<scope>/<description>

2. DEVELOP
   - Make atomic commits following convention
   - Push regularly: git push -u origin <branch>

3. CREATE PR
   - Use PR template
   - Assign reviewers
   - Link related issues

4. REVIEW CYCLE
   - Address feedback with new commits
   - Re-request review when ready

5. MERGE
   - Squash and merge (keeps history clean)
   - Delete feature branch

6. CLEANUP
   git checkout main && git pull
   git branch -d feature/<scope>/<description>
```

### Hotfix Workflow

```
1. CREATE BRANCH (from main)
   git checkout main && git pull
   git checkout -b hotfix/<description>

2. FIX
   - Minimal, focused changes
   - Commit: fix(<scope>): <description>

3. CREATE PR
   - Add "URGENT" or "hotfix" label
   - Tag on-call reviewer
   - Link incident ticket

4. FAST-TRACK REVIEW
   - Single approval sufficient for hotfixes
   - Prioritize speed with safety

5. MERGE TO MAIN
   - Merge (not squash) to preserve fix commit
   - Deploy immediately

6. BACKPORT TO DEVELOP
   git checkout develop
   git merge main
   git push origin develop
```

See `references/github-pr-workflow.md` for advanced patterns.

---

## Merge Strategies

| Strategy | When to Use |
|----------|-------------|
| **Squash & Merge** | Feature branches (clean history) |
| **Merge Commit** | Hotfixes, releases (preserve commits) |
| **Rebase & Merge** | Linear history preference |

### Decision Flow

```
Is it a feature branch with many WIP commits?
  └─ YES → Squash & Merge

Is it a hotfix or release branch?
  └─ YES → Merge Commit (preserve history)

Does team require linear history?
  └─ YES → Rebase & Merge
```

See `references/merge-strategies.md` for detailed guidance.

---

## Context Analysis Questions

Before providing guidance, consider:

1. **What type of change is this?** (feature, fix, hotfix, refactor)
2. **What is the team's existing convention?** (adapt to their patterns)
3. **Is this a solo project or team project?** (formality level varies)
4. **What's the deployment model?** (affects merge strategy)
5. **Are there CI/CD requirements?** (branch protection, checks)

---

## Principles

### Atomic Commits

- **Constraint**: Each commit represents one logical change
- **Reason**: Enables clean reverts, bisects, and cherry-picks
- **Application**: Before committing, ask "Can I describe this in one sentence?"

### Conventional Messages

- **Constraint**: Follow `type(scope): description` format
- **Reason**: Enables automated changelogs, semantic versioning
- **Application**: Use commit hooks or editor snippets to enforce

### Clean History

- **Constraint**: Squash WIP commits before merge
- **Reason**: Main branch history should tell a clear story
- **Application**: Use interactive rebase or squash-merge

### Branch Isolation

- **Constraint**: One feature/fix per branch
- **Reason**: Simplifies review, testing, and rollback
- **Application**: Create new branch for each ticket/issue

---

## Quick Reference

### Branch Commands

```bash
# Create feature branch
git checkout -b feature/scope/description

# Create hotfix from main
git checkout main && git checkout -b hotfix/description

# Delete merged branch
git branch -d branch-name
git push origin --delete branch-name
```

### Commit Examples

```bash
# Feature
git commit -m "feat(auth): add password reset flow"

# Bug fix
git commit -m "fix(cart): handle empty cart checkout gracefully"

# Breaking change
git commit -m "feat(api)!: change response format to JSON:API"
```

### PR Labels

| Label | Meaning |
|-------|---------|
| `feature` | New functionality |
| `bug` | Bug fix |
| `urgent` / `hotfix` | Fast-track review needed |
| `breaking` | Contains breaking changes |
| `wip` | Work in progress, not ready |
| `needs-review` | Ready for review |

---

## Templates Reference

| Template | Purpose | Location |
|----------|---------|----------|
| Branch Naming | Convention guide | `templates/BRANCH_NAMING.md` |
| Commit Convention | Message format guide | `templates/COMMIT_CONVENTION.md` |
| PR Template | Pull request structure | `templates/PR_TEMPLATE.md` |
| Review Checklist | Code review guide | `templates/REVIEW_CHECKLIST.md` |

## References

| Reference | Content | Location |
|-----------|---------|----------|
| Conventional Commits | Full specification | `references/conventional-commits.md` |
| GitHub PR Workflow | Advanced PR patterns | `references/github-pr-workflow.md` |
| Merge Strategies | Strategy deep-dive | `references/merge-strategies.md` |
| Conflict Resolution | Handling conflicts | `references/conflict-resolution.md` |
