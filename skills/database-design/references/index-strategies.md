# Index Strategies Guide

Index types, selection criteria, and optimization patterns.

---

## Index Types

### B-tree (Default)

**Use Case**: Equality and range queries

```sql
-- Good for:
WHERE status = 'active'
WHERE created_at > '2024-01-01'
WHERE price BETWEEN 10 AND 100
ORDER BY created_at DESC

-- Create:
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

### Hash

**Use Case**: Equality only (PostgreSQL)

```sql
-- Good for:
WHERE id = 123

-- Create:
CREATE INDEX idx_users_id_hash ON users USING HASH(id);
```

### GIN (Generalized Inverted Index)

**Use Case**: Array, JSONB, full-text search

```sql
-- Good for:
WHERE tags @> '{sale, featured}'
WHERE metadata @> '{"active": true}'
WHERE to_tsvector(content) @@ to_tsquery('search term')

-- Create:
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_products_metadata ON products USING GIN(metadata);
CREATE INDEX idx_articles_search ON articles USING GIN(to_tsvector('english', content));
```

### GiST (Generalized Search Tree)

**Use Case**: Geometric, range types, nearest neighbor

```sql
-- Good for:
WHERE location <-> point '(40.7,-74.0)' < 10
WHERE daterange @> '2024-01-15'

-- Create:
CREATE INDEX idx_stores_location ON stores USING GIST(location);
```

### Partial Index

**Use Case**: Index subset of rows

```sql
-- Only index active users (saves space)
CREATE INDEX idx_users_active ON users(email) 
WHERE status = 'active';

-- Only index recent orders
CREATE INDEX idx_orders_recent ON orders(created_at)
WHERE created_at > NOW() - INTERVAL '30 days';
```

### Composite Index

**Use Case**: Multi-column queries

```sql
-- Good for:
WHERE user_id = X AND created_at > Y
WHERE status = 'active' AND category = 'electronics'

-- Create (column order matters!):
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);
```

---

## Index Decision Matrix

| Query Pattern | Index Strategy |
|---------------|----------------|
| `WHERE col = value` | B-tree on col |
| `WHERE col1 = X AND col2 = Y` | Composite (col1, col2) |
| `WHERE col LIKE 'prefix%'` | B-tree on col |
| `WHERE col LIKE '%suffix'` | GIN trigram |
| `ORDER BY col` | B-tree on col |
| `WHERE col IN (...)` | B-tree on col |
| `WHERE col @> array` | GIN on col |
| `WHERE jsonb @> '{...}'` | GIN on jsonb col |
| `WHERE tsquery @@ tsvector` | GIN on tsvector |
| Nearest neighbor | GiST on geometry |

---

## Composite Index Column Order

**Rule**: Put equality columns first, range columns last

```sql
-- Query:
WHERE status = 'active' AND created_at > '2024-01-01'

-- Good (equality first):
CREATE INDEX idx ON orders(status, created_at);

-- Bad (range first - less efficient):
CREATE INDEX idx ON orders(created_at, status);
```

**Rule**: Most selective column first for multi-equality

```sql
-- If user_id is more selective than status:
CREATE INDEX idx ON orders(user_id, status);
```

---

## Index Anti-Patterns

### Over-indexing
```sql
-- Bad: Index on every column
CREATE INDEX idx1 ON users(name);
CREATE INDEX idx2 ON users(email);
CREATE INDEX idx3 ON users(created_at);
CREATE INDEX idx4 ON users(status);
CREATE INDEX idx5 ON users(name, email);  -- Redundant!
```

### Unused Indexes
```sql
-- Check for unused indexes:
SELECT schemaname, relname, indexrelname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;
```

### Wrong Column Order
```sql
-- Index: (a, b, c)
-- Can use for: WHERE a = X
-- Can use for: WHERE a = X AND b = Y
-- CANNOT use for: WHERE b = Y (a not in query!)
```

---

## Index Maintenance

### Monitor Index Usage
```sql
SELECT 
  relname as table,
  indexrelname as index,
  idx_scan as scans,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Rebuild Bloated Indexes
```sql
REINDEX INDEX idx_users_email;
-- Or concurrently (no lock):
REINDEX INDEX CONCURRENTLY idx_users_email;
```
