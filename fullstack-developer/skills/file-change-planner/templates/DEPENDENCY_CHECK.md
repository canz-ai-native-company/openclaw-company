# Dependency Check Template

Analysis template for adding new packages.

---

## Template

```markdown
## Dependency Analysis

**Package**: [package-name]
**Version**: [version]
**Purpose**: [Why we need this]

---

## Package Assessment

### Basic Info

| Attribute | Value |
|-----------|-------|
| Weekly Downloads | [number] |
| Last Updated | [date] |
| License | [license] |
| Bundle Size | [size] |
| Tree-shakeable | Yes/No |

### Health Indicators

| Indicator | Status | Notes |
|-----------|--------|-------|
| Maintained | Active/Slow/Abandoned | Last commit date |
| Security | Clean/Advisories | Known vulnerabilities |
| TypeScript | Native/DefinitelyTyped/None | Type support |
| Documentation | Good/Adequate/Poor | Docs quality |

---

## Alternatives Considered

| Package | Pros | Cons | Decision |
|---------|------|------|----------|
| [chosen] | [pros] | [cons] | **Selected** |
| [alt-1] | [pros] | [cons] | Rejected: [reason] |
| [alt-2] | [pros] | [cons] | Rejected: [reason] |

---

## Impact Analysis

### Bundle Size Impact

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Total Bundle | X KB | Y KB | +Z KB |
| Gzipped | X KB | Y KB | +Z KB |

### Dependency Tree

```
[package]
├── [dep-1]
├── [dep-2]
│   └── [transitive-1]
└── [dep-3]
```

### Peer Dependencies

| Peer | Required Version | Our Version | Compatible |
|------|------------------|-------------|------------|
| react | >=16.8 | 18.2 | Yes |

---

## Security Review

### Known Vulnerabilities

| Severity | CVE | Description | Fixed In |
|----------|-----|-------------|----------|
| None found | - | - | - |

### Security Considerations

- [ ] No native code execution
- [ ] No network requests (unless intended)
- [ ] No file system access (unless intended)
- [ ] No eval() or dynamic code execution
- [ ] Dependencies are well-maintained

---

## Integration Plan

### Installation

```bash
npm install [package]@[version]
# or
yarn add [package]@[version]
```

### Configuration

```javascript
// Required configuration steps
```

### Usage Example

```typescript
// How we'll use this package
```

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Breaking update | Low | Medium | Lock version |
| Abandonment | Low | High | Have exit plan |
| Security issue | Low | High | Monitor advisories |

---

## Exit Strategy

If we need to remove this package:

1. **Replacement options**: [list alternatives]
2. **Migration effort**: [estimate]
3. **Affected files**: [count]

---

## Approval

- [ ] Bundle size acceptable
- [ ] No security issues
- [ ] License compatible
- [ ] Maintenance active
- [ ] Exit strategy defined

**Approved**: [Yes/No]
**Approver**: [Name]
```

---

## Quick Checks

### Must Pass

| Check | How to Verify |
|-------|---------------|
| License compatible | Check LICENSE file |
| No critical vulnerabilities | `npm audit` |
| Actively maintained | Last commit < 6 months |
| TypeScript support | Has types |

### Should Pass

| Check | How to Verify |
|-------|---------------|
| Good documentation | Review README |
| Reasonable bundle size | `bundlephobia.com` |
| High download count | npm page |
| Few dependencies | `npm view [pkg] dependencies` |

---

## Commands

```bash
# Check package info
npm view [package]

# Check bundle size
npx bundlephobia [package]

# Check for vulnerabilities
npm audit

# Check dependency tree
npm ls [package]

# Check outdated packages
npm outdated

# Check license
npx license-checker --summary
```

---

## Red Flags

| Flag | Risk Level | Action |
|------|------------|--------|
| No updates in 2+ years | High | Find alternative |
| Unresolved security advisories | Critical | Don't use |
| No TypeScript types | Medium | Accept or find alternative |
| >1MB bundle size | Medium | Evaluate necessity |
| >20 dependencies | Medium | Review dependency tree |
| Copyleft license (GPL) | High | Legal review |
| Single maintainer + critical | High | Evaluate bus factor |

---

## License Compatibility

### Safe Licenses (for commercial use)

- MIT
- Apache-2.0
- BSD-2-Clause
- BSD-3-Clause
- ISC

### Requires Review

- LGPL (linking restrictions)
- MPL (file-level copyleft)

### Typically Avoid

- GPL (strong copyleft)
- AGPL (network copyleft)
- Proprietary

---

## Bundle Size Guidelines

| App Type | Target | Acceptable | Too Large |
|----------|--------|------------|-----------|
| Marketing site | <50KB | <100KB | >200KB |
| Web app | <100KB | <200KB | >500KB |
| Internal tool | <200KB | <500KB | >1MB |

*Per-package contribution to total bundle*
