<!-- version-type: patch -->
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

## ✨ Features

- Added JWT authentication support via `@furystack/auth-jwt` with configurable secret and token expiration
- Added `/jwt/login`, `/jwt/refresh`, and `/jwt/logout` REST endpoints for JWT-based auth flow
- Added `/testAuthorized` endpoint protected by the `Authenticate()` middleware
- Added `RefreshToken` and `PasswordResetToken` stores and DataSets

## ♻️ Refactoring

- Split monolithic `config.ts` and `service.ts` into focused modules: `root-injector.ts`, `setup-store.ts`, `setup-rest-api.ts`, `get-cors-options.ts`, `get-port.ts`, and `authorization/authorized-only.ts`
- Seed now uses DataSets (via `getDataSetFor`) with a system identity context instead of raw PhysicalStore access

## ⬆️ Dependencies

- Added `@furystack/auth-jwt` ^2.0.0
- Updated `@furystack/core` from ^15.0.32 to ^15.2.2
- Updated `@furystack/rest-service` from ^10.1.3 to ^12.1.0
- Updated `@furystack/security` from ^6.0.32 to ^7.0.1
- Updated `@furystack/repository` from ^10.0.32 to ^10.1.3
- Updated `@furystack/inject` from ^12.0.26 to ^12.0.30
- Updated `@furystack/logging` from ^8.0.26 to ^8.0.30
- Updated `@furystack/filesystem-store` from ^7.0.32 to ^7.0.40
- Updated `@types/node` from ^25.0.10 to ^25.3.1
