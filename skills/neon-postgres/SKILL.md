---
name: neon-postgres
description: Connect and query Neon PostgreSQL database. Use when checking tasks, managing records, or executing database operations via MCP tools. Supports WhatsApp DM, Groups, and Cron Jobs.
---

# Neon PostgreSQL Database Integration

Enable AI Employee to connect and query Neon PostgreSQL database for task management, record operations, and automated workflows.

## Available MCP Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `query_database` | Execute any SQL query | `sql: str` |
| `check_new_tasks` | Check for new pending tasks | `last_client_id: int` |
| `mark_task_completed` | Mark task as done | `client_id: int` |
| `get_task_by_id` | Get specific task details | `task_id: int` |
| `insert_record` | Insert new record | `table: str, data: dict` |
| `update_record` | Update existing record | `table: str, id: int, data: dict` |

## Security Rules

### FORBIDDEN Actions

```
NEVER expose database credentials in responses
NEVER run DROP, TRUNCATE, or DELETE without explicit user confirmation
NEVER execute raw user input directly - always validate first
NEVER log or display connection strings
```

### REQUIRED Security Practices

```python
# ALWAYS use parameterized queries
# CORRECT - Safe from SQL injection
await conn.execute(
    'SELECT * FROM users WHERE id = $1',
    user_id
)

# WRONG - Vulnerable to SQL injection
await conn.execute(
    f'SELECT * FROM users WHERE id = {user_id}'  # NEVER DO THIS!
)
```

### Destructive Operations - MUST Confirm

Before executing any of these, ask user: "Are you sure you want to [action]? This cannot be undone."

- `DELETE FROM table WHERE ...`
- `TRUNCATE TABLE ...`
- `DROP TABLE ...`
- `UPDATE ... SET ...` (on multiple rows)

## Common Use Cases

### 1. Check for New Tasks

**User says:** "Check for new project requests" or "Naye tasks check karo"

```python
# Use the check_new_tasks tool
result = await check_new_tasks(last_client_id=0)

# Or use query_database for custom query
result = await query_database(
    "SELECT * FROM tasks WHERE status = 'pending' ORDER BY created_at DESC"
)
```

### 2. Mark Task as Completed

**User says:** "Mark task #123 as completed" or "Task 123 complete kar do"

```python
# Use mark_task_completed tool
await mark_task_completed(client_id=123)

# Or use update_record tool
await update_record(
    table="tasks",
    id=123,
    data={"status": "completed", "completed_at": "NOW()"}
)
```

### 3. Show All Pending Tasks

**User says:** "Show all pending tasks" or "Pending tasks dikhao"

```python
result = await query_database("""
    SELECT id, title, description, created_at, priority
    FROM tasks
    WHERE status = 'pending'
    ORDER BY priority DESC, created_at ASC
""")
```

### 4. Add New Client/Record

**User says:** "Add new client" or "Naya client add karo"

```python
await insert_record(
    table="clients",
    data={
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "created_at": "NOW()"
    }
)
```

### 5. Update Task Status

**User says:** "Update task status to in_progress"

```python
await update_record(
    table="tasks",
    id=task_id,
    data={"status": "in_progress", "started_at": "NOW()"}
)
```

### 6. Get Task Details

**User says:** "Show details of task #45"

```python
task = await get_task_by_id(task_id=45)
```

## Response Format Guidelines

### For SELECT Queries - Display as Table

```
Found 3 pending tasks:

| ID  | Title              | Priority | Created At          |
|-----|--------------------| ---------|---------------------|
| 45  | Design homepage    | high     | 2026-03-10 14:30:00 |
| 46  | Fix login bug      | medium   | 2026-03-10 15:00:00 |
| 47  | Update docs        | low      | 2026-03-10 16:00:00 |
```

### For INSERT Operations - Confirm Creation

```
New client added successfully:
- Name: John Doe
- Email: john@example.com
- ID: 156
```

### For UPDATE Operations - Confirm Changes

```
Task #123 updated:
- Status: pending -> completed
- Completed at: 2026-03-10 17:30:00
```

### For Empty Results

```
No pending tasks found.
```

### For Errors - Explain Clearly

```
Error: Unable to insert record.
Reason: Email 'john@example.com' already exists in the clients table.
Suggestion: Use a different email or update the existing client.
```

## Cron Job Integration

When running as a scheduled task, follow this workflow:

### 1. Check for New Tasks

```python
# At start of cron job
new_tasks = await check_new_tasks(last_client_id=last_processed_id)

if not new_tasks:
    await send_message("No new tasks found.")
    return
```

### 2. Process Tasks

```python
for task in new_tasks:
    # Mark as in_progress
    await update_record(
        table="tasks",
        id=task['id'],
        data={"status": "in_progress", "started_at": "NOW()"}
    )

    # Do the work...

    # Mark as completed
    await mark_task_completed(client_id=task['id'])
```

### 3. Report to User via WhatsApp

```python
await send_message(f"""
Task Report:
- Checked: {len(new_tasks)} new tasks
- Completed: {completed_count}
- Failed: {failed_count}

Details:
{task_summary}
""")
```

## Error Handling

### Connection Errors

```
Database connection failed.
Reason: Unable to reach Neon server.
Action: Will retry in 30 seconds. If issue persists, check:
- Internet connection
- Neon service status at status.neon.tech
- DATABASE_URL environment variable
```

### Query Errors

```
Query failed.
Reason: Column 'user_name' does not exist in table 'users'.
Available columns: id, name, email, created_at
Suggestion: Use 'name' instead of 'user_name'.
```

### Constraint Violations

```
Insert failed.
Reason: Duplicate key value violates unique constraint.
Field: email
Value: john@example.com
Suggestion: This email already exists. Update existing record or use different email.
```

## Table Schema Awareness

### Before Complex Queries - Check Structure

```python
# Get table columns
schema = await query_database("""
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'tasks'
    ORDER BY ordinal_position
""")
```

### Common Table Structures

**tasks table:**
```sql
id              SERIAL PRIMARY KEY
title           VARCHAR(255) NOT NULL
description     TEXT
status          VARCHAR(50) DEFAULT 'pending'
priority        VARCHAR(20) DEFAULT 'medium'
client_id       INTEGER REFERENCES clients(id)
created_at      TIMESTAMP DEFAULT NOW()
started_at      TIMESTAMP
completed_at    TIMESTAMP
```

**clients table:**
```sql
id              SERIAL PRIMARY KEY
name            VARCHAR(255) NOT NULL
email           VARCHAR(255) UNIQUE
phone           VARCHAR(50)
whatsapp_jid    VARCHAR(100)
created_at      TIMESTAMP DEFAULT NOW()
```

## SQL Query Reference

### SELECT Patterns

```sql
-- Basic select
SELECT * FROM tasks WHERE status = 'pending';

-- With pagination
SELECT * FROM tasks
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;

-- With joins
SELECT t.*, c.name as client_name
FROM tasks t
JOIN clients c ON t.client_id = c.id
WHERE t.status = 'pending';

-- Aggregations
SELECT status, COUNT(*) as count
FROM tasks
GROUP BY status;
```

### INSERT Patterns

```sql
-- Single record
INSERT INTO tasks (title, description, client_id)
VALUES ($1, $2, $3)
RETURNING id;

-- Multiple records
INSERT INTO tasks (title, client_id)
VALUES
    ('Task 1', 1),
    ('Task 2', 1),
    ('Task 3', 2);
```

### UPDATE Patterns

```sql
-- Single record
UPDATE tasks
SET status = 'completed', completed_at = NOW()
WHERE id = $1;

-- Multiple with condition
UPDATE tasks
SET status = 'overdue'
WHERE status = 'pending'
  AND created_at < NOW() - INTERVAL '7 days';
```

### DELETE Patterns (Require Confirmation!)

```sql
-- Single record
DELETE FROM tasks WHERE id = $1;

-- With condition
DELETE FROM tasks
WHERE status = 'completed'
  AND completed_at < NOW() - INTERVAL '30 days';
```

## WhatsApp Integration Patterns

### DM (Direct Message) Context

```python
# User sends: "Show my tasks"
tasks = await query_database("""
    SELECT * FROM tasks
    WHERE client_id = (
        SELECT id FROM clients WHERE whatsapp_jid = $1
    )
    AND status = 'pending'
""", user_jid)
```

### Group Context

```python
# Admin sends: "Show all pending tasks"
tasks = await query_database("""
    SELECT t.*, c.name as client_name
    FROM tasks t
    JOIN clients c ON t.client_id = c.id
    WHERE t.status = 'pending'
    ORDER BY t.priority DESC
""")
```

## Neon Connection Best Practices

### Use Pooled Connection String

```bash
# For serverless environments, use -pooler endpoint
postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require
```

### Connection Pool Settings

```python
pool = await asyncpg.create_pool(
    dsn=os.getenv("DATABASE_URL"),
    min_size=5,
    max_size=20,
    max_inactive_connection_lifetime=300.0,
    command_timeout=60
)
```

### Always Use SSL

```python
# Neon requires SSL
conn = await asyncpg.connect(
    os.getenv("DATABASE_URL")  # sslmode=require is in the URL
)
```

## Quick Command Reference

| User Request | Tool to Use |
|--------------|-------------|
| "Check new tasks" | `check_new_tasks` |
| "Mark task done" | `mark_task_completed` |
| "Show task #X" | `get_task_by_id` |
| "Add new client" | `insert_record` |
| "Update task status" | `update_record` |
| "Show pending tasks" | `query_database` with SELECT |
| "Count tasks by status" | `query_database` with GROUP BY |

---

## Related Skills

For features not covered in this skill, use the **context7-docs** skill to fetch official Neon or asyncpg documentation.
