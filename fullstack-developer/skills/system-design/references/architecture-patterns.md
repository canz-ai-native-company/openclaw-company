# Architecture Patterns Reference

## Monolithic Architecture

```
┌────────────────────────────────────────┐
│              Application               │
│  ┌──────────┬──────────┬──────────┐   │
│  │   UI     │  Business │   Data   │   │
│  │  Layer   │   Logic   │  Access  │   │
│  └──────────┴──────────┴──────────┘   │
└────────────────────────────────────────┘
                    │
                    ▼
            ┌──────────────┐
            │   Database   │
            └──────────────┘
```

### When to Use
- < 10K users
- Small team (1-5 developers)
- MVP or prototype
- Simple domain logic
- Quick time to market needed

### Pros
- Simple to develop and deploy
- Easy to debug and test
- Low operational overhead
- Good for small teams

### Cons
- Scaling is limited (vertical only)
- Deployment coupling (all or nothing)
- Technology lock-in
- Single point of failure

### Scaling Triggers
Move away from monolith when:
- Team size > 10 developers
- Deploy frequency conflicts
- Performance bottlenecks
- Different components need different scaling

---

## Microservices Architecture

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐
│ Client  │────▶│  API Gateway │────▶│ Auth Service│
└─────────┘     └─────────────┘     └─────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│User Service │ │Order Service│ │Product Svc  │
└─────────────┘ └─────────────┘ └─────────────┘
        │             │             │
        ▼             ▼             ▼
   ┌────────┐    ┌────────┐    ┌────────┐
   │ DB 1   │    │ DB 2   │    │ DB 3   │
   └────────┘    └────────┘    └────────┘
```

### When to Use
- > 100K users
- Multiple teams (5+ developers each)
- Complex domain with clear boundaries
- Independent scaling requirements
- High availability requirements

### Pros
- Independent scaling per service
- Team autonomy
- Technology flexibility
- Fault isolation
- Independent deployments

### Cons
- Network complexity
- Distributed system challenges
- Operational overhead
- Data consistency challenges
- Requires DevOps maturity

### Service Design Guidelines
1. **Single Responsibility**: One business capability per service
2. **Bounded Context**: Clear domain boundaries
3. **Data Ownership**: Each service owns its data
4. **API First**: Define contracts before implementation
5. **Smart Endpoints, Dumb Pipes**: Logic in services, not middleware

---

## Event-Driven Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Producer   │────▶│ Message Bus │────▶│  Consumer   │
│  Service    │     │ (Kafka/SQS) │     │  Service    │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                          ├────────────────┐
                          ▼                ▼
                   ┌─────────────┐  ┌─────────────┐
                   │  Consumer 2 │  │  Consumer 3 │
                   └─────────────┘  └─────────────┘
```

### When to Use
- Asynchronous processing needed
- Decoupled services
- Event sourcing requirements
- Real-time data pipelines
- High throughput scenarios

### Pros
- Loose coupling
- Scalable consumers
- Event replay capability
- Temporal decoupling

### Cons
- Eventual consistency
- Debugging complexity
- Message ordering challenges
- Infrastructure overhead

### Event Design Guidelines
1. **Immutable Events**: Events represent facts that happened
2. **Self-Contained**: Include all necessary context
3. **Versioned**: Plan for schema evolution
4. **Idempotent Handlers**: Handle duplicate events safely

---

## Serverless Architecture

```
┌─────────┐     ┌──────────────┐     ┌─────────────┐
│ Client  │────▶│ API Gateway  │────▶│  Lambda     │
└─────────┘     └──────────────┘     │  Functions  │
                                     └──────┬──────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    ▼                       ▼                       ▼
             ┌──────────┐           ┌──────────────┐         ┌──────────┐
             │ DynamoDB │           │     S3       │         │   SQS    │
             └──────────┘           └──────────────┘         └──────────┘
```

### When to Use
- Variable/unpredictable traffic
- Startup with limited ops capacity
- Event-triggered workloads
- Cost-sensitive applications
- Rapid prototyping

### Pros
- No server management
- Auto-scaling
- Pay-per-use pricing
- Rapid development

### Cons
- Cold start latency
- Vendor lock-in
- Limited execution time
- Debugging challenges
- State management complexity

---

## Layered Architecture

```
┌─────────────────────────────────────┐
│        Presentation Layer           │
│    (UI, API Controllers, Views)     │
├─────────────────────────────────────┤
│         Application Layer           │
│   (Use Cases, Business Logic)       │
├─────────────────────────────────────┤
│          Domain Layer               │
│  (Entities, Value Objects, Rules)   │
├─────────────────────────────────────┤
│       Infrastructure Layer          │
│  (Database, External Services)      │
└─────────────────────────────────────┘
```

### When to Use
- Traditional enterprise applications
- Clear separation of concerns needed
- Team with different specializations
- Testability is priority

### Layer Rules
1. **Dependency Direction**: Upper layers depend on lower
2. **No Skipping**: Don't bypass layers
3. **Interface Segregation**: Communicate through interfaces

---

## CQRS (Command Query Responsibility Segregation)

```
                    ┌─────────────┐
                    │   Client    │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │                         │
              ▼                         ▼
      ┌───────────────┐         ┌───────────────┐
      │   Commands    │         │    Queries    │
      │   (Writes)    │         │   (Reads)     │
      └───────┬───────┘         └───────┬───────┘
              │                         │
              ▼                         ▼
      ┌───────────────┐         ┌───────────────┐
      │  Write Model  │────────▶│  Read Model   │
      │  (Normalized) │  sync   │ (Denormalized)│
      └───────────────┘         └───────────────┘
```

### When to Use
- Read/write ratio is very skewed
- Complex domain with reporting needs
- Different scaling needs for reads/writes
- Event sourcing implementation

### Pros
- Optimized read/write models
- Independent scaling
- Simplified queries

### Cons
- Eventual consistency
- Increased complexity
- Data synchronization overhead

---

## Architecture Decision Matrix

| Factor | Monolith | Microservices | Serverless | Event-Driven |
|--------|----------|---------------|------------|--------------|
| **Users** | < 10K | > 100K | Variable | Any |
| **Team Size** | 1-10 | 10+ | 1-5 | 5+ |
| **Complexity** | Low | High | Medium | High |
| **Scaling** | Vertical | Horizontal | Auto | Horizontal |
| **Cost** | Low | High | Pay-per-use | Medium |
| **Ops Overhead** | Low | High | None | Medium |
| **Time to Market** | Fast | Slow | Fast | Medium |
