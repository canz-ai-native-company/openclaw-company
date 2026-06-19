# GitHub Pull Request Workflow

Best practices for pull request management on GitHub.

---

## PR Lifecycle

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  CREATE ──► REVIEW ──► FEEDBACK ──► UPDATE ──► APPROVE ──► MERGE │
│                           │                       │               │
│                           └───────────────────────┘               │
│                              (iterate)                           │
└──────────────────────────────────────────────────────────────────┘
```

### States

| State | Description | Owner |
|-------|-------------|-------|
| Draft | Work in progress | Author |
| Ready for Review | Awaiting review | Author |
| Changes Requested | Needs updates | Author |
| Approved | Ready to merge | Reviewer |
| Merged | Complete | Author |
| Closed | Abandoned | Either |

---

## Creating a PR

### Before Creating

1. **Ensure branch is up to date**
   ```bash
   git fetch origin main
   git rebase origin/main
   # or
   git merge origin/main
   ```

2. **Run tests locally**
   ```bash
   npm test
   npm run lint
   ```

3. **Self-review your changes**
   ```bash
   git diff main...HEAD
   ```

### Creating the PR

#### Using GitHub CLI

```bash
# Create PR with prompts
gh pr create

# Create with options
gh pr create \
  --title "feat(auth): add OAuth2 login" \
  --body "Adds Google OAuth2 authentication" \
  --base main \
  --label "feature" \
  --assignee @me \
  --reviewer teammate1,teammate2
```

#### Draft PRs

Use drafts for:
- Work in progress
- Early feedback before completion
- Sharing approach for discussion

```bash
gh pr create --draft
```

Convert when ready:
```bash
gh pr ready
```

---

## PR Description

### Essential Sections

```markdown
## Summary
Brief description of what this PR does.

## Changes
- Change 1
- Change 2

## Testing
How changes were verified.

## Related
- Issue: #123
```

### Optional Sections

```markdown
## Screenshots
Before/after images for UI changes.

## Breaking Changes
What breaks and how to migrate.

## Notes for Reviewers
Areas needing special attention.

## Deployment
Special deployment considerations.
```

---

## Requesting Review

### Choosing Reviewers

| Consider | Why |
|----------|-----|
| Code owners | Required approvers for certain paths |
| Domain experts | Know the affected systems |
| Recent contributors | Familiar with recent changes |
| On-call engineer | For urgent changes |

### Using CODEOWNERS

`.github/CODEOWNERS`:
```
# Default
* @team/engineering

# Specific paths
/src/auth/ @security-team
/docs/ @tech-writers
*.sql @database-team
```

### Review Requests

```bash
# Add reviewers
gh pr edit --add-reviewer teammate1,teammate2

# Request re-review after updates
gh pr edit --add-reviewer teammate1
```

---

## Responding to Feedback

### Types of Comments

| Type | Response |
|------|----------|
| Blocking | Must address before merge |
| Suggestion | Consider and decide |
| Question | Provide clarification |
| Nitpick | Address if easy |

### Handling Feedback

1. **Don't take it personally** - It's about the code
2. **Respond to every comment** - Even if just "Done"
3. **Ask for clarification** - If feedback is unclear
4. **Push fixes as new commits** - Makes re-review easier
5. **Use suggestions** - Accept inline suggestions when helpful

### Using GitHub Suggestions

Reviewers can propose:
```markdown
```suggestion
const user = await getUser(id);
```
```

Authors can:
- Accept individual suggestions
- Batch multiple suggestions into one commit

---

## Keeping PR Updated

### When Base Branch Changes

```bash
# Rebase approach (cleaner history)
git fetch origin main
git rebase origin/main
git push --force-with-lease

# Merge approach (preserves history)
git fetch origin main
git merge origin/main
git push
```

### Update Branch Button

GitHub provides "Update branch" button:
- **Merge**: Creates merge commit (default)
- **Rebase**: Rewrites commits on top of base

---

## Merging

### Merge Strategies

| Strategy | When to Use | History |
|----------|-------------|---------|
| Merge Commit | Preserve all commits | Non-linear |
| Squash | Many WIP commits | Linear |
| Rebase | Linear history preference | Linear |

### Merge Requirements

Configure in repository settings:
- [ ] Required approvals
- [ ] Required status checks
- [ ] Branch up to date
- [ ] Signed commits
- [ ] Linear history

### Merge Commands

```bash
# Merge via CLI
gh pr merge --merge    # Merge commit
gh pr merge --squash   # Squash
gh pr merge --rebase   # Rebase

# With options
gh pr merge --squash --delete-branch
```

---

## After Merge

### Cleanup

1. **Delete branch** (usually automatic)
   ```bash
   git branch -d feature/my-feature
   git push origin --delete feature/my-feature
   ```

2. **Update local main**
   ```bash
   git checkout main
   git pull origin main
   ```

3. **Close related issues** (usually automatic via keywords)

### Deployment

Depending on workflow:
- Auto-deploy on merge to main
- Manual deploy trigger
- Release branch workflow

---

## PR Best Practices

### Size

| Size | Lines | Review Time |
|------|-------|-------------|
| XS | < 50 | Minutes |
| S | 50-200 | < 1 hour |
| M | 200-500 | Few hours |
| L | 500-1000 | Half day |
| XL | > 1000 | Split it |

**Goal**: Keep PRs small enough to review in one sitting.

### Atomic Changes

Each PR should:
- Address one concern
- Be independently deployable
- Not depend on other PRs (usually)

### Stacked PRs

For large features, create dependent PRs:

```
main
  └── feature/auth-base (PR #1)
        └── feature/auth-ui (PR #2)
              └── feature/auth-tests (PR #3)
```

Tools: `gh-stack`, `graphite`, `ghstack`

---

## PR Labels

### Standard Labels

| Label | Purpose | Color |
|-------|---------|-------|
| `feature` | New functionality | Green |
| `bug` | Bug fix | Red |
| `docs` | Documentation | Blue |
| `dependencies` | Dep updates | Yellow |
| `breaking` | Breaking change | Orange |
| `wip` | Work in progress | Gray |

### Priority Labels

| Label | Meaning |
|-------|---------|
| `priority: critical` | Drop everything |
| `priority: high` | Review today |
| `priority: medium` | This week |
| `priority: low` | When available |

---

## GitHub CLI Reference

```bash
# Create PR
gh pr create

# List PRs
gh pr list
gh pr list --author @me
gh pr list --search "is:open review-requested:@me"

# View PR
gh pr view 123
gh pr view --web

# Check out PR
gh pr checkout 123

# Review PR
gh pr review 123 --approve
gh pr review 123 --request-changes --body "Please fix X"
gh pr review 123 --comment --body "Looks good overall"

# Merge PR
gh pr merge 123 --squash --delete-branch

# Close PR
gh pr close 123

# Reopen PR
gh pr reopen 123
```

---

## Automation

### GitHub Actions for PRs

```yaml
name: PR Checks
on: pull_request

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
      - run: npm run lint

  label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v5
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

### Auto-assign Reviewers

```yaml
name: Auto Assign
on: pull_request

jobs:
  assign:
    runs-on: ubuntu-latest
    steps:
      - uses: kentaro-m/auto-assign-action@v1
        with:
          configuration-path: .github/auto-assign.yml
```

### PR Title Lint

```yaml
name: PR Title
on:
  pull_request:
    types: [opened, edited]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: amannn/action-semantic-pull-request@v5
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
