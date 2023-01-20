import { Shade, createComponent } from '@furystack/shades'
import { SessionService } from '../services/session'
import { Button, Input, Loader, Paper } from '@furystack/shades-common-components'

export const LoginButton = Shade({
  shadowDomName: 'shade-login-button',
  render: ({ useObservable, injector, element }) => {
    const sessionService = injector.getInstance(SessionService)
    const [isOperationInProgress] = useObservable(
      'isOperationInProgress',
      sessionService.isOperationInProgress,
      () => {
        element
          .querySelectorAll('input')
          .forEach((input) => input.setAttribute('disabled', isOperationInProgress.toString()))
      },
      true,
    )
    return (
      <Button variant="contained" className="login-button" disabled={isOperationInProgress} type="submit">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyItems: 'center',
          }}>
          Login
          {isOperationInProgress ? (
            <Loader
              style={{
                width: '20px',
                height: '20px',
              }}
            />
          ) : null}
        </div>
      </Button>
    )
  },
})

export const Login = Shade({
  shadowDomName: 'shade-login',
  render: ({ injector, useState, useObservable }) => {
    const sessionService = injector.getInstance(SessionService)

    const [userName, setUserName] = useState('userName', '')
    const [password, setPassword] = useState('password', '')

    const [isOperationInProgress] = useObservable('isOperationInProgress', sessionService.isOperationInProgress)
    const [error] = useObservable('loginError', sessionService.loginError)

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 100px',
          paddingTop: '100px',
        }}>
        <form
          className="login-form"
          onsubmit={(ev) => {
            ev.preventDefault()
            sessionService.login(userName, password)
          }}>
          <Paper elevation={3}>
            <h2>Login</h2>
            <Input
              labelTitle="User name"
              name="username"
              autofocus
              required
              disabled={isOperationInProgress}
              placeholder="The user's login name"
              value={userName}
              onTextChange={setUserName}
              type="text"
            />
            <Input
              labelTitle="Password"
              name="password"
              required
              disabled={isOperationInProgress}
              placeholder="The password for the user"
              value={password}
              type="password"
              onTextChange={setPassword}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                padding: '1em 0',
              }}>
              {error ? <div style={{ color: 'red', fontSize: '12px' }}>{error}</div> : <div />}
              <LoginButton />
            </div>
            <p style={{ fontSize: '10px' }}>You can login with the default 'testuser' / 'password' credentials</p>
          </Paper>
        </form>
      </div>
    )
  },
})
