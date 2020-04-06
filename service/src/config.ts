import { join } from 'path'
import { InMemoryStore, FileStore } from '@furystack/core'
import { Injector } from '@furystack/inject'
import { VerboseConsoleLogger } from '@furystack/logging'
import { DataSetSettings } from '@furystack/repository'
import '@furystack/repository/dist/injector-extension'
import { User, Session } from 'common'
import { HttpUserContext } from '@furystack/rest-service'

export const authorizedOnly = async (options: { injector: Injector }) => {
  const authorized = await options.injector.getInstance(HttpUserContext).isAuthenticated()
  return {
    isAllowed: authorized,
    message: 'You are not authorized :(',
  }
}

export const authorizedDataSet: Partial<DataSetSettings<any>> = {
  authorizeAdd: authorizedOnly,
  authorizeGet: authorizedOnly,
  authorizeRemove: authorizedOnly,
  authorizeUpdate: authorizedOnly,
  authroizeRemoveEntity: authorizedOnly,
}

export const injector = new Injector()
injector
  .useLogging(VerboseConsoleLogger)
  .setupStores((stores) =>
    stores
      .addStore(
        new FileStore<User>({
          model: User,
          primaryKey: 'username',
          tickMs: 30 * 1000,
          fileName: join(__filename, '..', '..', 'users.json'),
          logger: injector.logger,
        }),
      )
      .addStore(
        new InMemoryStore<Session>({ model: Session, primaryKey: 'sessionId' }),
      ),
  )
  .setupRepository((repo) =>
    repo.createDataSet(User, {
      ...authorizedDataSet,
      name: 'users',
    }),
  )
