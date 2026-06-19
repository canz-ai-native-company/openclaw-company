# Context7 MCP Integration Guide

How to use Context7 MCP server for documentation lookup during the Design Thinking Protocol.

---

## When to Use Context7

| Situation | Action |
|-----------|--------|
| Unfamiliar technology in stack | Query docs immediately |
| Version-specific API patterns | Check latest docs |
| Framework configuration | Get current config syntax |
| Integration patterns | Look up official examples |
| Migration between versions | Check breaking changes |

---

## Two-Step Process

### Step 1: Resolve Library ID

```
mcp__context7__resolve-library-id("nextjs")
→ Returns: /vercel/next.js
```

### Step 2: Query Documentation

```
mcp__context7__query-docs("/vercel/next.js", "app router API routes")
→ Returns: Relevant documentation
```

---

## Common Library IDs

| Technology | Search Term | Typical ID |
|------------|-------------|------------|
| Next.js | `nextjs` | /vercel/next.js |
| React | `react` | /facebook/react |
| Prisma | `prisma` | /prisma/prisma |
| Tailwind CSS | `tailwindcss` | /tailwindlabs/tailwindcss |
| Express | `express` | /expressjs/express |
| FastAPI | `fastapi` | /tiangolo/fastapi |
| OpenAI SDK | `openai python` | /openai/openai-python |
| Anthropic SDK | `anthropic sdk` | /anthropic/anthropic-sdk-python |
| Drizzle ORM | `drizzle orm` | /drizzle-team/drizzle-orm |
| Zod | `zod` | /colinhacks/zod |
| NextAuth | `next-auth` | /nextauthjs/next-auth |
| Stripe | `stripe node` | /stripe/stripe-node |

**Note**: Always resolve first — IDs may change.

---

## Query Patterns for Design Protocol

### Step 3: MCP Server Planning

Query for ALL technologies in the decided stack:

```
# For each technology:
1. resolve_library("technology name")
2. query_docs(library_id, "getting started setup configuration")
3. query_docs(library_id, "best practices patterns")
```

### Step 4: Architecture Design

```
query_docs(library_id, "architecture patterns project structure")
query_docs(library_id, "middleware routing")
```

### Step 5: Database Schema

```
query_docs(orm_id, "schema definition models relationships")
query_docs(orm_id, "migrations")
```

### Step 6: API Contract

```
query_docs(framework_id, "API routes handlers")
query_docs(framework_id, "middleware authentication")
query_docs(framework_id, "error handling")
```

### Step 8: Testing

```
query_docs(framework_id, "testing")
query_docs(test_lib_id, "setup configuration mocking")
```

---

## Best Practices

### Do

- Query BEFORE making technology decisions
- Query for specific features, not general overviews
- Cache results mentally — don't re-query same topic
- Use results to validate your design decisions

### Don't

- Skip querying because you "know" the library
- Query for basic concepts (you already know those)
- Query without a specific question in mind
- Ignore results that contradict your assumptions

---

## Handling Missing Libraries

If `resolve_library` returns no results:

1. Try alternative names (e.g., "next auth" vs "nextauth")
2. Try the GitHub org/repo format
3. If still not found: use WebSearch for official docs
4. Document which libraries couldn't be queried

---

## Integration with Design Document

In the MCP Server Map section, document all queries:

```markdown
## 8. MCP Server Map

| Server | Phase | Task | Query/Action |
|--------|-------|------|--------------|
| context7 | Phase 1 | Next.js app router docs | resolve→query "app router API" |
| context7 | Phase 1 | Prisma schema patterns | resolve→query "schema models" |
| context7 | Phase 4 | Auth.js setup | resolve→query "configuration providers" |
```
