import { createComponent, Shade } from '@furystack/shades'
import { Button, PageContainer, PageHeader } from '@furystack/shades-common-components'

export const ButtonsDemo = Shade({
  shadowDomName: 'buttons-demo',
  render: ({ useState }) => {
    const [disabled, setDisabled] = useState('disabled', false)
    const txt = 'Button Text'
    const onclick = () => {
      /** */
    }
    return (
      <PageContainer maxWidth="900px" centered>
        <PageHeader
          icon="🔘"
          title="Buttons Demo"
          description="A showcase of the available button variants, colors, and states."
          actions={
            <Button
              variant="outlined"
              onclick={() => {
                setDisabled(!disabled)
              }}
            >
              {disabled ? 'Enable All' : 'Disable All'}
            </Button>
          }
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button onclick={onclick} disabled={disabled}>
              {txt}
            </Button>
            <Button onclick={onclick} disabled={disabled} color="primary">
              {txt}
            </Button>
            <Button onclick={onclick} disabled={disabled} color="secondary">
              {txt}
            </Button>
            <Button onclick={onclick} disabled={disabled} color="error">
              {txt}
            </Button>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button onclick={onclick} disabled={disabled} variant="outlined">
              {txt}
            </Button>
            <Button onclick={onclick} disabled={disabled} variant="outlined" color="primary">
              {txt}
            </Button>
            <Button onclick={onclick} disabled={disabled} variant="outlined" color="secondary">
              {txt}
            </Button>
            <Button onclick={onclick} disabled={disabled} variant="outlined" color="error">
              {txt}
            </Button>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button onclick={onclick} disabled={disabled} variant="contained">
              {txt}
            </Button>
            <Button onclick={onclick} disabled={disabled} variant="contained" color="primary">
              {txt}
            </Button>
            <Button onclick={onclick} disabled={disabled} variant="contained" color="secondary">
              {txt}
            </Button>
            <Button onclick={onclick} disabled={disabled} variant="contained" color="error">
              {txt}
            </Button>
          </div>
        </div>
      </PageContainer>
    )
  },
})
