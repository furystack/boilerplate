import { createInjector } from '@furystack/inject'
import type { DataSet } from '@furystack/repository'
import { describe, expect, it, vi } from 'vitest'
import { getOrCreate } from './seed.js'

type Item = { id: string; name: string }

const newDataSetMock = (findResult: Item[], createdEntities: Item[] = []) =>
  ({
    find: vi.fn().mockResolvedValue(findResult),
    add: vi.fn().mockResolvedValue({ created: createdEntities }),
  }) as unknown as DataSet<Item, 'id'>

describe('getOrCreate', () => {
  it('returns the existing entity when find yields exactly one result', async () => {
    const existing: Item = { id: '1', name: 'existing' }
    const dataSet = newDataSetMock([existing])
    const injector = createInjector()

    const result = await getOrCreate({ filter: { id: { $eq: '1' } } }, { id: '1', name: 'existing' }, dataSet, injector)

    expect(result).toBe(existing)
    expect(dataSet.find).toHaveBeenCalledTimes(1)
    expect(dataSet.add).not.toHaveBeenCalled()
  })

  it('inserts the supplied instance when find yields no result and returns the created entity', async () => {
    const created: Item = { id: '2', name: 'created' }
    const dataSet = newDataSetMock([], [created])
    const injector = createInjector()

    const result = await getOrCreate({ filter: { id: { $eq: '2' } } }, { id: '2', name: 'created' }, dataSet, injector)

    expect(result).toBe(created)
    expect(dataSet.add).toHaveBeenCalledTimes(1)
    expect(dataSet.add).toHaveBeenCalledWith(injector, { id: '2', name: 'created' })
  })

  it('warns and returns the first match when the filter is ambiguous', async () => {
    const matches: Item[] = [
      { id: '3a', name: 'first' },
      { id: '3b', name: 'second' },
    ]
    const dataSet = newDataSetMock(matches)
    const injector = createInjector()

    const result = await getOrCreate(
      { filter: { name: { $eq: 'first' } } },
      { id: '3', name: 'first' },
      dataSet,
      injector,
    )

    expect(result).toBe(matches[0])
    expect(dataSet.add).not.toHaveBeenCalled()
  })
})
