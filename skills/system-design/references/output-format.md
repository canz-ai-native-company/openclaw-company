# System Design Document Output Format

## Complete Document Structure

Use this format for the final system design deliverable.

```markdown
# System Design: [Project Name]

## 1. Executive Summary
- **Purpose:** [One-line description]
- **Scale:** [User/traffic expectations]
- **Key Decisions:** [Top 3 architectural choices]

---

## 2. Requirements Summary

### Functional Requirements
| ID | Requirement | Priority | Component |
|----|-------------|----------|-----------|
| FR-1 | [Requirement] | Must/Should/Could | [Component] |
| FR-2 | [Requirement] | Must/Should/Could | [Component] |

### Non-Functional Requirements
| Attribute | Requirement | Solution |
|-----------|-------------|----------|
| Scalability | [Target] | [Solution] |
| Availability | [Target] | [Solution] |
| Latency | [Target] | [Solution] |
| Security | [Target] | [Solution] |

---

## 3. Architecture Overview

### High-Level Diagram
[ASCII diagram of system architecture]

### Data Flow
1. [Step 1]
2. [Step 2]
3. [Step 3]

---

## 4. Component Details
[Use component-template.md for each component]

---

## 5. Architecture Decision Records
[Use adr-examples.md format for each major decision]

---

## 6. Infrastructure Estimate
| Component | Technology | Instances | Monthly Cost |
|-----------|------------|-----------|--------------|
| [Component] | [Tech] | [Count] | [$X] |
| **Total** | | | **$X** |

### Cost at Scale
| Users | Monthly Cost | Notes |
|-------|--------------|-------|
| [Scale 1] | [$X] | [Notes] |
| [Scale 2] | [$X] | [Notes] |

---

## 7. Scaling Roadmap
| Trigger | Action | Timeline |
|---------|--------|----------|
| [Metric threshold] | [Action] | [When] |

---

## 8. Monitoring & Observability
| Type | Tool | Purpose |
|------|------|---------|
| Metrics | [Tool] | [Purpose] |
| Logging | [Tool] | [Purpose] |
| Tracing | [Tool] | [Purpose] |

### Key Metrics
| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| [Metric] | [Target] | [Threshold] |

---

## 9. Security Considerations
| Layer | Measure |
|-------|---------|
| Network | [Measures] |
| Transport | [Measures] |
| Application | [Measures] |
| Data | [Measures] |

---

## 10. Open Questions
1. [Question 1]
2. [Question 2]
```

---

## Example: E-Commerce Platform

# System Design: ShopNow E-Commerce Platform

## 1. Executive Summary
- **Purpose:** Online marketplace enabling users to browse products, make purchases, and track orders
- **Scale:** 100K DAU, 10K concurrent users, 1M products, 50K orders/day
- **Key Decisions:** Microservices architecture, PostgreSQL per service, Redis caching layer

---

## 2. Requirements Summary

### Functional Requirements
| ID | Requirement | Priority | Component |
|----|-------------|----------|-----------|
| FR-1 | User registration and authentication | Must | Auth Service |
| FR-2 | Browse and search product catalog | Must | Product Service |
| FR-3 | Add products to shopping cart | Must | Cart Service |
| FR-4 | Process orders and payments | Must | Order Service, Payment Service |
| FR-5 | Track order status | Must | Order Service |
| FR-6 | Send order notifications | Should | Notification Service |
| FR-7 | Product reviews and ratings | Should | Review Service |
| FR-8 | Wishlist management | Could | User Service |

### Non-Functional Requirements
| Attribute | Requirement | Solution |
|-----------|-------------|----------|
| Scalability | 100K concurrent users | Horizontal scaling + CDN |
| Availability | 99.9% uptime | Multi-AZ deployment |
| Latency | < 200ms p95 API response | Redis caching + CDN |
| Security | PCI-DSS compliance | Encryption + tokenization |
| Performance | < 3s page load | CDN + code splitting |

---

## 3. Architecture Overview

### High-Level Diagram

```
                         ┌─────────────┐
                         │     CDN     │
                         │ (CloudFront)│
                         └──────┬──────┘
                                │
┌─────────────┐              ┌──▼───────────┐
│   Client    │─────────────▶│Load Balancer │
│ (Web/Mobile)│              │    (ALB)     │
└─────────────┘              └──────┬───────┘
                                    │
                             ┌──────▼──────┐
                             │ API Gateway │
                             │   (Kong)    │
                             └──────┬──────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│  Auth Service │           │Product Service│           │ Order Service │
│  (Node.js)    │           │  (Node.js)    │           │  (Node.js)    │
└───────┬───────┘           └───────┬───────┘           └───────┬───────┘
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│   Users DB    │           │  Products DB  │           │   Orders DB   │
│ (PostgreSQL)  │           │ (PostgreSQL)  │           │ (PostgreSQL)  │
└───────────────┘           └───────┬───────┘           └───────────────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │  Redis Cache  │
                            │  (ElastiCache)│
                            └───────────────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │ Message Queue │
                            │    (SQS)      │
                            └───────────────┘
```

### Data Flow

1. Client request → CDN (static assets) or Load Balancer (API)
2. Load Balancer → API Gateway (auth, rate limiting, routing)
3. API Gateway validates JWT → routes to appropriate service
4. Service checks Redis cache → if miss, queries database
5. Write operations publish events to message queue
6. Response flows back through same path

---

## 4. Component Details

### Component: API Gateway

**Responsibility:** Route requests, authenticate, rate limit, transform requests.

**Technology:** Kong
**Justification:** Open-source, plugin ecosystem, team experience.

**Interfaces:**
- **Input:** HTTPS requests from clients
- **Output:** Routed requests to services
- **Dependencies:** Auth Service (JWT validation)

**Scaling Strategy:**
- **Horizontal:** 2-4 instances
- **Vertical:** N/A
- **Trigger:** > 2000 RPS

**Failure Mode:**
- **Detection:** Health checks, 5xx rate
- **Impact:** All API requests fail
- **Recovery:** Auto-restart, failover
- **Fallback:** Direct service access (emergency)

**Data:**
- **Volume:** Logs only (~1GB/day)
- **Retention:** 30 days

**Cost Estimate:** Medium ($100-200/month)

---

[Additional components follow same template...]

---

## 5. Architecture Decision Records

### ADR-001: Microservices vs Monolith

**Status:** Accepted

**Context:** Building e-commerce platform for 100K users with multiple teams.

**Decision:** Microservices with 5 core services.

**Options Considered:**
| Option | Pros | Cons | Cost |
|--------|------|------|------|
| Monolith | Simple, fast dev | Scaling limits | Low |
| Microservices | Independent scaling | Complexity | Medium |

**Rationale:** Team size (15 devs), independent scaling needs, fault isolation.

**Consequences:**
- Positive: Team autonomy, independent deployment
- Negative: Network complexity, distributed debugging
- Risks: Learning curve for distributed systems

---

### ADR-002: PostgreSQL for All Services

**Status:** Accepted

**Context:** Need to choose database technology.

**Decision:** PostgreSQL for all services with database-per-service pattern.

**Rationale:** ACID for orders/payments, JSON for flexible product attributes, team expertise.

---

## 6. Infrastructure Estimate

| Component | Technology | Instances | Monthly Cost |
|-----------|------------|-----------|--------------|
| API Gateway | Kong | 2 | $100 |
| Auth Service | ECS | 2 | $80 |
| Product Service | ECS | 4 | $160 |
| Order Service | ECS | 2 | $80 |
| Cart Service | ECS | 2 | $80 |
| Users DB | RDS PostgreSQL | 1 | $70 |
| Products DB | RDS PostgreSQL | 1 + replica | $140 |
| Orders DB | RDS PostgreSQL | 1 | $70 |
| Redis Cache | ElastiCache | 1 | $100 |
| Load Balancer | ALB | 1 | $30 |
| CDN | CloudFront | - | $100 |
| Queue | SQS | - | $20 |
| Monitoring | CloudWatch | - | $50 |
| **Total** | | | **$1,080/month** |

### Cost at Scale
| Users | Monthly Cost | Notes |
|-------|--------------|-------|
| 10K | $720 | Base infrastructure |
| 50K | $1,200 | +instances, +replicas |
| 100K | $2,000 | +caching, +CDN |
| 500K | $5,000 | Significant scaling |

---

## 7. Scaling Roadmap

| Trigger | Action | Timeline |
|---------|--------|----------|
| > 10K DAU | Add read replicas to Products DB | Week 1-2 |
| > 50K DAU | Add Elasticsearch for product search | Week 2-4 |
| > 100K DAU | Implement edge caching, expand CDN | Month 2 |
| > 500K DAU | Database sharding | Month 3-4 |
| > 1M DAU | Multi-region deployment | Month 6+ |

---

## 8. Monitoring & Observability

| Type | Tool | Purpose |
|------|------|---------|
| Metrics | Prometheus + Grafana | System metrics, dashboards |
| Logging | ELK Stack | Centralized logs, search |
| Tracing | Jaeger | Distributed tracing |
| Alerting | PagerDuty | On-call notifications |
| APM | Datadog | Application performance |

### Key Metrics
| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| API Latency (p95) | < 200ms | > 500ms |
| Error Rate | < 0.1% | > 1% |
| Uptime | 99.9% | < 99.5% |
| Order Success Rate | > 99% | < 95% |
| Cache Hit Rate | > 90% | < 70% |

---

## 9. Security Considerations

| Layer | Measure |
|-------|---------|
| Network | VPC, security groups, private subnets, WAF |
| Transport | TLS 1.3 everywhere |
| Application | JWT auth, input validation, OWASP Top 10 |
| Data | Encryption at rest (AES-256), tokenization for payments |
| Access | IAM roles, least privilege |
| Audit | CloudTrail, access logs, compliance reporting |

---

## 10. Open Questions

1. **Payment Provider:** Stripe vs Braintree? (affects Payment Service design)
2. **Search Complexity:** Basic PostgreSQL search vs Elasticsearch?
3. **Notification Channels:** Email only vs Email + SMS + Push?
4. **Multi-region:** Required for launch or future phase?
5. **Analytics:** Real-time dashboard requirements?

---

## Design Verification Checklist

### Functional Completeness
- [x] All FR mapped to components
- [x] All user flows documented
- [x] Data flows specified

### Quality Attributes
- [x] Scalability strategy per component
- [x] Availability measures defined
- [x] Performance targets specified
- [x] Security measures documented
- [x] Cost estimates provided

### Documentation
- [x] ADR for each major decision
- [x] Component specifications complete
- [x] Scaling roadmap defined
- [x] Monitoring strategy specified

### Handoff Ready
- [x] Database schema can be designed
- [x] API contracts can be defined
- [x] Open questions documented
