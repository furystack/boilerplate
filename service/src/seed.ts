import type { FindOptions, PhysicalStore, WithOptionalId } from '@furystack/core'
import { StoreManager } from '@furystack/core'
import type { Injector } from '@furystack/inject'
import { getLogger } from '@furystack/logging'
import { PasswordAuthenticator, PasswordCredential } from '@furystack/security'
import { User } from 'common'
import { injector } from './config.js'

/**
 * gets an existing instance if exists or create and return if not. Throws error on multiple result
 * @param filter The filter term
 * @param instance The instance to be created if there is no instance present
 * @param store The physical store to use
 * @param i The Injector instance
 * @returns The retrieved or created object
 */
export const getOrCreate = async <T, TKey extends keyof T>(
  filter: FindOptions<T, Array<keyof T>>,
  instance: WithOptionalId<T, TKey>,
  store: PhysicalStore<T, TKey>,
  i: Injector,
): Promise<T> => {
  const result = await store.find(filter)
  const logger = getLogger(i).withScope('seeder')
  if (result.length === 1) {
    return result[0]
  } else if (result.length === 0) {
    await logger.verbose({
      message: `Entity of type '${store.model.name}' not exists, adding: '${JSON.stringify(filter)}'`,
    })
    const createResult = await store.add(instance)
    return createResult.created[0]
  } else {
    const message = `Seed filter contains '${result.length}' results for ${JSON.stringify(filter)}`
    await logger.warning({ message })
    // throw Error(message)
    return result[0]
  }
}

/**
 * Seeds the databases with predefined values
 * @param i The injector instance
 */
export const seed = async (i: Injector): Promise<void> => {
  const logger = getLogger(i).withScope('seeder')
  await logger.verbose({ message: 'Seeding data...' })
  const sm = i.getInstance(StoreManager)
  const userStore = sm.getStoreFor(User, 'username')
  const pwcStore = sm.getStoreFor(PasswordCredential, 'userName')
  const cred = await i.getInstance(PasswordAuthenticator).hasher.createCredential('testuser', 'password')
  await logger.verbose({ message: 'Saving credential...' })
  await getOrCreate(
    {
      filter: { userName: { $eq: 'testuser' } },
    },
    cred,
    pwcStore,
    i,
  )
  await logger.verbose({ message: 'Saving User...' })
  await getOrCreate(
    { filter: { username: { $eq: 'testuser' } } },
    {
      username: 'testuser',
      roles: [],
    },
    userStore,
    i,
  )

  await logger.verbose({ message: 'Seeding data completed.' })
}

await seed(injector)
await injector[Symbol.asyncDispose]()
