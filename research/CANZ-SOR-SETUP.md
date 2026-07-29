# Connecting the research agent to the method record (canz-sor)

The research agent (Atlas) can consult the Canz System of Record — the published
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
    "agents": ["research"],
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

A working setup answers `7`.

## Checking the fail-open behaviour

Point the URL at something that does not exist, run `openclaw mcp reload`, and ask the
agent a method question. It must still answer correctly from `skills/`. Then restore
the URL. This was verified on 2026-07-29.

## What the agent does with it

- `sor_get_map(vertical="research")` — what to load, and what to read before each report
- `sor_get_exception(vertical="research", situation="...")` — the written procedure when
  evidence is thin, sources disagree, the market is wrong, a tool fails, or a request
  breaks the method
- `sor_get_authority(sor_id)` — a rule quoted with its ID and version

Human view of the same record: https://canz-sor.vercel.app
