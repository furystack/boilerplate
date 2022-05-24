/** ToDo: Main entry point */
import { createComponent, initializeShadeRoot } from '@furystack/shades'
import { useLogging, VerboseConsoleLogger } from '@furystack/logging'
import { Injector } from '@furystack/inject'
import { getLogger } from '@furystack/logging'
import { Layout } from './components/layout'

const shadeInjector = new Injector()

export const environmentOptions = {
  nodeEnv: process.env.NODE_ENV as 'development' | 'production',
  debug: Boolean(process.env.DEBUG),
  appVersion: process.env.APP_VERSION as string,
  buildDate: new Date(process.env.BUILD_DATE as string),
  serviceUrl: process.env.SERVICE_URL as string,
  repository: process.env.REPOSITORY as string,
}

useLogging(shadeInjector, VerboseConsoleLogger)

getLogger(shadeInjector).withScope('Startup').verbose({
  message: 'Initializing Shade Frontend...',
  data: { environmentOptions },
})

const rootElement: HTMLDivElement = document.getElementById('root') as HTMLDivElement

initializeShadeRoot({
  injector: shadeInjector,
  rootElement,
  jsxElement: <Layout />,
})

navigator.serviceWorker.register('/service-worker.js').then(
  () => {
    getLogger(shadeInjector).withScope('Worker').verbose({
      message: 'Service worker registered',
    })
  },
  (err) => {
    getLogger(shadeInjector)
      .withScope('Worker')
      .error({
        message: 'Service worker registration failed',
        data: { error: err },
      })
  },
)
