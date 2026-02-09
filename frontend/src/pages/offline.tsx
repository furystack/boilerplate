import { Shade, createComponent } from '@furystack/shades'
import { Alert, Button, cssVariableTheme, Typography } from '@furystack/shades-common-components'
import { environmentOptions } from '../environment-options.js'

export const Offline = Shade({
  shadowDomName: 'shade-offline',
  css: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    background: cssVariableTheme.background.default,
    padding: '16px',

    '& a': {
      color: cssVariableTheme.palette.primary.main,
      textDecoration: 'none',
      transition: 'color 0.2s ease',
    },
    '& a:hover': {
      color: cssVariableTheme.palette.primary.light,
      textDecoration: 'underline',
    },
  },
  render: () => {
    return (
      <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography variant="h3" align="center">
          WhoOoOops... 😱
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary">
          The service seems to be offline 😓
        </Typography>

        <Alert severity="error" variant="outlined">
          There was a trouble connecting to the backend service at{' '}
          <a href={environmentOptions.serviceUrl} target="_blank">
            {environmentOptions.serviceUrl}
          </a>
          . It seems to be the service is unaccessible at the moment.
        </Alert>

        <Alert severity="info" variant="outlined" title="Troubleshooting">
          <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
            <li>
              The URL above is correct. You can set it in your 'SERVICE_URL' environment variable before building the
              app.
            </li>
            <li>
              CORS is enabled in the service from <a href={window.location.origin}>{window.location.origin}</a>
            </li>
            <li>You have started the service :)</li>
          </ul>
        </Alert>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onclick={() => window.location.reload()}>
            Reload page
          </Button>
        </div>
      </div>
    )
  },
})
