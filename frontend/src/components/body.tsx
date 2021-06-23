import { createComponent, Shade, Router } from '@furystack/shades'
import { User } from 'common'
import { SessionService, SessionState } from '../services/session'
import { ButtonsDemo, Init, HelloWorld, Offline, Login } from '../pages'

export const Body = Shade<
  { style?: Partial<CSSStyleDeclaration> },
  { sessionState: SessionState; currentUser: User | null }
>({
  shadowDomName: 'shade-app-body',
  getInitialState: () => ({
    sessionState: 'initializing',
    currentUser: null as User | null,
  }),
  constructed: async ({ injector, updateState }) => {
    const session = injector.getInstance(SessionService)
    const observables = [
      session.state.subscribe((newState) =>
        updateState({
          sessionState: newState,
        }),
      ),
      session.currentUser.subscribe((usr) => updateState({ currentUser: usr })),
    ]
    return () => observables.forEach((o) => o.dispose())
  },
  render: ({ getState }) => {
    return (
      <div id="Body">
        {(() => {
          switch (getState().sessionState) {
            case 'authenticated':
              return (
                <Router
                  routes={[
                    { url: '/buttons', routingOptions: { end: false }, component: () => <ButtonsDemo /> },
                    { url: '/', routingOptions: { end: false }, component: () => <HelloWorld /> },
                  ]}></Router>
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
