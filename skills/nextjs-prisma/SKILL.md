---
name: nextjs-prisma
description: Type-safe database integration for Next.js with Prisma ORM including schemas, CRUD operations, Server Actions, and production patterns
---

# Next.js Prisma Database Integration

A comprehensive skill for adding type-safe database functionality to Next.js applications using Prisma ORM. Covers hello world to production-level patterns with connection pooling, query optimization, and proper error handling.

## When to Use This Skill

Use this skill when working on:
- Setting up Prisma in a Next.js project
- Designing database schemas and relations
- Implementing CRUD operations with Server Actions or API routes
- Building pagination, filtering, and search functionality
- Working with transactions and complex queries
- Creating seeding scripts for development/testing

## Quick Start

### 1. Installation

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

### 2. Configure Database Connection

```env
# .env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### 3. Create Prisma Client Singleton

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Why singleton?** Next.js hot reloading creates new PrismaClient instances, exhausting database connections. The singleton pattern reuses the same instance.

### 4. Define Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 5. Run Migration

```bash
npx prisma migrate dev --name init
```

## Core Patterns

### Server Actions (Recommended for App Router)

```typescript
// app/actions/user.ts
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
})

export async function createUser(formData: FormData) {
  const rawData = {
    email: formData.get("email"),
    name: formData.get("name"),
  }

  const result = CreateUserSchema.safeParse(rawData)

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  try {
    await prisma.user.create({
      data: result.data,
    })
    revalidatePath("/users")
    return { success: true }
  } catch (error) {
    return { error: { _form: ["Failed to create user"] } }
  }
}
```

### Server Components with Data Fetching

```typescript
// app/users/page.tsx
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { posts: { where: { published: true } } },
  })

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <Link href={`/users/${user.id}`}>{user.name}</Link>
          <span>{user.posts.length} posts</span>
        </li>
      ))}
    </ul>
  )
}
```

### API Routes

```typescript
// app/api/users/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")

  const users = await prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
  })

  return NextResponse.json(users)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const user = await prisma.user.create({
      data: { email: body.email, name: body.name },
    })
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}
```

## Schema Templates

The skill includes complete schema templates for common patterns:

### User Management (`assets/user-management-schema.prisma`)
- Authentication (NextAuth.js compatible)
- User profiles with preferences
- Sessions and verification tokens
- Password reset flow
- Multi-role support (USER, ADMIN, MODERATOR)

### Content CMS (`assets/cms-schema.prisma`)
- Posts with drafts, publishing, scheduling
- Hierarchical categories and tags
- Media library management
- Nested comments with moderation
- Content revisions/history

### Booking System (`assets/booking-schema.prisma`)
- Services with duration and pricing
- Resource management (staff, rooms, equipment)
- Availability schedules
- Booking with confirmation workflow
- Payment integration
- Reminders system

### E-Commerce (`assets/ecommerce-schema.prisma`)
- Products with variants and images
- Category hierarchy
- Shopping cart (user + guest)
- Complete order workflow
- Payments and refunds
- Shipping/fulfillment tracking
- Reviews and wishlists

## Essential Commands

```bash
# Development
npx prisma migrate dev --name <name>  # Create and apply migration
npx prisma db push                     # Push schema without migration
npx prisma studio                      # Visual database browser
npx prisma generate                    # Regenerate client

# Production
npx prisma migrate deploy              # Apply pending migrations

# Utilities
npx prisma db seed                     # Run seed script
npx prisma migrate reset               # Reset database (drops all data!)
```

## References

Detailed documentation available in `references/`:

- **setup-and-config.md** - Installation, connection strings, singleton pattern
- **schema-patterns.md** - Field types, relations, indexes, common patterns
- **crud-operations.md** - Create, read, update, delete with filtering
- **nextjs-patterns.md** - Server Actions, Server Components, API routes
- **transactions-and-advanced.md** - Transactions, seeding, middleware, extensions

## Best Practices

### Query Optimization
```typescript
// Select only needed fields
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true },
})

// Avoid N+1 with include
const usersWithPosts = await prisma.user.findMany({
  include: { posts: true },
})

// Use cursor pagination for large datasets
const posts = await prisma.post.findMany({
  take: 10,
  skip: 1,
  cursor: { id: lastPostId },
  orderBy: { id: "asc" },
})
```

### Error Handling
```typescript
import { Prisma } from "@prisma/client"

try {
  await prisma.user.create({ data })
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new Error("Email already exists")
    }
    if (error.code === "P2025") {
      throw new Error("Record not found")
    }
  }
  throw error
}
```

### Transactions
```typescript
const transfer = await prisma.$transaction(async (tx) => {
  const sender = await tx.account.update({
    where: { id: senderId },
    data: { balance: { decrement: amount } },
  })

  if (sender.balance < 0) {
    throw new Error("Insufficient funds")
  }

  const recipient = await tx.account.update({
    where: { id: recipientId },
    data: { balance: { increment: amount } },
  })

  return { sender, recipient }
})
```

## Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| P2002 | Unique constraint violation | Check for duplicate values |
| P2003 | Foreign key constraint violation | Ensure referenced record exists |
| P2025 | Record not found | Check if record exists before update/delete |
| P2014 | Required relation violation | Include required related records |
| P2034 | Transaction conflict | Implement retry logic |

## Package.json Scripts

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "prisma db seed",
    "postinstall": "prisma generate"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```
