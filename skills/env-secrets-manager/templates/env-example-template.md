# .env.example Template

Standard template for environment example files.

---

## Template

```bash
# ==============================================================================
# [PROJECT NAME] Environment Variables
# ==============================================================================
# Copy this file to .env.local and fill in the values
# NEVER commit actual .env files to git
#
# Variable Sensitivity Legend:
#   [PUBLIC]   - Safe to expose, no rotation needed
#   [PRIVATE]  - Keep secure, rotate occasionally
#   [CRITICAL] - Highly sensitive, rotate regularly
# ==============================================================================

# ==============================================================================
# Application Settings [PUBLIC]
# ==============================================================================

# Application environment
# Values: development | staging | production
NODE_ENV=development

# Server configuration
PORT=3000
HOST=localhost

# ==============================================================================
# Database [CRITICAL]
# ==============================================================================

# Primary database connection
# Format: postgres://USER:PASSWORD@HOST:PORT/DATABASE
# For local: postgres://postgres:postgres@localhost:5432/myapp_dev
DATABASE_URL=postgres://user:password@localhost:5432/database

# Connection pool settings (optional)
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# ==============================================================================
# Authentication [CRITICAL]
# ==============================================================================

# Session/JWT secret
# Generate with: openssl rand -base64 32
# MUST be unique per environment, MUST be rotated if exposed
AUTH_SECRET=generate_a_secure_random_string_here

# Session duration in seconds (default: 7 days)
AUTH_SESSION_MAX_AGE=604800

# ==============================================================================
# OAuth Providers [PRIVATE]
# ==============================================================================

# Google OAuth
# Get credentials: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
# Get credentials: https://github.com/settings/developers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# ==============================================================================
# Email Service [PRIVATE]
# ==============================================================================

# SMTP Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=noreply@example.com

# OR use service-specific
# Resend
RESEND_API_KEY=re_your_api_key

# SendGrid
SENDGRID_API_KEY=SG.your_api_key

# ==============================================================================
# Payment Processing [CRITICAL]
# ==============================================================================

# Stripe
# Use test keys (sk_test_/pk_test_) for development
# Live keys (sk_live_/pk_live_) for production ONLY
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# ==============================================================================
# File Storage [PRIVATE]
# ==============================================================================

# AWS S3 / Compatible
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# OR Cloudflare R2
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET=your-bucket-name
R2_ENDPOINT=https://account_id.r2.cloudflarestorage.com

# ==============================================================================
# External APIs [PRIVATE]
# ==============================================================================

# OpenAI
OPENAI_API_KEY=sk-your_openai_api_key

# Analytics
ANALYTICS_ID=your_analytics_id

# Error tracking
SENTRY_DSN=https://key@sentry.io/project

# ==============================================================================
# Feature Flags [PUBLIC]
# ==============================================================================

# Enable/disable features
ENABLE_ANALYTICS=true
ENABLE_DEBUG_MODE=false
ENABLE_MAINTENANCE_MODE=false

# ==============================================================================
# Public Variables (Exposed to Client) [PUBLIC]
# ==============================================================================
# These are accessible in browser code
# Prefix with NEXT_PUBLIC_ (Next.js) or VITE_ (Vite)

# API endpoint
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# App metadata
NEXT_PUBLIC_APP_NAME=My App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Third-party public keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
NEXT_PUBLIC_ANALYTICS_ID=your_public_id
```

---

## Sections Guide

| Section | Sensitivity | Contents |
|---------|-------------|----------|
| Application | Public | Node env, ports, hosts |
| Database | Critical | Connection strings |
| Authentication | Critical | Secrets, JWT keys |
| OAuth | Private | Client IDs and secrets |
| Email | Private | SMTP, API keys |
| Payments | Critical | Stripe/payment keys |
| Storage | Private | S3/cloud storage creds |
| External APIs | Private | Third-party API keys |
| Feature Flags | Public | Toggle features |
| Public Vars | Public | Client-exposed vars |

---

## Placeholder Standards

Use consistent placeholder patterns:

| Pattern | Example | Meaning |
|---------|---------|---------|
| `your_*_here` | `your_api_key_here` | Replace with actual value |
| `generate_*` | `generate_a_secure_random_string_here` | Must generate new |
| `xxx_` prefix | `xxx_abc123` | Test/development value |
| Full example | `postgres://user:pass@host:5432/db` | Format example |

---

## Comments Guide

Each variable should have:

1. **Description**: What it's for
2. **Format**: Expected format (if complex)
3. **How to get**: URL or command to obtain
4. **Sensitivity**: PUBLIC, PRIVATE, or CRITICAL

```bash
# Session/JWT secret
# Generate with: openssl rand -base64 32
# MUST be unique per environment
# [CRITICAL]
AUTH_SECRET=generate_a_secure_random_string_here
```

---

## Framework-Specific Templates

### Next.js

```bash
# Client-exposed (prefix required)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=My App

# Server-only (no prefix)
DATABASE_URL=postgres://...
AUTH_SECRET=...
```

### Vite

```bash
# Client-exposed (prefix required)
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=My App

# Server-only (in vite.config.ts)
# Use dotenv for server scripts
```

### Node.js/Express

```bash
# All variables server-only
PORT=3000
DATABASE_URL=postgres://...
JWT_SECRET=...
```
