import { PhysicalStore, StoreManager, FindOptions } from '@furystack/core'
import { HttpAuthenticationSettings } from '@furystack/rest-service'
import { Injector } from '@furystack/inject'
import { User } from 'common'
import { injector } from './config'

/**
 * gets an existing instance if exists or create and return if not. Throws error on multiple result
 *
 * @param filter The filter term
 * @param instance The instance to be created if there is no instance present
 * @param store The physical store to use
 * @param i The Injector instance
 * @returns The retrieved or created object
 */
export const getOrCreate = async <T>(
  filter: FindOptions<T, Array<keyof T>>,
  instance: T,
  store: PhysicalStore<T>,
  i: Injector,
): Promise<T> => {
  const result = await store.find(filter)
  const logger = i.logger.withScope('seeder')
  if (result.length === 1) {
    return result[0]
  } else if (result.length === 0) {
    logger.verbose({
      message: `Entity of type '${store.model.name}' not exists, adding: '${JSON.stringify(filter)}'`,
    })
    const createResult = await store.add(instance)
    return createResult.created[0]
  } else {
    const message = `Seed filter contains '${result.length}' results for ${JSON.stringify(filter)}`
    logger.warning({ message })
    throw Error(message)
  }
}

/**
 * Seeds the databases with predefined values
 *
 * @param i The injector instance
 */
export const seed = async (i: Injector): Promise<void> => {
  const logger = i.logger.withScope('seeder')
  logger.verbose({ message: 'Seeding data...' })
  const sm = i.getInstance(StoreManager)
  const userStore = sm.getStoreFor<User, PhysicalStore<User>>(User)
  await getOrCreate(
    { filter: { username: { $eq: 'testuser' } } },
    {
      username: 'testuser',
      password: i.getInstance(HttpAuthenticationSettings).hashMethod('password'),
      roles: [],
    } as User,
    userStore as PhysicalStore<User>,
    i,
  )

  logger.verbose({ message: 'Seeding data completed.' })
}

seed(injector).then(() => injector.dispose())
