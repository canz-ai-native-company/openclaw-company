# Deployment Gates

Manual approvals, environment protection, and controlled deployments.

---

## Why Deployment Gates?

| Scenario | Gate Type |
|----------|-----------|
| Production deploys need approval | Required reviewers |
| Wait for QA sign-off | Manual approval |
| Only deploy from protected branches | Branch protection |
| Limit deployment frequency | Wait timer |
| Verify external checks pass | Status checks |

---

## Environment Protection Rules

### Setting Up Environments

1. Repository Settings → Environments
2. Create environment (e.g., `production`)
3. Configure protection rules

### Protection Rule Options

| Rule | Description |
|------|-------------|
| Required reviewers | Specific users must approve |
| Wait timer | Delay before deploy (0-43200 min) |
| Deployment branches | Limit which branches can deploy |
| Custom rules | External approval systems |

---

## Required Reviewers

### Configuration
```
Environment: production
Required reviewers:
  - @team-lead
  - @devops-team

Prevent self-review: ✓
```

### Workflow Usage
```yaml
jobs:
  deploy-production:
    environment:
      name: production
      url: https://myapp.com
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - run: ./deploy.sh

    # GitHub will pause here and request approval
```

---

## Wait Timers

Add delay between staging and production:

```yaml
jobs:
  deploy-staging:
    environment: staging
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh staging

  deploy-production:
    needs: deploy-staging
    environment:
      name: production  # Has 15-minute wait timer configured
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh production
```

---

## Branch Protection for Deployments

### Environment Settings
```
Deployment branches:
  ○ All branches
  ○ Protected branches only
  ● Selected branches
    - main
    - release/*
```

### Workflow Example
```yaml
jobs:
  deploy:
    if: github.ref == 'refs/heads/main'
    environment: production
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

---

## Manual Workflow Dispatch

Allow manual triggering with inputs:

```yaml
name: Manual Deploy

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        type: choice
        options:
          - staging
          - production

      version:
        description: 'Version to deploy'
        required: true
        type: string

      dry-run:
        description: 'Perform dry run only'
        type: boolean
        default: false

jobs:
  deploy:
    environment: ${{ inputs.environment }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
        with:
          ref: ${{ inputs.version }}

      - name: Deploy
        if: ${{ !inputs.dry-run }}
        run: ./deploy.sh ${{ inputs.environment }}

      - name: Dry Run
        if: ${{ inputs.dry-run }}
        run: ./deploy.sh ${{ inputs.environment }} --dry-run
```

---

## Approval via Pull Request Comments

```yaml
name: Deploy on Approval

on:
  issue_comment:
    types: [created]

jobs:
  deploy:
    if: |
      github.event.issue.pull_request &&
      contains(github.event.comment.body, '/deploy') &&
      contains(fromJson('["team-lead", "senior-dev"]'), github.event.comment.user.login)

    runs-on: ubuntu-latest
    steps:
      - name: Get PR ref
        id: pr
        run: |
          PR_URL="${{ github.event.issue.pull_request.url }}"
          PR_REF=$(gh pr view ${{ github.event.issue.number }} --json headRefName -q .headRefName)
          echo "ref=$PR_REF" >> $GITHUB_OUTPUT
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/checkout@v5
        with:
          ref: ${{ steps.pr.outputs.ref }}

      - name: Deploy preview
        run: ./deploy.sh preview
```

---

## Staged Rollout

Deploy progressively with manual gates:

```yaml
name: Staged Production Rollout

on:
  workflow_dispatch:

jobs:
  deploy-canary:
    environment: production-canary
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh --canary 5%

  monitor-canary:
    needs: deploy-canary
    runs-on: ubuntu-latest
    steps:
      - name: Monitor for 10 minutes
        run: |
          for i in {1..10}; do
            ./check-metrics.sh || exit 1
            sleep 60
          done

  deploy-25-percent:
    needs: monitor-canary
    environment: production-25  # Requires approval
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh --rollout 25%

  deploy-full:
    needs: deploy-25-percent
    environment: production  # Requires approval
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh --rollout 100%
```

---

## External Approval Systems

### Using Deployment Status API
```yaml
jobs:
  request-approval:
    runs-on: ubuntu-latest
    steps:
      - name: Request approval from external system
        run: |
          curl -X POST https://approval-system.example.com/request \
            -H "Authorization: Bearer ${{ secrets.APPROVAL_TOKEN }}" \
            -d '{"deployment_id": "${{ github.run_id }}"}'

  wait-for-approval:
    needs: request-approval
    runs-on: ubuntu-latest
    steps:
      - name: Poll for approval
        run: |
          for i in {1..60}; do
            STATUS=$(curl -s https://approval-system.example.com/status/${{ github.run_id }})
            if [ "$STATUS" = "approved" ]; then exit 0; fi
            if [ "$STATUS" = "rejected" ]; then exit 1; fi
            sleep 60
          done
          exit 1  # Timeout

  deploy:
    needs: wait-for-approval
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

---

## Slack Approval Workflow

```yaml
jobs:
  request-approval:
    runs-on: ubuntu-latest
    outputs:
      approval-url: ${{ steps.slack.outputs.url }}
    steps:
      - name: Send Slack approval request
        id: slack
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "Deploy to production requested by ${{ github.actor }}"
                  }
                },
                {
                  "type": "actions",
                  "elements": [
                    {
                      "type": "button",
                      "text": {"type": "plain_text", "text": "Approve"},
                      "style": "primary",
                      "url": "${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
                    }
                  ]
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Complete Gated Deployment Example

```yaml
name: Production Deployment

on:
  push:
    branches: [main]

jobs:
  # CI checks
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - run: npm ci
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  # Staging (auto-deploy)
  deploy-staging:
    needs: build
    environment:
      name: staging
      url: https://staging.myapp.com
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build
      - run: ./deploy.sh staging

  # Smoke tests on staging
  smoke-tests:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - run: npm run test:smoke -- --url=https://staging.myapp.com

  # Production (requires approval)
  deploy-production:
    needs: smoke-tests
    environment:
      name: production
      url: https://myapp.com
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build
      - run: ./deploy.sh production

  # Post-deploy verification
  health-check:
    needs: deploy-production
    runs-on: ubuntu-latest
    steps:
      - name: Verify deployment
        run: |
          for i in {1..5}; do
            curl -f https://myapp.com/health && exit 0
            sleep 10
          done
          exit 1
```
