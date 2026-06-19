# Docker Best Practices

## Multi-Stage Builds

### Why Multi-Stage?

- Smaller final images (no build dependencies)
- Faster deployments
- Reduced attack surface

### Pattern: Build → Production

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

## Image Optimization

### Base Image Selection

| Use Case | Recommended Base |
|----------|------------------|
| Node.js | `node:20-alpine` |
| Python | `python:3.11-slim` |
| Go | `scratch` or `alpine` |
| General | `debian:bookworm-slim` |

### Layer Caching

```dockerfile
# Good: Dependencies first (cached when unchanged)
COPY package*.json ./
RUN npm ci
COPY . .

# Bad: Everything together (no cache benefit)
COPY . .
RUN npm ci
```

### .dockerignore

```
node_modules
.git
.env*
*.md
.next
dist
coverage
.nyc_output
```

## Security Best Practices

### Non-Root User

```dockerfile
# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Switch to non-root
USER nextjs
```

### No Secrets in Images

```dockerfile
# Bad: Secret in image layer
ENV API_KEY=secret123

# Good: Runtime injection
# docker run -e API_KEY=secret123 app
```

### Scan for Vulnerabilities

```bash
# Using Docker Scout
docker scout cves myimage:latest

# Using Trivy
trivy image myimage:latest
```

## Docker Compose Patterns

### Development vs Production

```yaml
# docker-compose.yml (base)
services:
  app:
    build: .
    environment:
      - NODE_ENV=production

# docker-compose.override.yml (dev, auto-loaded)
services:
  app:
    volumes:
      - .:/app
    environment:
      - NODE_ENV=development
```

### Production Compose

```yaml
version: '3.8'

services:
  app:
    image: myapp:${TAG:-latest}
    restart: unless-stopped
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

## Health Checks

### Dockerfile HEALTHCHECK

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

### Compose Health Check

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## Registry Operations

### Build and Push

```bash
# Tag for registry
docker build -t registry.example.com/app:v1.0.0 .

# Push
docker push registry.example.com/app:v1.0.0

# Multi-platform build
docker buildx build --platform linux/amd64,linux/arm64 \
  -t registry.example.com/app:v1.0.0 --push .
```

### Pull and Deploy

```bash
# Pull latest
docker pull registry.example.com/app:v1.0.0

# Deploy with compose
docker-compose pull && docker-compose up -d
```

## Resource Management

### Memory Limits

```yaml
deploy:
  resources:
    limits:
      memory: 512M
    reservations:
      memory: 256M
```

### CPU Limits

```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
    reservations:
      cpus: '0.25'
```

## Networking

### Service Discovery

```yaml
services:
  app:
    networks:
      - backend

  db:
    networks:
      - backend

networks:
  backend:
    driver: bridge
```

### Port Exposure

```yaml
# Expose to host
ports:
  - "3000:3000"

# Internal only (service-to-service)
expose:
  - "3000"
```

## Logging

### Structured Logging

```yaml
logging:
  driver: json-file
  options:
    max-size: "10m"
    max-file: "3"
    labels: "service,environment"
```

### View Logs

```bash
# Follow logs
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app

# With timestamps
docker-compose logs -t app
```

## Deployment Commands

```bash
# Full deployment cycle
docker-compose pull
docker-compose up -d --remove-orphans
docker-compose ps
docker-compose logs -f

# Zero-downtime update
docker-compose up -d --no-deps --build app

# Scale service
docker-compose up -d --scale app=3

# Cleanup
docker system prune -f
docker image prune -f
```

## Troubleshooting

| Issue | Command |
|-------|---------|
| Container won't start | `docker logs container_name` |
| Check resource usage | `docker stats` |
| Inspect container | `docker inspect container_name` |
| Shell into container | `docker exec -it container_name sh` |
| Check networks | `docker network ls` |
