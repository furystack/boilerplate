/// <reference lib="webworker" />

// Default type of `self` is `WorkerGlobalScope & typeof globalThis`
// https://github.com/microsoft/TypeScript/issues/14877
declare const self: ServiceWorkerGlobalScope

import { Injector } from '@furystack/inject'
import { getLogger, useLogging, VerboseConsoleLogger } from '@furystack/logging'
import { clearCache, fetchCache } from './fetch-cache'

export const workerInjector = new Injector()
useLogging(workerInjector, VerboseConsoleLogger)

self.addEventListener('install', () => {
  getLogger(workerInjector).withScope('Worker').verbose({ message: 'Installing Worker' })
})

self.addEventListener('update', () => {
  getLogger(workerInjector).withScope('Worker').verbose({ message: 'Updating Worker' })
})

self.addEventListener('push', (ev) => {
  console.log(ev)
  if (ev.data?.text() === 'logOut') {
    return ev.waitUntil(clearCache())
  }
})

self.addEventListener('fetch', (event) => {
  event.respondWith(fetchCache(event))
})
