---
name: context7-docs
description: Fetch official documentation via Context7 MCP when existing skills lack coverage for features, APIs, or patterns
---

# Context7 Documentation Fetcher

Use this skill to fetch official, up-to-date documentation when existing skills don't cover the feature you need. This prevents errors from outdated training data and ensures you're using current API patterns.

## When to Use This Skill

**ALWAYS use Context7 when:**
- A skill doesn't cover a specific feature (e.g., custom ChatKit theme colors)
- Working with new SDK features not in your training data
- Unfamiliar API patterns or configuration options
- User asks for something you're uncertain about
- Documentation mentions features you haven't seen before

**NEVER:**
- Guess or use potentially outdated training data for unknown patterns
- Write code for unfamiliar APIs without checking docs first
- Assume you know the current API based on old knowledge

## How Context7 Works

Context7 is a two-step process:

### Step 1: Resolve Library ID

First, get the Context7-compatible library ID:

```
mcp__context7__resolve-library-id
  libraryName: "openai agents sdk"
  query: "how to create custom tools"
```

This returns the library ID like `/openai/openai-agents-python`.

### Step 2: Query Documentation

Then fetch the specific documentation:

```
mcp__context7__query-docs
  libraryId: "/openai/openai-agents-python"
  query: "how to create custom tools with function calling"
```

This returns relevant documentation snippets and code examples.

## Common Library IDs

Use these pre-resolved IDs to skip Step 1 when working with common libraries:

| Library | Context7 ID |
|---------|-------------|
| OpenAI Agents SDK | `/openai/openai-agents-python` |
| ChatKit Python | `/websites/openai_github_io_chatkit-python` |
| FastAPI | `/tiangolo/fastapi` |
| Next.js | `/vercel/next.js` |
| Tailwind CSS | `/tailwindlabs/tailwindcss` |
| React | `/facebook/react` |
| Prisma | `/prisma/docs` |
| Motion (Framer Motion) | `/websites/motion_dev` |
| GSAP | `/llmstxt/gsap_llms_txt` |
| TypeScript | `/microsoft/typescript` |
| Zod | `/colinhacks/zod` |

## Usage Examples

### Example 1: Custom ChatKit Theme Colors

User asks: "I want to customize the ChatKit widget colors"

**Your workflow:**
1. Check chatkit skill - doesn't cover custom theming
2. Use Context7:

```
mcp__context7__query-docs
  libraryId: "/websites/openai_github_io_chatkit-python"
  query: "customize theme colors styling CSS"
```

3. Read the returned docs
4. Write code based on official documentation

### Example 2: New OpenAI Agents SDK Feature

User asks: "How do I use the new streaming events in Agents SDK?"

**Your workflow:**
1. This might be a new feature not in training data
2. Use Context7:

```
mcp__context7__query-docs
  libraryId: "/openai/openai-agents-python"
  query: "streaming events real-time agent responses"
```

3. Implement based on current official docs

### Example 3: Unknown FastAPI Pattern

User asks: "How do I set up WebSocket with FastAPI dependency injection?"

**Your workflow:**
1. Uncertain about exact current pattern
2. Use Context7:

```
mcp__context7__query-docs
  libraryId: "/tiangolo/fastapi"
  query: "WebSocket dependency injection example"
```

3. Follow the official pattern from docs

### Example 4: Discovering a New Library

User asks: "Use the Instructor library for structured outputs"

**Your workflow:**
1. First resolve the library ID:

```
mcp__context7__resolve-library-id
  libraryName: "instructor"
  query: "structured outputs pydantic validation"
```

2. Then query docs with returned ID:

```
mcp__context7__query-docs
  libraryId: "/jxnl/instructor"
  query: "structured outputs pydantic models examples"
```

## Best Practices

### 1. Query First, Code Later
```
WRONG: Write code based on memory -> User gets errors -> Debug

RIGHT: Query Context7 -> Read current docs -> Write correct code
```

### 2. Be Specific in Queries
```
VAGUE: "authentication"
BETTER: "JWT authentication with refresh tokens FastAPI"
```

### 3. Check for Breaking Changes
When working with libraries that update frequently (Next.js, React, etc.), always verify the current API:

```
mcp__context7__query-docs
  libraryId: "/vercel/next.js"
  query: "app router server actions form handling 2024"
```

### 4. Combine Multiple Queries
For complex features, make multiple targeted queries:

```
# First query: Basic setup
mcp__context7__query-docs
  libraryId: "/tiangolo/fastapi"
  query: "WebSocket basic setup endpoint"

# Second query: Advanced patterns
mcp__context7__query-docs
  libraryId: "/tiangolo/fastapi"
  query: "WebSocket authentication middleware"
```

## Integration with Other Skills

This skill complements all other skills. When a skill doesn't cover something:

1. **chatkit-server** - Use Context7 for ChatKit Python features not covered
2. **nextjs-prisma** - Use Context7 for new Prisma or Next.js features
3. **nextjs-animations** - Use Context7 for new Motion/GSAP APIs

## Error Handling

If Context7 returns no results:
1. Try a different query phrasing
2. Check if the library ID is correct using `resolve-library-id`
3. The library may not be indexed - inform the user

If Context7 returns partial results:
1. Make follow-up queries for specific details
2. Combine information from multiple queries
