# Quality Attributes Reference

## Overview

Quality attributes (non-functional requirements) define HOW the system should behave, not WHAT it should do.

---

## Scalability

### Definition
The system's ability to handle increased load by adding resources.

### Questions to Answer
- How does the system handle 10x current load?
- What are the scaling bottlenecks?
- Can components scale independently?
- What is the scaling strategy (horizontal/vertical)?

### Metrics
| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| Response time increase at 2x load | < 10% | 10-50% | > 50% |
| Resource utilization | 40-70% | 70-85% | > 85% |
| Scale-out time | < 2 min | 2-10 min | > 10 min |

### Design Patterns
- Horizontal scaling (stateless services)
- Load balancing
- Database sharding
- Caching layers
- CDN for static content
- Message queues for async processing

### Checklist
- [ ] Services are stateless (or state is externalized)
- [ ] Database scaling strategy defined (replicas, sharding)
- [ ] Caching strategy in place
- [ ] Async processing for non-critical paths
- [ ] Auto-scaling configured

---

## Availability

### Definition
The percentage of time the system is operational and accessible.

### SLA Targets
| Level | Uptime | Downtime/Year | Downtime/Month |
|-------|--------|---------------|----------------|
| 99% | Two nines | 3.65 days | 7.2 hours |
| 99.9% | Three nines | 8.76 hours | 43.8 min |
| 99.99% | Four nines | 52.56 min | 4.38 min |
| 99.999% | Five nines | 5.26 min | 26.3 sec |

### Questions to Answer
- What is the target uptime?
- What are single points of failure?
- What is the failover strategy?
- How is availability measured?

### Design Patterns
- Multi-AZ deployment
- Load balancer health checks
- Database replication
- Circuit breakers
- Graceful degradation
- Blue-green deployments

### Checklist
- [ ] No single points of failure
- [ ] Health checks implemented
- [ ] Failover tested
- [ ] Monitoring and alerting
- [ ] Disaster recovery plan

---

## Reliability

### Definition
The system's ability to perform its intended function consistently over time.

### Metrics
| Metric | Definition | Target |
|--------|------------|--------|
| MTBF | Mean Time Between Failures | Depends on SLA |
| MTTR | Mean Time To Recovery | < 15 minutes |
| Error Rate | Failures / Total Requests | < 0.1% |

### Questions to Answer
- What is the acceptable error rate?
- How long can recovery take?
- What data can never be lost?
- How are errors detected?

### Design Patterns
- Retry with exponential backoff
- Circuit breakers
- Idempotent operations
- Transaction logging
- Data replication
- Backup and restore

### Checklist
- [ ] Retry logic for transient failures
- [ ] Error handling at all boundaries
- [ ] Data backup strategy
- [ ] Recovery procedures documented
- [ ] Chaos testing performed

---

## Performance

### Definition
How fast and efficiently the system responds to requests.

### Metrics
| Metric | Good | Acceptable | Poor |
|--------|------|------------|------|
| API Latency (p50) | < 50ms | 50-200ms | > 200ms |
| API Latency (p95) | < 200ms | 200-500ms | > 500ms |
| API Latency (p99) | < 500ms | 500ms-1s | > 1s |
| Page Load | < 2s | 2-4s | > 4s |
| Time to First Byte | < 200ms | 200-500ms | > 500ms |

### Questions to Answer
- What are latency requirements per endpoint?
- What is acceptable throughput?
- Where are performance bottlenecks?
- How is performance monitored?

### Design Patterns
- Caching (Redis, CDN)
- Connection pooling
- Async processing
- Database indexing
- Query optimization
- Compression

### Checklist
- [ ] Performance targets defined per endpoint
- [ ] Caching strategy implemented
- [ ] Database queries optimized
- [ ] Performance monitoring in place
- [ ] Load testing performed

---

## Security

### Definition
Protection of data and systems from unauthorized access and attacks.

### Security Layers
| Layer | Measures |
|-------|----------|
| Network | VPC, firewalls, WAF, DDoS protection |
| Transport | TLS 1.3, certificate management |
| Application | Authentication, authorization, input validation |
| Data | Encryption at rest, access controls |
| Operations | Audit logs, secrets management |

### Questions to Answer
- How is authentication handled?
- What authorization model is used?
- How is sensitive data protected?
- What compliance standards apply?

### Design Patterns
- Zero trust architecture
- Defense in depth
- Principle of least privilege
- Secrets management (Vault, AWS Secrets Manager)
- OAuth 2.0 / OpenID Connect

### Compliance Standards
| Standard | Domain | Key Requirements |
|----------|--------|------------------|
| GDPR | Personal data | Consent, right to erasure |
| PCI-DSS | Payment data | Encryption, access control |
| HIPAA | Health data | PHI protection, audit trails |
| SOC 2 | Service org | Security, availability, confidentiality |

### Checklist
- [ ] Authentication mechanism defined
- [ ] Authorization model implemented
- [ ] Data encryption (transit and rest)
- [ ] Audit logging enabled
- [ ] Security testing performed
- [ ] Compliance requirements met

---

## Maintainability

### Definition
How easy it is to modify, update, and operate the system.

### Questions to Answer
- How are deployments handled?
- How is configuration managed?
- How easy is debugging?
- What is the release frequency?

### Design Patterns
- Infrastructure as Code
- CI/CD pipelines
- Feature flags
- Centralized logging
- Distributed tracing
- Configuration management

### Metrics
| Metric | Good | Target |
|--------|------|--------|
| Deploy frequency | Daily+ | Weekly |
| Lead time for changes | < 1 day | < 1 week |
| Change failure rate | < 5% | < 15% |
| MTTR | < 1 hour | < 4 hours |

### Checklist
- [ ] CI/CD pipeline established
- [ ] Logging and monitoring in place
- [ ] Documentation up to date
- [ ] Code is modular and testable
- [ ] Configuration externalized

---

## Cost Efficiency

### Definition
Achieving required quality attributes at optimal cost.

### Questions to Answer
- What is the infrastructure budget?
- How does cost scale with load?
- What are the cost optimization opportunities?
- How is cost monitored?

### Cost Components
| Component | Typical % | Optimization |
|-----------|-----------|--------------|
| Compute | 40-60% | Right-sizing, reserved instances |
| Database | 20-30% | Query optimization, archival |
| Network | 10-20% | CDN, compression |
| Storage | 5-15% | Tiered storage, lifecycle policies |

### Design Patterns
- Auto-scaling (scale down too)
- Reserved/spot instances
- CDN caching
- Data archival
- Serverless for variable loads

### Checklist
- [ ] Cost allocation tags
- [ ] Reserved instances for baseline
- [ ] Auto-scaling configured
- [ ] Unused resources identified
- [ ] Cost monitoring dashboard

---

## Quality Attributes Trade-off Matrix

| Optimizing For | May Decrease |
|----------------|--------------|
| Performance | Cost, Maintainability |
| Availability | Cost, Simplicity |
| Security | Performance, Usability |
| Scalability | Cost, Simplicity |
| Cost | Performance, Availability |

---

## Quality Attributes by System Type

| System Type | Primary Attributes | Secondary |
|-------------|-------------------|-----------|
| E-commerce | Availability, Performance | Scalability, Security |
| Banking | Security, Reliability | Availability, Auditability |
| Social Media | Scalability, Performance | Availability |
| Healthcare | Security, Compliance | Reliability, Auditability |
| Gaming | Performance, Scalability | Availability |
| Enterprise SaaS | Maintainability, Security | Scalability |
