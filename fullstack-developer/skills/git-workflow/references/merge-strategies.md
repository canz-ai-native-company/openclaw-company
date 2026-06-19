# Git Merge Strategies

Comprehensive guide to choosing and using merge strategies.

---

## Three Merge Strategies

| Strategy | History | Use When |
|----------|---------|----------|
| **Merge Commit** | Non-linear, preserves all | Preserving context matters |
| **Squash** | Linear, single commit | Many WIP commits |
| **Rebase** | Linear, individual commits | Clean, linear history |

---

## Merge Commit

Creates a new commit that combines two branches.

```
Before:
main:    A---B---C
              \
feature:       D---E---F

After (merge commit):
main:    A---B---C-------M
              \         /
feature:       D---E---F
```

### Pros
- Preserves complete history
- Shows branch context
- Easy to revert entire feature
- Non-destructive

### Cons
- Non-linear history
- Noisy git log
- Harder to bisect

### When to Use
- Hotfixes and releases
- Preserving commit context important
- Collaborative branches
- Long-running branches

### Commands

```bash
# Standard merge
git checkout main
git merge feature/branch

# No fast-forward (always create merge commit)
git merge --no-ff feature/branch

# GitHub CLI
gh pr merge --merge
```

---

## Squash and Merge

Combines all commits into single commit on target branch.

```
Before:
main:    A---B---C
              \
feature:       D---E---F

After (squash):
main:    A---B---C---DEF

(feature commits combined into one)
```

### Pros
- Clean, linear history
- One commit per feature
- Easy to revert feature
- Hides WIP commits

### Cons
- Loses individual commit history
- Can't cherry-pick specific commits
- Large commits harder to review

### When to Use
- Feature branches with many WIP commits
- Solo developer branches
- When individual commits don't matter
- Standard team workflow

### Commands

```bash
# Interactive rebase (manual squash)
git checkout feature/branch
git rebase -i main
# Mark commits as "squash" or "fixup"

# Squash merge
git checkout main
git merge --squash feature/branch
git commit -m "feat: add feature"

# GitHub CLI
gh pr merge --squash
```

### Squash Commit Message

When squashing, write a proper commit message:

```
feat(auth): add OAuth2 Google login

- Add Google OAuth client configuration
- Create auth callback endpoints
- Implement token refresh logic
- Add "Sign in with Google" button

Closes #123
```

---

## Rebase and Merge

Replays commits on top of base branch.

```
Before:
main:    A---B---C
              \
feature:       D---E---F

After (rebase):
main:    A---B---C---D'---E'---F'

(D, E, F rewritten with new bases)
```

### Pros
- Linear history
- Individual commits preserved
- Clean git log
- Easy to bisect

### Cons
- Rewrites history (new commit hashes)
- Can complicate collaboration
- Potential for conflicts at each commit
- Never rebase shared branches

### When to Use
- Clean commit history on feature branch
- Personal branches only
- Team prefers linear history
- Each commit is meaningful

### Commands

```bash
# Rebase onto main
git checkout feature/branch
git rebase main
git push --force-with-lease

# Interactive rebase (clean up first)
git rebase -i main

# GitHub CLI
gh pr merge --rebase
```

### The Golden Rule

**Never rebase commits that have been pushed and shared with others.**

```bash
# Safe: personal feature branch
git push --force-with-lease origin feature/my-branch

# DANGEROUS: shared branch
git push --force origin main  # DON'T DO THIS
```

---

## Decision Flowchart

```
Is this a hotfix or release branch?
├── YES → Merge Commit (preserve history)
└── NO
    │
    Does branch have many WIP commits?
    ├── YES → Squash (clean up history)
    └── NO
        │
        Are individual commits meaningful?
        ├── YES → Rebase (preserve commits, linearize)
        └── NO → Squash (simplify)
```

### Quick Reference Table

| Scenario | Strategy |
|----------|----------|
| Feature with "wip", "fix typo" commits | Squash |
| Well-crafted atomic commits | Rebase |
| Hotfix to production | Merge |
| Release branch | Merge |
| Dependency updates | Squash |
| Refactoring with logical steps | Rebase |
| Experimental branch | Squash |

---

## Repository Settings

Configure default merge strategy in GitHub:

**Settings → General → Pull Requests**

- [x] Allow merge commits
- [x] Allow squash merging (default)
- [ ] Allow rebase merging

### Enforce Strategy

To force a single strategy:
- Enable only one option
- Or use branch protection rules

---

## Handling Conflicts

### During Merge

```bash
git merge feature/branch
# Conflicts occur

# Resolve conflicts in files
git add resolved-file.js
git merge --continue

# Or abort
git merge --abort
```

### During Rebase

```bash
git rebase main
# Conflicts occur at a commit

# Resolve conflicts
git add resolved-file.js
git rebase --continue

# Skip problematic commit
git rebase --skip

# Or abort
git rebase --abort
```

### During Squash

Conflicts handled same as merge, just once.

---

## Team Conventions

### Single Strategy Team

Pick one and stick with it:

```markdown
## Merge Strategy: Squash

All PRs are squash-merged. Ensure PR title follows
conventional commits as it becomes the commit message.
```

### Flexible Strategy Team

Document when to use each:

```markdown
## Merge Strategies

- **Squash**: Default for feature branches
- **Merge**: Hotfixes, releases, long-running branches
- **Rebase**: When author specifically requests
```

---

## Advanced: Fast-Forward Merge

Special case when no divergence exists.

```
Before:
main:    A---B---C
                 \
feature:          D---E

After (fast-forward):
main:    A---B---C---D---E
```

Simply moves the pointer, no merge commit.

```bash
# Default behavior when possible
git merge feature/branch

# Prevent fast-forward
git merge --no-ff feature/branch
```

**Note**: GitHub PR merges never fast-forward; they always create commits or rewrite history.

---

## Merge Strategy Comparison

| Aspect | Merge | Squash | Rebase |
|--------|-------|--------|--------|
| Linear History | No | Yes | Yes |
| Preserves Commits | Yes | No | Yes |
| Creates New Commit | Yes (merge) | Yes (squash) | Yes (all rewrites) |
| Revert Ease | One commit | One commit | Multiple commits |
| Git Bisect | Harder | Easy | Easy |
| Collaboration Safe | Yes | Yes | No (rewrites) |
| Conflict Resolution | Once | Once | Per commit |
