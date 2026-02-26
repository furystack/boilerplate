import type { FindOptions, WithOptionalId } from '@furystack/core'
import { useSystemIdentityContext } from '@furystack/core'
import type { Injector } from '@furystack/inject'
import { getLogger } from '@furystack/logging'
import type { DataSet } from '@furystack/repository'
import { getDataSetFor } from '@furystack/repository'
import { PasswordAuthenticator, PasswordCredential } from '@furystack/security'
import { usingAsync } from '@furystack/utils'
import { User } from 'common'
import { injector } from './root-injector.js'
import { setupStore } from './setup-store.js'

/**
 * gets an existing instance if exists or create and return if not. Throws error on multiple result
 * @param filter The filter term
 * @param instance The instance to be created if there is no instance present
 * @param dataSet The DataSet to use
 * @param i The Injector instance
 * @returns The retrieved or created object
 */
export const getOrCreate = async <T, TKey extends keyof T>(
  filter: FindOptions<T, Array<keyof T>>,
  instance: WithOptionalId<T, TKey>,
  dataSet: DataSet<T, TKey>,
  i: Injector,
): Promise<T> => {
  const result = await dataSet.find(i, filter)
  const logger = getLogger(i).withScope('seeder')
  if (result.length === 1) {
    return result[0]
  } else if (result.length === 0) {
    await logger.verbose({
      message: `Entity not exists, adding: '${JSON.stringify(filter)}'`,
    })
    const createResult = await dataSet.add(i, instance)
    return createResult.created[0]
  } else {
    const message = `Seed filter contains '${result.length}' results for ${JSON.stringify(filter)}`
    await logger.warning({ message })
    return result[0]
  }
}

/**
 * Seeds the databases with predefined values
 * @param i The injector instance
 */
export const seed = async (i: Injector): Promise<void> => {
  await usingAsync(useSystemIdentityContext({ injector: i, username: 'seeder' }), async (systemInjector) => {
    const logger = getLogger(systemInjector).withScope('seeder')
    await logger.verbose({ message: 'Seeding data...' })
    const userDataSet = getDataSetFor(systemInjector, User, 'username')
    const pwcDataSet = getDataSetFor(systemInjector, PasswordCredential, 'userName')
    const cred = await systemInjector.getInstance(PasswordAuthenticator).hasher.createCredential('testuser', 'password')
    await logger.verbose({ message: 'Saving credential...' })
    await getOrCreate(
      {
        filter: { userName: { $eq: 'testuser' } },
      },
      cred,
      pwcDataSet,
      systemInjector,
    )
    await logger.verbose({ message: 'Saving User...' })
    await getOrCreate(
      { filter: { username: { $eq: 'testuser' } } },
      {
        username: 'testuser',
        roles: [],
      },
      userDataSet,
      systemInjector,
    )

    await logger.verbose({ message: 'Seeding data completed.' })
  })
}

setupStore(injector)
await seed(injector)
await injector[Symbol.asyncDispose]()
