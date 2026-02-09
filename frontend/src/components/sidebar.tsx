import { createComponent, Shade } from '@furystack/shades'
import { Menu } from '@furystack/shades-common-components'

const menuItems = [
  { key: '/', label: '🏠 Home' },
  { key: '/buttons', label: '🔘 Buttons Demo' },
]

export const Sidebar = Shade({
  shadowDomName: 'shade-app-sidebar',
  css: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '8px 0',
  },
  render: ({ useState }) => {
    const [selectedKey, setSelectedKey] = useState('selectedKey', window.location.pathname)

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
