# REST Best Practices

Comprehensive guide for designing RESTful APIs following industry standards.

---

## Resource Naming Conventions

### Use Nouns, Not Verbs

```
✅ CORRECT:
GET    /users              # Get users (the verb is in HTTP method)
POST   /users              # Create user
GET    /orders/{id}        # Get specific order
DELETE /products/{id}      # Delete product

❌ WRONG:
GET    /getUsers           # Verb in URL
POST   /createUser         # Verb in URL
GET    /fetchOrder/{id}    # Verb in URL
POST   /deleteProduct      # Wrong method + verb in URL
```

### Use Plural Nouns

```
✅ CORRECT:
/users
/orders
/products
/categories

❌ WRONG:
/user
/order
/product
/category
```

### Use Kebab-Case for Multi-Word Resources

```
✅ CORRECT:
/order-items
/user-profiles
/payment-methods

❌ WRONG:
/orderItems      # camelCase
/order_items     # snake_case
/OrderItems      # PascalCase
```

---

## URL Structure Patterns

### Collection and Item Pattern

```
/resources              # Collection
/resources/{id}         # Single item

Example:
GET    /users           # List all users
POST   /users           # Create new user
GET    /users/123       # Get user 123
PUT    /users/123       # Replace user 123
PATCH  /users/123       # Update user 123
DELETE /users/123       # Delete user 123
```

### Nested Resources (Relationships)

```
/resources/{id}/sub-resources

Example:
GET    /users/123/orders           # User 123's orders
POST   /users/123/orders           # Create order for user 123
GET    /users/123/orders/456       # Specific order
DELETE /users/123/orders/456       # Delete specific order
```

### When to Nest vs. Flatten

```
✅ NEST when:
- Sub-resource doesn't exist without parent
- Access is always through parent
- Example: /users/{id}/addresses

✅ FLATTEN when:
- Resource can exist independently
- Need to query across parents
- Example: /orders?user_id=123 (instead of /users/123/orders)
```

### Query Parameters for Filtering

```
GET /users?status=active
GET /users?role=admin&status=active
GET /orders?created_after=2024-01-01
GET /products?category=electronics&min_price=100
```

---

## HTTP Methods

### Method Semantics

| Method | Operation | Request Body | Response Body | Idempotent | Safe |
|--------|-----------|--------------|---------------|------------|------|
| GET | Read | No | Yes | Yes | Yes |
| POST | Create | Yes | Yes | No | No |
| PUT | Replace | Yes | Yes/No | Yes | No |
| PATCH | Update | Yes | Yes/No | Yes | No |
| DELETE | Remove | No | No/Yes | Yes | No |

### PUT vs PATCH

```javascript
// Original resource
{
  "id": 1,
  "name": "John",
  "email": "john@example.com",
  "role": "user"
}

// PUT - Replace entire resource (must send all fields)
PUT /users/1
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}

// PATCH - Partial update (only changed fields)
PATCH /users/1
{
  "name": "John Doe"
}
```

### DELETE Responses

```
# Option 1: 204 No Content (recommended)
DELETE /users/123
Response: 204 (empty body)

# Option 2: 200 with deleted resource
DELETE /users/123
Response: 200
{
  "id": 123,
  "name": "John",
  "deleted_at": "2024-01-15T10:30:00Z"
}
```

---

## Status Codes

### 2xx Success

| Code | Name | Use Case |
|------|------|----------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE with body |
| 201 | Created | Successful POST creating resource |
| 202 | Accepted | Request accepted for async processing |
| 204 | No Content | Successful DELETE or PUT with no body |

### 3xx Redirection

| Code | Name | Use Case |
|------|------|----------|
| 301 | Moved Permanently | Resource URL changed permanently |
| 302 | Found | Temporary redirect |
| 304 | Not Modified | Cached response still valid |

### 4xx Client Errors

| Code | Name | Use Case |
|------|------|----------|
| 400 | Bad Request | Malformed request, validation errors |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 405 | Method Not Allowed | HTTP method not supported |
| 409 | Conflict | Duplicate resource, version conflict |
| 410 | Gone | Resource deleted permanently |
| 422 | Unprocessable Entity | Semantic validation errors |
| 429 | Too Many Requests | Rate limit exceeded |

### 5xx Server Errors

| Code | Name | Use Case |
|------|------|----------|
| 500 | Internal Server Error | Unexpected server error |
| 502 | Bad Gateway | Upstream service error |
| 503 | Service Unavailable | Maintenance, overload |
| 504 | Gateway Timeout | Upstream service timeout |

---

## Request/Response Headers

### Common Request Headers

```
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>
X-Request-ID: uuid-for-tracing
If-None-Match: "etag-value"
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
```

### Common Response Headers

```
Content-Type: application/json
X-Request-ID: uuid-for-tracing
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1634567890
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT
Cache-Control: max-age=3600
```

---

## Versioning Strategies

### URL Path Versioning (Recommended)

```
https://api.example.com/v1/users
https://api.example.com/v2/users

Pros:
- Clear and explicit
- Easy to test and debug
- Cache-friendly

Cons:
- URL changes between versions
```

### Header Versioning

```
GET /users
Accept: application/vnd.example.v1+json

Pros:
- Clean URLs
- Flexible

Cons:
- Hidden version
- Harder to test
```

### Query Parameter Versioning

```
GET /users?version=1
GET /users?api-version=2024-01-01

Pros:
- Easy to implement
- Explicit

Cons:
- Clutters URLs
- Optional = inconsistent
```

---

## Error Handling

### Standard Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request body contains invalid data",
    "details": [
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Must be a valid email address"
      },
      {
        "field": "age",
        "code": "OUT_OF_RANGE",
        "message": "Must be between 18 and 120"
      }
    ],
    "request_id": "req_abc123xyz",
    "documentation_url": "https://api.example.com/docs/errors#VALIDATION_ERROR"
  }
}
```

### Error Codes by Category

```
Authentication:
- AUTH_REQUIRED
- TOKEN_EXPIRED
- TOKEN_INVALID
- INSUFFICIENT_SCOPE

Authorization:
- FORBIDDEN
- RESOURCE_FORBIDDEN
- ADMIN_REQUIRED

Validation:
- VALIDATION_ERROR
- INVALID_FORMAT
- REQUIRED_FIELD
- OUT_OF_RANGE

Resource:
- NOT_FOUND
- ALREADY_EXISTS
- CONFLICT
- GONE

Server:
- INTERNAL_ERROR
- SERVICE_UNAVAILABLE
- UPSTREAM_ERROR
```

---

## Filtering, Sorting, and Searching

### Filtering

```
GET /users?status=active
GET /users?role=admin,moderator
GET /users?created_after=2024-01-01
GET /orders?total_gte=100&total_lte=500
```

### Sorting

```
GET /users?sort=created_at
GET /users?sort=-created_at              # Descending
GET /users?sort=last_name,first_name     # Multiple fields
GET /users?sort_by=name&sort_order=desc  # Alternative
```

### Searching

```
GET /users?q=john                        # Full-text search
GET /products?search=laptop
GET /articles?query=typescript+tutorial
```

### Field Selection (Sparse Fieldsets)

```
GET /users?fields=id,name,email
GET /users/123?include=orders,profile
GET /users?exclude=password_hash,internal_notes
```

---

## HATEOAS (Hypermedia)

### Links in Responses

```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "_links": {
    "self": { "href": "/users/123" },
    "orders": { "href": "/users/123/orders" },
    "profile": { "href": "/users/123/profile" },
    "update": { "href": "/users/123", "method": "PATCH" },
    "delete": { "href": "/users/123", "method": "DELETE" }
  }
}
```

### Collection Links

```json
{
  "data": [...],
  "_links": {
    "self": { "href": "/users?page=2" },
    "first": { "href": "/users?page=1" },
    "prev": { "href": "/users?page=1" },
    "next": { "href": "/users?page=3" },
    "last": { "href": "/users?page=10" }
  },
  "_meta": {
    "total": 100,
    "page": 2,
    "per_page": 10
  }
}
```

---

## Bulk Operations

### Batch Create

```
POST /users/batch
{
  "users": [
    { "name": "John", "email": "john@example.com" },
    { "name": "Jane", "email": "jane@example.com" }
  ]
}

Response 207 Multi-Status:
{
  "results": [
    { "status": 201, "data": { "id": 1, "name": "John" } },
    { "status": 400, "error": { "code": "DUPLICATE_EMAIL" } }
  ]
}
```

### Batch Update

```
PATCH /users/batch
{
  "updates": [
    { "id": 1, "status": "active" },
    { "id": 2, "status": "inactive" }
  ]
}
```

### Batch Delete

```
DELETE /users/batch
{
  "ids": [1, 2, 3, 4, 5]
}
```

---

## Idempotency

### Idempotency Keys

```
POST /payments
Idempotency-Key: unique-request-id-123

{
  "amount": 100,
  "currency": "USD"
}

# Same request with same key = same response (no duplicate)
```

### Implementation Pattern

```javascript
// Server-side
async function handlePayment(req, res) {
  const idempotencyKey = req.headers['idempotency-key'];

  // Check if already processed
  const existing = await cache.get(`idempotency:${idempotencyKey}`);
  if (existing) {
    return res.status(200).json(existing);
  }

  // Process payment
  const result = await processPayment(req.body);

  // Cache result
  await cache.set(`idempotency:${idempotencyKey}`, result, { ttl: 86400 });

  return res.status(201).json(result);
}
```
