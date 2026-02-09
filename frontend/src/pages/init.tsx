import { Shade, createComponent } from '@furystack/shades'
import { cssVariableTheme, Loader, Typography } from '@furystack/shades-common-components'

export const Init = Shade({
  shadowDomName: 'shade-init',
  css: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    background: cssVariableTheme.background.default,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      <Loader
        style={{
          width: '128px',
          height: '128px',
        }}
      />
      <Typography variant="h5" color="textSecondary">
        Initializing app...
      </Typography>
    </div>
  ),
})
