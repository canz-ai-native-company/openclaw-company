# Prisma Schema Patterns

## Field Types

```prisma
model Example {
  // Primary keys
  id        Int      @id @default(autoincrement())
  uuid      String   @id @default(uuid())
  cuid      String   @id @default(cuid())

  // Strings
  name      String
  bio       String?              // Optional
  content   String   @db.Text    // Long text

  // Numbers
  age       Int
  price     Float
  amount    Decimal  @db.Decimal(10, 2)

  // Boolean
  active    Boolean  @default(true)

  // Dates
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?            // Soft delete

  // Enums
  role      Role     @default(USER)

  // JSON
  metadata  Json?

  // Unique
  email     String   @unique
  slug      String   @unique

  // Index
  @@index([name])
  @@unique([firstName, lastName])  // Composite unique
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

## Relations

### One-to-One

```prisma
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  profile Profile?
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId Int    @unique
}
```

### One-to-Many

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId Int
}
```

### Many-to-Many (Implicit)

```prisma
model Post {
  id         Int        @id @default(autoincrement())
  title      String
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}
```

### Many-to-Many (Explicit - with extra fields)

```prisma
model User {
  id          Int          @id @default(autoincrement())
  enrollments Enrollment[]
}

model Course {
  id          Int          @id @default(autoincrement())
  title       String
  enrollments Enrollment[]
}

model Enrollment {
  id         Int      @id @default(autoincrement())
  user       User     @relation(fields: [userId], references: [id])
  userId     Int
  course     Course   @relation(fields: [courseId], references: [id])
  courseId   Int
  enrolledAt DateTime @default(now())
  completedAt DateTime?
  progress   Int      @default(0)

  @@unique([userId, courseId])
}
```

### Self-Relation

```prisma
model User {
  id         Int     @id @default(autoincrement())
  name       String
  managerId  Int?
  manager    User?   @relation("Management", fields: [managerId], references: [id])
  reports    User[]  @relation("Management")
}
```

### Multiple Relations to Same Model

```prisma
model User {
  id            Int     @id @default(autoincrement())
  writtenPosts  Post[]  @relation("Author")
  editedPosts   Post[]  @relation("Editor")
}

model Post {
  id       Int   @id @default(autoincrement())
  author   User  @relation("Author", fields: [authorId], references: [id])
  authorId Int
  editor   User? @relation("Editor", fields: [editorId], references: [id])
  editorId Int?
}
```

## Referential Actions

```prisma
model Post {
  author   User @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId Int
}
```

Options:
- `Cascade` - Delete related records
- `SetNull` - Set foreign key to null (field must be optional)
- `Restrict` - Prevent deletion if related records exist
- `NoAction` - Similar to Restrict
- `SetDefault` - Set to default value

## Indexes

```prisma
model Post {
  id        Int    @id
  title     String
  content   String
  authorId  Int
  createdAt DateTime

  @@index([authorId])
  @@index([createdAt(sort: Desc)])
  @@index([title, content])  // Composite
  @@fulltext([title, content])  // Full-text (MySQL only)
}
```

## Mapping

```prisma
model User {
  id Int @id @map("user_id")

  @@map("users")  // Table name
}
```

## Composite Primary Keys

```prisma
model OrderItem {
  orderId   Int
  productId Int
  quantity  Int
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])

  @@id([orderId, productId])
}
```

## Soft Delete Pattern

```prisma
model Post {
  id        Int       @id @default(autoincrement())
  title     String
  deletedAt DateTime?

  @@index([deletedAt])
}
```

Query non-deleted:
```typescript
const posts = await prisma.post.findMany({
  where: { deletedAt: null }
})
```

## Timestamps Pattern

```prisma
model BaseModel {
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Multi-Tenancy Pattern

```prisma
model Tenant {
  id    String @id @default(cuid())
  name  String
  users User[]
  posts Post[]
}

model User {
  id       Int    @id @default(autoincrement())
  tenant   Tenant @relation(fields: [tenantId], references: [id])
  tenantId String

  @@index([tenantId])
}

model Post {
  id       Int    @id @default(autoincrement())
  tenant   Tenant @relation(fields: [tenantId], references: [id])
  tenantId String

  @@index([tenantId])
}
```
