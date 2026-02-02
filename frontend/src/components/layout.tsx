import { createComponent, Shade } from '@furystack/shades'
import { cssVariableTheme } from '@furystack/shades-common-components'
import { Body } from './body.js'
import { Header } from './header.js'

export const Layout = Shade({
  shadowDomName: 'shade-app-layout',
  css: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '1.6',
    overflow: 'hidden',
    padding: '0',
    margin: '0',
    backgroundColor: cssVariableTheme.background.default,
  },
  render: () => {
    return (
      <div style={{ display: 'contents' }}>
        <Header title="🧩 FuryStack Boilerplate" links={[]} />
        <Body style={{ width: '100%', height: '100%', overflow: 'auto' }} />
      </div>
    )
  },
})
