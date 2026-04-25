import { createInjector, type Injector } from '@furystack/inject'
import { NotyService } from '@furystack/shades-common-components'
import type { User } from 'common'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BoilerplateApiClient } from './boilerplate-api-client.js'
import { SessionService } from './session.js'

type MockApiClient = {
  call: ReturnType<typeof vi.fn>
  login: ReturnType<typeof vi.fn>
  logout: ReturnType<typeof vi.fn>
  setTokens: ReturnType<typeof vi.fn>
  isAuthenticated: boolean
}

const createMockApiClient = (overrides: Partial<MockApiClient> = {}): MockApiClient => ({
  call: vi.fn(),
  login: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockResolvedValue(undefined),
  setTokens: vi.fn(),
  isAuthenticated: false,
  ...overrides,
})

const createMockNotyService = () => {
  const emit = vi.fn()
  return { service: { emit } as unknown as NotyService, emit }
}

const flushMicrotasks = async (): Promise<void> => {
  for (let i = 0; i < 10; i++) {
    await Promise.resolve()
  }
}

const setupInjector = (api: MockApiClient, noty: NotyService): Injector => {
  const injector = createInjector()
  injector.bind(BoilerplateApiClient, () => api as unknown as BoilerplateApiClient)
  injector.bind(NotyService, () => noty)
  return injector
}

describe('SessionService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('init (auto-invoked from factory)', () => {
    it('moves to "unauthenticated" when the api reports no active session', async () => {
      const api = createMockApiClient({ isAuthenticated: false })
      const { service: notys } = createMockNotyService()
      const injector = setupInjector(api, notys)

      const session = injector.get(SessionService)
      await flushMicrotasks()

      expect(session.state.getValue()).toBe('unauthenticated')
      expect(session.currentUser.getValue()).toBeNull()
      expect(api.call).not.toHaveBeenCalled()

      await injector[Symbol.asyncDispose]()
    })

    it('fetches the current user and moves to "authenticated" when the api has a session', async () => {
      const user: User = { username: 'alice', roles: ['admin'] }
      const api = createMockApiClient({
        isAuthenticated: true,
        call: vi.fn().mockResolvedValue({ result: user }),
      })
      const { service: notys } = createMockNotyService()
      const injector = setupInjector(api, notys)

      const session = injector.get(SessionService)
      await flushMicrotasks()

      expect(session.state.getValue()).toBe('authenticated')
      expect(session.currentUser.getValue()).toEqual(user)
      expect(api.call).toHaveBeenCalledWith({ method: 'GET', action: '/currentUser' })

      await injector[Symbol.asyncDispose]()
    })

    it('moves to "offline" when the current-user fetch fails', async () => {
      const api = createMockApiClient({
        isAuthenticated: true,
        call: vi.fn().mockRejectedValue(new Error('network down')),
      })
      const { service: notys } = createMockNotyService()
      const injector = setupInjector(api, notys)

      const session = injector.get(SessionService)
      await flushMicrotasks()

      expect(session.state.getValue()).toBe('offline')

      await injector[Symbol.asyncDispose]()
    })
  })

  describe('login', () => {
    it('moves to "authenticated" and fires a success noty on a successful login', async () => {
      const user: User = { username: 'alice', roles: [] }
      const api = createMockApiClient({
        isAuthenticated: false,
        call: vi.fn().mockResolvedValue({ result: user }),
      })
      const { service: notys, emit } = createMockNotyService()
      const injector = setupInjector(api, notys)

      const session = injector.get(SessionService)
      await flushMicrotasks()

      await session.login('alice', 'pw')

      expect(api.login).toHaveBeenCalledWith({ username: 'alice', password: 'pw' })
      expect(session.state.getValue()).toBe('authenticated')
      expect(session.currentUser.getValue()).toEqual(user)
      expect(emit).toHaveBeenCalledWith('onNotyAdded', expect.objectContaining({ type: 'success' }))

      await injector[Symbol.asyncDispose]()
    })

    it('records the error message and fires a warning noty on a failed login', async () => {
      const api = createMockApiClient({
        login: vi.fn().mockRejectedValue(new Error('bad credentials')),
      })
      const { service: notys, emit } = createMockNotyService()
      const injector = setupInjector(api, notys)

      const session = injector.get(SessionService)
      await flushMicrotasks()

      await session.login('alice', 'wrong')

      expect(session.loginError.getValue()).toBe('bad credentials')
      expect(session.state.getValue()).not.toBe('authenticated')
      expect(emit).toHaveBeenCalledWith('onNotyAdded', expect.objectContaining({ type: 'warning' }))

      await injector[Symbol.asyncDispose]()
    })
  })

  describe('logout', () => {
    it('clears the user, moves to "unauthenticated" and fires an info noty', async () => {
      const user: User = { username: 'alice', roles: [] }
      const api = createMockApiClient({
        isAuthenticated: true,
        call: vi.fn().mockResolvedValue({ result: user }),
      })
      const { service: notys, emit } = createMockNotyService()
      const injector = setupInjector(api, notys)

      const session = injector.get(SessionService)
      await flushMicrotasks()
      expect(session.state.getValue()).toBe('authenticated')

      await session.logout()

      expect(api.logout).toHaveBeenCalledTimes(1)
      expect(session.currentUser.getValue()).toBeNull()
      expect(session.state.getValue()).toBe('unauthenticated')
      expect(emit).toHaveBeenCalledWith('onNotyAdded', expect.objectContaining({ type: 'info' }))

      await injector[Symbol.asyncDispose]()
    })
  })

  describe('isAuthorized', () => {
    it('returns true when the current user has every requested role', async () => {
      const api = createMockApiClient({
        isAuthenticated: true,
        call: vi.fn().mockResolvedValue({ result: { username: 'a', roles: ['admin', 'editor'] } satisfies User }),
      })
      const { service: notys } = createMockNotyService()
      const injector = setupInjector(api, notys)

      const session = injector.get(SessionService)
      await flushMicrotasks()

      expect(await session.isAuthorized('admin')).toBe(true)
      expect(await session.isAuthorized('admin', 'editor')).toBe(true)
      expect(await session.isAuthorized('admin', 'owner')).toBe(false)

      await injector[Symbol.asyncDispose]()
    })

    it('returns false when no user is signed in', async () => {
      const api = createMockApiClient({ isAuthenticated: false })
      const { service: notys } = createMockNotyService()
      const injector = setupInjector(api, notys)

      const session = injector.get(SessionService)
      await flushMicrotasks()

      expect(await session.isAuthorized('admin')).toBe(false)

      await injector[Symbol.asyncDispose]()
    })
  })
})
