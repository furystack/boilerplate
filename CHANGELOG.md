# Changelog

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
