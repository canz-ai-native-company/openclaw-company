# Caching Strategies

Speed up CI/CD pipelines with effective dependency caching.

---

## Why Cache?

| Without Cache | With Cache |
|---------------|------------|
| 2-5 min npm install | 5-15 sec restore |
| 1-2 min pip install | 3-10 sec restore |
| 5-10 min docker build | 30 sec - 2 min |

**Average CI time reduction: 40-60%**

---

## actions/cache@v4

### Basic Usage
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-
```

### Cache Parameters

| Parameter | Description |
|-----------|-------------|
| `path` | Directory/files to cache |
| `key` | Exact match key for cache |
| `restore-keys` | Fallback keys (prefix match) |
| `enableCrossOsArchive` | Share cache across OS |
| `fail-on-cache-miss` | Fail if no cache found |

---

## Node.js Caching

### npm (Built-in to setup-node)
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'  # Automatic caching!
```

### npm (Manual - More Control)
```yaml
- name: Get npm cache directory
  id: npm-cache-dir
  run: echo "dir=$(npm config get cache)" >> $GITHUB_OUTPUT

- uses: actions/cache@v4
  with:
    path: ${{ steps.npm-cache-dir.outputs.dir }}
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-

- run: npm ci
```

### pnpm
```yaml
- uses: pnpm/action-setup@v3
  with:
    version: 9

- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'pnpm'

- run: pnpm install --frozen-lockfile
```

### Yarn
```yaml
- name: Get Yarn cache directory
  id: yarn-cache
  run: echo "dir=$(yarn cache dir)" >> $GITHUB_OUTPUT

- uses: actions/cache@v4
  with:
    path: ${{ steps.yarn-cache.outputs.dir }}
    key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
    restore-keys: |
      ${{ runner.os }}-yarn-
```

---

## Python Caching

### pip (Built-in to setup-python)
```yaml
- uses: actions/setup-python@v5
  with:
    python-version: '3.12'
    cache: 'pip'  # Automatic caching!
```

### pip (Manual)
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
    restore-keys: |
      ${{ runner.os }}-pip-
```

### Poetry
```yaml
- uses: actions/setup-python@v5
  with:
    python-version: '3.12'
    cache: 'poetry'

- run: poetry install --no-interaction
```

### Virtual Environment Caching
```yaml
- uses: actions/cache@v4
  with:
    path: .venv
    key: ${{ runner.os }}-venv-${{ hashFiles('**/requirements.txt') }}

- name: Install dependencies
  run: |
    python -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
```

---

## Docker Caching

### Docker Layer Caching (Buildx)
```yaml
- uses: docker/setup-buildx-action@v3

- uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: myapp:latest
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

### Registry-Based Caching
```yaml
- uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: myapp:latest
    cache-from: type=registry,ref=myapp:cache
    cache-to: type=registry,ref=myapp:cache,mode=max
```

---

## Multi-Path Caching

Cache multiple directories:
```yaml
- uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      ~/.cache/Cypress
      node_modules
    key: ${{ runner.os }}-deps-${{ hashFiles('**/package-lock.json') }}
```

---

## Cache Key Strategies

### By Lockfile (Recommended)
```yaml
key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
```

### By Week (Time-based)
```yaml
key: ${{ runner.os }}-npm-week-${{ github.run_number / 7 }}
```

### By Branch
```yaml
key: ${{ runner.os }}-npm-${{ github.ref }}-${{ hashFiles('**/package-lock.json') }}
restore-keys: |
  ${{ runner.os }}-npm-${{ github.ref }}-
  ${{ runner.os }}-npm-refs/heads/main-
  ${{ runner.os }}-npm-
```

---

## Cache Hit Detection

```yaml
- uses: actions/cache@v4
  id: cache
  with:
    path: node_modules
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}

- name: Install dependencies
  if: steps.cache.outputs.cache-hit != 'true'
  run: npm ci
```

---

## Cache Limits

| Limit | Value |
|-------|-------|
| Max cache size | 10 GB per repo |
| Max single cache | 10 GB |
| Cache retention | 7 days unused |
| Max caches | Evicts oldest when full |

---

## Best Practices

### DO
- Cache dependencies, not build outputs
- Use lockfile hashes in keys
- Provide restore-keys for partial matches
- Clean caches periodically

### DON'T
- Cache node_modules directly (use npm cache)
- Use timestamps in cache keys
- Cache large binaries that rarely change
- Forget restore-keys

---

## Complete Example

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      # Node.js with npm caching
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # Cypress binary cache
      - uses: actions/cache@v4
        with:
          path: ~/.cache/Cypress
          key: cypress-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}

      # Playwright browsers cache
      - uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}

      - run: npm ci
      - run: npm run build
```
