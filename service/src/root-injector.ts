import { createInjector } from '@furystack/inject'
import { useLogging, VerboseConsoleLogger } from '@furystack/logging'

export const injector = createInjector()
useLogging(injector, VerboseConsoleLogger)
