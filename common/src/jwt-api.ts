import type { RestApi } from '@furystack/rest'

export interface JwtApi extends RestApi {
  POST: {
    '/jwt/login': {
      body: { username: string; password: string }
      result: { accessToken: string; refreshToken: string }
    }
    '/jwt/refresh': { body: { refreshToken: string }; result: { accessToken: string; refreshToken: string } }
    '/jwt/logout': { body: { refreshToken: string }; result: unknown }
  }
}
