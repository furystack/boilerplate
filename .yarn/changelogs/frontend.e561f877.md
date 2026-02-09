<!-- version-type: patch -->
# frontend

## ♻️ Refactoring

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

## ⬆️ Dependencies

- Updated `@furystack/shades` from `11.0.33` to `12.0.0`
- Updated `@furystack/shades-common-components` from `10.0.33` to `12.0.0`
- Updated `@furystack/core` from `15.0.32` to `15.0.35`
- Updated `@furystack/inject` from `12.0.26` to `12.0.29`
- Updated `@furystack/logging` from `8.0.26` to `8.0.29`
- Updated `@furystack/rest-client-fetch` from `8.0.32` to `8.0.35`
- Updated `@furystack/utils` from `8.1.8` to `8.1.9`
- Updated `@types/node` from `25.0.10` to `25.2.2`
