# Scope Patterns

Common patterns for different types of changes.

---

## Feature Patterns

### New UI Component

**Typical Files**: 3-5

```
src/
├── components/
│   └── [ComponentName]/
│       ├── index.ts           (barrel export)
│       ├── [ComponentName].tsx (component)
│       ├── [ComponentName].test.tsx (tests)
│       └── [ComponentName].module.css (styles - optional)
├── hooks/
│   └── use[Feature].ts        (if needs custom hook)
└── types/
    └── [feature].types.ts     (if new types needed)
```

**Modify**:
- Parent component (to use new component)
- components/index.ts (barrel export)

---

### New API Endpoint

**Typical Files**: 4-6

```
src/
├── app/api/[resource]/
│   └── route.ts               (handler)
├── services/
│   └── [resource].service.ts  (business logic)
├── types/
│   └── [resource].types.ts    (request/response types)
├── lib/
│   └── validations/
│       └── [resource].ts      (input validation)
└── tests/
    └── api/
        └── [resource].test.ts (API tests)
```

**Modify**:
- Middleware (if new auth requirements)
- OpenAPI spec (if exists)

---

### New Database Entity

**Typical Files**: 5-8

```
prisma/
├── schema.prisma              (add model)
└── migrations/
    └── [timestamp]_[name]/
        └── migration.sql

src/
├── repositories/
│   └── [entity].repository.ts
├── services/
│   └── [entity].service.ts
├── types/
│   └── [entity].types.ts
└── app/api/[entity]/
    └── route.ts
```

**Modify**:
- Existing services (if relationships)
- Seed files (if default data needed)

---

### Authentication Feature

**Typical Files**: 8-12

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   └── api/auth/
│       ├── [...nextauth]/route.ts
│       └── register/route.ts
├── components/auth/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── AuthProvider.tsx
├── hooks/
│   └── useAuth.ts
├── lib/
│   └── auth.ts
└── middleware.ts
```

**Modify**:
- Root layout (add provider)
- Environment variables

---

## Refactoring Patterns

### Extract Hook

**Typical Files**: 2-3

```
src/hooks/
└── use[Name].ts              (new hook)

src/components/
└── [Component].tsx           (modify: use hook)
```

---

### Extract Service

**Typical Files**: 2-4

```
src/services/
└── [name].service.ts         (new service)

src/components/               (modify: use service)
└── [Component].tsx

src/app/api/                  (modify: use service)
└── [route]/route.ts
```

---

### Split Component

**Typical Files**: 3-5

```
src/components/
├── [Original]/
│   ├── index.ts              (re-export)
│   ├── [Original].tsx        (modify: compose)
│   ├── [SubPart1].tsx        (new)
│   └── [SubPart2].tsx        (new)
```

---

## Integration Patterns

### Third-Party Service

**Typical Files**: 4-6

```
src/
├── lib/
│   └── [service]/
│       ├── client.ts         (API client)
│       ├── types.ts          (response types)
│       └── index.ts          (exports)
├── services/
│   └── [feature].service.ts  (business logic using client)
├── hooks/
│   └── use[Feature].ts       (if frontend needs it)
└── app/api/
    └── webhooks/
        └── [service]/route.ts (if webhooks needed)
```

**Modify**:
- Environment example (.env.example)
- Documentation

---

### Payment Integration

**Typical Files**: 8-12

```
src/
├── lib/
│   └── stripe/
│       ├── client.ts
│       ├── products.ts
│       └── webhooks.ts
├── app/
│   ├── api/
│   │   ├── checkout/route.ts
│   │   └── webhooks/stripe/route.ts
│   └── checkout/
│       └── page.tsx
├── components/checkout/
│   ├── CheckoutForm.tsx
│   └── PaymentStatus.tsx
└── hooks/
    └── useCheckout.ts
```

---

## Configuration Patterns

### Environment Variable

**Typical Files**: 2-4

```
.env.example                  (add variable documentation)
.env.local                    (add actual value - gitignored)

src/lib/
└── config.ts                 (if centralized config)

next.config.js                (if needs exposure to client)
```

---

### Build Configuration

**Typical Files**: 1-3

```
next.config.js                (or vite.config.ts, etc.)
tsconfig.json                 (if TypeScript changes)
package.json                  (if new scripts)
```

---

## Size Estimation

### Quick Reference

| Change Type | Typical Files | Risk Level |
|-------------|---------------|------------|
| Bug fix | 1-2 | Low |
| Simple component | 2-3 | Low |
| Feature component | 3-5 | Medium |
| New API endpoint | 4-6 | Medium |
| Database change | 5-8 | High |
| Auth feature | 8-12 | High |
| Full feature | 10-20 | High |
| Major refactor | 15-30+ | Critical |

---

## Pattern Selection

```
What type of change?
│
├── UI only?
│   ├── New component → UI Component Pattern
│   └── Modify existing → 1-3 files
│
├── Data layer?
│   ├── New endpoint → API Endpoint Pattern
│   └── New entity → Database Entity Pattern
│
├── Integration?
│   ├── Third-party API → Third-Party Pattern
│   └── Payment → Payment Integration Pattern
│
└── Refactoring?
    ├── Extract logic → Extract Hook/Service Pattern
    └── Split component → Split Component Pattern
```

---

## Anti-Patterns

### Over-Scoping

| Symptom | Problem | Solution |
|---------|---------|----------|
| 20+ files for "simple" feature | Scope creep | Focus on MVP |
| Many "nice to have" additions | Feature creep | Separate backlog |
| Refactoring while adding feature | Mixed concerns | One thing at a time |

### Under-Scoping

| Symptom | Problem | Solution |
|---------|---------|----------|
| "Just one file" for DB change | Missing migration | Check all impacts |
| No tests listed | Missing coverage | Always include tests |
| No type updates | Type safety gaps | Update types |

### Wrong Pattern

| Symptom | Problem | Solution |
|---------|---------|----------|
| Logic in component | Wrong layer | Extract to service/hook |
| API in page component | Wrong location | Use API route |
| Business logic in route | Missing service | Extract service |
