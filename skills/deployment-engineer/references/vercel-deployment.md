# Vercel Deployment Best Practices

## Project Detection

Vercel auto-detects frameworks. Supported indicators:

| Framework | Detection |
|-----------|-----------|
| Next.js | `next` in dependencies |
| React | `react-scripts` or `vite` |
| Vue | `vue` in dependencies |
| Nuxt | `nuxt` in dependencies |
| SvelteKit | `@sveltejs/kit` in dependencies |

## Environment Variables

### Configuration Hierarchy

```
Production: vercel env pull .env.production.local
Preview: vercel env pull .env.preview.local
Development: vercel env pull .env.development.local
```

### Setting Variables

```bash
# Add secret (encrypted)
vercel env add DATABASE_URL production

# Add from file
vercel env add < .env.production

# List all
vercel env ls
```

### In vercel.json

```json
{
  "env": {
    "PUBLIC_VAR": "value"
  },
  "build": {
    "env": {
      "BUILD_VAR": "value"
    }
  }
}
```

## Custom Domains

```bash
# Add domain
vercel domains add example.com

# Verify DNS
vercel domains inspect example.com

# Set as production
vercel alias set deployment-url.vercel.app example.com
```

### DNS Configuration

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

## Preview Deployments

Every git push creates a preview deployment.

### Preview URLs

```
Branch: project-git-branch-name-team.vercel.app
PR: project-pr-123-team.vercel.app
Commit: project-abc123-team.vercel.app
```

### Preview Environment Variables

```json
{
  "env": {
    "DATABASE_URL": "@preview-database-url"
  }
}
```

## Edge Functions

### Configuration

```json
{
  "functions": {
    "api/edge/*.ts": {
      "runtime": "edge"
    }
  }
}
```

### Edge Function Pattern

```typescript
// api/edge/hello.ts
export const config = {
  runtime: 'edge',
};

export default function handler(request: Request) {
  return new Response('Hello from Edge!');
}
```

## Build Configuration

### vercel.json Complete Example

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "s-maxage=60" }
      ]
    }
  ]
}
```

## Deployment Commands

```bash
# Production deploy
vercel --prod

# Preview deploy (default)
vercel

# Specific environment
vercel --env NODE_ENV=staging

# Skip build confirmation
vercel --yes

# Deploy from specific directory
vercel ./dist --prod
```

## CI/CD Integration

### GitHub Actions

```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    vercel-args: '--prod'
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Build timeout | Increase `maxDuration` in functions config |
| Memory error | Increase `memory` allocation |
| 404 on routes | Check `rewrites` configuration |
| Env var missing | Verify environment scope (Production/Preview/Development) |

### Debug Mode

```bash
# Verbose output
vercel --debug

# Check deployment logs
vercel logs deployment-url.vercel.app
```

## Rollback

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel alias set previous-deployment.vercel.app production-domain.com

# Instant rollback (dashboard)
# Go to Deployments > Select Previous > Promote to Production
```
