# Changelog

## [2.0.0] - 2026-03-07

### 💥 Breaking Changes

### Migrated from ESLint v9 to ESLint v10

The ESLint configuration now uses ESLint v10 and switched from `project` array to `projectService` for TypeScript integration. The `@furystack/eslint-plugin` is now used for FuryStack-specific lint rules.

**Impact:** Custom ESLint configurations or overrides targeting ESLint v9 may need to be updated.

### ✨ Features

### Added `@furystack/eslint-plugin` with strict lint rules

Integrated `@furystack/eslint-plugin` with `recommendedStrict` config for all TypeScript files and `shadesStrict` config for frontend `.tsx`/`.ts` files, enforcing FuryStack-specific best practices (e.g., `furystack/rest-action-validate-wrapper`).

### ⬆️ Dependencies

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
- Updated `eslint` from ^9.39.2 to ^10.0.2
- Updated `@eslint/js` from ^9.39.2 to ^10.0.1
- Updated `typescript-eslint` from ^8.53.1 to ^8.56.1
- Updated `@playwright/test` from ^1.58.0 to ^1.58.2
- Updated `@furystack/yarn-plugin-changelog` from ^1.0.1 to ^1.0.5
- Updated `eslint-plugin-jsdoc` from ^62.4.0 to ^62.7.1
- Updated `eslint-plugin-playwright` from ^2.5.0 to ^2.7.1
- Updated `rimraf` from ^6.1.2 to ^6.1.3
- Updated `@types/node` from ^25.0.10 to ^25.3.1

### 🔧 Chores

- Renamed `test:unit` script to `test`

## [1.0.4] - 2026-02-09

### 👷 CI

### Updated release workflow to use develop branch

Changed the Docker Hub publish workflow to use `develop` as the release branch instead of `master`. Releases are now triggered from `develop` and merged to `master` after successful deployment.

- Renamed `test:unit` npm script to `test` for consistency with the FuryStack monorepo conventions

### ⬆️ Dependencies

- Updated `@furystack/yarn-plugin-changelog` from ^1.0.1 to ^1.0.2
- Updated `@playwright/test` from ^1.58.0 to ^1.58.1
- Updated `@types/node` from ^25.0.10 to ^25.1.0
- Updated `eslint-plugin-jsdoc` from ^62.4.0 to ^62.5.0
- Updated `eslint-plugin-playwright` from ^2.5.0 to ^2.5.1
- Updated `typescript-eslint` from ^8.53.1 to ^8.54.0
- Updated `@eslint/js` from `9.39.2` to `10.0.1`
- Updated `eslint` from `9.39.2` to `10.0.0`
- Updated `typescript-eslint` from `8.53.1` to `8.54.0`
- Updated `eslint-plugin-jsdoc` from `62.4.0` to `62.5.4`
- Updated `eslint-plugin-playwright` from `2.5.0` to `2.5.1`
- Updated `@playwright/test` from `1.58.0` to `1.58.2`
- Updated `@types/node` from `25.0.10` to `25.2.2`
- Updated `@furystack/yarn-plugin-changelog` from `1.0.1` to `1.0.2`

### 🧪 Tests

- Updated E2E test selectors to match the reworked login page ("Sign In" button, `data-testid` for page header title)

### 🔧 Chores

- Renamed `test:unit` script to `test` in `package.json`

## [1.0.3] - 2026-02-01

### 🔧 Chores

### Project Consolidation

Standardized project configuration, updated CI workflows, and added changelog plugin support.

**Changes:**

- Renamed npm scripts from `prettier`/`prettier:check` to `format`/`format:check` for consistency
- Added format check step to Azure Pipelines
- Added format check step to UI tests workflow
- Fixed 'neccessary' typo to 'necessary' in build-test.yml
- Added `@furystack/yarn-plugin-changelog` for changelog management
- Updated `applyVersionBumps` script to `applyReleaseChanges` with changelog apply support
