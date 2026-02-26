<!-- version-type: patch -->
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

## ✨ Features

- Added `JwtApi` type definition for JWT authentication endpoints (`/jwt/login`, `/jwt/refresh`, `/jwt/logout`)
- Added `AuthorizedApi` type for endpoints requiring JWT bearer authentication (`/currentUser`, `/testAuthorized`)
- Added JWT endpoints and `/testAuthorized` to `BoilerplateApi`
- Added `jwt-api.json` schema generation for the new JWT API types

## ♻️ Refactoring

- Changed `User` model to re-export from `@furystack/core` instead of defining a local class

## ⬆️ Dependencies

- Updated `@furystack/rest` from ^8.0.32 to ^8.0.40
- Updated `@types/node` from ^25.0.10 to ^25.3.1
- Updated `ts-json-schema-generator` from ^2.4.0 to ^2.5.0
