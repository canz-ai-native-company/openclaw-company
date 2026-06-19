---
name: chatkit-server
description: Build conversational AI backends with OpenAI ChatKit Python SDK. Use when creating chat servers, implementing AI assistants, building chatbots, or developing conversational interfaces with FastAPI. Covers hello world to production systems including Agents SDK integration, streaming responses, widgets, tools, stores, and attachments.
---

# ChatKit Server

Build conversational AI backends from hello world to production systems using OpenAI's ChatKit Python SDK.

## Quick Start

### Installation

```bash
pip install openai-chatkit fastapi uvicorn
```

For Agents SDK integration:
```bash
pip install openai-chatkit fastapi uvicorn openai-agents
export OPENAI_API_KEY=sk-proj-...
```

### Hello World Server

```python
from datetime import datetime
from typing import AsyncIterator, Any
from fastapi import FastAPI, Request
from fastapi.responses import Response, StreamingResponse
from chatkit.server import ChatKitServer
from chatkit.types import (
    ThreadMetadata, UserMessageItem, ThreadStreamEvent,
    ThreadItemDoneEvent, AssistantMessageItem, AssistantMessageContent,
)
from chatkit.utils import StreamingResult

class HelloWorldServer(ChatKitServer[dict]):
    async def respond(
        self,
        thread: ThreadMetadata,
        input_user_message: UserMessageItem | None,
        context: dict,
    ) -> AsyncIterator[ThreadStreamEvent]:
        yield ThreadItemDoneEvent(
            item=AssistantMessageItem(
                thread_id=thread.id,
                id=self.store.generate_item_id("message", thread, context),
                created_at=datetime.now(),
                content=[AssistantMessageContent(text="Hello, world!")],
            ),
        )

app = FastAPI()
server = HelloWorldServer(store=YourStore())

@app.post("/chatkit")
async def chatkit(request: Request):
    result = await server.process(await request.body(), context={})
    if isinstance(result, StreamingResult):
        return StreamingResponse(result, media_type="text/event-stream")
    return Response(content=result.json, media_type="application/json")
```

Run: `uvicorn main:app --reload --port 8000`

## Core Architecture

### ChatKitServer

Inherit from `ChatKitServer` and implement `respond()`:

```python
from chatkit.server import ChatKitServer

class MyChatKitServer(ChatKitServer[TContext]):
    def __init__(self, data_store, attachment_store=None):
        super().__init__(data_store, attachment_store)

    async def respond(
        self,
        thread: ThreadMetadata,
        input: UserMessageItem | None,
        context: TContext,
    ) -> AsyncIterator[ThreadStreamEvent]:
        # Yield ThreadStreamEvent instances
        yield ThreadItemDoneEvent(item=...)
```

### Agents SDK Integration

```python
from agents import Agent, Runner
from chatkit.agents import AgentContext, stream_agent_response, simple_to_agent_input

class AgentServer(ChatKitServer[dict]):
    assistant = Agent[AgentContext](
        model="gpt-4.1",
        name="Assistant",
        instructions="You are a helpful assistant",
    )

    async def respond(self, thread, input, context):
        agent_context = AgentContext(
            thread=thread,
            store=self.store,
            request_context=context,
        )
        result = Runner.run_streamed(
            self.assistant,
            await simple_to_agent_input(input) if input else [],
            context=agent_context,
        )
        async for event in stream_agent_response(agent_context, result):
            yield event
```

### Function Tools

```python
from agents import function_tool
from agents.run_context import RunContextWrapper
from chatkit.agents import AgentContext
from chatkit.types import ProgressUpdateEvent

@function_tool(description_override="Search the knowledge base.")
async def search(ctx: RunContextWrapper[AgentContext], query: str) -> str:
    await ctx.context.stream(ProgressUpdateEvent(text="Searching..."))
    results = await perform_search(query)
    return format_results(results)

agent = Agent[AgentContext](
    model="gpt-4.1",
    name="Assistant",
    tools=[search],
)
```

## Key Events

| Event | Purpose |
|-------|---------|
| `ThreadItemDoneEvent` | Completed message/widget |
| `ProgressUpdateEvent` | Progress feedback |
| `ErrorEvent` | Error notification |
| `ThreadCreatedEvent` | New thread |
| `ThreadUpdatedEvent` | Thread metadata change |

## Widgets

Return rich UI from tools:

```python
from chatkit.widgets import Card, Text, Button

@function_tool()
async def show_product(ctx: RunContextWrapper[AgentContext], id: str):
    product = await fetch_product(id)
    await ctx.context.stream_widget(
        Card(children=[
            Text(value=product.name, size="lg", weight="bold"),
            Text(value=f"${product.price}"),
            Button(label="Add to Cart", style="primary"),
        ])
    )
```

## Error Handling

```python
from chatkit.errors import CustomStreamError

async def respond(self, thread, input, context):
    if not input:
        raise CustomStreamError(
            message="No input provided",
            allow_retry=False,
        )
    # ... processing
```

## References

For detailed documentation on specific topics:

- **[stores.md](references/stores.md)** - Store interface, InMemoryStore, AttachmentStore, database integration
- **[agents.md](references/agents.md)** - Agents SDK, function tools, client tools, multi-agent patterns
- **[widgets.md](references/widgets.md)** - Card, Text, Button, Form, Image, Chart components
- **[events-and-types.md](references/events-and-types.md)** - ThreadStreamEvent, ThreadItem types, error handling

## Scripts

- **[hello_world_server.py](scripts/hello_world_server.py)** - Minimal working server
- **[agent_server.py](scripts/agent_server.py)** - Production server with Agents SDK

---

## Related Skills

For features not covered in this skill, use the **context7-docs** skill to fetch official documentation before writing code.
