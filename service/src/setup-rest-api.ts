import { createJwtLoginAction, JwtLogoutAction, JwtRefreshAction } from '@furystack/auth-jwt'
import type { Injector } from '@furystack/inject'
import {
  Authenticate,
  GetCurrentUser,
  IsAuthenticated,
  JsonResult,
  LoginAction,
  LogoutAction,
  Validate,
  useRestService,
  useStaticFiles,
} from '@furystack/rest-service'
import type { BoilerplateApi } from 'common'
import BoilerplateApiSchemas from 'common/schemas/boilerplate-api.json' with { type: 'json' }
import { getCorsOptions } from './get-cors-options.js'
import { getPort } from './get-port.js'

export const setupRestApi = async (injector: Injector): Promise<void> => {
  const port = getPort()

  await useRestService<BoilerplateApi>({
    injector,
    root: 'api',
    port,
    name: 'Boilerplate Service',
    version: '1.0.0',
    description: 'API for Furystack Boilerplate Application containing simple authentication and example endpoints',
    cors: getCorsOptions(),
    api: {
      GET: {
        '/currentUser': GetCurrentUser,
        '/isAuthenticated': IsAuthenticated,
        '/testQuery': Validate({ schema: BoilerplateApiSchemas, schemaName: 'TestQueryEndpoint' })(async (options) =>
          JsonResult({ param1Value: options.getQuery().param1 }),
        ),
        '/testUrlParams/:urlParam': Validate({ schema: BoilerplateApiSchemas, schemaName: 'TestUrlParamsEndpoint' })(
          async (options) => JsonResult({ urlParamValue: options.getUrlParams().urlParam }),
        ),
        '/testAuthorized': Authenticate()(async () =>
          JsonResult({ message: 'Hello from authorized endpoint!', timestamp: new Date().toISOString() }),
        ),
      },
      POST: {
        '/login': LoginAction,
        '/logout': LogoutAction,
        '/jwt/login': createJwtLoginAction(injector),
        '/jwt/refresh': JwtRefreshAction,
        '/jwt/logout': JwtLogoutAction,
        '/testPostBody': Validate({ schema: BoilerplateApiSchemas, schemaName: 'TestPostBodyEndpoint' })(
          async (options) => {
            const body = await options.getBody()
            return JsonResult({ bodyValue: body.value })
          },
        ),
      },
    },
  })

  await useStaticFiles({
    injector,
    baseUrl: '/',
    path: '../frontend/dist',
    port,
    fallback: 'index.html',
  })
}
