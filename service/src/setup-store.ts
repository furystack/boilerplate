import { RefreshToken, useJwtAuthentication } from '@furystack/auth-jwt'
import { addStore, InMemoryStore } from '@furystack/core'
import { FileSystemStore } from '@furystack/filesystem-store'
import type { Injector } from '@furystack/inject'
import { getRepository } from '@furystack/repository'
import { DefaultSession, useHttpAuthentication } from '@furystack/rest-service'
import { PasswordCredential, PasswordResetToken, usePasswordPolicy } from '@furystack/security'
import { User } from 'common'
import { join } from 'path'
import { authorizedDataSet } from './authorization/authorized-only.js'

export const setupStore = (injector: Injector): void => {
  addStore(
    injector,
    new FileSystemStore({
      model: User,
      primaryKey: 'username',
      tickMs: 30_000,
      fileName: join(process.cwd(), 'users.json'),
    }),
  )
    .addStore(new InMemoryStore({ model: DefaultSession, primaryKey: 'sessionId' }))
    .addStore(
      new FileSystemStore({
        model: PasswordCredential,
        primaryKey: 'userName',
        fileName: join(process.cwd(), '..', '..', 'pwc.json'),
      }),
    )
    .addStore(new InMemoryStore({ model: PasswordResetToken, primaryKey: 'token' }))
    .addStore(new InMemoryStore({ model: RefreshToken, primaryKey: 'token' }))

  getRepository(injector)
    .createDataSet(User, 'username', { ...authorizedDataSet })
    .createDataSet(DefaultSession, 'sessionId')
    .createDataSet(PasswordCredential, 'userName')
    .createDataSet(PasswordResetToken, 'token')
    .createDataSet(RefreshToken, 'token')

  usePasswordPolicy(injector)
  useHttpAuthentication(injector)
  useJwtAuthentication(injector, {
    secret: process.env.JWT_SECRET || 'change-me-to-a-secure-32-byte-secret!',
    accessTokenExpirationSeconds: 60,
  })
}
