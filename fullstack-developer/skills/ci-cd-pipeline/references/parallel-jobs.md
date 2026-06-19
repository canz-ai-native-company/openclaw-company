# Parallel Jobs

Optimize CI/CD pipelines with job parallelization and matrix strategies.

---

## Why Parallelize?

| Sequential | Parallel |
|------------|----------|
| Lint (2m) → Test (5m) → Build (3m) | Lint (2m) ┐ |
| Total: 10 minutes | Test (5m) ├→ Build (3m) |
| | Total: 8 minutes |

**Typical time savings: 20-50%**

---

## Independent Parallel Jobs

Jobs without dependencies run in parallel by default:

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - run: npm test

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - run: npm audit

  # All three run simultaneously!
```

---

## Job Dependencies

Use `needs` for sequential execution:

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint

  test:
    needs: lint  # Waits for lint
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  build:
    needs: lint  # Also waits for lint
    runs-on: ubuntu-latest
    steps:
      - run: npm run build

  deploy:
    needs: [test, build]  # Waits for both
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

### Dependency Graph
```
       ┌─────┐
       │lint │
       └──┬──┘
     ┌────┴────┐
     ▼         ▼
 ┌──────┐  ┌──────┐
 │ test │  │build │
 └───┬──┘  └──┬───┘
     └────┬───┘
          ▼
     ┌────────┐
     │ deploy │
     └────────┘
```

---

## Matrix Strategy

Run same job across multiple configurations:

### Basic Matrix
```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, windows-latest, macos-latest]

    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test

    # Creates 9 parallel jobs (3 versions × 3 OS)
```

### Matrix Controls

```yaml
strategy:
  fail-fast: false  # Don't cancel other jobs if one fails
  max-parallel: 4   # Limit concurrent jobs
  matrix:
    node: [18, 20, 22]
```

### Include Additional Configurations
```yaml
strategy:
  matrix:
    node: [18, 20]
    include:
      # Add specific configuration
      - node: 22
        os: ubuntu-latest
        experimental: true
      # Add extra variables to existing combo
      - node: 18
        npm-version: 9
```

### Exclude Configurations
```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18, 20, 22]
    exclude:
      # Skip Node 18 on Windows
      - os: windows-latest
        node: 18
```

---

## Test Sharding

Split test suites across parallel jobs:

### Jest Sharding
```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]

    steps:
      - uses: actions/checkout@v5
      - run: npm ci
      - run: npm test -- --shard=${{ matrix.shard }}/4
```

### Playwright Sharding
```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1/4, 2/4, 3/4, 4/4]

    steps:
      - uses: actions/checkout@v5
      - run: npm ci
      - run: npx playwright test --shard=${{ matrix.shard }}
```

### Cypress Parallel
```yaml
jobs:
  test:
    strategy:
      matrix:
        containers: [1, 2, 3, 4]

    steps:
      - uses: actions/checkout@v5
      - uses: cypress-io/github-action@v6
        with:
          record: true
          parallel: true
          group: 'CI Tests'
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
```

---

## Artifact Sharing Between Jobs

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - run: npm run build

      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: dist/

  test-chrome:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-output
          path: dist/
      - run: npm run test:e2e:chrome

  test-firefox:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-output
          path: dist/
      - run: npm run test:e2e:firefox
```

---

## Reusable Workflows

Extract common logic into reusable workflows:

### Define Reusable Workflow
```yaml
# .github/workflows/test-reusable.yml
name: Reusable Test Workflow

on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      - run: npm ci
      - run: npm test
```

### Call Reusable Workflow
```yaml
# .github/workflows/ci.yml
jobs:
  test-18:
    uses: ./.github/workflows/test-reusable.yml
    with:
      node-version: '18'

  test-20:
    uses: ./.github/workflows/test-reusable.yml
    with:
      node-version: '20'

  test-22:
    uses: ./.github/workflows/test-reusable.yml
    with:
      node-version: '22'
```

---

## Optimized Pipeline Example

```yaml
name: Optimized CI

on:
  pull_request:
    branches: [main]

jobs:
  # Fast checks run in parallel
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck

  # Build after fast checks pass
  build:
    needs: [lint, typecheck]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  # Tests run in parallel using build artifact
  test-unit:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - run: npm ci
      - run: npm run test:unit

  test-e2e:
    needs: build
    strategy:
      matrix:
        shard: [1, 2, 3]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/
      - run: npm ci
      - run: npm run test:e2e -- --shard=${{ matrix.shard }}/3
```

---

## Concurrency Control

Limit parallel runs of same workflow:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

Per-job concurrency:
```yaml
jobs:
  deploy:
    concurrency: deploy-production
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```
