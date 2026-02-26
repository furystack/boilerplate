import { createJwtClient } from '@furystack/auth-jwt/client'
import { Injectable } from '@furystack/inject'
import { createClient } from '@furystack/rest-client-fetch'
import type { BoilerplateApi } from 'common'
import { environmentOptions } from '../environment-options.js'

type JwtClient = ReturnType<typeof createJwtClient<BoilerplateApi>>
type ApiCall = ReturnType<typeof createClient<BoilerplateApi>>

const jwtClient: JwtClient = createJwtClient<BoilerplateApi>(
  { endpointUrl: environmentOptions.serviceUrl, refreshThresholdSeconds: 10 },
  '/jwt/login',
  '/jwt/refresh',
  '/jwt/logout',
)

@Injectable({ lifetime: 'singleton' })
export class BoilerplateApiClient {
  public call: ApiCall = jwtClient.call as ApiCall
  public login = jwtClient.login
  public logout = jwtClient.logout
  public setTokens = jwtClient.setTokens

  public get isAuthenticated(): boolean {
    return jwtClient.isAuthenticated
  }
}
