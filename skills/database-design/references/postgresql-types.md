# PostgreSQL Data Types Guide

Optimal data type selection for PostgreSQL.

---

## Primary Key Types

| Type | When to Use | Example |
|------|-------------|---------|
| `SERIAL` | Simple auto-increment | Legacy systems |
| `BIGSERIAL` | Large tables (>2B rows) | High-volume tables |
| `UUID` | Distributed systems | `gen_random_uuid()` |
| `ULID` | Sortable unique IDs | Custom function |

```sql
-- UUID (recommended for new projects)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- BIGSERIAL (for performance-critical)
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY
);
```

---

## String Types

| Type | When to Use | Storage |
|------|-------------|---------|
| `VARCHAR(n)` | Known max length | Variable |
| `TEXT` | Unknown length | Variable |
| `CHAR(n)` | Fixed length (codes) | Fixed |

```sql
-- Use VARCHAR when you know the limit
email VARCHAR(255) NOT NULL,
country_code CHAR(2) NOT NULL,

-- Use TEXT for unlimited
description TEXT,
content TEXT
```

---

## Numeric Types

| Type | Range | Use Case |
|------|-------|----------|
| `SMALLINT` | -32K to 32K | Enum-like values |
| `INTEGER` | -2B to 2B | Most counts |
| `BIGINT` | -9Q to 9Q | Large counts |
| `DECIMAL(p,s)` | Exact | Money, precise |
| `REAL` | 6 digits | Scientific |
| `DOUBLE PRECISION` | 15 digits | Scientific |

```sql
-- Money: Always use DECIMAL
price DECIMAL(10, 2) NOT NULL,  -- Up to 99,999,999.99
quantity INTEGER NOT NULL DEFAULT 0,

-- Never use FLOAT for money!
-- Bad: price FLOAT  -- Rounding errors!
```

---

## Date/Time Types

| Type | Storage | Use Case |
|------|---------|----------|
| `DATE` | 4 bytes | Date only |
| `TIME` | 8 bytes | Time only |
| `TIMESTAMP` | 8 bytes | Without timezone |
| `TIMESTAMPTZ` | 8 bytes | With timezone (recommended) |
| `INTERVAL` | 16 bytes | Duration |

```sql
-- Always use TIMESTAMPTZ for events
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),

-- Use DATE for birthdays, deadlines
birth_date DATE,
due_date DATE
```

---

## Boolean

```sql
is_active BOOLEAN DEFAULT true,
is_deleted BOOLEAN DEFAULT false,
has_verified_email BOOLEAN DEFAULT false
```

---

## JSON Types

| Type | When to Use |
|------|-------------|
| `JSON` | Store only, no queries |
| `JSONB` | Query, index, manipulate |

```sql
-- JSONB for queryable data
metadata JSONB DEFAULT '{}',
settings JSONB DEFAULT '{}',

-- Query JSONB
SELECT * FROM users WHERE metadata->>'plan' = 'premium';

-- Index JSONB
CREATE INDEX idx_users_metadata ON users USING GIN(metadata);
```

---

## Array Types

```sql
-- Define array column
tags TEXT[] DEFAULT '{}',
scores INTEGER[],

-- Insert
INSERT INTO products (tags) VALUES ('{sale, featured, new}');

-- Query
SELECT * FROM products WHERE 'sale' = ANY(tags);
SELECT * FROM products WHERE tags @> '{sale, featured}';

-- Index
CREATE INDEX idx_products_tags ON products USING GIN(tags);
```

---

## Enum Types

```sql
-- Create enum
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered');

-- Use in table
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  status order_status DEFAULT 'pending'
);

-- Add new value
ALTER TYPE order_status ADD VALUE 'cancelled';
```

---

## Type Selection Checklist

| Data | Recommended Type |
|------|------------------|
| ID (new project) | UUID |
| ID (high performance) | BIGSERIAL |
| Money | DECIMAL(10,2) |
| Email | VARCHAR(255) |
| Name | VARCHAR(100) |
| Description | TEXT |
| Country code | CHAR(2) |
| Timestamps | TIMESTAMPTZ |
| Flags | BOOLEAN |
| Flexible data | JSONB |
| Tags/Categories | TEXT[] or JSONB |
| Status | ENUM |
