---
name: website-cro-audit
description: "When the user shares a website or landing-page URL (or grants access to a project/deploy) and wants a conversion-rate-optimization audit done by actually opening the page in a LIVE browser. Use when the user says 'CRO audit my site', 'audit this landing page', 'QA my website for conversions', 'review my hero section', 'why isn't this page converting', 'test my site live', 'check my landing page on mobile', or shares a URL and asks for a conversion review. Drives a real browser via the browsing-with-playwright skill to capture screenshots, the DOM, forms, and performance, then scores the page and produces a prioritized report. For static copy-only feedback without a live browser, page-cro is enough; this skill is for live, evidence-based audits."
metadata:
  version: 1.0.0
  openclaw:
    requires:
      bins: ["python3", "npx"]
---

# Website CRO Audit (live browser)

You are a conversion-rate-optimization auditor. You **open the page in a real
browser**, gather evidence (screenshots, DOM, forms, performance), score it
against a defined rubric, and hand back a prioritized, actionable report. Every
finding must be grounded in something you actually observed on the live page —
not assumed.

This skill is the orchestrator. It leans on sibling skills:
- **browsing-with-playwright** — the browser engine (navigate, snapshot, screenshot, evaluate, fill forms). Read its `SKILL.md` for server lifecycle and tool calls.
- **page-cro** — the CRO analysis framework and output house-style.
- **form-cro / signup-flow-cro / onboarding-cro** — when a form or multi-step flow must be walked.
- **seo-audit** — technical/crawlability signals when auditing a whole site.
- **ab-test-setup** — to turn "Test Ideas" into real experiments.
- **product-marketing-context** — positioning/ICP/goal that grounds recommendations.

References this skill uses:
- `references/cro-brief.md` — the CRO checklist the page is audited against.
- `references/hero-breakdown.md` — the hero-section deep-dive + spec sheet + QA checklist.
- `references/scoring-criteria.md` — the 7-dimension weighted rubric (0–10 + grade bands).
- `references/report-template.md` — the report scaffold to fill.
- `references/dom-recipes.md` — copy-paste `browser_evaluate` / `browser_run_code` measurements.

---

## Phase 0 — Initial assessment (before touching the browser)

1. **Read product context first.** If `.agents/product-marketing-context.md`
   exists (or `.claude/product-marketing-context.md` in older setups), read it
   before asking questions. Use it for ICP, positioning, value props, proof
   points, and the conversion goal. If it's missing and the audit needs
   positioning, suggest the user run `/product-marketing-context` first.
2. **Confirm the target and goal.** Establish:
   - The **URL(s)** to audit. For multi-page, get the entry page + 2–4 key
     pages (e.g. landing → pricing → signup).
   - **Page type:** homepage / landing / pricing / feature / blog / other.
   - **Primary conversion goal:** sign up, demo, purchase, subscribe, download, contact.
   - **Traffic source + ad/promise** (for message-match): organic / paid / email /
     social, and the exact wording of the ad or link if paid.
3. **Note access constraints.** Public URL = audit directly. A private/staging or
   localhost deploy needs to be reachable from this machine (and, for OpenClaw's
   native browser, SSRF-allowlisted — but this skill uses the Playwright MCP
   server, which hits whatever the host can reach).

Don't block on perfect answers — if the user just drops a URL, infer page type
and goal from the page itself and state your assumptions.

## Phase 1 — Live capture (per page: desktop then mobile)

Use **browsing-with-playwright**. Follow its `SKILL.md` to start the server,
then run the **capture order** at the bottom of `references/dom-recipes.md`:

1. Start the MCP server (`bash scripts/start-server.sh` in the
   browsing-with-playwright skill dir) if it isn't already running. Verify with
   its `scripts/verify.py`.
2. `browser_navigate` to the URL; `browser_wait_for` load.
3. **Desktop (1280px):** `browser_take_screenshot {fullPage:true}`, then run
   `dom-recipes.md` recipes 1, 3, 4, 6, 7, 8, 10, 11, and recipe 5 (Web Vitals)
   via `browser_run_code`.
4. **Mobile (390×844):** `browser_resize {width:390,height:844}`,
   `browser_take_screenshot {fullPage:true}`, then re-run recipes 1, 2, 9.
5. `browser_console_messages {level:'error'}` and `browser_network_requests` for
   page-health and page weight.
6. `browser_snapshot` whenever you need element `ref`s for the flow walk.

Save each finding as **evidence** (screenshot filename + the JSON the recipe
returned). The report's credibility rests on this.

## Phase 1.5 — Context tiering (calibrate strictness)

Calibrate against page type and traffic (see `scoring-criteria.md` → Calibration
note). A paid single-goal landing page is held strictly to message-match / one
CTA / stripped-nav; a homepage gets more latitude for multiple paths; a blog is
scored on contextual CTAs. State the tier you're applying.

## Phase 2 — Walk the conversion flow (if there is one)

If the page has a form or a signup/lead flow, **drive it** rather than guessing:
- `browser_snapshot` to get field `ref`s; count fields with recipe 6.
- `browser_fill_form` / `browser_type` to fill it; submit; `browser_wait_for`
  the result; screenshot each state.
- Note inline-validation behaviour, required fields, input types (mobile
  keyboard), autofill, and the "what happens next" clarity.
Use **form-cro** for forms and **signup-flow-cro** for multi-step signup. Never
submit real payment details or create spammy accounts — use obviously-test data
and stop before irreversible actions; ask the user before completing a purchase
or anything that emails real people.

## Phase 3 — Multi-page pass (if in scope)

For a site rather than one page, repeat Phase 1 (and Phase 2 where relevant) on
each key page, and check **message-match across pages** (does pricing/signup keep
the landing-page promise?). Pull crawlability/technical signals from
**seo-audit** if the user wants whole-site health, not just conversion.

## Phase 4 — Score the 7 dimensions

Score each dimension 0–10 using `references/scoring-criteria.md`, citing the
evidence from Phase 1–3. Apply the weights, compute the final /100 and grade.
Identify the **biggest constraint** (the single dimension most limiting
conversion right now).

## Phase 5 — Hero deep-dive

Evaluate the hero against `references/hero-breakdown.md`: the 7 components, the
5-second test (state what a stranger would conclude from the above-the-fold
screenshot alone), the spec sheet, and the common-mistakes list. Confirm H1 +
sub + primary CTA are above the fold on **both** desktop and mobile screenshots.

## Phase 6 — Generate the report

Fill `references/report-template.md` completely. It merges three things:
- the **7-part audit contract** (Executive summary → Biggest constraint →
  Priority fixes → Specific recommendations → Expected impact → How to measure →
  Next actions),
- the **CRO house-style** sections (### Quick Wins / ### High-Impact Changes /
  ### Test Ideas / ### Copy Alternatives — match page-cro), and
- the **score card**.

### Report rules
- Every recommendation is **specific and actionable**: quote the current text or
  element, give the exact replacement, and explain **why** ("Change hero H1 from
  '…' to '…' because…"), not "improve the headline."
- Use the **Issue / Impact / Evidence / Fix / Priority** shape for findings —
  the *Evidence* field (screenshot ref or DOM value) is what makes this a live
  audit, not a guess.
- Give **2–3 Copy Alternatives** for the headline and primary CTA.
- Tie expected impact to a measurable metric and say how to track it.
- Be honest in **Limitations** about anything you couldn't assess.

---

## Graceful degradation

If the browser can't be driven (Playwright MCP server won't start, page is
login-gated, network blocked):
1. Say so explicitly and record it under Limitations.
2. Fall back to `WebFetch` of the HTML (note it can't see JS-rendered content or
   measure rendering), and/or ask the user to paste the page HTML or share a
   full-page screenshot.
3. Still produce the analysis and report using **page-cro**'s framework — just
   flag which dimensions are assumption-based rather than observed.

## Task-specific questions (ask only what Phase 0 didn't answer)
1. What URL(s) should I audit, and is it the homepage, a landing page, or a flow?
2. What's the primary conversion goal on this page?
3. Where does traffic come from — and if paid, what does the ad/headline promise?
4. Should I walk the signup/lead form, and is test data OK to submit?
5. Single page or multi-page (which pages)?
6. Do you have a current conversion rate / target, or analytics I should factor in?

## Related skills
- **browsing-with-playwright** — browser engine (required for live mode).
- **page-cro** — CRO framework + house-style this report follows.
- **form-cro**, **signup-flow-cro**, **onboarding-cro** — flow walking.
- **seo-audit** — whole-site technical/crawlability health.
- **aso-audit** — same audit shape, for App Store / Google Play listings.
- **ab-test-setup** — turn Test Ideas into running experiments.
- **product-marketing-context** — the positioning/ICP/goal grounding.
