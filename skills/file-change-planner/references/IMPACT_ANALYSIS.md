# Impact Analysis Guide

How to systematically assess change impacts.

---

## Impact Analysis Framework

```
Change Request
      │
      ▼
┌─────────────┐
│   DIRECT    │  Files explicitly changed
│   IMPACT    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  INDIRECT   │  Files importing/using changed files
│   IMPACT    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  EXTERNAL   │  APIs, databases, third-party services
│   IMPACT    │
└─────────────┘
```

---

## Direct Impact Analysis

### Identifying Direct Changes

| Change Type | How to Identify |
|-------------|-----------------|
| New file | Requirement states "create", "add", "new" |
| File modification | Existing feature mentioned |
| File deletion | Deprecated/replaced features |
| Configuration | Environment, build, or runtime settings |

### Questions to Ask

1. **What files will I directly edit?**
2. **What new files must I create?**
3. **What files are being replaced/removed?**
4. **What configuration changes are needed?**

---

## Indirect Impact Analysis

### Finding Dependents

```bash
# Find files importing a module
grep -r "from './module'" --include="*.ts" --include="*.tsx"
grep -r "import.*module" --include="*.ts" --include="*.tsx"

# Find usage of a function/component
grep -r "ComponentName" --include="*.tsx"
grep -r "functionName(" --include="*.ts"
```

### Dependency Directions

```
UPSTREAM (what this depends on)
         │
         ▼
   [Changed File]
         │
         ▼
DOWNSTREAM (what depends on this)
```

| Direction | Impact Type | Example |
|-----------|-------------|---------|
| Upstream | This file may break | Changed API of imported module |
| Downstream | Other files may break | Consumers of exported function |

### Common Indirect Impacts

| Changed | Check Impacts On |
|---------|------------------|
| Component props | All usages of component |
| Function signature | All callers |
| Type definition | All files using type |
| Export | All importers |
| Context value | All consumers |
| Hook return value | All usages |

---

## External Impact Analysis

### API Impact

| Check | Method |
|-------|--------|
| Endpoint changes | Review route handlers |
| Response format | Check serialization |
| Request validation | Check input schemas |
| Error responses | Check error handlers |
| Rate limits | Check throttling config |

### Database Impact

| Check | Method |
|-------|--------|
| Schema changes | Review migrations |
| Query changes | Check ORM/SQL |
| Index needs | Analyze query patterns |
| Data volume | Estimate row counts |
| Migration time | Test with prod-like data |

### Third-Party Impact

| Check | Method |
|-------|--------|
| API calls | Search for API client usage |
| Webhooks | Check webhook handlers |
| OAuth | Check auth flows |
| CDN | Check asset references |

---

## Impact Categories

### Code Impact

| Category | Examples | How to Find |
|----------|----------|-------------|
| Type changes | Interface modifications | Search type usages |
| API changes | Function signatures | Search function calls |
| Component changes | Props, behavior | Search component usage |
| Utility changes | Helper modifications | Search import statements |

### Build Impact

| Category | Examples | How to Verify |
|----------|----------|---------------|
| Dependencies | New packages | Check package.json |
| Configuration | Build settings | Check config files |
| Environment | New env vars | Check .env files |
| Scripts | Build commands | Check package.json scripts |

### Runtime Impact

| Category | Examples | How to Verify |
|----------|----------|---------------|
| Performance | New operations | Profile before/after |
| Memory | New state | Monitor memory usage |
| Network | New API calls | Check network tab |
| Storage | localStorage/DB | Review storage operations |

### Deployment Impact

| Category | Examples | How to Verify |
|----------|----------|---------------|
| Infrastructure | New services | Check deploy configs |
| Secrets | New credentials | Check secret management |
| Migrations | Database changes | Review migration files |
| Feature flags | New flags | Check flag management |

---

## Impact Assessment Template

```markdown
## Impact Assessment: [Change Name]

### Direct Changes
| File | Change Type | Description |
|------|-------------|-------------|

### Indirect Changes (Dependents)
| File | Why Affected | Change Needed |
|------|--------------|---------------|

### API Impact
| Endpoint | Change | Breaking |
|----------|--------|----------|

### Database Impact
| Entity | Change | Migration |
|--------|--------|-----------|

### Third-Party Impact
| Service | Change | Action |
|---------|--------|--------|

### Build Impact
| Area | Change | Verification |
|------|--------|--------------|

### Runtime Impact
| Metric | Expected Change | Acceptable |
|--------|-----------------|------------|
```

---

## Analysis Commands

### Find Imports

```bash
# TypeScript/JavaScript
grep -r "from ['\"].*module" src/
grep -r "require(['\"].*module" src/

# Python
grep -r "from module import" .
grep -r "import module" .
```

### Find Usages

```bash
# Find function calls
grep -rn "functionName(" src/

# Find component usage
grep -rn "<ComponentName" src/

# Find type usage
grep -rn ": TypeName" src/
```

### Find Exports

```bash
# Find what a file exports
grep -n "export" src/file.ts

# Find re-exports
grep -r "export \* from" src/
```

### Dependency Tree

```bash
# npm
npm ls

# Show why a package is installed
npm explain <package>

# Find unused dependencies
npx depcheck
```

---

## Impact Severity Levels

| Level | Description | Example |
|-------|-------------|---------|
| **None** | No downstream impact | Internal refactor |
| **Low** | Few files, easy changes | Type narrowing |
| **Medium** | Multiple files, straightforward | Prop rename |
| **High** | Many files, careful changes | API change |
| **Critical** | External impact, coordination | Breaking API |

### Severity Guidelines

```
Impact Files + Change Complexity = Severity

1-2 files + simple change = Low
3-5 files + simple change = Medium
1-2 files + complex change = Medium
6+ files OR complex change = High
External API + any change = Critical
Database schema + any change = High/Critical
```
