<!-- version-type: patch -->
# service

## ♻️ Refactoring

### Migrated the persistence layer to functional DI

`@furystack/core` v17, `@furystack/repository` v11, `@furystack/rest-service` v14, `@furystack/security` v8, `@furystack/auth-jwt` v4 and `@furystack/filesystem-store` v8 replaced the old `addStore` / `getRepository().createDataSet(...)` pipeline with module-scoped `defineStore` / `defineFileSystemStore` / `defineDataSet` tokens. `setup-store.ts` was rewritten to:

- Declare module-scoped `defineFileSystemStore` tokens for the persisted user / password-credential collections and `defineStore` tokens for the in-memory session / password-reset-token / refresh-token collections.
- Bind the framework-provided throw-by-default tokens (`UserStore`, `SessionStore`, `PasswordCredentialStore`, `PasswordResetTokenStore`, `RefreshTokenStore`) to those backing stores via `injector.bind(token, ({ inject }) => inject(BackingToken))`, so disposal is owned by the backing `defineStore` / `defineFileSystemStore` factory.
- Expose a single `AuthorizedUserDataSet` (`defineDataSet({ store: UserStore, settings: authorizedDataSet })`) and pass it to `useHttpAuthentication(injector, { userDataSet: AuthorizedUserDataSet })`. The same token is reused by the seeder so write-time authorization runs through one pipeline.

```ts
// before
addStore(injector, new FileSystemStore({ model: User, primaryKey: 'username', ... }))
  .addStore(new InMemoryStore({ model: DefaultSession, primaryKey: 'sessionId' }))
  // …
getRepository(injector)
  .createDataSet(User, 'username', { ...authorizedDataSet })
  // …
useHttpAuthentication(injector)

// after
const UsersFileStore = defineFileSystemStore({ name: 'app/UsersFileStore', model: User, primaryKey: 'username', fileName: usersFile, tickMs: 30_000 })
// … other backing tokens …

export const AuthorizedUserDataSet = defineDataSet({ name: 'app/AuthorizedUserDataSet', store: UserStore, settings: authorizedDataSet })

export const setupStore = (injector: Injector): void => {
  injector.bind(UserStore, ({ inject }) => inject(UsersFileStore))
  // … other bindings …
  useHttpAuthentication(injector, { userDataSet: AuthorizedUserDataSet })
}
```

### Replaced the seed-time direct service lookups with token resolution

`seed.ts` no longer goes through `getDataSetFor(injector, Model, 'pk')` or `injector.getInstance(PasswordAuthenticator)`. It now resolves the new `AuthorizedUserDataSet` and `PasswordCredentialDataSet` tokens directly through `injector.get(...)` inside a `useSystemIdentityContext` scope.

### Hardened JWT secret loading

`requireJwtSecret(env)` validates the JWT signing secret at startup:

- Returns `process.env.JWT_SECRET` when its UTF-8 byte length is at least 32.
- Throws when `NODE_ENV === 'production'` and the env var is missing or too short, so a misconfigured deploy fails loudly instead of silently using the development fallback.
- Falls back to a fixed development secret in any other environment, matching the previous local-dev experience.

The byte-length check matches the 32-byte invariant `useJwtAuthentication` enforces, so multi-byte UTF-8 secrets that happened to have ≥ 32 characters but < 32 bytes are now rejected before reaching the framework.

### Simplified the shutdown handler

`@furystack/rest-service` v14 removed the `ServerManager` class — the HTTP server pool is owned by `HttpServerPoolToken` and disposes itself when the injector is disposed. `attachShutdownHandler` no longer probes `cachedSingletons` for `ServerManager`; every signal handler now just calls `await injector[Symbol.asyncDispose]()` and exits. The error-data shape on the fatal log was tightened with `instanceof Error` checks instead of `// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access` casts.

### Split the seed entry point from its library exports

`seed.ts` is now a pure module exporting `getOrCreate` and `seed`. The bootstrap (`setupStore(injector)` → `seed(injector)` → dispose) moved to `service/src/bin/seed.ts`. The `seed` script in `service/package.json` was repointed accordingly:

```jsonc
{
  "scripts": {
    "seed": "yarn node ./dist/bin/seed.js"
  }
}
```

This keeps the library importable from tests (and other tooling) without triggering the side-effectful `useJwtAuthentication` / file watcher startup at import time.

### Removed the no-op `config.spec.ts`

Replaced with real specs for the migrated modules (see the Tests section). The old placeholder used `expect(true)` without a matcher and would have passed even if `true` were replaced with `false`.

## 🧪 Tests

- Added `service/src/setup-store.spec.ts` — covers `requireJwtSecret` (env var resolution, byte-length boundary at 32, multi-byte UTF-8, dev fallback, production throw) and a smoke test that verifies `setupStore(injector)` binds every framework store token plus rebinds `HttpAuthenticationSettings` with the exported `AuthorizedUserDataSet`.
- Added `service/src/seed.spec.ts` — covers the three branches of `getOrCreate` (existing single match returns as-is; empty result inserts the supplied instance; ambiguous result logs a warning and returns the first hit).
- Added `service/src/shutdown-handler.spec.ts` — captures the registered `process.once` listeners and verifies that each signal disposes the injector exactly once, exits with the expected code, and falls back to `process.exit(1)` when disposal itself rejects.

## ⬆️ Dependencies

- Bumped `@furystack/auth-jwt` from `^3.0.0` to `^4.0.0` (functional-DI v7 release; settings, token service and refresh-token store are now DI tokens).
- Bumped `@furystack/core` from `^16.0.4` to `^17.0.0` (`StoreManager` removed in favour of `defineStore`; `Constructable` moved here from `@furystack/inject`).
- Bumped `@furystack/filesystem-store` from `^7.1.7` to `^8.0.0` (`useFileSystemStore` removed in favour of `defineFileSystemStore`).
- Bumped `@furystack/inject` from `^12.0.36` to `^13.0.0` (decorator-based DI removed; `defineService` / `createInjector` / `injector.get` / `injector.bind` is the new surface).
- Bumped `@furystack/logging` from `^8.1.5` to `^9.0.0`.
- Bumped `@furystack/repository` from `^10.1.11` to `^11.0.0` (`Repository` removed in favour of `defineDataSet`).
- Bumped `@furystack/rest-service` from `^13.0.0` to `^14.0.0` (`ServerManager` / `ApiManager` / `StaticServerManager` / `ProxyManager` removed; subsystems are tokens now).
- Bumped `@furystack/security` from `^7.0.9` to `^8.0.0` (password authenticator and hasher are tokens; `PasswordCredentialStore` / `PasswordResetTokenStore` are throw-by-default).
