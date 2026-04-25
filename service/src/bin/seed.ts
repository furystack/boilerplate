import { injector } from '../root-injector.js'
import { seed } from '../seed.js'
import { setupStore } from '../setup-store.js'

setupStore(injector)
await seed(injector)
await injector[Symbol.asyncDispose]()
