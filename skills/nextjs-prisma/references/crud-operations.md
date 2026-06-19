# CRUD Operations

## Create

### Single Record

```typescript
const user = await prisma.user.create({
  data: {
    email: "alice@prisma.io",
    name: "Alice",
  },
})
```

### With Relations

```typescript
const user = await prisma.user.create({
  data: {
    email: "alice@prisma.io",
    posts: {
      create: [
        { title: "Post 1" },
        { title: "Post 2" },
      ],
    },
  },
  include: {
    posts: true,
  },
})
```

### Connect Existing

```typescript
const post = await prisma.post.create({
  data: {
    title: "My Post",
    author: {
      connect: { id: 1 },
    },
  },
})
```

### Create Many

```typescript
const count = await prisma.user.createMany({
  data: [
    { email: "alice@prisma.io" },
    { email: "bob@prisma.io" },
  ],
  skipDuplicates: true,
})
```

### Create Many and Return

```typescript
const users = await prisma.user.createManyAndReturn({
  data: [
    { email: "alice@prisma.io" },
    { email: "bob@prisma.io" },
  ],
})
```

## Read

### Find Unique

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
})

const user = await prisma.user.findUnique({
  where: { email: "alice@prisma.io" },
})
```

### Find First

```typescript
const user = await prisma.user.findFirst({
  where: { role: "ADMIN" },
})
```

### Find Many

```typescript
const users = await prisma.user.findMany()

const users = await prisma.user.findMany({
  where: {
    email: { endsWith: "@prisma.io" },
  },
})
```

### Find or Throw

```typescript
const user = await prisma.user.findUniqueOrThrow({
  where: { id: 1 },
})

const user = await prisma.user.findFirstOrThrow({
  where: { role: "ADMIN" },
})
```

## Update

### Single Record

```typescript
const user = await prisma.user.update({
  where: { id: 1 },
  data: { name: "Alice Updated" },
})
```

### Increment/Decrement

```typescript
const user = await prisma.user.update({
  where: { id: 1 },
  data: {
    views: { increment: 1 },
    balance: { decrement: 100 },
  },
})
```

### Update Relations

```typescript
const user = await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      create: { title: "New Post" },
      connect: { id: 5 },
      disconnect: { id: 3 },
      delete: { id: 2 },
    },
  },
})
```

### Update Many

```typescript
const count = await prisma.user.updateMany({
  where: { role: "USER" },
  data: { active: true },
})
```

### Upsert

```typescript
const user = await prisma.user.upsert({
  where: { email: "alice@prisma.io" },
  update: { name: "Alice Updated" },
  create: {
    email: "alice@prisma.io",
    name: "Alice",
  },
})
```

## Delete

### Single Record

```typescript
const user = await prisma.user.delete({
  where: { id: 1 },
})
```

### Delete Many

```typescript
const count = await prisma.user.deleteMany({
  where: { active: false },
})

// Delete all
await prisma.user.deleteMany()
```

## Filtering

### Comparison

```typescript
where: {
  age: { equals: 25 },
  age: { not: 25 },
  age: { gt: 18 },      // Greater than
  age: { gte: 18 },     // Greater than or equal
  age: { lt: 65 },      // Less than
  age: { lte: 65 },     // Less than or equal
}
```

### String Filters

```typescript
where: {
  email: { contains: "prisma" },
  email: { startsWith: "alice" },
  email: { endsWith: "@prisma.io" },
  name: { mode: "insensitive" },  // Case-insensitive
}
```

### Lists

```typescript
where: {
  id: { in: [1, 2, 3] },
  id: { notIn: [4, 5, 6] },
}
```

### Null

```typescript
where: {
  deletedAt: null,
  deletedAt: { not: null },
}
```

### AND/OR/NOT

```typescript
where: {
  AND: [
    { email: { contains: "prisma" } },
    { role: "ADMIN" },
  ],
}

where: {
  OR: [
    { email: { contains: "prisma" } },
    { name: { contains: "Alice" } },
  ],
}

where: {
  NOT: { role: "ADMIN" },
}
```

### Relation Filters

```typescript
// Posts with at least one comment
where: {
  comments: { some: { approved: true } },
}

// Posts with all comments approved
where: {
  comments: { every: { approved: true } },
}

// Posts with no comments
where: {
  comments: { none: {} },
}

// Filter by related record
where: {
  author: { email: { contains: "prisma" } },
}
```

## Sorting

```typescript
const users = await prisma.user.findMany({
  orderBy: { createdAt: "desc" },
})

const users = await prisma.user.findMany({
  orderBy: [
    { role: "asc" },
    { name: "asc" },
  ],
})

// Sort by relation count
const users = await prisma.user.findMany({
  orderBy: {
    posts: { _count: "desc" },
  },
})
```

## Pagination

### Offset-Based

```typescript
const users = await prisma.user.findMany({
  skip: 10,
  take: 10,
})
```

### Cursor-Based

```typescript
const users = await prisma.user.findMany({
  take: 10,
  skip: 1,  // Skip the cursor
  cursor: { id: lastUserId },
  orderBy: { id: "asc" },
})
```

## Select & Include

### Select Specific Fields

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    email: true,
    name: true,
  },
})
```

### Include Relations

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true,
    profile: true,
  },
})
```

### Nested Select

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    email: true,
    posts: {
      select: { title: true },
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    },
  },
})
```

### Include with Filters

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: "desc" },
    },
  },
})
```

## Aggregations

### Count

```typescript
const count = await prisma.user.count()

const count = await prisma.user.count({
  where: { active: true },
})
```

### Aggregate

```typescript
const result = await prisma.product.aggregate({
  _avg: { price: true },
  _sum: { quantity: true },
  _min: { price: true },
  _max: { price: true },
  _count: true,
})
```

### Group By

```typescript
const grouped = await prisma.user.groupBy({
  by: ["role"],
  _count: { id: true },
  _avg: { age: true },
})
```
