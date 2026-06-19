# LinkedIn Prospect Intelligence Skill

A Claude Agent Skill that converts a LinkedIn profile into a sales-ready intelligence report with verified data, psychology profiling, ICP fit scoring, red-flag disqualification, and personalized outreach drafts (comment + 3 DM variants + timed follow-ups).

**Strict authenticity rule:** Every field is either verified from provided/authorized sources, explicitly inferred from verified evidence, or marked `Not verified / insufficient data`. Never fabricated.

## What This Skill Does

When you provide a LinkedIn profile (URL, text, or screenshot), the skill produces a structured report with:

1. Identity & company verification
2. Timeline-based content analysis (last 7d / 30d / 6mo / 12mo)
3. 7-archetype psychology profiling
4. ICP fit matrix (6 dimensions, scored against your offer)
5. Red-flag disqualification check
6. Pain & buying-trigger analysis
7. Case study matching to prospect pain
8. Personalized comment for a real recent post
9. 3 DM variants (Insight / Pain-tap / Curiosity)
10. 3-step follow-up sequence with Day 3-4, Day 7-10, Day 21+ timing
11. Full verification table showing source of every claim
12. Missing data list with exact instructions to fill gaps

## What This Skill Will Not Do

- Scrape LinkedIn or use bot automation
- Bypass login, captcha, or rate limits
- Send automated LinkedIn messages
- Infer religion, ethnicity, political views, health, or sensitive personal attributes
- Fabricate posts, dates, metrics, engagement numbers, or relationships
- Produce generic templated DMs

## Folder Structure

```
linkedin-prospect-intelligence/
├── SKILL.md                          # Orchestrator — entry point
├── README.md                         # This file
├── references/
│   ├── output-schema.md              # Full report field schema
│   ├── timeline-analysis.md          # Post bucketing + drift detection
│   ├── psychology-frameworks.md      # 7 archetypes + message angles
│   ├── message-templates.md          # Comment/DM/follow-up rules
│   ├── case-study-mapping.md         # Pain → solution matrix
│   ├── icp-fit-matrix.md             # 6-dimension scoring rubric
│   └── red-flags.md                  # Disqualification logic
├── assets/
│   └── report-template.md            # Fill-in markdown template
└── examples/
    ├── example-saas-founder.md       # Full worked example with strong data
    └── example-agency-owner.md       # Worked example with sparse data
```

## Installation

### Claude Code

Place the entire `linkedin-prospect-intelligence/` folder in one of these locations:

- **Project-level skill** (available only in this project):
  `<project-root>/.claude/skills/linkedin-prospect-intelligence/`

- **User-level skill** (available across all your Claude Code projects):
  `~/.claude/skills/linkedin-prospect-intelligence/`

Restart Claude Code or start a new session. The skill is auto-discovered via the YAML frontmatter in `SKILL.md`.

### Cursor

Cursor supports MCP-based skills and custom rules. The simplest path:

1. Place the folder under your project at `.cursor/skills/linkedin-prospect-intelligence/` (or wherever Cursor reads custom instructions in your version)
2. Reference `SKILL.md` from your Cursor rules so the agent loads it on relevant queries

Alternative: paste the contents of `SKILL.md` directly into a Cursor `.cursorrules` file or a custom command, then reference the `references/*.md` files by path when needed.

### Codex (OpenAI Codex / Codex CLI)

Codex supports custom prompts and tool descriptions. Add the skill by:

1. Including `SKILL.md` as a system prompt or system message in your Codex configuration
2. Making the `references/` and `assets/` folders accessible to the agent (via file-system access tools)
3. Codex will load reference files when the workflow steps direct it to

### OpenClaw (or any agent framework you build)

Since you build AI employees with OpenClaw + OpenAI Agents SDK, the cleanest integration is:

1. Load `SKILL.md` as the agent's system prompt (or a high-priority tool description)
2. Expose the `references/` and `assets/` folders via a file-read tool the agent can call
3. The agent will autonomously load reference files as the workflow progresses (progressive disclosure works out of the box because SKILL.md tells it which file to load when)

If you want this to be a multi-agent system rather than a single agent reading files, you can also split it: one orchestrator agent reads SKILL.md, and it delegates each numbered workflow step to a specialist sub-agent that loads the relevant reference file.

## Usage

Once installed, invoke the skill naturally:

> "Research this prospect: [LinkedIn URL]"
>
> "Analyze this LinkedIn profile and tell me if I should pursue them: [paste profile text]"
>
> "What should I message this person? [profile + posts]"
>
> "Is this lead worth pursuing? [profile content]"
>
> "Compare these 5 prospects and rank them by ICP fit: [paste multiple]"

The skill will:
1. Ask for your offer/ICP if not yet provided (one-time setup)
2. Ask for a brand voice token if not provided (optional but recommended)
3. Run the 9-step workflow
4. Output the full report

For best results, provide:
- Profile headline + About + Experience text
- Last 5-10 posts (text or screenshots)
- Company website URL
- Your offer description + ICP definition + 1-2 case studies
- Your brand voice sample (a message you've written previously that represents your tone)

## Authenticity Test

To verify the skill is working correctly:

1. Provide only a LinkedIn URL with no content
2. The skill should produce a report where most fields are `Not verified / insufficient data`
3. The skill should NOT generate fake DMs or invented details
4. The skill should clearly list what data is missing

If the skill produces a full report from just a URL, something is wrong — the authenticity rule has been broken.

See `examples/example-agency-owner.md` for the expected behavior under sparse data.

## Updating the Skill

To customize:

- **Add your own case studies:** Edit `references/case-study-mapping.md` and add your verified case studies with industry + outcome + mechanism
- **Tune ICP scoring:** Edit `references/icp-fit-matrix.md` thresholds to match your verdict preferences
- **Add archetypes:** Edit `references/psychology-frameworks.md` if you encounter consistent prospect types not covered by the 7 defaults
- **Adjust banned phrases:** Edit `references/message-templates.md` to add phrases specific to your brand voice that should never appear

After edits, no rebuild is needed — Claude reads the latest files on next invocation.

## Rating & Audit Notes

This skill was built following the official Claude Agent Skills pattern with progressive disclosure:

- ✅ YAML frontmatter (name + description + allowed-tools)
- ✅ SKILL.md under 500 lines
- ✅ Reference files clearly pointed to from SKILL.md with load-when guidance
- ✅ Concrete worked examples
- ✅ Authenticity rule enforced throughout
- ✅ Ethical boundaries (no inference of sensitive attributes)
- ✅ Multi-environment portable (Claude Code, Cursor, Codex, OpenClaw)
