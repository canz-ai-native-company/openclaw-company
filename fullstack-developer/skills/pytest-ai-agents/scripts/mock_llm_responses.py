"""
LLM Response Mocking Utilities.

Provides helpers for creating realistic mock responses from various LLM APIs.
Use these with respx to mock HTTP calls in your tests.
"""

import json
from typing import Any
from httpx import Response


# -----------------------------------------------------------------------------
# OpenAI Response Builders
# -----------------------------------------------------------------------------

class OpenAIMock:
    """Builder for OpenAI API mock responses."""

    @staticmethod
    def chat_completion(
        content: str,
        model: str = "gpt-4",
        finish_reason: str = "stop",
        usage: dict | None = None
    ) -> Response:
        """Create a mock chat completion response."""
        body = {
            "id": "chatcmpl-mock123",
            "object": "chat.completion",
            "created": 1234567890,
            "model": model,
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": content
                },
                "finish_reason": finish_reason
            }],
            "usage": usage or {
                "prompt_tokens": 50,
                "completion_tokens": len(content.split()),
                "total_tokens": 50 + len(content.split())
            }
        }
        return Response(200, json=body)

    @staticmethod
    def tool_call(
        tool_name: str,
        arguments: dict,
        tool_call_id: str = "call_mock123",
        model: str = "gpt-4"
    ) -> Response:
        """Create a mock response with a tool/function call."""
        body = {
            "id": "chatcmpl-mock123",
            "object": "chat.completion",
            "created": 1234567890,
            "model": model,
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": None,
                    "tool_calls": [{
                        "id": tool_call_id,
                        "type": "function",
                        "function": {
                            "name": tool_name,
                            "arguments": json.dumps(arguments)
                        }
                    }]
                },
                "finish_reason": "tool_calls"
            }]
        }
        return Response(200, json=body)

    @staticmethod
    def multiple_tool_calls(
        calls: list[tuple[str, dict]],
        model: str = "gpt-4"
    ) -> Response:
        """Create a mock response with multiple parallel tool calls."""
        tool_calls = [
            {
                "id": f"call_mock{i}",
                "type": "function",
                "function": {
                    "name": name,
                    "arguments": json.dumps(args)
                }
            }
            for i, (name, args) in enumerate(calls)
        ]

        body = {
            "id": "chatcmpl-mock123",
            "object": "chat.completion",
            "model": model,
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": None,
                    "tool_calls": tool_calls
                },
                "finish_reason": "tool_calls"
            }]
        }
        return Response(200, json=body)

    @staticmethod
    def stream_chunks(chunks: list[str]):
        """
        Generator for streaming response chunks.

        Usage:
            respx.post(...).mock(return_value=Response(200, stream=OpenAIMock.stream_chunks(["Hi", " there"])))
        """
        for i, chunk in enumerate(chunks):
            data = {
                "id": "chatcmpl-mock123",
                "object": "chat.completion.chunk",
                "choices": [{
                    "index": 0,
                    "delta": {"content": chunk} if i > 0 else {"role": "assistant", "content": chunk},
                    "finish_reason": None
                }]
            }
            yield f"data: {json.dumps(data)}\n\n".encode()
        # Final chunk
        yield b'data: {"choices":[{"finish_reason":"stop","delta":{}}]}\n\n'
        yield b"data: [DONE]\n\n"

    @staticmethod
    def error(
        message: str = "Internal server error",
        error_type: str = "server_error",
        status_code: int = 500
    ) -> Response:
        """Create a mock error response."""
        return Response(status_code, json={
            "error": {
                "message": message,
                "type": error_type,
                "code": None
            }
        })

    @staticmethod
    def rate_limited(retry_after: int = 60) -> Response:
        """Create a rate limit error response."""
        return Response(
            429,
            json={"error": {"message": "Rate limit exceeded", "type": "rate_limit_error"}},
            headers={"Retry-After": str(retry_after)}
        )


# -----------------------------------------------------------------------------
# Anthropic Response Builders
# -----------------------------------------------------------------------------

class AnthropicMock:
    """Builder for Anthropic API mock responses."""

    @staticmethod
    def message(
        content: str,
        model: str = "claude-3-opus-20240229",
        stop_reason: str = "end_turn"
    ) -> Response:
        """Create a mock messages API response."""
        body = {
            "id": "msg_mock123",
            "type": "message",
            "role": "assistant",
            "content": [{"type": "text", "text": content}],
            "model": model,
            "stop_reason": stop_reason,
            "usage": {
                "input_tokens": 50,
                "output_tokens": len(content.split())
            }
        }
        return Response(200, json=body)

    @staticmethod
    def tool_use(
        tool_name: str,
        tool_input: dict,
        tool_use_id: str = "toolu_mock123",
        model: str = "claude-3-opus-20240229"
    ) -> Response:
        """Create a mock response with tool use."""
        body = {
            "id": "msg_mock123",
            "type": "message",
            "role": "assistant",
            "content": [{
                "type": "tool_use",
                "id": tool_use_id,
                "name": tool_name,
                "input": tool_input
            }],
            "model": model,
            "stop_reason": "tool_use"
        }
        return Response(200, json=body)

    @staticmethod
    def mixed_content(
        text: str,
        tool_name: str,
        tool_input: dict
    ) -> Response:
        """Create a response with both text and tool use."""
        body = {
            "id": "msg_mock123",
            "type": "message",
            "role": "assistant",
            "content": [
                {"type": "text", "text": text},
                {
                    "type": "tool_use",
                    "id": "toolu_mock123",
                    "name": tool_name,
                    "input": tool_input
                }
            ],
            "stop_reason": "tool_use"
        }
        return Response(200, json=body)

    @staticmethod
    def stream_events(chunks: list[str]):
        """
        Generator for SSE streaming events.

        Usage:
            respx.post(...).mock(return_value=Response(200, stream=AnthropicMock.stream_events(["Hello", " World"])))
        """
        # Message start
        yield b'event: message_start\ndata: {"type":"message_start","message":{"id":"msg_mock","type":"message","role":"assistant","content":[],"model":"claude-3-opus"}}\n\n'

        # Content block start
        yield b'event: content_block_start\ndata: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}\n\n'

        # Content deltas
        for chunk in chunks:
            data = {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": chunk}}
            yield f'event: content_block_delta\ndata: {json.dumps(data)}\n\n'.encode()

        # End events
        yield b'event: content_block_stop\ndata: {"type":"content_block_stop","index":0}\n\n'
        yield b'event: message_stop\ndata: {"type":"message_stop"}\n\n'

    @staticmethod
    def error(
        message: str = "Internal server error",
        error_type: str = "api_error",
        status_code: int = 500
    ) -> Response:
        """Create a mock error response."""
        return Response(status_code, json={
            "type": "error",
            "error": {
                "type": error_type,
                "message": message
            }
        })


# -----------------------------------------------------------------------------
# Side Effect Factories
# -----------------------------------------------------------------------------

def conversation_flow(*responses: str):
    """
    Create a side effect that returns responses in sequence.

    Usage:
        route.side_effect = conversation_flow(
            "Hello! How can I help?",
            "I'll search for that information.",
            "Here's what I found: ..."
        )
    """
    response_iter = iter(responses)

    def side_effect(request):
        try:
            return OpenAIMock.chat_completion(next(response_iter))
        except StopIteration:
            return OpenAIMock.error("No more mock responses available")

    return side_effect


def request_based_response(handler):
    """
    Create a side effect that examines the request to determine response.

    Usage:
        def my_handler(messages):
            if "weather" in messages[-1]["content"]:
                return "It's sunny!"
            return "I don't know."

        route.side_effect = request_based_response(my_handler)
    """
    def side_effect(request):
        body = json.loads(request.content)
        messages = body.get("messages", [])
        result = handler(messages)
        if isinstance(result, Response):
            return result
        return OpenAIMock.chat_completion(result)

    return side_effect


def tool_then_response(tool_name: str, tool_args: dict, final_response: str):
    """
    Create a two-step side effect: first tool call, then final response.

    Usage:
        route.side_effect = tool_then_response(
            "search",
            {"query": "weather NYC"},
            "The weather in NYC is sunny, 72F."
        )
    """
    responses = [
        OpenAIMock.tool_call(tool_name, tool_args),
        OpenAIMock.chat_completion(final_response)
    ]
    return iter(responses).__next__


# -----------------------------------------------------------------------------
# Assertion Helpers
# -----------------------------------------------------------------------------

def assert_messages_sent(route, expected_messages: list[dict]) -> None:
    """Assert that specific messages were sent in the last request."""
    assert route.called, "Route was never called"
    last_request = route.calls[-1].request
    body = json.loads(last_request.content)
    actual_messages = body.get("messages", [])

    for expected in expected_messages:
        found = any(
            all(msg.get(k) == v for k, v in expected.items())
            for msg in actual_messages
        )
        assert found, f"Expected message not found: {expected}"


def assert_tool_was_called(route, tool_name: str) -> None:
    """Assert that a specific tool was called via the LLM."""
    assert route.called, "Route was never called"

    for call in route.calls:
        body = json.loads(call.request.content)
        messages = body.get("messages", [])
        for msg in messages:
            if msg.get("role") == "assistant":
                tool_calls = msg.get("tool_calls", [])
                for tc in tool_calls:
                    if tc.get("function", {}).get("name") == tool_name:
                        return

    raise AssertionError(f"Tool '{tool_name}' was never called")
