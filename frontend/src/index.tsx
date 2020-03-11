/** ToDo: Main entry point */
import { createComponent, initializeShadeRoot } from '@furystack/shades'
import { VerboseConsoleLogger } from '@furystack/logging'
import { Injector } from '@furystack/inject'
import { Layout } from './components/layout'

const shadeInjector = new Injector()

export const environmentOptions = {
  nodeEnv: process.env.NODE_ENV as 'development' | 'production',
  debug: Boolean(process.env.DEBUG),
  appVersion: process.env.APP_VERSION as string,
  buildDate: new Date(process.env.BUILD_DATE as string),
  serviceUrl: process.env.SERVICE_URL as string,
}

shadeInjector.useLogging(VerboseConsoleLogger)

shadeInjector.logger.withScope('Startup').verbose({
  message: 'Initializing Shade Frontend...',
  data: { environmentOptions },
})

const rootElement: HTMLDivElement = document.getElementById('root') as HTMLDivElement

initializeShadeRoot({
  injector: shadeInjector,
  rootElement,
  jsxElement: <Layout />,
})
