# OWASP Top 10 (2021) - Detailed Reference

Comprehensive vulnerability patterns and detection methods for each OWASP category.

---

## A01:2021 - Broken Access Control

### Description
Access control enforces policy such that users cannot act outside their intended permissions.

### Vulnerability Patterns

| Pattern | Description | Detection |
|---------|-------------|-----------|
| IDOR | Insecure Direct Object Reference | URLs with sequential IDs: `/user/123` |
| Missing Function Level Access Control | No authorization check on endpoints | Missing `@authorize` decorators |
| Privilege Escalation | User accessing admin functions | Role checks absent in handlers |
| Path Traversal | Accessing files outside scope | `../` in file paths |
| CORS Misconfiguration | Overly permissive origins | `Access-Control-Allow-Origin: *` |

### Code Patterns to Detect

```javascript
// VULNERABLE: No authorization check
app.get('/admin/users', (req, res) => {
  return db.getAllUsers();
});

// VULNERABLE: IDOR - user ID from URL without ownership check
app.get('/documents/:id', (req, res) => {
  return db.getDocument(req.params.id);
});

// VULNERABLE: Path traversal
const filePath = path.join(baseDir, req.query.filename);
fs.readFile(filePath);
```

### Secure Patterns

```javascript
// SECURE: Authorization middleware
app.get('/admin/users', requireRole('admin'), (req, res) => {
  return db.getAllUsers();
});

// SECURE: Ownership verification
app.get('/documents/:id', async (req, res) => {
  const doc = await db.getDocument(req.params.id);
  if (doc.ownerId !== req.user.id) return res.status(403).send('Forbidden');
  return doc;
});

// SECURE: Path validation
const filename = path.basename(req.query.filename);
const filePath = path.join(baseDir, filename);
```

---

## A02:2021 - Cryptographic Failures

### Description
Failures related to cryptography which often leads to sensitive data exposure.

### Vulnerability Patterns

| Pattern | Description | Detection |
|---------|-------------|-----------|
| Weak Algorithms | MD5, SHA1 for passwords | `crypto.createHash('md5')` |
| Plaintext Storage | Unencrypted sensitive data | Passwords without hashing |
| Hardcoded Keys | Keys in source code | `const secretKey = "..."` |
| Insecure Random | Predictable random values | `Math.random()` for tokens |
| Missing HTTPS | Transmitting over HTTP | `http://` in API calls |

### Code Patterns to Detect

```javascript
// VULNERABLE: Weak hash algorithm
const hash = crypto.createHash('md5').update(password).digest('hex');

// VULNERABLE: Predictable random
const token = Math.random().toString(36);

// VULNERABLE: Hardcoded encryption key
const SECRET_KEY = 'my-secret-key-12345';
cipher.update(data, 'utf8', SECRET_KEY);

// VULNERABLE: Storing plaintext passwords
db.insert({ password: userPassword });
```

### Secure Patterns

```javascript
// SECURE: bcrypt for passwords
const hash = await bcrypt.hash(password, 12);

// SECURE: Cryptographic random
const token = crypto.randomBytes(32).toString('hex');

// SECURE: Environment variables for keys
const SECRET_KEY = process.env.ENCRYPTION_KEY;

// SECURE: Argon2 for password hashing
const hash = await argon2.hash(password);
```

---

## A03:2021 - Injection

### Description
User-supplied data sent to an interpreter as part of a command or query.

### Vulnerability Patterns

| Pattern | Description | Detection |
|---------|-------------|-----------|
| SQL Injection | Untrusted data in SQL queries | String concatenation in queries |
| XSS | Script injection in HTML output | `innerHTML = userInput` |
| Command Injection | OS commands with user input | `exec(userCommand)` |
| NoSQL Injection | Query operators from user input | `{ $where: userInput }` |
| LDAP Injection | Untrusted data in LDAP queries | String concat in LDAP filters |

### Code Patterns to Detect

```javascript
// VULNERABLE: SQL Injection
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.query(query);

// VULNERABLE: Command Injection
const cmd = `ls ${userDirectory}`;
exec(cmd);

// VULNERABLE: XSS
element.innerHTML = userComment;

// VULNERABLE: NoSQL Injection
db.users.find({ username: req.body.username, password: req.body.password });
```

### Secure Patterns

```javascript
// SECURE: Parameterized queries
const query = 'SELECT * FROM users WHERE id = $1';
db.query(query, [userId]);

// SECURE: Input validation for commands
const safeDir = path.basename(userDirectory);
execFile('ls', [safeDir]);

// SECURE: HTML escaping
element.textContent = userComment;

// SECURE: NoSQL - validate input types
const username = String(req.body.username);
const password = String(req.body.password);
```

---

## A04:2021 - Insecure Design

### Description
Risks related to design and architectural flaws.

### Vulnerability Patterns

| Pattern | Description | Detection |
|---------|-------------|-----------|
| Missing Rate Limiting | No brute force protection | Login without throttling |
| Business Logic Flaws | Exploitable workflows | Price manipulation, order skipping |
| Missing Captcha | Automated form submission | Forms without bot protection |
| Trust Boundary Violations | Trusting client-side validation | Server accepting client state |

### Code Patterns to Detect

```javascript
// VULNERABLE: No rate limiting on auth
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body);
  return res.json(user);
});

// VULNERABLE: Client-side price validation only
const price = req.body.price; // Trusting client-sent price
db.createOrder({ price });

// VULNERABLE: Trusting client role
app.get('/admin', (req, res) => {
  if (req.body.isAdmin) return adminPanel(); // Role from client
});
```

### Secure Patterns

```javascript
// SECURE: Rate limiting
const limiter = rateLimit({ windowMs: 15*60*1000, max: 5 });
app.post('/login', limiter, async (req, res) => { ... });

// SECURE: Server-side price lookup
const product = await db.getProduct(req.body.productId);
db.createOrder({ price: product.price }); // Price from database

// SECURE: Server-side role verification
app.get('/admin', (req, res) => {
  const user = await getUserFromToken(req.headers.authorization);
  if (user.role !== 'admin') return res.status(403);
});
```

---

## A05:2021 - Security Misconfiguration

### Description
Missing appropriate security hardening or improperly configured permissions.

### Vulnerability Patterns

| Pattern | Description | Detection |
|---------|-------------|-----------|
| Default Credentials | Unchanged default passwords | `admin:admin`, `root:root` |
| Verbose Errors | Stack traces to users | `app.use(errorHandler)` missing |
| Permissive CORS | Allow all origins | `cors({ origin: '*' })` |
| Missing Headers | Security headers absent | No CSP, X-Frame-Options |
| Debug Mode | Production debug enabled | `DEBUG=true` in prod |

### Code Patterns to Detect

```javascript
// VULNERABLE: Verbose errors in production
app.use((err, req, res, next) => {
  res.status(500).json({ stack: err.stack, message: err.message });
});

// VULNERABLE: Permissive CORS
app.use(cors());

// VULNERABLE: Default credentials
const config = { user: 'admin', password: 'password123' };

// VULNERABLE: Debug in production
app.set('env', 'development'); // In production config
```

### Secure Patterns

```javascript
// SECURE: Production error handler
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// SECURE: Restrictive CORS
app.use(cors({ origin: 'https://myapp.com', credentials: true }));

// SECURE: Environment-based config
const config = { user: process.env.DB_USER, password: process.env.DB_PASS };

// SECURE: Security headers
app.use(helmet());
```

---

## A06:2021 - Vulnerable and Outdated Components

### Description
Using components with known vulnerabilities.

### Detection Methods

1. **Check package.json dependencies**
2. **Run `npm audit` or `yarn audit`**
3. **Check against NVD database**
4. **Use Snyk, Dependabot, or OWASP Dependency-Check**

### Common Vulnerable Packages (Examples)

| Package | Vulnerable Versions | CVE | Issue |
|---------|---------------------|-----|-------|
| lodash | < 4.17.21 | CVE-2021-23337 | Command Injection |
| axios | < 0.21.1 | CVE-2020-28168 | SSRF |
| express | < 4.17.3 | CVE-2022-24999 | Open Redirect |
| jsonwebtoken | < 9.0.0 | CVE-2022-23529 | Arbitrary code execution |

### Audit Commands

```bash
# NPM
npm audit
npm audit fix

# Yarn
yarn audit
yarn audit --level high

# Python
pip-audit
safety check

# Ruby
bundle audit
```

---

## A07:2021 - Identification and Authentication Failures

### Description
Confirmation of user identity, authentication, and session management.

### Vulnerability Patterns

| Pattern | Description | Detection |
|---------|-------------|-----------|
| Weak Passwords | No complexity requirements | Min length < 8 |
| Credential Stuffing | No protection against | Missing rate limiting |
| Session Fixation | Reusing session after login | Session ID not rotated |
| Insecure Session | Predictable or exposed tokens | Short session IDs |
| Missing MFA | No multi-factor option | Single-factor only |

### Code Patterns to Detect

```javascript
// VULNERABLE: Weak password validation
if (password.length >= 4) { /* accept */ }

// VULNERABLE: Session not rotated on login
app.post('/login', (req, res) => {
  // No session regeneration
  req.session.userId = user.id;
});

// VULNERABLE: Predictable session token
const sessionId = `session_${userId}_${Date.now()}`;

// VULNERABLE: Password in URL
res.redirect(`/reset?password=${newPassword}`);
```

### Secure Patterns

```javascript
// SECURE: Strong password validation
const passwordSchema = Joi.string()
  .min(12)
  .pattern(/[A-Z]/).pattern(/[a-z]/).pattern(/[0-9]/).pattern(/[!@#$%]/);

// SECURE: Session regeneration on login
app.post('/login', (req, res) => {
  req.session.regenerate((err) => {
    req.session.userId = user.id;
  });
});

// SECURE: Cryptographic session token
const sessionId = crypto.randomBytes(32).toString('hex');
```

---

## A08:2021 - Software and Data Integrity Failures

### Description
Code and infrastructure not protecting against integrity violations.

### Vulnerability Patterns

| Pattern | Description | Detection |
|---------|-------------|-----------|
| Insecure Deserialization | Deserializing untrusted data | `JSON.parse(untrusted)` without validation |
| Unsigned Updates | Updates without verification | No signature checks |
| CI/CD Compromise | Insecure pipeline | Secrets in logs, no access control |
| Dependency Confusion | Private package hijacking | Mixed public/private registries |

### Code Patterns to Detect

```javascript
// VULNERABLE: Deserializing untrusted data
const userData = eval('(' + userInput + ')');
const obj = node_serialize.unserialize(userInput);

// VULNERABLE: No integrity check on downloads
const script = await fetch(externalUrl);
eval(script);

// VULNERABLE: Accepting any update
const update = await fetchUpdate();
applyUpdate(update); // No signature verification
```

### Secure Patterns

```javascript
// SECURE: Safe JSON parsing with schema
const userData = JSON.parse(userInput);
const validated = schema.validate(userData);

// SECURE: Subresource integrity
<script src="lib.js" integrity="sha384-xxx" crossorigin="anonymous">

// SECURE: Signed updates
const update = await fetchUpdate();
if (!verifySignature(update, publicKey)) throw new Error('Invalid');
```

---

## A09:2021 - Security Logging and Monitoring Failures

### Description
Without logging and monitoring, breaches cannot be detected.

### Vulnerability Patterns

| Pattern | Description | Detection |
|---------|-------------|-----------|
| Missing Auth Logs | Login attempts not logged | No audit trail |
| Sensitive Data in Logs | Logging passwords/tokens | `logger.info(password)` |
| Log Injection | Untrusted data in logs | `logger.info(userInput)` |
| No Alerting | Critical events not alerted | Missing monitoring |

### Code Patterns to Detect

```javascript
// VULNERABLE: Sensitive data in logs
logger.info(`User login: ${username}:${password}`);

// VULNERABLE: Log injection
logger.info(`User action: ${userInput}`); // userInput could have \n

// VULNERABLE: No authentication logging
app.post('/login', (req, res) => {
  // No logging of attempt
  return authenticate(req.body);
});
```

### Secure Patterns

```javascript
// SECURE: Redacted sensitive data
logger.info(`User login: ${username}:[REDACTED]`);

// SECURE: Sanitized log input
const safeInput = userInput.replace(/[\n\r]/g, '');
logger.info(`User action: ${safeInput}`);

// SECURE: Comprehensive auth logging
app.post('/login', (req, res) => {
  const result = authenticate(req.body);
  logger.audit({
    event: 'LOGIN_ATTEMPT',
    user: username,
    success: result.success,
    ip: req.ip,
    timestamp: new Date()
  });
});
```

---

## A10:2021 - Server-Side Request Forgery (SSRF)

### Description
SSRF occurs when a web application fetches a remote resource without validating the user-supplied URL.

### Vulnerability Patterns

| Pattern | Description | Detection |
|---------|-------------|-----------|
| Unvalidated URL | User URL passed to fetch | `fetch(userUrl)` |
| Internal Access | Accessing internal services | URLs to 169.254.x.x, localhost |
| Protocol Smuggling | Non-HTTP protocols | `file://`, `gopher://` |
| DNS Rebinding | Bypassing IP validation | Time-of-check vs time-of-use |

### Code Patterns to Detect

```javascript
// VULNERABLE: Direct user URL fetch
app.get('/preview', async (req, res) => {
  const content = await fetch(req.query.url);
  res.send(content);
});

// VULNERABLE: Image proxy without validation
app.get('/image', async (req, res) => {
  const image = await axios.get(req.query.src);
  res.send(image.data);
});
```

### Secure Patterns

```javascript
// SECURE: URL allowlist
const ALLOWED_DOMAINS = ['api.trusted.com', 'cdn.trusted.com'];
app.get('/preview', async (req, res) => {
  const url = new URL(req.query.url);
  if (!ALLOWED_DOMAINS.includes(url.hostname)) {
    return res.status(403).send('Domain not allowed');
  }
  const content = await fetch(url);
  res.send(content);
});

// SECURE: Protocol restriction
const url = new URL(req.query.url);
if (!['http:', 'https:'].includes(url.protocol)) {
  return res.status(400).send('Invalid protocol');
}
```
