import { join } from 'path'
import { InMemoryStore } from '@furystack/core'
import { FileSystemStore } from '@furystack/filesystem-store'
import { Injector } from '@furystack/inject'
import { VerboseConsoleLogger } from '@furystack/logging'
import { DataSetSettings, AuthorizationResult } from '@furystack/repository'
import '@furystack/repository/dist/injector-extension'
import { User, Session } from 'common'

export const authorizedOnly = async (options: { injector: Injector }): Promise<AuthorizationResult> => {
  const isAllowed = await options.injector.isAuthenticated()
  return isAllowed
    ? { isAllowed }
    : {
        isAllowed,
        message: 'You are not authorized :(',
      }
}

export const authorizedDataSet: Partial<DataSetSettings<any, any>> = {
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
        new FileSystemStore<User>({
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
    }),
  )
