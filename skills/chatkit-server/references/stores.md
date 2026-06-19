# ChatKit Store Implementation Guide

## Overview

ChatKit requires a `Store` implementation for persisting threads, messages, and attachments. You must implement the abstract `Store` class using your chosen database technology.

## Store Interface

```python
from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Literal
from chatkit.store import Store
from chatkit.types import ThreadMetadata, ThreadItem, Page, Attachment

TContext = TypeVar("TContext")

class Store(ABC, Generic[TContext]):
    def generate_thread_id(self, context: TContext) -> str:
        """Override for custom thread ID generation. Default: UUID4 prefixed."""
        return default_generate_id("thread")

    def generate_item_id(
        self,
        item_type: Literal["message", "tool_call", "task", "workflow", "attachment"],
        thread: ThreadMetadata,
        context: TContext,
    ) -> str:
        """Override for custom item ID generation."""
        return default_generate_id(item_type)

    @abstractmethod
    async def load_thread(self, thread_id: str, context: TContext) -> ThreadMetadata:
        pass

    @abstractmethod
    async def save_thread(self, thread: ThreadMetadata, context: TContext) -> None:
        pass

    @abstractmethod
    async def load_thread_items(
        self,
        thread_id: str,
        after: str | None,
        limit: int,
        order: str,
        context: TContext,
    ) -> Page[ThreadItem]:
        pass

    @abstractmethod
    async def load_threads(
        self,
        limit: int,
        after: str | None,
        order: str,
        context: TContext,
    ) -> Page[ThreadMetadata]:
        pass

    @abstractmethod
    async def add_thread_item(
        self, thread_id: str, item: ThreadItem, context: TContext
    ) -> None:
        pass

    @abstractmethod
    async def save_item(
        self, thread_id: str, item: ThreadItem, context: TContext
    ) -> None:
        pass

    @abstractmethod
    async def load_item(
        self, thread_id: str, item_id: str, context: TContext
    ) -> ThreadItem:
        pass

    @abstractmethod
    async def delete_thread(self, thread_id: str, context: TContext) -> None:
        pass

    @abstractmethod
    async def delete_thread_item(
        self, thread_id: str, item_id: str, context: TContext
    ) -> None:
        pass

    @abstractmethod
    async def save_attachment(self, attachment: Attachment, context: TContext) -> None:
        pass

    @abstractmethod
    async def load_attachment(self, attachment_id: str, context: TContext) -> Attachment:
        pass

    @abstractmethod
    async def delete_attachment(self, attachment_id: str, context: TContext) -> None:
        pass
```

## Implementation Guidelines

### Schema Design for Relational Databases

Serialize ThreadItem and Attachment models into JSON columns instead of spreading fields across multiple columns. This provides forward compatibility as types evolve between library versions.

```python
# Recommended: JSON column approach
class ThreadItemRow:
    id: str
    thread_id: str
    data: str  # JSON-serialized ThreadItem

# Not recommended: Separate columns
class ThreadItemRow:
    id: str
    thread_id: str
    type: str
    content: str
    created_at: datetime
    # ... many more fields that may change
```

### In-Memory Store (Development Only)

```python
from datetime import datetime
from chatkit.store import Store
from chatkit.types import ThreadMetadata, ThreadItem, Page, Attachment

class InMemoryStore(Store[dict]):
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
        self.items[thread_id] = items

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
```

## AttachmentStore Interface

For file uploads, implement `AttachmentStore`:

```python
from abc import ABC, abstractmethod
from chatkit.store import AttachmentStore
from chatkit.types import Attachment, AttachmentCreateParams

class AttachmentStore(ABC, Generic[TContext]):
    @abstractmethod
    async def delete_attachment(self, attachment_id: str, context: TContext) -> None:
        pass

    async def create_attachment(
        self, input: AttachmentCreateParams, context: TContext
    ) -> Attachment:
        raise NotImplementedError(
            "Must override create_attachment() to support two-phase upload"
        )

    def generate_attachment_id(self, mime_type: str, context: TContext) -> str:
        return default_generate_id("attachment")
```

### Cloud Storage Integration

```python
import base64
from chatkit.store import AttachmentStore
from chatkit.types import Attachment, ImageAttachment, AttachmentCreateParams

class BlobStorageStore(AttachmentStore[dict]):
    def __init__(self, data_store: Store):
        self.data_store = data_store
        # Initialize your cloud storage client (S3, GCS, Azure Blob, etc.)

    async def create_attachment(
        self, input: AttachmentCreateParams, context: dict
    ) -> Attachment:
        attachment_id = self.generate_attachment_id(input.mime_type, context)
        # Upload to cloud storage
        # await self.storage_client.upload(attachment_id, input.data)

        attachment = Attachment(
            id=attachment_id,
            name=input.name,
            mime_type=input.mime_type,
            size=len(input.data) if input.data else 0,
        )
        await self.data_store.save_attachment(attachment, context)
        return attachment

    async def delete_attachment(self, attachment_id: str, context: dict) -> None:
        # Delete from cloud storage
        # await self.storage_client.delete(attachment_id)
        await self.data_store.delete_attachment(attachment_id, context)
```

## Context Parameter

The `TContext` generic allows passing request-specific data through all store operations:

```python
from dataclasses import dataclass

@dataclass
class RequestContext:
    user_id: str
    tenant_id: str
    permissions: list[str]

class MultiTenantStore(Store[RequestContext]):
    async def load_thread(self, thread_id: str, context: RequestContext) -> ThreadMetadata:
        # Use context.tenant_id to scope queries
        return await self.db.query(
            "SELECT * FROM threads WHERE id = ? AND tenant_id = ?",
            thread_id, context.tenant_id
        )
```
