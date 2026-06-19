# Git Conflict Resolution

Guide to understanding, preventing, and resolving merge conflicts.

---

## Understanding Conflicts

Conflicts occur when:
- Same lines changed in both branches
- File deleted in one branch, modified in another
- File renamed differently in both branches

```
<<<<<<< HEAD
Your changes here
=======
Their changes here
>>>>>>> feature-branch
```

---

## Conflict Markers

```
<<<<<<< HEAD
Code from current branch (yours)
||||||| merged common ancestors (with diff3)
Original code before changes
=======
Code from incoming branch (theirs)
>>>>>>> branch-name
```

### Enable diff3 (Recommended)

Shows original version too:

```bash
git config --global merge.conflictstyle diff3
```

---

## Resolution Strategies

### 1. Keep Ours

Keep your version, discard theirs:

```bash
# For entire file
git checkout --ours path/to/file.js

# During merge
git merge -X ours feature-branch
```

### 2. Keep Theirs

Keep their version, discard yours:

```bash
# For entire file
git checkout --theirs path/to/file.js

# During merge
git merge -X theirs feature-branch
```

### 3. Manual Merge

Edit file to combine changes:

```javascript
// Before
<<<<<<< HEAD
const MAX_RETRIES = 3;
=======
const MAX_RETRIES = 5;
>>>>>>> feature-branch

// After (your decision)
const MAX_RETRIES = 5;
```

---

## Resolution Workflow

### During Merge

```bash
# Start merge
git merge feature-branch
# Conflicts occur...

# See conflicted files
git status

# Resolve each file
# Option 1: Edit manually
code path/to/file.js  # Edit, remove markers
git add path/to/file.js

# Option 2: Use tool
git mergetool

# Complete merge
git merge --continue

# Or abort if needed
git merge --abort
```

### During Rebase

```bash
# Start rebase
git rebase main
# Conflicts occur...

# Resolve conflicts
git add path/to/file.js

# Continue to next commit
git rebase --continue

# Or skip this commit
git rebase --skip

# Or abort entirely
git rebase --abort
```

### During Cherry-Pick

```bash
# Cherry-pick commit
git cherry-pick abc123
# Conflicts occur...

# Resolve and continue
git add path/to/file.js
git cherry-pick --continue

# Or abort
git cherry-pick --abort
```

---

## Visual Tools

### VS Code

1. Open conflicted file
2. Click "Accept Current", "Accept Incoming", "Accept Both", or "Compare"
3. Save and stage

### Git Mergetool

```bash
# Configure tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# Use tool
git mergetool
```

### Common Tools

| Tool | Command |
|------|---------|
| VS Code | `code --wait` |
| Vim | `vimdiff` |
| Meld | `meld` |
| Beyond Compare | `bcomp` |
| KDiff3 | `kdiff3` |

---

## Common Conflict Scenarios

### Scenario 1: Same Line Changed

```
<<<<<<< HEAD
const timeout = 5000;
=======
const timeout = 10000;
>>>>>>> feature
```

**Resolution**: Decide which value is correct, or if both changes serve different purposes.

### Scenario 2: Adjacent Changes

```
<<<<<<< HEAD
function process(data) {
  validate(data);
  return transform(data);
=======
function process(data) {
  log(data);
  return transform(data);
>>>>>>> feature
```

**Resolution**: Often both changes are needed:

```javascript
function process(data) {
  validate(data);
  log(data);
  return transform(data);
}
```

### Scenario 3: File Deleted vs Modified

```
CONFLICT (modify/delete): file.js deleted in HEAD
and modified in feature. Version feature of file.js
left in tree.
```

**Resolution**:
```bash
# Keep the file
git add file.js

# Remove the file
git rm file.js
```

### Scenario 4: Rename Conflict

```
CONFLICT (rename/rename): Rename "old.js"->"new1.js"
in HEAD. Rename "old.js"->"new2.js" in feature.
```

**Resolution**: Choose correct name and consolidate changes:
```bash
git add new1.js  # or new2.js
git rm new1.js   # remove the unwanted one
```

---

## Preventing Conflicts

### Communication

- Coordinate on shared files
- Discuss before major refactoring
- Use feature flags for parallel work

### Workflow

- Keep branches short-lived
- Sync frequently with main
- Smaller, focused commits

### Code Organization

- Modular code structure
- Avoid god files
- Clear ownership boundaries

### Tools

```bash
# Sync before starting work
git fetch origin
git rebase origin/main

# Check for potential conflicts
git merge --no-commit --no-ff feature
git merge --abort
```

---

## Complex Resolution

### Rerere (Reuse Recorded Resolution)

Git remembers how you resolved conflicts:

```bash
# Enable rerere
git config --global rerere.enabled true

# When conflict occurs and you resolve it,
# git records the resolution

# Next time same conflict occurs,
# git applies the recorded resolution automatically
```

### Interactive Rebase for Cleanup

Before creating PR, clean up commits:

```bash
git rebase -i main

# In editor:
pick abc123 feat: add login
squash def456 fix typo
squash ghi789 fix another typo
pick jkl012 feat: add logout
```

---

## Emergency Procedures

### Stuck in Merge State

```bash
# Check state
git status

# Abort merge
git merge --abort

# If that fails, reset
git reset --hard HEAD
```

### Stuck in Rebase State

```bash
# Abort rebase
git rebase --abort

# If that fails
git reset --hard ORIG_HEAD
```

### Nuclear Option

```bash
# Save current work
git stash

# Reset to known good state
git reset --hard origin/main

# Reapply your changes manually
git stash pop
```

---

## Conflict Resolution Checklist

Before marking as resolved:

- [ ] All conflict markers removed (`<<<<<<<`, `=======`, `>>>>>>>`)
- [ ] Code compiles/parses
- [ ] Tests pass
- [ ] Logic makes sense (both changes preserved if needed)
- [ ] No duplicate code introduced
- [ ] Imports/dependencies resolved

```bash
# Verify no markers remain
git diff --check

# Run tests
npm test
```

---

## Best Practices

### Do

1. **Read both versions** - Understand intent before resolving
2. **Test after resolution** - Ensure code works
3. **Commit with context** - Explain non-obvious resolutions
4. **Ask when unsure** - Consult original authors

### Don't

1. **Don't blindly accept** - "Ours" or "theirs" without reading
2. **Don't leave markers** - Always remove conflict markers
3. **Don't resolve unfamiliar code** - Get help from owner
4. **Don't rush** - Conflicts need attention

### Commit Message for Conflict Resolution

```
Merge branch 'feature' into main

Resolved conflicts:
- src/auth.js: Combined validation logic from both branches
- config.js: Kept feature branch timeout value (10000ms)
```
