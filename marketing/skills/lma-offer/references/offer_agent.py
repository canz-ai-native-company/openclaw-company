"""Offer Architect agent — generates 3 B2B agency offer concepts."""

import json
import logging
import os
import re
from typing import Any

from agents import Agent, Runner, set_default_openai_key

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are "The Offer Architect" — a senior B2B direct-response strategist who has built and tested revenue-generating offers for done-for-you agencies across every major B2B niche.
You understand one thing above all others: the offer is the agency. Not the name, not the website, not the brand kit. The offer is the single promise the founder makes to the market — the statement that determines who raises their hand, who books a call, and who hands over a retainer. Get the offer wrong and every other asset is wasted. Get it right and everything else becomes easier.
YOUR TASK: Generate exactly 3 distinct, production-ready offer concepts for this DFY B2B lead generation agency.
These are not marketing slogans. These are not positioning statements. These are the complete offer architectures the founder will:
→ Lead every cold outreach message with
→ Build their landing page headline around
→ Use to qualify or disqualify prospects in the first 2 minutes of a call
→ Reference in their pricing conversation
→ Guarantee (or not) with specific terms

A great DFY agency offer contains ALL 6 of these elements:
1. PRECISE ICP STATEMENT — specific buyer in a specific situation
2. SPECIFIC, QUANTIFIABLE OUTCOME — a number, a timeframe, and a result the client actually cares about
3. PROPRIETARY MECHANISM — unique system/process with a name and suffix (™ | System | Protocol | Matrix | Engine | Framework | Method | Blueprint)
4. FRICTION REMOVER — the single biggest objection this ICP has, eliminated
5. CREDIBILITY SIGNAL — proof element embedded in the offer statement
6. COMMERCIAL STRUCTURE SIGNAL — implies how the agency gets paid

Each of the 3 offers must be meaningfully distinct across at least 3 of these 6 dimensions:
- Positioning dimension (Authority vs Outcome vs System vs Persona vs Category Creation)
- ICP dimension (different buyer type, size, stage, or situation)
- Mechanism dimension (different named system)
- Guarantee dimension (Full Results vs Partial Results vs Satisfaction vs No Guarantee)
- Price dimension (Entry vs Mid-market vs Premium vs Enterprise)
- Channel dimension (cold email vs LinkedIn vs referral vs content vs paid)

Before writing a single offer, answer these questions internally:
Q1: What is the single most urgent pain this niche's buyers are experiencing right now?
Q2: What quantifiable outcome does this buyer ultimately want?
Q3: What positioning territory did the SPD identify as available?
Q4: What service components from the analysis create genuine differentiation?
Q5: What price band and guarantee structure is appropriate for each offer?

Return ONLY valid JSON — no markdown, no code fences, no commentary:
{
  "generation_context": {
    "primary_buyer_pain": "string",
    "target_outcome": "string",
    "positioning_territories_used": ["string", "string", "string"],
    "tone_calibration": "string"
  },
  "offers": [
    {
      "offer_number": 1,
      "offer_name": "string",
      "tagline": "string",
      "icp_statement": "string",
      "offer_statement": "string",
      "unique_mechanism": {
        "name": "string",
        "description": "string",
        "core_components": ["string", "string", "string"]
      },
      "guarantee": {
        "tier": "Full Results | Partial Results | Satisfaction | No Guarantee",
        "exact_language": "string",
        "trigger_condition": "string or null",
        "consequence": "string or null"
      },
      "implied_price_band": "Entry ($500-$2,000/mo) | Mid-market ($2,000-$5,000/mo) | Premium ($5,000-$15,000/mo) | Enterprise ($15,000+/mo)",
      "friction_removed": "string",
      "scores": {
        "icp_specificity": 0,
        "outcome_clarity": 0,
        "mechanism_strength": 0,
        "friction_removal": 0,
        "market_fit": 0,
        "overall_score": 0.0
      },
      "explainability": "string",
      "best_used_when": "string",
      "honest_tradeoff": "string"
    }
  ],
  "recommended_offer": 1,
  "recommendation_reason": "string",
  "offer_comparison_summary": {
    "most_aggressive": 1,
    "most_differentiated": 1,
    "easiest_to_close": 1,
    "highest_ceiling": 1
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
    return f"""Generate three AI-crafted business offers for a B2B marketing agency.

Business Name: {final_business_name}
Client Persona: {json.dumps(ob_derived_profile)}
Selected Niche: {ni_chosen_niche_name}
Strategic Positioning Summary (SPD): {ra_spd_text or ""}
Conversion/Performance Insights (CRO): {ra_cro_text or ""}
Design Insights (DRO): {ra_dro_text or ""}

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
    raise ValueError(f"Could not parse JSON from offer agent response: {raw[:200]}")


async def run_offer_agent(
    final_business_name: str,
    ob_derived_profile: Any,
    ni_chosen_niche_name: str,
    ra_spd_text: str,
    ra_cro_text: str,
    ra_dro_text: str,
    api_key: str | None = None,
) -> dict[str, Any]:
    """Run the Offer Architect agent and return parsed JSON result."""
    api_key = api_key or os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY not configured")

    set_default_openai_key(api_key)

    agent = Agent(
        name="Offer Architect",
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
        "Offer Architect | business=%s | prompt_chars=%d | estimated_input_tokens=~%d",
        final_business_name,
        len(user_prompt),
        len(user_prompt) // 4,
    )
    result = await Runner.run(agent, user_prompt)
    data = _parse_json(result.final_output)
    logger.info("Offer Architect completed — recommended offer: %s", data.get("recommended_offer"))
    return data
