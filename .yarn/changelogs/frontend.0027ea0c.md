<!-- version-type: patch -->
# frontend

## ♻️ Refactoring

### Migrated `SessionService` and `BoilerplateApiClient` to functional DI

`@furystack/inject` v13 dropped decorator-based DI. Both browser-side singletons were rewritten as `defineService` tokens:

- `BoilerplateApiClient` now builds the JWT token store, JWT REST client and authorized REST client inside its `factory`, and exposes them through a typed object literal (with a getter that proxies `tokenStore.isAuthenticated`). The previous `@Injectable` class plus the module-scope `tokenStore` / `authorizedClient` constants are gone.
- `SessionService` now exposes its surface as an `interface SessionService extends IdentityContext { … }` plus a matching `defineService` token. The factory wires `BoilerplateApiClient` and `NotyService` via `inject(...)`, registers the `ObservableValue` disposals through `onDispose`, and kicks off `void init()` so the bootstrap fetch runs without an explicit consumer call (the previous `init()` method was unreachable from production code).

```ts
// before
@Injectable({ lifetime: 'singleton' })
export class SessionService implements IdentityContext, Disposable {
  @Injected(BoilerplateApiClient)
  declare private api: BoilerplateApiClient
  // …
}
shadeInjector.getInstance(SessionService)

// after
export const SessionService: Token<SessionService, 'singleton'> = defineService({
  name: 'app/SessionService',
  lifetime: 'singleton',
  factory: ({ inject, onDispose }) => {
    const api = inject(BoilerplateApiClient)
    // …
    void init()
    return { state, currentUser, isOperationInProgress, loginError, init, login, logout, isAuthenticated, isAuthorized, getCurrentUser }
  },
})
shadeInjector.get(SessionService)
```

### Updated every Shade component to resolve services via `injector.get`

`Layout`, `Header`, `Sidebar`, `ThemeSwitch`, `GithubLogo`, the login page and the hello-world page swapped `injector.getInstance(X)` for `injector.get(X)` to match the new injector surface.

### Bootstrap hardening in `index.tsx`

- `new Injector()` → `createInjector()`.
- `document.getElementById('root')` is now null-checked with a clear error instead of silently casting through `as HTMLDivElement`.
- The throw-by-default `SessionService` resolution still triggers the eager `init()` so the app reaches the `Layout` switch with a real auth state on first paint.

### Cleaned up `frontend/tsconfig.json`

Now extends the workspace root `tsconfig.json` and only overrides the frontend-specific bits (`outDir`, `composite`, `declaration`, `declarationMap`, `jsx`, `jsxFactory`, `jsxFragmentFactory`, `lib`, `pretty`, `types: []`). Removed every option that already lived in the root tsconfig.

## 🧪 Tests

- Added `frontend/src/services/session.spec.ts` — covers the auto-init paths (`unauthenticated` / `authenticated` / `offline`), `login` success + failure (state + noty assertions), `logout`, and `isAuthorized` role matching, all driven by `injector.bind(BoilerplateApiClient, …)` / `injector.bind(NotyService, …)` mocks.
- Added `frontend/src/services/boilerplate-api-client.spec.ts` — verifies the token resolves to a singleton with the expected surface, that `login` POSTs to `/jwt/login` and flips `isAuthenticated` (using a synthesized JWT with a future `exp`), and that `setTokens` activates the authenticated state without touching `fetch`.

## ⬆️ Dependencies

- Bumped `@furystack/auth-jwt` from `^3.0.0` to `^4.0.0` (functional-DI v7 release; client-side `createJwtTokenStore` / `createJwtClient` shapes unchanged).
- Bumped `@furystack/core` from `^16.0.4` to `^17.0.0` (`IdentityContext` is now an interface; satisfied by `SessionService`'s returned object).
- Bumped `@furystack/inject` from `^12.0.36` to `^13.0.0`.
- Bumped `@furystack/logging` from `^8.1.5` to `^9.0.0`.
- Bumped `@furystack/rest-client-fetch` from `^8.1.8` to `^9.0.0`.
- Bumped `@furystack/shades` from `^14.0.0` to `^15.0.0` (services declassed to plain-object factories behind tokens; `LocationService` is resolved by token).
- Bumped `@furystack/shades-common-components` from `^16.0.0` to `^17.0.0` (`ThemeProviderService` / `NotyService` now tokens; `LayoutService` is scoped to `<PageLayout>`).
- Bumped `@furystack/utils` from `^8.2.5` to `^9.0.0`.
