# Connecting the research agent to the method record (canz-sor)

The research agent (Atlas) and the builder (Andy) can consult the Canz System of Record — the published
record of *how* research is done. It is read-only, and it is **optional by design**:
if it is unreachable, Atlas carries on using its own `skills/` folder.

Nothing about the pipeline, Neon, or the Worker Contract changes.

## What to add on each machine

The MCP entry is **not** kept in this repository, because the OpenClaw config file
also holds live tokens. Add it by hand:

```bash
openclaw mcp set canz-sor '{
  "url": "https://canz-sor-mcp.vercel.app/mcp",
  "transport": "streamable-http",
  "codex": {
    "agents": ["research", "fullstack-developer"],
    "defaultToolsApprovalMode": "approve"
  }
}'

openclaw mcp reload
```

`mcp reload` is enough — **no gateway restart is needed**, so a running pipeline is
not interrupted.

Or edit `~/.openclaw/openclaw.json` directly and add the same object under
`mcp.servers`. Back the file up first.

## Checking it worked

```bash
openclaw mcp list          # canz-sor should be listed
openclaw mcp doctor        # canz-sor: ok
```

`openclaw mcp probe` is **not** a reliable check here: in OpenClaw 2026.7.1 it times
out for every remote HTTP MCP server, including ones that work. Test with a real turn
instead:

```bash
openclaw agent --agent research -m 'Diagnostic only. Call sor_get_map with vertical="research" and reply with the number of pages in the always list.'
```

A working setup answers `7`. The same check for the builder:

```bash
openclaw agent --agent fullstack-developer -m 'Diagnostic only. Call sor_get_map with vertical="website" and reply with the number of pages in the always list.'
```

## Checking the fail-open behaviour

Point the URL at something that does not exist, run `openclaw mcp reload`, and ask the
agent a method question. It must still answer correctly from `skills/`. Then restore
the URL. This was verified on 2026-07-29.

## What the agent does with it

- `sor_get_map(vertical="research")` — what to load, and what to read before each report
- `sor_get_map(vertical="website")` — the same for a landing-page build
- `sor_get_exception(vertical="research", situation="...")` — the written procedure when
  evidence is thin, sources disagree, the market is wrong, a tool fails, or a request
  breaks the method
- `sor_get_authority(sor_id)` — a rule quoted with its ID and version

Human view of the same record: https://canz-sor.vercel.app

## What the builder gained (2026-07-29)

Andy's checklist grew from 15 items to 17, and one existing item was strengthened:

- **Item 12** now also requires a `Source:` line under each section of
  `04-sections-and-copy.md`, naming where those words came from. At least six sections
  sourced, and a source naming material the build never gathered is wrong. The
  `canz-website` connector enforces the same rule (v0.5.0), so both runtimes now agree.
- **Item 16** — after any change to a built page, the browser test and the audit are run
  again. An approved page that was edited afterwards was never approved.
- **Item 17** — the method record was consulted at the start, and the matching exception
  entry was followed when something went wrong. Answerable Y if the record was
  unreachable.

Verified with the record up (map returned, 7 always-pages) and with the URL deliberately
broken (the builder still answered correctly from `skills/`, including the new
`Source:` rule).
