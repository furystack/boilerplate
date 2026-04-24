import { createJwtLoginAction, JwtLogoutAction, JwtRefreshAction } from '@furystack/auth-jwt'
import type { Injector } from '@furystack/inject'
import {
  Authenticate,
  createCookieLoginStrategy,
  createPasswordLoginAction,
  GetCurrentUser,
  IsAuthenticated,
  JsonResult,
  LogoutAction,
  useRestService,
  useStaticFiles,
  Validate,
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
        // eslint-disable-next-line furystack/rest-action-validate-wrapper -- Built-in framework action, no user-provided parameters to validate
        '/currentUser': GetCurrentUser,
        // eslint-disable-next-line furystack/rest-action-validate-wrapper -- Built-in framework action, no user-provided parameters to validate
        '/isAuthenticated': IsAuthenticated,
        '/testQuery': Validate({ schema: BoilerplateApiSchemas, schemaName: 'TestQueryEndpoint' })(async (options) =>
          JsonResult({ param1Value: options.getQuery().param1 }),
        ),
        '/testUrlParams/:urlParam': Validate({ schema: BoilerplateApiSchemas, schemaName: 'TestUrlParamsEndpoint' })(
          async (options) => JsonResult({ urlParamValue: options.getUrlParams().urlParam }),
        ),
        // eslint-disable-next-line furystack/rest-action-validate-wrapper -- No request parameters to validate; authorization is handled by Authenticate()
        '/testAuthorized': Authenticate()(async () =>
          JsonResult({ message: 'Hello from authorized endpoint!', timestamp: new Date().toISOString() }),
        ),
      },
      POST: {
        // eslint-disable-next-line furystack/rest-action-validate-wrapper -- Built-in framework action that handles its own input validation internally
        '/login': createPasswordLoginAction(createCookieLoginStrategy(injector)),
        // eslint-disable-next-line furystack/rest-action-validate-wrapper -- Built-in framework action, no user-provided parameters to validate
        '/logout': LogoutAction,
        // eslint-disable-next-line furystack/rest-action-validate-wrapper -- Built-in framework action that handles its own input validation internally
        '/jwt/login': createJwtLoginAction(injector),
        // eslint-disable-next-line furystack/rest-action-validate-wrapper -- Built-in framework action, token is read from headers/cookies by the framework
        '/jwt/refresh': JwtRefreshAction,
        // eslint-disable-next-line furystack/rest-action-validate-wrapper -- Built-in framework action, no user-provided parameters to validate
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
