# FastAPI Production Deployment

## ASGI Server Selection

| Server | Use Case | Workers |
|--------|----------|---------|
| Uvicorn | Development, single-worker | 1 |
| Gunicorn + Uvicorn | Production, multi-worker | CPU cores * 2 + 1 |
| Hypercorn | HTTP/2, Trio support | Configurable |

## Uvicorn Production

### Basic Production

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### With SSL

```bash
uvicorn main:app \
  --host 0.0.0.0 \
  --port 443 \
  --ssl-keyfile=/path/to/key.pem \
  --ssl-certfile=/path/to/cert.pem
```

### Configuration File

```python
# uvicorn_config.py
bind = "0.0.0.0:8000"
workers = 4
worker_class = "uvicorn.workers.UvicornWorker"
accesslog = "-"
errorlog = "-"
loglevel = "info"
```

## Gunicorn + Uvicorn

### Recommended Production Setup

```bash
gunicorn main:app \
  -w 4 \
  -k uvicorn.workers.UvicornWorker \
  -b 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile - \
  --capture-output \
  --log-level info
```

### Gunicorn Config File

```python
# gunicorn.conf.py
import multiprocessing

bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 50
accesslog = "-"
errorlog = "-"
loglevel = "info"
capture_output = True
enable_stdio_inheritance = True
```

### Run with Config

```bash
gunicorn main:app -c gunicorn.conf.py
```

## Systemd Service

### Service File

```ini
# /etc/systemd/system/fastapi.service
[Unit]
Description=FastAPI Application
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/app
Environment="PATH=/var/www/app/venv/bin"
EnvironmentFile=/var/www/app/.env
ExecStart=/var/www/app/venv/bin/gunicorn main:app \
  -w 4 \
  -k uvicorn.workers.UvicornWorker \
  -b 127.0.0.1:8000
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### Commands

```bash
# Enable and start
sudo systemctl enable fastapi
sudo systemctl start fastapi

# Check status
sudo systemctl status fastapi

# View logs
sudo journalctl -u fastapi -f

# Reload after config change
sudo systemctl daemon-reload
sudo systemctl restart fastapi
```

## Docker Deployment

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8000/health || exit 1

# Run with Gunicorn
CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/app
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=app
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d app"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

## Health Check Endpoint

```python
from fastapi import FastAPI, Response
from datetime import datetime

app = FastAPI()

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

@app.get("/health/live")
async def liveness():
    """Kubernetes liveness probe"""
    return {"status": "alive"}

@app.get("/health/ready")
async def readiness():
    """Kubernetes readiness probe - check dependencies"""
    # Check database, cache, etc.
    try:
        # await db.execute("SELECT 1")
        return {"status": "ready"}
    except Exception:
        return Response(status_code=503, content="Not ready")
```

## Nginx Reverse Proxy

```nginx
upstream fastapi {
    server 127.0.0.1:8000;
    keepalive 32;
}

server {
    listen 80;
    server_name api.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    location / {
        proxy_pass http://fastapi;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_buffering off;
    }

    location /health {
        proxy_pass http://fastapi/health;
        access_log off;
    }
}
```

## Scaling Patterns

### Horizontal Scaling

```yaml
# docker-compose.yml
services:
  api:
    build: .
    deploy:
      replicas: 4
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

### Worker Calculation

```python
# Formula: (2 * CPU cores) + 1
import multiprocessing
workers = multiprocessing.cpu_count() * 2 + 1
```

### Load Balancer (Nginx)

```nginx
upstream fastapi_pool {
    least_conn;
    server api1:8000 weight=5;
    server api2:8000 weight=5;
    server api3:8000 backup;
}
```

## Environment Variables

```python
# config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    redis_url: str = "redis://localhost:6379"
    secret_key: str
    debug: bool = False

    class Config:
        env_file = ".env"

settings = Settings()
```

### .env.production

```env
DATABASE_URL=postgresql://user:pass@db:5432/prod
REDIS_URL=redis://cache:6379
SECRET_KEY=your-production-secret
DEBUG=false
```

## Logging Configuration

```python
import logging
from fastapi import FastAPI

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = FastAPI()

@app.middleware("http")
async def log_requests(request, call_next):
    logger = logging.getLogger("api")
    logger.info(f"{request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"Status: {response.status_code}")
    return response
```

## Monitoring

### Prometheus Metrics

```python
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()
Instrumentator().instrument(app).expose(app)
```

### Structured Logging for ELK

```python
import structlog

structlog.configure(
    processors=[
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ]
)
```
