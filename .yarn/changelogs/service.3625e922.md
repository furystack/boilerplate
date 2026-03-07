<!-- version-type: major -->
# service

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

### Replaced monolithic `config.ts` with modular service setup

The single `config.ts` file has been split into dedicated modules:

- `root-injector.ts` - Creates the root injector with logging
- `setup-store.ts` - Configures all physical stores, DataSets, and authentication
- `setup-rest-api.ts` - Configures REST API endpoints and static file serving
- `get-cors-options.ts` - CORS configuration
- `get-port.ts` - Port configuration
- `authorization/authorized-only.ts` - Authorization helpers

**Impact:** Any imports from `service/src/config.js` must be updated to the new module paths.

### Seeding uses DataSets instead of direct store access

The `seed.ts` module now uses `getDataSetFor()` with a system identity context (`useSystemIdentityContext`) instead of directly accessing `PhysicalStore` instances via `StoreManager`. This enforces repository-level authorization during seeding.

### Added JWT authentication alongside session-based auth

The service now configures JWT authentication via `useJwtAuthentication()` with configurable secret and token expiration. This adds `RefreshToken` and `PasswordResetToken` stores and DataSets.

## ✨ Features

### JWT authentication endpoints

Added three new POST endpoints for JWT-based authentication:

- `/jwt/login` - Authenticate with username/password, returns access and refresh tokens
- `/jwt/refresh` - Exchange a refresh token for new token pair
- `/jwt/logout` - Invalidate a refresh token

### Authorized endpoint example

Added `GET /testAuthorized` endpoint using the `Authenticate()` middleware to demonstrate token-protected routes.

### CORS `authorization` header support

The CORS configuration now includes the `authorization` header, allowing JWT tokens to be sent from the frontend.

## ♻️ Refactoring

- Extracted REST API setup into `setup-rest-api.ts` for better separation of concerns
- Extracted store/repository/auth setup into `setup-store.ts`
- Extracted port resolution into `get-port.ts` and CORS config into `get-cors-options.ts`
- Moved `authorizedOnly` helper and `authorizedDataSet` into `authorization/authorized-only.ts` with proper typing (removed `any`)

## ⬆️ Dependencies

- Added `@furystack/auth-jwt` `^2.1.2` - JWT authentication support with token management
- Updated `@furystack/rest-service` from `^10.1.3` to `^12.3.0` - New `Authenticate` middleware and API changes
- Updated `@furystack/security` from `^6.0.32` to `^7.0.4` - Adds `PasswordResetToken` model
- Updated `@furystack/core` from `^15.0.32` to `^15.2.5`
- Updated `@furystack/filesystem-store` from `^7.0.32` to `^7.1.2`
- Updated `@furystack/inject` from `^12.0.26` to `^12.0.32`
- Updated `@furystack/logging` from `^8.0.26` to `^8.1.1`
- Updated `@furystack/repository` from `^10.0.32` to `^10.1.6`
- Updated `@types/node` from `^25.0.10` to `^25.3.5`
