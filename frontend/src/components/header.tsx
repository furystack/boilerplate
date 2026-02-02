import { createComponent, RouteLink, Shade } from '@furystack/shades'
import { AppBar, Button } from '@furystack/shades-common-components'
import { environmentOptions } from '../environment-options.js'
import { SessionService } from '../services/session.js'
import { GithubLogo } from './github-logo/index.js'
import { ThemeSwitch } from './theme-switch/index.js'

export type HeaderProps = {
  title: string
  links: Array<{ name: string; url: string }>
}

export const Header = Shade<HeaderProps>({
  shadowDomName: 'shade-app-header',
  css: {
    '& a[is="route-link"]': {
      color: '#aaa',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'color 0.2s ease',
    },
    '& a[is="route-link"]:hover': {
      color: '#fff',
    },
    '& a[is="route-link"]:focus': {
      outline: '2px solid #aaa',
      outlineOffset: '2px',
    },
  },
  render: ({ props, injector, useObservable }) => {
    const [sessionState] = useObservable('sessionState', injector.getInstance(SessionService).state)

    return (
      <AppBar id="header">
        <h3 style={{ margin: '0 2em 0 0' }}>
          <RouteLink title={props.title} href="/">
            {props.title}
          </RouteLink>
        </h3>
        {props.links.map((link) => (
          <RouteLink title={link.name} href={link.url} style={{ padding: '0 8px' }}>
            {link.name || ''}
          </RouteLink>
        ))}
        <div style={{ flex: '1' }} />
        <div style={{ display: 'flex', placeContent: 'center', marginRight: '24px' }}>
          <ThemeSwitch variant="outlined" />
          <a href={environmentOptions.repository} target="_blank">
            <Button variant="outlined" style={{ verticalAlign: 'baseline' }}>
              <GithubLogo style={{ height: '25px' }} />
            </Button>
          </a>
          {sessionState === 'authenticated' ? (
            <Button variant="outlined" onclick={() => injector.getInstance(SessionService).logout()}>
              Log Out
            </Button>
          ) : null}
        </div>
      </AppBar>
    )
  },
})
