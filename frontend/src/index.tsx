/** Main entry point */
import { createInjector } from '@furystack/inject'
import { getLogger, useLogging, VerboseConsoleLogger } from '@furystack/logging'
import { createComponent, initializeShadeRoot } from '@furystack/shades'
import { defaultDarkTheme, ThemeProviderService } from '@furystack/shades-common-components'
import { Layout } from './components/layout.js'
import { environmentOptions } from './environment-options.js'
import { SessionService } from './services/session.js'

const shadeInjector = createInjector()

useLogging(shadeInjector, VerboseConsoleLogger)

void getLogger(shadeInjector).withScope('Startup').verbose({
  message: 'Initializing Shade Frontend...',
  data: { environmentOptions },
})

shadeInjector.get(SessionService)
shadeInjector.get(ThemeProviderService).setAssignedTheme(defaultDarkTheme)

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element with id "root" not found.')
}

initializeShadeRoot({
  injector: shadeInjector,
  rootElement,
  jsxElement: <Layout />,
})
