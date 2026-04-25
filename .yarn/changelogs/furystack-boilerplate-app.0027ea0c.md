<!-- version-type: patch -->
# furystack-boilerplate-app

## ♻️ Refactoring

### Tightened the workspace `tsconfig.json`

Dropped the redundant `incremental`, `composite`, `moduleResolution` and `allowSyntheticDefaultImports` lines (already covered by `module: "NodeNext"` plus `esModuleInterop`), and switched to `files: []` + `references: [./common, ./service, ./frontend]` so a top-level `tsc -b` builds every workspace through TypeScript's project-references model.

### Switched the Vitest frontend project from `jsdom` to `happy-dom`

`jsdom@29` ships an ESM-only `html-encoding-sniffer@6`, which `require()` cannot load on Node 20.x. Swapping the frontend project's `environment` to `happy-dom` fixes the test pool startup, removes the heavyweight jsdom dependency tree, and keeps the DOM surface needed by the new frontend specs intact.

```diff
 {
   test: {
     name: 'Frontend',
-    environment: 'jsdom',
+    environment: 'happy-dom',
     include: ['frontend/src/**/*.spec.(ts|tsx)'],
   },
 }
```

## 📦 Build

### Allowed default project resolution for top-level config files in ESLint

`eslint.config.js` now passes `parserOptions.projectService.allowDefaultProject` listing `vite.config.ts`, `vitest.config.mts`, `playwright.config.ts`, `frontend/vite.config.ts` and `e2e/*.spec.ts`. These files were previously reported as `Parsing error: … was not found by the project service` because none of the `tsconfig.json` `include` globs covered them; lint is now clean for the whole repository.

## ⬆️ Dependencies

- Added `happy-dom` (replaces `jsdom` for the Vitest frontend project — see Refactoring above).
- Bumped `@furystack/eslint-plugin` from `^2.1.3` to `^3.0.0` (functional-DI v7 release of the lint rules).
- Bumped `@furystack/yarn-plugin-changelog` from `^1.0.8` to `^1.0.10`.
- Bumped `@playwright/test` from `^1.58.2` to `^1.59.1`.
- Bumped `@types/node` from `^25.5.0` to `^25.6.0`.
- Bumped `@vitest/coverage-v8` from `^4.1.1` to `^4.1.5`.
- Bumped `eslint` from `^10.1.0` to `^10.2.1`.
- Bumped `eslint-plugin-jsdoc` from `^62.8.0` to `^62.9.0`.
- Bumped `eslint-plugin-playwright` from `^2.10.1` to `^2.10.2`.
- Bumped `prettier` from `^3.8.1` to `^3.8.3`.
- Bumped `typescript` from `^6.0.2` to `^6.0.3`.
- Bumped `typescript-eslint` from `^8.57.2` to `^8.59.0`.
- Bumped `vite` from `^8.0.2` to `^8.0.10`.
- Bumped `vitest` from `^4.1.1` to `^4.1.5`.
- Bumped Yarn from `4.13.0` to `4.14.1`.
