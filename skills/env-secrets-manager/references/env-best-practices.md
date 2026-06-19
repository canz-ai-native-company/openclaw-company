# Environment Variables Best Practices

Comprehensive guide to managing environment variables securely.

---

## Core Principles

### 1. Never Commit Secrets

```gitignore
# .gitignore - MUST have these
.env
.env.local
.env.*.local
.env.development.local
.env.test.local
.env.production.local

# DO commit
!.env.example
```

### 2. Always Have .env.example

```bash
# .env.example - commit this
DATABASE_URL=postgres://user:password@localhost:5432/dbname
AUTH_SECRET=your_auth_secret_here
```

### 3. Use Environment-Specific Files

```
.env                    # Shared defaults
.env.local              # Local overrides (gitignored)
.env.development        # Development defaults
.env.production         # Production defaults (minimal)
.env.test               # Test environment
```

---

## File Hierarchy

### Load Order (Next.js)

```
Priority (highest to lowest):
1. .env.local
2. .env.development.local OR .env.production.local
3. .env.development OR .env.production
4. .env

Note: .env.local is NOT loaded in test environment
```

### Load Order (Vite)

```
Priority (highest to lowest):
1. .env.[mode].local
2. .env.[mode]
3. .env.local
4. .env
```

### Load Order (Node.js with dotenv)

```javascript
// Manual loading required
require('dotenv').config(); // Loads .env

// Or multiple files
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
```

---

## Naming Conventions

### Standard Patterns

| Pattern | Use For | Example |
|---------|---------|---------|
| `SERVICE_API_KEY` | API keys | `STRIPE_API_KEY` |
| `SERVICE_SECRET` | Secrets | `AUTH_SECRET` |
| `SERVICE_URL` | URLs | `DATABASE_URL` |
| `ENABLE_FEATURE` | Flags | `ENABLE_DEBUG` |
| `SERVICE_PORT` | Ports | `API_PORT` |

### Client-Safe Prefixes

| Framework | Prefix | Example |
|-----------|--------|---------|
| Next.js | `NEXT_PUBLIC_` | `NEXT_PUBLIC_API_URL` |
| Vite | `VITE_` | `VITE_API_URL` |
| Create React App | `REACT_APP_` | `REACT_APP_API_URL` |

### Rules

1. **UPPERCASE_SNAKE_CASE**
2. **Descriptive names**
3. **Prefix with service name** for external services
4. **No spaces or special characters**

---

## Security Best Practices

### Sensitivity Levels

| Level | Examples | Handling |
|-------|----------|----------|
| **Public** | App name, feature flags | Can be in code |
| **Private** | API URLs, non-secret IDs | Env vars only |
| **Critical** | API keys, passwords, secrets | Rotate regularly |

### Never Do

```javascript
// NEVER hardcode secrets
const apiKey = "sk_live_abc123"; // BAD

// NEVER log secrets
console.log(process.env.API_KEY); // BAD

// NEVER put in error messages
throw new Error(`Auth failed with key: ${apiKey}`); // BAD

// NEVER commit .env files
// Make sure .gitignore is correct
```

### Always Do

```javascript
// Use environment variables
const apiKey = process.env.STRIPE_API_KEY;

// Validate at startup
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

// Mask in logs if needed
console.log(`API Key: ${apiKey.slice(0, 8)}...`);
```

---

## Validation

### Runtime Validation

```typescript
// Using zod
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  PORT: z.coerce.number().default(3000),
});

export const env = envSchema.parse(process.env);
```

### TypeScript Types

```typescript
// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'staging' | 'production';
    DATABASE_URL: string;
    AUTH_SECRET: string;
    PORT?: string;
  }
}
```

### Required Check

```typescript
// config.ts
const requiredEnvVars = [
  'DATABASE_URL',
  'AUTH_SECRET',
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
```

---

## Organization Patterns

### By Service

```bash
# Database
DATABASE_URL=
DATABASE_POOL_SIZE=

# Auth
AUTH_SECRET=
AUTH_SESSION_DURATION=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
SMTP_HOST=
SMTP_PORT=
```

### By Environment Need

```bash
# Required for all environments
DATABASE_URL=
AUTH_SECRET=

# Required for production
STRIPE_SECRET_KEY=

# Optional / Development only
DEBUG=
```

---

## Common Patterns

### Feature Flags

```bash
ENABLE_NEW_FEATURE=true
ENABLE_ANALYTICS=true
ENABLE_DEBUG=false
```

```typescript
const isFeatureEnabled = process.env.ENABLE_NEW_FEATURE === 'true';
```

### Conditional Configuration

```typescript
const config = {
  database: process.env.DATABASE_URL,
  redis: process.env.REDIS_URL || null,
  debug: process.env.NODE_ENV !== 'production',
};
```

### Multi-Environment

```bash
# .env.development
API_URL=http://localhost:3000
STRIPE_KEY=sk_test_xxx

# .env.production
API_URL=https://api.example.com
STRIPE_KEY=sk_live_xxx  # Better: use platform secrets
```

---

## Anti-Patterns

### Don't Do This

```javascript
// Interpolating secrets in URLs
const url = `https://api.com?key=${process.env.API_KEY}`; // In logs!

// Default values for secrets
const secret = process.env.SECRET || 'default-secret'; // Insecure

// Exposing server secrets to client
// In Next.js page:
const apiKey = process.env.API_KEY; // Won't work, undefined

// Complex logic in env vars
const config = process.env.CONFIG_JSON; // Use config files
```

### Do This Instead

```javascript
// Keep secrets out of URLs when possible
const headers = { Authorization: `Bearer ${process.env.API_KEY}` };

// Require secrets, don't default
const secret = process.env.SECRET;
if (!secret) throw new Error('SECRET required');

// Use NEXT_PUBLIC_ prefix for client vars
const publicKey = process.env.NEXT_PUBLIC_API_KEY;

// Use proper config files for complex config
import config from './config.json';
```

---

## Debugging

### Check Available Variables

```javascript
// Development only!
console.log('Env vars:', Object.keys(process.env).filter(k => k.startsWith('NEXT_')));
```

### Verify Loading

```javascript
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Has DATABASE_URL:', !!process.env.DATABASE_URL);
console.log('Has AUTH_SECRET:', !!process.env.AUTH_SECRET);
```

### Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Variable is undefined | Not loaded | Check file exists, dotenv configured |
| Different value than expected | Override in .env.local | Check file priority |
| Client variable undefined | Missing prefix | Add NEXT_PUBLIC_ or VITE_ |
| Changes not applying | Cache | Restart dev server |
