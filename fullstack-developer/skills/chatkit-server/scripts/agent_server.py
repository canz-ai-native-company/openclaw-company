#!/usr/bin/env python3
"""
ChatKit Server with Agents SDK Integration

A production-ready ChatKit server using OpenAI Agents SDK.
Run with: uvicorn agent_server:app --reload --port 8000

Prerequisites:
    pip install openai-chatkit fastapi uvicorn openai-agents
    export OPENAI_API_KEY=sk-proj-...
"""

from datetime import datetime
from typing import AsyncIterator, Any

from fastapi import FastAPI, Request
from fastapi.responses import Response, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from agents import Agent, Runner, function_tool
from agents.run_context import RunContextWrapper

from chatkit.server import ChatKitServer
from chatkit.store import Store
from chatkit.agents import AgentContext, stream_agent_response, simple_to_agent_input
from chatkit.types import (
    ThreadMetadata,
    UserMessageItem,
    ThreadStreamEvent,
    ThreadItem,
    Page,
    Attachment,
    ProgressUpdateEvent,
)
from chatkit.utils import StreamingResult


# ============================================================================
# In-Memory Store (Replace with production database)
# ============================================================================

class InMemoryStore(Store[dict]):
    """Simple in-memory store for development/testing."""

    def __init__(self):
        self.threads: dict[str, ThreadMetadata] = {}
        self.items: dict[str, list[ThreadItem]] = {}
        self.attachments: dict[str, Attachment] = {}

    async def load_thread(self, thread_id: str, context: dict) -> ThreadMetadata:
        if thread_id not in self.threads:
            raise KeyError(f"Thread {thread_id} not found")
        return self.threads[thread_id]

    async def save_thread(self, thread: ThreadMetadata, context: dict) -> None:
        self.threads[thread.id] = thread

    async def load_thread_items(
        self,
        thread_id: str,
        after: str | None,
        limit: int,
        order: str,
        context: dict,
    ) -> Page[ThreadItem]:
        items = self.items.get(thread_id, [])
        if order == "desc":
            items = list(reversed(items))
        return Page(data=items[:limit], has_more=len(items) > limit)

    async def load_threads(
        self,
        limit: int,
        after: str | None,
        order: str,
        context: dict,
    ) -> Page[ThreadMetadata]:
        threads = list(self.threads.values())
        return Page(data=threads[:limit], has_more=len(threads) > limit)

    async def add_thread_item(
        self, thread_id: str, item: ThreadItem, context: dict
    ) -> None:
        if thread_id not in self.items:
            self.items[thread_id] = []
        self.items[thread_id].append(item)

    async def save_item(
        self, thread_id: str, item: ThreadItem, context: dict
    ) -> None:
        items = self.items.get(thread_id, [])
        for i, existing in enumerate(items):
            if existing.id == item.id:
                items[i] = item
                return

    async def load_item(
        self, thread_id: str, item_id: str, context: dict
    ) -> ThreadItem:
        for item in self.items.get(thread_id, []):
            if item.id == item_id:
                return item
        raise KeyError(f"Item {item_id} not found")

    async def delete_thread(self, thread_id: str, context: dict) -> None:
        self.threads.pop(thread_id, None)
        self.items.pop(thread_id, None)

    async def delete_thread_item(
        self, thread_id: str, item_id: str, context: dict
    ) -> None:
        items = self.items.get(thread_id, [])
        self.items[thread_id] = [i for i in items if i.id != item_id]

    async def save_attachment(self, attachment: Attachment, context: dict) -> None:
        self.attachments[attachment.id] = attachment

    async def load_attachment(self, attachment_id: str, context: dict) -> Attachment:
        if attachment_id not in self.attachments:
            raise KeyError(f"Attachment {attachment_id} not found")
        return self.attachments[attachment_id]

    async def delete_attachment(self, attachment_id: str, context: dict) -> None:
        self.attachments.pop(attachment_id, None)


# ============================================================================
# Function Tools
# ============================================================================

@function_tool(description_override="Get the current date and time.")
async def get_current_time(ctx: RunContextWrapper[AgentContext]) -> str:
    """Returns the current date and time."""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


@function_tool(description_override="Perform a calculation.")
async def calculate(
    ctx: RunContextWrapper[AgentContext],
    expression: str
) -> str:
    """Safely evaluate a mathematical expression."""
    # Show progress
    await ctx.context.stream(
        ProgressUpdateEvent(text="Calculating...")
    )

    # Safe evaluation (only basic math)
    allowed_chars = set("0123456789+-*/.() ")
    if not all(c in allowed_chars for c in expression):
        return "Error: Invalid characters in expression"

    try:
        result = eval(expression)  # Note: Use safer evaluation in production
        return f"{expression} = {result}"
    except Exception as e:
        return f"Error: {e}"


# ============================================================================
# ChatKit Server with Agent
# ============================================================================

class AgentChatKitServer(ChatKitServer[dict]):
    """ChatKit server using OpenAI Agents SDK."""

    def __init__(self, data_store: Store, attachment_store=None):
        super().__init__(data_store, attachment_store)

    assistant_agent = Agent[AgentContext](
        model="gpt-4.1",
        name="Assistant",
        instructions="""You are a helpful assistant. You can:
- Answer questions
- Get the current time
- Perform calculations

Be concise and helpful in your responses.""",
        tools=[get_current_time, calculate],
    )

    async def respond(
        self,
        thread: ThreadMetadata,
        input: UserMessageItem | None,
        context: Any,
    ) -> AsyncIterator[ThreadStreamEvent]:
        agent_context = AgentContext(
            thread=thread,
            store=self.store,
            request_context=context,
        )

        result = Runner.run_streamed(
            self.assistant_agent,
            await simple_to_agent_input(input) if input else [],
            context=agent_context,
        )

        async for event in stream_agent_response(agent_context, result):
            yield event


# ============================================================================
# FastAPI Application
# ============================================================================

app = FastAPI(title="ChatKit Agent Server")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

store = InMemoryStore()
server = AgentChatKitServer(data_store=store)


@app.post("/chatkit")
async def chatkit_endpoint(request: Request):
    """Main ChatKit endpoint handling all chat operations."""
    result = await server.process(await request.body(), context={})
    if isinstance(result, StreamingResult):
        return StreamingResponse(result, media_type="text/event-stream")
    return Response(content=result.json, media_type="application/json")


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
