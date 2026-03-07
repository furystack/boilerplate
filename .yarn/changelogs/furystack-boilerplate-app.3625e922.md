<!-- version-type: major -->
# furystack-boilerplate-app

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

### Migrated from ESLint v9 to ESLint v10

The ESLint configuration now uses ESLint v10 and switched from `project` array to `projectService` for TypeScript integration. The `@furystack/eslint-plugin` is now used for FuryStack-specific lint rules.

**Impact:** Custom ESLint configurations or overrides targeting ESLint v9 may need to be updated.

## ✨ Features

### Added `@furystack/eslint-plugin` with strict lint rules

Integrated `@furystack/eslint-plugin` with `recommendedStrict` config for all TypeScript files and `shadesStrict` config for frontend `.tsx`/`.ts` files, enforcing FuryStack-specific best practices (e.g., `furystack/rest-action-validate-wrapper`).

## ⬆️ Dependencies

- Added `@furystack/eslint-plugin` `^2.0.0` - FuryStack-specific ESLint rules
- Updated Yarn from `4.12.0` to `4.13.0`
- Updated `eslint` from `^9.39.2` to `^10.0.3`
- Updated `@eslint/js` from `^9.39.2` to `^10.0.1`
- Updated `typescript-eslint` from `^8.53.1` to `^8.56.1`
- Updated `eslint-plugin-jsdoc` from `^62.4.0` to `^62.7.1`
- Updated `eslint-plugin-playwright` from `^2.5.0` to `^2.9.0`
- Updated `lint-staged` from `^16.2.7` to `^16.3.2`
- Updated `rimraf` from `^6.1.2` to `^6.1.3`
- Updated `@playwright/test` from `^1.58.0` to `^1.58.2`
- Updated `@furystack/yarn-plugin-changelog` from `^1.0.1` to `^1.0.6`
- Updated `@types/node` from `^25.0.10` to `^25.3.5`
