import { createComponent, Shade } from '@furystack/shades'
import { Paper } from '@furystack/shades-common-components'
import { Body } from './body'
import { Header } from './header'

export const Layout = Shade({
  shadowDomName: 'shade-app-layout',
  render: () => {
    return (
      <Paper
        id="Layout"
        style={{
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
        }}
        className="eee">
        <Header title="🧩 FuryStack Boilerplate" links={[]} />
        <Body style={{ width: '100%', height: '100%', overflow: 'auto' }} />
      </Paper>
    )
  },
})
