# Major Change Plan Template

Extended template for changes affecting 6+ files.

---

## Template

```markdown
## File Change Plan

**Request**: [One-line summary]
**Scope**: Major | **Files**: [N] | **Risk Level**: High
**Estimated Phases**: [N]

---

## Executive Summary

[2-3 sentences describing the overall change and its impact]

---

## Phase 1: [Phase Name]

### Files to Create

| File | Purpose | Dependencies |
|------|---------|--------------|
| `path/to/file.ts` | Description | Deps |

### Files to Modify

| File | Change Type | Description |
|------|-------------|-------------|
| `path/to/file.ts` | Type | Description |

### Files to Delete

| File | Reason | Migration |
|------|--------|-----------|
| `path/to/old.ts` | Replaced by X | Functionality moved to Y |

---

## Phase 2: [Phase Name]

[Repeat structure]

---

## Dependencies

### New Packages

| Package | Version | Purpose | Alternative Considered |
|---------|---------|---------|------------------------|
| `package` | ^1.0.0 | Why needed | Other option and why not |

### Peer Dependencies

| Package | Required By | Version Constraint |
|---------|-------------|-------------------|
| `peer` | `package` | >=2.0.0 |

---

## API Impact

### New Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/resource` | Create resource | Required |

### Modified Endpoints

| Endpoint | Change | Breaking | Migration |
|----------|--------|----------|-----------|
| `/api/old` | Response format | Yes | v2 header |

### Deprecated Endpoints

| Endpoint | Deprecation Date | Removal Date | Replacement |
|----------|------------------|--------------|-------------|
| `/api/legacy` | 2024-01-01 | 2024-06-01 | `/api/v2/new` |

---

## Database Impact

### Schema Changes

| Table | Change | SQL/Migration |
|-------|--------|---------------|
| `users` | Add column | `ALTER TABLE users ADD COLUMN theme VARCHAR(10)` |

### Data Migrations

| Migration | Description | Reversible | Risk |
|-----------|-------------|------------|------|
| `001_add_theme` | Add theme column | Yes | Low |

### Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| `users` | `idx_users_theme` | Query by theme preference |

---

## Risk Analysis

### High Priority Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Data loss during migration | Low | Critical | Backup before migration |
| API breaking change | Medium | High | Version header, deprecation period |

### Medium Priority Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Build time increase | Medium | Medium | Lazy loading, code splitting |
| Test coverage gap | Medium | Medium | Add integration tests first |

### Low Priority Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Minor UI inconsistencies | High | Low | Design review after phase 1 |

---

## Testing Strategy

### Unit Tests

| Area | New Tests | Modified Tests |
|------|-----------|----------------|
| Components | 5 | 2 |
| Hooks | 2 | 0 |
| Utils | 1 | 1 |

### Integration Tests

| Flow | Coverage |
|------|----------|
| User preferences | Full flow |
| Theme switching | Happy path + errors |

### Manual Testing Checklist

- [ ] Theme persists across page refresh
- [ ] Theme syncs across tabs
- [ ] No flash of wrong theme
- [ ] Accessibility (contrast ratios)

---

## Rollback Plan

### Phase 1 Rollback

```bash
# Steps to rollback phase 1
git revert <commit-range>
npm run migrate:down
```

### Full Rollback

```bash
# Steps to rollback entire change
git revert <commit-range>
npm run migrate:rollback --to=<previous>
```

---

## Implementation Order

### Phase 1: Foundation
1. Add database migration
2. Create base types/interfaces
3. Implement core hook

### Phase 2: UI Layer
4. Create components
5. Integrate into layout
6. Add to settings page

### Phase 3: Polish
7. Add tests
8. Performance optimization
9. Documentation

---

## Checkpoints

| After Phase | Verify |
|-------------|--------|
| Phase 1 | Database migrated, types compile |
| Phase 2 | Feature functional end-to-end |
| Phase 3 | Tests pass, perf acceptable |

---

Proceed with Phase 1? **[Yes/No/Questions]**
```

---

## When to Use This Template

| Indicator | Threshold |
|-----------|-----------|
| File count | 6+ files |
| Multiple concerns | DB + API + UI |
| Team coordination | Multiple developers |
| Rollback complexity | Needs explicit plan |
| Breaking changes | Any external API changes |

---

## Phase Guidelines

| Phase Focus | Contents |
|-------------|----------|
| **Foundation** | Database, types, core logic |
| **Implementation** | Features, components, routes |
| **Integration** | Connecting pieces, testing |
| **Polish** | Performance, edge cases, docs |

Keep phases independently deployable when possible.
