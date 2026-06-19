# Verification Methods

Techniques for verifying file paths and changes before planning.

---

## Path Verification

### Principle: Never Hallucinate Paths

Before listing ANY file in a change plan:

| Action | Verification Required |
|--------|----------------------|
| Create | Parent directory exists |
| Modify | File exists |
| Delete | File exists |

---

## Verification Commands

### Check File Exists

```bash
# Single file
test -f path/to/file.ts && echo "exists" || echo "missing"

# With ls
ls -la path/to/file.ts 2>/dev/null || echo "missing"
```

### Check Directory Exists

```bash
# Single directory
test -d path/to/dir && echo "exists" || echo "missing"

# With ls
ls -d path/to/dir 2>/dev/null || echo "missing"
```

### Find Files by Pattern

```bash
# Find all TypeScript files
find . -name "*.ts" -type f

# Find by partial name
find . -name "*Button*" -type f

# Find in specific directory
find src/components -name "*.tsx"
```

### Glob Patterns

```bash
# All TypeScript in src
ls src/**/*.ts 2>/dev/null

# All components
ls src/components/**/*.tsx 2>/dev/null

# All test files
ls **/*.test.ts 2>/dev/null
```

---

## Structure Verification

### Project Structure Scan

```bash
# Tree view (if available)
tree -L 3 src/

# Without tree
find src -type d -maxdepth 3 | head -50

# Just directories
ls -d */
```

### Common Structure Patterns

#### Next.js App Router

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── [feature]/
│       └── page.tsx
├── components/
├── hooks/
├── lib/
└── types/
```

#### React SPA

```
src/
├── components/
├── pages/
├── hooks/
├── utils/
├── types/
├── services/
└── App.tsx
```

#### Node.js API

```
src/
├── routes/
├── controllers/
├── services/
├── models/
├── middleware/
└── index.ts
```

---

## Import Verification

### Find Existing Imports

```bash
# What does this file import?
grep "^import" src/file.ts
grep "^from" src/file.ts

# What imports this file?
grep -r "from ['\"].*file['\"]" src/
```

### Verify Import Path

```bash
# Given import: from '@/components/Button'
# Resolve @ alias (check tsconfig.json or jsconfig.json)
cat tsconfig.json | grep "paths"

# Check resolved path exists
ls -la src/components/Button.tsx
```

### Check Barrel Exports

```bash
# Does index.ts export this?
grep "export.*Button" src/components/index.ts
```

---

## Type Verification

### Find Type Definitions

```bash
# Find type/interface by name
grep -rn "interface UserProps" src/
grep -rn "type UserProps" src/

# Find in .d.ts files
find . -name "*.d.ts" -exec grep -l "UserProps" {} \;
```

### Check Type Usage

```bash
# Where is this type used?
grep -rn ": UserProps" src/
grep -rn "<UserProps>" src/
```

---

## Configuration Verification

### Check Config Files Exist

```bash
# Common config files
ls -la \
  package.json \
  tsconfig.json \
  next.config.js \
  tailwind.config.js \
  .env \
  .env.local \
  2>/dev/null
```

### Verify Config Content

```bash
# Check for specific config
grep "darkMode" tailwind.config.js
grep "baseUrl" tsconfig.json
```

---

## Database Verification

### Check Migration Status

```bash
# Prisma
npx prisma migrate status

# TypeORM
npx typeorm migration:show

# Drizzle
npx drizzle-kit status
```

### Verify Schema

```bash
# Prisma schema
cat prisma/schema.prisma | grep -A5 "model User"

# Check existing tables (if DB access)
npx prisma db pull --print
```

---

## API Verification

### Find Existing Endpoints

```bash
# Next.js App Router API routes
find src/app/api -name "route.ts"

# Express routes
grep -r "router\." src/routes/
grep -r "app\.(get|post|put|delete)" src/
```

### Check Route Handlers

```bash
# What HTTP methods are handled?
grep -E "(GET|POST|PUT|DELETE|PATCH)" src/app/api/users/route.ts
```

---

## Verification Checklist

### Before Creating File

- [ ] Parent directory exists
- [ ] No existing file with same name
- [ ] Naming follows project conventions
- [ ] Path follows project structure

### Before Modifying File

- [ ] File exists at specified path
- [ ] Have read current content
- [ ] Understand current implementation
- [ ] Know what imports this file

### Before Deleting File

- [ ] File exists at specified path
- [ ] No other files import this
- [ ] Functionality moved/obsolete
- [ ] Tests updated/removed

### Before Adding Import

- [ ] Source file exists
- [ ] Export exists in source
- [ ] No circular dependency created
- [ ] Path alias resolves correctly

---

## Quick Verification Script

```bash
#!/bin/bash
# verify-change-plan.sh

echo "=== Verifying File Change Plan ==="

# Files to create - check parent exists
echo -e "\n📁 Files to Create:"
for path in "$@"; do
  dir=$(dirname "$path")
  if [ -d "$dir" ]; then
    echo "  ✅ $path (parent exists)"
  else
    echo "  ❌ $path (parent missing: $dir)"
  fi
done

# Files to modify - check file exists
echo -e "\n📝 Files to Modify:"
for path in "$@"; do
  if [ -f "$path" ]; then
    echo "  ✅ $path"
  else
    echo "  ❌ $path (not found)"
  fi
done

# Files to delete - check file exists
echo -e "\n🗑️ Files to Delete:"
for path in "$@"; do
  if [ -f "$path" ]; then
    # Check if imported elsewhere
    imports=$(grep -r "from ['\"].*$(basename "$path" .ts)['\"]" --include="*.ts" | wc -l)
    if [ "$imports" -gt 0 ]; then
      echo "  ⚠️  $path (imported in $imports files)"
    else
      echo "  ✅ $path (no imports found)"
    fi
  else
    echo "  ❌ $path (not found)"
  fi
done
```

---

## Error Prevention

| Error | Prevention |
|-------|------------|
| File not found | Verify exists before listing |
| Wrong path | Use actual path from filesystem |
| Missing directory | Check parent exists |
| Circular import | Trace import graph |
| Broken export | Verify export exists |
