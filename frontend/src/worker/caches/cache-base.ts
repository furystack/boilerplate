export abstract class CacheBase {
  public async getFromCache(request: Request): Promise<Response | undefined> {
    if (!this.canBeCached(request)) {
      return Promise.resolve(undefined)
    }
    return caches.open(this.cacheKey).then((cache) => cache.match(request))
  }

  public async persist(request: Request, response: Response) {
    if (!this.canBeCached(request)) {
      return
    }
    return caches.open(this.cacheKey).then((cache) => cache.put(request, response))
  }

  abstract readonly cacheKey: string
  abstract readonly canBeCached: (request: Request) => boolean
}
