# Secrets Rotation Guide

How to safely rotate secrets without downtime.

---

## When to Rotate

### Immediate Rotation Required

| Trigger | Action |
|---------|--------|
| Secret committed to git | Rotate within minutes |
| Secret in logs | Rotate immediately |
| Team member leaves | Rotate shared secrets |
| Security breach suspected | Rotate all secrets |
| Secret shared insecurely | Rotate immediately |

### Scheduled Rotation

| Secret Type | Frequency |
|-------------|-----------|
| Auth/JWT secrets | Every 90 days |
| API keys | Every 90-180 days |
| Database passwords | Every 90 days |
| OAuth secrets | Annually |
| Encryption keys | Annually |

---

## Rotation Strategies

### Zero-Downtime Rotation

```
1. Add new secret alongside old
2. Update application to accept both
3. Deploy with both secrets valid
4. Verify new secret works
5. Remove old secret from app
6. Revoke old secret at provider
```

### Maintenance Window Rotation

```
1. Schedule maintenance window
2. Generate new secret
3. Update all configurations
4. Deploy
5. Verify functionality
6. Revoke old secret
```

---

## Secret-Specific Guides

### AUTH_SECRET / JWT Secret

**Impact**: All existing sessions invalidated

```bash
# Generate new secret
openssl rand -base64 32
```

**Zero-Downtime Approach:**

```typescript
// Support multiple secrets during transition
const secrets = [
  process.env.AUTH_SECRET,
  process.env.AUTH_SECRET_OLD,
].filter(Boolean);

// Verify with any valid secret
for (const secret of secrets) {
  try {
    return verify(token, secret);
  } catch {}
}
throw new Error('Invalid token');
```

**Steps:**

1. Generate new AUTH_SECRET
2. Set AUTH_SECRET_OLD = current AUTH_SECRET
3. Set AUTH_SECRET = new value
4. Deploy
5. Wait for session timeout (7+ days typically)
6. Remove AUTH_SECRET_OLD

---

### Database Credentials

**Impact**: Connection failures during rotation

**PostgreSQL:**

```sql
-- 1. Create new user
CREATE USER newuser WITH PASSWORD 'new_password';
GRANT ALL PRIVILEGES ON DATABASE mydb TO newuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO newuser;

-- 2. Update application with new credentials
-- 3. Verify connections work
-- 4. Revoke old user
DROP USER olduser;
```

**Connection String:**

```bash
# Old
DATABASE_URL=postgres://olduser:oldpass@host:5432/db

# New
DATABASE_URL=postgres://newuser:newpass@host:5432/db
```

---

### Stripe API Keys

**Impact**: API calls fail with old key

**Steps:**

1. Go to Stripe Dashboard → Developers → API Keys
2. Roll the key (creates new, old remains valid temporarily)
3. Update all environments with new key
4. Test payment flows
5. Confirm old key usage is zero
6. Old key auto-expires

**Code Update:**

```bash
# Old key still works for grace period
STRIPE_SECRET_KEY=sk_live_OLD_KEY

# Update to new key
STRIPE_SECRET_KEY=sk_live_NEW_KEY
```

---

### OAuth Client Secrets

**Google:**

1. Google Cloud Console → Credentials
2. Edit OAuth client
3. Reset client secret
4. Update application immediately
5. Old secret invalidated instantly

**GitHub:**

1. Settings → Developer settings → OAuth Apps
2. Select app → Generate new client secret
3. Update application
4. Delete old secret

**Warning**: Most OAuth providers invalidate old secret immediately!

---

### AWS Access Keys

**Best Practice**: Use IAM roles instead of access keys

**If Using Keys:**

```bash
# 1. Create new access key (user can have 2)
aws iam create-access-key --user-name myuser

# 2. Update application with new key
AWS_ACCESS_KEY_ID=new_key
AWS_SECRET_ACCESS_KEY=new_secret

# 3. Deploy and verify
# 4. Deactivate old key
aws iam update-access-key --user-name myuser --access-key-id OLD_KEY --status Inactive

# 5. After grace period, delete old key
aws iam delete-access-key --user-name myuser --access-key-id OLD_KEY
```

---

## Rotation Checklist

### Before Rotation

- [ ] Identify all places secret is used
- [ ] Check secret in: code, CI/CD, platforms, local envs
- [ ] Plan rollback procedure
- [ ] Schedule if maintenance needed
- [ ] Notify team

### During Rotation

- [ ] Generate new secret securely
- [ ] Update development environment
- [ ] Update staging environment
- [ ] Test in staging
- [ ] Update production environment
- [ ] Verify production works

### After Rotation

- [ ] Revoke old secret at provider
- [ ] Remove old secret from all configs
- [ ] Update documentation
- [ ] Log rotation in security records
- [ ] Set reminder for next rotation

---

## Emergency Rotation

### Secret Exposed in Git

```bash
# 1. Rotate immediately - don't wait to clean git
# Generate new secret first!

# 2. Clean git history (optional, but recommended)
# Use BFG Repo Cleaner
bfg --replace-text passwords.txt

# Or git filter-branch
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Force push (coordinate with team)
git push --force --all

# 4. Invalidate old secret at provider
```

### Secret in Logs

```bash
# 1. Rotate secret immediately
# 2. Delete/redact logs
# 3. Check log aggregators (Datadog, CloudWatch, etc.)
# 4. Review logging code to prevent recurrence
```

---

## Automation

### GitHub Actions Secret Rotation

```yaml
name: Rotate Secrets
on:
  schedule:
    - cron: '0 0 1 */3 *'  # Every 3 months

jobs:
  rotate:
    runs-on: ubuntu-latest
    steps:
      - name: Generate new secret
        run: |
          NEW_SECRET=$(openssl rand -base64 32)
          echo "::add-mask::$NEW_SECRET"
          # Update via API or CLI
```

### Rotation Reminder

```yaml
# .github/workflows/secret-reminder.yml
name: Secret Rotation Reminder
on:
  schedule:
    - cron: '0 9 1 */3 *'  # 9 AM on 1st of every 3rd month

jobs:
  remind:
    runs-on: ubuntu-latest
    steps:
      - name: Create reminder issue
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'Quarterly Secret Rotation Due',
              body: 'Time to rotate secrets. See SECRETS_ROTATION.md',
              labels: ['security', 'maintenance']
            })
```

---

## Rollback Procedures

### If New Secret Doesn't Work

1. **Keep old secret available** (don't revoke until verified)
2. Revert to old secret in configuration
3. Deploy rollback
4. Investigate issue
5. Retry rotation with fixes

### If Service is Down

1. Check if secret-related error
2. Verify secret is correctly formatted
3. Check secret hasn't been revoked
4. Roll back to previous known-working secret
5. Investigate root cause
