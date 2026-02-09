import { Shade, createComponent } from '@furystack/shades'
import {
  Alert,
  Button,
  Card,
  CardContent,
  cssVariableTheme,
  Form,
  Input,
  Typography,
} from '@furystack/shades-common-components'
import { SessionService } from '../services/session.js'

type LoginPayload = { userName: string; password: string }

export const Login = Shade({
  shadowDomName: 'shade-login',
  css: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    inset: '0',
    alignItems: 'center',
    justifyContent: 'center',
    background: cssVariableTheme.background.default,
    padding: '16px',
  },
  render: ({ injector, useObservable }) => {
    const sessionService = injector.getInstance(SessionService)
    const [isOperationInProgress] = useObservable('isOperationInProgress', sessionService.isOperationInProgress)
    const [error] = useObservable('loginError', sessionService.loginError)

    return (
      <Card elevation={2} style={{ width: '100%', maxWidth: '400px' }}>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0 8px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: cssVariableTheme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '16px',
              }}
            >
              🔐
            </div>
            <Typography variant="h4" align="center" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              Sign in to continue to FuryStack Boilerplate
            </Typography>
          </div>

          <Form<LoginPayload>
            className="login-form"
            validate={(data): data is LoginPayload => {
              return (data as LoginPayload).userName?.length > 0 && (data as LoginPayload).password?.length > 0
            }}
            onSubmit={({ userName, password }) => {
              void sessionService.login(userName, password)
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 0' }}
          >
            <Input
              labelTitle="Username"
              name="userName"
              autofocus
              required
              disabled={isOperationInProgress}
              type="text"
            />
            <Input labelTitle="Password" name="password" required disabled={isOperationInProgress} type="password" />

            {error ? <Alert severity="error">{error}</Alert> : null}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              loading={isOperationInProgress}
              disabled={isOperationInProgress}
              style={{ marginTop: '8px' }}
            >
              Sign In
            </Button>
          </Form>

          <Alert severity="info" variant="outlined" style={{ marginTop: '16px' }}>
            Use the default credentials: <strong>testuser</strong> / <strong>password</strong>
          </Alert>
        </CardContent>
      </Card>
    )
  },
})
