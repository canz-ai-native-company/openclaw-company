# Remediation Templates

Code fix templates for common vulnerabilities organized by OWASP category.

---

## A01: Broken Access Control

### Authorization Middleware

```javascript
// Node.js/Express
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

const requireRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

// Usage
app.get('/admin', requireAuth, requireRole(['admin']), adminHandler);
```

```python
# Python/FastAPI
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = decode_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

async def require_admin(user = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin required")
    return user

# Usage
@app.get("/admin")
async def admin_endpoint(user = Depends(require_admin)):
    return {"admin": True}
```

### IDOR Prevention

```javascript
// Before: Vulnerable to IDOR
app.get('/documents/:id', async (req, res) => {
  const doc = await Document.findById(req.params.id);
  return res.json(doc);
});

// After: Owner verification
app.get('/documents/:id', requireAuth, async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Not found' });
  }
  if (doc.ownerId.toString() !== req.user.id.toString()) {
    return res.status(403).json({ error: 'Access denied' });
  }
  return res.json(doc);
});
```

### Path Traversal Prevention

```javascript
// Before: Vulnerable
const filePath = path.join(baseDir, req.query.filename);

// After: Secure
const filename = path.basename(req.query.filename); // Strip directory traversal
const filePath = path.join(baseDir, filename);

// Verify resolved path is within allowed directory
const resolvedPath = path.resolve(filePath);
if (!resolvedPath.startsWith(path.resolve(baseDir))) {
  throw new Error('Invalid path');
}
```

---

## A02: Cryptographic Failures

### Password Hashing

```javascript
// Node.js with bcrypt
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

// Hashing
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// Verification
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
```

```python
# Python with Argon2
from argon2 import PasswordHasher

ph = PasswordHasher()

# Hashing
def hash_password(password: str) -> str:
    return ph.hash(password)

# Verification
def verify_password(password: str, hash: str) -> bool:
    try:
        return ph.verify(hash, password)
    except:
        return False
```

### Secure Random Generation

```javascript
// Node.js
const crypto = require('crypto');

// Token generation
const generateToken = () => crypto.randomBytes(32).toString('hex');

// Secure session ID
const generateSessionId = () => crypto.randomBytes(64).toString('base64url');
```

```python
# Python
import secrets

# Token generation
def generate_token() -> str:
    return secrets.token_hex(32)

# URL-safe token
def generate_url_safe_token() -> str:
    return secrets.token_urlsafe(32)
```

### Environment Variables for Secrets

```javascript
// Before: Hardcoded secret
const JWT_SECRET = 'my-super-secret-key';

// After: Environment variable
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
```

```bash
# .env.example (commit this, not .env)
JWT_SECRET=
DATABASE_URL=
API_KEY=

# .gitignore
.env
.env.local
.env.production
```

---

## A03: Injection

### SQL Injection Prevention

```javascript
// Before: Vulnerable string concatenation
const query = `SELECT * FROM users WHERE id = ${userId}`;

// After: Parameterized queries (PostgreSQL/node-postgres)
const result = await pool.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// After: Using ORM (Prisma)
const user = await prisma.user.findUnique({
  where: { id: parseInt(userId) }
});

// After: Using ORM (Sequelize)
const user = await User.findOne({
  where: { id: userId }
});
```

```python
# Python with SQLAlchemy
# Before: Vulnerable
query = f"SELECT * FROM users WHERE id = {user_id}"

# After: Parameterized
from sqlalchemy import text
result = connection.execute(
    text("SELECT * FROM users WHERE id = :id"),
    {"id": user_id}
)

# After: ORM
user = session.query(User).filter(User.id == user_id).first()
```

### XSS Prevention

```javascript
// Before: Vulnerable innerHTML
element.innerHTML = userInput;

// After: Safe text content
element.textContent = userInput;

// After: DOMPurify for HTML
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// React: Already safe by default
return <div>{userInput}</div>;

// React: Dangerous, use with sanitization
return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
```

### Command Injection Prevention

```javascript
// Before: Vulnerable exec
const exec = require('child_process').exec;
exec(`ls ${userDirectory}`);

// After: Use execFile with argument array
const execFile = require('child_process').execFile;
execFile('ls', [userDirectory], (error, stdout) => {
  // Safe - arguments are not shell-interpreted
});

// After: Input validation
const allowedDirs = ['documents', 'images', 'downloads'];
if (!allowedDirs.includes(userDirectory)) {
  throw new Error('Invalid directory');
}
execFile('ls', [userDirectory]);
```

---

## A04: Insecure Design

### Rate Limiting

```javascript
// Express with express-rate-limit
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/login', loginLimiter, loginHandler);

// API rate limiting
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
});

app.use('/api/', apiLimiter);
```

```python
# FastAPI with slowapi
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/login")
@limiter.limit("5/15minutes")
async def login(request: Request):
    pass
```

### Input Validation

```javascript
// Using Joi
const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(12).required(),
  age: Joi.number().integer().min(13).max(120)
});

app.post('/register', async (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  // Use validated 'value', not 'req.body'
});
```

```python
# Using Pydantic
from pydantic import BaseModel, EmailStr, validator

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    age: int

    @validator('password')
    def password_strength(cls, v):
        if len(v) < 12:
            raise ValueError('Password must be at least 12 characters')
        return v

    @validator('age')
    def age_range(cls, v):
        if not 13 <= v <= 120:
            raise ValueError('Age must be between 13 and 120')
        return v
```

---

## A05: Security Misconfiguration

### Security Headers

```javascript
// Express with Helmet
const helmet = require('helmet');

app.use(helmet());

// Or configure individually
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
  }
}));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));
```

### CORS Configuration

```javascript
// Before: Overly permissive
app.use(cors());

// After: Restrictive
app.use(cors({
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}));
```

### Error Handling

```javascript
// Before: Verbose errors in production
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    stack: err.stack
  });
});

// After: Safe error handling
app.use((err, req, res, next) => {
  console.error(err); // Log full error server-side

  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});
```

---

## A06: Vulnerable Components

### Dependency Auditing

```bash
# NPM
npm audit
npm audit fix
npm audit --audit-level=high

# Yarn
yarn audit
yarn audit --level high

# Python
pip install pip-audit
pip-audit

# Or with safety
pip install safety
safety check
```

### Lock File Security

```json
// package.json - Pin versions
{
  "dependencies": {
    "express": "4.18.2",  // Exact version, not ^4.18.2
    "lodash": "4.17.21"
  }
}
```

### Automated Updates

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

---

## A07: Authentication Failures

### Session Management

```javascript
// Express session configuration
const session = require('express-session');
const RedisStore = require('connect-redis').default;

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Regenerate session on login
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body);
  if (user) {
    req.session.regenerate((err) => {
      req.session.userId = user.id;
      res.json({ success: true });
    });
  }
});
```

### JWT Security

```javascript
const jwt = require('jsonwebtoken');

// Secure JWT generation
const generateToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '15m',
      algorithm: 'HS256'
    }
  );
};

// Secure JWT verification
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS256'] // Explicitly specify allowed algorithms
  });
};
```

---

## A08: Data Integrity Failures

### Safe Deserialization

```javascript
// JSON parsing with schema validation
const Ajv = require('ajv');
const ajv = new Ajv();

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string', maxLength: 100 },
    age: { type: 'integer', minimum: 0, maximum: 150 }
  },
  required: ['name'],
  additionalProperties: false
};

const validate = ajv.compile(schema);

app.post('/data', (req, res) => {
  const valid = validate(req.body);
  if (!valid) {
    return res.status(400).json({ errors: validate.errors });
  }
  // Safe to use req.body
});
```

### Subresource Integrity

```html
<!-- CDN scripts with SRI -->
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous">
</script>
```

---

## A09: Logging Failures

### Secure Logging

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Sanitize log data
const sanitizeForLog = (data) => {
  const sanitized = { ...data };
  const sensitiveFields = ['password', 'token', 'apiKey', 'secret'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) sanitized[field] = '[REDACTED]';
  });
  return sanitized;
};

// Security event logging
const logSecurityEvent = (event, details) => {
  logger.warn({
    type: 'SECURITY_EVENT',
    event,
    details: sanitizeForLog(details),
    timestamp: new Date().toISOString()
  });
};
```

---

## A10: SSRF Prevention

```javascript
// URL validation for SSRF prevention
const url = require('url');
const dns = require('dns').promises;

const ALLOWED_PROTOCOLS = ['http:', 'https:'];
const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0'];
const BLOCKED_IP_RANGES = [
  /^10\./,           // 10.0.0.0/8
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
  /^192\.168\./,     // 192.168.0.0/16
  /^169\.254\./,     // Link-local
];

const isUrlSafe = async (inputUrl) => {
  const parsed = new url.URL(inputUrl);

  // Check protocol
  if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
    return false;
  }

  // Check hostname blocklist
  if (BLOCKED_HOSTS.includes(parsed.hostname)) {
    return false;
  }

  // Resolve DNS and check IP
  try {
    const addresses = await dns.resolve4(parsed.hostname);
    for (const addr of addresses) {
      if (BLOCKED_IP_RANGES.some(regex => regex.test(addr))) {
        return false;
      }
    }
  } catch {
    return false;
  }

  return true;
};

// Usage
app.get('/fetch', async (req, res) => {
  const targetUrl = req.query.url;

  if (!await isUrlSafe(targetUrl)) {
    return res.status(400).json({ error: 'URL not allowed' });
  }

  const response = await fetch(targetUrl);
  res.send(await response.text());
});
```

---

## Quick Fix Checklist

| Vulnerability | Quick Fix |
|---------------|-----------|
| SQL Injection | Use parameterized queries |
| XSS | Use textContent, escape HTML output |
| Command Injection | Use execFile with args array |
| Path Traversal | Use path.basename(), verify resolved path |
| IDOR | Add ownership checks |
| Weak Password Hash | Use bcrypt/argon2 with salt rounds 12+ |
| Hardcoded Secret | Move to environment variables |
| Missing Rate Limit | Add express-rate-limit |
| Verbose Errors | Return generic message in production |
| Missing Headers | Use Helmet middleware |
| Permissive CORS | Whitelist specific origins |
| Session Fixation | Regenerate session on login |
