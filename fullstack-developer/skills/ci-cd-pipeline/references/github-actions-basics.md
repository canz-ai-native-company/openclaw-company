# GitHub Actions Basics

Core syntax and structure for GitHub Actions workflows.

---

## Workflow File Location

Workflows must be placed in `.github/workflows/` directory:
```
.github/
└── workflows/
    ├── ci.yml
    ├── cd.yml
    └── release.yml
```

---

## Basic Workflow Structure

```yaml
name: Workflow Name           # Display name in GitHub UI

on:                           # Trigger events
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:                          # Workflow-level environment variables
  NODE_VERSION: '20'

jobs:                         # Job definitions
  job-name:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - run: echo "Hello World"
```

---

## Trigger Events (`on`)

### Push Events
```yaml
on:
  push:
    branches:
      - main
      - 'release/**'
    paths:
      - 'src/**'
      - '!src/**/*.md'    # Exclude markdown files
    tags:
      - 'v*'
```

### Pull Request Events
```yaml
on:
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]
```

### Manual Trigger
```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deploy environment'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
```

### Scheduled Runs
```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
```

### Combined Triggers
```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:
```

---

## Jobs

### Basic Job
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - run: npm ci
      - run: npm run build
```

### Job Dependencies
```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint

  test:
    needs: lint              # Runs after lint completes
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  deploy:
    needs: [lint, test]      # Runs after both complete
    runs-on: ubuntu-latest
    steps:
      - run: npm run deploy
```

### Conditional Jobs
```yaml
jobs:
  deploy:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: npm run deploy
```

---

## Steps

### Using Actions
```yaml
steps:
  - uses: actions/checkout@v5

  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
```

### Running Commands
```yaml
steps:
  - name: Install dependencies
    run: npm ci

  - name: Multi-line command
    run: |
      echo "Building..."
      npm run build
      echo "Done!"
```

### Step Outputs
```yaml
steps:
  - name: Get version
    id: version
    run: echo "version=$(node -p "require('./package.json').version")" >> $GITHUB_OUTPUT

  - name: Use version
    run: echo "Version is ${{ steps.version.outputs.version }}"
```

---

## Environment Variables

### Workflow Level
```yaml
env:
  NODE_ENV: production
  CI: true
```

### Job Level
```yaml
jobs:
  build:
    env:
      DATABASE_URL: postgres://localhost/test
```

### Step Level
```yaml
steps:
  - name: Build
    env:
      API_KEY: ${{ secrets.API_KEY }}
    run: npm run build
```

---

## Concurrency

Prevent concurrent workflow runs:
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

Per-environment concurrency:
```yaml
concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: false  # Don't cancel in-progress deploys
```

---

## Matrix Strategy

Run jobs across multiple configurations:
```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]
      fail-fast: false  # Continue other matrix jobs if one fails

    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
```

### Matrix with Includes/Excludes
```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18, 20]
    include:
      - os: ubuntu-latest
        node: 22
        experimental: true
    exclude:
      - os: windows-latest
        node: 18
```

---

## Common Actions

| Action | Purpose |
|--------|---------|
| `actions/checkout@v5` | Clone repository |
| `actions/setup-node@v4` | Setup Node.js |
| `actions/setup-python@v5` | Setup Python |
| `actions/cache@v4` | Cache dependencies |
| `actions/upload-artifact@v4` | Upload build artifacts |
| `actions/download-artifact@v4` | Download artifacts |

---

## GitHub Context Variables

| Variable | Description |
|----------|-------------|
| `${{ github.sha }}` | Full commit SHA |
| `${{ github.ref }}` | Full ref (e.g., `refs/heads/main`) |
| `${{ github.ref_name }}` | Short ref name (e.g., `main`) |
| `${{ github.event_name }}` | Event that triggered workflow |
| `${{ github.actor }}` | User who triggered workflow |
| `${{ github.repository }}` | Owner/repo name |
| `${{ github.run_id }}` | Unique workflow run ID |
| `${{ github.run_number }}` | Run number for workflow |
