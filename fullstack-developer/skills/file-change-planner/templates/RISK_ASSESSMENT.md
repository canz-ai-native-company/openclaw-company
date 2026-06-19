# Risk Assessment Template

Deep risk analysis for high-impact changes.

---

## Template

```markdown
## Risk Assessment

**Change**: [Summary of change]
**Assessed By**: [Name/AI]
**Date**: [Date]
**Overall Risk Level**: Low/Medium/High/Critical

---

## Risk Matrix

| Risk | Probability | Impact | Score | Priority |
|------|-------------|--------|-------|----------|
| [Name] | Low/Med/High | Low/Med/High/Critical | 1-9 | P1-P4 |

### Scoring Guide

| Probability × Impact | Score |
|---------------------|-------|
| Low × Low | 1 |
| Low × Medium | 2 |
| Low × High | 3 |
| Medium × Low | 2 |
| Medium × Medium | 4 |
| Medium × High | 6 |
| High × Low | 3 |
| High × Medium | 6 |
| High × High | 9 |

---

## Detailed Risk Analysis

### Risk 1: [Name]

**Category**: Technical/Data/Security/Performance/Business
**Probability**: Low/Medium/High
**Impact**: Low/Medium/High/Critical

**Description**:
[Detailed description of what could go wrong]

**Root Cause**:
[Why this risk exists]

**Indicators**:
- [Early warning sign 1]
- [Early warning sign 2]

**Mitigation Strategy**:
1. [Prevention step]
2. [Detection step]
3. [Response step]

**Contingency Plan**:
[What to do if risk materializes]

**Owner**: [Who is responsible]

---

[Repeat for each risk]

---

## Risk Dependencies

```
Risk A
  └── triggers → Risk B
                   └── amplifies → Risk C
```

---

## Acceptance Criteria

| Risk Level | Acceptable? | Required Actions |
|------------|-------------|------------------|
| Low (1-2) | Yes | Document only |
| Medium (3-4) | Yes | Mitigation in place |
| High (5-6) | Conditional | Mitigation + monitoring |
| Critical (7-9) | No | Redesign or explicit approval |

---

## Sign-off

- [ ] All high/critical risks have mitigation plans
- [ ] Rollback procedures documented
- [ ] Monitoring/alerting in place
- [ ] Stakeholders informed

**Approved**: [Yes/No]
**Approver**: [Name]
**Conditions**: [Any conditions for approval]
```

---

## Risk Categories

### Technical Risks

| Risk Type | Description | Example |
|-----------|-------------|---------|
| **Integration** | Components don't work together | API contract mismatch |
| **Compatibility** | Breaks existing systems | Browser support |
| **Complexity** | Too complex to maintain | Circular dependencies |
| **Performance** | Degrades system speed | N+1 queries |

### Data Risks

| Risk Type | Description | Example |
|-----------|-------------|---------|
| **Loss** | Data deleted or corrupted | Failed migration |
| **Inconsistency** | Data becomes invalid | Schema mismatch |
| **Privacy** | Unauthorized data exposure | Logging PII |
| **Integrity** | Data modified incorrectly | Race conditions |

### Security Risks

| Risk Type | Description | Example |
|-----------|-------------|---------|
| **Authentication** | Identity bypass | Session fixation |
| **Authorization** | Permission bypass | IDOR vulnerability |
| **Injection** | Malicious input execution | SQL injection |
| **Exposure** | Sensitive data leaked | Error messages |

### Operational Risks

| Risk Type | Description | Example |
|-----------|-------------|---------|
| **Deployment** | Release causes outage | Config mismatch |
| **Monitoring** | Issues go undetected | Missing alerts |
| **Recovery** | Can't restore service | No rollback plan |
| **Scaling** | Can't handle load | Resource exhaustion |

---

## Common Risks by Change Type

### New Feature

| Risk | Probability | Typical Mitigation |
|------|-------------|-------------------|
| Scope creep | High | Fixed requirements |
| Integration issues | Medium | Interface contracts |
| Performance impact | Medium | Load testing |

### Refactoring

| Risk | Probability | Typical Mitigation |
|------|-------------|-------------------|
| Regression bugs | High | Comprehensive tests |
| Behavior changes | Medium | Characterization tests |
| Incomplete migration | Medium | Feature flags |

### Database Migration

| Risk | Probability | Typical Mitigation |
|------|-------------|-------------------|
| Data loss | Low | Backups |
| Downtime | Medium | Online migration |
| Rollback failure | Medium | Test rollback first |

### API Changes

| Risk | Probability | Typical Mitigation |
|------|-------------|-------------------|
| Breaking clients | High | Versioning |
| Documentation drift | High | Auto-generated docs |
| Rate limiting issues | Medium | Gradual rollout |

---

## Mitigation Patterns

### Prevention

Stop risk from occurring:
- Input validation
- Type checking
- Access controls
- Configuration validation

### Detection

Identify risk quickly:
- Monitoring/alerting
- Health checks
- Audit logging
- Anomaly detection

### Response

Minimize impact when risk occurs:
- Circuit breakers
- Graceful degradation
- Rollback procedures
- Incident playbooks

### Recovery

Restore normal operation:
- Backup restoration
- Data reconciliation
- Communication plan
- Post-mortem process
