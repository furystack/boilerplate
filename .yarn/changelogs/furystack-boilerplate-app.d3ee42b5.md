<!-- version-type: patch -->
# furystack-boilerplate-app

## 👷 CI

### Updated release workflow to use develop branch

Changed the Docker Hub publish workflow to use `develop` as the release branch instead of `master`. Releases are now triggered from `develop` and merged to `master` after successful deployment.

- Renamed `test:unit` npm script to `test` for consistency with the FuryStack monorepo conventions

## ⬆️ Dependencies

- Updated `@furystack/yarn-plugin-changelog` from ^1.0.1 to ^1.0.2
- Updated `@playwright/test` from ^1.58.0 to ^1.58.1
- Updated `@types/node` from ^25.0.10 to ^25.1.0
- Updated `eslint-plugin-jsdoc` from ^62.4.0 to ^62.5.0
- Updated `eslint-plugin-playwright` from ^2.5.0 to ^2.5.1
- Updated `typescript-eslint` from ^8.53.1 to ^8.54.0
