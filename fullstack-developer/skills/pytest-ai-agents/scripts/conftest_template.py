"""
Pytest conftest.py template for AI agent testing.

Copy this file to your tests/conftest.py and customize as needed.
Provides fixtures for:
- FastAPI TestClient and AsyncClient
- respx HTTP mocking for LLM APIs
- Common test utilities
"""

import pytest
import pytest_asyncio
import respx
from httpx import ASGITransport, AsyncClient, Response

# -----------------------------------------------------------------------------
# FastAPI Test Clients
# -----------------------------------------------------------------------------

@pytest.fixture
def app():
    """
    Import and return your FastAPI app.
    Customize this import path to match your project structure.
    """
    from myapp.main import app
    return app


@pytest.fixture
def client(app):
    """Sync test client for FastAPI."""
    from fastapi.testclient import TestClient
    with TestClient(app) as c:
        yield c


@pytest_asyncio.fixture
async def async_client(app):
    """Async test client for FastAPI."""
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as c:
        yield c


# -----------------------------------------------------------------------------
# Dependency Override Fixtures
# -----------------------------------------------------------------------------

@pytest.fixture
def override_dependencies(app):
    """
    Context manager fixture for overriding FastAPI dependencies.

    Usage:
        def test_example(override_dependencies):
            override_dependencies({get_db: get_mock_db})
            # Run test
    """
    original_overrides = app.dependency_overrides.copy()

    def _override(overrides: dict):
        app.dependency_overrides.update(overrides)

    yield _override
    app.dependency_overrides = original_overrides


# -----------------------------------------------------------------------------
# LLM API Mocking Fixtures
# -----------------------------------------------------------------------------

@pytest.fixture
def mock_openai():
    """
    Mock OpenAI API responses.

    Usage:
        def test_llm(mock_openai):
            mock_openai.post("/v1/chat/completions").mock(
                return_value=Response(200, json={...})
            )
    """
    with respx.mock(base_url="https://api.openai.com") as mock:
        yield mock


@pytest.fixture
def mock_anthropic():
    """
    Mock Anthropic API responses.

    Usage:
        def test_claude(mock_anthropic):
            mock_anthropic.post("/v1/messages").mock(
                return_value=Response(200, json={...})
            )
    """
    with respx.mock(base_url="https://api.anthropic.com") as mock:
        yield mock


@pytest.fixture
def mock_all_llm_apis():
    """Mock all common LLM APIs at once."""
    with respx.mock as mock:
        yield mock


# -----------------------------------------------------------------------------
# LLM Response Helpers
# -----------------------------------------------------------------------------

def make_openai_response(content: str, finish_reason: str = "stop") -> dict:
    """Create a standard OpenAI chat completion response."""
    return {
        "id": "chatcmpl-test",
        "object": "chat.completion",
        "created": 1234567890,
        "model": "gpt-4",
        "choices": [{
            "index": 0,
            "message": {
                "role": "assistant",
                "content": content
            },
            "finish_reason": finish_reason
        }],
        "usage": {
            "prompt_tokens": 10,
            "completion_tokens": len(content.split()),
            "total_tokens": 10 + len(content.split())
        }
    }


def make_anthropic_response(content: str, stop_reason: str = "end_turn") -> dict:
    """Create a standard Anthropic messages response."""
    return {
        "id": "msg_test",
        "type": "message",
        "role": "assistant",
        "content": [{"type": "text", "text": content}],
        "model": "claude-3-opus-20240229",
        "stop_reason": stop_reason,
        "usage": {
            "input_tokens": 10,
            "output_tokens": len(content.split())
        }
    }


def make_openai_tool_call_response(
    tool_name: str,
    arguments: dict,
    finish_reason: str = "tool_calls"
) -> dict:
    """Create an OpenAI response with a tool call."""
    import json
    return {
        "id": "chatcmpl-test",
        "object": "chat.completion",
        "choices": [{
            "index": 0,
            "message": {
                "role": "assistant",
                "content": None,
                "tool_calls": [{
                    "id": "call_test",
                    "type": "function",
                    "function": {
                        "name": tool_name,
                        "arguments": json.dumps(arguments)
                    }
                }]
            },
            "finish_reason": finish_reason
        }]
    }


# -----------------------------------------------------------------------------
# Streaming Response Helpers
# -----------------------------------------------------------------------------

def make_openai_stream_chunks(chunks: list[str]):
    """
    Create a generator for OpenAI streaming response chunks.

    Usage:
        respx.post(...).mock(
            return_value=Response(200, stream=make_openai_stream_chunks(["Hello", " World"]))
        )
    """
    for chunk in chunks:
        yield f'data: {{"choices":[{{"delta":{{"content":"{chunk}"}}}}]}}\n\n'.encode()
    yield b'data: [DONE]\n\n'


# -----------------------------------------------------------------------------
# Mock Side Effects
# -----------------------------------------------------------------------------

def sequential_responses(responses: list[dict]):
    """
    Create a side effect that returns responses in order.

    Usage:
        route.side_effect = sequential_responses([
            {"choices": [{"message": {"content": "First"}}]},
            {"choices": [{"message": {"content": "Second"}}]}
        ])
    """
    responses_iter = iter(responses)

    def side_effect(request):
        try:
            return Response(200, json=next(responses_iter))
        except StopIteration:
            return Response(500, json={"error": "No more responses configured"})

    return side_effect


def dynamic_llm_response(response_map: dict[str, str]):
    """
    Create a side effect that returns different responses based on request content.

    Usage:
        route.side_effect = dynamic_llm_response({
            "weather": "It's sunny!",
            "time": "It's noon.",
            "default": "I don't understand."
        })
    """
    def side_effect(request):
        content = request.content.decode()
        for keyword, response in response_map.items():
            if keyword != "default" and keyword in content:
                return Response(200, json=make_openai_response(response))
        default = response_map.get("default", "Default response")
        return Response(200, json=make_openai_response(default))

    return side_effect


# -----------------------------------------------------------------------------
# Test Data Fixtures
# -----------------------------------------------------------------------------

@pytest.fixture
def sample_messages():
    """Sample conversation messages for testing."""
    return [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"},
        {"role": "assistant", "content": "Hi there! How can I help you?"},
        {"role": "user", "content": "What's the weather?"}
    ]


@pytest.fixture
def sample_tool_definitions():
    """Sample tool definitions for function calling tests."""
    return [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get the current weather in a location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "City name"
                        }
                    },
                    "required": ["location"]
                }
            }
        }
    ]


# -----------------------------------------------------------------------------
# Async Database Fixture Example
# -----------------------------------------------------------------------------

@pytest_asyncio.fixture
async def async_db():
    """
    Example async database fixture.
    Replace with your actual database setup.
    """
    # Setup
    db = await create_test_database()
    yield db
    # Teardown
    await db.close()


async def create_test_database():
    """Replace with actual database creation logic."""
    class MockDB:
        async def execute(self, query):
            return []
        async def close(self):
            pass
    return MockDB()
