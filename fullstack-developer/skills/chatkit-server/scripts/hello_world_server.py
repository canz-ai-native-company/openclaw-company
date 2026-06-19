#!/usr/bin/env python3
"""
ChatKit Hello World Server

A minimal ChatKit server that responds with "Hello, world!"
Run with: uvicorn hello_world_server:app --reload --port 8000

Prerequisites:
    pip install openai-chatkit fastapi uvicorn
"""

from datetime import datetime
from typing import AsyncIterator, Any

from fastapi import FastAPI, Request
from fastapi.responses import Response, StreamingResponse

from chatkit.server import ChatKitServer
from chatkit.store import Store
from chatkit.types import (
    ThreadMetadata,
    UserMessageItem,
    ThreadStreamEvent,
    ThreadItemDoneEvent,
    AssistantMessageItem,
    AssistantMessageContent,
    ThreadItem,
    Page,
    Attachment,
)
from chatkit.utils import StreamingResult


# ============================================================================
# In-Memory Store (Development Only)
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
# ChatKit Server
# ============================================================================

class HelloWorldServer(ChatKitServer[dict]):
    """Minimal ChatKit server that responds with 'Hello, world!'"""

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


# ============================================================================
# FastAPI Application
# ============================================================================

app = FastAPI(title="ChatKit Hello World")
store = InMemoryStore()
server = HelloWorldServer(store=store)


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
