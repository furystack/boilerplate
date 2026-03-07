<!-- version-type: major -->
# common

<!--
FORMATTING GUIDE:

### Detailed Entry (appears first when merging)

Use h3 (###) and below for detailed entries with paragraphs, code examples, and lists.

### Simple List Items

- Simple changes can be added as list items
- They are collected together at the bottom of each section

TIP: When multiple changelog drafts are merged, heading-based entries
appear before simple list items within each section.
-->

## 💥 Breaking Changes

### `User` model re-exported from `@furystack/core`

The `User` class is no longer defined locally. It is now re-exported from `@furystack/core`, which may have a different shape or behavior than the previous local definition.

**Examples:**

```typescript
// ❌ Before
import { User } from 'common'
// User was a local class with `username: string` and `roles: string[]`

// ✅ After
import { User } from 'common'
// User is now the `@furystack/core` User type
```

**Impact:** Consumers relying on the exact class definition (e.g., `instanceof` checks or decorators tied to the old class) need to verify compatibility with the `@furystack/core` User type.

## ✨ Features

### JWT API type definitions

Added `JwtApi` and `AuthorizedApi` interfaces for typed JWT authentication endpoints. The `BoilerplateApi` now also includes JWT endpoints (`/jwt/login`, `/jwt/refresh`, `/jwt/logout`) and a `/testAuthorized` endpoint.

**Usage:**

```typescript
import type { JwtApi, AuthorizedApi } from 'common'

// JwtApi provides typed POST endpoints for /jwt/login, /jwt/refresh, /jwt/logout
// AuthorizedApi provides typed GET endpoints requiring a valid access token
```

- Added `jwt-api.ts` with schema generation support for the new JWT API types

## ⬆️ Dependencies

- Updated `@furystack/rest` from `^8.0.32` to `^8.1.0`
- Updated `@types/node` from `^25.0.10` to `^25.3.5`
- Updated `ts-json-schema-generator` from `^2.4.0` to `^2.9.0`
