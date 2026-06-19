# Scalability Patterns Reference

## Scaling Strategies Overview

### Vertical Scaling (Scale Up)
- Add more resources to existing server
- Simpler to implement
- Has upper limits
- Single point of failure remains

### Horizontal Scaling (Scale Out)
- Add more servers
- More complex but limitless
- Requires load balancing
- Better fault tolerance

---

## Load Balancing Patterns

### Round Robin
```
        ┌─────────────────────────────────┐
        │        Load Balancer            │
        │         (Round Robin)           │
        └─────────────┬───────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   ┌─────────┐   ┌─────────┐   ┌─────────┐
   │Server 1 │   │Server 2 │   │Server 3 │
   └─────────┘   └─────────┘   └─────────┘
```
- Simple, equal distribution
- Use when: Servers have similar capacity

### Weighted Round Robin
- Distribute based on server capacity
- Use when: Servers have different specs

### Least Connections
- Route to server with fewest connections
- Use when: Request processing time varies

### IP Hash
- Route based on client IP
- Use when: Session stickiness needed

---

## Caching Patterns

### Cache-Aside (Lazy Loading)
```
┌────────┐     ┌─────────┐     ┌──────────┐
│ Client │────▶│  Cache  │────▶│ Database │
└────────┘     └─────────┘     └──────────┘

1. Check cache first
2. If miss, read from DB
3. Store in cache
4. Return to client
```
**Use when**: Read-heavy workloads, tolerant of stale data

### Write-Through
```
Write → Cache → Database (synchronous)
```
- Data always consistent
- Higher write latency
- Use when: Consistency critical

### Write-Behind (Write-Back)
```
Write → Cache → [Async] → Database
```
- Lower write latency
- Risk of data loss
- Use when: Write performance critical

### Cache Invalidation Strategies
| Strategy | When to Use |
|----------|-------------|
| TTL (Time-to-Live) | Data can be stale temporarily |
| Event-based | Data changes trigger invalidation |
| Version-based | Data changes infrequently |

---

## Database Scaling Patterns

### Read Replicas
```
        ┌─────────────┐
        │   Primary   │
        │  (Writes)   │
        └──────┬──────┘
               │ Replication
    ┌──────────┼──────────┐
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│Replica │ │Replica │ │Replica │
│(Reads) │ │(Reads) │ │(Reads) │
└────────┘ └────────┘ └────────┘
```
- Scale reads horizontally
- Eventual consistency
- Use when: Read-heavy workload (10:1 read/write ratio)

### Sharding (Horizontal Partitioning)
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Shard 1    │     │  Shard 2    │     │  Shard 3    │
│ Users A-H   │     │ Users I-P   │     │ Users Q-Z   │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Sharding Strategies:**
| Strategy | Pros | Cons |
|----------|------|------|
| Range-based | Simple, range queries easy | Hotspots possible |
| Hash-based | Even distribution | Range queries hard |
| Directory-based | Flexible | Lookup overhead |

- Scale writes horizontally
- Complex queries across shards
- Use when: Single database insufficient

### Database Partitioning
- **Vertical**: Split by columns/features
- **Horizontal**: Split by rows (sharding)

---

## Message Queue Patterns

### Point-to-Point
```
Producer → Queue → Consumer
```
- Each message processed once
- Use for: Task distribution

### Publish-Subscribe
```
Publisher → Topic → Multiple Subscribers
```
- Each message to all subscribers
- Use for: Event broadcasting

### Work Queue
```
Producer → Queue → Worker Pool
```
- Distribute work among workers
- Use for: Background processing

---

## CDN and Edge Caching

```
┌─────────┐     ┌───────────┐     ┌──────────────┐
│  User   │────▶│  CDN Edge │────▶│ Origin Server│
│ (Asia)  │     │  (Asia)   │     │   (US)       │
└─────────┘     └───────────┘     └──────────────┘
```

### What to Cache at Edge
- Static assets (images, CSS, JS)
- API responses (if cacheable)
- HTML pages (if static or personalized at edge)

### CDN Benefits
- Reduced latency
- Reduced origin load
- DDoS protection
- SSL termination

---

## Auto-Scaling Patterns

### Reactive Scaling
```
Monitor → Threshold Exceeded → Scale Out
         ↓
Threshold Normal → Scale In
```

**Metrics to Monitor:**
| Metric | Scale Out When | Scale In When |
|--------|---------------|---------------|
| CPU | > 70% | < 30% |
| Memory | > 80% | < 40% |
| Requests/sec | > target | < target/2 |
| Queue depth | > 100 | < 10 |

### Predictive Scaling
- Use historical data to predict load
- Scale before traffic spike
- Use for: Predictable patterns (daily, weekly)

### Scheduled Scaling
- Scale at specific times
- Use for: Known events (launches, sales)

---

## Microservices Scaling Patterns

### Service Mesh
```
┌─────────────────────────────────────────┐
│              Service Mesh               │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Service  │  │ Service  │  │Service ││
│  │   + Proxy│  │   + Proxy│  │ + Proxy││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
```
- Traffic management
- Service discovery
- Load balancing
- Circuit breaking

### Circuit Breaker
```
Closed → (failures) → Open → (timeout) → Half-Open
  ↑                                          │
  └──────────── (success) ──────────────────┘
```
- Prevent cascade failures
- Fast fail when downstream unhealthy
- Automatic recovery

### Bulkhead
- Isolate resources per service/tenant
- Prevent one failure from affecting all
- Example: Separate thread pools

---

## Scaling Decision Matrix

| Scale | Users | Pattern | Components |
|-------|-------|---------|------------|
| Small | < 10K | Single server + CDN | 1 server, 1 DB |
| Medium | 10K-100K | Load balancer + Replicas | 2-4 servers, read replicas |
| Large | 100K-1M | Microservices + Sharding | Service mesh, sharded DB |
| Massive | > 1M | Multi-region + Edge | Global LB, edge computing |

---

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Premature scaling | Complexity before needed | Start simple, scale when metrics demand |
| Single database | Scaling bottleneck | Plan for read replicas early |
| Synchronous everything | Latency compounds | Use async where possible |
| No caching strategy | Database overload | Cache early and often |
| Stateful services | Horizontal scaling blocked | Externalize state (Redis, DB) |
