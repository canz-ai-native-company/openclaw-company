# Prisma Setup and Configuration

## Installation

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Schema definition
- `.env` - Environment variables with DATABASE_URL

## Database Connection Strings

### PostgreSQL

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

Examples:
```env
# Local
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"

# Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# Neon
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST].neon.tech/[DATABASE]?sslmode=require"

# Railway
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST].railway.app:5432/railway"
```

### SQLite

```env
DATABASE_URL="file:./dev.db"
```

## Schema Configuration

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
  output   = "../app/generated/prisma"  // Optional custom output
}

datasource db {
  provider = "postgresql"  // or "sqlite", "mysql", "mongodb"
  url      = env("DATABASE_URL")
}
```

## Prisma Client Singleton (Next.js)

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Why singleton?** Next.js hot reloading creates new PrismaClient instances on each reload, exhausting database connections. The singleton pattern reuses the same instance.

## Migrations

### Development

```bash
# Create and apply migration
npx prisma migrate dev --name init

# Create migration without applying
npx prisma migrate dev --create-only

# Reset database (drops all data)
npx prisma migrate reset
```

### Production

```bash
# Apply pending migrations
npx prisma migrate deploy
```

### Push (No Migration History)

```bash
# Push schema changes directly (prototyping only)
npx prisma db push
```

## Generate Client

```bash
# Regenerate Prisma Client after schema changes
npx prisma generate
```

## Prisma Studio

```bash
# Open visual database browser
npx prisma studio
```

## Environment-Specific Databases

```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // For migrations with connection pooler
}
```

```env
# .env
DATABASE_URL="postgresql://...?pgbouncer=true"  # Pooled connection
DIRECT_URL="postgresql://..."                    # Direct connection for migrations
```

## Connection Pooling (Serverless)

### Using Prisma Accelerate

```typescript
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())
```

### Using pg Adapter

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
})

export const prisma = new PrismaClient({ adapter })
```

## TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true
  }
}
```

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
