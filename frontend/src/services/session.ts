import { Injectable } from '@furystack/inject'
import { ObservableValue, usingAsync, sleepAsync } from '@furystack/utils'
import { User } from 'common'
import { BoilerplateApiClient } from './boilerplate-api-client'

export type sessionState = 'initializing' | 'offline' | 'unauthenticated' | 'authenticated'

@Injectable({ lifetime: 'singleton' })
export class SessionService {
  private readonly operation = () => {
    this.isOperationInProgress.setValue(true)
    return { dispose: () => this.isOperationInProgress.setValue(false) }
  }

  public state = new ObservableValue<sessionState>('initializing')
  public currentUser = new ObservableValue<User | null>(null)

  public isOperationInProgress = new ObservableValue(true)

  public loginError = new ObservableValue('')
  private async init() {
    await usingAsync(this.operation(), async () => {
      try {
        const { result } = await this.api.call({ method: 'GET', action: '/isAuthenticated' })
        this.state.setValue(result.isAuthenticated ? 'authenticated' : 'unauthenticated')
        if (result.isAuthenticated) {
          const { result: usr } = await this.api.call({ method: 'GET', action: '/currentUser' })
          this.currentUser.setValue(usr)
        }
      } catch (error) {
        this.state.setValue('offline')
      }
    })
  }

  public async login(username: string, password: string): Promise<void> {
    await usingAsync(this.operation(), async () => {
      try {
        await sleepAsync(2000)
        const { result: usr } = await this.api.call({ method: 'POST', action: '/login', body: { username, password } })
        this.currentUser.setValue(usr)
        this.state.setValue('authenticated')
      } catch (error) {
        const errorResponse = await error.response.json()
        this.loginError.setValue(errorResponse.message)
      }
    })
  }

  public async logout(): Promise<void> {
    await usingAsync(this.operation(), async () => {
      this.api.call({ method: 'POST', action: '/logout' })
      this.currentUser.setValue(null)
      this.state.setValue('unauthenticated')
    })
  }

  constructor(private api: BoilerplateApiClient) {
    this.init()
  }
}
