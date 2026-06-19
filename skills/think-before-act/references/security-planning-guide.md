# Security Planning Guide

Threat modeling and security planning for Step 9 of the Design Thinking Protocol.

---

## Threat Modeling Framework

### STRIDE Model

| Threat | Description | Example |
|--------|-------------|---------|
| **S**poofing | Pretending to be someone else | Fake login, session hijacking |
| **T**ampering | Modifying data | SQL injection, form manipulation |
| **R**epudiation | Denying actions taken | No audit logs |
| **I**nformation Disclosure | Exposing data | Error messages, debug info |
| **D**enial of Service | Making system unavailable | Resource exhaustion |
| **E**levation of Privilege | Gaining unauthorized access | Admin bypass, IDOR |

---

## Threat Models by Project Type

### Web Application

| Threat | Risk | Mitigation |
|--------|------|------------|
| SQL Injection | High | Parameterized queries via ORM |
| XSS (Cross-Site Scripting) | High | React auto-escaping, CSP headers |
| CSRF | Medium | SameSite cookies, CSRF tokens |
| Auth Bypass | Critical | Middleware on all protected routes |
| Session Hijacking | High | Secure, HttpOnly, SameSite cookies |
| IDOR (Insecure Direct Object Ref) | High | Authorization checks on every request |
| Secret Exposure | Critical | .env files, never hardcode |
| Rate Limiting Bypass | Medium | Server-side rate limiting |
| File Upload Attacks | Medium | Type validation, size limits, sandboxing |
| Open Redirect | Low | Whitelist allowed redirect URLs |

### API Service

| Threat | Risk | Mitigation |
|--------|------|------------|
| API Key Exposure | Critical | Environment variables, rotation |
| Rate Limit Abuse | High | Per-key rate limiting |
| Input Injection | High | Input validation (zod/joi) |
| Broken Auth | Critical | JWT validation on every request |
| Mass Assignment | Medium | Explicit allowlists for updates |
| Verbose Errors | Medium | Generic errors in production |
| CORS Misconfiguration | Medium | Strict origin whitelist |

### AI Agent

| Threat | Risk | Mitigation |
|--------|------|------------|
| Prompt Injection | Critical | Input sanitization, system prompts |
| Data Exfiltration | High | Output filtering, guardrails |
| Tool Abuse | High | Permission boundaries, rate limits |
| Cost Attacks | Medium | Token limits, budget caps |
| Context Poisoning | Medium | Input validation, context isolation |
| PII Leakage | High | Data masking, output filtering |

---

## OWASP Top 10 Checklist (2021)

### A01: Broken Access Control

| Check | Action |
|-------|--------|
| Authorization on every endpoint? | Add middleware |
| IDOR prevention? | Check resource ownership |
| CORS properly configured? | Strict origin whitelist |
| Directory listing disabled? | Server configuration |
| JWT/session validation? | Verify on every request |

### A02: Cryptographic Failures

| Check | Action |
|-------|--------|
| Passwords hashed? | bcrypt/argon2 with salt |
| Data in transit encrypted? | HTTPS enforced |
| Sensitive data at rest? | Encrypt database fields |
| Secrets in code? | Environment variables |
| Weak algorithms? | Use current standards |

### A03: Injection

| Check | Action |
|-------|--------|
| SQL injection? | Parameterized queries / ORM |
| XSS? | Output encoding, CSP |
| Command injection? | Never use shell exec with user input |
| LDAP injection? | Parameterized queries |
| Path traversal? | Normalize paths, whitelist |

### A04: Insecure Design

| Check | Action |
|-------|--------|
| Threat model created? | Use STRIDE |
| Security requirements defined? | Document in Design Doc |
| Secure defaults? | Deny by default |
| Rate limiting? | On all endpoints |
| Input validation? | Server-side always |

### A05: Security Misconfiguration

| Check | Action |
|-------|--------|
| Default credentials changed? | Custom passwords |
| Unnecessary features disabled? | Remove unused endpoints |
| Error handling secure? | No stack traces in prod |
| Security headers set? | HSTS, CSP, X-Frame |
| Dependencies up to date? | Regular updates |

### A06: Vulnerable Components

| Check | Action |
|-------|--------|
| Dependencies audited? | `npm audit` / `pip audit` |
| Known CVEs checked? | Dependabot enabled |
| Unused dependencies removed? | Regular cleanup |
| Components from trusted sources? | Official packages only |

### A07: Authentication Failures

| Check | Action |
|-------|--------|
| Brute force prevention? | Rate limiting, lockout |
| Password requirements? | Minimum length, complexity |
| MFA available? | For critical accounts |
| Session management? | Timeout, rotation |
| Credential stuffing? | Breached password check |

### A08: Data Integrity Failures

| Check | Action |
|-------|--------|
| CI/CD pipeline secure? | Protected branches |
| Dependencies verified? | Lock files, integrity checks |
| Serialization safe? | No unsafe deserialization |
| Critical data validated? | Server-side validation |

### A09: Logging & Monitoring Failures

| Check | Action |
|-------|--------|
| Login attempts logged? | Success and failure |
| Authorization failures logged? | Track access denials |
| Input validation failures logged? | Track attack attempts |
| Logs don't contain secrets? | Mask sensitive data |
| Alerting configured? | Anomaly detection |

### A10: Server-Side Request Forgery (SSRF)

| Check | Action |
|-------|--------|
| URL validation? | Whitelist allowed domains |
| Internal network access blocked? | No private IP access |
| Redirects validated? | Don't follow blindly |

---

## Secret Management Plan

### Classification

| Level | Examples | Handling |
|-------|----------|----------|
| **PUBLIC** | App name, feature flags | Can be in code |
| **PRIVATE** | API URLs, non-secret config | .env only |
| **CRITICAL** | API keys, passwords, auth secrets | .env + rotation |

### Implementation

```
1. All secrets in .env (gitignored)
2. .env.example committed with placeholders
3. Production secrets in platform (Vercel/Railway/AWS)
4. CI/CD secrets in GitHub Secrets
5. Never hardcode, never log, never commit
```

### Rotation Schedule

| Secret | Frequency | Method |
|--------|-----------|--------|
| AUTH_SECRET | 90 days | Generate new, deploy, invalidate old |
| API Keys | 90-180 days | Provider dashboard |
| DB Password | 90 days | Create new user, migrate |
| OAuth Secrets | Annually | Provider dashboard |

---

## Input Validation Plan

### Server-Side Validation (Always Required)

```typescript
// Using zod
const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100),
  password: z.string().min(8).max(128),
});
```

### Validation Rules by Input Type

| Input Type | Rules |
|------------|-------|
| Email | Format validation, max length |
| Password | Min 8 chars, complexity rules |
| URL | Protocol whitelist, max length |
| File upload | Type whitelist, max size (e.g., 5MB) |
| Number | Min/max range, integer vs float |
| String | Max length, character whitelist |
| ID | UUID format or numeric |

---

## Security Headers

```typescript
// Recommended headers
{
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '0',  // Rely on CSP instead
  'Content-Security-Policy': "default-src 'self'",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}
```

---

## Security Plan Template

Use for Step 9 output:

```markdown
## 10. Security Plan

### Threat Model

| # | Threat | Category | Risk | Mitigation |
|---|--------|----------|------|------------|
| 1 | [threat] | [STRIDE] | Critical/High/Medium/Low | [specific action] |

### Secret Management

- Storage: .env (local) + platform secrets (production)
- Rotation: [schedule per secret type]
- Tool: env-secrets-manager skill

### Input Validation

- Library: [zod/joi/pydantic]
- Scope: All user input, API parameters, file uploads
- Location: Server-side always, client-side for UX

### Authentication & Authorization

- Method: [JWT/Session/OAuth]
- Provider: [NextAuth/Clerk/Custom]
- Authorization: [RBAC/ABAC/Simple ownership]

### OWASP Top 10 Status

| # | Category | Status | Notes |
|---|----------|--------|-------|
| A01 | Access Control | [Addressed/N/A] | [Details] |
| A02 | Crypto Failures | [Addressed/N/A] | [Details] |
| [continue...] | | | |
```
