"""Brand Systems Architect agent — generates 6 brand kit variations."""

import json
import logging
import os
import re
from typing import Any

from agents import Agent, Runner, set_default_openai_key

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are "The Brand Systems Architect" — a senior creative director and conversion-focused brand strategist who has built visual and verbal identity systems for B2B service businesses across dozens of verticals.
YOUR TASK: Generate exactly 6 complete, production-ready brand kit variations for this DFY B2B lead generation agency. Each kit represents one of six distinct creative moods. All 6 kits apply to the same agency — but each expresses the brand through a completely different visual and verbal personality.

THE 6 MOODS — FIXED ORDER, FIXED NAMES:
1. BOLD — Strong, authoritative, commanding.
2. MINIMAL — Clean, precise, frictionless.
3. ELEGANT — Refined, premium, sophisticated.
4. PLAYFUL — Warm, energetic, approachable.
5. MODERN — Tech-forward, systematic, precision-engineered.
6. CLASSIC — Timeless, trustworthy, established.

FLAT ROOT STRUCTURE — MANDATORY:
The output must be a single JSON object with exactly these top-level keys:
niche_buyer_psychology, brand_kit_1, brand_kit_2, brand_kit_3, brand_kit_4, brand_kit_5, brand_kit_6, recommendation

CRITICAL: brand_kit_1 through brand_kit_6 are ALL direct children of the root object — they are siblings, NEVER nested inside one another. Each brand_kit object closes completely before the next one opens.

Before generating any kit, identify the niche's buyer psychology and apply it to all 6 palettes and typography choices.

FIELD RULES:
→ All hex values: valid 6-digit format (#RRGGBB)
→ All fonts must be available on Google Fonts
→ No 2 kits share the same primary color
→ No markdown, no code fences, no extra keys, no prose outside the JSON

Return ONLY valid JSON matching this schema:
{
  "niche_buyer_psychology": "string",
  "brand_kit_1": {
    "mood": "Bold",
    "palette": {"primary": "", "secondary": "", "accent": "", "highlight": "", "background": "", "text": ""},
    "typography": {"heading_font": "", "body_font": "", "rationale": ""},
    "brand_voice": {"tone": "", "voice_keywords": [], "voice_summary": ""},
    "why_these_colors": ""
  },
  "brand_kit_2": {"mood": "Minimal", "palette": {}, "typography": {}, "brand_voice": {}, "why_these_colors": ""},
  "brand_kit_3": {"mood": "Elegant", "palette": {}, "typography": {}, "brand_voice": {}, "why_these_colors": ""},
  "brand_kit_4": {"mood": "Playful", "palette": {}, "typography": {}, "brand_voice": {}, "why_these_colors": ""},
  "brand_kit_5": {"mood": "Modern", "palette": {}, "typography": {}, "brand_voice": {}, "why_these_colors": ""},
  "brand_kit_6": {"mood": "Classic", "palette": {}, "typography": {}, "brand_voice": {}, "why_these_colors": ""},
  "recommendation": {
    "recommended_kit": 1,
    "reason": "string",
    "best_for_founder_who": "string",
    "secondary_option": 2,
    "why_not_others": "string"
  }
}"""


def _build_user_prompt(
    final_business_name: str,
    ob_derived_profile: Any,
    ni_chosen_niche_name: str,
    ra_spd_text: str,
    ra_cro_text: str,
    ra_dro_text: str,
) -> str:
    return f"""Generate 6 complete brand kit variations for this DFY B2B lead generation agency.

Business Name: {final_business_name}
Persona profile: {json.dumps(ob_derived_profile)}
Chosen niche: {ni_chosen_niche_name}
SPD (Strategic Positioning Document summary): {ra_spd_text or ""}
CRO (Conversion insights): {ra_cro_text or ""}
DRO (Design Insight): {ra_dro_text or ""}

Before generating any kit, identify the niche's buyer psychology and apply it to all 6 palettes and typography choices.
Return ONLY the JSON object. No markdown. No code fences. No commentary outside the JSON."""


def _parse_json(raw: str) -> dict[str, Any]:
    """Extract and parse JSON from agent response."""
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    raw = raw.strip()
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if match:
        return json.loads(match.group(0))
    raise ValueError(f"Could not parse JSON from brand kit agent response: {raw[:200]}")


async def run_brand_kit_agent(
    final_business_name: str,
    ob_derived_profile: Any,
    ni_chosen_niche_name: str,
    ra_spd_text: str,
    ra_cro_text: str,
    ra_dro_text: str,
    api_key: str | None = None,
) -> dict[str, Any]:
    """Run the Brand Systems Architect agent and return parsed JSON result."""
    api_key = api_key or os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY not configured")

    set_default_openai_key(api_key)

    agent = Agent(
        name="Brand Systems Architect",
        instructions=SYSTEM_PROMPT,
        model="gpt-5-nano",
    )

    user_prompt = _build_user_prompt(
        final_business_name=final_business_name,
        ob_derived_profile=ob_derived_profile,
        ni_chosen_niche_name=ni_chosen_niche_name,
        ra_spd_text=ra_spd_text,
        ra_cro_text=ra_cro_text,
        ra_dro_text=ra_dro_text,
    )

    logger.info(
        "Brand Systems Architect | business=%s | prompt_chars=%d | estimated_input_tokens=~%d",
        final_business_name,
        len(user_prompt),
        len(user_prompt) // 4,
    )
    result = await Runner.run(agent, user_prompt)
    data = _parse_json(result.final_output)
    logger.info("Brand Systems Architect completed — recommended kit: %s", data.get("recommendation", {}).get("recommended_kit"))
    return data
