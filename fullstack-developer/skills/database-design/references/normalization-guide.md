# Normalization Guide

Database normalization rules and denormalization patterns.

---

## Normal Forms

### First Normal Form (1NF)

**Rule**: Atomic values, no repeating groups

| Violation | Problem | Fix |
|-----------|---------|-----|
| `phone_numbers: "123,456,789"` | Can't query individual phones | Create phone_numbers table |
| `address: {street, city, zip}` | Nested object | Flatten to columns |
| Multiple columns: `phone1, phone2, phone3` | Repeating group | Create separate table |

**Fix Example:**
```sql
-- Bad: Repeating group
CREATE TABLE users (
  id INT PRIMARY KEY,
  phone1 VARCHAR(20),
  phone2 VARCHAR(20),
  phone3 VARCHAR(20)
);

-- Good: Separate table
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE user_phones (
  id INT PRIMARY KEY,
  user_id INT REFERENCES users(id),
  phone VARCHAR(20)
);
```

---

### Second Normal Form (2NF)

**Rule**: 1NF + No partial dependencies (all non-key columns depend on entire primary key)

| Violation | Problem | Fix |
|-----------|---------|-----|
| `(order_id, product_id) -> product_name` | product_name depends only on product_id | Move to products table |

**Fix Example:**
```sql
-- Bad: Partial dependency
CREATE TABLE order_items (
  order_id INT,
  product_id INT,
  product_name VARCHAR(100),  -- Depends only on product_id!
  quantity INT,
  PRIMARY KEY (order_id, product_id)
);

-- Good: Remove partial dependency
CREATE TABLE order_items (
  order_id INT,
  product_id INT REFERENCES products(id),
  quantity INT,
  PRIMARY KEY (order_id, product_id)
);

CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);
```

---

### Third Normal Form (3NF)

**Rule**: 2NF + No transitive dependencies (non-key columns don't depend on other non-key columns)

| Violation | Problem | Fix |
|-----------|---------|-----|
| `zip_code -> city` | city depends on zip_code, not PK | Create addresses table |
| `department_id -> department_name` | name depends on department_id | Create departments table |

**Fix Example:**
```sql
-- Bad: Transitive dependency
CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  department_id INT,
  department_name VARCHAR(100)  -- Depends on department_id!
);

-- Good: Remove transitive dependency
CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  department_id INT REFERENCES departments(id)
);

CREATE TABLE departments (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);
```

---

### Boyce-Codd Normal Form (BCNF)

**Rule**: Every determinant is a candidate key

Rarely needed. Use when 3NF still has anomalies.

---

## When to Denormalize

### Valid Denormalization Scenarios

| Situation | Denormalization | Justification |
|-----------|-----------------|---------------|
| Read-heavy reporting | Materialized views | Avoid expensive joins |
| Audit/history tables | Duplicate snapshot | Point-in-time accuracy |
| Caching layer | JSON columns | Reduce query complexity |
| Aggregations | Pre-computed totals | Avoid COUNT(*) on millions |

### Denormalization Patterns

**Pattern 1: Calculated Fields**
```sql
-- Store calculated total instead of computing each time
ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10,2);

-- Update via trigger
CREATE TRIGGER update_order_total
AFTER INSERT OR UPDATE ON order_items
FOR EACH ROW EXECUTE FUNCTION recalculate_order_total();
```

**Pattern 2: Materialized Views**
```sql
-- Pre-join for reporting
CREATE MATERIALIZED VIEW order_summary AS
SELECT 
  o.id,
  u.name as customer_name,
  o.total_amount,
  COUNT(oi.id) as item_count
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, u.name, o.total_amount;

-- Refresh periodically
REFRESH MATERIALIZED VIEW order_summary;
```

**Pattern 3: JSON for Flexibility**
```sql
-- Store rarely-queried metadata as JSON
CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  price DECIMAL(10,2),
  metadata JSONB  -- flexible attributes
);
```

---

## Normalization Checklist

- [ ] No repeating groups (1NF)
- [ ] No partial dependencies on composite keys (2NF)
- [ ] No transitive dependencies (3NF)
- [ ] All denormalizations documented with justification
- [ ] Denormalized data has sync mechanism (triggers/jobs)
