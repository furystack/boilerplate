<!-- version-type: patch -->
# frontend

## ♻️ Refactoring

### Migrated from inline styles to CSS property with theme variables

Replaced inline styles with the `css` component property and migrated from `ThemeProviderService` injection to `cssVariableTheme` for theming. This approach leverages CSS variables for better performance and consistency.

**Affected components:**
- `header.tsx` - Link styling with hover and focus states
- `layout.tsx` - Root layout container styles
- `hello-world.tsx` - Page content structure and typography
- `init.tsx` - Loading state layout
- `login.tsx` - Form styling with error and helper text states
- `offline.tsx` - Link styling with accessibility-friendly focus states

## ⬆️ Dependencies

- Updated `@furystack/core` from ^15.0.32 to ^15.0.34
- Updated `@furystack/inject` from ^12.0.26 to ^12.0.28
- Updated `@furystack/logging` from ^8.0.26 to ^8.0.28
- Updated `@furystack/rest-client-fetch` from ^8.0.32 to ^8.0.34
- Updated `@furystack/shades` from ^11.0.33 to ^11.1.0
- Updated `@furystack/shades-common-components` from ^10.0.33 to ^11.0.0 (major version bump with `cssVariableTheme` support)
- Updated `@furystack/utils` from ^8.1.8 to ^8.1.9
- Updated `@types/node` from ^25.0.10 to ^25.1.0
