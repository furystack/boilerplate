import { createInjector } from '@furystack/inject'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BoilerplateApiClient } from './boilerplate-api-client.js'

const respondWithJson = (body: unknown, init: ResponseInit = {}): Response =>
  new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
    ...init,
  })

describe('BoilerplateApiClient', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('resolves to a singleton with the expected surface', async () => {
    const injector = createInjector()

    const client = injector.get(BoilerplateApiClient)

    expect(typeof client.call).toBe('function')
    expect(typeof client.login).toBe('function')
    expect(typeof client.logout).toBe('function')
    expect(typeof client.setTokens).toBe('function')
    expect(client.isAuthenticated).toBe(false)

    expect(injector.get(BoilerplateApiClient)).toBe(client)

    await injector[Symbol.asyncDispose]()
  })

  it('login forwards credentials to the JWT login endpoint and stores the resulting tokens', async () => {
    const accessToken = createFakeJwt({ exp: Math.floor(Date.now() / 1000) + 600 })
    const refreshToken = createFakeJwt({ exp: Math.floor(Date.now() / 1000) + 7200 })
    fetchMock.mockResolvedValueOnce(respondWithJson({ accessToken, refreshToken }))

    const injector = createInjector()
    const client = injector.get(BoilerplateApiClient)

    await client.login({ username: 'alice', password: 'secret' })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/jwt/login')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body as string)).toEqual({ username: 'alice', password: 'secret' })
    expect(client.isAuthenticated).toBe(true)

    await injector[Symbol.asyncDispose]()
  })

  it('setTokens activates the authenticated state without calling the network', async () => {
    const injector = createInjector()
    const client = injector.get(BoilerplateApiClient)

    client.setTokens({
      accessToken: createFakeJwt({ exp: Math.floor(Date.now() / 1000) + 600 }),
      refreshToken: createFakeJwt({ exp: Math.floor(Date.now() / 1000) + 7200 }),
    })

    expect(client.isAuthenticated).toBe(true)
    expect(fetchMock).not.toHaveBeenCalled()

    await injector[Symbol.asyncDispose]()
  })
})

const createFakeJwt = (payload: Record<string, unknown>): string => {
  const encode = (value: object): string =>
    btoa(JSON.stringify(value)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.signature`
}
