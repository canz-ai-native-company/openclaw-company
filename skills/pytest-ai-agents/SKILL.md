---
name: pytest-ai-agents
description: Testing AI agent code with pytest. Use when writing tests for FastAPI endpoints, mocking LLM/API calls with respx, testing async agent pipelines, or building test suites for AI applications. Covers pytest-asyncio for async tests, respx for HTTP mocking, FastAPI TestClient/AsyncClient, dependency injection overrides, and production test patterns.
---

# Testing AI Agents with Pytest

## Quick Start

Install dependencies:
```bash
pip install pytest pytest-asyncio respx httpx fastapi
```

Configure pytest for async in `pyproject.toml`:
```toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
asyncio_default_fixture_loop_scope = "function"
```

## Workflow

1. **Unit tests** - Test individual functions/classes with mocked dependencies
2. **Integration tests** - Test FastAPI endpoints with TestClient
3. **Agent pipeline tests** - Test end-to-end flows with mocked LLM calls

## Testing FastAPI Endpoints

### Sync Tests with TestClient

```python
from fastapi.testclient import TestClient
from myapp.main import app

client = TestClient(app)

def test_endpoint():
    response = client.get("/items/1")
    assert response.status_code == 200
    assert response.json()["id"] == 1
```

### Async Tests with AsyncClient

```python
import pytest
from httpx import ASGITransport, AsyncClient
from myapp.main import app

@pytest.mark.asyncio
async def test_async_endpoint():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as client:
        response = await client.get("/items/1")
    assert response.status_code == 200
```

### Override Dependencies

```python
from myapp.main import app, get_db

def get_test_db():
    return TestDatabase()

app.dependency_overrides[get_db] = get_test_db

def test_with_override():
    response = client.get("/items")
    assert response.status_code == 200

# Clean up after tests
app.dependency_overrides.clear()
```

## Mocking LLM/HTTP Calls with respx

### Basic Mocking

```python
import httpx
import respx

@respx.mock
def test_api_call():
    respx.get("https://api.openai.com/v1/models").mock(
        return_value=httpx.Response(200, json={"data": []})
    )
    response = httpx.get("https://api.openai.com/v1/models")
    assert response.status_code == 200
```

### Async Mocking

```python
import pytest
import httpx
import respx

@respx.mock
@pytest.mark.asyncio
async def test_async_api():
    respx.post("https://api.openai.com/v1/chat/completions").mock(
        return_value=httpx.Response(200, json={
            "choices": [{"message": {"content": "Hello!"}}]
        })
    )
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            json={"messages": [{"role": "user", "content": "Hi"}]}
        )
    assert response.json()["choices"][0]["message"]["content"] == "Hello!"
```

### Pytest Fixture Pattern

```python
# conftest.py
import pytest
import respx
from httpx import Response

@pytest.fixture
def mock_llm_api():
    with respx.mock(base_url="https://api.openai.com") as mock:
        mock.post("/v1/chat/completions", name="chat").mock(
            return_value=Response(200, json={
                "choices": [{"message": {"content": "Mocked response"}}]
            })
        )
        yield mock

# test_agent.py
def test_agent_call(mock_llm_api):
    result = my_agent.run("Hello")
    assert mock_llm_api["chat"].called
    assert result == "Mocked response"
```

### Dynamic Side Effects

```python
import respx
from httpx import Response

def llm_side_effect(request):
    content = request.content.decode()
    if "error" in content:
        return Response(500, json={"error": "Server error"})
    return Response(200, json={
        "choices": [{"message": {"content": "Success"}}]
    })

@respx.mock
def test_with_side_effect():
    respx.post("https://api.openai.com/v1/chat/completions").mock(
        side_effect=llm_side_effect
    )
    # Test different scenarios based on request content
```

## Async Fixtures

```python
import pytest
import pytest_asyncio

@pytest_asyncio.fixture
async def async_db():
    db = await create_async_connection()
    yield db
    await db.close()

@pytest_asyncio.fixture(scope="module")
async def shared_resource():
    resource = await expensive_setup()
    yield resource
    await resource.cleanup()

@pytest.mark.asyncio
async def test_with_async_fixture(async_db):
    result = await async_db.query("SELECT 1")
    assert result == 1
```

## Agent Pipeline Testing

### Mock Multiple Services

```python
import pytest
import respx
from httpx import Response

@pytest.fixture
def mock_agent_dependencies():
    with respx.mock as mock:
        # Mock LLM
        mock.post("https://api.openai.com/v1/chat/completions").mock(
            return_value=Response(200, json={
                "choices": [{"message": {"content": "Analyzed data"}}]
            })
        )
        # Mock external API
        mock.get("https://api.example.com/data").mock(
            return_value=Response(200, json={"items": [1, 2, 3]})
        )
        yield mock

def test_agent_pipeline(mock_agent_dependencies):
    agent = DataAnalysisAgent()
    result = agent.analyze("fetch and analyze data")
    assert "Analyzed" in result
```

### Test Streaming Responses

```python
import respx
from httpx import Response

@respx.mock
@pytest.mark.asyncio
async def test_streaming():
    def stream_content():
        yield b"data: {\"content\": \"Hello\"}\n\n"
        yield b"data: {\"content\": \" World\"}\n\n"
        yield b"data: [DONE]\n\n"

    respx.post("https://api.openai.com/v1/chat/completions").mock(
        return_value=Response(200, stream=stream_content())
    )
    # Test streaming logic
```

## Production Test Patterns

### Parametrized Tests

```python
import pytest

@pytest.mark.parametrize("input,expected", [
    ("hello", "Hello!"),
    ("error", None),
    ("", "Empty input"),
])
def test_agent_responses(input, expected, mock_llm_api):
    result = agent.process(input)
    assert result == expected
```

### Test Timeouts and Retries

```python
import pytest
import respx
from httpx import Response, TimeoutException

@respx.mock
def test_retry_on_timeout():
    route = respx.post("https://api.openai.com/v1/chat/completions")
    route.side_effect = [
        TimeoutException("Timeout"),
        Response(200, json={"choices": [{"message": {"content": "OK"}}]})
    ]
    result = agent_with_retry.call()
    assert route.call_count == 2
    assert result == "OK"
```

### Fixture for Full Test Setup

Use `scripts/conftest_template.py` as starting point for comprehensive test fixtures.

## References

- **Async patterns**: See `references/pytest-asyncio.md` for loop scopes and async fixture details
- **HTTP mocking**: See `references/respx-mocking.md` for advanced respx patterns
- **FastAPI testing**: See `references/fastapi-testing.md` for TestClient and dependency override patterns
- **Agent testing**: See `references/agent-testing.md` for pipeline and integration test patterns
