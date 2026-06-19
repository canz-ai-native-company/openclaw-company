# Production Readiness Checklist

CI/CD, deployment, monitoring, and environment patterns for Step 10 of the Design Thinking Protocol.

---

## CI/CD Pipeline Templates

### GitHub Actions — Next.js

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Unit & Integration tests
        run: npm test
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}

      - name: Build
        run: npm run build

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Audit dependencies
        run: npm audit --audit-level=high

      - name: Secret scan
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  deploy:
    needs: [quality, security]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### GitHub Actions — FastAPI/Python

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Lint
        run: ruff check .

      - name: Type check
        run: mypy .

      - name: Tests
        run: pytest --cov=src --cov-report=xml
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}

      - name: Build check
        run: python -m build

  deploy:
    needs: quality
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## Pipeline Steps Reference

| Step | Tool | Purpose | Blocks Deploy? |
|------|------|---------|----------------|
| **Lint** | ESLint/Ruff | Code style | Yes |
| **Type Check** | TypeScript/MyPy | Type safety | Yes |
| **Unit Tests** | Jest/Pytest | Logic correctness | Yes |
| **Integration Tests** | Jest/Pytest | API contracts | Yes |
| **Security Audit** | npm audit/pip audit | Dependency vulns | Yes (high/critical) |
| **Secret Scan** | gitleaks | No secrets in code | Yes |
| **Build** | Next build/Docker | Compilation | Yes |
| **E2E Tests** | Playwright/Cypress | User flows | Optional |
| **Deploy** | Platform CLI | Production release | N/A |
| **Health Check** | curl | Post-deploy verify | Triggers rollback |

---

## Deployment Patterns

### Platform Comparison

| Platform | Best For | Deploy Method | Cost |
|----------|----------|---------------|------|
| **Vercel** | Next.js, frontend | Git push / CLI | Free tier |
| **Railway** | Full-stack, APIs | Git push / CLI | Usage-based |
| **Render** | Web services, APIs | Git push | Free tier |
| **Fly.io** | Containers, global | CLI | Usage-based |
| **AWS** | Enterprise, complex | Various | Pay-as-you-go |

### Deployment Strategies

| Strategy | Description | Risk | Use When |
|----------|-------------|------|----------|
| **Rolling** | Gradual replacement | Low | Default choice |
| **Blue-Green** | Full environment swap | Very Low | Zero-downtime required |
| **Canary** | Partial traffic routing | Low | Large user base |
| **Recreate** | Stop old, start new | Medium | Small apps, OK with downtime |

### Rollback Plan

```
1. Detect failure (health check fails, error spike)
2. Revert: git revert <commit> && git push
3. Platform auto-deploys previous version
4. Verify health check passes
5. Investigate root cause
6. Fix and re-deploy
```

---

## Health Check Endpoint

### Implementation

```typescript
// Next.js: app/api/health/route.ts
export async function GET() {
  try {
    // Check database
    await db.$queryRaw`SELECT 1`;

    return Response.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    return Response.json(
      { status: 'error', message: 'Database unreachable' },
      { status: 503 }
    );
  }
}
```

```python
# FastAPI
@app.get("/health")
async def health_check():
    try:
        await db.execute("SELECT 1")
        return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}
    except Exception:
        raise HTTPException(status_code=503, detail="Database unreachable")
```

---

## Monitoring & Logging

### Logging Strategy

| Level | Use For | Example |
|-------|---------|---------|
| **ERROR** | Exceptions, failures | Database connection failed |
| **WARN** | Recoverable issues | Rate limit approaching |
| **INFO** | Important events | User registered, payment processed |
| **DEBUG** | Development detail | Query executed, cache hit/miss |

### Logging Rules

1. **Never log secrets** — mask API keys, passwords
2. **Structure logs** — JSON format for parsing
3. **Include context** — request ID, user ID, action
4. **Set level by environment** — DEBUG in dev, INFO in prod

### Error Tracking

| Tool | Use For | Setup |
|------|---------|-------|
| **Sentry** | Error tracking | SDK + DSN env var |
| **LogTail** | Log aggregation | API key + transport |
| **Datadog** | Full observability | Agent + API key |

---

## Environment Management

### .env.example Template

```bash
# ==================================
# Required (app won't start without)
# ==================================
DATABASE_URL=postgres://user:pass@localhost:5432/db
AUTH_SECRET=generate_with_openssl_rand_base64_32

# ==================================
# Optional (has defaults)
# ==================================
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# ==================================
# External Services
# ==================================
# STRIPE_SECRET_KEY=sk_test_xxx
# GOOGLE_CLIENT_ID=xxx
# SENTRY_DSN=https://xxx@sentry.io/xxx

# ==================================
# Public (exposed to client)
# ==================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Environment Parity

| Aspect | Development | Staging | Production |
|--------|-------------|---------|------------|
| Database | Local PostgreSQL | Neon (branch) | Neon (main) |
| Auth | Test providers | Test providers | Live providers |
| Payments | Test keys | Test keys | Live keys |
| Email | Console output | Test inbox | Live SMTP |
| Logging | DEBUG | INFO | WARN+ERROR |
| Secrets | .env.local | Platform vars | Platform vars |

---

## Definition of Done Template

### Universal Checklist

```markdown
## Definition of Done

### Code Quality
- [ ] All tests pass (unit + integration)
- [ ] Lint: 0 errors, 0 warnings
- [ ] TypeCheck: 0 errors
- [ ] No TODO/FIXME in committed code
- [ ] Code reviewed and approved

### Security
- [ ] Security scan: no critical/high issues
- [ ] No hardcoded secrets
- [ ] Input validation on all user input
- [ ] Auth middleware on protected routes
- [ ] .env.example complete

### Functionality
- [ ] All acceptance criteria met
- [ ] Error states handled gracefully
- [ ] Loading states implemented
- [ ] Edge cases handled

### Deployment
- [ ] CI/CD pipeline passes
- [ ] Build succeeds
- [ ] Health endpoint responds
- [ ] Production secrets configured
- [ ] Monitoring/alerting configured

### Documentation
- [ ] API documentation current
- [ ] README updated if needed
- [ ] .env.example has all new variables
- [ ] Breaking changes documented

### Project-Specific
- [ ] [Add project-specific items here]
```

---

## Production Readiness Template

Use for Step 10 output:

```markdown
## 11. CI/CD Pipeline

- Trigger: Push to main / PR to main
- Steps: lint → typecheck → test → security → build → deploy
- Platform: GitHub Actions
- Secrets needed: [list]

## 12. Deployment Strategy

| Aspect | Plan |
|--------|------|
| Platform | [Vercel/Railway/etc.] |
| Method | Git push auto-deploy |
| Preview | PR deployments |
| Rollback | git revert + redeploy |
| Health Check | GET /api/health |

## 13. Definition of Done

[Use checklist from above, customized for project]
```
