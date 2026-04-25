import type { FindOptions, WithOptionalId } from '@furystack/core'
import { useSystemIdentityContext } from '@furystack/core'
import type { Injector } from '@furystack/inject'
import { getLogger } from '@furystack/logging'
import type { DataSet } from '@furystack/repository'
import { getDataSetFor } from '@furystack/repository'
import { PasswordAuthenticator, PasswordCredentialDataSet } from '@furystack/security'
import { usingAsync } from '@furystack/utils'
import { AuthorizedUserDataSet } from './setup-store.js'

/**
 * Returns the existing entity matching `filter` or creates `instance`
 * when none is found. Logs a warning when the filter is ambiguous.
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
  }
  if (result.length === 0) {
    await logger.verbose({ message: `Entity not exists, adding: '${JSON.stringify(filter)}'` })
    const createResult = await dataSet.add(i, instance)
    return createResult.created[0]
  }
  await logger.warning({ message: `Seed filter contains '${result.length}' results for ${JSON.stringify(filter)}` })
  return result[0]
}

/**
 * Seeds the persistence layer with a default test user / credential pair.
 */
export const seed = async (i: Injector): Promise<void> => {
  await usingAsync(useSystemIdentityContext({ injector: i, username: 'seeder' }), async (systemInjector) => {
    const logger = getLogger(systemInjector).withScope('seeder')
    await logger.verbose({ message: 'Seeding data...' })

    const userDataSet = getDataSetFor(systemInjector, AuthorizedUserDataSet)
    const pwcDataSet = getDataSetFor(systemInjector, PasswordCredentialDataSet)
    const credential = await systemInjector.get(PasswordAuthenticator).hasher.createCredential('testuser', 'password')

    await logger.verbose({ message: 'Saving credential...' })
    await getOrCreate({ filter: { userName: { $eq: 'testuser' } } }, credential, pwcDataSet, systemInjector)

    await logger.verbose({ message: 'Saving User...' })
    await getOrCreate(
      { filter: { username: { $eq: 'testuser' } } },
      { username: 'testuser', roles: [] },
      userDataSet,
      systemInjector,
    )

    await logger.verbose({ message: 'Seeding data completed.' })
  })
}
