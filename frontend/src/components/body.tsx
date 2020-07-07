import { createComponent, Shade } from '@furystack/shades'
import { User } from 'common'
import { SessionService, sessionState } from '../services/session'
import { Init, HelloWorld, Offline, Login } from '../pages'

export const Body = Shade<{}, { sessionState: sessionState; currentUser: User | null }>({
  shadowDomName: 'shade-app-body',
  getInitialState: () => ({
    sessionState: 'initial' as sessionState,
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
      <div
        id="Body"
        style={{
          margin: '10px',
          padding: '10px',
          position: 'fixed',
          top: '40px',
          width: 'calc(100% - 40px)',
          height: 'calc(100% - 80px)',
          overflow: 'hidden',
        }}>
        {(() => {
          switch (getState().sessionState) {
            case 'authenticated':
              return <HelloWorld />
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
