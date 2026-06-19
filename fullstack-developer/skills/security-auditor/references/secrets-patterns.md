# Secrets Detection Patterns

Comprehensive regex patterns for detecting hardcoded secrets and credentials.

---

## Pattern Categories

| Category | Risk Level | Priority |
|----------|------------|----------|
| Private Keys | Critical | Immediate |
| Cloud Provider Keys | Critical | Immediate |
| API Keys | High | 24 hours |
| Database Credentials | High | 24 hours |
| Authentication Tokens | High | 24 hours |
| Generic Secrets | Medium | 1 week |

---

## Private Keys

### RSA Private Keys
```regex
-----BEGIN RSA PRIVATE KEY-----[\s\S]+?-----END RSA PRIVATE KEY-----
```

### EC Private Keys
```regex
-----BEGIN EC PRIVATE KEY-----[\s\S]+?-----END EC PRIVATE KEY-----
```

### OpenSSH Private Keys
```regex
-----BEGIN OPENSSH PRIVATE KEY-----[\s\S]+?-----END OPENSSH PRIVATE KEY-----
```

### PGP Private Keys
```regex
-----BEGIN PGP PRIVATE KEY BLOCK-----[\s\S]+?-----END PGP PRIVATE KEY BLOCK-----
```

### Generic Private Keys
```regex
-----BEGIN PRIVATE KEY-----[\s\S]+?-----END PRIVATE KEY-----
```

### DSA Private Keys
```regex
-----BEGIN DSA PRIVATE KEY-----[\s\S]+?-----END DSA PRIVATE KEY-----
```

---

## Cloud Provider Keys

### AWS Access Key ID
```regex
(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}
```

### AWS Secret Access Key
```regex
(?i)aws[_\-\.]?secret[_\-\.]?access[_\-\.]?key[\s]*[=:]["']?[\s]*[A-Za-z0-9/+=]{40}
```

### AWS Session Token
```regex
(?i)aws[_\-\.]?session[_\-\.]?token[\s]*[=:]["']?[\s]*.{100,}
```

### Google Cloud API Key
```regex
AIza[0-9A-Za-z\-_]{35}
```

### Google OAuth Token
```regex
ya29\.[0-9A-Za-z\-_]+
```

### Google Cloud Service Account
```regex
"type":\s*"service_account"[\s\S]*"private_key":\s*"-----BEGIN
```

### Azure Storage Key
```regex
(?i)DefaultEndpointsProtocol=https;AccountName=[^;]+;AccountKey=[A-Za-z0-9+/=]{88}
```

### Azure Connection String
```regex
(?i)(AccountKey|SharedAccessKey)\s*=\s*[A-Za-z0-9+/=]{44,}
```

### DigitalOcean Token
```regex
dop_v1_[a-f0-9]{64}
```

### Heroku API Key
```regex
(?i)heroku[_\-\.]?api[_\-\.]?key[\s]*[=:][\s]*[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}
```

---

## API Keys

### OpenAI API Key
```regex
sk-[A-Za-z0-9]{48}
```

### OpenAI Project Key
```regex
sk-proj-[A-Za-z0-9]{48}
```

### Anthropic API Key
```regex
sk-ant-[A-Za-z0-9\-]{40,}
```

### GitHub Personal Access Token
```regex
ghp_[A-Za-z0-9]{36}
```

### GitHub OAuth Token
```regex
gho_[A-Za-z0-9]{36}
```

### GitHub App Token
```regex
ghu_[A-Za-z0-9]{36}
```

### GitHub Refresh Token
```regex
ghr_[A-Za-z0-9]{36}
```

### GitLab Personal Access Token
```regex
glpat-[A-Za-z0-9\-_]{20}
```

### Stripe Live Key
```regex
sk_live_[A-Za-z0-9]{24,}
```

### Stripe Test Key
```regex
sk_test_[A-Za-z0-9]{24,}
```

### Stripe Restricted Key
```regex
rk_live_[A-Za-z0-9]{24,}
```

### PayPal Client ID
```regex
(?i)paypal[_\-\.]?client[_\-\.]?id[\s]*[=:][\s]*[A-Za-z0-9\-]{80}
```

### Twilio API Key
```regex
SK[a-f0-9]{32}
```

### Twilio Account SID
```regex
AC[a-f0-9]{32}
```

### Sendgrid API Key
```regex
SG\.[A-Za-z0-9\-_]{22}\.[A-Za-z0-9\-_]{43}
```

### Mailchimp API Key
```regex
[a-f0-9]{32}-us[0-9]{1,2}
```

### Slack Bot Token
```regex
xoxb-[0-9]{10,13}-[0-9]{10,13}-[A-Za-z0-9]{24}
```

### Slack User Token
```regex
xoxp-[0-9]{10,13}-[0-9]{10,13}-[A-Za-z0-9]{24}
```

### Slack Webhook URL
```regex
https://hooks\.slack\.com/services/T[A-Z0-9]+/B[A-Z0-9]+/[A-Za-z0-9]+
```

### Discord Webhook URL
```regex
https://discord(?:app)?\.com/api/webhooks/[0-9]+/[A-Za-z0-9\-_]+
```

### Discord Bot Token
```regex
[MN][A-Za-z0-9]{23,}\.[A-Za-z0-9\-_]{6}\.[A-Za-z0-9\-_]{27}
```

### Telegram Bot Token
```regex
[0-9]+:AA[A-Za-z0-9\-_]{33}
```

### NPM Access Token
```regex
npm_[A-Za-z0-9]{36}
```

### PyPI API Token
```regex
pypi-AgEIcHlwaS5vcmc[A-Za-z0-9\-_]{50,}
```

---

## Database Credentials

### MongoDB Connection String
```regex
mongodb(\+srv)?://[^:]+:[^@]+@[^\s]+
```

### PostgreSQL Connection String
```regex
postgres(ql)?://[^:]+:[^@]+@[^\s]+
```

### MySQL Connection String
```regex
mysql://[^:]+:[^@]+@[^\s]+
```

### Redis Connection String
```regex
redis://[^:]+:[^@]+@[^\s]+
```

### Database Password Variables
```regex
(?i)(db|database|mysql|postgres|mongodb|redis)[_\-\.]?(pass|password|pwd)[\s]*[=:][\s]*["']?[^\s"']+
```

---

## Authentication Tokens

### JWT Token
```regex
eyJ[A-Za-z0-9\-_]+\.eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+
```

### Bearer Token
```regex
(?i)bearer[\s]+[A-Za-z0-9\-_\.]+
```

### Basic Auth Header
```regex
(?i)basic[\s]+[A-Za-z0-9+/=]+
```

### OAuth Client Secret
```regex
(?i)(client[_\-\.]?secret|oauth[_\-\.]?secret)[\s]*[=:][\s]*["']?[A-Za-z0-9\-_]{20,}
```

---

## Generic Secret Patterns

### Password Assignment
```regex
(?i)(password|passwd|pwd|pass)[\s]*[=:][\s]*["']?[^\s"'\n]{4,}
```

### Secret Assignment
```regex
(?i)secret[\s]*[=:][\s]*["']?[^\s"'\n]{8,}
```

### API Key Assignment
```regex
(?i)api[_\-\.]?key[\s]*[=:][\s]*["']?[^\s"'\n]{16,}
```

### Access Token Assignment
```regex
(?i)access[_\-\.]?token[\s]*[=:][\s]*["']?[^\s"'\n]{16,}
```

### Private Key Assignment
```regex
(?i)private[_\-\.]?key[\s]*[=:][\s]*["']?[^\s"'\n]{16,}
```

### Encryption Key Assignment
```regex
(?i)(encryption|enc)[_\-\.]?key[\s]*[=:][\s]*["']?[^\s"'\n]{16,}
```

---

## File Types to Scan

### High Priority
| Extension | Reason |
|-----------|--------|
| `.env` | Environment variables |
| `.env.local` | Local environment |
| `.env.production` | Production secrets |
| `.env.development` | Development secrets |
| `config.json` | Configuration files |
| `settings.json` | Settings |
| `secrets.json` | Explicit secrets file |
| `credentials.json` | Credentials file |
| `serviceAccountKey.json` | GCP service account |
| `.npmrc` | NPM credentials |
| `.pypirc` | PyPI credentials |
| `.netrc` | Network credentials |

### Medium Priority
| Extension | Reason |
|-----------|--------|
| `.yaml` / `.yml` | Configuration |
| `.toml` | Configuration |
| `.ini` | Configuration |
| `.cfg` | Configuration |
| `.conf` | Configuration |
| `Dockerfile` | Build secrets |
| `docker-compose.yml` | Docker secrets |

### Code Files
| Extension | Reason |
|-----------|--------|
| `.js` / `.ts` | JavaScript/TypeScript |
| `.py` | Python |
| `.rb` | Ruby |
| `.go` | Go |
| `.java` | Java |
| `.php` | PHP |
| `.cs` | C# |

---

## Files to Ignore (Reduce False Positives)

```
node_modules/
vendor/
.git/
__pycache__/
dist/
build/
*.min.js
*.bundle.js
package-lock.json
yarn.lock
*.test.js
*.spec.js
```

---

## Common False Positives

| Pattern | Why It's False | How to Distinguish |
|---------|----------------|-------------------|
| `sk-xxxxxxxxx` (placeholder) | Example/template | Check for actual key format length |
| `password: ${PASSWORD}` | Environment reference | Contains `${}` or `$()` |
| `apiKey: process.env.API_KEY` | Environment variable | References `process.env` or `os.environ` |
| `const SECRET = config.secret` | Runtime lookup | Right side is function/property access |
| Test fixtures | Test data | In test directories |

---

## Entropy-Based Detection

For detecting high-entropy strings that may be secrets:

```python
import math

def calculate_entropy(s):
    if not s:
        return 0
    prob = [float(s.count(c)) / len(s) for c in set(s)]
    return -sum(p * math.log2(p) for p in prob)

# High entropy threshold: > 4.5 bits per character
# Combined with length > 20 characters suggests potential secret
```

### Entropy Thresholds

| String Type | Typical Entropy | Threshold |
|-------------|-----------------|-----------|
| English text | 1.5 - 3.5 | - |
| Base64 encoded | 5.5 - 6.0 | > 4.5 |
| Hex string | 3.5 - 4.0 | > 4.0 |
| Random alphanumeric | 5.0 - 6.0 | > 4.5 |
