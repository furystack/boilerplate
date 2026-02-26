import { injector } from './root-injector.js'
import { attachShutdownHandler } from './shutdown-handler.js'
import { setupStore } from './setup-store.js'
import { setupRestApi } from './setup-rest-api.js'

void attachShutdownHandler(injector)
setupStore(injector)

setupRestApi(injector).catch((err) => {
  console.error(err)
  process.exit(1)
})
