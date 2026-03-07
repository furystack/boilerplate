import { createComponent, LocationService, Shade } from '@furystack/shades'
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
  render: ({ injector, useObservable }) => {
    const locationService = injector.getInstance(LocationService)
    const [currentPath] = useObservable('currentPath', locationService.onLocationPathChanged)

    return (
      <Menu
        items={menuItems}
        mode="vertical"
        selectedKey={currentPath}
        onSelect={(key) => {
          locationService.navigate(key)
        }}
      />
    )
  },
})
