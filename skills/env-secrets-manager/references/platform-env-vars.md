# Platform Environment Variables Guide

Configuration guides for popular deployment platforms.

---

## Vercel

### Dashboard Configuration

1. Go to Project Settings → Environment Variables
2. Add each variable with:
   - Name
   - Value
   - Environment(s): Production, Preview, Development

### CLI Configuration

```bash
# Add variable
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development

# List variables
vercel env ls

# Pull to local
vercel env pull .env.local

# Remove variable
vercel env rm DATABASE_URL production
```

### Environment Targeting

| Environment | When Used |
|-------------|-----------|
| Production | Main branch deployments |
| Preview | PR/branch deployments |
| Development | `vercel dev` local |

### Sensitive Variables

Mark as "Sensitive" to:
- Hide value in dashboard
- Prevent value in build logs
- Require confirmation to view

### System Variables

Vercel provides automatic variables:

| Variable | Value |
|----------|-------|
| `VERCEL` | `1` |
| `VERCEL_ENV` | `production`, `preview`, or `development` |
| `VERCEL_URL` | Deployment URL |
| `VERCEL_GIT_COMMIT_SHA` | Git commit SHA |

---

## Railway

### Dashboard Configuration

1. Select Project → Variables
2. Add variables (automatically encrypted)
3. Variables apply to all services in project

### CLI Configuration

```bash
# Set variable
railway variables set DATABASE_URL=xxx

# Set multiple
railway variables set KEY1=val1 KEY2=val2

# List variables
railway variables

# Delete variable
railway variables delete KEY1
```

### Service-Specific Variables

```bash
# Set for specific service
railway variables set API_KEY=xxx --service api
```

### Reference Variables

Use variables from other services:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
```

### Shared Variables

For variables used across services:
1. Project Settings → Shared Variables
2. Add variable
3. Available in all services

---

## Netlify

### Dashboard Configuration

1. Site Settings → Build & deploy → Environment
2. Add environment variables

### CLI Configuration

```bash
# Using netlify-cli
netlify env:set API_KEY "your-api-key"
netlify env:list
netlify env:unset API_KEY
```

### Context-Specific Variables

| Context | When Used |
|---------|-----------|
| Production | Production deployments |
| Deploy Preview | PR previews |
| Branch Deploy | Branch deployments |
| All | All contexts |

### netlify.toml

```toml
[build.environment]
  NODE_VERSION = "18"

# Context-specific (not for secrets!)
[context.production.environment]
  API_URL = "https://api.example.com"

[context.deploy-preview.environment]
  API_URL = "https://staging-api.example.com"
```

---

## GitHub Actions

### Repository Secrets

1. Settings → Secrets and variables → Actions
2. New repository secret
3. Use in workflows: `${{ secrets.SECRET_NAME }}`

### Workflow Usage

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
    steps:
      - name: Deploy
        env:
          API_KEY: ${{ secrets.API_KEY }}
        run: ./deploy.sh
```

### Environment Secrets

For environment-specific:

1. Settings → Environments → New environment
2. Add environment secrets
3. Reference in workflow:

```yaml
jobs:
  deploy:
    environment: production
    # Now has access to production secrets
```

### Organization Secrets

Share across repos:
1. Organization Settings → Secrets
2. Add secret
3. Set repository access

---

## AWS

### AWS Systems Manager Parameter Store

```bash
# Store secret
aws ssm put-parameter \
  --name "/myapp/prod/DATABASE_URL" \
  --value "postgres://..." \
  --type "SecureString"

# Retrieve
aws ssm get-parameter \
  --name "/myapp/prod/DATABASE_URL" \
  --with-decryption
```

### AWS Secrets Manager

```bash
# Create secret
aws secretsmanager create-secret \
  --name "myapp/prod/db" \
  --secret-string '{"username":"admin","password":"secret"}'

# Retrieve
aws secretsmanager get-secret-value \
  --secret-id "myapp/prod/db"
```

### In Lambda

```javascript
const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');

const ssm = new SSMClient();
const param = await ssm.send(new GetParameterCommand({
  Name: '/myapp/prod/DATABASE_URL',
  WithDecryption: true
}));
const dbUrl = param.Parameter.Value;
```

---

## Heroku

### Dashboard Configuration

1. App Settings → Config Vars
2. Reveal Config Vars
3. Add/Edit variables

### CLI Configuration

```bash
# Set variable
heroku config:set API_KEY=xxx -a myapp

# Set multiple
heroku config:set KEY1=val1 KEY2=val2 -a myapp

# List
heroku config -a myapp

# Remove
heroku config:unset API_KEY -a myapp
```

### Pipeline Variables

For review apps:
```bash
heroku config:set API_KEY=xxx -a myapp-pipeline
```

---

## Render

### Dashboard Configuration

1. Service → Environment
2. Add Environment Variable
3. Choose: Secret File or Environment Variable

### Secret Files

For multi-line secrets (certificates, JSON):
1. Add Secret File
2. Paste content
3. Reference as file path

### Environment Groups

Share variables across services:
1. Create Environment Group
2. Add variables
3. Link to services

---

## Fly.io

### CLI Configuration

```bash
# Set secrets (encrypted)
fly secrets set DATABASE_URL=xxx API_KEY=yyy

# List (values hidden)
fly secrets list

# Unset
fly secrets unset API_KEY
```

### fly.toml

```toml
# Non-sensitive only
[env]
  LOG_LEVEL = "info"
  PORT = "8080"

# Secrets via CLI only, never in file
```

### Import from .env

```bash
fly secrets import < .env.production
```

---

## Docker

### Docker Compose

```yaml
# docker-compose.yml
services:
  app:
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - API_KEY=${API_KEY}
    env_file:
      - .env
```

### Docker Run

```bash
# Single variable
docker run -e API_KEY=xxx myapp

# From file
docker run --env-file .env myapp
```

### Kubernetes Secrets

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myapp-secrets
type: Opaque
data:
  DATABASE_URL: cG9zdGdyZXM6Ly8uLi4=  # base64 encoded
  API_KEY: eHh4  # base64 encoded
```

```yaml
# In deployment
spec:
  containers:
    - name: app
      envFrom:
        - secretRef:
            name: myapp-secrets
```

---

## Quick Reference

| Platform | CLI Command | Dashboard Path |
|----------|-------------|----------------|
| Vercel | `vercel env add` | Settings → Environment Variables |
| Railway | `railway variables set` | Project → Variables |
| Netlify | `netlify env:set` | Site Settings → Environment |
| GitHub | N/A | Settings → Secrets |
| Heroku | `heroku config:set` | Settings → Config Vars |
| Render | N/A | Service → Environment |
| Fly.io | `fly secrets set` | N/A |
