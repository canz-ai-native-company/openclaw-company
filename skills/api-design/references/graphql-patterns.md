# GraphQL Schema Design Patterns

Comprehensive guide for designing GraphQL APIs.

---

## Schema Definition Language (SDL)

### Basic Types

```graphql
# Scalar types
type User {
  id: ID!
  email: String!
  name: String!
  age: Int
  balance: Float
  isActive: Boolean!
  createdAt: DateTime!
}

# Custom scalars
scalar DateTime
scalar JSON
scalar UUID
```

### Object Types

```graphql
type User {
  id: ID!
  email: String!
  name: String!
  profile: Profile
  orders: [Order!]!
  role: Role!
}

type Profile {
  id: ID!
  bio: String
  avatar: String
  user: User!
}

type Order {
  id: ID!
  total: Float!
  status: OrderStatus!
  items: [OrderItem!]!
  user: User!
  createdAt: DateTime!
}
```

### Enums

```graphql
enum Role {
  USER
  ADMIN
  MODERATOR
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

### Interfaces

```graphql
interface Node {
  id: ID!
}

interface Timestamped {
  createdAt: DateTime!
  updatedAt: DateTime!
}

type User implements Node & Timestamped {
  id: ID!
  email: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Order implements Node & Timestamped {
  id: ID!
  total: Float!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### Union Types

```graphql
union SearchResult = User | Product | Order

type Query {
  search(query: String!): [SearchResult!]!
}

# Query with inline fragments
query {
  search(query: "john") {
    ... on User {
      id
      name
      email
    }
    ... on Product {
      id
      title
      price
    }
    ... on Order {
      id
      total
      status
    }
  }
}
```

---

## Query Design

### Basic Queries

```graphql
type Query {
  # Single item by ID
  user(id: ID!): User
  order(id: ID!): Order

  # List with optional filters
  users(
    limit: Int = 20
    offset: Int = 0
    filter: UserFilter
    sort: UserSort
  ): UserConnection!

  # Search
  searchUsers(query: String!): [User!]!

  # Current user (authenticated)
  me: User
}

input UserFilter {
  role: Role
  isActive: Boolean
  createdAfter: DateTime
}

input UserSort {
  field: UserSortField!
  direction: SortDirection!
}

enum UserSortField {
  NAME
  EMAIL
  CREATED_AT
}

enum SortDirection {
  ASC
  DESC
}
```

### Connection Pattern (Cursor Pagination)

```graphql
type Query {
  users(
    first: Int
    after: String
    last: Int
    before: String
  ): UserConnection!
}

type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

# Query example
query {
  users(first: 10, after: "cursor123") {
    edges {
      node {
        id
        name
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
```

---

## Mutation Design

### Basic Mutations

```graphql
type Mutation {
  # Create
  createUser(input: CreateUserInput!): CreateUserPayload!

  # Update
  updateUser(id: ID!, input: UpdateUserInput!): UpdateUserPayload!

  # Delete
  deleteUser(id: ID!): DeleteUserPayload!
}

input CreateUserInput {
  email: String!
  name: String!
  password: String!
  role: Role = USER
}

type CreateUserPayload {
  user: User
  errors: [Error!]
}

input UpdateUserInput {
  name: String
  email: String
}

type UpdateUserPayload {
  user: User
  errors: [Error!]
}

type DeleteUserPayload {
  success: Boolean!
  errors: [Error!]
}

type Error {
  field: String
  message: String!
  code: String!
}
```

### Mutation Best Practices

```graphql
# ✅ GOOD: Input types with payload responses
mutation {
  createUser(input: { email: "test@example.com", name: "Test" }) {
    user {
      id
      email
    }
    errors {
      field
      message
    }
  }
}

# ❌ BAD: Direct arguments, no error handling
mutation {
  createUser(email: "test@example.com", name: "Test") {
    id
    email
  }
}
```

---

## Subscription Design

```graphql
type Subscription {
  # New messages in a channel
  messageCreated(channelId: ID!): Message!

  # Order status updates
  orderStatusChanged(orderId: ID!): Order!

  # User online status
  userPresenceChanged: UserPresence!
}

type UserPresence {
  userId: ID!
  isOnline: Boolean!
  lastSeen: DateTime
}

# Client subscription
subscription {
  messageCreated(channelId: "123") {
    id
    content
    sender {
      name
    }
    createdAt
  }
}
```

---

## Error Handling

### Error Types

```graphql
interface Error {
  message: String!
  code: String!
}

type ValidationError implements Error {
  message: String!
  code: String!
  field: String!
}

type AuthenticationError implements Error {
  message: String!
  code: String!
}

type NotFoundError implements Error {
  message: String!
  code: String!
  resourceType: String!
  resourceId: ID!
}

union MutationError = ValidationError | AuthenticationError | NotFoundError

type CreateUserPayload {
  user: User
  errors: [MutationError!]
}
```

### Result Type Pattern

```graphql
union CreateUserResult = CreateUserSuccess | CreateUserError

type CreateUserSuccess {
  user: User!
}

type CreateUserError {
  message: String!
  code: String!
  field: String
}

type Mutation {
  createUser(input: CreateUserInput!): CreateUserResult!
}

# Query
mutation {
  createUser(input: { ... }) {
    ... on CreateUserSuccess {
      user {
        id
        email
      }
    }
    ... on CreateUserError {
      message
      code
      field
    }
  }
}
```

---

## Authentication & Authorization

### Context-Based Auth

```graphql
type Query {
  # Public
  products: [Product!]!

  # Requires authentication
  me: User @auth

  # Requires specific role
  adminDashboard: AdminStats @auth(requires: ADMIN)

  # Requires ownership
  myOrders: [Order!]! @auth
}

directive @auth(requires: Role) on FIELD_DEFINITION
```

### Field-Level Permissions

```graphql
type User {
  id: ID!
  email: String!
  name: String!

  # Only visible to self or admin
  phoneNumber: String @auth(requires: [SELF, ADMIN])

  # Only visible to admin
  internalNotes: String @auth(requires: ADMIN)
}
```

---

## N+1 Problem Solutions

### DataLoader Pattern

```javascript
// Without DataLoader - N+1 queries
// If fetching 10 users, makes 11 queries (1 for users + 10 for orders)

// With DataLoader - 2 queries
const orderLoader = new DataLoader(async (userIds) => {
  const orders = await db.orders.findMany({
    where: { userId: { in: userIds } }
  });

  // Group by userId
  const ordersByUser = groupBy(orders, 'userId');
  return userIds.map(id => ordersByUser[id] || []);
});

// Resolver
const resolvers = {
  User: {
    orders: (user, args, context) => {
      return context.loaders.orders.load(user.id);
    }
  }
};
```

---

## Schema Organization

### Modular Schema

```
/schema
  /types
    user.graphql
    order.graphql
    product.graphql
  /inputs
    user-inputs.graphql
    order-inputs.graphql
  /queries
    user-queries.graphql
    order-queries.graphql
  /mutations
    user-mutations.graphql
    order-mutations.graphql
  /subscriptions
    index.graphql
  schema.graphql
```

### Type Extensions

```graphql
# user.graphql
type User {
  id: ID!
  email: String!
  name: String!
}

# order.graphql
extend type User {
  orders: [Order!]!
}

# queries.graphql
extend type Query {
  user(id: ID!): User
  users: [User!]!
}
```

---

## Naming Conventions

### Types

```graphql
# PascalCase for types
type User { }
type OrderItem { }
type UserProfile { }

# Suffix with Input for inputs
input CreateUserInput { }
input UpdateOrderInput { }

# Suffix with Payload for mutation results
type CreateUserPayload { }
type UpdateOrderPayload { }

# Suffix with Connection for pagination
type UserConnection { }
type OrderConnection { }
```

### Fields and Arguments

```graphql
type User {
  # camelCase for fields
  id: ID!
  firstName: String!
  lastName: String!
  emailAddress: String!
  isActive: Boolean!
  createdAt: DateTime!
}

type Query {
  # camelCase for query names
  user(id: ID!): User
  userByEmail(email: String!): User
  searchUsers(query: String!): [User!]!
}

type Mutation {
  # Verb + Noun for mutations
  createUser(input: CreateUserInput!): CreateUserPayload!
  updateUser(id: ID!, input: UpdateUserInput!): UpdateUserPayload!
  deleteUser(id: ID!): DeleteUserPayload!
  activateUser(id: ID!): ActivateUserPayload!
  sendUserInvite(userId: ID!, email: String!): SendInvitePayload!
}
```

### Enums

```graphql
# SCREAMING_SNAKE_CASE for enum values
enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
  REFUNDED
}

enum UserRole {
  GUEST
  USER
  PREMIUM_USER
  MODERATOR
  ADMIN
  SUPER_ADMIN
}
```

---

## Complete Example Schema

```graphql
scalar DateTime
scalar UUID

type Query {
  me: User
  user(id: ID!): User
  users(
    first: Int
    after: String
    filter: UserFilter
  ): UserConnection!
  order(id: ID!): Order
  orders(
    first: Int
    after: String
    filter: OrderFilter
  ): OrderConnection!
}

type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
  updateUser(id: ID!, input: UpdateUserInput!): UpdateUserPayload!
  deleteUser(id: ID!): DeleteUserPayload!
  createOrder(input: CreateOrderInput!): CreateOrderPayload!
  updateOrderStatus(id: ID!, status: OrderStatus!): UpdateOrderStatusPayload!
}

type Subscription {
  orderStatusChanged(orderId: ID!): Order!
}

type User {
  id: ID!
  email: String!
  name: String!
  role: UserRole!
  orders: [Order!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Order {
  id: ID!
  user: User!
  items: [OrderItem!]!
  total: Float!
  status: OrderStatus!
  createdAt: DateTime!
}

type OrderItem {
  id: ID!
  product: Product!
  quantity: Int!
  price: Float!
}

type Product {
  id: ID!
  title: String!
  price: Float!
  description: String
}

enum UserRole {
  USER
  ADMIN
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

input UserFilter {
  role: UserRole
  createdAfter: DateTime
}

input OrderFilter {
  status: OrderStatus
  userId: ID
}

input CreateUserInput {
  email: String!
  name: String!
  password: String!
}

input UpdateUserInput {
  name: String
  email: String
}

input CreateOrderInput {
  items: [OrderItemInput!]!
}

input OrderItemInput {
  productId: ID!
  quantity: Int!
}

type CreateUserPayload {
  user: User
  errors: [Error!]
}

type UpdateUserPayload {
  user: User
  errors: [Error!]
}

type DeleteUserPayload {
  success: Boolean!
  errors: [Error!]
}

type CreateOrderPayload {
  order: Order
  errors: [Error!]
}

type UpdateOrderStatusPayload {
  order: Order
  errors: [Error!]
}

type Error {
  field: String
  message: String!
  code: String!
}

type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type OrderConnection {
  edges: [OrderEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type OrderEdge {
  node: Order!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```
