import { RefreshToken, RefreshTokenStore, useJwtAuthentication } from '@furystack/auth-jwt'
import { defineStore, InMemoryStore } from '@furystack/core'
import { defineFileSystemStore } from '@furystack/filesystem-store'
import type { Injector } from '@furystack/inject'
import { defineDataSet, type DataSetToken } from '@furystack/repository'
import { DefaultSession, SessionStore, useHttpAuthentication, UserStore } from '@furystack/rest-service'
import {
  PasswordCredential,
  PasswordCredentialStore,
  PasswordResetToken,
  PasswordResetTokenStore,
  usePasswordPolicy,
} from '@furystack/security'
import { User } from 'common'
import { join } from 'path'
import { authorizedDataSet } from './authorization/authorized-only.js'

const usersFile = join(process.cwd(), 'users.json')
const passwordCredentialsFile = join(process.cwd(), '..', '..', 'pwc.json')

const UsersFileStore = defineFileSystemStore({
  name: 'app/UsersFileStore',
  model: User,
  primaryKey: 'username',
  fileName: usersFile,
  tickMs: 30_000,
})

const PasswordCredentialsFileStore = defineFileSystemStore({
  name: 'app/PasswordCredentialsFileStore',
  model: PasswordCredential,
  primaryKey: 'userName',
  fileName: passwordCredentialsFile,
})

const SessionsMemoryStore = defineStore({
  name: 'app/SessionsMemoryStore',
  model: DefaultSession,
  primaryKey: 'sessionId',
  factory: () => new InMemoryStore({ model: DefaultSession, primaryKey: 'sessionId' }),
})

const PasswordResetTokensMemoryStore = defineStore({
  name: 'app/PasswordResetTokensMemoryStore',
  model: PasswordResetToken,
  primaryKey: 'token',
  factory: () => new InMemoryStore({ model: PasswordResetToken, primaryKey: 'token' }),
})

const RefreshTokensMemoryStore = defineStore({
  name: 'app/RefreshTokensMemoryStore',
  model: RefreshToken,
  primaryKey: 'token',
  factory: () => new InMemoryStore({ model: RefreshToken, primaryKey: 'token' }),
})

/**
 * Authorization-aware {@link User} dataset, exported so the REST API
 * registers the same instance through {@link useHttpAuthentication}.
 */
export const AuthorizedUserDataSet: DataSetToken<User, 'username'> = defineDataSet({
  name: 'app/AuthorizedUserDataSet',
  store: UserStore,
  settings: authorizedDataSet,
})

const requireJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET
  if (secret && secret.length >= 32) {
    return secret
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set to a 32+ byte value in production.')
  }
  return 'change-me-to-a-secure-32-byte-secret!'
}

/**
 * Wires every framework store token to a concrete backing implementation
 * and installs HTTP / JWT authentication on the supplied injector.
 */
export const setupStore = (injector: Injector): void => {
  injector.bind(UserStore, ({ inject }) => inject(UsersFileStore))
  injector.bind(SessionStore, ({ inject }) => inject(SessionsMemoryStore))
  injector.bind(PasswordCredentialStore, ({ inject }) => inject(PasswordCredentialsFileStore))
  injector.bind(PasswordResetTokenStore, ({ inject }) => inject(PasswordResetTokensMemoryStore))
  injector.bind(RefreshTokenStore, ({ inject }) => inject(RefreshTokensMemoryStore))

  usePasswordPolicy(injector)
  useHttpAuthentication(injector, { userDataSet: AuthorizedUserDataSet })
  useJwtAuthentication(injector, {
    secret: requireJwtSecret(),
    accessTokenExpirationSeconds: 60,
  })
}
