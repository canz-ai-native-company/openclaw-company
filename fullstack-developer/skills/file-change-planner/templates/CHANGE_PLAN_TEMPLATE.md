# Change Plan Template

Standard template for changes affecting 3-5 files.

---

## Template

```markdown
## File Change Plan

**Request**: [One-line summary of what was requested]
**Scope**: Standard | **Files**: [N] | **Risk Level**: Low/Medium/High

---

### Files to Create

| File | Purpose | Dependencies |
|------|---------|--------------|
| `path/to/new/file.ts` | Description of purpose | None / List deps |

### Files to Modify

| File | Change Type | Description |
|------|-------------|-------------|
| `path/to/existing.ts` | Import/Logic/Config/Style/Type | What changes |

### Files to Delete

| File | Reason |
|------|--------|
| None | - |

---

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| None | - | - |

### API Impact

| Endpoint | Change | Breaking |
|----------|--------|----------|
| None | - | - |

### Database Impact

| Table | Change | Migration |
|-------|--------|-----------|
| None | - | - |

---

### Risk Areas

1. **[Risk Name]**: [Description]
   - Mitigation: [How to address]

2. **[Risk Name]**: [Description]
   - Mitigation: [How to address]

---

### Implementation Order

1. [First file/step]
2. [Second file/step]
3. [Continue...]

---

Proceed with implementation? **[Yes/No]**
```

---

## Example: Dark Mode Feature

```markdown
## File Change Plan

**Request**: Add dark mode toggle to application settings
**Scope**: Standard | **Files**: 4 | **Risk Level**: Medium

---

### Files to Create

| File | Purpose | Dependencies |
|------|---------|--------------|
| `src/components/DarkModeToggle.tsx` | Toggle switch component | useDarkMode hook |
| `src/hooks/useDarkMode.ts` | Dark mode state management | None |

### Files to Modify

| File | Change Type | Description |
|------|-------------|-------------|
| `src/app/layout.tsx` | Import | Add ThemeProvider wrapper |
| `tailwind.config.js` | Config | Add `darkMode: 'class'` |

### Files to Delete

| File | Reason |
|------|--------|
| None | - |

---

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| None | - | Using native CSS/Tailwind |

### API Impact

| Endpoint | Change | Breaking |
|----------|--------|----------|
| None | - | - |

### Database Impact

| Table | Change | Migration |
|-------|--------|-----------|
| None | - | Consider: user_preferences table for persistence |

---

### Risk Areas

1. **Theme Flash on Load**: Initial page load may flash wrong theme
   - Mitigation: Add blocking script in `<head>` to set theme before render

2. **SSR Hydration Mismatch**: Server renders one theme, client another
   - Mitigation: Use `suppressHydrationWarning` or defer theme application

---

### Implementation Order

1. Create `useDarkMode.ts` hook (no dependencies)
2. Update `tailwind.config.js` (enables dark: prefix)
3. Create `DarkModeToggle.tsx` (uses hook)
4. Update `layout.tsx` (integrates toggle)

---

Proceed with implementation? **[Yes/No]**
```

---

## Change Type Reference

| Type | When to Use | Example |
|------|-------------|---------|
| **Import** | Adding new imports | `import { Button } from './Button'` |
| **Logic** | Changing functionality | Adding new function, modifying algorithm |
| **Config** | Configuration changes | Environment variables, build config |
| **Style** | Visual/CSS changes | Adding classes, modifying styles |
| **Type** | TypeScript types | Interface changes, new types |
| **Export** | Module exports | Adding to index.ts barrel |

---

## Scope Guidelines

| File Count | Scope Label | Plan Depth |
|------------|-------------|------------|
| 1-2 | Minor | Minimal plan |
| 3-5 | Standard | This template |
| 6-10 | Major | Major template |
| 11+ | Epic | Split into phases |

---

## Risk Level Guidelines

| Level | Criteria |
|-------|----------|
| **Low** | No DB changes, no API changes, isolated components |
| **Medium** | Config changes, shared component modifications, new dependencies |
| **High** | DB schema changes, API breaking changes, auth/security changes |
