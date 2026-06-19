# Risk Catalog

Comprehensive catalog of risks to check during change planning.

---

## Frontend Risks

### React/Next.js

| Risk | Trigger | Symptoms | Prevention |
|------|---------|----------|------------|
| Hydration mismatch | SSR + client state | Console warnings, UI flicker | useEffect for client-only |
| Infinite re-renders | State in render | Page freeze, memory spike | Stable references, useMemo |
| Memory leaks | Unmount without cleanup | Slow performance over time | Cleanup in useEffect |
| Prop drilling | Deep component trees | Maintenance nightmare | Context or state management |
| Bundle bloat | Large imports | Slow page load | Dynamic imports, tree shaking |

### State Management

| Risk | Trigger | Symptoms | Prevention |
|------|---------|----------|------------|
| Stale closures | Old state in callbacks | Incorrect data displayed | useCallback dependencies |
| Race conditions | Multiple async updates | Inconsistent state | Abort controllers, flags |
| State synchronization | Multiple sources of truth | Data mismatch | Single source of truth |
| Over-rendering | Broad state updates | Poor performance | Selective subscriptions |

### Styling

| Risk | Trigger | Symptoms | Prevention |
|------|---------|----------|------------|
| CSS specificity wars | Global + component styles | Styles don't apply | CSS modules, scoped styles |
| Layout shifts | Dynamic content | CLS metrics, jumpy UI | Reserved space, skeletons |
| Theme flash | System preference detection | Wrong theme on load | Blocking script in head |
| Responsive breakage | Missing breakpoints | Broken mobile layout | Mobile-first, test all sizes |

---

## Backend Risks

### API Design

| Risk | Trigger | Symptoms | Prevention |
|------|---------|----------|------------|
| Breaking changes | Response format change | Client errors | Versioning, deprecation |
| N+1 queries | Lazy loading in loops | Slow responses | Eager loading, DataLoader |
| Rate limiting gaps | No throttling | Resource exhaustion | Rate limiters |
| Auth bypass | Missing middleware | Unauthorized access | Auth on all routes |

### Database

| Risk | Trigger | Symptoms | Prevention |
|------|---------|----------|------------|
| Migration failure | Invalid SQL | Deploy blocked | Test migrations locally |
| Data corruption | Type changes | Invalid data | Validation, backups |
| Lock contention | Long transactions | Timeouts | Smaller transactions |
| Index bloat | Many indexes | Slow writes | Selective indexing |

### Concurrency

| Risk | Trigger | Symptoms | Prevention |
|------|---------|----------|------------|
| Race conditions | Parallel updates | Incorrect data | Transactions, locks |
| Deadlocks | Circular waits | Hangs, timeouts | Lock ordering |
| Stale reads | Cache inconsistency | Wrong data shown | Cache invalidation |
| Lost updates | Concurrent edits | Data overwritten | Optimistic locking |

---

## Integration Risks

### Third-Party APIs

| Risk | Trigger | Symptoms | Prevention |
|------|---------|----------|------------|
| API downtime | External service fails | Feature broken | Circuit breakers, fallbacks |
| Rate limits | Too many requests | 429 errors | Request queuing |
| Schema changes | Upstream updates | Parse errors | Schema validation |
| Credential exposure | Hardcoded secrets | Security breach | Environment variables |

### Authentication

| Risk | Trigger | Symptoms | Prevention |
|------|---------|----------|------------|
| Session fixation | No rotation | Account takeover | Rotate on login |
| Token leakage | Logging tokens | Security breach | Redact in logs |
| Expired handling | No refresh flow | Random logouts | Token refresh |
| CORS issues | Wrong origins | Auth fails | Proper CORS config |

---

## Performance Risks

### Loading

| Risk | Trigger | Symptoms | Prevention |
|------|---------|----------|------------|
| Large initial bundle | No code splitting | Slow first load | Lazy loading |
| Render blocking | Sync scripts | White screen | Defer, async |
| Font flash | Web fonts | Text shift | Font preload |
| Image blocking | Large images | Slow LCP | Lazy load, srcset |

### Runtime

| Risk | Trigger | Symptoms | Prevention |
|------|---------|----------|------------|
| Main thread blocking | Heavy computation | UI jank | Web Workers |
| Memory leaks | Event listeners | Page slowdown | Cleanup handlers |
| Layout thrashing | Read/write loops | Slow reflows | Batch DOM operations |
| Animation jank | Non-composited | Choppy animations | Transform, opacity only |

---

## Security Risks

### Injection

| Risk | Trigger | Symptoms | Prevention |
|------|---------|----------|------------|
| SQL injection | String concat | Data breach | Parameterized queries |
| XSS | Unescaped output | Script execution | Escape, CSP |
| Command injection | Shell exec | System compromise | Input validation |
| Path traversal | File paths | File access | Path normalization |

### Authentication

| Risk | Trigger | Symptoms | Prevention |
|------|---------|----------|------------|
| Brute force | No rate limiting | Account compromise | Rate limiting |
| Credential stuffing | Weak passwords | Breaches | MFA, password rules |
| Session hijacking | Insecure cookies | Impersonation | Secure, HttpOnly |

### Data

| Risk | Trigger | Symptoms | Prevention |
|------|---------|----------|------------|
| PII exposure | Logging user data | Compliance violation | Data masking |
| Sensitive in URLs | Query parameters | Log exposure | POST for sensitive |
| Unencrypted storage | Plain text secrets | Data breach | Encryption at rest |

---

## Deployment Risks

### Release

| Risk | Trigger | Symptoms | Prevention |
|------|---------|----------|------------|
| Config mismatch | Wrong env vars | Feature broken | Config validation |
| Missing migrations | Forgot to run | Schema errors | Automated migrations |
| Cache stale | Old cached assets | Old version served | Cache busting |
| Rollback failure | No rollback plan | Extended outage | Test rollbacks |

### Infrastructure

| Risk | Trigger | Symptoms | Prevention |
|------|---------|----------|------------|
| Resource exhaustion | No limits | Service crash | Resource limits |
| Connection pool | Too many connections | DB errors | Pool configuration |
| Disk full | No monitoring | Service failure | Disk alerts |
| DNS issues | Propagation | Intermittent failures | Low TTL during changes |

---

## Change-Specific Risk Checklists

### Adding New Feature

- [ ] Does it affect existing features?
- [ ] Are there performance implications?
- [ ] Does it require database changes?
- [ ] Does it affect authentication/authorization?
- [ ] Does it expose new attack surface?

### Modifying Existing Code

- [ ] Are there dependent components?
- [ ] Is the change backward compatible?
- [ ] Are tests updated?
- [ ] Is documentation current?
- [ ] Could it introduce regressions?

### Database Migration

- [ ] Is migration reversible?
- [ ] What's the data volume impact?
- [ ] Does it require downtime?
- [ ] Are backups current?
- [ ] What's the rollback plan?

### Dependency Update

- [ ] Are there breaking changes?
- [ ] Are peer dependencies compatible?
- [ ] Is bundle size affected?
- [ ] Are there security advisories?
- [ ] Is documentation reviewed?
