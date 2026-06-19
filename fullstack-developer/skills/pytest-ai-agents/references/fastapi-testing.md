# FastAPI Testing Reference

## TestClient (Sync)

### Basic Usage

```python
from fastapi import FastAPI
from fastapi.testclient import TestClient

app = FastAPI()

@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}

client = TestClient(app)

def test_read_item():
    response = client.get("/items/42")
    assert response.status_code == 200
    assert response.json() == {"item_id": 42}
```

### HTTP Methods

```python
# GET
response = client.get("/items")

# POST with JSON
response = client.post("/items", json={"name": "test"})

# PUT
response = client.put("/items/1", json={"name": "updated"})

# PATCH
response = client.patch("/items/1", json={"name": "patched"})

# DELETE
response = client.delete("/items/1")
```

### Headers and Auth

```python
response = client.get(
    "/protected",
    headers={"Authorization": "Bearer token123"}
)

response = client.post(
    "/api/data",
    headers={"X-Custom-Header": "value"},
    json={"data": "test"}
)
```

### Query Parameters

```python
response = client.get("/search", params={"q": "test", "limit": 10})
```

### Form Data

```python
response = client.post(
    "/login",
    data={"username": "user", "password": "pass"}
)
```

### File Upload

```python
response = client.post(
    "/upload",
    files={"file": ("test.txt", b"file content", "text/plain")}
)
```

## AsyncClient (Async Tests)

### Basic Async Test

```python
import pytest
from httpx import ASGITransport, AsyncClient
from myapp.main import app

@pytest.mark.asyncio
async def test_async():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as client:
        response = await client.get("/items/1")
    assert response.status_code == 200
```

### Reusable Async Client Fixture

```python
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from myapp.main import app

@pytest_asyncio.fixture
async def async_client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as client:
        yield client

@pytest.mark.asyncio
async def test_with_fixture(async_client):
    response = await async_client.get("/items")
    assert response.status_code == 200
```

## Dependency Overrides

### Basic Override

```python
from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient

app = FastAPI()

def get_db():
    return RealDatabase()

@app.get("/items")
def read_items(db=Depends(get_db)):
    return db.get_items()

# In tests
def get_test_db():
    return MockDatabase()

app.dependency_overrides[get_db] = get_test_db
client = TestClient(app)

def test_items():
    response = client.get("/items")
    assert response.status_code == 200
```

### Override with Fixture

```python
import pytest
from fastapi.testclient import TestClient
from myapp.main import app, get_db

@pytest.fixture
def client():
    def get_test_db():
        return MockDatabase()

    app.dependency_overrides[get_db] = get_test_db
    yield TestClient(app)
    app.dependency_overrides.clear()
```

### Override Settings

```python
from myapp.config import Settings, get_settings
from myapp.main import app

def get_test_settings():
    return Settings(
        database_url="sqlite:///:memory:",
        api_key="test-key",
        debug=True
    )

app.dependency_overrides[get_settings] = get_test_settings
```

### Override Auth

```python
from myapp.auth import get_current_user
from myapp.main import app

def get_test_user():
    return {"id": 1, "username": "testuser", "role": "admin"}

app.dependency_overrides[get_current_user] = get_test_user

def test_protected_endpoint():
    response = client.get("/admin/dashboard")
    assert response.status_code == 200
```

## Testing Async Dependencies

```python
from fastapi import Depends, FastAPI

app = FastAPI()

async def get_async_db():
    db = await create_async_db()
    try:
        yield db
    finally:
        await db.close()

@app.get("/items")
async def read_items(db=Depends(get_async_db)):
    return await db.fetch_items()

# Override
async def get_test_async_db():
    return MockAsyncDatabase()

app.dependency_overrides[get_async_db] = get_test_async_db
```

## Testing Lifespan Events

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.testclient import TestClient

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.state.db = await create_db()
    yield
    # Shutdown
    await app.state.db.close()

app = FastAPI(lifespan=lifespan)

def test_with_lifespan():
    with TestClient(app) as client:
        # Lifespan events run within this context
        response = client.get("/items")
        assert response.status_code == 200
```

## Testing WebSockets

```python
from fastapi import FastAPI, WebSocket
from fastapi.testclient import TestClient

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    data = await websocket.receive_text()
    await websocket.send_text(f"Echo: {data}")
    await websocket.close()

def test_websocket():
    client = TestClient(app)
    with client.websocket_connect("/ws") as ws:
        ws.send_text("Hello")
        data = ws.receive_text()
        assert data == "Echo: Hello"
```

## Testing Background Tasks

```python
from fastapi import BackgroundTasks, FastAPI
from fastapi.testclient import TestClient

app = FastAPI()
results = []

def background_task(message: str):
    results.append(message)

@app.post("/tasks")
def create_task(background_tasks: BackgroundTasks):
    background_tasks.add_task(background_task, "completed")
    return {"status": "scheduled"}

def test_background_task():
    results.clear()
    client = TestClient(app)
    response = client.post("/tasks")
    assert response.status_code == 200
    assert "completed" in results
```

## Error Response Testing

```python
def test_not_found():
    response = client.get("/items/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Item not found"

def test_validation_error():
    response = client.post("/items", json={"name": 123})
    assert response.status_code == 422
    assert "validation" in response.json()["detail"][0]["type"]
```
