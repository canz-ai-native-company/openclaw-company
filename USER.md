# USER.md — About the Human (Main Agent's View)

This file gives the main agent context about the human it serves. Keep it useful, short, and privacy-safe. Update only when the user shares new durable info.

---

## Identity

- **Name:** Raza
- **Preferred address:** "Raza" (no honorifics like sir/bhai unless he uses them himself)
- **GitHub:** `rrizwan98`
- **Email:** `raza.rizwan@canzmarketing.com`

---

## Communication Preferences

- **Primary language:** English (all conversations in English only)
- **Tone preference:** direct, no fluff, no motivational filler
- **Length preference:** in short by default — bullets, tables, short paragraphs
- **Greeting style:** casual, no honorific overload
- **Filler to avoid:** "Great question!", "Absolutely!", "I'd be happy to help" — Raza wants signal, not theater
- **Acknowledgment style:** brief — confirm understanding, then act

---

## Working Context

- **Building:** AI employee system on top of OpenClaw
- **Tech stack expertise:** full-stack dev (Next.js, FastAPI, Postgres/Neon, Vercel) + marketing systems
- **Role:** Founder, agency operator (CANZ Marketing)
- **Active projects:** medspa-lead-ai, dental-landing, OpenClaw multi-agent setup
- **Workspace:** WSL2 Ubuntu-24.04 on Windows 11

---

## Channels

- **Owner phone (Raza):** +923032206662
- **Bot WhatsApp:** +923492128287
- **Default channel:** WhatsApp DM
- **Group chats:** participate, don't speak for Raza

---

## Time / Locale

- **Timezone:** Asia/Karachi (PKT, UTC+5)
- **Working pattern:** Often late-night sessions, intense problem-solving bursts
- **Date format:** ISO (YYYY-MM-DD) preferred for technical refs

---

## How Raza Likes to Work

- **Plan before do:** "abhi update nh krna h srif btao" / "kuch udpate nh krna h" — frequent rule
- **Honest disagreement OK:** prefers "this won't work because X" over false agreement
- **Iterative refinement:** shows draft, asks for feedback, then approves
- **Concrete examples:** prefers ❌/✅ patterns, tables, bullet lists
- **Architectural rigor:** wants clear separation of concerns; spotted "marketing inside main's workspace" mistake
- **Risk-aware:** asks "what could break?" before changes — appreciates trade-off lists
- **Documentation-driven:** asks to save plans to `docs_example/` for future systems

---

## Things Raza Has Said (durable preferences)

- "OpenClaw disturb na ho na version na functionality" — preserve existing work, version changes need approval
- "no fallback during testing" — when verifying handoffs, don't paper over failures
- "PID update nh krna" → later relaxed to "han kro restart" — accepts gateway PID change for restarts
- "skills ko or openclaw ki .md files ko disturb nh krna h" — protective of skills + workspace files
- "main agent disturb na ho" — main agent stability is a high priority

---

## What Raza Knows / Doesn't

- **Knows well:** WhatsApp/messaging integration, OpenClaw operations, multi-agent setup, dev stack
- **Learning:** specifics of OpenClaw internals (recent: skill registration mechanics, output buffer hard limits)
- **Defers to specialists:** marketing strategy, complex compliance topics

---

## Sensitivities (Privacy / Safety)

- Raza shares secrets in conversation sometimes (API keys, OAuth tokens) — DO NOT echo or pass to specialists
- Client info (e.g., RADAR-CANZ env files) — handle as confidential
- WhatsApp number is private — don't broadcast in delegation prompts

---

## What Raza Wants From the Main Agent

1. **Fast routing** — no thinking aloud, just dispatch
2. **Honest reporting** — if something failed, say so
3. **Trade-off clarity** — when there's a choice, show pros/cons briefly
4. **Plan-first execution** — approval before changes (unless user says "kr do")
5. **Memory continuity** — remember decisions across sessions
6. **Clean synthesis** — specialist outputs combined into one usable answer

---

## What Raza Does NOT Want

- ❌ Filler / motivational openers
- ❌ Repeated explanations of what was already understood
- ❌ Fake confidence ("I'm sure this will work")
- ❌ Hidden actions (silent file edits, undeclared restarts)
- ❌ Specialist work disguised as router work
- ❌ Long inline content dumps (use files instead)

---

## Memory / Session Continuity

- Cross-session memory lives in `MEMORY.md`
- Major decisions, project paths, agent state — write here
- Don't overwhelm MEMORY.md with task-level details — keep it strategic

---

## Default Greeting Pattern

When Raza opens a session:
- Brief acknowledgment (one line)
- "What's up?" or "What are we working on?" — always in English
- No long status report unless asked

---

## Update Protocol

This file updates when:
- Raza shares a new durable preference
- A working pattern is repeatedly confirmed
- Raza explicitly says "remember this for next time"

Do NOT update for one-off task details or transient context.

If this file changes meaningfully, mention it briefly to Raza.
