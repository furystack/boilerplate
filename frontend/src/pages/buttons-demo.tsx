import { createComponent, Shade } from '@furystack/shades'
import { Button } from '@furystack/shades-common-components'

export const ButtonsDemo = Shade<unknown, { disabled: boolean }>({
  getInitialState: () => ({ disabled: false }),
  render: ({ getState, updateState }) => {
    const { disabled } = getState()
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '5em',
          flexDirection: 'column',
        }}>
        <div>
          <div>
            <Button disabled={disabled}>Log out</Button>

            <Button disabled={disabled} color="primary">
              Log out
            </Button>
            <Button disabled={disabled} color="secondary">
              Log out
            </Button>
            <Button disabled={disabled} color="error">
              Log out
            </Button>
          </div>
          <div>
            <Button disabled={disabled} variant="outlined">
              Log out
            </Button>

            <Button disabled={disabled} variant="outlined" color="primary">
              Log out
            </Button>
            <Button disabled={disabled} variant="outlined" color="secondary">
              Log out
            </Button>
            <Button disabled={disabled} variant="outlined" color="error">
              Log out
            </Button>
          </div>
          <div>
            <Button disabled={disabled} variant="contained">
              Log out
            </Button>

            <Button disabled={disabled} variant="contained" color="primary">
              Log out
            </Button>
            <Button disabled={disabled} variant="contained" color="secondary">
              Log out
            </Button>
            <Button disabled={disabled} variant="contained" color="error">
              Log out
            </Button>
          </div>
        </div>
        <Button
          onclick={() => {
            updateState({ disabled: !getState().disabled })
          }}>
          Disable All
        </Button>
      </div>
    )
  },
})
