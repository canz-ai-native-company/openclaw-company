# Component Design Template

## Standard Component Template

Use this template for every component in the system design.

```markdown
### Component: [Name]

**Responsibility:** [Single responsibility description - what this component does]

**Technology:** [Chosen technology/framework]
**Justification:** [Why this technology was chosen]

**Interfaces:**
- **Input:** [What it receives - APIs, events, messages]
- **Output:** [What it produces - responses, events, data]
- **Dependencies:** [Other components it requires]

**Scaling Strategy:**
- **Horizontal:** [Yes/No, how many instances, load balancing]
- **Vertical:** [Size limits, when to upgrade]
- **Trigger:** [When to scale - metrics, thresholds]

**Failure Mode:**
- **Detection:** [How failures are detected]
- **Impact:** [What breaks if this fails]
- **Recovery:** [How to recover - automatic/manual]
- **Fallback:** [Degraded operation mode]

**Data:**
- **Volume:** [Expected data size]
- **Growth:** [Rate of growth per day/month]
- **Retention:** [How long to keep data]

**Cost Estimate:** [Low/Medium/High with monthly range]
```

---

## Example: API Gateway Component

### Component: API Gateway

**Responsibility:** Route requests, authenticate users, rate limit, and transform requests/responses.

**Technology:** Kong / AWS API Gateway
**Justification:** Managed service reduces operational overhead; built-in auth, rate limiting, and monitoring. Team has Kong experience.

**Interfaces:**
- **Input:** HTTPS requests from clients (web, mobile, partners)
- **Output:** Routed requests to backend services, cached responses
- **Dependencies:** Auth Service (JWT validation), Service Registry

**Scaling Strategy:**
- **Horizontal:** Auto-scaling 2-10 instances based on request count
- **Vertical:** N/A (managed service)
- **Trigger:** Scale out at > 1000 RPS per instance

**Failure Mode:**
- **Detection:** Health check failures, 5xx error rate > 1%
- **Impact:** All API requests fail; mobile and web apps unusable
- **Recovery:** Automatic failover to healthy instances; DNS failover to DR region
- **Fallback:** Static error page; queue requests for retry (if applicable)

**Data:**
- **Volume:** Request logs only (~1KB per request)
- **Growth:** ~1 GB/day at current scale
- **Retention:** 30 days hot, 1 year cold storage

**Cost Estimate:** Medium ($100-500/month depending on traffic)

---

## Example: User Service Component

### Component: User Service

**Responsibility:** Manage user accounts, profiles, authentication credentials, and preferences.

**Technology:** Node.js + Express + PostgreSQL
**Justification:** Team expertise in Node.js; PostgreSQL for ACID compliance on user data; proven stack.

**Interfaces:**
- **Input:**
  - REST API: `/users/*` endpoints (CRUD operations)
  - Events: `user.created`, `user.updated` subscriptions
- **Output:**
  - REST responses (user data)
  - Events: `user.created`, `user.deleted`, `user.role.changed`
- **Dependencies:**
  - PostgreSQL (primary data store)
  - Redis (session cache)
  - Email Service (notifications)

**Scaling Strategy:**
- **Horizontal:** 2-4 instances behind load balancer; stateless design
- **Vertical:** Current: t3.medium (2 vCPU, 4GB); Max: m5.large (2 vCPU, 8GB)
- **Trigger:** Scale at > 500 RPS or CPU > 70%

**Failure Mode:**
- **Detection:** Health endpoint `/health`; error rate monitoring
- **Impact:**
  - Login fails (critical)
  - Profile updates fail (medium)
  - New registrations blocked (high)
- **Recovery:**
  - Automatic instance restart via health checks
  - Database failover to replica (< 60 seconds)
- **Fallback:**
  - Read from cache for profile data (stale but functional)
  - Queue write operations for later processing

**Data:**
- **Volume:** ~2KB per user × 100K users = 200 MB base
- **Growth:** ~1000 users/day = 2 MB/day
- **Retention:** Forever (soft delete for compliance)

**Cost Estimate:** Low ($80-150/month: 2× t3.medium + db.t3.small)

---

## Example: Order Service Component

### Component: Order Service

**Responsibility:** Process orders, manage order lifecycle, handle inventory reservations, and coordinate payment.

**Technology:** Node.js + Express + PostgreSQL
**Justification:** Consistent stack with User Service; strong transaction support required for orders.

**Interfaces:**
- **Input:**
  - REST API: `/orders/*` endpoints
  - Events: `payment.completed`, `inventory.reserved`
- **Output:**
  - REST responses (order data)
  - Events: `order.created`, `order.confirmed`, `order.shipped`, `order.cancelled`
- **Dependencies:**
  - Product Service (availability check)
  - Payment Service (payment processing)
  - Notification Service (order updates)
  - Message Queue (async communication)

**Scaling Strategy:**
- **Horizontal:** 2-4 instances; stateless
- **Vertical:** t3.medium → m5.large if needed
- **Trigger:** Scale at > 50 orders/minute or queue depth > 100

**Failure Mode:**
- **Detection:** Health checks; order completion rate < 95%
- **Impact:**
  - New orders cannot be placed (critical)
  - Order status updates delayed (medium)
- **Recovery:**
  - Replay from message queue (idempotent processing)
  - Circuit breaker to Payment Service
- **Fallback:**
  - Queue orders for later processing
  - Show "order received, processing" status

**Data:**
- **Volume:** ~5KB per order × 1000 orders/day = 5 MB/day
- **Growth:** Linear with user growth
- **Retention:** 7 years (financial compliance)

**Cost Estimate:** Medium ($100-200/month)

---

## Example: Redis Cache Component

### Component: Redis Cache

**Responsibility:** Provide high-speed caching for sessions, frequently accessed data, and rate limiting counters.

**Technology:** Redis (AWS ElastiCache)
**Justification:** Sub-millisecond latency; rich data structures; managed service reduces ops overhead.

**Interfaces:**
- **Input:** Cache get/set from all services
- **Output:** Cached data, rate limit status
- **Dependencies:** None (cache is optional for most operations)

**Scaling Strategy:**
- **Horizontal:** Redis Cluster for > 10GB or > 100K ops/sec
- **Vertical:** cache.t3.medium → cache.m5.large → cache.r5.large
- **Trigger:** Memory > 80% or latency > 5ms p99

**Failure Mode:**
- **Detection:** Connection failures; latency spike
- **Impact:**
  - Increased database load
  - Slower responses (200ms → 500ms)
  - Session loss (if not persisted)
- **Recovery:**
  - Automatic failover to replica (< 60 seconds)
  - Services continue without cache
- **Fallback:**
  - All services designed to work without cache
  - Database queries replace cache reads

**Data:**
- **Volume:** ~5GB allocated
- **Growth:** Bounded by eviction policy (LRU)
- **Retention:** TTL-based (sessions: 24h, data: 15min)

**Cost Estimate:** Low ($50-150/month)

---

## Component Interaction Diagram Template

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                              │
│              (Web, Mobile, Third-party)                     │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     API GATEWAY                             │
│            (Auth, Rate Limiting, Routing)                   │
└─────────────────────────┬───────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│  SERVICE A    │ │  SERVICE B    │ │  SERVICE C    │
│               │ │               │ │               │
│ ┌───────────┐ │ │ ┌───────────┐ │ │ ┌───────────┐ │
│ │ Database  │ │ │ │ Database  │ │ │ │ Database  │ │
│ └───────────┘ │ │ └───────────┘ │ │ └───────────┘ │
└───────────────┘ └───────────────┘ └───────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ MESSAGE QUEUE │
                  │  (Async Comm) │
                  └───────────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │    CACHE      │
                  │   (Redis)     │
                  └───────────────┘
```

---

## Component Checklist

For each component, verify:

- [ ] Single clear responsibility defined
- [ ] Technology choice justified
- [ ] All interfaces documented (input/output/dependencies)
- [ ] Horizontal scaling strategy specified
- [ ] Vertical scaling limits known
- [ ] Scaling triggers defined with metrics
- [ ] Failure detection method specified
- [ ] Failure impact assessed
- [ ] Recovery procedure documented
- [ ] Fallback/degraded mode defined
- [ ] Data volume estimated
- [ ] Data growth rate calculated
- [ ] Data retention policy specified
- [ ] Cost estimate provided
