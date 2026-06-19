# Scale Estimation Formulas

## Traffic Estimation

### Daily Active Users (DAU)

```
DAU = Total Registered Users × Activity Rate
```

| User Type | Typical Activity Rate |
|-----------|----------------------|
| Social media | 30-50% |
| E-commerce | 10-20% |
| SaaS B2B | 40-60% |
| Gaming | 20-40% |
| News/Content | 15-25% |

**Example:**
```
Total Users: 1,000,000
Activity Rate: 20%
DAU = 1,000,000 × 0.20 = 200,000 DAU
```

---

### Queries Per Second (QPS)

```
Average QPS = DAU × Actions per User per Day / 86,400 seconds
Peak QPS = Average QPS × Peak Multiplier
```

| Application Type | Actions/User/Day | Peak Multiplier |
|-----------------|------------------|-----------------|
| Read-heavy (news) | 20-50 | 2-3x |
| E-commerce | 10-30 | 5-10x (sales events) |
| Social media | 50-200 | 3-5x |
| Messaging | 100-500 | 2-3x |
| API service | Varies | 2-4x |

**Example:**
```
DAU: 200,000
Actions/User/Day: 50
Peak Multiplier: 3x

Average QPS = 200,000 × 50 / 86,400 = 116 QPS
Peak QPS = 116 × 3 = 348 QPS
```

---

### Concurrent Users

```
Concurrent Users = DAU × Average Session Duration / Seconds in Day
```

**Example:**
```
DAU: 200,000
Average Session: 10 minutes = 600 seconds
Seconds/Day: 86,400

Concurrent = 200,000 × 600 / 86,400 = 1,389 concurrent users
```

---

## Storage Estimation

### Data Volume

```
Daily Data = DAU × Data per User per Day
Annual Data = Daily Data × 365 × Growth Factor
```

| Data Type | Typical Size |
|-----------|-------------|
| Text record | 1-10 KB |
| User profile | 10-100 KB |
| Image | 100 KB - 5 MB |
| Video | 10 MB - 1 GB |
| Log entry | 100-500 bytes |

**Example:**
```
DAU: 200,000
Posts/User/Day: 2
Post Size: 5 KB (text + metadata)

Daily Data = 200,000 × 2 × 5 KB = 2 GB/day
Annual Data = 2 GB × 365 × 1.5 (growth) = 1.1 TB/year
```

---

### Database Size

```
Database Size = Records × Average Record Size × Index Overhead
Index Overhead = 1.2 to 2.0 (depending on indexes)
```

**Example:**
```
Users: 1,000,000
Record Size: 2 KB
Index Overhead: 1.5

DB Size = 1,000,000 × 2 KB × 1.5 = 3 GB
```

---

### Cache Size

```
Cache Size = Hot Data Percentage × Database Size
```

| Access Pattern | Hot Data % |
|---------------|------------|
| Uniform | 100% |
| 80/20 rule | 20% |
| Power law | 5-10% |

**Example:**
```
Database: 100 GB
Hot Data: 20%

Cache Size = 100 GB × 0.20 = 20 GB
```

---

## Bandwidth Estimation

### Bandwidth Requirements

```
Bandwidth = QPS × Average Response Size
```

**Example:**
```
QPS: 1,000
Response Size: 50 KB

Bandwidth = 1,000 × 50 KB = 50 MB/s = 400 Mbps
```

---

### CDN Estimation

```
CDN Traffic = Static Assets × Page Views × (1 - Cache Hit Rate)
```

**Example:**
```
Page Views: 10,000,000/day
Static per Page: 2 MB
Cache Hit Rate: 95%

Origin Traffic = 10M × 2 MB × 0.05 = 1 TB/day
```

---

## Compute Estimation

### Server Requirements

```
Servers = Peak QPS / QPS per Server
```

| Service Type | QPS per Server |
|-------------|----------------|
| API (CPU-bound) | 500-2000 |
| API (IO-bound) | 1000-5000 |
| Static files | 5000-20000 |
| Database | 1000-10000 |

**Example:**
```
Peak QPS: 10,000
QPS/Server: 2,000

Servers = 10,000 / 2,000 = 5 servers
Add 20% headroom = 6 servers
```

---

### Memory Requirements

```
Memory per Server = Application + Connections + Cache
Connection Memory = Max Connections × Memory per Connection
```

**Example:**
```
Application: 512 MB
Max Connections: 1,000
Memory/Connection: 256 KB
Local Cache: 1 GB

Memory = 512 MB + (1000 × 256 KB) + 1 GB = 1.75 GB
Recommended: 4 GB (2x headroom)
```

---

## Quick Reference Tables

### Scale Tiers

| Tier | Users | QPS | Servers | Database | Monthly Cost |
|------|-------|-----|---------|----------|--------------|
| Startup | < 1K | < 10 | 1 | Shared | $50-100 |
| Small | 1K-10K | 10-100 | 1-2 | Single | $100-500 |
| Medium | 10K-100K | 100-1K | 2-10 | Replicas | $500-2K |
| Large | 100K-1M | 1K-10K | 10-50 | Sharded | $2K-20K |
| Massive | > 1M | > 10K | 50+ | Multi-region | $20K+ |

### Common Ratios

| Metric | Typical Ratio |
|--------|---------------|
| Read:Write | 10:1 to 100:1 |
| Peak:Average | 2x to 10x |
| Cache:Database | 5:1 to 20:1 |
| Hot:Cold data | 20:80 |

### Time Conversions

| Period | Seconds |
|--------|---------|
| 1 minute | 60 |
| 1 hour | 3,600 |
| 1 day | 86,400 |
| 1 week | 604,800 |
| 1 month | 2,592,000 |
| 1 year | 31,536,000 |

---

## Estimation Worksheet

```markdown
## Project: [Name]

### Users
- Total Users: ___
- Activity Rate: ___%
- DAU: ___ = Total × Rate

### Traffic
- Actions/User/Day: ___
- Average QPS: ___ = DAU × Actions / 86400
- Peak Multiplier: ___x
- Peak QPS: ___ = Avg × Multiplier

### Storage
- Data/User/Day: ___ KB
- Daily Growth: ___ GB = DAU × Data/User
- Annual Storage: ___ TB = Daily × 365 × Growth

### Compute
- QPS/Server: ___
- Servers Needed: ___ = Peak QPS / QPS/Server
- With Headroom: ___ = Servers × 1.5

### Cache
- Hot Data %: ___%
- Cache Size: ___ GB = DB Size × Hot %

### Bandwidth
- Response Size: ___ KB
- Bandwidth: ___ Mbps = QPS × Size × 8 / 1000
```
