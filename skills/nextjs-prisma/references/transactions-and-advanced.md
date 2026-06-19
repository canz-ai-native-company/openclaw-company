# Transactions and Advanced Patterns

## Transactions

### Sequential Transactions

```typescript
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: { email: "alice@prisma.io" } }),
  prisma.post.create({ data: { title: "Hello", authorId: 1 } }),
])
```

### Interactive Transactions

```typescript
const transfer = await prisma.$transaction(async (tx) => {
  // Deduct from sender
  const sender = await tx.account.update({
    where: { id: senderId },
    data: { balance: { decrement: amount } },
  })

  // Validate
  if (sender.balance < 0) {
    throw new Error("Insufficient funds")
  }

  // Add to recipient
  const recipient = await tx.account.update({
    where: { id: recipientId },
    data: { balance: { increment: amount } },
  })

  return { sender, recipient }
})
```

### Transaction Options

```typescript
await prisma.$transaction(
  async (tx) => {
    // Operations...
  },
  {
    maxWait: 5000,      // Max wait to acquire connection (ms)
    timeout: 10000,     // Max transaction duration (ms)
    isolationLevel: "Serializable",
  }
)
```

### Retry on Conflict

```typescript
async function transferWithRetry(senderId: number, recipientId: number, amount: number) {
  const MAX_RETRIES = 3
  let retries = 0

  while (retries < MAX_RETRIES) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Transaction logic...
      }, {
        isolationLevel: "Serializable",
      })
    } catch (error: any) {
      if (error.code === "P2034") {
        retries++
        continue
      }
      throw error
    }
  }
  throw new Error("Transaction failed after retries")
}
```

## Database Seeding

### seed.ts

```typescript
// prisma/seed.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const alice = await prisma.user.create({
    data: {
      email: "alice@prisma.io",
      name: "Alice",
      posts: {
        create: [
          { title: "Hello World", published: true },
          { title: "Draft Post", published: false },
        ],
      },
    },
  })

  const bob = await prisma.user.create({
    data: {
      email: "bob@prisma.io",
      name: "Bob",
    },
  })

  console.log({ alice, bob })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### package.json

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### Run Seed

```bash
npx prisma db seed
```

## Raw Queries

### Raw SQL

```typescript
const users = await prisma.$queryRaw`
  SELECT * FROM "User" WHERE email LIKE ${`%prisma%`}
`
```

### Raw Execute

```typescript
await prisma.$executeRaw`
  UPDATE "User" SET "active" = true WHERE "createdAt" < ${date}
`
```

### Typed Raw Queries

```typescript
const result = await prisma.$queryRaw<{ count: bigint }[]>`
  SELECT COUNT(*) as count FROM "User"
`
```

## Middleware

```typescript
const prisma = new PrismaClient()

// Logging
prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()
  console.log(`${params.model}.${params.action} took ${after - before}ms`)
  return result
})

// Soft Delete
prisma.$use(async (params, next) => {
  if (params.model === "Post") {
    if (params.action === "delete") {
      params.action = "update"
      params.args.data = { deletedAt: new Date() }
    }
    if (params.action === "deleteMany") {
      params.action = "updateMany"
      params.args.data = { deletedAt: new Date() }
    }
  }
  return next(params)
})
```

## Client Extensions

### Computed Fields

```typescript
const prisma = new PrismaClient().$extends({
  result: {
    user: {
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(user) {
          return `${user.firstName} ${user.lastName}`
        },
      },
    },
  },
})

const user = await prisma.user.findFirst()
console.log(user?.fullName)  // "John Doe"
```

### Custom Methods

```typescript
const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } })
      },
      async softDelete(id: number) {
        return prisma.user.update({
          where: { id },
          data: { deletedAt: new Date() },
        })
      },
    },
  },
})

const user = await prisma.user.findByEmail("alice@prisma.io")
```

## Optimistic Locking

```prisma
model Post {
  id      Int @id @default(autoincrement())
  title   String
  version Int @default(0)
}
```

```typescript
async function updatePost(id: number, title: string, expectedVersion: number) {
  const updated = await prisma.post.updateMany({
    where: {
      id,
      version: expectedVersion,
    },
    data: {
      title,
      version: { increment: 1 },
    },
  })

  if (updated.count === 0) {
    throw new Error("Concurrent modification detected")
  }
}
```

## Batch Operations

### Create Many

```typescript
await prisma.user.createMany({
  data: users,
  skipDuplicates: true,
})
```

### Update Many

```typescript
await prisma.post.updateMany({
  where: { authorId: 1 },
  data: { published: true },
})
```

### Delete Many

```typescript
await prisma.post.deleteMany({
  where: {
    createdAt: { lt: new Date("2020-01-01") },
  },
})
```

## Query Optimization

### Select Only Needed Fields

```typescript
// Instead of fetching all fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    // Only what you need
  },
})
```

### Avoid N+1

```typescript
// Bad: N+1 queries
const users = await prisma.user.findMany()
for (const user of users) {
  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
  })
}

// Good: Single query with include
const users = await prisma.user.findMany({
  include: { posts: true },
})
```

### Use Indexes

```prisma
model Post {
  id       Int    @id
  authorId Int
  title    String

  @@index([authorId])
  @@index([title])
}
```

### Cursor Pagination for Large Datasets

```typescript
// More efficient than skip/take for large offsets
const posts = await prisma.post.findMany({
  take: 10,
  skip: 1,
  cursor: { id: lastPostId },
  orderBy: { id: "asc" },
})
```

## Connection Management

### Explicit Disconnect

```typescript
const prisma = new PrismaClient()

try {
  // Operations...
} finally {
  await prisma.$disconnect()
}
```

### Connection Pool Settings

```env
DATABASE_URL="postgresql://...?connection_limit=5&pool_timeout=10"
```

### Health Check

```typescript
export async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}
```
