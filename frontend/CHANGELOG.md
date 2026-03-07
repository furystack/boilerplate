# Changelog

## [2.0.0] - 2026-03-07

### 💥 Breaking Changes

### Migrated from `shadowDomName` to `customElementName`

All Shade components now use `customElementName` instead of `shadowDomName`, following the Shades v13 API change.

**Examples:**

```typescript
// ❌ Before
export const MyComponent = Shade({
  shadowDomName: 'my-component',
  render: () => {
    /* ... */
  },
})

// ✅ After
export const MyComponent = Shade({
  customElementName: 'my-component',
  render: () => {
    /* ... */
  },
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

### ✨ Features

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

- Integrated JWT client-side authentication via `@furystack/auth-jwt/client` with automatic token refresh
- Added `Sidebar` component with a vertical navigation menu for routing between pages
- Added authorized endpoint test button on the HelloWorld page to exercise JWT token refresh
- Added `PageLayout` with a collapsible left drawer for responsive navigation
- Replaced `Router`/`RouteLink` with `NestedRouter`/`NestedRouteLink` for nested routing support

### ♻️ Refactoring

- Removed `Body` component; session-state routing logic moved into `Layout`
- Simplified `Header` by removing configurable props (`title`, `links`) in favor of a fixed layout with `DrawerToggleButton`
- Replaced `RouteLink` with `NestedRouteLink` and `Router` with `NestedRouter`
- Used standalone `getTextColor()` function instead of `ThemeProviderService.getTextColor()` method
- Redesigned Login page using `Card`, `CardContent`, and `Alert` components for a polished card-based layout
- Redesigned HelloWorld page using `PageContainer`, `PageHeader`, and `Typography` for consistent structure
- Redesigned ButtonsDemo page using `PageContainer` and `PageHeader` with an action button in the header
- Redesigned Init and Offline pages using `Typography`, `Alert`, and `cssVariableTheme` for consistent theming
- Simplified `Header` by removing props-based configuration in favor of hardcoded branding with `DrawerToggleButton`
- Removed `Body` component; session-based routing moved into `Layout`
- Updated `SessionService` to use JWT-based login/logout via `BoilerplateApiClient` token store
- Updated `GithubLogo` to use the standalone `getTextColor` function

### ⬆️ Dependencies

- Added `@furystack/auth-jwt` `^2.1.2` - JWT authentication client for token-based auth
- Updated `@furystack/shades` from `^11.0.33` to `^13.0.0` - Introduces `customElementName` API
- Updated `@furystack/shades-common-components` from `^10.0.33` to `^14.0.0` - New `PageLayout`, `PageContainer`, `PageHeader`, `Card`, `Alert`, `Menu`, `Typography`, and `DrawerToggleButton` components
- Updated `@furystack/core` from `^15.0.32` to `^15.2.5`
- Updated `@furystack/inject` from `^12.0.26` to `^12.0.32`
- Updated `@furystack/logging` from `^8.0.26` to `^8.1.1`
- Updated `@furystack/rest-client-fetch` from `^8.0.32` to `^8.1.2`
- Updated `@furystack/utils` from `^8.1.8` to `^8.2.1`
- Updated `@types/node` from `^25.0.10` to `^25.3.5`
- Added `@furystack/auth-jwt` ^2.0.0
- Updated `@furystack/shades` from ^11.0.33 to ^12.2.4
- Updated `@furystack/shades-common-components` from ^10.0.33 to ^13.0.1
- Updated `@furystack/core` from ^15.0.32 to ^15.2.2
- Updated `@furystack/rest-client-fetch` from ^8.0.32 to ^8.0.40
- Updated `@furystack/inject` from ^12.0.26 to ^12.0.30
- Updated `@furystack/logging` from ^8.0.26 to ^8.0.30
- Updated `@furystack/utils` from ^8.1.8 to ^8.1.10
- Updated `@types/node` from ^25.0.10 to ^25.3.1

## [1.0.3] - 2026-02-09

### ♻️ Refactoring

### Migrated from inline styles to CSS property with theme variables

Replaced inline styles with the `css` component property and migrated from `ThemeProviderService` injection to `cssVariableTheme` for theming. This approach leverages CSS variables for better performance and consistency.

**Affected components:**

- `header.tsx` - Link styling with hover and focus states
- `layout.tsx` - Root layout container styles
- `hello-world.tsx` - Page content structure and typography
- `init.tsx` - Loading state layout
- `login.tsx` - Form styling with error and helper text states
- `offline.tsx` - Link styling with accessibility-friendly focus states

### Adopted `PageLayout` with collapsible sidebar navigation

Replaced the custom layout structure with the `PageLayout` component from `@furystack/shades-common-components`. The app now uses a permanent app bar and a collapsible left drawer with a `Sidebar` navigation menu, providing a standard responsive layout.

- Moved session-based routing logic from the removed `Body` component into `Layout`
- Replaced `Router` with `NestedRouter` using an object-based route config
- Header simplified: removed props-driven nav links in favor of a `DrawerToggleButton` and `NestedRouteLink`

### Reworked page components to use common UI components

All page components now use `Typography`, `PageContainer`, `PageHeader`, `Card`, `Alert`, and other components from `@furystack/shades-common-components` instead of raw HTML elements with inline styles.

- **Login:** Redesigned with `Card`/`CardContent` layout, `Alert` for error and hint messages, button label changed from "Login" to "Sign In"
- **HelloWorld:** Adopted `PageContainer` and `PageHeader` for consistent page structure
- **ButtonsDemo:** Adopted `PageContainer` and `PageHeader`; moved the disable toggle into page header actions
- **Init:** Uses host-level `css` prop and `Typography` for the loading message
- **Offline:** Redesigned with `Alert` components for error and troubleshooting info; added a proper reload `Button`; fixed typo "set in in" → "set it in"

### ⬆️ Dependencies

- Updated `@furystack/core` from ^15.0.32 to ^15.0.34
- Updated `@furystack/inject` from ^12.0.26 to ^12.0.28
- Updated `@furystack/logging` from ^8.0.26 to ^8.0.28
- Updated `@furystack/rest-client-fetch` from ^8.0.32 to ^8.0.34
- Updated `@furystack/shades` from ^11.0.33 to ^11.1.0
- Updated `@furystack/shades-common-components` from ^10.0.33 to ^11.0.0 (major version bump with `cssVariableTheme` support)
- Updated `@furystack/utils` from ^8.1.8 to ^8.1.9
- Updated `@types/node` from ^25.0.10 to ^25.1.0
- Updated `@furystack/shades` from `11.0.33` to `12.0.0`
- Updated `@furystack/shades-common-components` from `10.0.33` to `12.0.0`
- Updated `@furystack/core` from `15.0.32` to `15.0.35`
- Updated `@furystack/inject` from `12.0.26` to `12.0.29`
- Updated `@furystack/logging` from `8.0.26` to `8.0.29`
- Updated `@furystack/rest-client-fetch` from `8.0.32` to `8.0.35`
- Updated `@furystack/utils` from `8.1.8` to `8.1.9`
- Updated `@types/node` from `25.0.10` to `25.2.2`
