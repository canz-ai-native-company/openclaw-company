# OpenAI Agents SDK - Twilio SIP Trunk Voice Agent Reference

Complete reference for building production voice/call agents using **Twilio Elastic SIP Trunking** with OpenAI Realtime API. Audio flows directly between Twilio and OpenAI — your server never touches audio.

**This is the ONLY approach to use for Twilio voice agents. Do NOT use the Media Streams approach.**

---

## Architecture

```
Phone Call → Twilio Number → SIP Trunk → OpenAI SIP Endpoint (audio direct)
                                                  ↓ webhook
                                           Your FastAPI Server (control only)
                                                  ↓
                                           Accept call + Observe transcripts
```

**Key benefit:** Your server is a **control plane only** — accept/reject calls, define agent behavior, observe transcripts. OpenAI handles ALL audio transport. Zero latency from your server, zero audio processing.

---

## Prerequisites

| Requirement | Details |
|-------------|---------|
| Python 3.10+ | Runtime |
| OpenAI API key | With Realtime API access |
| OpenAI Webhook Secret | For signature verification |
| Twilio account | With phone number + Elastic SIP Trunking |
| Public HTTPS endpoint | ngrok for dev, deployed server for prod |

---

## Dependencies

```
fastapi>=0.120.0
openai>=2.2,<3
uvicorn[standard]>=0.38.0
```

**Note:** This uses `openai` SDK directly (not `openai-agents` package), plus `agents` package for RealtimeAgent/RealtimeRunner.

---

## Environment Variables

```bash
export OPENAI_API_KEY="sk-..."
export OPENAI_WEBHOOK_SECRET="whsec_..."
```

---

## Setup Steps

### 1. OpenAI Platform Configuration

1. Go to [platform.openai.com/settings](https://platform.openai.com/settings), select your project
2. Create a webhook:
   - URL: `https://<your-public-host>/openai/webhook`
   - Event type: `realtime.call.incoming`
   - Note the signing secret → set as `OPENAI_WEBHOOK_SECRET`

### 2. Twilio Elastic SIP Trunk Configuration

1. In Twilio Console, create (or edit) an Elastic SIP Trunk
2. On the **Origination** tab, add origination SIP URI:
   ```
   sip:proj_<your_openai_project_id>@sip.api.openai.com;transport=tls
   ```
3. Add at least one phone number to the trunk
4. Leave the Termination tab unchanged (ends with `.pstn.twilio.com`)

### 3. Run the Server

```bash
# Install dependencies
pip install fastapi "openai>=2.2,<3" "uvicorn[standard]>=0.38.0"

# Start server
uvicorn server:app --host 0.0.0.0 --port 8000

# Expose publicly (dev)
ngrok http 8000
```

---

## Complete Server Implementation

### agents.py — Multi-Agent Definition

```python
"""Realtime agent definitions for Twilio SIP voice agent."""

from __future__ import annotations

import asyncio

from agents import function_tool
from agents.extensions.handoff_prompt import RECOMMENDED_PROMPT_PREFIX
from agents.realtime import RealtimeAgent, realtime_handoff


WELCOME_MESSAGE = "Hello, this is ABC customer service. How can I help you today?"


# --- Tools -----------------------------------------------------------------

@function_tool(
    name_override="faq_lookup_tool",
    description_override="Lookup frequently asked questions."
)
async def faq_lookup_tool(question: str) -> str:
    """Fetch FAQ answers for the caller."""
    await asyncio.sleep(3)  # Simulate lookup delay

    q = question.lower()
    if "plan" in q or "wifi" in q or "wi-fi" in q:
        return "We provide complimentary Wi-Fi. Join the ABC-Customer network."
    if "billing" in q or "invoice" in q:
        return "Your latest invoice is available in the ABC portal under Billing > History."
    if "hours" in q or "support" in q:
        return "Human support agents are available 24/7; transfer to the specialist if needed."
    return "I'm not sure about that. Let me transfer you back to the triage agent."


@function_tool
async def update_customer_record(customer_id: str, note: str) -> str:
    """Record a short note about the caller."""
    await asyncio.sleep(1)
    return f"Recorded note for {customer_id}: {note}"


# --- Agents ----------------------------------------------------------------

faq_agent = RealtimeAgent(
    name="FAQ Agent",
    handoff_description="Handles frequently asked questions and general account inquiries.",
    instructions=f"""{RECOMMENDED_PROMPT_PREFIX}
    You are an FAQ specialist. Always rely on the faq_lookup_tool for answers and keep replies
    concise. If the caller needs hands-on help, transfer back to the triage agent.
    """,
    tools=[faq_lookup_tool],
)

records_agent = RealtimeAgent(
    name="Records Agent",
    handoff_description="Updates customer records with brief notes and confirmation numbers.",
    instructions=f"""{RECOMMENDED_PROMPT_PREFIX}
    You handle structured updates. Confirm the customer's ID, capture their request in a short
    note, and use the update_customer_record tool. For anything outside data updates, return to the
    triage agent.
    """,
    tools=[update_customer_record],
)

triage_agent = RealtimeAgent(
    name="Triage Agent",
    handoff_description="Greets callers and routes them to the most appropriate specialist.",
    instructions=(
        f"{RECOMMENDED_PROMPT_PREFIX} "
        "Always begin the call by saying exactly: '"
        f"{WELCOME_MESSAGE}' "
        "before collecting details. Once the greeting is complete, gather context and hand off to "
        "the FAQ or Records agents when appropriate."
    ),
    handoffs=[faq_agent, realtime_handoff(records_agent)],
)

# Circular handoffs — specialists can route back to triage
faq_agent.handoffs.append(triage_agent)
records_agent.handoffs.append(triage_agent)


def get_starting_agent() -> RealtimeAgent:
    """Return the agent used to start each realtime call."""
    return triage_agent
```

### server.py — FastAPI Webhook Server

```python
"""Minimal FastAPI server for handling OpenAI Realtime SIP calls with Twilio."""

from __future__ import annotations

import asyncio
import logging
import os

import websockets
from fastapi import FastAPI, HTTPException, Request, Response
from openai import APIStatusError, AsyncOpenAI, InvalidWebhookSignatureError

from agents.realtime.config import RealtimeSessionModelSettings
from agents.realtime.items import (
    AssistantAudio,
    AssistantMessageItem,
    AssistantText,
    InputText,
    UserMessageItem,
)
from agents.realtime.model_inputs import RealtimeModelSendRawMessage
from agents.realtime.openai_realtime import OpenAIRealtimeSIPModel
from agents.realtime.runner import RealtimeRunner

from .agents import WELCOME_MESSAGE, get_starting_agent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("twilio_sip")


def _get_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing environment variable: {name}")
    return value


OPENAI_API_KEY = _get_env("OPENAI_API_KEY")
OPENAI_WEBHOOK_SECRET = _get_env("OPENAI_WEBHOOK_SECRET")

client = AsyncOpenAI(api_key=OPENAI_API_KEY, webhook_secret=OPENAI_WEBHOOK_SECRET)

# Build the multi-agent graph from agents.py
assistant_agent = get_starting_agent()

app = FastAPI()

# Track background tasks so repeated webhooks do not spawn duplicates
active_call_tasks: dict[str, asyncio.Task[None]] = {}


async def accept_call(call_id: str) -> None:
    """Accept the incoming SIP call and configure the realtime session."""

    instructions_payload = (
        assistant_agent.instructions
        if isinstance(assistant_agent.instructions, str)
        else "You are a helpful triage agent."
    )

    try:
        await client.post(
            f"/realtime/calls/{call_id}/accept",
            body={
                "type": "realtime",
                "model": "gpt-realtime-1.5",
                "instructions": instructions_payload,
            },
            cast_to=dict,
        )
    except APIStatusError as exc:
        if exc.status_code == 404:
            # Caller hung up before accept — treat as no-op
            logger.warning(
                "Call %s no longer exists when attempting accept (404). Skipping.", call_id
            )
            return

        detail = exc.message
        if exc.response is not None:
            try:
                detail = exc.response.text
            except Exception:
                detail = str(exc.response)

        logger.error("Failed to accept call %s: %s %s", call_id, exc.status_code, detail)
        raise HTTPException(status_code=500, detail="Failed to accept call") from exc

    logger.info("Accepted call %s", call_id)


async def observe_call(call_id: str) -> None:
    """Attach to the realtime session and log conversation events."""

    runner = RealtimeRunner(assistant_agent, model=OpenAIRealtimeSIPModel())

    try:
        initial_model_settings: RealtimeSessionModelSettings = {
            "turn_detection": {
                "type": "semantic_vad",
                "interrupt_response": True,
            }
        }
        async with await runner.run(
            model_config={
                "call_id": call_id,
                "initial_model_settings": initial_model_settings,
            }
        ) as session:
            # Trigger initial greeting so callers hear the agent right away
            await session.model.send_event(
                RealtimeModelSendRawMessage(
                    message={
                        "type": "response.create",
                        "other_data": {
                            "response": {
                                "instructions": (
                                    "Say exactly '"
                                    f"{WELCOME_MESSAGE}"
                                    "' now before continuing the conversation."
                                )
                            }
                        },
                    }
                )
            )

            async for event in session:
                if event.type == "history_added":
                    item = event.item
                    if isinstance(item, UserMessageItem):
                        for user_content in item.content:
                            if isinstance(user_content, InputText) and user_content.text:
                                logger.info("Caller: %s", user_content.text)
                    elif isinstance(item, AssistantMessageItem):
                        for assistant_content in item.content:
                            if (
                                isinstance(assistant_content, AssistantText)
                                and assistant_content.text
                            ):
                                logger.info("Assistant (text): %s", assistant_content.text)
                            elif (
                                isinstance(assistant_content, AssistantAudio)
                                and assistant_content.transcript
                            ):
                                logger.info(
                                    "Assistant (audio transcript): %s",
                                    assistant_content.transcript,
                                )
                elif event.type == "error":
                    logger.error("Realtime session error: %s", event.error)

    except websockets.exceptions.ConnectionClosedError:
        logger.info("Realtime WebSocket closed for call %s", call_id)
    except Exception as exc:
        logger.exception("Error while observing call %s", call_id, exc_info=exc)
    finally:
        logger.info("Call %s ended", call_id)
        active_call_tasks.pop(call_id, None)


def _track_call_task(call_id: str) -> None:
    """Ensure only one observer per call (handles webhook retries)."""
    existing = active_call_tasks.get(call_id)
    if existing:
        if not existing.done():
            logger.info(
                "Call %s already has an active observer; ignoring duplicate webhook.", call_id
            )
            return
        active_call_tasks.pop(call_id, None)

    task = asyncio.create_task(observe_call(call_id))
    active_call_tasks[call_id] = task


@app.post("/openai/webhook")
async def openai_webhook(request: Request) -> Response:
    """Handle incoming webhook from OpenAI when a SIP call arrives."""
    body = await request.body()

    try:
        event = client.webhooks.unwrap(body, request.headers)
    except InvalidWebhookSignatureError as exc:
        raise HTTPException(status_code=400, detail="Invalid webhook signature") from exc

    if event.type == "realtime.call.incoming":
        call_id = event.data.call_id
        await accept_call(call_id)
        _track_call_task(call_id)
        return Response(status_code=200)

    return Response(status_code=200)


@app.get("/")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
```

---

## Key Imports Reference

```python
# OpenAI client (async, with webhook support)
from openai import APIStatusError, AsyncOpenAI, InvalidWebhookSignatureError

# Agents SDK — Realtime
from agents import function_tool
from agents.extensions.handoff_prompt import RECOMMENDED_PROMPT_PREFIX
from agents.realtime import RealtimeAgent, realtime_handoff
from agents.realtime.config import RealtimeSessionModelSettings
from agents.realtime.items import (
    AssistantAudio, AssistantMessageItem, AssistantText,
    InputText, UserMessageItem,
)
from agents.realtime.model_inputs import RealtimeModelSendRawMessage
from agents.realtime.openai_realtime import OpenAIRealtimeSIPModel
from agents.realtime.runner import RealtimeRunner
```

---

## Call Flow (Step by Step)

```
1. Caller dials Twilio number
2. Twilio forwards via SIP Trunk → sip:proj_<id>@sip.api.openai.com
3. OpenAI fires webhook → POST /openai/webhook
   Event type: "realtime.call.incoming"
   Payload: { data: { call_id: "call_xxx" } }
4. Server verifies webhook signature (OPENAI_WEBHOOK_SECRET)
5. Server calls POST /realtime/calls/{call_id}/accept
   Body: { type: "realtime", model: "gpt-realtime-1.5", instructions: "..." }
6. Server spawns background task: observe_call(call_id)
7. observe_call connects via WebSocket using OpenAIRealtimeSIPModel
8. Server sends response.create event → triggers greeting
9. Audio flows directly between Twilio SIP ↔ OpenAI SIP (server never sees audio)
10. Server observes transcripts (history_added events) for logging
11. Caller hangs up → WebSocket closes → task cleaned up
```

---

## Multi-Agent Pattern for Voice

Voice agents use the same handoff pattern as text agents, but with `RealtimeAgent` + `realtime_handoff`:

```python
from agents.realtime import RealtimeAgent, realtime_handoff
from agents.extensions.handoff_prompt import RECOMMENDED_PROMPT_PREFIX

# Specialist agents
specialist_a = RealtimeAgent(
    name="Specialist A",
    handoff_description="Handles X type inquiries.",
    instructions=f"{RECOMMENDED_PROMPT_PREFIX} You handle X...",
    tools=[tool_a],
)

specialist_b = RealtimeAgent(
    name="Specialist B",
    handoff_description="Handles Y type inquiries.",
    instructions=f"{RECOMMENDED_PROMPT_PREFIX} You handle Y...",
    tools=[tool_b],
)

# Triage agent (entry point)
triage = RealtimeAgent(
    name="Triage",
    handoff_description="Greets and routes callers.",
    instructions=f"{RECOMMENDED_PROMPT_PREFIX} Greet the caller, then route...",
    handoffs=[specialist_a, realtime_handoff(specialist_b)],
)

# Circular handoffs — specialists can route back
specialist_a.handoffs.append(triage)
specialist_b.handoffs.append(triage)
```

**Important:** Use `RECOMMENDED_PROMPT_PREFIX` from `agents.extensions.handoff_prompt` for proper handoff behavior in multi-agent voice systems.

---

## Greeting Pattern

The greeting is triggered via a raw `response.create` event immediately after connecting:

```python
await session.model.send_event(
    RealtimeModelSendRawMessage(
        message={
            "type": "response.create",
            "other_data": {
                "response": {
                    "instructions": (
                        "Say exactly '"
                        f"{WELCOME_MESSAGE}"
                        "' now before continuing the conversation."
                    )
                }
            },
        }
    )
)
```

This ensures the caller hears the agent immediately — before they say anything. Without this, there would be silence until the caller speaks first.

---

## Webhook Signature Verification

**MANDATORY for production.** Never skip this.

```python
from openai import AsyncOpenAI, InvalidWebhookSignatureError

client = AsyncOpenAI(
    api_key=OPENAI_API_KEY,
    webhook_secret=OPENAI_WEBHOOK_SECRET,  # "whsec_..." from OpenAI settings
)

@app.post("/openai/webhook")
async def openai_webhook(request: Request) -> Response:
    body = await request.body()

    try:
        event = client.webhooks.unwrap(body, request.headers)
    except InvalidWebhookSignatureError as exc:
        raise HTTPException(status_code=400, detail="Invalid webhook signature") from exc

    if event.type == "realtime.call.incoming":
        call_id = event.data.call_id
        await accept_call(call_id)
        _track_call_task(call_id)

    return Response(status_code=200)
```

---

## Customization Guide

### Custom Tools

Replace the demo tools with your business logic:

```python
@function_tool
async def check_appointment(phone_number: str) -> str:
    """Check next appointment for a patient."""
    # Query your database here
    return f"Your next appointment is tomorrow at 2:00 PM."

@function_tool
async def book_appointment(date: str, time: str, service: str) -> str:
    """Book an appointment."""
    # Insert into your database here
    return f"Appointment booked: {service} on {date} at {time}."
```

### Custom Agent Instructions

Adapt the triage agent for your business:

```python
WELCOME_MESSAGE = "Thank you for calling Dr. Smith's office. How may I help you?"

triage_agent = RealtimeAgent(
    name="Reception",
    instructions=(
        f"{RECOMMENDED_PROMPT_PREFIX} "
        f"Always begin by saying exactly: '{WELCOME_MESSAGE}' "
        "Then determine if the caller wants to book, reschedule, or cancel an appointment. "
        "Route to the appropriate specialist agent."
    ),
    handoffs=[booking_agent, realtime_handoff(cancellation_agent)],
)
```

### Voice Selection

Set the voice in `accept_call` or model settings:

| Voice | Description | Best For |
|-------|-------------|----------|
| alloy | Neutral, balanced | General purpose |
| ash | Warm, natural | Customer service |
| echo | Clear, articulate | Professional/corporate |
| nova | Energetic, friendly | Sales, hospitality |
| shimmer | Soft, soothing | Healthcare, wellness |

---

## Error Handling Patterns

### Call Already Hung Up (404)

```python
except APIStatusError as exc:
    if exc.status_code == 404:
        # Caller hung up before accept — safe to ignore
        logger.warning("Call %s no longer exists (404). Skipping.", call_id)
        return
```

### Duplicate Webhook Delivery

```python
def _track_call_task(call_id: str) -> None:
    existing = active_call_tasks.get(call_id)
    if existing and not existing.done():
        # Already handling this call — ignore duplicate
        return
```

### WebSocket Closed (Caller Hang Up)

```python
except websockets.exceptions.ConnectionClosedError:
    # Normal — caller hung up
    logger.info("WebSocket closed for call %s", call_id)
```

---

## Project Structure

```
voice-agent/
├── agents.py           # Agent definitions + tools + handoffs
├── server.py           # FastAPI webhook server
├── requirements.txt    # Dependencies
├── .env                # OPENAI_API_KEY, OPENAI_WEBHOOK_SECRET
└── README.md
```

---

## FORBIDDEN

| Do NOT | Why | Do Instead |
|--------|-----|-----------|
| Use Media Streams approach | Higher latency, more code, server processes audio | Use SIP Trunk (this reference) |
| Skip webhook signature verification | Security vulnerability | Always verify with `OPENAI_WEBHOOK_SECRET` |
| Use `openai-agents` package alone | SIP needs `openai` SDK for `AsyncOpenAI` client | Use both `openai` + `agents` packages |
| Handle audio on your server | Unnecessary with SIP — OpenAI handles it | Let audio flow directly Twilio ↔ OpenAI |
| Skip `response.create` greeting | Caller hears silence | Always trigger greeting immediately |
| Use `gpt-realtime` model name | Outdated | Use `gpt-realtime-1.5` |
| Forget circular handoffs | Specialists can't route back to triage | Add `specialist.handoffs.append(triage)` |
| Skip `RECOMMENDED_PROMPT_PREFIX` | Handoffs won't work properly | Always use for multi-agent voice |
