# Next.js Integration Patterns

## Server Actions

### Create Action

```typescript
// app/actions/user.ts
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createUser(formData: FormData) {
  const email = formData.get("email") as string
  const name = formData.get("name") as string

  await prisma.user.create({
    data: { email, name },
  })

  revalidatePath("/users")
}
```

### Update Action

```typescript
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateUser(id: number, formData: FormData) {
  const name = formData.get("name") as string

  await prisma.user.update({
    where: { id },
    data: { name },
  })

  revalidatePath("/users")
  revalidatePath(`/users/${id}`)
}
```

### Delete Action

```typescript
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function deleteUser(id: number) {
  await prisma.user.delete({
    where: { id },
  })

  revalidatePath("/users")
  redirect("/users")
}
```

### Action with Validation

```typescript
"use server"

import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"

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

## Server Components

### List Page

```typescript
// app/users/page.tsx
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <Link href={`/users/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  )
}
```

### Detail Page

```typescript
// app/users/[id]/page.tsx
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface Props {
  params: { id: string }
}

export default async function UserPage({ params }: Props) {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(params.id) },
    include: { posts: true },
  })

  if (!user) notFound()

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <h2>Posts</h2>
      <ul>
        {user.posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

### With Pagination

```typescript
// app/users/page.tsx
import { prisma } from "@/lib/prisma"
import Link from "next/link"

interface Props {
  searchParams: { page?: string }
}

const PAGE_SIZE = 10

export default async function UsersPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page || "1")
  const skip = (page - 1) * PAGE_SIZE

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <nav>
        {page > 1 && <Link href={`?page=${page - 1}`}>Previous</Link>}
        <span>Page {page} of {totalPages}</span>
        {page < totalPages && <Link href={`?page=${page + 1}`}>Next</Link>}
      </nav>
    </div>
  )
}
```

### With Search and Filter

```typescript
// app/users/page.tsx
import { prisma } from "@/lib/prisma"

interface Props {
  searchParams: { q?: string; role?: string }
}

export default async function UsersPage({ searchParams }: Props) {
  const { q, role } = searchParams

  const users = await prisma.user.findMany({
    where: {
      AND: [
        q ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        } : {},
        role ? { role: role as any } : {},
      ],
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <form>
        <input name="q" defaultValue={q} placeholder="Search..." />
        <select name="role" defaultValue={role}>
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit">Search</button>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

## API Routes

### GET - List

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
```

### GET - Single

```typescript
// app/api/users/[id]/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(params.id) },
  })

  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(user)
}
```

### POST - Create

```typescript
// app/api/users/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
      },
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

### PUT - Update

```typescript
// app/api/users/[id]/route.ts
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const user = await prisma.user.update({
      where: { id: parseInt(params.id) },
      data: body,
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}
```

### DELETE

```typescript
// app/api/users/[id]/route.ts
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: parseInt(params.id) },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
}
```

## Error Handling

```typescript
import { Prisma } from "@prisma/client"

export async function createUser(data: { email: string; name: string }) {
  try {
    return await prisma.user.create({ data })
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
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| P2002 | Unique constraint violation |
| P2003 | Foreign key constraint violation |
| P2025 | Record not found |
| P2014 | Required relation violation |
| P2034 | Transaction conflict |
