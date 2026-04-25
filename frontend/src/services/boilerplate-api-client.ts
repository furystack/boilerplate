import { createJwtClient, createJwtTokenStore } from '@furystack/auth-jwt/client'
import { defineService, type Token } from '@furystack/inject'
import { createClient } from '@furystack/rest-client-fetch'
import type { AuthorizedApi, JwtApi } from 'common'
import { environmentOptions } from '../environment-options.js'

type AuthorizedApiCall = ReturnType<typeof createClient<AuthorizedApi>>
type JwtTokenStore = ReturnType<typeof createJwtTokenStore>

/**
 * Browser-side facade over the JWT-aware REST client. Holds the shared
 * {@link createJwtTokenStore} so login/logout/refresh state is consistent
 * across every consumer.
 */
export interface BoilerplateApiClient {
  call: AuthorizedApiCall
  login: JwtTokenStore['login']
  logout: JwtTokenStore['logout']
  setTokens: JwtTokenStore['setTokens']
  readonly isAuthenticated: boolean
}

export const BoilerplateApiClient: Token<BoilerplateApiClient, 'singleton'> = defineService({
  name: 'app/BoilerplateApiClient',
  lifetime: 'singleton',
  factory: () => {
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

    return {
      call: authorizedClient.call as AuthorizedApiCall,
      login: tokenStore.login,
      logout: tokenStore.logout,
      setTokens: tokenStore.setTokens,
      get isAuthenticated() {
        return tokenStore.isAuthenticated
      },
    }
  },
})
