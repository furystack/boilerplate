# Changelog

## [2.0.0] - 2026-03-07

### 💥 Breaking Changes

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

### ✨ Features

### JWT API type definitions

Added `JwtApi` and `AuthorizedApi` interfaces for typed JWT authentication endpoints. The `BoilerplateApi` now also includes JWT endpoints (`/jwt/login`, `/jwt/refresh`, `/jwt/logout`) and a `/testAuthorized` endpoint.

**Usage:**

```typescript
import type { JwtApi, AuthorizedApi } from 'common'

// JwtApi provides typed POST endpoints for /jwt/login, /jwt/refresh, /jwt/logout
// AuthorizedApi provides typed GET endpoints requiring a valid access token
```

- Added `jwt-api.ts` with schema generation support for the new JWT API types

- Added `JwtApi` type definition for JWT authentication endpoints (`/jwt/login`, `/jwt/refresh`, `/jwt/logout`)
- Added `AuthorizedApi` type for endpoints requiring JWT bearer authentication (`/currentUser`, `/testAuthorized`)
- Added JWT endpoints and `/testAuthorized` to `BoilerplateApi`
- Added `jwt-api.json` schema generation for the new JWT API types

### ⬆️ Dependencies

- Updated `@furystack/rest` from `^8.0.32` to `^8.1.0`
- Updated `@types/node` from `^25.0.10` to `^25.3.5`
- Updated `ts-json-schema-generator` from `^2.4.0` to `^2.9.0`
- Updated `@furystack/rest` from ^8.0.32 to ^8.0.40
- Updated `@types/node` from ^25.0.10 to ^25.3.1
- Updated `ts-json-schema-generator` from ^2.4.0 to ^2.5.0

### ♻️ Refactoring

- Changed `User` model to re-export from `@furystack/core` instead of defining a local class

## [1.0.2] - 2026-02-09

### ⬆️ Dependencies

- Updated `@furystack/rest` from ^8.0.32 to ^8.0.34
- Updated `@types/node` from ^25.0.10 to ^25.1.0
- Updated `@furystack/rest` from `8.0.32` to `8.0.35`
- Updated `@types/node` from `25.0.10` to `25.2.2`
- Updated `ts-json-schema-generator` from `2.4.0` to `2.5.0`
