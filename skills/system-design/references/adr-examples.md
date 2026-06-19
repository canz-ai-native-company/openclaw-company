# Architecture Decision Records (ADR) Examples

## ADR Template

```markdown
# ADR-[NUMBER]: [Decision Title]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-XXX]

## Context
[What is the issue? Why do we need to make this decision?]

## Decision
[What is the decision? Be specific.]

## Options Considered

### Option 1: [Name]
- **Pros:** [List]
- **Cons:** [List]
- **Cost:** [Low/Medium/High]

### Option 2: [Name]
- **Pros:** [List]
- **Cons:** [List]
- **Cost:** [Low/Medium/High]

## Rationale
[Why did we choose this option over others?]

## Consequences
- **Positive:** [What improves]
- **Negative:** [What trade-offs we accept]
- **Risks:** [What could go wrong]

## Related Decisions
[Links to related ADRs]
```

---

## Example ADR-001: Microservices vs Monolith

# ADR-001: Microservices vs Monolith Architecture

## Status
Accepted

## Context
We are building an e-commerce platform expecting to scale to 100K users within the first year. The development team consists of 15 engineers across 3 squads. We need to decide on the overall architecture approach that will support our growth while enabling team autonomy.

## Decision
Use **microservices architecture** with 4 core services: Auth, Product, Order, and Payment.

## Options Considered

### Option 1: Monolithic Architecture
- **Pros:**
  - Simple development and deployment
  - Easy debugging and testing
  - Lower initial operational overhead
  - Faster time to MVP
- **Cons:**
  - Scaling limitations (vertical only)
  - Deployment coupling (all-or-nothing releases)
  - Team coordination bottlenecks
  - Technology lock-in
- **Cost:** Low ($500-1000/month infrastructure)

### Option 2: Microservices Architecture
- **Pros:**
  - Independent scaling per service
  - Team autonomy (each squad owns services)
  - Technology flexibility per service
  - Better fault isolation
  - Independent deployment cycles
- **Cons:**
  - Network complexity and latency
  - Distributed system challenges (consistency, debugging)
  - Higher operational overhead
  - Requires DevOps maturity
- **Cost:** Medium ($2000-5000/month infrastructure)

### Option 3: Serverless (AWS Lambda)
- **Pros:**
  - No server management
  - Auto-scaling built-in
  - Pay-per-use pricing
- **Cons:**
  - Cold start latency issues
  - Vendor lock-in
  - Limited execution time
  - Complex local development
- **Cost:** Variable ($1000-10000/month based on usage)

## Rationale
We chose microservices because:
1. **Expected growth**: 100K users requires independent scaling of high-load services (Product catalog will have 10x more reads than writes)
2. **Team structure**: 3 squads can work independently on different services
3. **Deployment velocity**: Services can be deployed independently, reducing release coordination
4. **Risk isolation**: Payment service failures won't affect product browsing

## Consequences

### Positive
- Teams can deploy independently, increasing velocity
- Product service can scale independently during high-traffic events
- Technology choices can evolve per service (e.g., GraphQL for Product, REST for Orders)
- Failures are isolated to individual services

### Negative
- Need to implement distributed tracing (Jaeger) for debugging
- Service-to-service communication adds latency (~10-50ms per hop)
- Team needs to learn Kubernetes/Docker
- Data consistency requires careful design (eventual consistency accepted)

### Risks
- Team may lack distributed systems experience
- Initial development velocity may be slower
- Monitoring and debugging more complex

## Related Decisions
- ADR-002: Database per Service
- ADR-003: API Gateway Selection
- ADR-005: Service Communication Protocol

---

## Example ADR-002: Database Strategy

# ADR-002: Database Per Service vs Shared Database

## Status
Accepted

## Context
Following ADR-001 (Microservices Architecture), we need to decide whether services share a single database or each service owns its data.

## Decision
Each microservice will have its own **dedicated database** (Database-per-Service pattern).

## Options Considered

### Option 1: Shared Database
- **Pros:**
  - Simple cross-service queries (JOINs)
  - Single backup/recovery process
  - Lower infrastructure cost
  - ACID transactions across services
- **Cons:**
  - Tight coupling between services
  - Schema changes affect all services
  - Single point of failure
  - Scaling limited to single database
- **Cost:** Low ($200/month for managed PostgreSQL)

### Option 2: Database Per Service
- **Pros:**
  - Service independence and autonomy
  - Independent scaling per service needs
  - Technology choice per service (SQL/NoSQL)
  - Fault isolation
- **Cons:**
  - Cross-service queries require API calls
  - Data duplication may be needed
  - Distributed transactions complex
  - Higher infrastructure cost
- **Cost:** Medium ($600/month for 4 managed databases)

## Rationale
Database-per-service aligns with microservices principles:
1. **Loose coupling**: Services can evolve independently
2. **Independent scaling**: Order history can be archived differently than product catalog
3. **Technology fit**: Product catalog benefits from read replicas; Order service needs strong consistency
4. **Team autonomy**: Each team owns their data model

## Consequences

### Positive
- Services can choose optimal database technology
- Independent scaling and performance tuning
- No schema migration coordination across teams
- Services can be deployed without database lock-in

### Negative
- Cross-service reporting requires data aggregation service
- Order confirmation needs saga pattern (no distributed transactions)
- Some data duplication (user info in Order service)
- 4x database management overhead

### Risks
- Data consistency bugs in saga implementations
- Reporting queries may be slower without JOINs
- Increased cloud spend

## Related Decisions
- ADR-001: Microservices Architecture
- ADR-006: Saga Pattern for Distributed Transactions

---

## Example ADR-003: Caching Strategy

# ADR-003: Caching Layer Implementation

## Status
Accepted

## Context
The Product service experiences high read traffic (expected 1000 QPS) while writes are infrequent (10 QPS). Database performance at this scale is a concern.

## Decision
Implement **Redis as cache-aside** for Product service with 15-minute TTL.

## Options Considered

### Option 1: No Caching (Database Only)
- **Pros:** Simplest architecture, always consistent
- **Cons:** Database bottleneck at scale, high latency
- **Cost:** High (need larger database)

### Option 2: Application-Level Caching (In-Memory)
- **Pros:** Fastest access, no network hop
- **Cons:** Not shared across instances, memory limited
- **Cost:** Low

### Option 3: Redis Cache-Aside
- **Pros:**
  - Shared across instances
  - High throughput (100K+ ops/sec)
  - Data structures beyond key-value
  - Persistence options
- **Cons:**
  - Additional infrastructure
  - Cache invalidation complexity
  - Eventual consistency
- **Cost:** Medium ($100-200/month managed Redis)

### Option 4: Read Replicas Only
- **Pros:** Simpler than cache, SQL queries work
- **Cons:** Higher latency than cache, cost scales with load
- **Cost:** Medium-High

## Rationale
Redis cache-aside chosen because:
1. **100:1 read/write ratio**: Perfect for caching
2. **Shared state**: Multiple Product service instances share cache
3. **Low latency**: Sub-millisecond reads
4. **Cost effective**: $100/month vs $500/month for larger DB

## Consequences

### Positive
- Product reads reduced from 50ms to <5ms
- Database load reduced by 95%
- Can handle traffic spikes gracefully

### Negative
- Cache may be stale for up to 15 minutes
- Cache invalidation logic needed on writes
- Additional component to monitor

### Risks
- Cache stampede on cold start
- Redis failure impacts all instances

---

## ADR Naming Conventions

| Number Range | Category |
|--------------|----------|
| 001-099 | Architecture patterns |
| 100-199 | Data storage |
| 200-299 | Communication |
| 300-399 | Security |
| 400-499 | Infrastructure |
| 500-599 | Observability |

---

## ADR Best Practices

1. **Be Specific**: State the exact technology, not just the pattern
2. **Include Numbers**: Cost estimates, performance expectations
3. **Document Trade-offs**: Every decision has downsides
4. **Link Related ADRs**: Decisions build on each other
5. **Keep Updated**: Mark superseded decisions
6. **Include Context**: Why now? What triggered this decision?
