# TOOLS.md - Local Notes

Skills define how research works. This file stores setup-specific notes for this research agent.

## Research Role

This agent researches local business markets using:

- Neon MCP client lookup
- S3/Radar HTML reports
- Websearch for local + broader market research
- Landing-page strategy synthesis

## Client ID Rule

Only accept client IDs in UUID format:

```text
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Example:

```text
53ed3463-7716-42ff-ab8b-4ce845b9cbe7
```

If the user sends only a valid client ID, treat it as a request to run the default research workflow.

Reject or ask for correction if the ID is not UUID-style.

## Neon MCP Lookup

Use Neon MCP to fetch client context.

Table:

```text
super_app
```

Use only these columns:

```text
Name, Niche, Location
```

Do not query unrelated columns unless the user explicitly asks and the data is safe to use.

## S3 Report Fetching

S3 reports are fetched through the existing script.

Script directory:

```text
/home/raza/.openclaw/workspace/research/s3-reports-script
```

Windows/WSL view:

```text
\\wsl.localhost\Ubuntu-24.04\home\raza\.openclaw\workspace\research\s3-reports-script
```

The env file required by the script is in the same directory. Do not print or expose env values.

The script takes `client_id` and returns HTML report URLs.

Expected Radar/S3 report types:

- `feature_gap.html`
- `competitive_landscape.html`
- `market_trends.html`
- `pricing_benchmark.html`
- `detail_competitor.html`
- `cro_content_audit.html`
- `design_intelligence.html`
- `spd.html`

## Research Workspace

Save fetched reports, notes, and final outputs inside the research agent workspace.

Preferred structure:

```text
research/
  clients/<client_id>/
    raw-reports/
    notes/
    output/
```

Final report path pattern:

```text
research/clients/<client_id>/output/landing-page-research-<YYYYMMDD>.md
```

## Websearch Rules

Use websearch for current market/competitor research.

Research order:

1. Client niche + exact location
2. Nearby city/region if local market is thin
3. State-level search if needed
4. USA-level search only if local/regional data is insufficient

Look for:

- local competitors
- service positioning
- offer patterns
- pricing patterns
- page structure patterns
- trust/proof patterns
- CTA patterns
- design/visual patterns
- content gaps
- hooks and angles

## Output Expectations

Default final deliverable:

- client summary from Neon
- report insights from S3/Radar pages
- websearch-based local market findings
- competitor observations
- hooks and angles
- 5 landing-page variations
- minimum 15+ synced sections per variation
- color/theme direction
- animation direction
- CTA strategy
- proof/trust strategy
- design and content consistency notes

Long deliverables must be saved to `output/`; chat response should summarize and provide file path.

## Safety Notes

- No secrets in chat or memory.
- No raw env values.
- No unrelated client data.
- No fake competitor counts.
- No fake screenshots, testimonials, awards, reviews, or case studies.
