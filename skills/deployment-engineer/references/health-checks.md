# Health Check Patterns

## Health Check Types

| Type | Purpose | Frequency | Action on Failure |
|------|---------|-----------|-------------------|
| **Liveness** | Is the app running? | 10-30s | Restart container |
| **Readiness** | Can it serve traffic? | 5-10s | Remove from load balancer |
| **Startup** | Has it started successfully? | Once | Delay other probes |

## Basic Health Endpoint

### Node.js/Express

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version
  });
});
```

### Next.js API Route

```typescript
// pages/api/health.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
}
```

### FastAPI

```python
from fastapi import FastAPI
from datetime import datetime

app = FastAPI()

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }
```

## Comprehensive Health Check

### With Dependency Checks

```typescript
// health.ts
interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, CheckResult>;
  timestamp: string;
}

interface CheckResult {
  status: 'pass' | 'fail';
  responseTime?: number;
  error?: string;
}

async function healthCheck(): Promise<HealthStatus> {
  const checks: Record<string, CheckResult> = {};

  // Database check
  checks.database = await checkDatabase();

  // Redis check
  checks.redis = await checkRedis();

  // External API check
  checks.externalApi = await checkExternalApi();

  const allPassing = Object.values(checks).every(c => c.status === 'pass');
  const anyFailing = Object.values(checks).some(c => c.status === 'fail');

  return {
    status: allPassing ? 'healthy' : anyFailing ? 'unhealthy' : 'degraded',
    checks,
    timestamp: new Date().toISOString()
  };
}

async function checkDatabase(): Promise<CheckResult> {
  const start = Date.now();
  try {
    await db.query('SELECT 1');
    return { status: 'pass', responseTime: Date.now() - start };
  } catch (error) {
    return { status: 'fail', error: error.message };
  }
}
```

### FastAPI Comprehensive

```python
from fastapi import FastAPI, Response
from datetime import datetime
import asyncio

app = FastAPI()

async def check_database():
    try:
        await db.execute("SELECT 1")
        return {"status": "pass"}
    except Exception as e:
        return {"status": "fail", "error": str(e)}

async def check_redis():
    try:
        await redis.ping()
        return {"status": "pass"}
    except Exception as e:
        return {"status": "fail", "error": str(e)}

@app.get("/health")
async def health_check():
    checks = await asyncio.gather(
        check_database(),
        check_redis(),
        return_exceptions=True
    )

    results = {
        "database": checks[0],
        "redis": checks[1]
    }

    all_pass = all(c.get("status") == "pass" for c in results.values())

    return {
        "status": "healthy" if all_pass else "unhealthy",
        "checks": results,
        "timestamp": datetime.utcnow().isoformat()
    }
```

## Kubernetes Probes

### Pod Spec

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: app
    image: myapp:latest
    ports:
    - containerPort: 3000

    livenessProbe:
      httpGet:
        path: /health/live
        port: 3000
      initialDelaySeconds: 30
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3

    readinessProbe:
      httpGet:
        path: /health/ready
        port: 3000
      initialDelaySeconds: 5
      periodSeconds: 5
      timeoutSeconds: 3
      failureThreshold: 3

    startupProbe:
      httpGet:
        path: /health/startup
        port: 3000
      initialDelaySeconds: 0
      periodSeconds: 5
      failureThreshold: 30
```

### Separate Endpoints

```typescript
// Liveness - just check if app is running
app.get('/health/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

// Readiness - check if dependencies are available
app.get('/health/ready', async (req, res) => {
  try {
    await checkDependencies();
    res.status(200).json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: error.message });
  }
});

// Startup - one-time initialization check
app.get('/health/startup', (req, res) => {
  if (appInitialized) {
    res.status(200).json({ status: 'started' });
  } else {
    res.status(503).json({ status: 'starting' });
  }
});
```

## Docker Health Checks

### Dockerfile

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

### docker-compose.yml

```yaml
services:
  app:
    image: myapp:latest
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Custom Health Check Script

```bash
#!/bin/sh
# healthcheck.sh

response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)

if [ "$response" = "200" ]; then
  exit 0
else
  exit 1
fi
```

## Load Balancer Health Checks

### AWS ALB

```yaml
TargetGroup:
  Type: AWS::ElasticLoadBalancingV2::TargetGroup
  Properties:
    HealthCheckPath: /health
    HealthCheckIntervalSeconds: 30
    HealthCheckTimeoutSeconds: 5
    HealthyThresholdCount: 2
    UnhealthyThresholdCount: 3
    Matcher:
      HttpCode: 200
```

### Nginx Upstream

```nginx
upstream backend {
    server app1:3000;
    server app2:3000;

    # Health check (nginx plus)
    health_check interval=5s fails=3 passes=2;
}

# Passive health check (open source)
upstream backend {
    server app1:3000 max_fails=3 fail_timeout=30s;
    server app2:3000 max_fails=3 fail_timeout=30s;
}
```

## CLI Health Checks

### curl

```bash
# Basic check
curl -f http://localhost:3000/health || exit 1

# With timeout
curl -f --max-time 10 http://localhost:3000/health

# Check specific response
curl -s http://localhost:3000/health | grep -q '"status":"healthy"'

# Full response with headers
curl -i http://localhost:3000/health
```

### wget

```bash
wget -q --spider http://localhost:3000/health || exit 1
```

## Response Format Standards

### Simple Response

```json
{
  "status": "healthy"
}
```

### Detailed Response

```json
{
  "status": "healthy",
  "version": "1.2.3",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 86400,
  "checks": {
    "database": {
      "status": "pass",
      "responseTime": 5
    },
    "cache": {
      "status": "pass",
      "responseTime": 1
    }
  }
}
```

### Unhealthy Response

```json
{
  "status": "unhealthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "checks": {
    "database": {
      "status": "fail",
      "error": "Connection timeout"
    },
    "cache": {
      "status": "pass"
    }
  }
}
```

## Best Practices

| Practice | Rationale |
|----------|-----------|
| Use separate liveness/readiness | Different failure actions |
| Include timestamps | Debug timing issues |
| Log health check failures | Detect patterns |
| Set appropriate timeouts | Avoid cascading failures |
| Don't include secrets | Health endpoints may be public |
| Cache dependency checks | Reduce load on dependencies |
| Use circuit breakers | Prevent health check storms |
