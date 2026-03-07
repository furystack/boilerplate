import { createComponent, Shade } from '@furystack/shades'
import { Menu } from '@furystack/shades-common-components'

const menuItems = [
  { key: '/', label: '🏠 Home' },
  { key: '/buttons', label: '🔘 Buttons Demo' },
]

export const Sidebar = Shade({
  customElementName: 'shade-app-sidebar',
  css: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '8px 0',
  },
  render: ({ useState, useDisposable }) => {
    const [selectedKey, setSelectedKey] = useState('selectedKey', window.location.pathname)

    useDisposable('popstateListener', () => {
      const handler = () => setSelectedKey(window.location.pathname)
      window.addEventListener('popstate', handler)
      return { [Symbol.dispose]: () => window.removeEventListener('popstate', handler) }
    })

    return (
      <Menu
        items={menuItems}
        mode="vertical"
        selectedKey={selectedKey}
        onSelect={(key) => {
          setSelectedKey(key)
          history.pushState({}, '', key)
          dispatchEvent(new PopStateEvent('popstate'))
        }}
      />
    )
  },
})
