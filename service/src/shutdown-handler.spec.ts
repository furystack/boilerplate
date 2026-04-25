import { createInjector, type Injector } from '@furystack/inject'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attachShutdownHandler } from './shutdown-handler.js'

const SIGNALS = [
  'exit',
  'SIGINT',
  'SIGQUIT',
  'SIGTERM',
  'SIGUSR1',
  'SIGUSR2',
  'uncaughtException',
  'unhandledRejection',
] as const

type CapturedListeners = Map<(typeof SIGNALS)[number], (...args: unknown[]) => void>

const captureListeners = (): CapturedListeners => {
  const captured: CapturedListeners = new Map()
  vi.spyOn(process, 'once').mockImplementation((event, listener) => {
    if ((SIGNALS as readonly string[]).includes(event as string)) {
      captured.set(event as (typeof SIGNALS)[number], listener as (...args: unknown[]) => void)
    }
    return process
  })
  return captured
}

describe('attachShutdownHandler', () => {
  let injector: Injector
  let exitSpy: ReturnType<typeof vi.spyOn>
  let removeAllListenersSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    injector = createInjector()
    exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never)
    removeAllListenersSpy = vi.spyOn(process, 'removeAllListeners').mockImplementation(() => process)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('registers a handler for every supported signal', async () => {
    const captured = captureListeners()

    await attachShutdownHandler(injector)

    for (const signal of SIGNALS) {
      expect(captured.has(signal), `expected handler for ${signal}`).toBe(true)
    }
  })

  it('disposes the injector and exits with code 0 on a graceful signal', async () => {
    const captured = captureListeners()
    const disposeSpy = vi.spyOn(injector, Symbol.asyncDispose).mockResolvedValue(undefined)

    await attachShutdownHandler(injector)

    const handler = captured.get('SIGINT')
    expect(handler).toBeDefined()

    handler?.()
    await vi.waitFor(() => expect(exitSpy).toHaveBeenCalled())

    expect(removeAllListenersSpy).toHaveBeenCalledWith('exit')
    expect(disposeSpy).toHaveBeenCalledTimes(1)
    expect(exitSpy).toHaveBeenCalledWith(0)
  })

  it('disposes the injector and exits with code 1 on an uncaught exception', async () => {
    const captured = captureListeners()
    const disposeSpy = vi.spyOn(injector, Symbol.asyncDispose).mockResolvedValue(undefined)

    await attachShutdownHandler(injector)

    const handler = captured.get('uncaughtException')
    expect(handler).toBeDefined()

    handler?.(new Error('boom'))
    await vi.waitFor(() => expect(exitSpy).toHaveBeenCalled())

    expect(disposeSpy).toHaveBeenCalledTimes(1)
    expect(exitSpy).toHaveBeenCalledWith(1)
  })

  it('forces exit(1) when injector disposal throws', async () => {
    const captured = captureListeners()
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    vi.spyOn(injector, Symbol.asyncDispose).mockRejectedValue(new Error('dispose-failed'))

    await attachShutdownHandler(injector)

    const handler = captured.get('SIGTERM')
    handler?.()
    await vi.waitFor(() => expect(exitSpy).toHaveBeenCalled())

    expect(errorSpy).toHaveBeenCalledWith('Error during shutdown', expect.any(Error))
    expect(exitSpy).toHaveBeenCalledWith(1)
  })
})
