import { injector } from './root-injector.js'
import { setupStore } from './setup-store.js'
import { setupRestApi } from './setup-rest-api.js'

setupStore(injector)

setupRestApi(injector).catch((err) => {
  console.error(err)
  process.exit(1)
})
