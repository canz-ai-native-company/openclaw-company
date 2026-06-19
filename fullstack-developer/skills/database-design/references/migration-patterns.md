# Migration Patterns Guide

Database migration script patterns and best practices.

---

## Migration File Structure

```
migrations/
  001_create_users.sql
  002_create_orders.sql
  003_add_users_email_index.sql
  004_alter_orders_add_status.sql
```

---

## Migration Template

```sql
-- Migration: XXX_description
-- Created: YYYY-MM-DD
-- Author: Name

-- ============================================
-- UP: Apply changes
-- ============================================

BEGIN;

-- Create table
CREATE TABLE table_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_table_column ON table_name(column);

COMMIT;

-- ============================================
-- DOWN: Rollback changes
-- ============================================

-- DROP INDEX idx_table_column;
-- DROP TABLE table_name;
```

---

## Common Migration Patterns

### Create Table

```sql
-- UP
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;

-- DOWN
DROP TABLE users;
```

### Add Column

```sql
-- UP
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users ADD COLUMN verified_at TIMESTAMPTZ;

-- DOWN
ALTER TABLE users DROP COLUMN phone;
ALTER TABLE users DROP COLUMN verified_at;
```

### Add Column with Default (Safe)

```sql
-- UP (PostgreSQL 11+ - instant for NOT NULL with DEFAULT)
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user' NOT NULL;

-- DOWN
ALTER TABLE users DROP COLUMN role;
```

### Rename Column

```sql
-- UP
ALTER TABLE users RENAME COLUMN name TO full_name;

-- DOWN
ALTER TABLE users RENAME COLUMN full_name TO name;
```

### Add Foreign Key

```sql
-- UP
ALTER TABLE orders ADD COLUMN user_id UUID;
ALTER TABLE orders ADD CONSTRAINT fk_orders_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
CREATE INDEX idx_orders_user ON orders(user_id);

-- DOWN
ALTER TABLE orders DROP CONSTRAINT fk_orders_user;
DROP INDEX idx_orders_user;
ALTER TABLE orders DROP COLUMN user_id;
```

### Add Index (Concurrent)

```sql
-- UP (no lock on large tables)
CREATE INDEX CONCURRENTLY idx_orders_status ON orders(status);

-- DOWN
DROP INDEX idx_orders_status;
```

### Add Enum Type

```sql
-- UP
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered');
ALTER TABLE orders ADD COLUMN status order_status DEFAULT 'pending';

-- DOWN
ALTER TABLE orders DROP COLUMN status;
DROP TYPE order_status;
```

### Add Enum Value

```sql
-- UP
ALTER TYPE order_status ADD VALUE 'cancelled';

-- DOWN (cannot remove enum values - must recreate type)
-- This requires complex migration with temp column
```

---

## Safe Migration Practices

### 1. Add NOT NULL Safely

```sql
-- Step 1: Add nullable column
ALTER TABLE users ADD COLUMN new_col VARCHAR(50);

-- Step 2: Backfill data
UPDATE users SET new_col = 'default' WHERE new_col IS NULL;

-- Step 3: Add NOT NULL constraint
ALTER TABLE users ALTER COLUMN new_col SET NOT NULL;
```

### 2. Rename Table Safely

```sql
-- Step 1: Create new table
CREATE TABLE new_name AS SELECT * FROM old_name;

-- Step 2: Add constraints/indexes
ALTER TABLE new_name ADD PRIMARY KEY (id);

-- Step 3: Update application code

-- Step 4: Drop old table (after verification)
DROP TABLE old_name;
```

### 3. Change Column Type Safely

```sql
-- Step 1: Add new column
ALTER TABLE orders ADD COLUMN new_total DECIMAL(12,2);

-- Step 2: Backfill
UPDATE orders SET new_total = old_total::DECIMAL(12,2);

-- Step 3: Drop old, rename new
ALTER TABLE orders DROP COLUMN old_total;
ALTER TABLE orders RENAME COLUMN new_total TO total;
```

---

## Migration Checklist

- [ ] Has UP and DOWN sections
- [ ] Uses transactions (BEGIN/COMMIT)
- [ ] Large indexes use CONCURRENTLY
- [ ] NOT NULL columns have backfill plan
- [ ] Foreign keys have ON DELETE behavior
- [ ] Tested on copy of production data
