import { createComponent, NestedRouteLink, Shade } from '@furystack/shades'
import { AppBar, Button, DrawerToggleButton, Typography } from '@furystack/shades-common-components'
import { environmentOptions } from '../environment-options.js'
import { SessionService } from '../services/session.js'
import { GithubLogo } from './github-logo/index.js'
import { ThemeSwitch } from './theme-switch/index.js'

export const Header = Shade({
  customElementName: 'shade-app-header',
  render: ({ injector }) => {
    return (
      <AppBar>
        <DrawerToggleButton position="left" ariaLabel="Toggle navigation menu" />
        <Typography variant="h6" style={{ margin: '0 0 0 8px', whiteSpace: 'nowrap' }}>
          <NestedRouteLink href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            🧩 FuryStack Boilerplate
          </NestedRouteLink>
        </Typography>
        <div style={{ flex: '1' }} />
        <div style={{ display: 'flex', placeContent: 'center', gap: '4px' }}>
          <ThemeSwitch variant="outlined" />
          <a href={environmentOptions.repository} target="_blank" rel="noopener noreferrer">
            <Button variant="outlined" style={{ verticalAlign: 'baseline' }}>
              <GithubLogo style={{ height: '25px' }} />
            </Button>
          </a>
          <Button variant="outlined" onclick={() => injector.getInstance(SessionService).logout()}>
            Log Out
          </Button>
        </div>
      </AppBar>
    )
  },
})
