import { createComponent, NestedRouter, Shade } from '@furystack/shades'
import { NotyList, PageLayout } from '@furystack/shades-common-components'
import { ButtonsDemo, HelloWorld, Init, Login, Offline } from '../pages/index.js'
import { SessionService } from '../services/session.js'
import { Header } from './header.js'
import { Sidebar } from './sidebar.js'

const appRoutes = {
  '/buttons': {
    component: () => <ButtonsDemo />,
  },
  '/': {
    component: () => <HelloWorld />,
    routingOptions: { end: false },
  },
} as const

export const Layout = Shade({
  shadowDomName: 'shade-app-layout',
  render: ({ injector, useObservable }) => {
    const session = injector.getInstance(SessionService)
    const [sessionState] = useObservable('sessionState', session.state)

    return (
      <div style={{ display: 'contents' }}>
        <NotyList />
        {(() => {
          switch (sessionState) {
            case 'authenticated':
              return (
                <PageLayout
                  appBar={{
                    variant: 'permanent',
                    component: <Header />,
                  }}
                  drawer={{
                    left: {
                      variant: 'collapsible',
                      component: <Sidebar />,
                      collapseOnBreakpoint: 'md',
                    },
                  }}
                >
                  <NestedRouter routes={appRoutes} />
                </PageLayout>
              )
            case 'offline':
              return <Offline />
            case 'unauthenticated':
              return <Login />
            default:
              return <Init />
          }
        })()}
      </div>
    )
  },
})
