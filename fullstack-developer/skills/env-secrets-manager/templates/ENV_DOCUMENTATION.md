# Environment Variables Documentation Template

Document all environment variables used in the project.

---

## Template

```markdown
# Environment Variables

Last updated: [DATE]

## Quick Start

1. Copy `.env.example` to `.env.local`
2. Fill in required variables (marked with *)
3. Restart the development server

## Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` * | PostgreSQL connection string | `postgres://user:pass@localhost:5432/db` |
| `AUTH_SECRET` * | Session encryption key | Generate with `openssl rand -base64 32` |

## All Variables

### Application

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Environment mode |
| `PORT` | No | `3000` | Server port |

### Database

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |

### Authentication

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AUTH_SECRET` | Yes | - | Encryption key for sessions |

[Continue for all sections...]

## Obtaining Credentials

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create or select a project
3. Navigate to APIs & Services → Credentials
4. Create OAuth 2.0 Client ID
5. Copy Client ID and Client Secret

### Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Developers → API Keys
3. Use test keys for development
4. Use live keys for production only

## Environment-Specific Values

### Development

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `development` |
| `STRIPE_SECRET_KEY` | `sk_test_...` |

### Staging

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `staging` |
| `STRIPE_SECRET_KEY` | `sk_test_...` |

### Production

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `STRIPE_SECRET_KEY` | `sk_live_...` (in platform secrets) |

## Security Notes

- Never commit `.env` files
- Rotate `AUTH_SECRET` immediately if exposed
- Use test keys only in development
- Store production secrets in platform (Vercel, Railway, etc.)
```

---

## Sections Explained

### Quick Start

Brief instructions to get running:
- Which file to copy
- Minimum required variables
- Any setup commands

### Required vs Optional

Mark required variables clearly:
- Use `*` or "Yes" in Required column
- Group required at top
- Explain defaults for optional

### Obtaining Credentials

Step-by-step for each service:
- Direct links to dashboards
- Exact navigation path
- Screenshot references (optional)

### Environment-Specific

Show differences between environments:
- Development (test values)
- Staging (test or preview values)
- Production (live values, stored securely)

---

## Example: Full Documentation

```markdown
# Environment Variables

> Last updated: 2024-01-15

## Quick Start

```bash
# 1. Copy example file
cp .env.example .env.local

# 2. Generate auth secret
openssl rand -base64 32

# 3. Start development
npm run dev
```

## Variable Reference

### Application Configuration

#### `NODE_ENV`

| Property | Value |
|----------|-------|
| Required | No |
| Default | `development` |
| Values | `development`, `staging`, `production` |

Sets the application environment. Affects logging, error display, and optimizations.

---

#### `PORT`

| Property | Value |
|----------|-------|
| Required | No |
| Default | `3000` |
| Type | Number |

Server port for the application.

---

### Database

#### `DATABASE_URL` *

| Property | Value |
|----------|-------|
| Required | **Yes** |
| Format | `postgres://USER:PASSWORD@HOST:PORT/DATABASE` |
| Sensitivity | Critical |

PostgreSQL connection string.

**Local Development:**
```
postgres://postgres:postgres@localhost:5432/myapp_dev
```

**Production:**
Obtain from your database provider (Neon, Supabase, Railway, etc.)

---

### Authentication

#### `AUTH_SECRET` *

| Property | Value |
|----------|-------|
| Required | **Yes** |
| Format | Base64 string, min 32 chars |
| Sensitivity | Critical |
| Rotation | Immediately if exposed |

Encryption key for session cookies and JWT tokens.

**Generate:**
```bash
openssl rand -base64 32
```

**Security:**
- Must be unique per environment
- Never share between dev/staging/production
- Rotate immediately if committed to git

---

### OAuth: Google

#### `GOOGLE_CLIENT_ID`

| Property | Value |
|----------|-------|
| Required | If using Google auth |
| Format | `xxxxxx.apps.googleusercontent.com` |
| Where to get | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |

#### `GOOGLE_CLIENT_SECRET`

| Property | Value |
|----------|-------|
| Required | If using Google auth |
| Sensitivity | Private |

**Setup Steps:**
1. Go to Google Cloud Console
2. Create/select project
3. APIs & Services → Credentials
4. Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Add authorized redirect URIs:
   - Dev: `http://localhost:3000/api/auth/callback/google`
   - Prod: `https://yourdomain.com/api/auth/callback/google`

---

### Payments: Stripe

#### `STRIPE_SECRET_KEY` *

| Property | Value |
|----------|-------|
| Required | If using payments |
| Format | `sk_test_...` or `sk_live_...` |
| Sensitivity | Critical |

**Important:**
- Use `sk_test_` keys for development
- Use `sk_live_` keys for production ONLY
- Never commit live keys

#### `STRIPE_WEBHOOK_SECRET`

| Property | Value |
|----------|-------|
| Required | If using webhooks |
| Format | `whsec_...` |

**Local Testing:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Use the webhook signing secret from output
```

---

## Deployment Checklist

- [ ] All required variables set in platform
- [ ] Using production values (not test)
- [ ] No `.env` files in deployment
- [ ] Webhook URLs updated to production domain
- [ ] OAuth redirect URIs include production domain
```
