# API Pagination Patterns

Comprehensive guide for implementing pagination in APIs.

---

## Pagination Methods Overview

| Method | Best For | Pros | Cons |
|--------|----------|------|------|
| **Offset** | Simple UIs, small datasets | Simple, random access | Slow on large data, drift issues |
| **Cursor** | Real-time feeds, large datasets | Consistent, performant | No random access, complex |
| **Page Number** | Traditional UIs | Intuitive for users | Same issues as offset |
| **Keyset** | Large sorted datasets | Very fast, consistent | Requires unique sort key |

---

## Offset-Based Pagination

### Request Format

```
GET /users?limit=20&offset=40
GET /users?limit=20&skip=40
```

### Response Format

```json
{
  "data": [
    { "id": 41, "name": "User 41" },
    { "id": 42, "name": "User 42" }
  ],
  "pagination": {
    "total": 1000,
    "limit": 20,
    "offset": 40,
    "has_more": true
  }
}
```

### With Links (HATEOAS)

```json
{
  "data": [...],
  "pagination": {
    "total": 1000,
    "limit": 20,
    "offset": 40
  },
  "_links": {
    "self": "/users?limit=20&offset=40",
    "first": "/users?limit=20&offset=0",
    "prev": "/users?limit=20&offset=20",
    "next": "/users?limit=20&offset=60",
    "last": "/users?limit=20&offset=980"
  }
}
```

### OpenAPI Schema

```yaml
components:
  schemas:
    PaginatedUsers:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/User'
        pagination:
          $ref: '#/components/schemas/OffsetPagination'

    OffsetPagination:
      type: object
      properties:
        total:
          type: integer
          description: Total number of items
          example: 1000
        limit:
          type: integer
          description: Items per page
          example: 20
        offset:
          type: integer
          description: Items skipped
          example: 40
        has_more:
          type: boolean
          description: More items available

  parameters:
    limitParam:
      name: limit
      in: query
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20

    offsetParam:
      name: offset
      in: query
      schema:
        type: integer
        minimum: 0
        default: 0
```

### Pros and Cons

```
✅ Pros:
- Simple to implement
- Random page access (jump to page 10)
- Easy to understand

❌ Cons:
- Slow for large offsets (OFFSET 100000 scans 100000 rows)
- Inconsistent results (items shift between requests)
- Not suitable for real-time data
```

---

## Cursor-Based Pagination

### Request Format

```
GET /users?limit=20
GET /users?limit=20&cursor=eyJpZCI6MTIzfQ==
```

### Cursor Types

```
# Opaque cursor (recommended)
cursor=eyJpZCI6MTIzLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0xNSJ9

# Decoded: {"id": 123, "created_at": "2024-01-15"}

# Simple cursor (ID-based)
cursor=123
after=123

# Timestamp cursor
cursor=2024-01-15T10:30:00Z
```

### Response Format

```json
{
  "data": [
    { "id": 124, "name": "User 124" },
    { "id": 125, "name": "User 125" }
  ],
  "pagination": {
    "next_cursor": "eyJpZCI6MTQzfQ==",
    "prev_cursor": "eyJpZCI6MTIzfQ==",
    "has_more": true
  }
}
```

### Bidirectional Cursor

```json
{
  "data": [...],
  "pagination": {
    "cursors": {
      "before": "eyJpZCI6MTIwfQ==",
      "after": "eyJpZCI6MTQwfQ=="
    },
    "has_previous": true,
    "has_next": true
  }
}

# Navigation
GET /users?limit=20&after=eyJpZCI6MTQwfQ==   # Next page
GET /users?limit=20&before=eyJpZCI6MTIwfQ==  # Previous page
```

### OpenAPI Schema

```yaml
components:
  schemas:
    CursorPaginatedUsers:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/User'
        pagination:
          $ref: '#/components/schemas/CursorPagination'

    CursorPagination:
      type: object
      properties:
        next_cursor:
          type: string
          nullable: true
          description: Cursor for next page
          example: "eyJpZCI6MTQzfQ=="
        prev_cursor:
          type: string
          nullable: true
          description: Cursor for previous page
        has_more:
          type: boolean
          description: More items available

  parameters:
    cursorParam:
      name: cursor
      in: query
      schema:
        type: string
      description: Pagination cursor from previous response

    limitParam:
      name: limit
      in: query
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20
```

### Pros and Cons

```
✅ Pros:
- Consistent results (no drift)
- O(1) performance regardless of position
- Works well with real-time data

❌ Cons:
- No random page access
- More complex implementation
- Cursor can become invalid if item deleted
```

---

## Page Number Pagination

### Request Format

```
GET /users?page=3&per_page=20
GET /users?page=3&size=20
GET /users?pageNumber=3&pageSize=20
```

### Response Format

```json
{
  "data": [...],
  "pagination": {
    "page": 3,
    "per_page": 20,
    "total_pages": 50,
    "total_items": 1000,
    "has_next": true,
    "has_previous": true
  }
}
```

### With Links

```json
{
  "data": [...],
  "pagination": {
    "page": 3,
    "per_page": 20,
    "total_pages": 50,
    "total_items": 1000
  },
  "_links": {
    "self": "/users?page=3&per_page=20",
    "first": "/users?page=1&per_page=20",
    "prev": "/users?page=2&per_page=20",
    "next": "/users?page=4&per_page=20",
    "last": "/users?page=50&per_page=20"
  }
}
```

### OpenAPI Schema

```yaml
components:
  schemas:
    PagePagination:
      type: object
      properties:
        page:
          type: integer
          description: Current page number
          example: 3
        per_page:
          type: integer
          description: Items per page
          example: 20
        total_pages:
          type: integer
          description: Total number of pages
          example: 50
        total_items:
          type: integer
          description: Total number of items
          example: 1000
        has_next:
          type: boolean
        has_previous:
          type: boolean

  parameters:
    pageParam:
      name: page
      in: query
      schema:
        type: integer
        minimum: 1
        default: 1

    perPageParam:
      name: per_page
      in: query
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20
```

---

## Keyset Pagination

### Concept

```
# Instead of OFFSET, use WHERE clause with indexed column

# Offset (slow)
SELECT * FROM users ORDER BY created_at DESC OFFSET 10000 LIMIT 20;

# Keyset (fast)
SELECT * FROM users
WHERE created_at < '2024-01-15T10:30:00Z'
ORDER BY created_at DESC
LIMIT 20;
```

### Request Format

```
GET /users?limit=20
GET /users?limit=20&created_before=2024-01-15T10:30:00Z
GET /users?limit=20&id_lt=12345
```

### Response Format

```json
{
  "data": [
    { "id": 12344, "created_at": "2024-01-15T10:29:00Z" },
    { "id": 12343, "created_at": "2024-01-15T10:28:00Z" }
  ],
  "pagination": {
    "next": {
      "created_before": "2024-01-15T10:28:00Z",
      "id_lt": 12343
    },
    "has_more": true
  }
}
```

### Compound Keyset (for non-unique columns)

```json
// When sorting by non-unique column (e.g., created_at)
// Need secondary sort key (e.g., id) for consistency

{
  "pagination": {
    "next": {
      "created_at_lte": "2024-01-15T10:28:00Z",
      "id_lt": 12343
    }
  }
}

// SQL equivalent
SELECT * FROM users
WHERE (created_at, id) < ('2024-01-15T10:28:00Z', 12343)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

---

## GraphQL Connection Pattern (Relay)

### Schema

```graphql
type Query {
  users(
    first: Int
    after: String
    last: Int
    before: String
  ): UserConnection!
}

type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

### Query Examples

```graphql
# First page
query {
  users(first: 10) {
    edges {
      node {
        id
        name
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}

# Next page
query {
  users(first: 10, after: "cursor123") {
    edges {
      node {
        id
        name
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}

# Previous page (backwards)
query {
  users(last: 10, before: "cursor456") {
    edges {
      node {
        id
        name
      }
    }
    pageInfo {
      hasPreviousPage
      startCursor
    }
  }
}
```

---

## Choosing a Pagination Strategy

### Decision Matrix

```
┌─────────────────────────────────────────────────────────────┐
│                    Choose Your Pagination                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Is random page access required?                            │
│  ├── YES: Do you have < 10K items?                          │
│  │   ├── YES → Page Number or Offset                        │
│  │   └── NO → Consider search/filter instead                │
│  │                                                          │
│  └── NO: Is data frequently updated?                        │
│      ├── YES → Cursor-based                                 │
│      └── NO: Is dataset very large (>100K)?                 │
│          ├── YES → Keyset pagination                        │
│          └── NO → Any method works                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Quick Reference

| Scenario | Recommended |
|----------|-------------|
| Blog posts listing | Cursor |
| Search results | Page Number |
| Real-time feed | Cursor |
| Admin data tables | Page Number + filtering |
| Analytics dashboard | Keyset with time range |
| Infinite scroll | Cursor |
| Traditional pagination UI | Page Number |
| Large datasets | Keyset or Cursor |

---

## Implementation Patterns

### Default Values

```yaml
pagination_defaults:
  default_limit: 20
  max_limit: 100
  min_limit: 1
```

### Sorting with Pagination

```
GET /users?sort=-created_at&limit=20&cursor=...

# Response includes sort order in cursor
{
  "pagination": {
    "next_cursor": "eyJjcmVhdGVkX2F0IjoiMjAyNC0wMS0xNSIsImlkIjoxMjN9",
    "sort": "-created_at"
  }
}
```

### Filtering with Pagination

```
GET /users?status=active&role=admin&limit=20&page=2

{
  "data": [...],
  "pagination": {
    "page": 2,
    "per_page": 20,
    "total_items": 150,  # Total matching filter
    "total_pages": 8
  },
  "filters": {
    "status": "active",
    "role": "admin"
  }
}
```

---

## Response Headers Alternative

```http
HTTP/1.1 200 OK
X-Total-Count: 1000
X-Page: 3
X-Per-Page: 20
X-Total-Pages: 50
Link: <https://api.example.com/users?page=1>; rel="first",
      <https://api.example.com/users?page=2>; rel="prev",
      <https://api.example.com/users?page=4>; rel="next",
      <https://api.example.com/users?page=50>; rel="last"

[...data array...]
```

---

## Best Practices

### Do's

```
✅ Set reasonable default and maximum limits
✅ Include total count when feasible
✅ Provide next/prev links or cursors
✅ Use consistent parameter names across API
✅ Document pagination parameters clearly
✅ Include empty array for empty pages
✅ Return 200 for valid empty results
```

### Don'ts

```
❌ Allow unlimited page sizes
❌ Return 404 for empty results
❌ Use offset for real-time feeds
❌ Expose internal database IDs in cursors without encoding
❌ Change sort order between pages
❌ Skip pagination on list endpoints
```

### Error Handling

```json
// Invalid cursor
{
  "error": {
    "code": "INVALID_CURSOR",
    "message": "The pagination cursor is invalid or expired"
  }
}

// Page out of range
{
  "error": {
    "code": "PAGE_OUT_OF_RANGE",
    "message": "Page 100 does not exist. Total pages: 50"
  }
}

// Invalid limit
{
  "error": {
    "code": "INVALID_LIMIT",
    "message": "Limit must be between 1 and 100"
  }
}
```
