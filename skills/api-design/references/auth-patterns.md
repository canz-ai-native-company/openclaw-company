# API Authentication Patterns

Comprehensive guide for API authentication and authorization design.

---

## Authentication Methods Overview

| Method | Use Case | Pros | Cons |
|--------|----------|------|------|
| JWT | SPAs, Mobile apps | Stateless, scalable | Token revocation complex |
| Session | Traditional web apps | Easy revocation | Server state required |
| API Key | Server-to-server | Simple | No user context |
| OAuth 2.0 | Third-party access | Standard, granular | Complex setup |
| Basic Auth | Internal/simple APIs | Simple | Sends credentials every request |

---

## JWT (JSON Web Token)

### Token Structure

```
Header.Payload.Signature

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### JWT Payload Design

```json
{
  "sub": "user_123",
  "email": "user@example.com",
  "role": "admin",
  "permissions": ["users:read", "users:write"],
  "iat": 1634567890,
  "exp": 1634571490,
  "iss": "https://api.example.com",
  "aud": "https://app.example.com"
}
```

### Standard Claims

| Claim | Name | Purpose |
|-------|------|---------|
| `sub` | Subject | User identifier |
| `iat` | Issued At | Token creation time |
| `exp` | Expiration | Token expiry time |
| `nbf` | Not Before | Token valid from |
| `iss` | Issuer | Token issuer |
| `aud` | Audience | Intended recipient |
| `jti` | JWT ID | Unique token ID |

### API Flow

```
┌──────────┐                           ┌──────────┐
│  Client  │                           │   API    │
└────┬─────┘                           └────┬─────┘
     │                                      │
     │ POST /auth/login                     │
     │ {email, password}                    │
     │─────────────────────────────────────>│
     │                                      │
     │      {access_token, refresh_token}   │
     │<─────────────────────────────────────│
     │                                      │
     │ GET /users                           │
     │ Authorization: Bearer <access_token> │
     │─────────────────────────────────────>│
     │                                      │
     │      {data: [...]}                   │
     │<─────────────────────────────────────│
```

### Token Refresh Pattern

```
# Access Token: Short-lived (15 min - 1 hour)
# Refresh Token: Long-lived (7 days - 30 days)

POST /auth/login
Response:
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "expires_in": 3600,
  "token_type": "Bearer"
}

POST /auth/refresh
Request:
{
  "refresh_token": "eyJ..."
}
Response:
{
  "access_token": "eyJ...",
  "expires_in": 3600
}
```

### OpenAPI Security Scheme

```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: |
        JWT token obtained from /auth/login.
        Include in Authorization header: Bearer <token>

security:
  - bearerAuth: []

paths:
  /auth/login:
    post:
      security: []  # Public
      summary: Login

  /users:
    get:
      security:
        - bearerAuth: []  # Protected
```

---

## API Key Authentication

### Header-Based

```
GET /api/data
X-API-Key: sk_live_abc123xyz789
```

### Query Parameter (Less Secure)

```
GET /api/data?api_key=sk_live_abc123xyz789
```

### Key Format Conventions

```
# Prefix indicates environment
sk_live_...    # Production secret key
sk_test_...    # Test/sandbox secret key
pk_live_...    # Production public key
pk_test_...    # Test public key

# Full example
sk_live_7y8n9m0p1q2r3s4t5u6v7w8x9y0z
```

### OpenAPI Scheme

```yaml
components:
  securitySchemes:
    apiKey:
      type: apiKey
      in: header
      name: X-API-Key
      description: API key for server-to-server communication

security:
  - apiKey: []
```

---

## OAuth 2.0

### Grant Types

| Grant Type | Use Case |
|------------|----------|
| Authorization Code | Web apps with backend |
| Authorization Code + PKCE | SPAs, mobile apps |
| Client Credentials | Server-to-server |
| Device Code | Smart TVs, CLI tools |

### Authorization Code Flow

```
┌────────┐     ┌────────┐     ┌──────────┐     ┌────────┐
│  User  │     │ Client │     │  Auth    │     │  API   │
│        │     │  App   │     │  Server  │     │        │
└───┬────┘     └───┬────┘     └────┬─────┘     └───┬────┘
    │              │               │               │
    │ Click Login  │               │               │
    │─────────────>│               │               │
    │              │               │               │
    │              │ Redirect to   │               │
    │              │ /authorize    │               │
    │<─────────────┼──────────────>│               │
    │              │               │               │
    │ Login + Consent              │               │
    │─────────────────────────────>│               │
    │              │               │               │
    │ Redirect with code           │               │
    │<─────────────────────────────│               │
    │              │               │               │
    │              │ POST /token   │               │
    │              │ {code}        │               │
    │              │──────────────>│               │
    │              │               │               │
    │              │ {access_token}│               │
    │              │<──────────────│               │
    │              │               │               │
    │              │ API Request   │               │
    │              │ Bearer token  │               │
    │              │──────────────────────────────>│
```

### OAuth Endpoints

```
Authorization:
GET /oauth/authorize
?response_type=code
&client_id=client_123
&redirect_uri=https://app.com/callback
&scope=read:users write:users
&state=random_state_string

Token:
POST /oauth/token
{
  "grant_type": "authorization_code",
  "code": "auth_code_here",
  "redirect_uri": "https://app.com/callback",
  "client_id": "client_123",
  "client_secret": "secret_456"
}

Response:
{
  "access_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "eyJ...",
  "scope": "read:users write:users"
}
```

### OpenAPI OAuth Scheme

```yaml
components:
  securitySchemes:
    oauth2:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://auth.example.com/oauth/authorize
          tokenUrl: https://auth.example.com/oauth/token
          scopes:
            read:users: Read user data
            write:users: Create and update users
            delete:users: Delete users
            admin: Full admin access

security:
  - oauth2:
      - read:users

paths:
  /admin/settings:
    get:
      security:
        - oauth2:
            - admin
```

---

## Scopes and Permissions

### Scope Naming Conventions

```
# Resource:Action pattern
read:users
write:users
delete:users
read:orders
write:orders

# Hierarchical
users:read
users:write
users:delete
orders:read
orders:write

# Wildcard
users:*        # All user permissions
admin          # Full admin access
```

### Permission Levels

```yaml
scopes:
  # Read-only access
  read:users:
    description: View user profiles

  # Write access (create/update)
  write:users:
    description: Create and update users
    includes: [read:users]

  # Delete access
  delete:users:
    description: Delete users
    includes: [write:users]

  # Admin (all permissions)
  admin:
    description: Full administrative access
    includes: [delete:users, delete:orders, manage:settings]
```

---

## Authorization Patterns

### Role-Based Access Control (RBAC)

```yaml
roles:
  guest:
    permissions: []

  user:
    permissions:
      - read:own_profile
      - write:own_profile
      - read:products
      - create:orders

  moderator:
    inherits: user
    permissions:
      - read:users
      - moderate:content

  admin:
    inherits: moderator
    permissions:
      - write:users
      - delete:users
      - manage:settings
```

### Attribute-Based Access Control (ABAC)

```javascript
// Policy: User can only edit their own posts
{
  "effect": "allow",
  "action": "posts:update",
  "condition": {
    "resource.author_id": "${user.id}"
  }
}

// Policy: Admins can edit any post
{
  "effect": "allow",
  "action": "posts:update",
  "condition": {
    "user.role": "admin"
  }
}
```

---

## Security Headers

### Response Headers

```http
# Prevent caching of authenticated responses
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache

# Prevent clickjacking
X-Frame-Options: DENY

# XSS protection
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block

# HTTPS enforcement
Strict-Transport-Security: max-age=31536000; includeSubDomains

# Content Security Policy
Content-Security-Policy: default-src 'self'
```

### CORS Headers

```http
# Allow specific origins
Access-Control-Allow-Origin: https://app.example.com

# Allow credentials (cookies, auth headers)
Access-Control-Allow-Credentials: true

# Allowed methods
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS

# Allowed headers
Access-Control-Allow-Headers: Authorization, Content-Type

# Preflight cache
Access-Control-Max-Age: 86400
```

---

## Error Responses

### Authentication Errors

```json
// 401 Unauthorized - No credentials
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}

// 401 Unauthorized - Invalid credentials
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}

// 401 Unauthorized - Token expired
{
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Access token has expired"
  }
}

// 401 Unauthorized - Invalid token
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Access token is invalid"
  }
}
```

### Authorization Errors

```json
// 403 Forbidden - Insufficient permissions
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to access this resource",
    "required_scope": "admin"
  }
}

// 403 Forbidden - Resource ownership
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You can only access your own resources"
  }
}
```

---

## Best Practices

### Token Security

```
DO:
✅ Use HTTPS exclusively
✅ Short-lived access tokens (15 min - 1 hour)
✅ Secure token storage (httpOnly cookies or secure storage)
✅ Implement token refresh mechanism
✅ Include token expiry in response
✅ Rotate refresh tokens on use
✅ Log authentication events

DON'T:
❌ Store tokens in localStorage (XSS vulnerable)
❌ Send tokens in URL query parameters
❌ Use long-lived access tokens
❌ Include sensitive data in JWT payload
❌ Skip token validation
❌ Use weak signing algorithms (HS256 with weak secret)
```

### Password Requirements

```yaml
password_policy:
  min_length: 12
  require_uppercase: true
  require_lowercase: true
  require_number: true
  require_special: false
  max_length: 128
  forbidden_passwords:
    - "password123"
    - "qwerty123"

rate_limiting:
  login_attempts: 5
  lockout_duration: 15 minutes
  reset_after: 1 hour
```

### API Key Management

```yaml
api_keys:
  # Key rotation
  rotation_period: 90 days
  grace_period: 7 days

  # Key restrictions
  allowed_ips:
    - "10.0.0.0/8"
    - "192.168.1.100"
  allowed_referers:
    - "https://app.example.com"

  # Rate limits per key
  rate_limit:
    requests_per_minute: 100
    requests_per_day: 10000
```
