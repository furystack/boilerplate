# Changelog

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
