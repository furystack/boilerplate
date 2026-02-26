<!-- version-type: patch -->
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

## ✨ Features

- Integrated JWT client-side authentication via `@furystack/auth-jwt/client` with automatic token refresh
- Added `Sidebar` component with a vertical navigation menu for routing between pages
- Added authorized endpoint test button on the HelloWorld page to exercise JWT token refresh
- Added `PageLayout` with a collapsible left drawer for responsive navigation
- Replaced `Router`/`RouteLink` with `NestedRouter`/`NestedRouteLink` for nested routing support

## ♻️ Refactoring

- Redesigned Login page using `Card`, `CardContent`, and `Alert` components for a polished card-based layout
- Redesigned HelloWorld page using `PageContainer`, `PageHeader`, and `Typography` for consistent structure
- Redesigned ButtonsDemo page using `PageContainer` and `PageHeader` with an action button in the header
- Redesigned Init and Offline pages using `Typography`, `Alert`, and `cssVariableTheme` for consistent theming
- Simplified `Header` by removing props-based configuration in favor of hardcoded branding with `DrawerToggleButton`
- Removed `Body` component; session-based routing moved into `Layout`
- Updated `SessionService` to use JWT-based login/logout via `BoilerplateApiClient` token store
- Updated `GithubLogo` to use the standalone `getTextColor` function

## ⬆️ Dependencies

- Added `@furystack/auth-jwt` ^2.0.0
- Updated `@furystack/shades` from ^11.0.33 to ^12.2.4
- Updated `@furystack/shades-common-components` from ^10.0.33 to ^13.0.1
- Updated `@furystack/core` from ^15.0.32 to ^15.2.2
- Updated `@furystack/rest-client-fetch` from ^8.0.32 to ^8.0.40
- Updated `@furystack/inject` from ^12.0.26 to ^12.0.30
- Updated `@furystack/logging` from ^8.0.26 to ^8.0.30
- Updated `@furystack/utils` from ^8.1.8 to ^8.1.10
- Updated `@types/node` from ^25.0.10 to ^25.3.1
