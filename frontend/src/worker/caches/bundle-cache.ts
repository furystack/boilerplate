import { CacheBase } from './cache-base'

export class BundleCache extends CacheBase {
  private staticAssetList = ['/', '/favicon.ico', '/app.js']

  public readonly cacheKey = 'bundle-cache'
  public readonly canBeCached = (request: Request) => {
    const url = request.url.replace(location.origin, '')
    return request.method === 'GET' && this.staticAssetList.includes(url)
  }
}
