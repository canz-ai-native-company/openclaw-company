# Partitioning Guide

Table partitioning strategies for PostgreSQL.

---

## When to Partition

| Condition | Partition? |
|-----------|------------|
| Table < 10M rows | No |
| Table 10M - 100M rows | Consider |
| Table > 100M rows | Yes |
| Time-series data | Yes (by date) |
| Multi-tenant | Yes (by tenant_id) |
| Need to drop old data quickly | Yes |

---

## Partition Types

### Range Partitioning

**Use Case**: Time-series data, date-based queries

```sql
-- Create partitioned table
CREATE TABLE orders (
  id UUID NOT NULL,
  user_id UUID NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create partitions
CREATE TABLE orders_2024_q1 PARTITION OF orders
  FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE orders_2024_q2 PARTITION OF orders
  FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

CREATE TABLE orders_2024_q3 PARTITION OF orders
  FOR VALUES FROM ('2024-07-01') TO ('2024-10-01');

CREATE TABLE orders_2024_q4 PARTITION OF orders
  FOR VALUES FROM ('2024-10-01') TO ('2025-01-01');
```

### List Partitioning

**Use Case**: Multi-tenant, categorical data

```sql
-- Partition by region
CREATE TABLE customers (
  id UUID NOT NULL,
  region VARCHAR(10) NOT NULL,
  name VARCHAR(100),
  PRIMARY KEY (id, region)
) PARTITION BY LIST (region);

CREATE TABLE customers_us PARTITION OF customers
  FOR VALUES IN ('US', 'CA');

CREATE TABLE customers_eu PARTITION OF customers
  FOR VALUES IN ('UK', 'DE', 'FR');

CREATE TABLE customers_asia PARTITION OF customers
  FOR VALUES IN ('JP', 'CN', 'KR');
```

### Hash Partitioning

**Use Case**: Even distribution, no natural partition key

```sql
-- Distribute by user_id hash
CREATE TABLE sessions (
  id UUID NOT NULL,
  user_id UUID NOT NULL,
  data JSONB,
  PRIMARY KEY (id, user_id)
) PARTITION BY HASH (user_id);

CREATE TABLE sessions_0 PARTITION OF sessions
  FOR VALUES WITH (MODULUS 4, REMAINDER 0);

CREATE TABLE sessions_1 PARTITION OF sessions
  FOR VALUES WITH (MODULUS 4, REMAINDER 1);

CREATE TABLE sessions_2 PARTITION OF sessions
  FOR VALUES WITH (MODULUS 4, REMAINDER 2);

CREATE TABLE sessions_3 PARTITION OF sessions
  FOR VALUES WITH (MODULUS 4, REMAINDER 3);
```

---

## Partition Management

### Add New Partition

```sql
-- Add next quarter
CREATE TABLE orders_2025_q1 PARTITION OF orders
  FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');
```

### Drop Old Partition (Fast!)

```sql
-- Much faster than DELETE
DROP TABLE orders_2023_q1;
```

### Detach Partition (Keep Data)

```sql
-- Detach without deleting
ALTER TABLE orders DETACH PARTITION orders_2023_q1;

-- Now orders_2023_q1 is standalone table for archival
```

---

## Automatic Partition Creation

```sql
-- Create function for monthly partitions
CREATE OR REPLACE FUNCTION create_monthly_partition()
RETURNS TRIGGER AS $$
DECLARE
  partition_name TEXT;
  start_date DATE;
  end_date DATE;
BEGIN
  start_date := DATE_TRUNC('month', NEW.created_at);
  end_date := start_date + INTERVAL '1 month';
  partition_name := 'orders_' || TO_CHAR(start_date, 'YYYY_MM');
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE tablename = partition_name
  ) THEN
    EXECUTE format(
      'CREATE TABLE %I PARTITION OF orders FOR VALUES FROM (%L) TO (%L)',
      partition_name, start_date, end_date
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## Partition Indexes

```sql
-- Indexes are created per-partition automatically
-- But you can also create directly:

-- Index on partition
CREATE INDEX idx_orders_2024_q1_user ON orders_2024_q1(user_id);

-- Or on parent (applies to all partitions)
CREATE INDEX idx_orders_user ON orders(user_id);
```

---

## Query Optimization

### Partition Pruning

```sql
-- Query only scans relevant partitions
EXPLAIN SELECT * FROM orders 
WHERE created_at >= '2024-06-01' AND created_at < '2024-07-01';

-- Shows: Scan only orders_2024_q2
```

### Include Partition Key

```sql
-- Good: Partition key in WHERE
SELECT * FROM orders 
WHERE created_at >= '2024-01-01' 
  AND user_id = 'abc123';

-- Bad: Missing partition key (scans all partitions)
SELECT * FROM orders WHERE user_id = 'abc123';
```

---

## Partitioning Checklist

- [ ] Table exceeds 10M rows or grows rapidly
- [ ] Partition key is in most queries (for pruning)
- [ ] Primary key includes partition key
- [ ] Partition maintenance automated (create/drop)
- [ ] Old partitions archived or dropped
- [ ] Indexes created on partitions
