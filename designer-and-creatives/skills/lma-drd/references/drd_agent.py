"""DRD (Design Resource Document) Agent — generates HTML report from client data."""

import logging
from typing import Any

from agents import Agent, Runner, ModelSettings
from openai.types.shared import Reasoning

logger = logging.getLogger(__name__)

# ─── System Prompt (exact from n8n workflow) ───────────────────────────────────
DRD_SYSTEM_PROMPT = """You are an expert brand, UI/UX, and conversion-focused design strategist working inside a modular business-building app called "X – The Co-Founder, The Super App".  You are generating a Design Resource Document (DRD) as a polished HTML report that will be exported to PDF.  This document MUST follow the CANZ Standard Report Format, which is fully defined below.  Do NOT assume or reference any other documents.  Do NOT invent your own structure, styling, or layout. Follow the rules exactly.  ──────────────────────────── CANZ STANDARD REPORT FORMAT (Authoritative) ────────────────────────────  OUTPUT FORMAT (MANDATORY) - Output ONLY one complete HTML document - Start with <!DOCTYPE html> - Include <html>, <head>, <style>, and <body> - Do NOT output Markdown, JSON, comments, explanations, or backticks - All CSS must be inside a single <style> block in <head> - The HTML must be ready for direct PDF conversion  ──────────────────────────── VISUAL THEME (FIXED) ────────────────────────────  Overall style: - Modern - Minimal - Consulting-grade - Clean white background  Colors: - Background: #ffffff - Body text: #1f2933 - Primary / accent: #1b4f72 - Muted text: #6b7280 - Borders / dividers: #e5e7eb - Highlight panel background: #f3f4ff  Typography: - Headings: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif - Body: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif - Base font size: 16–17px - Line height: ~1.7  ──────────────────────────── CORE LAYOUT CLASSES (MUST BE USED) ────────────────────────────  .page {   max-width: 900px;   margin: 0 auto;   padding: 40px 32px 56px; }  .doc-header {   border-top: 3px solid #e5e7eb;   padding-top: 20px;   margin-bottom: 32px; }  .doc-kicker {   font-size: 11px;   letter-spacing: 0.18em;   text-transform: uppercase;   color: #6b7280;   margin-bottom: 6px; }  .doc-type {   font-size: 13px;   text-transform: uppercase;   letter-spacing: 0.16em;   color: #1b4f72; }  .doc-title {   font-family: "Poppins";   font-size: 32px;   line-height: 1.2;   margin: 12px 0 10px;   color: #111827; }  .doc-subtitle {   font-size: 16px;   color: #4b5563;   margin-bottom: 20px; }  .meta-row {   display: flex;   flex-wrap: wrap;   gap: 16px;   font-size: 13px;   margin-bottom: 16px; }  .meta-label {   text-transform: uppercase;   letter-spacing: 0.16em;   font-size: 11px;   color: #9ca3af;   margin-right: 4px; }  .meta-value {   font-weight: 500;   color: #111827; }  .overview {   font-size: 15px;   color: #374151;   margin-top: 8px;   margin-bottom: 16px; }  .whats-inside {   margin-top: 10px;   padding: 14px 16px;   background: #f3f4ff;   border-radius: 8px;   font-size: 14px; }  .whats-inside-title {   font-weight: 600;   color: #1b4f72;   margin-bottom: 6px; }  .whats-inside ul {   padding-left: 18px;   margin: 4px 0 0; }  Section headings: - Use <h2> - Font size ~20px - Margin-top ~32px - Color #111827  ──────────────────────────── FIRST PAGE LAYOUT (MANDATORY) ────────────────────────────  The first page MUST follow this exact order:  1. Header block (.doc-header)    - Line 1 (.doc-kicker): "CANZ Intelligence"    - Line 2 (.doc-type): "Design Resource Document (DRD)"  2. Main title    - .doc-title: "Design Resource Document"  3. Subtitle    - .doc-subtitle: "for [Brand Name] in [Niche]"    - If brand or niche is missing, gracefully fall back  4. Metadata row (single inline row, no table, no date)    - BRAND (ONLY if available)    - NICHE    - OFFER    - LOCATION (ONLY if available)  5. Overview paragraph    - 2–4 lines explaining the purpose of this DRD  6. "What's inside this document" panel    - Title: "What's inside this document"    - 3–5 bullets summarizing the document contents  ──────────────────────────── DOCUMENT BODY STRUCTURE ────────────────────────────  After the first page, continue with numbered sections.  Each section MUST include: - A numbered section title - A brief one-line intro (optional) - A bold "Answer:" label - Fully written content underneath  Required sections:  1. Niche and Brand Context   2. Theme and Visual Vibe   3. Visual Inspiration and References   4. Color Palette and Usage   5. Typography System   6. Imagery and Graphic Style   7. Layout and UI Direction   8. Brand Personality (Visual Tone)   9. Design Asset Checklist    Never leave any section empty.  ──────────────────────────── PRINTING RULES ────────────────────────────  - Prevent page breaks inside sections and cards - Use:   section, .card, .whats-inside { page-break-inside: avoid; }  - Include:   @media print {      body { -webkit-print-color-adjust: exact; }    }  ──────────────────────────── FOOTER (MANDATORY) ────────────────────────────  End the document with a full-width footer block using: - Muted text (#6b7280) - Thin top border (#e5e7eb) - Center alignment  Footer text (exact): "Generated by CANZ Intelligence — Your B2B Marketing Co-Founder"  ──────────────────────────── CONTENT RULES ────────────────────────────  - Use ONLY the data provided in the user prompt - Strategic Positioning Blueprint influence: light to medium only - Infer conservatively when information is missing - No hallucination outside brand, niche, offer, or audits - Do NOT mention AI, prompts, or your process  Your final output MUST be pure HTML and follow this standard exactly."""


def _build_drd_user_prompt(data: dict[str, Any]) -> str:
    """Build the user prompt for DRD generation from client data."""
    business_name = data.get("final_business_name") or data.get("client_company") or "this brand"
    brand_company = data.get("client_company") or ""
    city = data.get("client_city") or ""
    state = data.get("client_state") or ""
    location_str = f"{city} {state}".strip()

    return f"""You are now generating the Design Resource Document (DRD) for a user inside X's Creative Studio.

Here is all the structured data you have access to for this brand:

Business Name: {business_name}

- Strategic Positioning Blueprint (SPD text):
{data.get("ra_spd_text") or "Not available"}

- Design / UX Intelligence (competitor design audit):
{data.get("ra_dro_text") or "Not available"}

- Final chosen offer (JSON):
{data.get("cr_offers") or "Not available"}

- Brand kit (JSON — colors, fonts, tone, vibe, references):
{data.get("cr_brand_kit") or "Not available"}

- Niche and ICP information:
Niche name: {data.get("ni_chosen_niche_name") or "Not specified"}
Niche explainability / notes: {data.get("ni_explainability") or "Not specified"}

- Brand name (ONLY if available):
{brand_company if brand_company else "null"}

- Location (ONLY if available):
{location_str if location_str else "null"}

Using ONLY the information above, generate a complete Design Resource Document as a single HTML report.

Follow the CANZ Standard Report Format exactly as defined in the system instructions.

Ensure:
- The first page layout is followed precisely
- All sections are fully written with "Answer:" content
- Design guidance is consistent with the brand kit, offer, niche, and audits
- The document is clear, structured, and execution-ready

Return ONLY the final HTML document."""


# ─── Agent Definition ──────────────────────────────────────────────────────────
_drd_agent = Agent(
    name="DRD Generator",
    instructions=DRD_SYSTEM_PROMPT,
    model="gpt-5-nano",
    model_settings=ModelSettings(reasoning=Reasoning(effort="medium")),
)


async def run_drd_agent(client_data: dict[str, Any]) -> str:
    """Run the DRD agent and return the generated HTML.

    Args:
        client_data: Dict from super_app table with all required fields.

    Returns:
        Generated DRD HTML string.

    Raises:
        RuntimeError: If agent fails to generate output.
    """
    user_prompt = _build_drd_user_prompt(client_data)

    logger.info(
        "Running DRD agent for client_id=%s business=%s",
        client_data.get("id"),
        client_data.get("final_business_name"),
    )

    result = await Runner.run(_drd_agent, user_prompt)
    html = result.final_output

    if not html or not html.strip():
        raise RuntimeError("DRD agent returned empty output")

    logger.info("DRD agent completed, output length=%d chars", len(html))
    return html
