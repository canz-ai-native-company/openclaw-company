# Secrets in CI

Secure management of secrets and credentials in GitHub Actions.

---

## Secret Types

| Type | Scope | Use Case |
|------|-------|----------|
| Repository Secrets | Single repo | API keys, tokens |
| Environment Secrets | Per environment | Prod vs staging credentials |
| Organization Secrets | All/selected repos | Shared credentials |

---

## Creating Secrets

### Via GitHub UI
1. Repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Enter name (UPPERCASE_WITH_UNDERSCORES)
4. Enter value
5. Add secret

### Via GitHub CLI
```bash
# Set secret
gh secret set API_KEY --body "your-api-key"

# Set from file
gh secret set SSL_CERT < ./cert.pem

# Set for specific environment
gh secret set DB_PASSWORD --env production --body "password"
```

---

## Using Secrets in Workflows

### Basic Usage
```yaml
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}
    run: ./deploy.sh
```

### In Action Inputs
```yaml
steps:
  - uses: some-action@v1
    with:
      token: ${{ secrets.GITHUB_TOKEN }}
```

### Conditional on Secret Existence
```yaml
steps:
  - name: Deploy if secrets exist
    if: ${{ secrets.DEPLOY_KEY != '' }}
    run: ./deploy.sh
```

---

## Security Best Practices

### DO
```yaml
# Use secrets context
env:
  API_KEY: ${{ secrets.API_KEY }}

# Mask in logs (automatic for secrets.*)
run: echo "::add-mask::$SENSITIVE_VALUE"

# Limit secret exposure to specific steps
steps:
  - name: Build
    run: npm run build
    # No secrets exposed here

  - name: Deploy
    env:
      DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
    run: ./deploy.sh
```

### DON'T
```yaml
# NEVER log secrets
run: echo ${{ secrets.API_KEY }}  # DANGEROUS!

# NEVER use in URLs
run: curl https://api.example.com?key=${{ secrets.API_KEY }}  # DANGEROUS!

# NEVER commit to code
env:
  API_KEY: "hardcoded-key"  # DANGEROUS!
```

---

## Environment-Specific Secrets

### Setting Up Environments
1. Repository Settings → Environments
2. Create environments: `staging`, `production`
3. Add secrets per environment
4. Configure protection rules

### Using Environment Secrets
```yaml
jobs:
  deploy-staging:
    environment: staging
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        env:
          # Uses staging environment's DATABASE_URL
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: ./deploy.sh

  deploy-production:
    environment: production
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        env:
          # Uses production environment's DATABASE_URL
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: ./deploy.sh
```

---

## GITHUB_TOKEN

Automatic token with scoped permissions:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v5

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
```

### Token Permissions
```yaml
permissions:
  contents: read        # Read repo contents
  packages: write       # Push to GHCR
  pull-requests: write  # Comment on PRs
  issues: write         # Create/update issues
  actions: read         # Read workflow runs
  id-token: write       # OIDC token (for cloud auth)
```

---

## Cloud Provider Authentication

### AWS (OIDC - Recommended)
```yaml
jobs:
  deploy:
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/GitHubActions
          aws-region: us-east-1
```

### AWS (Access Keys)
```yaml
steps:
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      aws-region: us-east-1
```

### Google Cloud (OIDC)
```yaml
jobs:
  deploy:
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: projects/123/locations/global/workloadIdentityPools/pool/providers/provider
          service_account: sa@project.iam.gserviceaccount.com
```

---

## Secret Rotation

### Best Practices
1. Rotate secrets regularly (90 days recommended)
2. Use short-lived tokens when possible
3. Monitor secret usage in audit logs
4. Use OIDC for cloud providers (no static credentials)

### Automation
```yaml
# Check secret age (external script)
steps:
  - name: Check secret age
    run: |
      # Custom logic to verify secrets aren't stale
      ./scripts/check-secret-age.sh
```

---

## Common Secrets Reference

| Secret Name | Service | Purpose |
|-------------|---------|---------|
| `GITHUB_TOKEN` | GitHub | Auto-provided, repo access |
| `NPM_TOKEN` | npm | Package publishing |
| `VERCEL_TOKEN` | Vercel | Deployment |
| `DOCKER_USERNAME` | Docker Hub | Image push |
| `DOCKER_PASSWORD` | Docker Hub | Image push |
| `AWS_ACCESS_KEY_ID` | AWS | API access |
| `AWS_SECRET_ACCESS_KEY` | AWS | API access |
| `CODECOV_TOKEN` | Codecov | Coverage upload |
| `SENTRY_AUTH_TOKEN` | Sentry | Release tracking |
