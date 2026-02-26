import { Injector } from '@furystack/inject'
import { useLogging, VerboseConsoleLogger } from '@furystack/logging'
import { attachShutdownHandler } from './shutdown-handler.js'

export const injector = new Injector()
useLogging(injector, VerboseConsoleLogger)
void attachShutdownHandler(injector)
