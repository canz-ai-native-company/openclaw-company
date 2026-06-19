# Secrets Security Checklist

Comprehensive checklist for environment and secrets security audits.

---

## Pre-Deployment Checklist

### .env Files

- [ ] `.env.example` exists and is complete
- [ ] `.env.example` contains NO actual secrets (only placeholders)
- [ ] All `.env` files are in `.gitignore`
- [ ] `.env.local` and `.env.*.local` are in `.gitignore`
- [ ] No `.env` files accidentally committed in git history

### Code Scan

- [ ] No hardcoded API keys in source code
- [ ] No hardcoded passwords in source code
- [ ] No hardcoded connection strings
- [ ] No secrets in comments
- [ ] No secrets in error messages or logs

### Git History

- [ ] Scanned git history for accidental commits
- [ ] No secrets in old commits
- [ ] If found: rotated ALL exposed secrets

### Configuration

- [ ] All required variables documented
- [ ] Client-safe variables have correct prefix
- [ ] Server-only secrets are NOT exposed to client
- [ ] Environment-specific values are correct

---

## Per-Environment Checklist

### Development

- [ ] Using test/development API keys
- [ ] Local database credentials are non-sensitive
- [ ] Auth secret is development-specific
- [ ] Test payment keys (not live)

### Staging

- [ ] Separate secrets from production
- [ ] Staging-specific database
- [ ] Test payment keys (not live)
- [ ] Staging auth secret (different from prod)

### Production

- [ ] All secrets set in platform (not files)
- [ ] Using production API keys
- [ ] Live payment keys configured
- [ ] Production database credentials
- [ ] Unique auth secret
- [ ] Webhook secrets configured
- [ ] OAuth redirect URIs updated

---

## Secret Categories Audit

### Critical Secrets (Rotate if exposed)

| Secret | Present | Secured | Last Rotated |
|--------|---------|---------|--------------|
| `AUTH_SECRET` | [ ] | [ ] | __________ |
| `DATABASE_URL` | [ ] | [ ] | __________ |
| `STRIPE_SECRET_KEY` | [ ] | [ ] | __________ |
| `AWS_SECRET_ACCESS_KEY` | [ ] | [ ] | __________ |

### Private Secrets (Monitor)

| Secret | Present | Secured | Notes |
|--------|---------|---------|-------|
| OAuth Client Secrets | [ ] | [ ] | |
| SMTP Credentials | [ ] | [ ] | |
| Third-party API Keys | [ ] | [ ] | |

### Public Variables (Verify Correct)

| Variable | Present | Correct Value |
|----------|---------|---------------|
| `NEXT_PUBLIC_API_URL` | [ ] | [ ] |
| `NEXT_PUBLIC_APP_URL` | [ ] | [ ] |

---

## Platform-Specific Checklists

### Vercel

- [ ] Production secrets in "Production" environment
- [ ] Preview secrets in "Preview" environment
- [ ] Development secrets in "Development" environment
- [ ] Sensitive vars marked as "Sensitive"
- [ ] System environment variables reviewed

### GitHub Actions

- [ ] Secrets added to repository secrets
- [ ] No secrets in workflow files
- [ ] Using `${{ secrets.NAME }}` syntax
- [ ] Secrets not printed in logs
- [ ] `GITHUB_TOKEN` permissions reviewed

### Railway

- [ ] Variables set per environment
- [ ] Shared variables configured
- [ ] No variables in railway.json
- [ ] Reference variables used where appropriate

---

## Incident Response

### If Secrets Are Exposed

**Immediate Actions:**

1. [ ] Identify which secrets were exposed
2. [ ] Determine exposure scope (public repo, logs, etc.)
3. [ ] Rotate ALL exposed secrets immediately
4. [ ] Update secrets in all environments
5. [ ] Verify applications still work

**Follow-up Actions:**

6. [ ] Review git history for exposure source
7. [ ] Remove secrets from git history if needed
8. [ ] Add to `.gitignore` if missing
9. [ ] Document incident
10. [ ] Review processes to prevent recurrence

### Rotation Commands

```bash
# Generate new auth secret
openssl rand -base64 32

# Regenerate API keys
# - Go to provider dashboard
# - Revoke old key
# - Generate new key
# - Update all environments

# Database password
# - Generate new password
# - Update in database
# - Update connection strings
# - Test connections
```

---

## Automated Scanning

### Tools to Use

| Tool | Purpose | Command |
|------|---------|---------|
| git-secrets | Pre-commit hook | `git secrets --scan` |
| gitleaks | Git history scan | `gitleaks detect` |
| trufflehog | Deep scan | `trufflehog git file://./` |
| detect-secrets | Pre-commit | `detect-secrets scan` |

### CI/CD Integration

```yaml
# GitHub Actions example
- name: Scan for secrets
  uses: gitleaks/gitleaks-action@v2
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Regular Audit Schedule

### Weekly

- [ ] Review new environment variable additions
- [ ] Check .env.example is in sync

### Monthly

- [ ] Run secret scanning tools
- [ ] Review access to secrets management
- [ ] Check for unused variables

### Quarterly

- [ ] Rotate critical secrets
- [ ] Review third-party API key usage
- [ ] Audit who has access to production secrets
- [ ] Update documentation

### Annually

- [ ] Full secrets audit
- [ ] Review all OAuth app configurations
- [ ] Rotate all passwords
- [ ] Review and update security procedures

---

## Quick Scan Commands

```bash
# Check for .env in git
git ls-files | grep -E "^\.env$|^\.env\."

# Check .gitignore
grep -E "\.env" .gitignore

# Find hardcoded secrets patterns
grep -rn "api_key\s*=" --include="*.ts" --include="*.js" | grep -v "process.env"
grep -rn "password\s*=" --include="*.ts" --include="*.js" | grep -v "process.env"
grep -rn "secret\s*=" --include="*.ts" --include="*.js" | grep -v "process.env"

# Find long strings (potential keys)
grep -rn "['\"][a-zA-Z0-9_-]\{32,\}['\"]" --include="*.ts" --include="*.js"

# Check git history for .env files
git log --all --full-history -- "*.env"
git log --all --full-history -- ".env"
```
