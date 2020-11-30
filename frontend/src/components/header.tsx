import { createComponent, RouteLink, Shade } from '@furystack/shades'
import { AppBar, Button } from '@furystack/shades-common-components'
import { SessionService, sessionState } from '../services/session'

export interface HeaderProps {
  title: string
  links: Array<{ name: string; url: string }>
}

const urlStyle: Partial<CSSStyleDeclaration> = {
  color: '#aaa',
  textDecoration: 'none',
}

export const Header = Shade<HeaderProps, { sessionState: sessionState }>({
  shadowDomName: 'shade-app-header',
  getInitialState: ({ injector }) => ({
    sessionState: injector.getInstance(SessionService).state.getValue(),
  }),
  constructed: ({ injector, updateState }) => {
    const observable = injector.getInstance(SessionService).state.subscribe((newState) => {
      updateState({ sessionState: newState })
    })
    return () => observable.dispose()
  },
  render: ({ props, injector, getState }) => {
    return (
      <AppBar id="header">
        <h3 style={{ margin: '0 2em 0 0', cursor: 'pointer' }}>
          <RouteLink title={props.title} href="/" style={urlStyle}>
            {props.title}
          </RouteLink>
        </h3>
        {props.links.map((link) => (
          <RouteLink title={link.name} href={link.url} style={{ ...urlStyle, padding: '0 8px', cursor: 'pointer' }}>
            {link.name || ''}
          </RouteLink>
        ))}
        <div style={{ flex: '1' }} />
        {getState().sessionState === 'authenticated' ? (
          <Button
            variant="outlined"
            onclick={() => injector.getInstance(SessionService).logout()}
            style={{ marginRight: '1em' }}>
            Log Out
          </Button>
        ) : null}
      </AppBar>
    )
  },
})
