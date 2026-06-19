# ChatKit Events and Types Reference

## Thread Stream Events

Events yielded from `respond()` method:

```python
from chatkit.types import (
    ThreadStreamEvent,
    ThreadCreatedEvent,
    ThreadUpdatedEvent,
    ThreadItemDoneEvent,
    ThreadItemAddedEvent,
    ThreadItemUpdated,
    ThreadItemRemovedEvent,
    ThreadItemReplacedEvent,
    ProgressUpdateEvent,
    ErrorEvent,
    NoticeEvent,
)
```

### ThreadItemDoneEvent

Primary event for completed items:

```python
from datetime import datetime
from chatkit.types import ThreadItemDoneEvent, AssistantMessageItem, AssistantMessageContent

yield ThreadItemDoneEvent(
    item=AssistantMessageItem(
        id=self.store.generate_item_id("message", thread, context),
        thread_id=thread.id,
        created_at=datetime.now(),
        content=[AssistantMessageContent(text="Hello, world!")],
    ),
)
```

### ProgressUpdateEvent

Show progress during operations:

```python
from chatkit.types import ProgressUpdateEvent

yield ProgressUpdateEvent(
    text="Processing your request...",
    icon="loading",  # Optional icon name
)
```

### ErrorEvent

Signal errors to client:

```python
from chatkit.types import ErrorEvent, ErrorCode

yield ErrorEvent(
    code=ErrorCode.STREAM_ERROR,  # or "custom" for custom messages
    message="Something went wrong",  # Required for code="custom"
    allow_retry=True,
)
```

## Thread Items

```python
from chatkit.types import (
    ThreadItem,
    UserMessageItem,
    AssistantMessageItem,
    WidgetItem,
    ClientToolCallItem,
    HiddenContextItem,
    EndOfTurnItem,
    WorkflowItem,
    TaskItem,
)
```

### UserMessageItem

Incoming user messages:

```python
from chatkit.types import UserMessageItem, UserMessageContent

UserMessageItem(
    id="msg_123",
    thread_id="thread_456",
    created_at=datetime.now(),
    content=[
        UserMessageContent(text="Hello!"),
    ],
    attachments=[],  # Optional attachments
)
```

### AssistantMessageItem

Assistant responses:

```python
from chatkit.types import AssistantMessageItem, AssistantMessageContent

AssistantMessageItem(
    id="msg_789",
    thread_id="thread_456",
    created_at=datetime.now(),
    content=[
        AssistantMessageContent(text="Hello! How can I help you?"),
    ],
)
```

### WidgetItem

Rich UI widgets:

```python
from chatkit.types import WidgetItem
from chatkit.widgets import Card, Text

WidgetItem(
    id="widget_123",
    thread_id="thread_456",
    created_at=datetime.now(),
    widget=Card(children=[Text(value="Widget content")]),
)
```

### HiddenContextItem

Server-side only context (never sent to client):

```python
from chatkit.types import HiddenContextItem

HiddenContextItem(
    id="ctx_123",
    thread_id="thread_456",
    created_at=datetime.now(),
    content={"key": "value", "user_action": "clicked_button"},
)
```

Use cases:
- Store context from user actions
- Inject system information for the model
- Track state without exposing to client

## Thread Metadata

```python
from chatkit.types import ThreadMetadata

ThreadMetadata(
    id="thread_456",
    created_at=datetime.now(),
    title="Conversation Title",  # Optional
)
```

## Attachments

```python
from chatkit.types import Attachment, ImageAttachment, FileAttachment

# Base attachment
Attachment(
    id="attach_123",
    name="document.pdf",
    mime_type="application/pdf",
    size=1024,
)

# Image attachment
ImageAttachment(
    id="attach_456",
    name="photo.jpg",
    mime_type="image/jpeg",
    size=2048,
    width=800,
    height=600,
)
```

## Error Handling

### StreamError

For predefined error codes with localized messages:

```python
from chatkit.errors import StreamError, ErrorCode

raise StreamError(
    code=ErrorCode.RATE_LIMIT_EXCEEDED,
    allow_retry=True,
)
```

### CustomStreamError

For custom error messages:

```python
from chatkit.errors import CustomStreamError

raise CustomStreamError(
    message="Unable to process your request. Please try again.",
    allow_retry=True,
)
```

### Error Handling in respond()

Errors are automatically caught and converted to ErrorEvent:

```python
async def respond(
    self,
    thread: ThreadMetadata,
    input: UserMessageItem | None,
    context: Any,
) -> AsyncIterator[ThreadStreamEvent]:
    try:
        # Processing logic
        if not input:
            raise CustomStreamError(
                message="No input provided",
                allow_retry=False,
            )
        # ... rest of processing
    except SomeExternalError as e:
        raise CustomStreamError(
            message=f"External service error: {e}",
            allow_retry=True,
        )
```

## Page Type

For paginated results:

```python
from chatkit.types import Page

Page(
    data=[item1, item2, item3],
    has_more=True,
    after="cursor_token",  # For pagination
)
```

## Actions

For handling widget interactions:

```python
from chatkit.actions import Action, ActionConfig

# In widget definition
Button(
    label="Submit",
    onClickAction=ActionConfig(
        type="submit_form",
        payload={"form_id": "123"},
    ),
)

# In server action handler
async def action(
    self,
    thread: ThreadMetadata,
    action: Action[str, Any],
    sender: WidgetItem | None,
    context: RequestContext,
) -> AsyncIterator[ThreadStreamEvent]:
    if action.type == "submit_form":
        form_id = action.payload["form_id"]
        # Process the action
        yield ThreadItemDoneEvent(item=...)
```

## Client Tool Calls

For triggering client-side functionality:

```python
from chatkit.types import ClientToolCall, ClientToolCallItem

# In function tool
ctx.context.client_tool_call = ClientToolCall(
    name="open_modal",
    arguments={"modal_id": "settings"},
)

# As thread item
ClientToolCallItem(
    id="tool_123",
    thread_id="thread_456",
    created_at=datetime.now(),
    name="open_modal",
    arguments={"modal_id": "settings"},
    status="pending",  # "pending", "completed", "failed"
)
```
