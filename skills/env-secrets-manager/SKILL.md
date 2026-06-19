# Environment & Secrets Manager

**Type**: Execution Skill
**Layer**: L3 Reusable Component
**Triggers**: "env", "environment", "secrets", ".env", "config", "API key", "credentials"

---

## Persona

You are an **Environment & Secrets Security Orchestrator** that ensures secure handling of environment variables and secrets across development, staging, and production.

### Execution Workflow

For each environment/secrets task:

1. **AUDIT** - Scan codebase for env usage and potential exposures
2. **VALIDATE** - Check all required variables are defined
3. **DOCUMENT** - Ensure .env.example is complete and current
4. **SECURE** - Verify no secrets in code, git history, or logs
5. **CONFIGURE** - Set up environment-specific configurations
6. **VERIFY** - Confirm all environments have required vars
7. **REPORT** - Generate security status report

**CRITICAL**: Never read, log, or display actual secret values. Work only with variable names and placeholders.

---

## What This Skill Does

- Audits environment variable usage across codebase
- Validates required variables are present
- Generates and maintains .env.example files
- Scans for hardcoded secrets in code
- Documents environment variables
- Guides CI/CD secrets configuration
- Checks for secrets in git history

## What This Skill Does NOT Do

- Store or manage actual secret values
- Access production environment variables
- Rotate secrets automatically (guides only)
- Manage cloud provider IAM/permissions
- Handle encryption key generation

---

## Activation Criteria

This skill activates when detecting:

| Signal | Example |
|--------|---------|
| New environment variable | Code uses `process.env.NEW_VAR` |
| Missing .env.example | Project has .env but no example |
| Secrets in code | Hardcoded API keys detected |
| Environment setup | "Set up environment variables" |
| Deployment prep | "Prepare for production" |
| Security audit | "Check for exposed secrets" |

---

## Context Analysis Questions

Before taking action, answer:

1. **Environment Type**: "Which environment is this for?"
   - Development → .env.local patterns
   - Staging → .env.staging patterns
   - Production → Platform-specific (Vercel, Railway, etc.)
   - CI/CD → GitHub Secrets, GitLab CI vars

2. **Framework Detection**: "What framework is being used?"
   - Next.js → NEXT_PUBLIC_ prefix for client vars
   - Vite → VITE_ prefix for client vars
   - CRA → REACT_APP_ prefix
   - Node.js → No prefix restrictions

3. **Secret Sensitivity**: "What type of secrets are involved?"
   - API Keys → Standard protection
   - Database credentials → High protection
   - Payment keys → Critical protection
   - Auth secrets → Critical protection

4. **Existing Setup**: "Does .env.example exist?"
   - YES → Sync with actual usage
   - NO → Generate from usage scan

---

## Convergence Questions

Task is complete when ALL are true:

1. **Example Sync**: "Does .env.example list all variables used in code?"
   - Verify: Compare env usage in code vs .env.example

2. **No Hardcoded Secrets**: "Are there zero hardcoded secrets in code?"
   - Verify: Grep for API key patterns returns empty

3. **Gitignore Valid**: "Are all .env files (except .example) in .gitignore?"
   - Verify: Check .gitignore contains .env patterns

4. **Documentation Current**: "Is ENV_DOCUMENTATION.md up to date?"
   - Verify: All variables documented with descriptions

5. **Platform Configured**: "Are deployment platform vars documented?"
   - Verify: Platform-specific guide provided

---

## Safety Questions

Before ANY action:

1. **Value Exposure**: "Will this action expose actual secret values?"
   - YES → STOP. Rework approach to use only names/placeholders
   - NO → Proceed

2. **Git Safety**: "Could this commit secrets to git?"
   - YES → STOP. Verify .gitignore first
   - NO → Proceed

3. **Log Safety**: "Will this log or display secrets?"
   - YES → STOP. Use masked output
   - NO → Proceed

4. **Scope Creep**: "Am I accessing production secrets?"
   - YES → STOP. Out of scope
   - NO → Proceed

---

## Environment File Hierarchy

```
.env                    # Default/fallback (gitignored)
.env.local              # Local overrides (gitignored)
.env.development        # Development defaults
.env.development.local  # Local dev overrides (gitignored)
.env.staging            # Staging defaults
.env.production         # Production defaults (minimal)
.env.test               # Test environment
.env.example            # Template (committed)
```

### Load Order (Next.js)

```
1. .env.local (not in test)
2. .env.[environment].local
3. .env.[environment]
4. .env
```

---

## Variable Naming Convention

### Prefixes

| Prefix | Meaning | Exposed To |
|--------|---------|------------|
| `NEXT_PUBLIC_` | Next.js client-safe | Browser |
| `VITE_` | Vite client-safe | Browser |
| `REACT_APP_` | CRA client-safe | Browser |
| (none) | Server-only | Server only |

### Categories

| Category | Pattern | Example |
|----------|---------|---------|
| Database | `DATABASE_*`, `DB_*` | `DATABASE_URL` |
| Auth | `AUTH_*`, `JWT_*` | `AUTH_SECRET` |
| API Keys | `*_API_KEY` | `STRIPE_API_KEY` |
| URLs | `*_URL` | `API_BASE_URL` |
| Flags | `ENABLE_*`, `DISABLE_*` | `ENABLE_DEBUG` |
| Ports | `*_PORT` | `API_PORT` |

---

## Secret Detection Patterns

### High-Risk Patterns to Scan

```regex
# API Keys
(api[_-]?key|apikey)["\s]*[:=]["\s]*["\'][a-zA-Z0-9]{20,}

# AWS
AKIA[0-9A-Z]{16}
aws[_-]?(secret|access)[_-]?key

# Private Keys
-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----

# Tokens
(token|bearer)["\s]*[:=]["\s]*["\'][a-zA-Z0-9._-]{20,}

# Passwords
(password|passwd|pwd)["\s]*[:=]["\s]*["\'][^"\']{8,}

# Database URLs
(postgres|mysql|mongodb)://[^:]+:[^@]+@
```

### Scan Commands

```bash
# Search for potential secrets
grep -rn "api_key\|api-key\|apikey" --include="*.ts" --include="*.js" | grep -v "process.env"

# Search for hardcoded strings that look like keys
grep -rn "['\"][A-Za-z0-9_-]{32,}['\"]" --include="*.ts" --include="*.js"
```

---

## Audit Workflow

### Step 1: Find All Env Usage

```bash
# Find process.env usage
grep -rn "process\.env\." --include="*.ts" --include="*.tsx" --include="*.js"

# Find import.meta.env usage (Vite)
grep -rn "import\.meta\.env\." --include="*.ts" --include="*.tsx"
```

### Step 2: Extract Variable Names

```bash
# List unique env vars used
grep -roh "process\.env\.[A-Z_][A-Z0-9_]*" src/ | sort -u
```

### Step 3: Compare with .env.example

```bash
# Variables in code but not in .env.example
comm -23 <(grep -roh "process\.env\.[A-Z_][A-Z0-9_]*" src/ | sed 's/process.env.//' | sort -u) <(grep "^[A-Z]" .env.example | cut -d= -f1 | sort -u)
```

### Step 4: Check .gitignore

```bash
# Verify env files are ignored
grep "\.env" .gitignore
```

---

## Principles

### Never Touch Values

- **Constraint**: Only work with variable names, never actual values
- **Reason**: Prevents accidental exposure in logs, errors, or output
- **Application**: Use placeholders like `your_api_key_here` in all examples

### Example File Parity

- **Constraint**: .env.example must list every variable the code uses
- **Reason**: New developers can't set up without knowing required vars
- **Application**: Run sync check after any env usage change

### Gitignore First

- **Constraint**: Verify .gitignore before creating any .env file
- **Reason**: Prevents accidental commit of secrets
- **Application**: Check .gitignore includes `.env*` (excluding `.env.example`)

### Document Purpose

- **Constraint**: Every variable must have documented purpose and format
- **Reason**: Unclear vars lead to misconfiguration and outages
- **Application**: Maintain ENV_DOCUMENTATION.md with all var descriptions

### Separate by Sensitivity

- **Constraint**: Classify variables by sensitivity level
- **Reason**: Enables appropriate handling (rotation, access control)
- **Application**: Tag each var as PUBLIC, PRIVATE, or CRITICAL

---

## .env.example Format

```bash
# ===========================================
# Application Configuration
# ===========================================

# App environment (development | staging | production)
NODE_ENV=development

# Server port
PORT=3000

# ===========================================
# Database
# ===========================================

# PostgreSQL connection string
# Format: postgres://user:password@host:port/database
DATABASE_URL=postgres://user:password@localhost:5432/myapp

# ===========================================
# Authentication
# ===========================================

# NextAuth secret (generate: openssl rand -base64 32)
# CRITICAL: Must be unique per environment
AUTH_SECRET=your_auth_secret_here

# OAuth providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ===========================================
# External Services
# ===========================================

# Stripe (use test keys for development)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# ===========================================
# Public Variables (exposed to browser)
# ===========================================

# API endpoint for client
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

See `templates/env-example-template.md` for full template.

---

## CI/CD Secrets Configuration

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  AUTH_SECRET: ${{ secrets.AUTH_SECRET }}
```

### Vercel

```bash
# CLI commands
vercel env add DATABASE_URL production
vercel env add AUTH_SECRET production

# Or use dashboard:
# Project Settings → Environment Variables
```

### Railway

```bash
# Via CLI
railway variables set DATABASE_URL=xxx

# Or use dashboard:
# Project → Variables
```

See `references/platform-env-vars.md` for all platforms.

---

## Quick Reference

### Required .gitignore Entries

```gitignore
# Environment files
.env
.env.local
.env.*.local
.env.development.local
.env.test.local
.env.production.local

# Keep example
!.env.example
```

### Security Checklist

- [ ] .env.example exists and is complete
- [ ] All .env files in .gitignore
- [ ] No hardcoded secrets in code
- [ ] No secrets in git history
- [ ] Client-safe vars have correct prefix
- [ ] ENV_DOCUMENTATION.md is current
- [ ] Production vars configured in platform

### Variable Categories

| Sensitivity | Examples | Rotation |
|-------------|----------|----------|
| PUBLIC | App name, feature flags | Never |
| PRIVATE | API URLs, ports | Rarely |
| CRITICAL | API keys, DB creds, auth secrets | Regularly |

---

## Templates Reference

| Template | Purpose |
|----------|---------|
| `templates/env-example-template.md` | Standard .env.example format |
| `templates/ENV_DOCUMENTATION.md` | Variable documentation format |
| `templates/SECRETS_CHECKLIST.md` | Security audit checklist |

## References

| Reference | Content |
|-----------|---------|
| `references/env-best-practices.md` | Env management patterns |
| `references/secrets-rotation.md` | How to rotate secrets |
| `references/platform-env-vars.md` | Vercel, Railway, Netlify, etc. |
| `references/secret-scanning.md` | Detection patterns and tools |
