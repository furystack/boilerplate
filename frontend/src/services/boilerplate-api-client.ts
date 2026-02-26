import { createJwtClient, createJwtTokenStore } from '@furystack/auth-jwt/client'
import { Injectable } from '@furystack/inject'
import { createClient } from '@furystack/rest-client-fetch'
import type { AuthorizedApi, JwtApi } from 'common'
import { environmentOptions } from '../environment-options.js'

type AuthorizedApiCall = ReturnType<typeof createClient<AuthorizedApi>>

const jwtApiClient = createClient<JwtApi>({
  endpointUrl: environmentOptions.serviceUrl,
  requestInit: { credentials: 'include' },
})

const tokenStore = createJwtTokenStore({
  refreshThresholdSeconds: 10,
  login: async (credentials) => {
    const { result } = await jwtApiClient({ method: 'POST', action: '/jwt/login', body: credentials })
    return result
  },
  refresh: async (refreshToken) => {
    const { result } = await jwtApiClient({ method: 'POST', action: '/jwt/refresh', body: { refreshToken } })
    return result
  },
  logout: async (refreshToken) => {
    await jwtApiClient({ method: 'POST', action: '/jwt/logout', body: { refreshToken } })
  },
})

const authorizedClient = createJwtClient<AuthorizedApi>({
  endpointUrl: environmentOptions.serviceUrl,
  tokenStore,
})

@Injectable({ lifetime: 'singleton' })
export class BoilerplateApiClient {
  public call: AuthorizedApiCall = authorizedClient.call as AuthorizedApiCall
  public login = tokenStore.login
  public logout = tokenStore.logout
  public setTokens = tokenStore.setTokens

  public get isAuthenticated(): boolean {
    return tokenStore.isAuthenticated
  }
}
