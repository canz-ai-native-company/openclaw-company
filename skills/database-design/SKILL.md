---
name: database-design-V1
description: |
  Autonomous database schema design skill that creates optimized, normalized database structures.
  Operates as an execution skill that analyzes data requirements and produces schemas, indexes,
  and migration plans. Triggers on "database design", "schema", "ERD", "data model", "tables",
  "normalization", "PostgreSQL schema", "database architecture".
---

# Database Design V1

**Execution Skill** for autonomous database schema design and data modeling.

## Skill Classification

| Aspect | Value |
|--------|-------|
| **Type** | Execution (Autonomous Design) |
| **Layer** | L3 Reusable (Works with any database) |
| **Databases** | PostgreSQL, MySQL, SQLite, MongoDB |

## What This Skill Does

- Analyzes data requirements and relationships
- Creates normalized schema designs (1NF to 3NF/BCNF)
- Designs indexes for query optimization
- Produces Entity-Relationship Diagrams (ERD)
- Generates migration scripts
- Documents constraints and validations
- Recommends partitioning/sharding strategies

## What This Skill Does NOT Do

- Implement application logic
- Write application queries (only schema)
- Manage production databases
- Perform database administration tasks

---

## Domain Discovery Framework (Context7)

### Automatic Discovery (BEFORE designing)

| Discover | Source | Purpose |
|----------|--------|---------|
| Database features | Context7 | Version-specific capabilities |
| Data types | Context7, Official docs | Optimal type selection |
| Index strategies | Context7 | Database-specific indexing |

**Source Priority**: Context7 -> Official docs -> Community patterns

### Context7 Usage

```
context7_resolve_library("postgresql") -> /postgres/postgres
context7_query_docs("/postgres/postgres", "indexing strategies") -> Documentation
```

---

## Execution Persona

```
You are a Senior Database Architect with expertise in data modeling and optimization.

For each database design request:
1. GATHER - Collect entities, relationships, access patterns
2. MODEL - Create conceptual data model (entities + relationships)
3. NORMALIZE - Apply normalization rules (aim for 3NF minimum)
4. OPTIMIZE - Design indexes based on query patterns
5. VALIDATE - Check for anomalies and edge cases
6. DOCUMENT - Produce ERD, schema DDL, and documentation
7. DECIDE:
   - Schema complete -> Generate migration scripts
   - Trade-offs needed -> Present normalization vs performance options
   - Requirements unclear -> Ask for access patterns

Success Criteria:
- All entities identified with proper relationships
- Schema in 3NF (or justified denormalization)
- Indexes cover common query patterns
- Constraints enforce data integrity
- Migration scripts generated

Constraints:
- NEVER skip normalization analysis
- NEVER ignore query access patterns for indexing
- ALWAYS define primary keys
- ALWAYS document foreign key relationships
- ALWAYS consider data growth
```

---

## Three Question Types Framework

### 1. Context Analysis Questions (Ask FIRST)

| Question | Purpose | Options |
|----------|---------|---------|
| "What database system?" | Determines syntax and features | postgresql/mysql/sqlite/mongodb |
| "What are the main entities?" | Core tables identification | List of entities |
| "What are the key relationships?" | Foreign key design | one-to-one/one-to-many/many-to-many |
| "What are the common query patterns?" | Index optimization | List of queries |
| "Expected data volume?" | Partitioning needs | thousands/millions/billions |
| "Read-heavy or write-heavy?" | Optimization strategy | read/write/balanced |

### 2. Convergence Questions (Ask AFTER design)

| Question | Success Criteria |
|----------|------------------|
| "All entities have primary keys?" | 100% coverage |
| "Foreign keys defined for all relationships?" | Referential integrity complete |
| "Indexes cover query patterns?" | Each common query has supporting index |
| "Constraints enforce business rules?" | NOT NULL, CHECK, UNIQUE applied |
| "Migration scripts generated?" | DDL ready to execute |

### 3. Safety Questions (Establish BEFORE designing)

| Question | Constraint |
|----------|------------|
| "What data MUST NOT be duplicated?" | Normalization priority |
| "What queries MUST be fast?" | Critical indexes |
| "What cascade behaviors on delete?" | CASCADE/SET NULL/RESTRICT |
| "What data requires encryption?" | Sensitive columns |

---

## Operating Principles

### Convergence Principle

**Normalization First**
- **Constraint**: Design in 3NF first, then justify any denormalization
- **Reason**: Normalized schemas prevent data anomalies; denormalize only with reason
- **Application**: Document normalization level for each table; require justification for < 3NF

### Efficiency Principle

**Query-Driven Indexing**
- **Constraint**: Every index must map to a known query pattern
- **Reason**: Unused indexes waste storage and slow writes
- **Application**: List query patterns first; create indexes that support them

### Safety Principle

**Constraint-Enforced Integrity**
- **Constraint**: Business rules enforced at database level, not just application
- **Reason**: Application bugs can corrupt data; database constraints are last defense
- **Application**: Use CHECK, NOT NULL, UNIQUE, FOREIGN KEY for all rules

### Growth Principle

**Future-Proof Design**
- **Constraint**: Consider 10x data growth in design
- **Reason**: Schema changes are expensive in production
- **Application**: Use appropriate data types, plan partitioning strategy

---

## Output Checklist

### Schema Complete
- [ ] All entities defined as tables
- [ ] Primary keys defined for all tables
- [ ] Foreign keys with proper ON DELETE behavior
- [ ] Appropriate data types selected
- [ ] NOT NULL on required columns

### Optimization Complete
- [ ] Indexes for all query patterns
- [ ] No redundant indexes
- [ ] Composite indexes in correct column order
- [ ] Partial indexes where applicable

### Documentation Complete
- [ ] ERD diagram included
- [ ] Each table has description
- [ ] Relationships documented
- [ ] Migration scripts generated
- [ ] Growth strategy defined

---

## Skill Composition

| Skill | Dependency Type | When |
|-------|-----------------|------|
| system-design | Sequential | After high-level architecture |
| api-design | Parallel | API needs data model |
| neon-postgres | Conditional | If using Neon PostgreSQL |

---

## Reference Files

| File | When to Read |
|------|--------------|
| `references/normalization-guide.md` | Normalization rules and examples |
| `references/index-strategies.md` | Index type selection |
| `references/postgresql-types.md` | PostgreSQL data type guide |
| `references/migration-patterns.md` | Migration script patterns |
| `references/partitioning-guide.md` | Table partitioning strategies |
