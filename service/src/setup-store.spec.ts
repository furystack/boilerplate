import { RefreshTokenStore } from '@furystack/auth-jwt'
import { JwtAuthenticationSettings } from '@furystack/auth-jwt'
import { createInjector } from '@furystack/inject'
import { HttpAuthenticationSettings, SessionStore, UserStore } from '@furystack/rest-service'
import { PasswordCredentialStore, PasswordResetTokenStore } from '@furystack/security'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthorizedUserDataSet, requireJwtSecret, setupStore } from './setup-store.js'

describe('requireJwtSecret', () => {
  const longSecret = 'a'.repeat(32)
  const shortSecret = 'too-short'

  it('returns the env value when it is at least 32 bytes long', () => {
    expect(requireJwtSecret({ JWT_SECRET: longSecret })).toBe(longSecret)
  })

  it('falls back to the dev secret when the env var is missing in non-production', () => {
    expect(requireJwtSecret({ NODE_ENV: 'development' })).toBe('change-me-to-a-secure-32-byte-secret!')
  })

  it('falls back to the dev secret when the env var is too short in non-production', () => {
    expect(requireJwtSecret({ JWT_SECRET: shortSecret, NODE_ENV: 'test' })).toBe(
      'change-me-to-a-secure-32-byte-secret!',
    )
  })

  it('throws when the secret is missing in production', () => {
    expect(() => requireJwtSecret({ NODE_ENV: 'production' })).toThrow(/JWT_SECRET must be set/)
  })

  it('throws when the secret is too short in production', () => {
    expect(() => requireJwtSecret({ JWT_SECRET: shortSecret, NODE_ENV: 'production' })).toThrow(
      /JWT_SECRET must be set/,
    )
  })

  it('measures byte length, not character count, for multi-byte characters', () => {
    // 11 emojis at 4 bytes each = 44 UTF-8 bytes, well above the 32 byte floor.
    const emojiSecret = '🔐'.repeat(11)
    expect(requireJwtSecret({ JWT_SECRET: emojiSecret })).toBe(emojiSecret)
  })

  it('rejects 31 byte secrets in production (boundary)', () => {
    expect(() => requireJwtSecret({ JWT_SECRET: 'a'.repeat(31), NODE_ENV: 'production' })).toThrow()
  })

  it('accepts 32 byte secrets (boundary)', () => {
    expect(requireJwtSecret({ JWT_SECRET: 'a'.repeat(32), NODE_ENV: 'production' })).toBe('a'.repeat(32))
  })
})

describe('setupStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('binds every framework store token, password policy, http auth and jwt auth', async () => {
    const injector = createInjector()
    const bindSpy = vi.spyOn(injector, 'bind')

    setupStore(injector)

    const boundTokens = bindSpy.mock.calls.map(([token]) => token)
    expect(boundTokens).toContain(UserStore)
    expect(boundTokens).toContain(SessionStore)
    expect(boundTokens).toContain(PasswordCredentialStore)
    expect(boundTokens).toContain(PasswordResetTokenStore)
    expect(boundTokens).toContain(RefreshTokenStore)

    // useHttpAuthentication / useJwtAuthentication rebind their settings tokens.
    expect(boundTokens).toContain(HttpAuthenticationSettings)
    expect(boundTokens).toContain(JwtAuthenticationSettings)

    const httpSettings = injector.get(HttpAuthenticationSettings)
    expect(httpSettings.userDataSet).toBe(AuthorizedUserDataSet)

    await injector[Symbol.asyncDispose]()
  })
})
