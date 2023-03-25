import type { BoilerplateApi } from 'common'
import { User } from 'common'
import {
  DefaultSession,
  GetCurrentUser,
  IsAuthenticated,
  JsonResult,
  LoginAction,
  LogoutAction,
  useHttpAuthentication,
  useRestService,
  useStaticFiles,
} from '@furystack/rest-service'
import '@furystack/repository'
import { injector } from './config'
import { attachShutdownHandler } from './shutdown-handler'

const port = parseInt(process.env.APP_SERVICE_PORT as string, 10) || 9090

useHttpAuthentication(injector, {
  getUserStore: (sm) => sm.getStoreFor<User & { password: string }, 'username'>(User as any, 'username'),
  getSessionStore: (sm) => sm.getStoreFor(DefaultSession, 'sessionId'),
})
useRestService<BoilerplateApi>({
  injector,
  root: 'api',
  port,
  cors: {
    credentials: true,
    origins: ['http://localhost:8080'],
    headers: ['cache', 'content-type'],
  },
  api: {
    GET: {
      '/currentUser': GetCurrentUser,
      '/isAuthenticated': IsAuthenticated,
      '/testQuery': async (options) => JsonResult({ param1Value: options.getQuery().param1 }),
      '/testUrlParams/:urlParam': async (options) => JsonResult({ urlParamValue: options.getUrlParams().urlParam }),
    },
    POST: {
      '/login': LoginAction,
      '/logout': LogoutAction,
      '/testPostBody': async (options) => {
        const body = await options.getBody()
        return JsonResult({ bodyValue: body.value })
      },
    },
  },
}).catch((err) => {
  console.error(err)
  process.exit(1)
})

useStaticFiles({
  injector,
  baseUrl: '/',
  path: '../frontend/bundle',
  port,
  fallback: 'index.html',
})

attachShutdownHandler(injector)
