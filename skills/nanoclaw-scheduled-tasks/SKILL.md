---
name: nanoclaw-scheduled-tasks
description: Correctly calculate time and schedule tasks in NanoClaw. Use when user asks to schedule tasks, set reminders, or automate recurring actions. Covers cron, interval, and one-time schedules.
---

# NanoClaw Scheduled Tasks & Time Calculation

This skill ensures AI Employee correctly calculates time for scheduled tasks. **ALWAYS get current time before calculating future time.**

## CRITICAL: Time Calculation Rules

### Step 1: ALWAYS Get Current Time First

**Before scheduling ANY "once" task, you MUST run:**

```bash
date "+%Y-%m-%dT%H:%M:%S"
```

This gives you the current LOCAL time. Use this as your reference point.

### Step 2: Calculate Future Time

Based on current time from Step 1, calculate the target time:

| User Request | Calculation |
|--------------|-------------|
| "5 minute baad" | Current time + 5 minutes |
| "1 ghante baad" | Current time + 1 hour |
| "kal subah 9 baje" | Tomorrow's date + 09:00:00 |
| "aaj raat 10 baje" | Today's date + 22:00:00 |
| "parson 5pm" | Day after tomorrow + 17:00:00 |

### Step 3: Format the Time Correctly

**For "once" tasks - Use LOCAL time WITHOUT "Z" suffix:**

```
CORRECT: "2026-03-10T15:30:00"
WRONG:   "2026-03-10T15:30:00Z"  (Z means UTC!)
```

## FORBIDDEN Actions

```
NEVER guess current time - ALWAYS run `date` command first
NEVER use "Z" suffix for once tasks (it converts to UTC)
NEVER schedule a time in the past
NEVER assume timezone - use local time from system
```

## Schedule Types

### 1. Cron (Recurring - Complex Schedules)

Standard 5-field cron expression: `minute hour day month weekday`

```
Field:    minute  hour  day  month  weekday
Range:    0-59    0-23  1-31 1-12   0-6 (Sun=0)
```

**Common Cron Examples:**

| Schedule | Cron Expression | Description |
|----------|-----------------|-------------|
| Daily 9am | `0 9 * * *` | Every day at 9:00 AM |
| Daily 5pm | `0 17 * * *` | Every day at 5:00 PM |
| Monday 9am | `0 9 * * 1` | Every Monday at 9:00 AM |
| Weekdays 9am | `0 9 * * 1-5` | Mon-Fri at 9:00 AM |
| Every 5 minutes | `*/5 * * * *` | Every 5 minutes |
| Every 30 minutes | `*/30 * * * *` | Every 30 minutes |
| Hourly | `0 * * * *` | Every hour at :00 |
| 1st of month 9am | `0 9 1 * *` | First day of month at 9:00 AM |

**Usage:**
```json
{
  "prompt": "Check emails and summarize important ones",
  "schedule_type": "cron",
  "schedule_value": "0 9 * * 1-5",
  "context_mode": "group"
}
```

### 2. Interval (Recurring - Fixed Duration)

Duration in **milliseconds**.

**Common Intervals:**

| Duration | Milliseconds | Description |
|----------|--------------|-------------|
| 1 minute | `60000` | 60 * 1000 |
| 5 minutes | `300000` | 5 * 60 * 1000 |
| 15 minutes | `900000` | 15 * 60 * 1000 |
| 30 minutes | `1800000` | 30 * 60 * 1000 |
| 1 hour | `3600000` | 60 * 60 * 1000 |
| 2 hours | `7200000` | 2 * 60 * 60 * 1000 |
| 6 hours | `21600000` | 6 * 60 * 60 * 1000 |
| 12 hours | `43200000` | 12 * 60 * 60 * 1000 |
| 24 hours | `86400000` | 24 * 60 * 60 * 1000 |

**Usage:**
```json
{
  "prompt": "Check server health and report issues",
  "schedule_type": "interval",
  "schedule_value": "3600000",
  "context_mode": "isolated"
}
```

### 3. Once (One-Time Execution)

ISO timestamp in LOCAL time (NO "Z" suffix).

**WORKFLOW for "once" tasks:**

```
1. Run: date "+%Y-%m-%dT%H:%M:%S"
   Output: 2026-03-10T14:25:30

2. User says: "5 minute baad reminder"

3. Calculate: 14:25 + 5 minutes = 14:30

4. Schedule with: "2026-03-10T14:30:00"
```

**Usage:**
```json
{
  "prompt": "Remind user about the meeting",
  "schedule_type": "once",
  "schedule_value": "2026-03-10T14:30:00",
  "context_mode": "group"
}
```

## Context Modes

| Mode | Description | Use When |
|------|-------------|----------|
| `group` | Task runs with chat history and memory | Needs conversation context, follow-ups |
| `isolated` | Fresh session, no history | Independent tasks, system checks |

**Examples:**

```json
// Group context - needs chat history
{
  "prompt": "Follow up on the project discussion from earlier",
  "schedule_type": "once",
  "schedule_value": "2026-03-10T17:00:00",
  "context_mode": "group"
}

// Isolated context - independent task
{
  "prompt": "Check if backup completed successfully",
  "schedule_type": "cron",
  "schedule_value": "0 6 * * *",
  "context_mode": "isolated"
}
```

## Complete Examples

### Example 1: "5 minute baad yaad dila dena"

```bash
# Step 1: Get current time
date "+%Y-%m-%dT%H:%M:%S"
# Output: 2026-03-10T14:25:30

# Step 2: Calculate (14:25 + 5 min = 14:30)
# Step 3: Schedule
```

```json
{
  "prompt": "Remind the user about what they asked",
  "schedule_type": "once",
  "schedule_value": "2026-03-10T14:30:00",
  "context_mode": "group"
}
```

### Example 2: "Har ghante server check karo"

```json
{
  "prompt": "Check server status and report any issues",
  "schedule_type": "interval",
  "schedule_value": "3600000",
  "context_mode": "isolated"
}
```

### Example 3: "Kal subah 9 baje meeting reminder"

```bash
# Step 1: Get current date
date "+%Y-%m-%d"
# Output: 2026-03-10

# Step 2: Calculate tomorrow = 2026-03-11
# Step 3: Add 9am = 09:00:00
```

```json
{
  "prompt": "Remind about the morning meeting",
  "schedule_type": "once",
  "schedule_value": "2026-03-11T09:00:00",
  "context_mode": "group"
}
```

### Example 4: "Weekdays 5pm par daily summary"

```json
{
  "prompt": "Generate and send daily summary of completed tasks",
  "schedule_type": "cron",
  "schedule_value": "0 17 * * 1-5",
  "context_mode": "group"
}
```

### Example 5: "Har 15 minute check karo website up hai ya nahi"

```json
{
  "prompt": "Check if website is responding and alert if down",
  "schedule_type": "interval",
  "schedule_value": "900000",
  "context_mode": "isolated"
}
```

## Task Management Tools

| Tool | Description |
|------|-------------|
| `schedule_task` | Create new scheduled task |
| `list_tasks` | View all scheduled tasks |
| `pause_task` | Temporarily pause a task |
| `resume_task` | Resume a paused task |
| `cancel_task` | Delete a task |

## schedule_task Parameters

```typescript
{
  prompt: string,                              // What the agent should do
  schedule_type: "cron" | "interval" | "once", // Schedule type
  schedule_value: string,                      // Cron expr, ms, or timestamp
  context_mode: "group" | "isolated",          // Optional, default: "group"
  target_group_jid: string                     // Optional, for main group only
}
```

## Time Calculation Quick Reference

### Adding Time

| Add | Formula |
|-----|---------|
| X minutes | Add X to minute, handle hour overflow |
| X hours | Add X to hour, handle day overflow |
| X days | Add X to day |

### Common Time Calculations

```
Current: 2026-03-10T14:45:00

+ 5 min  = 2026-03-10T14:50:00
+ 30 min = 2026-03-10T15:15:00
+ 1 hour = 2026-03-10T15:45:00
+ 2 hour = 2026-03-10T16:45:00
+ 1 day  = 2026-03-11T14:45:00

"aaj raat 10 baje" = 2026-03-10T22:00:00
"kal subah 8 baje" = 2026-03-11T08:00:00
"parson 3pm"       = 2026-03-12T15:00:00
```

## Validation Checklist

Before scheduling, verify:

- [ ] Did I run `date` command to get current time?
- [ ] Is the calculated time in the FUTURE?
- [ ] For "once": Is the timestamp WITHOUT "Z" suffix?
- [ ] For "cron": Is the expression valid (5 fields)?
- [ ] For "interval": Is the value in milliseconds?
- [ ] Is context_mode appropriate for the task?

## Troubleshooting

### Task Runs at Wrong Time

**Cause:** Used "Z" suffix which converts to UTC.

**Fix:** Remove "Z" suffix from timestamp.

```
WRONG: "2026-03-10T15:00:00Z"
RIGHT: "2026-03-10T15:00:00"
```

### Task Never Runs

**Cause:** Scheduled time is in the past.

**Fix:** Always run `date` first and calculate from current time.

### Cron Not Working

**Cause:** Invalid cron expression.

**Fix:** Verify 5-field format: `minute hour day month weekday`

---

## Related Skills

For features not covered in this skill, use the **context7-docs** skill to fetch official NanoClaw documentation.
