# Secret Scanning Guide

Detect and prevent secrets from being committed to code.

---

## Detection Patterns

### API Keys

```regex
# Generic API Key
[aA][pP][iI][_-]?[kK][eE][yY][\s]*[=:]+[\s]*['"]?[\w-]{20,}

# AWS Access Key
AKIA[0-9A-Z]{16}

# AWS Secret Key
[aA][wW][sS][_-]?[sS][eE][cC][rR][eE][tT][\s]*[=:]+[\s]*['"]?[\w/+=]{40}

# Google API Key
AIza[0-9A-Za-z-_]{35}

# Stripe Keys
sk_(live|test)_[0-9a-zA-Z]{24,}
pk_(live|test)_[0-9a-zA-Z]{24,}
rk_(live|test)_[0-9a-zA-Z]{24,}

# Twilio
SK[0-9a-fA-F]{32}
```

### Tokens

```regex
# Generic Token
[tT][oO][kK][eE][nN][\s]*[=:]+[\s]*['"]?[\w-]{20,}

# GitHub Token
gh[pousr]_[A-Za-z0-9_]{36,}

# Slack Token
xox[baprs]-[0-9]{10,}-[0-9]{10,}-[a-zA-Z0-9]{24}

# Discord Token
[MN][A-Za-z\d]{23,}\.[\w-]{6}\.[\w-]{27}
```

### Private Keys

```regex
# RSA Private Key
-----BEGIN RSA PRIVATE KEY-----

# Generic Private Key
-----BEGIN (EC |DSA |OPENSSH )?PRIVATE KEY-----

# PGP Private Key
-----BEGIN PGP PRIVATE KEY BLOCK-----
```

### Passwords

```regex
# Password in code
[pP][aA][sS][sS][wW][oO][rR][dD][\s]*[=:]+[\s]*['"][^'"]{8,}

# Connection strings with credentials
(postgres|mysql|mongodb|redis):\/\/[^:]+:[^@]+@
```

### Certificates

```regex
# Certificate
-----BEGIN CERTIFICATE-----
```

---

## Scanning Tools

### git-secrets

AWS tool to prevent committing secrets.

```bash
# Install
brew install git-secrets

# Initialize in repo
git secrets --install
git secrets --register-aws

# Add custom patterns
git secrets --add 'PRIVATE_KEY'
git secrets --add --literal 'my-api-key'

# Scan
git secrets --scan
git secrets --scan-history
```

### gitleaks

Fast, comprehensive secret scanner.

```bash
# Install
brew install gitleaks

# Scan current state
gitleaks detect

# Scan with baseline
gitleaks detect --baseline-path .gitleaks-baseline.json

# Scan git history
gitleaks detect --log-opts="--all"

# Output report
gitleaks detect --report-path gitleaks-report.json
```

### trufflehog

Deep secret detection.

```bash
# Install
pip install trufflehog

# Scan repo
trufflehog git file://./

# Scan GitHub
trufflehog github --org=myorg

# High entropy detection
trufflehog filesystem --directory=./ --only-verified
```

### detect-secrets

Yelp's secret detection.

```bash
# Install
pip install detect-secrets

# Create baseline
detect-secrets scan > .secrets.baseline

# Audit baseline
detect-secrets audit .secrets.baseline

# Scan for new secrets
detect-secrets scan --baseline .secrets.baseline
```

---

## Pre-Commit Hooks

### git-secrets hook

```bash
# Install hooks
git secrets --install

# Auto-reject commits with secrets
# Hook runs on every commit
```

### gitleaks pre-commit

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks
```

### detect-secrets pre-commit

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
```

### Husky + lint-staged

```json
// package.json
{
  "lint-staged": {
    "*": "gitleaks protect --staged"
  }
}
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Secret Scan
on: [push, pull_request]

jobs:
  gitleaks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### GitLab CI

```yaml
secret_detection:
  stage: test
  image: zricethezav/gitleaks:latest
  script:
    - gitleaks detect --report-path gitleaks-report.json
  artifacts:
    reports:
      secret_detection: gitleaks-report.json
```

---

## GitHub Secret Scanning

GitHub's built-in scanning (free for public repos).

### Enable

1. Settings → Code security and analysis
2. Enable "Secret scanning"
3. Enable "Push protection" (prevents pushing secrets)

### Alerts

When detected:
1. Notifies repository admins
2. Notifies secret provider (if supported)
3. Provider may auto-revoke

### Custom Patterns

```yaml
# .github/secret_scanning.yml
paths-ignore:
  - 'tests/**'
  - '**/*.test.js'
```

---

## Manual Search Commands

### grep Patterns

```bash
# API Keys
grep -rn "api_key\|api-key\|apikey" --include="*.ts" --include="*.js" | grep -v "process.env"

# Passwords
grep -rn "password\|passwd\|pwd" --include="*.ts" --include="*.js" | grep -v "process.env" | grep -v "\.env"

# Tokens
grep -rn "token\s*[:=]" --include="*.ts" --include="*.js" | grep -v "process.env"

# Connection strings
grep -rn "postgres://\|mysql://\|mongodb://" --include="*.ts" --include="*.js" | grep -v "process.env"

# High entropy strings (potential secrets)
grep -rn "['\"][a-zA-Z0-9+/=]\{32,\}['\"]" --include="*.ts" --include="*.js"
```

### Find .env Files

```bash
# All env files
find . -name ".env*" -type f

# Check if tracked
git ls-files | grep -E "^\.env|\.env$"

# Check git history
git log --all --full-history -- "*.env" ".env*"
```

---

## False Positive Management

### Baseline Files

```bash
# Create baseline of known false positives
gitleaks detect --report-path .gitleaks-baseline.json

# Future scans compare against baseline
gitleaks detect --baseline-path .gitleaks-baseline.json
```

### Inline Ignores

```javascript
// For detect-secrets
const example = 'not-a-real-secret';  // pragma: allowlist secret

// For gitleaks - use .gitleaksignore
```

### .gitleaksignore

```
# Ignore specific files
tests/fixtures/mock-keys.json

# Ignore patterns
**/test/**
**/*.test.ts

# Ignore specific secrets (fingerprints)
abc123def456...
```

---

## When Secrets Are Found

### Immediate Actions

1. **Don't panic, but act fast**
2. **Rotate the secret immediately**
   - Don't wait to clean git history
   - Assume it's compromised
3. **Update all environments**
4. **Verify systems still work**

### Clean Git History

```bash
# Using BFG (recommended)
# 1. Clone fresh copy
git clone --mirror git@github.com:user/repo.git

# 2. Run BFG
bfg --replace-text passwords.txt repo.git

# 3. Clean up
cd repo.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. Force push
git push --force
```

### Using git filter-repo

```bash
# Install
pip install git-filter-repo

# Remove file from history
git filter-repo --path .env --invert-paths

# Replace text in history
git filter-repo --replace-text replacements.txt
```

---

## Prevention Checklist

- [ ] Pre-commit hooks installed
- [ ] CI/CD secret scanning enabled
- [ ] GitHub secret scanning enabled
- [ ] Team trained on secret handling
- [ ] .gitignore includes .env files
- [ ] Regular scans of git history
- [ ] Incident response plan documented
