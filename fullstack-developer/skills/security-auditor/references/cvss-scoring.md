# CVSS 3.1 Scoring Reference

Common Vulnerability Scoring System (CVSS) Version 3.1 methodology for assessing vulnerability severity.

---

## Severity Ratings

| Score Range | Severity | Color Code | Remediation Timeline |
|-------------|----------|------------|----------------------|
| 9.0 - 10.0 | Critical | Red | Immediate (< 24 hours) |
| 7.0 - 8.9 | High | Orange | Urgent (< 1 week) |
| 4.0 - 6.9 | Medium | Yellow | Planned (< 1 month) |
| 0.1 - 3.9 | Low | Blue | Scheduled (< 3 months) |
| 0.0 | None | Gray | Informational |

---

## CVSS Base Metrics

### 1. Attack Vector (AV)

| Value | Description | Score |
|-------|-------------|-------|
| Network (N) | Exploitable remotely over network | 0.85 |
| Adjacent (A) | Requires adjacent network access | 0.62 |
| Local (L) | Requires local system access | 0.55 |
| Physical (P) | Requires physical access to device | 0.20 |

### 2. Attack Complexity (AC)

| Value | Description | Score |
|-------|-------------|-------|
| Low (L) | No special conditions needed | 0.77 |
| High (H) | Requires specific conditions | 0.44 |

### 3. Privileges Required (PR)

| Value | Description | Score (Unchanged) | Score (Changed) |
|-------|-------------|-------------------|-----------------|
| None (N) | No privileges required | 0.85 | 0.85 |
| Low (L) | Basic user privileges | 0.62 | 0.68 |
| High (H) | Admin/root privileges | 0.27 | 0.50 |

### 4. User Interaction (UI)

| Value | Description | Score |
|-------|-------------|-------|
| None (N) | No user interaction needed | 0.85 |
| Required (R) | User must perform action | 0.62 |

### 5. Scope (S)

| Value | Description |
|-------|-------------|
| Unchanged (U) | Exploited component only affected |
| Changed (C) | Can affect other components |

### 6. Confidentiality Impact (C)

| Value | Description | Score |
|-------|-------------|-------|
| High (H) | Total confidentiality loss | 0.56 |
| Low (L) | Some confidentiality loss | 0.22 |
| None (N) | No confidentiality impact | 0.00 |

### 7. Integrity Impact (I)

| Value | Description | Score |
|-------|-------------|-------|
| High (H) | Total integrity loss | 0.56 |
| Low (L) | Some integrity loss | 0.22 |
| None (N) | No integrity impact | 0.00 |

### 8. Availability Impact (A)

| Value | Description | Score |
|-------|-------------|-------|
| High (H) | Total availability loss | 0.56 |
| Low (L) | Some availability loss | 0.22 |
| None (N) | No availability impact | 0.00 |

---

## Common Vulnerability Scores

### Critical (9.0 - 10.0)

| Vulnerability | CVSS Vector | Score |
|---------------|-------------|-------|
| Unauthenticated RCE | AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H | 10.0 |
| SQL Injection (full DB access) | AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H | 9.8 |
| Auth Bypass (admin access) | AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H | 9.8 |
| Hardcoded Admin Credentials | AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H | 9.8 |
| SSRF to Internal Services | AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:L/A:N | 9.3 |

### High (7.0 - 8.9)

| Vulnerability | CVSS Vector | Score |
|---------------|-------------|-------|
| XSS (Stored, session hijack) | AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:N | 8.7 |
| IDOR (sensitive data) | AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N | 8.1 |
| Privilege Escalation | AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N | 8.1 |
| Command Injection (limited) | AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N | 8.1 |
| Insecure Deserialization | AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H | 8.1 |
| Exposed API Keys | AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N | 8.2 |
| JWT Secret Exposed | AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N | 9.1 |

### Medium (4.0 - 6.9)

| Vulnerability | CVSS Vector | Score |
|---------------|-------------|-------|
| XSS (Reflected) | AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N | 6.1 |
| CSRF | AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:H/A:N | 6.5 |
| Path Traversal (read only) | AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N | 6.5 |
| Weak Password Policy | AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N | 5.9 |
| Missing Rate Limiting | AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:L | 5.3 |
| Verbose Error Messages | AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N | 5.3 |
| Outdated Dependency (medium CVE) | AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:L/A:L | 5.6 |

### Low (0.1 - 3.9)

| Vulnerability | CVSS Vector | Score |
|---------------|-------------|-------|
| Missing Security Headers | AV:N/AC:H/PR:N/UI:R/S:U/C:L/I:N/A:N | 3.1 |
| Information Disclosure (minor) | AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N | 5.3 |
| Session Not Invalidated on Logout | AV:L/AC:H/PR:N/UI:R/S:U/C:L/I:L/A:N | 3.7 |
| Debug Mode Enabled | AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N | 3.7 |
| Autocomplete on Sensitive Fields | AV:L/AC:H/PR:N/UI:R/S:U/C:L/I:N/A:N | 2.6 |

---

## CVSS Vector String Format

```
CVSS:3.1/AV:[N|A|L|P]/AC:[L|H]/PR:[N|L|H]/UI:[N|R]/S:[U|C]/C:[N|L|H]/I:[N|L|H]/A:[N|L|H]
```

### Example Vectors

```
# Critical SQL Injection
CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H = 9.8

# High XSS
CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:N = 8.7

# Medium CSRF
CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:H/A:N = 6.5

# Low Info Disclosure
CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N = 5.3
```

---

## Scoring Decision Tree

```
START: Can it be exploited remotely?
  │
  ├─ YES: Attack Vector = Network (N)
  │   │
  │   └─ Does it require special conditions?
  │       ├─ NO: Attack Complexity = Low (L)
  │       └─ YES: Attack Complexity = High (H)
  │
  └─ NO: Attack Vector = Local (L) or Physical (P)

Next: What privileges are needed?
  │
  ├─ NONE: Privileges Required = None (N)
  ├─ USER: Privileges Required = Low (L)
  └─ ADMIN: Privileges Required = High (H)

Next: Does user need to click/interact?
  │
  ├─ NO: User Interaction = None (N)
  └─ YES: User Interaction = Required (R)

Next: Can it affect other systems?
  │
  ├─ NO: Scope = Unchanged (U)
  └─ YES: Scope = Changed (C)

Next: Impact Assessment
  │
  ├─ Data stolen? → Confidentiality = High/Low/None
  ├─ Data modified? → Integrity = High/Low/None
  └─ System down? → Availability = High/Low/None
```

---

## Quick Reference Cards

### When to Use Critical (9.0+)

- Unauthenticated remote code execution
- Full database access without authentication
- Admin account takeover
- Exposed production database credentials
- JWT/session signing key exposed

### When to Use High (7.0-8.9)

- Authenticated code execution
- Stored XSS with session hijacking
- Privilege escalation to admin
- Sensitive data exposure (PII, financial)
- API key exposure for critical services

### When to Use Medium (4.0-6.9)

- Reflected XSS
- CSRF on non-critical actions
- Missing rate limiting
- Weak cryptography (recoverable)
- Information disclosure (tech stack, paths)

### When to Use Low (0.1-3.9)

- Missing security headers
- Verbose error messages
- Minor information leaks
- UI/UX security issues
- Best practice violations

---

## Report Format

```markdown
### SEC-XXX: [Vulnerability Title]

**CVSS Score:** X.X ([Severity])
**CVSS Vector:** CVSS:3.1/AV:X/AC:X/PR:X/UI:X/S:X/C:X/I:X/A:X

**Exploitability Metrics:**
- Attack Vector: [Network/Adjacent/Local/Physical]
- Attack Complexity: [Low/High]
- Privileges Required: [None/Low/High]
- User Interaction: [None/Required]

**Impact Metrics:**
- Scope: [Unchanged/Changed]
- Confidentiality: [None/Low/High]
- Integrity: [None/Low/High]
- Availability: [None/Low/High]

**Justification:**
[Explain why each metric value was chosen]
```
