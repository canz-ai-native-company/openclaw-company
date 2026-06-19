# Rollback Procedures

## Pre-Deployment Checklist

Before any deployment, document:

```
[ ] Current deployment URL/version
[ ] Current git commit SHA
[ ] Snapshot of environment variables
[ ] Database migration state
[ ] Dependent service versions
```

## Platform-Specific Rollback

### Vercel Rollback

#### Instant Rollback (Dashboard)
1. Go to Project → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

#### CLI Rollback

```bash
# List deployments
vercel ls

# Find previous deployment URL
vercel ls --limit 10

# Promote previous deployment
vercel alias set <previous-deployment-url> <production-domain>

# Example
vercel alias set my-app-abc123.vercel.app myapp.com
```

#### Rollback Script

```bash
#!/bin/bash
# rollback-vercel.sh

# Get current production deployment
CURRENT=$(vercel ls --prod --limit 1 | tail -1 | awk '{print $1}')

# Get previous deployment
PREVIOUS=$(vercel ls --prod --limit 2 | tail -1 | awk '{print $1}')

echo "Rolling back from $CURRENT to $PREVIOUS"

# Promote previous
vercel alias set $PREVIOUS $PRODUCTION_DOMAIN

echo "Rollback complete"
```

### Docker Rollback

#### Tag-Based Rollback

```bash
# Pull previous version
docker pull myapp:v1.2.2

# Stop current
docker-compose down

# Update tag in compose or use
docker run -d --name myapp myapp:v1.2.2

# Or update docker-compose.yml
# image: myapp:v1.2.2
docker-compose up -d
```

#### Rollback Script

```bash
#!/bin/bash
# rollback-docker.sh

PREVIOUS_TAG=${1:-"previous"}

echo "Stopping current deployment..."
docker-compose down

echo "Starting previous version: $PREVIOUS_TAG"
docker-compose -f docker-compose.yml up -d --no-build

echo "Verifying health..."
sleep 10
curl -f http://localhost:3000/health || {
    echo "Health check failed!"
    exit 1
}

echo "Rollback to $PREVIOUS_TAG complete"
```

### Kubernetes Rollback

```bash
# View rollout history
kubectl rollout history deployment/myapp

# Rollback to previous revision
kubectl rollout undo deployment/myapp

# Rollback to specific revision
kubectl rollout undo deployment/myapp --to-revision=3

# Check rollback status
kubectl rollout status deployment/myapp

# View current revision
kubectl describe deployment/myapp | grep revision
```

#### Rollback with Helm

```bash
# List releases
helm history myapp

# Rollback to previous
helm rollback myapp

# Rollback to specific revision
helm rollback myapp 3

# Verify
helm status myapp
```

### VPS/SSH Rollback

#### Git-Based Rollback

```bash
#!/bin/bash
# rollback-vps.sh

REMOTE_USER="deploy"
REMOTE_HOST="server.example.com"
APP_DIR="/var/www/myapp"

ssh $REMOTE_USER@$REMOTE_HOST << 'EOF'
cd /var/www/myapp

# Get current commit
CURRENT=$(git rev-parse HEAD)
echo "Current: $CURRENT"

# Rollback to previous commit
git checkout HEAD^

# Rebuild
npm ci
npm run build

# Restart
pm2 restart all

# Verify
curl -f http://localhost:3000/health || {
    echo "Rollback failed, restoring..."
    git checkout $CURRENT
    npm ci && npm run build && pm2 restart all
}
EOF
```

#### Symlink-Based Rollback

```bash
# Directory structure:
# /var/www/releases/20240115_120000/
# /var/www/releases/20240114_100000/
# /var/www/current -> /var/www/releases/20240115_120000/

# Rollback
PREVIOUS_RELEASE=$(ls -t /var/www/releases | head -2 | tail -1)
ln -sfn /var/www/releases/$PREVIOUS_RELEASE /var/www/current
sudo systemctl restart myapp
```

### PM2 Rollback

```bash
# List process IDs
pm2 ls

# Rollback specific app
pm2 deploy production revert 1

# Manual rollback with ecosystem
pm2 stop all
git checkout HEAD^
npm ci && npm run build
pm2 start ecosystem.config.js
```

## Database Rollback

### Migration Rollback

#### Prisma

```bash
# Rollback last migration
npx prisma migrate rollback

# Reset to specific migration
npx prisma migrate reset --to <migration_name>
```

#### Knex

```bash
# Rollback last batch
npx knex migrate:rollback

# Rollback all
npx knex migrate:rollback --all
```

#### Django

```bash
# Rollback to specific migration
python manage.py migrate myapp 0003_previous_migration
```

### Database Snapshot Restore

```bash
# PostgreSQL
pg_restore -d mydb backup_20240114.dump

# MySQL
mysql mydb < backup_20240114.sql

# MongoDB
mongorestore --db mydb backup/20240114/
```

## Emergency Rollback Playbook

### Step 1: Assess Impact

```
[ ] Identify affected endpoints/services
[ ] Check error rates and logs
[ ] Determine if data corruption occurred
[ ] Identify rollback target (version/commit)
```

### Step 2: Communication

```
[ ] Notify team in #incidents channel
[ ] Update status page (if applicable)
[ ] Document timeline
```

### Step 3: Execute Rollback

```bash
# Generic rollback flow
1. Stop incoming traffic (if possible)
2. Execute platform-specific rollback
3. Verify health checks pass
4. Resume traffic
5. Monitor for 15 minutes
```

### Step 4: Post-Mortem

```
[ ] Document what went wrong
[ ] Timeline of events
[ ] Root cause analysis
[ ] Preventive measures
```

## Rollback Decision Tree

```
Deployment Failed?
├── Build Stage Failed
│   └── No rollback needed (nothing deployed)
│
├── Deploy Stage Failed
│   └── Check if partial deployment occurred
│       ├── Yes → Rollback immediately
│       └── No → No rollback needed
│
└── Health Check Failed
    └── Rollback to previous version
        └── If rollback fails → Escalate immediately
```

## Rollback Automation

### CI/CD Automatic Rollback

```yaml
# GitHub Actions
- name: Deploy
  id: deploy
  run: ./deploy.sh

- name: Health Check
  id: health
  run: |
    sleep 30
    curl -f ${{ env.DEPLOY_URL }}/health || exit 1

- name: Rollback on Failure
  if: failure() && steps.deploy.outcome == 'success'
  run: ./rollback.sh ${{ env.PREVIOUS_VERSION }}
```

### Monitoring-Triggered Rollback

```yaml
# Datadog Monitor
monitors:
  - name: Auto-Rollback on High Error Rate
    query: "avg:app.error_rate{env:production} > 5"
    threshold: 5
    notify:
      - webhook: https://deploy.example.com/rollback
```

## Rollback Report Template

```markdown
## Rollback Report

**Date**: YYYY-MM-DD HH:MM
**Performed By**: [Name]
**Platform**: [Vercel/Docker/VPS]

### Versions
- **Rolled Back From**: v1.2.3 (abc123)
- **Rolled Back To**: v1.2.2 (def456)

### Reason
[Brief description of why rollback was needed]

### Timeline
- HH:MM - Issue detected
- HH:MM - Decision to rollback
- HH:MM - Rollback initiated
- HH:MM - Rollback completed
- HH:MM - Health check passed

### Impact
- Duration: X minutes
- Affected users: Estimated Y
- Data impact: [None/Describe]

### Follow-up Actions
1. [ ] Root cause analysis
2. [ ] Fix identified issues
3. [ ] Update deployment process
```
