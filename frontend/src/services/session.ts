import type { IdentityContext } from '@furystack/core'
import { defineService, type Token } from '@furystack/inject'
import { NotyService } from '@furystack/shades-common-components'
import { ObservableValue, usingAsync } from '@furystack/utils'
import type { User } from 'common'
import { BoilerplateApiClient } from './boilerplate-api-client.js'

export type SessionState = 'initializing' | 'offline' | 'unauthenticated' | 'authenticated'

export interface SessionService extends IdentityContext {
  readonly state: ObservableValue<SessionState>
  readonly currentUser: ObservableValue<Omit<User, 'password'> | null>
  readonly isOperationInProgress: ObservableValue<boolean>
  readonly loginError: ObservableValue<string>
  init(): Promise<void>
  login(username: string, password: string): Promise<void>
  logout(): Promise<void>
}

export const SessionService: Token<SessionService, 'singleton'> = defineService({
  name: 'app/SessionService',
  lifetime: 'singleton',
  factory: ({ inject, onDispose }) => {
    const api = inject(BoilerplateApiClient)
    const notys = inject(NotyService)

    const state = new ObservableValue<SessionState>('initializing')
    const currentUser = new ObservableValue<Omit<User, 'password'> | null>(null)
    const isOperationInProgress = new ObservableValue(true)
    const loginError = new ObservableValue('')

    const operation = (): Disposable => {
      isOperationInProgress.setValue(true)
      return { [Symbol.dispose]: () => isOperationInProgress.setValue(false) }
    }

    let isInitialized = false
    const init = async (): Promise<void> => {
      await usingAsync(operation(), async () => {
        if (isInitialized) return
        isInitialized = true
        try {
          if (api.isAuthenticated) {
            const { result: usr } = await api.call({ method: 'GET', action: '/currentUser' })
            currentUser.setValue(usr)
            state.setValue('authenticated')
          } else {
            state.setValue('unauthenticated')
          }
        } catch {
          state.setValue('offline')
        }
      })
    }

    const login = async (username: string, password: string): Promise<void> => {
      await usingAsync(operation(), async () => {
        try {
          await api.login({ username, password })
          const { result: usr } = await api.call({ method: 'GET', action: '/currentUser' })
          currentUser.setValue(usr)
          state.setValue('authenticated')
          notys.emit('onNotyAdded', {
            body: 'Welcome back ;)',
            title: 'You have been logged in',
            type: 'success',
          })
        } catch (error) {
          loginError.setValue(error instanceof Error ? error.message : '')
          notys.emit('onNotyAdded', {
            body: 'Please check your credentials',
            title: 'Login failed',
            type: 'warning',
          })
        }
      })
    }

    const logout = async (): Promise<void> => {
      await usingAsync(operation(), async () => {
        await api.logout()
        currentUser.setValue(null)
        state.setValue('unauthenticated')
        notys.emit('onNotyAdded', {
          body: 'Come back soon...',
          title: 'You have been logged out',
          type: 'info',
        })
      })
    }

    const isAuthenticated = async (): Promise<boolean> => state.getValue() === 'authenticated'

    const getCurrentUserOrThrow = <TUser extends User>(): TUser => {
      const user = currentUser.getValue()
      if (!user) {
        notys.emit('onNotyAdded', {
          body: ':(((',
          title: 'No User available',
          type: 'warning',
        })
        throw new Error('No user available')
      }
      return user as unknown as TUser
    }

    const isAuthorized = async (...roles: string[]): Promise<boolean> => {
      const user = currentUser.getValue()
      if (!user) return false
      return roles.every((role) => user.roles.includes(role))
    }

    const getCurrentUser = async <TUser extends User>(): Promise<TUser> => getCurrentUserOrThrow<TUser>()

    onDispose(() => {
      // eslint-disable-next-line furystack/prefer-using-wrapper -- Disposal is deferred to the injector's onDispose hook.
      state[Symbol.dispose]()
      // eslint-disable-next-line furystack/prefer-using-wrapper -- Disposal is deferred to the injector's onDispose hook.
      currentUser[Symbol.dispose]()
      // eslint-disable-next-line furystack/prefer-using-wrapper -- Disposal is deferred to the injector's onDispose hook.
      isOperationInProgress[Symbol.dispose]()
      // eslint-disable-next-line furystack/prefer-using-wrapper -- Disposal is deferred to the injector's onDispose hook.
      loginError[Symbol.dispose]()
    })

    void init()

    return {
      state,
      currentUser,
      isOperationInProgress,
      loginError,
      init,
      login,
      logout,
      isAuthenticated,
      isAuthorized,
      getCurrentUser,
    }
  },
})
