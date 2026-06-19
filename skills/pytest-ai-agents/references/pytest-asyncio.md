# pytest-asyncio Reference

## Configuration

### pyproject.toml

```toml
[tool.pytest.ini_options]
asyncio_mode = "auto"  # or "strict"
asyncio_default_fixture_loop_scope = "function"
```

**Modes:**
- `auto` - Automatically marks all async test functions
- `strict` - Requires explicit `@pytest.mark.asyncio` on each test

### Loop Scopes

| Scope | Description |
|-------|-------------|
| `function` | New event loop per test function (default) |
| `class` | Shared loop for all tests in a class |
| `module` | Shared loop for all tests in a module |
| `package` | Shared loop for all tests in a package |
| `session` | Single loop for entire test session |

## Markers

### Basic Async Test

```python
import pytest

@pytest.mark.asyncio
async def test_async_operation():
    result = await some_async_function()
    assert result == expected
```

### Loop Scope Override

```python
@pytest.mark.asyncio(loop_scope="module")
async def test_shared_loop():
    # Uses module-scoped event loop
    pass
```

## Async Fixtures

### Basic Async Fixture

```python
import pytest_asyncio

@pytest_asyncio.fixture
async def database_connection():
    conn = await create_connection("postgresql://localhost/test")
    yield conn
    await conn.close()

@pytest.mark.asyncio
async def test_with_db(database_connection):
    result = await database_connection.execute("SELECT 1")
    assert result == 1
```

### Scoped Async Fixtures

```python
@pytest_asyncio.fixture(scope="module")
async def shared_cache():
    cache = await AsyncCache.create()
    yield cache
    await cache.close()

@pytest_asyncio.fixture(scope="session")
async def session_resource():
    resource = await expensive_setup()
    yield resource
    await resource.cleanup()
```

### Loop Scope Control

```python
# Fixture runs in module-scoped loop, cached at module level
@pytest_asyncio.fixture(loop_scope="module", scope="module")
async def module_fixture():
    resource = await create_resource()
    yield resource
    await resource.cleanup()

# Fixture runs in session-scoped loop, cached at module level
@pytest_asyncio.fixture(loop_scope="session", scope="module")
async def session_loop_module_cached():
    return await setup_shared_resource()

# Fixture runs in module-scoped loop, new value per function
@pytest_asyncio.fixture(loop_scope="module")
async def module_loop_function_cached():
    return await setup_resource()
```

### Parametrized Async Fixtures

```python
@pytest_asyncio.fixture(params=[1, 2, 3])
async def parametrized_value(request):
    value = await compute_value(request.param)
    yield value
```

## Concurrent Task Testing

```python
import asyncio

@pytest.mark.asyncio
async def test_concurrent_operations():
    task1 = asyncio.create_task(operation1())
    task2 = asyncio.create_task(operation2())
    results = await asyncio.gather(task1, task2)
    assert len(results) == 2
```

## Timeout Testing

```python
import asyncio

@pytest.mark.asyncio
async def test_with_timeout():
    with pytest.raises(asyncio.TimeoutError):
        await asyncio.wait_for(slow_operation(), timeout=0.1)
```

## Event Loop Access

```python
@pytest.mark.asyncio
async def test_event_loop():
    loop = asyncio.get_running_loop()
    assert loop is not None
```
