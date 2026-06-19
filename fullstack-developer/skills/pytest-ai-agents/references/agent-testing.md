# Agent Pipeline Testing Reference

## Agent Test Architecture

```
tests/
    conftest.py           # Shared fixtures
    test_unit.py          # Unit tests for individual components
    test_integration.py   # Integration tests with mocked externals
    test_e2e.py           # End-to-end pipeline tests
```

## Unit Testing Agent Components

### Test Tool Functions

```python
import pytest
from myagent.tools import search_database, format_response

def test_search_database():
    result = search_database("test query")
    assert isinstance(result, list)
    assert len(result) > 0

def test_format_response():
    raw = {"data": [1, 2, 3]}
    formatted = format_response(raw)
    assert "Data:" in formatted
```

### Test Prompt Templates

```python
from myagent.prompts import build_system_prompt, build_user_prompt

def test_system_prompt():
    prompt = build_system_prompt(role="assistant", context="testing")
    assert "assistant" in prompt
    assert "testing" in prompt

def test_user_prompt_with_context():
    prompt = build_user_prompt(
        query="What is X?",
        context=["doc1", "doc2"]
    )
    assert "What is X?" in prompt
    assert "doc1" in prompt
```

### Test Response Parsing

```python
from myagent.parsers import extract_action, parse_tool_call

def test_extract_action():
    response = "I will search for: query"
    action = extract_action(response)
    assert action["type"] == "search"
    assert action["query"] == "query"

def test_parse_tool_call():
    llm_response = '{"tool": "calculator", "args": {"expression": "2+2"}}'
    parsed = parse_tool_call(llm_response)
    assert parsed["tool"] == "calculator"
```

## Integration Testing with Mocked LLM

### Mock LLM Fixture

```python
import pytest
import respx
from httpx import Response

@pytest.fixture
def mock_openai():
    with respx.mock(base_url="https://api.openai.com") as mock:
        yield mock

def setup_chat_response(mock, content: str):
    mock.post("/v1/chat/completions").mock(
        return_value=Response(200, json={
            "choices": [{"message": {"role": "assistant", "content": content}}]
        })
    )
```

### Test Agent Decision Making

```python
def test_agent_chooses_correct_tool(mock_openai):
    setup_chat_response(mock_openai, '{"action": "search", "query": "weather"}')

    agent = MyAgent()
    decision = agent.decide("What's the weather?")

    assert decision["action"] == "search"
    assert "weather" in decision["query"]
```

### Test Multi-Turn Conversations

```python
def test_multi_turn_conversation(mock_openai):
    responses = [
        '{"action": "ask_clarification", "question": "Which city?"}',
        '{"action": "search", "query": "weather NYC"}',
        'The weather in NYC is sunny.'
    ]

    route = mock_openai.post("/v1/chat/completions")
    route.side_effect = [
        Response(200, json={"choices": [{"message": {"content": r}}]})
        for r in responses
    ]

    agent = MyAgent()

    # Turn 1
    result1 = agent.run("What's the weather?")
    assert "Which city?" in result1

    # Turn 2
    result2 = agent.run("NYC")
    assert "sunny" in result2
```

### Test Tool Execution Loop

```python
def test_tool_loop(mock_openai, mock_external_api):
    # LLM decides to use tool
    mock_openai.post("/v1/chat/completions").side_effect = [
        Response(200, json={"choices": [{"message": {
            "content": '{"tool": "fetch_data", "args": {"id": 123}}'
        }}]}),
        Response(200, json={"choices": [{"message": {
            "content": "Based on the data, the answer is 42."
        }}]})
    ]

    # External API returns data
    mock_external_api.get("/data/123").mock(
        return_value=Response(200, json={"value": 42})
    )

    agent = MyAgent()
    result = agent.run("Get data for item 123")

    assert "42" in result
    assert mock_external_api["data"].call_count == 1
```

## Testing Async Agent Pipelines

### Async Agent Fixture

```python
import pytest
import pytest_asyncio
import respx
from httpx import Response

@pytest_asyncio.fixture
async def async_agent(mock_openai):
    agent = AsyncAgent(api_key="test")
    yield agent
    await agent.close()

@pytest.mark.asyncio
async def test_async_pipeline(async_agent, mock_openai):
    mock_openai.post("/v1/chat/completions").mock(
        return_value=Response(200, json={
            "choices": [{"message": {"content": "Async response"}}]
        })
    )

    result = await async_agent.run("Test query")
    assert "Async response" in result
```

### Test Concurrent Requests

```python
import asyncio

@pytest.mark.asyncio
async def test_concurrent_agent_calls(async_agent, mock_openai):
    mock_openai.post("/v1/chat/completions").mock(
        return_value=Response(200, json={
            "choices": [{"message": {"content": "Response"}}]
        })
    )

    tasks = [
        async_agent.run(f"Query {i}")
        for i in range(5)
    ]

    results = await asyncio.gather(*tasks)
    assert len(results) == 5
    assert all("Response" in r for r in results)
```

## Testing Error Handling

### Test Retry Logic

```python
from httpx import TimeoutException

def test_retry_on_timeout(mock_openai):
    route = mock_openai.post("/v1/chat/completions")
    route.side_effect = [
        TimeoutException("Timeout"),
        TimeoutException("Timeout"),
        Response(200, json={"choices": [{"message": {"content": "Success"}}]})
    ]

    agent = AgentWithRetry(max_retries=3)
    result = agent.run("Test")

    assert "Success" in result
    assert route.call_count == 3
```

### Test Rate Limit Handling

```python
def test_rate_limit_backoff(mock_openai):
    route = mock_openai.post("/v1/chat/completions")
    route.side_effect = [
        Response(429, json={"error": "Rate limited"}),
        Response(200, json={"choices": [{"message": {"content": "OK"}}]})
    ]

    agent = AgentWithRateLimitHandling()
    result = agent.run("Test")

    assert "OK" in result
```

### Test Graceful Degradation

```python
def test_fallback_on_error(mock_openai):
    mock_openai.post("/v1/chat/completions").mock(
        return_value=Response(500, json={"error": "Server error"})
    )

    agent = AgentWithFallback()
    result = agent.run("Test")

    assert result == agent.FALLBACK_RESPONSE
```

## Testing Streaming Responses

```python
def stream_response():
    chunks = [
        b'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n',
        b'data: {"choices":[{"delta":{"content":" World"}}]}\n\n',
        b'data: [DONE]\n\n'
    ]
    for chunk in chunks:
        yield chunk

@respx.mock
def test_streaming_agent():
    respx.post("https://api.openai.com/v1/chat/completions").mock(
        return_value=Response(200, stream=stream_response())
    )

    agent = StreamingAgent()
    chunks = list(agent.stream("Test"))

    assert chunks == ["Hello", " World"]
```

## Testing Memory and Context

```python
def test_conversation_memory(mock_openai):
    mock_openai.post("/v1/chat/completions").mock(
        return_value=Response(200, json={
            "choices": [{"message": {"content": "I remember"}}]
        })
    )

    agent = AgentWithMemory()
    agent.run("My name is Alice")

    # Check that context is passed in subsequent calls
    agent.run("What's my name?")

    last_request = mock_openai.calls[-1].request
    request_body = last_request.content.decode()
    assert "Alice" in request_body
```

## Testing with pytest-mock

### Mock Internal Functions

```python
def test_with_mocker(mocker, mock_openai):
    mock_tool = mocker.patch("myagent.tools.external_api_call")
    mock_tool.return_value = {"data": "mocked"}

    setup_chat_response(mock_openai, "Using tool result: mocked")

    agent = MyAgent()
    result = agent.run("Call external API")

    mock_tool.assert_called_once()
    assert "mocked" in result
```

### Spy on Method Calls

```python
def test_spy_on_method(mocker):
    agent = MyAgent()
    spy = mocker.spy(agent, "process_response")

    agent.run("Test")

    assert spy.call_count == 1
    assert spy.spy_return is not None
```

## End-to-End Pipeline Test

```python
@pytest.fixture
def full_mock_environment(mock_openai):
    with respx.mock as mock:
        # Mock all external services
        mock.get("https://api.weather.com/v1/current").mock(
            return_value=Response(200, json={"temp": 72})
        )
        mock.post("https://api.database.com/query").mock(
            return_value=Response(200, json={"results": []})
        )
        yield mock

def test_full_pipeline(full_mock_environment, mock_openai):
    # Setup LLM responses for the full flow
    responses = [
        '{"action": "get_weather", "location": "NYC"}',
        '{"action": "query_db", "query": "SELECT *"}',
        'Final answer based on weather (72F) and database results.'
    ]

    route = mock_openai.post("/v1/chat/completions")
    route.side_effect = [
        Response(200, json={"choices": [{"message": {"content": r}}]})
        for r in responses
    ]

    agent = FullPipelineAgent()
    result = agent.run("Get weather and check database")

    assert "72" in result
    assert route.call_count == 3
```
