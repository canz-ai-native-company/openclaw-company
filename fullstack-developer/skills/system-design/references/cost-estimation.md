# Cloud Cost Estimation Guide

## Cost Categories

### 1. Compute Costs

#### EC2 / Virtual Machines
| Instance Type | vCPU | Memory | Use Case | Monthly Cost (US) |
|---------------|------|--------|----------|-------------------|
| t3.micro | 2 | 1 GB | Dev/test | $8 |
| t3.small | 2 | 2 GB | Light API | $15 |
| t3.medium | 2 | 4 GB | Standard API | $30 |
| t3.large | 2 | 8 GB | Medium load | $60 |
| m5.large | 2 | 8 GB | Production | $70 |
| m5.xlarge | 4 | 16 GB | High load | $140 |
| m5.2xlarge | 8 | 32 GB | Heavy compute | $280 |

#### Savings Options
| Option | Discount | Commitment |
|--------|----------|------------|
| On-Demand | 0% | None |
| Reserved 1yr | 30-40% | 1 year |
| Reserved 3yr | 50-60% | 3 years |
| Spot | 60-90% | Can be interrupted |

#### Containers (ECS/EKS)
- Add 10-20% overhead for orchestration
- Fargate: ~20% more than EC2
- EKS: $73/month per cluster + compute

---

### 2. Database Costs

#### RDS (Managed PostgreSQL/MySQL)
| Instance | vCPU | Memory | Storage | Monthly Cost |
|----------|------|--------|---------|--------------|
| db.t3.micro | 2 | 1 GB | 20 GB | $15 |
| db.t3.small | 2 | 2 GB | 50 GB | $30 |
| db.t3.medium | 2 | 4 GB | 100 GB | $70 |
| db.m5.large | 2 | 8 GB | 200 GB | $140 |
| db.m5.xlarge | 4 | 16 GB | 500 GB | $300 |

**Additional Costs:**
- Multi-AZ: 2x instance cost
- Read Replica: +100% per replica
- Storage: $0.10-0.20/GB/month
- Backup: Free up to DB size, then $0.02/GB

#### DynamoDB (NoSQL)
| Capacity Mode | Cost Model |
|---------------|------------|
| On-Demand | $1.25 per million writes, $0.25 per million reads |
| Provisioned | $0.00065 per WCU/hour, $0.00013 per RCU/hour |

**Storage:** $0.25/GB/month

---

### 3. Caching Costs

#### ElastiCache Redis
| Node Type | Memory | Monthly Cost |
|-----------|--------|--------------|
| cache.t3.micro | 0.5 GB | $13 |
| cache.t3.small | 1.5 GB | $25 |
| cache.t3.medium | 3 GB | $50 |
| cache.m5.large | 6.4 GB | $120 |
| cache.r5.large | 13 GB | $175 |

**Additional:**
- Multi-AZ: 2x for failover
- Backup: $0.02/GB

---

### 4. Storage Costs

#### S3 Object Storage
| Storage Class | Cost/GB/Month | Access Cost |
|---------------|---------------|-------------|
| Standard | $0.023 | $0.0004/1K requests |
| Intelligent-Tiering | $0.0025-0.023 | Auto-tiered |
| Standard-IA | $0.0125 | Higher retrieval |
| Glacier | $0.004 | Hours to retrieve |
| Glacier Deep | $0.00099 | 12-48 hours |

#### EBS (Block Storage)
| Type | Cost/GB/Month | Use Case |
|------|---------------|----------|
| gp3 | $0.08 | General purpose |
| io2 | $0.125 | High IOPS |
| st1 | $0.045 | Throughput |
| sc1 | $0.015 | Cold storage |

---

### 5. Network Costs

| Traffic Type | Cost |
|--------------|------|
| Inbound | Free |
| Outbound to Internet | $0.09/GB (first 10TB) |
| Inter-region | $0.02/GB |
| Same region, different AZ | $0.01/GB |
| Same AZ | Free |

#### Load Balancer
| Type | Monthly Cost | Per GB |
|------|--------------|--------|
| ALB | $22 + $0.008/GB | LCU hours |
| NLB | $22 + $0.006/GB | LCU hours |
| API Gateway | $3.50/million requests | - |

---

### 6. CDN Costs

#### CloudFront
| Data Transfer | Cost/GB |
|---------------|---------|
| First 10 TB | $0.085 |
| Next 40 TB | $0.080 |
| Next 100 TB | $0.060 |
| > 150 TB | $0.040 |

**Requests:** $0.0075-0.01 per 10,000

---

### 7. Monitoring & Logging

| Service | Free Tier | Then |
|---------|-----------|------|
| CloudWatch Metrics | 10 custom | $0.30/metric |
| CloudWatch Logs | 5 GB/month | $0.50/GB |
| CloudWatch Alarms | 10 | $0.10/alarm |
| X-Ray Traces | 100K | $5/million |

---

## Cost Estimation Templates

### Small Application (< 10K users)

| Component | Specification | Monthly |
|-----------|---------------|---------|
| Compute | 2× t3.small | $30 |
| Database | db.t3.small | $30 |
| Cache | cache.t3.micro | $13 |
| Load Balancer | ALB | $25 |
| Storage | 50 GB S3 | $2 |
| Monitoring | Basic | $20 |
| **Total** | | **$120** |

---

### Medium Application (10K-100K users)

| Component | Specification | Monthly |
|-----------|---------------|---------|
| Compute | 4× t3.large | $240 |
| Database | db.m5.large + replica | $280 |
| Cache | cache.m5.large | $120 |
| Load Balancer | ALB | $50 |
| Storage | 500 GB S3 | $12 |
| CDN | 1 TB/month | $85 |
| Monitoring | CloudWatch + X-Ray | $100 |
| **Total** | | **$887** |

---

### Large Application (100K-1M users)

| Component | Specification | Monthly |
|-----------|---------------|---------|
| Compute | 10× m5.xlarge | $1,400 |
| Database | db.m5.2xlarge Multi-AZ + 2 replicas | $1,680 |
| Cache | 3× cache.r5.large cluster | $525 |
| Load Balancer | ALB + NLB | $100 |
| Storage | 5 TB S3 | $115 |
| CDN | 10 TB/month | $800 |
| Queue | SQS/SNS | $50 |
| Search | Elasticsearch | $300 |
| Monitoring | Full observability | $300 |
| **Total** | | **$5,270** |

---

## Cost Optimization Strategies

### Immediate Wins
1. **Right-size instances** - Use CloudWatch to identify underutilized
2. **Reserved Instances** - For stable workloads (30-60% savings)
3. **Spot Instances** - For fault-tolerant workloads (60-90% savings)
4. **Auto-scaling** - Scale down during off-peak

### Medium-term
1. **Graviton instances** - 20% better price/performance
2. **S3 lifecycle policies** - Move to cheaper tiers
3. **Database optimization** - Reduce instance size with better queries
4. **CDN caching** - Reduce origin traffic

### Architecture Changes
1. **Serverless** - Pay only for execution
2. **Multi-region with local edge** - Reduce data transfer
3. **Data compression** - Reduce storage and transfer
4. **Cache everything** - Reduce compute and database load

---

## Cost per User Benchmarks

| Application Type | Cost/1000 MAU/month |
|------------------|---------------------|
| Static website | $0.50-2 |
| Simple API | $2-10 |
| E-commerce | $10-50 |
| Social platform | $5-25 |
| Video streaming | $50-200 |
| Gaming | $20-100 |

---

## Cost Monitoring Checklist

- [ ] Cost allocation tags applied
- [ ] Budget alerts configured
- [ ] Unused resources identified
- [ ] Reserved instance coverage reviewed
- [ ] Savings Plans evaluated
- [ ] Data transfer costs analyzed
- [ ] Storage lifecycle policies set
- [ ] Right-sizing recommendations reviewed
