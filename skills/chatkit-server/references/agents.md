# Agents SDK Integration

## Overview

ChatKit provides helpers to integrate with the OpenAI Agents SDK for building AI-powered chat backends.

## Key Components

- `AgentContext` - Context type for Agents SDK calls with streaming helpers
- `stream_agent_response` - Converts streamed Agents SDK runs into ChatKit events
- `ThreadItemConverter` - Converts ChatKit thread items to Agents SDK input
- `simple_to_agent_input` - Quick start helper with default conversions

## Basic Agent Integration

```python
from agents import Agent, Runner
from chatkit.server import ChatKitServer
from chatkit.agents import AgentContext, stream_agent_response, simple_to_agent_input
from chatkit.types import ThreadMetadata, UserMessageItem, ThreadStreamEvent
from typing import AsyncIterator, Any

class MyChatKitServer(ChatKitServer):
    def __init__(self, data_store, attachment_store=None):
        super().__init__(data_store, attachment_store)

    assistant_agent = Agent[AgentContext](
        model="gpt-4.1",
        name="Assistant",
        instructions="You are a helpful assistant"
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
```

## Custom ThreadItemConverter

Extend `ThreadItemConverter` for advanced input handling:

```python
import base64
from agents import Message, ResponseInputTextParam, ResponseInputImageParam, ResponseInputFileParam
from chatkit.agents import ThreadItemConverter
from chatkit.types import Attachment, ImageAttachment, HiddenContextItem, UserMessageTagContent

class MyConverter(ThreadItemConverter):
    async def attachment_to_message_content(
        self, attachment: Attachment
    ) -> ResponseInputContentParam:
        content = await read_attachment_bytes(attachment.id)
        data_url = f"data:{attachment.mime_type};base64,{base64.b64encode(content).decode('utf-8')}"

        if isinstance(attachment, ImageAttachment):
            return ResponseInputImageParam(
                type="input_image",
                detail="auto",
                image_url=data_url,
            )
        # Note: Agents SDK currently only supports PDF as ResponseInputFileParam
        return ResponseInputFileParam(
            type="input_file",
            file_data=data_url,
            filename=attachment.name or "unknown",
        )

    async def hidden_context_to_input(self, item: HiddenContextItem) -> Message:
        return Message(
            type="message",
            role="system",
            content=[
                ResponseInputTextParam(
                    type="input_text",
                    text=f"<HIDDEN_CONTEXT>{item.content}</HIDDEN_CONTEXT>",
                )
            ],
        )

    async def tag_to_message_content(self, tag: UserMessageTagContent):
        tag_context = await retrieve_context_for_tag(tag.id)
        return ResponseInputTextParam(
            type="input_text",
            text=f"<TAG>Name:{tag.data.name}\nType:{tag.data.type}\nDetails:{tag_context}</TAG>"
        )

# Usage in respond():
result = Runner.run_streamed(
    assistant_agent,
    await MyConverter().to_agent_input(input),
    context=agent_context,
)
```

## Function Tools

Define tools for the agent to use:

```python
from agents import Agent, function_tool
from agents.run_context import RunContextWrapper
from chatkit.agents import AgentContext

@function_tool(description_override="Search the knowledge base for relevant information.")
async def search_knowledge_base(
    ctx: RunContextWrapper[AgentContext],
    query: str
) -> str:
    results = await perform_search(query)
    return format_results(results)

@function_tool(description_override="Get the current weather for a location.")
async def get_weather(
    ctx: RunContextWrapper[AgentContext],
    location: str
) -> str:
    weather = await fetch_weather(location)
    return f"Weather in {location}: {weather}"

assistant_agent = Agent[AgentContext](
    model="gpt-4.1",
    name="Assistant",
    instructions="You are a helpful assistant with access to search and weather tools.",
    tools=[search_knowledge_base, get_weather],
)
```

## Client-Side Tools

Trigger client-side tools from server-side function tools:

```python
from agents import Agent, function_tool, StopAtTools
from agents.run_context import RunContextWrapper
from chatkit.agents import AgentContext
from chatkit.types import ClientToolCall

@function_tool(description_override="Add an item to the user's todo list.")
async def add_to_todo_list(
    ctx: RunContextWrapper[AgentContext],
    item: str
) -> None:
    ctx.context.client_tool_call = ClientToolCall(
        name="add_to_todo_list",
        arguments={"item": item},
    )

assistant_agent = Agent[AgentContext](
    model="gpt-4.1",
    name="Assistant",
    instructions="You are a helpful assistant",
    tools=[add_to_todo_list],
    tool_use_behavior=StopAtTools(stop_at_tool_names=[add_to_todo_list.name]),
)
```

Note: Only one client tool call per turn is supported. The tool must be registered on both client and server.

## Progress Updates

Show progress during long-running operations:

```python
import asyncio
from agents import function_tool
from agents.run_context import RunContextWrapper
from chatkit.agents import AgentContext
from chatkit.types import ProgressUpdateEvent

@function_tool()
async def analyze_document(ctx: RunContextWrapper[AgentContext], doc_id: str) -> str:
    await ctx.context.stream(
        ProgressUpdateEvent(text="Loading document...")
    )
    doc = await load_document(doc_id)

    await ctx.context.stream(
        ProgressUpdateEvent(text="Analyzing content...")
    )
    await asyncio.sleep(2)

    await ctx.context.stream(
        ProgressUpdateEvent(text="Generating summary...")
    )
    summary = await generate_summary(doc)

    return summary
```

Progress updates are automatically replaced by the next assistant message, widget, or another progress update.

## Multi-Agent Patterns

### Agent Handoff

```python
from agents import Agent, function_tool, handoff
from chatkit.agents import AgentContext

specialist_agent = Agent[AgentContext](
    model="gpt-4.1",
    name="Specialist",
    instructions="You are a technical specialist.",
)

@function_tool()
def transfer_to_specialist():
    """Transfer the conversation to a technical specialist."""
    return handoff(specialist_agent)

general_agent = Agent[AgentContext](
    model="gpt-4.1",
    name="General Assistant",
    instructions="You are a general assistant. Transfer technical questions to the specialist.",
    tools=[transfer_to_specialist],
)
```

### Context-Aware Agents

```python
from dataclasses import dataclass
from agents import Agent
from chatkit.agents import AgentContext
from chatkit.types import ThreadMetadata

@dataclass
class EnhancedContext(AgentContext):
    user_preferences: dict
    conversation_history_summary: str

def create_personalized_agent(context: EnhancedContext) -> Agent:
    return Agent[EnhancedContext](
        model="gpt-4.1",
        name="Personalized Assistant",
        instructions=f"""You are a helpful assistant.

User preferences: {context.user_preferences}
Conversation summary: {context.conversation_history_summary}

Adapt your responses based on this context.""",
    )
```
