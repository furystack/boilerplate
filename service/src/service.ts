import { BoilerplateApi, User, Session } from 'common'
import { GetCurrentUser, IsAuthenticated, JsonResult, LoginAction, LogoutAction } from '@furystack/rest-service'
import '@furystack/repository'
import { injector } from './config'

injector
  .disposeOnProcessExit()
  .useHttpAuthentication({
    getUserStore: (sm) => sm.getStoreFor<User & { password: string }, 'username'>(User as any, 'username'),
    getSessionStore: (sm) => sm.getStoreFor(Session, 'sessionId'),
  })
  .useRestService<BoilerplateApi>({
    root: 'api',
    port: parseInt(process.env.APP_SERVICE_PORT as string, 10) || 9090,
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
  })
