import { getLogger } from '@furystack/logging'
import { BundleCache } from './caches/bundle-cache'
import { CacheBase } from './caches/cache-base'
import { workerInjector } from './index'

const primaryCaches: CacheBase[] = [new BundleCache()]

const fallbackCaches: CacheBase[] = [new BundleCache()]

export const fetchCache = async (event: FetchEvent) => {
  try {
    const availableCaches = primaryCaches.filter((cache) => cache.canBeCached(event.request))
    for (const cache of availableCaches) {
      const result = await cache.getFromCache(event.request)
      if (result) {
        return result
      }
    }
  } catch (error) {
    getLogger(workerInjector).withScope('FetchCache').error({ message: 'Primary cache error ', data: { error } })
  }

  try {
    const response = await fetch(event.request)
    const availableFallbackCaches = fallbackCaches.filter((cache) => cache.canBeCached(event.request))
    await Promise.all(availableFallbackCaches.map((c) => c.persist(event.request, response.clone())))
    return response
  } catch (error) {
    if (!navigator.onLine) {
      throw error
    }
    const cached = await caches.match(event.request)
    if (cached) {
      return cached
    }
    throw error
  }
}

export const clearCache = async () => {
  // TODO
  // const cache = await caches.open(CACHE_KEY)
  // await cache.delete(CACHE_KEY)
}
