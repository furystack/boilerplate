import { RestApi, RequestAction } from '@furystack/rest'
import { User } from './models'
export interface BoilerplateApi extends RestApi {
  GET: {
    '/isAuthenticated': RequestAction<{ result: { isAuthenticated: boolean } }>
    '/currentUser': RequestAction<{ result: User }>
    '/testQuery': RequestAction<{ query: { param1: string }; result: { param1Value: string } }>
    '/testUrlParams/:urlParam': RequestAction<{ urlParams: { urlParam: string }; result: { urlParamValue: string } }>
  }
  POST: {
    '/login': RequestAction<{ result: User; body: { username: string; password: string } }>
    '/logout': RequestAction<{}>
    '/testPostBody': RequestAction<{ body: { value: string }; result: { bodyValue: string } }>
  }
}
