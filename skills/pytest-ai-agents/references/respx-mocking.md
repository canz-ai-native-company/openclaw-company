# respx HTTP Mocking Reference

## Setup Methods

### Decorator

```python
import respx
import httpx

@respx.mock
def test_example():
    respx.get("https://api.example.com/").mock(
        return_value=httpx.Response(200, json={"status": "ok"})
    )
    response = httpx.get("https://api.example.com/")
    assert response.status_code == 200
```

### Context Manager

```python
def test_with_context():
    with respx.mock:
        respx.get("https://api.example.com/").mock(
            return_value=httpx.Response(200)
        )
        response = httpx.get("https://api.example.com/")
        assert response.status_code == 200
```

### Pytest Fixture

```python
# conftest.py
import pytest
import respx

@pytest.fixture
def mocked_api():
    with respx.mock(base_url="https://api.example.com") as mock:
        mock.get("/users/", name="list_users").mock(
            return_value=httpx.Response(200, json=[])
        )
        yield mock

# test_api.py
def test_users(mocked_api):
    response = httpx.get("https://api.example.com/users/")
    assert mocked_api["list_users"].called
```

### Built-in respx_mock Fixture

```python
def test_with_respx_mock(respx_mock):
    respx_mock.get("https://example.com/").mock(
        return_value=httpx.Response(204)
    )
    response = httpx.get("https://example.com/")
    assert response.status_code == 204
```

### Pytest Marker with Base URL

```python
import pytest

@pytest.mark.respx(base_url="https://api.example.com")
def test_with_marker(respx_mock):
    respx_mock.get("/endpoint/").mock(
        return_value=httpx.Response(200)
    )
    response = httpx.get("https://api.example.com/endpoint/")
    assert response.status_code == 200
```

## HTTP Methods

```python
respx.get("https://example.com/")
respx.post("https://example.com/")
respx.put("https://example.com/")
respx.patch("https://example.com/")
respx.delete("https://example.com/")
respx.head("https://example.com/")
respx.options("https://example.com/")
```

## Response Types

### JSON Response

```python
respx.get("https://api.example.com/data").mock(
    return_value=httpx.Response(200, json={"key": "value"})
)
```

### Text Response

```python
respx.get("https://example.com/").mock(
    return_value=httpx.Response(200, text="Hello World")
)
```

### Binary Response

```python
respx.get("https://example.com/file").mock(
    return_value=httpx.Response(200, content=b"binary data")
)
```

### Headers

```python
respx.get("https://example.com/").mock(
    return_value=httpx.Response(
        200,
        headers={"X-Custom-Header": "value"},
        json={"data": "test"}
    )
)
```

## URL Patterns

### Exact Match

```python
respx.get("https://api.example.com/users/123")
```

### Regex Pattern

```python
import re

respx.get(re.compile(r"https://api.example.com/users/\d+"))
```

### With Route Patterns

```python
respx.route(
    method="GET",
    url__regex=r"https://example.org/(?P<slug>\w+)/"
)
```

## Side Effects

### Function Side Effect

```python
def dynamic_response(request):
    if "error" in request.url.path:
        return httpx.Response(500, json={"error": "Server error"})
    return httpx.Response(200, json={"status": "ok"})

respx.get("https://api.example.com/").mock(side_effect=dynamic_response)
```

### Side Effect with Route Access

```python
def counting_response(request, route):
    return httpx.Response(200, json={"call": route.call_count + 1})

respx.post("https://api.example.com/").mock(side_effect=counting_response)
```

### Regex Named Groups in Side Effect

```python
def extract_id(request, id):
    return httpx.Response(200, json={"id": id})

route = respx.route(url__regex=r"https://api.example.com/items/(?P<id>\d+)/")
route.side_effect = extract_id
```

### Sequential Responses

```python
route = respx.get("https://api.example.com/")
route.side_effect = [
    httpx.Response(500),  # First call
    httpx.Response(200),  # Second call
]
```

### Exception Side Effect

```python
from httpx import TimeoutException

respx.get("https://api.example.com/").mock(
    side_effect=TimeoutException("Connection timeout")
)
```

## Assertions

### Route Called

```python
@respx.mock
def test_assertions():
    route = respx.get("https://api.example.com/")
    route.mock(return_value=httpx.Response(200))

    httpx.get("https://api.example.com/")

    assert route.called
    assert route.call_count == 1
```

### All Routes Called

```python
with respx.mock(assert_all_called=True) as mock:
    mock.get("https://api.example.com/a").mock(return_value=httpx.Response(200))
    mock.get("https://api.example.com/b").mock(return_value=httpx.Response(200))
    # Test will fail if both routes aren't called
```

### Named Routes

```python
@respx.mock
def test_named():
    respx.get("https://api.example.com/users", name="get_users").mock(
        return_value=httpx.Response(200)
    )
    httpx.get("https://api.example.com/users")
    assert respx.routes["get_users"].called
```

## Async Usage

```python
import pytest

@respx.mock
@pytest.mark.asyncio
async def test_async():
    respx.get("https://api.example.com/").mock(
        return_value=httpx.Response(200)
    )
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.example.com/")
    assert response.status_code == 200
```

## Reusable Router

```python
api_mock = respx.mock(base_url="https://api.example.com/", assert_all_called=False)
api_mock.get("/status/", name="status").mock(
    return_value=httpx.Response(200, json={"status": "healthy"})
)

@api_mock
def test_with_router():
    response = httpx.get("https://api.example.com/status/")
    assert api_mock["status"].called
```

## LLM API Mocking Examples

### OpenAI Chat Completion

```python
@respx.mock
def test_openai_chat():
    respx.post("https://api.openai.com/v1/chat/completions").mock(
        return_value=httpx.Response(200, json={
            "id": "chatcmpl-123",
            "object": "chat.completion",
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": "Hello! How can I help you?"
                },
                "finish_reason": "stop"
            }],
            "usage": {"prompt_tokens": 10, "completion_tokens": 20}
        })
    )
```

### Anthropic Claude

```python
@respx.mock
def test_anthropic():
    respx.post("https://api.anthropic.com/v1/messages").mock(
        return_value=httpx.Response(200, json={
            "id": "msg_123",
            "type": "message",
            "role": "assistant",
            "content": [{"type": "text", "text": "Hello!"}],
            "stop_reason": "end_turn"
        })
    )
```

### Streaming Response

```python
def stream_chunks():
    yield b'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n'
    yield b'data: {"choices":[{"delta":{"content":" World"}}]}\n\n'
    yield b'data: [DONE]\n\n'

@respx.mock
def test_streaming():
    respx.post("https://api.openai.com/v1/chat/completions").mock(
        return_value=httpx.Response(200, stream=stream_chunks())
    )
```
