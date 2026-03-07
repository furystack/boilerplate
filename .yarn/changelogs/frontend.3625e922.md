<!-- version-type: major -->
# frontend

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

### Migrated from `shadowDomName` to `customElementName`

All Shade components now use `customElementName` instead of `shadowDomName`, following the Shades v13 API change.

**Examples:**

```typescript
// ❌ Before
export const MyComponent = Shade({
  shadowDomName: 'my-component',
  render: () => { /* ... */ },
})

// ✅ After
export const MyComponent = Shade({
  customElementName: 'my-component',
  render: () => { /* ... */ },
})
```

**Impact:** All custom Shade components must be updated to use the new property name.

### Replaced cookie-based session auth with JWT token-based auth

`BoilerplateApiClient` no longer uses cookie-based session authentication. It now uses JWT tokens via `@furystack/auth-jwt/client` with automatic token refresh. The `call` method now wraps `AuthorizedApi` instead of `BoilerplateApi`, and login/logout are handled through the token store.

**Examples:**

```typescript
// ❌ Before
const apiClient = injector.getInstance(BoilerplateApiClient)
await apiClient.call({ method: 'POST', action: '/login', body: { username, password } })
await apiClient.call({ method: 'POST', action: '/logout' })

// ✅ After
const apiClient = injector.getInstance(BoilerplateApiClient)
await apiClient.login({ username, password })
await apiClient.logout()
// API calls automatically include JWT authorization headers
await apiClient.call({ method: 'GET', action: '/currentUser' })
```

**Impact:** All code using `BoilerplateApiClient` for authentication must switch to the new `login()`/`logout()` methods.

## ✨ Features

### Sidebar navigation with collapsible drawer

Added a `Sidebar` component with a vertical `Menu` for page navigation. The layout now uses `PageLayout` with a collapsible left drawer that auto-collapses on medium breakpoints, and `NestedRouter` for client-side routing.

### Redesigned UI pages

- **Login page** - Redesigned with `Card`, `CardContent`, `Alert`, and `Typography` components for a polished sign-in experience
- **Offline page** - Redesigned with `Alert` components for error/info states and a reload `Button`
- **Init page** - Redesigned with CSS variable theming via `cssVariableTheme`
- **Buttons demo** - Redesigned with `PageContainer` and `PageHeader` for consistent page layout
- **Hello world** - Added an authorized endpoint test section to verify JWT token refresh behavior

### `SessionService` implements `Disposable`

`SessionService` now properly disposes all `ObservableValue` instances via the `Disposable` interface, preventing memory leaks.

## ♻️ Refactoring

- Removed `Body` component; session-state routing logic moved into `Layout`
- Simplified `Header` by removing configurable props (`title`, `links`) in favor of a fixed layout with `DrawerToggleButton`
- Replaced `RouteLink` with `NestedRouteLink` and `Router` with `NestedRouter`
- Used standalone `getTextColor()` function instead of `ThemeProviderService.getTextColor()` method

## ⬆️ Dependencies

- Added `@furystack/auth-jwt` `^2.1.2` - JWT authentication client for token-based auth
- Updated `@furystack/shades` from `^11.0.33` to `^13.0.0` - Introduces `customElementName` API
- Updated `@furystack/shades-common-components` from `^10.0.33` to `^14.0.0` - New `PageLayout`, `PageContainer`, `PageHeader`, `Card`, `Alert`, `Menu`, `Typography`, and `DrawerToggleButton` components
- Updated `@furystack/core` from `^15.0.32` to `^15.2.5`
- Updated `@furystack/inject` from `^12.0.26` to `^12.0.32`
- Updated `@furystack/logging` from `^8.0.26` to `^8.1.1`
- Updated `@furystack/rest-client-fetch` from `^8.0.32` to `^8.1.2`
- Updated `@furystack/utils` from `^8.1.8` to `^8.2.1`
- Updated `@types/node` from `^25.0.10` to `^25.3.5`
