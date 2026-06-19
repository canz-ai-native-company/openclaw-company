# Error Patterns Guide

Common error categories and how to classify them.

---

## Error Categories

### Build Errors

| Pattern | Example | Common Cause |
|---------|---------|--------------|
| Module not found | Cannot find module X | Missing dependency |
| Type error | Type X is not assignable | TypeScript mismatch |
| Syntax error | Unexpected token | Invalid syntax |
| Config error | Invalid next.config | Wrong configuration |

### Runtime Errors

| Pattern | Example | Common Cause |
|---------|---------|--------------|
| Reference error | X is not defined | Undefined variable |
| Null pointer | Cannot read property of undefined | Missing null check |
| Network error | Failed to fetch | API/CORS issue |
| Timeout | Request timeout | Slow response |

### Test Errors

| Pattern | Example | Common Cause |
|---------|---------|--------------|
| Assertion failed | Expected X but got Y | Logic error |
| Mock not called | Expected mock to be called | Missing call |
| Snapshot mismatch | Snapshot differs | UI change |

### Integration Errors

| Pattern | Example | Common Cause |
|---------|---------|--------------|
| CORS error | Access-Control-Allow-Origin | Missing headers |
| Auth error | 401 Unauthorized | Invalid token |
| Rate limit | 429 Too Many Requests | Exceeded limit |

### Deployment Errors

| Pattern | Example | Common Cause |
|---------|---------|--------------|
| Docker build fail | COPY failed | Missing file |
| Permission denied | EACCES | Wrong permissions |
| Port in use | EADDRINUSE | Port conflict |

---

## Error Severity Classification

| Severity | Definition | Action |
|----------|------------|--------|
| Critical | Blocks all functionality | Fix immediately |
| High | Major feature broken | Fix before deploy |
| Medium | Minor feature affected | Fix soon |
| Low | Cosmetic/edge case | Fix when possible |

---

## Known Patterns (Initial)

### ChatKit Patterns (CK-*)

| ID | Pattern | Problem | Solution |
|----|---------|---------|----------|
| CK-001 | npm import fails | Package requires domainKey | Use CDN approach |
| CK-002 | Empty greeting | startScreen not shown | Add greeting text |
| CK-003 | Script onLoad | Event handlers error | Use useEffect |

### Docker Patterns (DK-*)

| ID | Pattern | Problem | Solution |
|----|---------|---------|----------|
| DK-001 | MCP not loading | /home/node/.claude owned by root | chown in Dockerfile |
| DK-002 | Cache issue | Old layers cached | Use --no-cache |

### Next.js Patterns (NX-*)

| ID | Pattern | Problem | Solution |
|----|---------|---------|----------|
| NX-001 | Windows build fail | Turbopack path issue | Add turbopack.root |
| NX-002 | ESLint errors | no-unused-vars | Fix or disable rules |

### OpenAI SDK Patterns (SDK-*)

| ID | Pattern | Problem | Solution |
|----|---------|---------|----------|
| SDK-001 | Wrong imports | from agents.tools import X | from agents import X |

---

## Error Detection Keywords

| Keyword | Category |
|---------|----------|
| Cannot find module | Build |
| is not defined | Runtime |
| ENOENT | File System |
| EACCES | Permission |
| 401, 403 | Auth |
| 500 | Server |
| timeout | Network |
| CORS | Integration |
