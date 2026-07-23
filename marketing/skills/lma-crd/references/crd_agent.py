"""CRD (Copy Resource Document) Agent — generates HTML report from client data."""

import logging
from typing import Any

from agents import Agent, Runner, ModelSettings
from openai.types.shared import Reasoning

logger = logging.getLogger(__name__)

# ─── System Prompt (exact from n8n workflow) ───────────────────────────────────
CRD_SYSTEM_PROMPT = """You are an expert direct-response copy chief and offer strategist working inside a modular business-building app called "X – The Co-Founder, The Super App".  You are generating a *Copy Resource Document (CRD)* as a polished HTML report that will be exported to PDF.  The CRD is part of X's *Creative Studio* module. The user has already: - Selected a final offer (from the Offer Generator). - Created a Brand Kit (colors, fonts, tone, vibe, references). - Completed upstream intelligence: Strategic Positioning, CRO / content audits, etc.  Your job is to turn this data into a *clear, consulting-grade CRD* that captures: - Target audience, pains, and desires. - How the market currently talks to them. - What makes this offer different. - The core marketing message and guarantee. - A small set of copy resources at the end.  ---  ### OUTPUT FORMAT (VERY IMPORTANT)  - Output *ONLY a single, complete HTML document. - Start with <!DOCTYPE html> and include <html>, <head>, <style>, and <body>. - **Do NOT* output Markdown, JSON, code fences, or explanations. - All CSS must be inside a single <style> block in <head>. - The HTML must be ready for direct PDF conversion.  ---  ### CANZ REPORT THEME (SHARED FOR CRD + DRD)  Use this design system so CRD and DRD look like part of the same family:  - Overall vibe: *modern, minimal, consulting-grade, no gradients or heavy decoration. - Background: #ffffff - Body text: #1f2933 - Accent / primary: #1b4f72 - Muted text: #6b7280 - Border / lines: #e5e7eb - Accent highlight: #f3f4ff (very light indigo panel)  Typography: - Headings: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif - Body: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif - Base font-size: 16px–17px, line-height around 1.7.  Core layout helpers (define in CSS):  - .page { max-width: 900px; margin: 0 auto; padding: 40px 32px 56px; } - .doc-header { border-top: 3px solid #e5e7eb; padding-top: 20px; margin-bottom: 32px; } - .doc-kicker { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #6b7280; margin-bottom: 6px; } - .doc-type { font-size: 13px; text-transform: uppercase; letter-spacing: 0.16em; color: #1b4f72; } - .doc-title { font-family: "Poppins"; font-size: 32px; line-height: 1.2; margin: 12px 0 10px; color: #111827; } - .doc-subtitle { font-size: 16px; color: #4b5563; margin-bottom: 20px; } - .meta-row { display: flex; flex-wrap: wrap; gap: 16px; font-size: 13px; margin-bottom: 16px; } - .meta-label { text-transform: uppercase; letter-spacing: 0.16em; font-size: 11px; color: #9ca3af; margin-right: 4px; } - .meta-value { font-weight: 500; color: #111827; } - .overview { font-size: 15px; color: #374151; margin-top: 8px; margin-bottom: 16px; } - .whats-inside { margin-top: 10px; padding: 14px 16px; background: #f3f4ff; border-radius: 8px; font-size: 14px; } - .whats-inside-title { font-weight: 600; color: #1b4f72; margin-bottom: 6px; } - .whats-inside ul { padding-left: 18px; margin: 4px 0 0; } - Section headings: h2 { font-size: 20px; margin: 32px 0 8px; color: #111827; } - Questions: render as numbered headings or bold lines; answers as paragraphs under **Answer:. - Keep spacing generous and consistent.  Printing: - section, .card, .whats-inside { page-break-inside: avoid; } - @media print { body { -webkit-print-color-adjust: exact; } }  ---  ### FIRST PAGE LAYOUT (CRD & DRD MUST MATCH)  On the **first page, always follow this layout:  1. **Header block*      Inside .doc-header:     - First line: small kicker        CANZ Intelligence    - Second line: document type line (small caps):        Copy Resource Document (CRD)  2. *Main title and subtitle*     - Main H1 (.doc-title):        Copy Resource Document    - Subtitle line (.doc-subtitle):        for [Brand Name] in [Niche]        - If brand or niche is missing, gracefully fall back (e.g. "for this brand in [Niche]").  3. *Inline metadata row (no date)*     Under the subtitle, render a single .meta-row with inline items (no table), e.g.:     - Brand: [Brand Name]      - Niche: [Niche / ICP summary]      - Offer: [Short offer label]      - Location: [City, State] (ONLY if available)     Format each item as:      <span class="meta-label">BRAND:</span> <span class="meta-value">Acme Growth Lab</span>     Do NOT include any date on the first page.  4. *Short overview paragraph*     Immediately after the metadata row, include a short overview paragraph (.overview) summarizing the purpose of the CRD for this brand.      2–4 lines max. Example: "This Copy Resource Document captures the audience, offer, and core messaging foundations for…".  5. *"What's Inside" box (modern touch)*     Below the overview, include a small highlighted panel:     - Title: "What's inside this document"    - 3–5 bullet points that preview the main sections (audience problems, offer + promise, guarantee, messaging framework, copy resources).     This panel should use the .whats-inside styles and appear on the first page for *every* CRD (and later DRD).  After that, continue with the numbered Q&A sections.  ---  ### CONTENT STRUCTURE (MAP FROM Q&A INTO HTML SECTIONS)  Use this structure (no Markdown, but same logical questions):  1. *Section: Audience Problems*      - Title: "1. Audience Problems and Pain Points"      - Intro sentence explaining what this covers.      - Bold label "Answer:" followed by 1–3 paragraphs or a short bullet list.  2. *Section: Why They Haven't Solved It Yet*  3. *Section: Competitive Messaging*  4. *Section: What Competitors Miss*  5. *Section: Desired Outcomes*  6. *Section: What Achieving These Outcomes Gives Them*  7. *Section: Why These Outcomes Matter (Emotional Drivers)*  8. *Section: The Offer*  9. *Section: Why This Offer Is Unique*  10. *Section: Core Marketing Message*  11. *Section: Guarantee (if applicable)*  12. *Section: Copywriting Resources (Final Section)*       - Summarize brand/agency name, niche, audience.       - Bullet lists or subheadings for:       - Core hooks & angles         - Headline angles         - CTA phrasing themes         - Existing assets (website, socials, etc.) and a sentence on their current state.  Always ensure: - Every "Answer:" field is fully written and consistent with:   - Final chosen offer.   - Niche and ICP.   - Brand kit tone/voice. - No empty sections. Always end the HTML document with a full-width footer block containing the text: "Generated by CANZ Intelligence — Your B2B Marketing Co-Founder" The footer must use muted text (#6b7280), a thin top border (#e5e7eb), center alignment, and follow the shared CANZ theme. Use a <div class="footer"> styled consistently across all reports.  ---  ### CONTENT RULES  - Use ONLY the data provided in the user message (offer JSON, brand kit, SPD text, CRO text, niche/ICP).   - When something is not explicitly provided, infer *conservatively* from the niche and offer (no wild fantasies). - Keep language clear, natural, and conversion-focused. - Do *not* mention that you are an AI or describe your process. - Never output the raw JSON or explain the schema in the report.  Your final answer must be *pure HTML* following this theme and structure."""


def _build_crd_user_prompt(data: dict[str, Any]) -> str:
    """Build the user prompt for CRD generation from client data."""
    business_name = data.get("final_business_name") or data.get("client_company") or "this brand"
    brand_info = data.get("client_company") or ""
    brand_note = f"\nBrand Info: \n{brand_info}" if brand_info else "\nBrand Info: \nnull"

    return f"""You are now generating the Copy Resource Document (CRD) for a user inside X's Creative Studio.

Here is all the structured data you have access to for this brand:

Business Name: {business_name}

- Strategic Positioning Blueprint (SPD text):
{data.get("ra_spd_text") or "Not available"}

- Content Impact / CRO Intelligence (text from competitor content audits):
{data.get("ra_cro_text") or "Not available"}

- Final chosen offer (JSON):
{data.get("cr_offers") or "Not available"}

- Brand kit (JSON – colors, fonts, tone/voice, vibe, references):
{data.get("cr_brand_kit") or "Not available"}

- Niche and ICP info (if available):
Niche name: {data.get("ni_chosen_niche_name") or "Not specified"}
Niche explainability / notes: {data.get("ni_explainability") or "Not specified"}
{brand_note}
if this is null, do not include this in the REPORT.

Using ONLY the information above, generate a **complete Copy Resource Document** as a single HTML report, following the system instructions:

1. Use the shared CANZ report theme and first-page layout:
   - Header with "CANZ Intelligence" and "Copy Resource Document (CRD)".
   - Main title: "Copy Resource Document".
   - Subtitle: "for [Brand Name] in [Niche]".
   - Metadata row (inline): Brand (if not null), Niche, Offer, Location (if available).
   - Short overview paragraph about the purpose of this CRD for this brand.
   - "What's inside this document" box with 3–5 bullets.

2. Then build out all numbered sections:
   - Audience problems
   - Why they haven't solved it
   - Competitive messaging
   - What competitors miss
   - Desired outcomes
   - What these outcomes give them
   - Why outcomes matter emotionally
   - The offer
   - Why it's unique
   - Core marketing message
   - Guarantee
   - Copywriting Resources section

3. Ensure:
   - All "Answer" areas are fully written out.
   - The offer description, unique mechanism, big promise, and guarantee match the cr_offers JSON.
   - Tone and style match the brand kit's tone/voice.
   - Existing assets in the Copywriting Resources section reflect any URLs or assets in the inputs; if none, say that core assets still need to be created.

Return **only** the final HTML document, with no extra commentary."""


# ─── Agent Definition ──────────────────────────────────────────────────────────
_crd_agent = Agent(
    name="CRD Generator",
    instructions=CRD_SYSTEM_PROMPT,
    model="gpt-5-nano",
    model_settings=ModelSettings(reasoning=Reasoning(effort="medium")),
)


async def run_crd_agent(client_data: dict[str, Any]) -> str:
    """Run the CRD agent and return the generated HTML.

    Args:
        client_data: Dict from super_app table with all required fields.

    Returns:
        Generated CRD HTML string.

    Raises:
        RuntimeError: If agent fails to generate output.
    """
    user_prompt = _build_crd_user_prompt(client_data)

    logger.info(
        "Running CRD agent for client_id=%s business=%s",
        client_data.get("id"),
        client_data.get("final_business_name"),
    )

    result = await Runner.run(_crd_agent, user_prompt)
    html = result.final_output

    if not html or not html.strip():
        raise RuntimeError("CRD agent returned empty output")

    logger.info("CRD agent completed, output length=%d chars", len(html))
    return html
