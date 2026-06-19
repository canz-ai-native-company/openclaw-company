# OpenAPI 3.0 Specification Guide

Complete reference for writing OpenAPI 3.0 specifications.

---

## Basic Structure

```yaml
openapi: 3.0.3
info:
  title: My API
  version: 1.0.0
  description: API description here
  contact:
    name: API Support
    email: support@example.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://staging-api.example.com/v1
    description: Staging server

paths:
  /users:
    get:
      summary: List users
      responses:
        '200':
          description: Success

components:
  schemas: {}
  securitySchemes: {}
```

---

## Info Object

```yaml
info:
  title: User Management API
  version: 1.0.0
  description: |
    This API provides user management functionality including:
    - User registration and authentication
    - Profile management
    - Role-based access control
  termsOfService: https://example.com/terms
  contact:
    name: API Team
    url: https://example.com/support
    email: api@example.com
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
```

---

## Server Objects

```yaml
servers:
  - url: https://api.example.com/v1
    description: Production

  - url: https://{environment}.api.example.com/v1
    description: Environment-specific
    variables:
      environment:
        default: prod
        enum:
          - prod
          - staging
          - dev
```

---

## Paths and Operations

### Basic Endpoint

```yaml
paths:
  /users:
    get:
      tags:
        - Users
      summary: List all users
      description: Returns a paginated list of users
      operationId: listUsers
      parameters:
        - name: limit
          in: query
          description: Number of items to return
          required: false
          schema:
            type: integer
            default: 20
            maximum: 100
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserList'
        '401':
          $ref: '#/components/responses/Unauthorized'
```

### Path Parameters

```yaml
paths:
  /users/{userId}:
    parameters:
      - name: userId
        in: path
        required: true
        description: The user ID
        schema:
          type: string
          format: uuid

    get:
      summary: Get user by ID
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          $ref: '#/components/responses/NotFound'
```

### Request Body

```yaml
paths:
  /users:
    post:
      summary: Create a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
            examples:
              basic:
                summary: Basic user
                value:
                  email: user@example.com
                  name: John Doe
                  password: securePassword123
      responses:
        '201':
          description: User created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
          headers:
            Location:
              schema:
                type: string
              description: URL of created resource
```

---

## Components

### Schemas

```yaml
components:
  schemas:
    User:
      type: object
      required:
        - id
        - email
        - name
      properties:
        id:
          type: string
          format: uuid
          readOnly: true
          example: "123e4567-e89b-12d3-a456-426614174000"
        email:
          type: string
          format: email
          example: "user@example.com"
        name:
          type: string
          minLength: 1
          maxLength: 100
          example: "John Doe"
        role:
          type: string
          enum:
            - user
            - admin
            - moderator
          default: user
        created_at:
          type: string
          format: date-time
          readOnly: true
        updated_at:
          type: string
          format: date-time
          readOnly: true

    CreateUserRequest:
      type: object
      required:
        - email
        - name
        - password
      properties:
        email:
          type: string
          format: email
        name:
          type: string
          minLength: 1
          maxLength: 100
        password:
          type: string
          format: password
          minLength: 8
          writeOnly: true

    UpdateUserRequest:
      type: object
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 100
        email:
          type: string
          format: email
```

### Arrays and Collections

```yaml
components:
  schemas:
    UserList:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/User'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Pagination:
      type: object
      properties:
        total:
          type: integer
          example: 100
        page:
          type: integer
          example: 1
        per_page:
          type: integer
          example: 20
        total_pages:
          type: integer
          example: 5
```

### Reusable Responses

```yaml
components:
  responses:
    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              code: NOT_FOUND
              message: The requested resource was not found

    Unauthorized:
      description: Authentication required
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              code: UNAUTHORIZED
              message: Authentication required

    Forbidden:
      description: Permission denied
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    ValidationError:
      description: Validation failed
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ValidationError'
```

### Error Schemas

```yaml
components:
  schemas:
    Error:
      type: object
      required:
        - error
      properties:
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
              example: NOT_FOUND
            message:
              type: string
              example: Resource not found
            request_id:
              type: string
              example: req_abc123

    ValidationError:
      type: object
      required:
        - error
      properties:
        error:
          type: object
          properties:
            code:
              type: string
              example: VALIDATION_ERROR
            message:
              type: string
              example: Validation failed
            details:
              type: array
              items:
                type: object
                properties:
                  field:
                    type: string
                  code:
                    type: string
                  message:
                    type: string
```

---

## Security Schemes

### JWT Bearer Token

```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token from /auth/login

security:
  - bearerAuth: []

paths:
  /auth/login:
    post:
      security: []  # Public endpoint
      summary: User login
```

### API Key

```yaml
components:
  securitySchemes:
    apiKey:
      type: apiKey
      in: header
      name: X-API-Key
```

### OAuth 2.0

```yaml
components:
  securitySchemes:
    oauth2:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://example.com/oauth/authorize
          tokenUrl: https://example.com/oauth/token
          scopes:
            read:users: Read user information
            write:users: Create and update users
            admin: Full admin access

security:
  - oauth2:
      - read:users

paths:
  /admin/users:
    get:
      security:
        - oauth2:
            - admin
```

---

## Parameters

### Query Parameters

```yaml
components:
  parameters:
    limitParam:
      name: limit
      in: query
      description: Number of items to return
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20

    offsetParam:
      name: offset
      in: query
      description: Number of items to skip
      schema:
        type: integer
        minimum: 0
        default: 0

    sortParam:
      name: sort
      in: query
      description: Sort field (prefix with - for descending)
      schema:
        type: string
        example: -created_at

paths:
  /users:
    get:
      parameters:
        - $ref: '#/components/parameters/limitParam'
        - $ref: '#/components/parameters/offsetParam'
        - $ref: '#/components/parameters/sortParam'
```

### Header Parameters

```yaml
components:
  parameters:
    idempotencyKey:
      name: Idempotency-Key
      in: header
      description: Unique key for idempotent requests
      required: false
      schema:
        type: string
        format: uuid
```

---

## Tags

```yaml
tags:
  - name: Users
    description: User management operations
  - name: Orders
    description: Order management operations
  - name: Auth
    description: Authentication endpoints

paths:
  /users:
    get:
      tags:
        - Users
```

---

## Examples

### Response Examples

```yaml
paths:
  /users/{id}:
    get:
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
              examples:
                regularUser:
                  summary: Regular user
                  value:
                    id: "123e4567-e89b-12d3-a456-426614174000"
                    email: "user@example.com"
                    name: "John Doe"
                    role: "user"
                    created_at: "2024-01-15T10:30:00Z"
                adminUser:
                  summary: Admin user
                  value:
                    id: "223e4567-e89b-12d3-a456-426614174001"
                    email: "admin@example.com"
                    name: "Admin User"
                    role: "admin"
                    created_at: "2024-01-01T00:00:00Z"
```

---

## Complete Example

```yaml
openapi: 3.0.3
info:
  title: User Management API
  version: 1.0.0
  description: API for managing users

servers:
  - url: https://api.example.com/v1

tags:
  - name: Users
    description: User operations
  - name: Auth
    description: Authentication

security:
  - bearerAuth: []

paths:
  /auth/login:
    post:
      tags: [Auth]
      security: []
      summary: Login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                  expires_at:
                    type: string
                    format: date-time

  /users:
    get:
      tags: [Users]
      summary: List users
      parameters:
        - $ref: '#/components/parameters/limitParam'
        - $ref: '#/components/parameters/offsetParam'
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserList'

    post:
      tags: [Users]
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

  /users/{id}:
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
          format: uuid

    get:
      tags: [Users]
      summary: Get user
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          $ref: '#/components/responses/NotFound'

    patch:
      tags: [Users]
      summary: Update user
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateUserRequest'
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

    delete:
      tags: [Users]
      summary: Delete user
      responses:
        '204':
          description: Deleted

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  parameters:
    limitParam:
      name: limit
      in: query
      schema:
        type: integer
        default: 20
        maximum: 100

    offsetParam:
      name: offset
      in: query
      schema:
        type: integer
        default: 0

  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
        created_at:
          type: string
          format: date-time

    UserList:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/User'
        pagination:
          type: object
          properties:
            total:
              type: integer
            page:
              type: integer
            per_page:
              type: integer

    CreateUserRequest:
      type: object
      required: [email, name, password]
      properties:
        email:
          type: string
          format: email
        name:
          type: string
        password:
          type: string
          format: password

    UpdateUserRequest:
      type: object
      properties:
        name:
          type: string
        email:
          type: string
          format: email

    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string

  responses:
    NotFound:
      description: Not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
```

---

## Validation Tools

```bash
# Swagger CLI
npm install -g @apidevtools/swagger-cli
swagger-cli validate openapi.yaml

# Spectral (linting)
npm install -g @stoplight/spectral-cli
spectral lint openapi.yaml

# Online
# - https://editor.swagger.io
# - https://redocly.com/tools/openapi-cli
```
