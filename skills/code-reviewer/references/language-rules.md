# Language-Specific Rules

Code review rules organized by programming language.

---

## TypeScript Rules

### Must Follow

| Rule | Why | Check |
|------|-----|-------|
| No `any` type | Defeats type safety | Grep for `: any` |
| Explicit return types | Clarity, catch errors | Functions without `: ReturnType` |
| Strict null checks | Prevent null errors | `strictNullChecks: true` |
| No unused variables | Dead code | ESLint `no-unused-vars` |
| Readonly where possible | Immutability | Props, configs |

### Naming Conventions

```typescript
// Classes: PascalCase
class UserService {}

// Interfaces: PascalCase (no I prefix)
interface User {}  // Good
interface IUser {} // Bad (Hungarian notation)

// Types: PascalCase
type UserRole = 'admin' | 'user';

// Functions/Variables: camelCase
function getUserById() {}
const userName = 'John';

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;

// Enum values: PascalCase
enum Status {
  Active,
  Inactive,
}
```

### File Organization

```
// Order of imports
1. Node built-ins (fs, path)
2. External packages (react, lodash)
3. Internal packages (@company/utils)
4. Relative imports (./utils, ../types)

// Order within file
1. Types/Interfaces
2. Constants
3. Helper functions
4. Main export
```

---

## Python Rules

### Must Follow

| Rule | Why | Check |
|------|-----|-------|
| Type hints | Clarity, IDE support | `def func(x: int) -> str:` |
| Docstrings | Documentation | Triple quotes on functions |
| No bare except | Hides errors | `except:` without type |
| Context managers | Resource cleanup | `with open()` not `open()` |
| F-strings over format | Readability | `f"{var}"` not `"{}".format(var)` |

### Naming Conventions

```python
# Classes: PascalCase
class UserService:
    pass

# Functions/Variables: snake_case
def get_user_by_id():
    pass

user_name = "John"

# Constants: UPPER_SNAKE_CASE
MAX_RETRIES = 3

# Private: leading underscore
def _internal_helper():
    pass

# Module-level dunder
__version__ = "1.0.0"
```

### Docstring Format

```python
def calculate_total(items: list[Item], tax_rate: float) -> float:
    """Calculate the total price including tax.

    Args:
        items: List of cart items with price and quantity.
        tax_rate: Tax rate as decimal (e.g., 0.1 for 10%).

    Returns:
        Total price as float.

    Raises:
        ValueError: If tax_rate is negative.

    Example:
        >>> calculate_total([Item(10, 2)], 0.1)
        22.0
    """
    pass
```

---

## JavaScript Rules

### Must Follow

| Rule | Why | Check |
|------|-----|-------|
| `const` by default | Immutability | Use `let` only when needed |
| Arrow functions | Lexical `this` | Except for methods |
| Template literals | Readability | `` `${var}` `` not `"" + var` |
| Destructuring | Clarity | `const { name } = user` |
| Optional chaining | Safe access | `user?.name` |

### Async Patterns

```javascript
// Good: async/await
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error('User not found');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// Good: Promise.all for parallel
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
]);

// Bad: Sequential when could be parallel
const users = await fetchUsers();
const posts = await fetchPosts(); // Waits unnecessarily
```

---

## React Rules

### Must Follow

| Rule | Why | Check |
|------|-----|-------|
| Hooks rules | React requirement | eslint-plugin-react-hooks |
| Key prop | Reconciliation | Unique stable keys |
| No index as key | Bugs on reorder | Use ID or stable key |
| useCallback for handlers | Performance | Callbacks in JSX |
| useMemo for expensive | Performance | Heavy computations |

### Component Patterns

```tsx
// Good: Typed props
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

// Good: Destructured props with defaults
function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// Good: Custom hook for logic
function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(id).then(setUser).finally(() => setLoading(false));
  }, [id]);

  return { user, loading };
}
```

### File Naming

```
// Components: PascalCase.tsx
Button.tsx
UserProfile.tsx

// Hooks: camelCase starting with use
useUser.ts
useLocalStorage.ts

// Utils: camelCase
formatDate.ts
validateEmail.ts

// Types: PascalCase or types.ts
User.ts
types.ts
```

---

## Next.js Rules

### Must Follow

| Rule | Why | Check |
|------|-----|-------|
| 'use client' directive | Server vs Client | Client components |
| Metadata export | SEO | `export const metadata` |
| Image component | Optimization | `next/image` not `<img>` |
| Link component | Prefetching | `next/link` not `<a>` |
| Error boundaries | Error handling | `error.tsx` files |

### App Router Patterns

```tsx
// Good: Server component (default)
async function UserPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id); // Direct DB call
  return <UserProfile user={user} />;
}

// Good: Client component when needed
'use client';
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// Good: Loading state
// app/users/loading.tsx
export default function Loading() {
  return <Skeleton />;
}

// Good: Error handling
// app/users/error.tsx
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <button onClick={reset}>Try again</button>;
}
```

---

## FastAPI Rules

### Must Follow

| Rule | Why | Check |
|------|-----|-------|
| Pydantic models | Validation | Request/Response models |
| Dependency injection | Testability | `Depends()` |
| Status codes | API clarity | Correct HTTP codes |
| Exception handlers | Error responses | HTTPException |
| Async endpoints | Performance | `async def` |

### Patterns

```python
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel

# Good: Pydantic model for validation
class UserCreate(BaseModel):
    email: str
    name: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str

# Good: Dependency injection
async def get_db():
    db = Database()
    try:
        yield db
    finally:
        await db.close()

# Good: Typed endpoint
@app.post("/users", response_model=UserResponse, status_code=201)
async def create_user(user: UserCreate, db: Database = Depends(get_db)):
    try:
        return await db.create_user(user)
    except DuplicateError:
        raise HTTPException(status_code=409, detail="Email already exists")
```
