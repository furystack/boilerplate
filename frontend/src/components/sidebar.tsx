import { createComponent, NestedRouteLink, Shade } from '@furystack/shades'
import { cssVariableTheme } from '@furystack/shades-common-components'

export const Sidebar = Shade({
  shadowDomName: 'shade-app-sidebar',
  css: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '8px 0',

    '& a': {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 16px',
      color: cssVariableTheme.text.secondary,
      textDecoration: 'none',
      transition: `background-color 0.15s ease, color 0.15s ease`,
      fontSize: '14px',
      borderRadius: '0',
    },
    '& a:hover': {
      backgroundColor: cssVariableTheme.action.hoverBackground,
      color: cssVariableTheme.text.primary,
    },
  },
  render: () => {
    return (
      <nav>
        <NestedRouteLink href="/" style={{ padding: '10px 16px' }}>
          🏠 Home
        </NestedRouteLink>
        <NestedRouteLink href="/buttons" style={{ padding: '10px 16px' }}>
          🔘 Buttons Demo
        </NestedRouteLink>
      </nav>
    )
  },
})
