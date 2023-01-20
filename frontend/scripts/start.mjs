import { context } from 'esbuild'

import { getBundleBuildOptions } from './build-defaults.mjs'

const onRequest = (bundler) => (arg) => {
  console.log(`[${bundler}] <${arg.status}> ${arg.path}`)
}

const ctx = await context(getBundleBuildOptions())

ctx.serve({
  servedir: 'bundle',
  port: 8080,
  onRequest: onRequest('bundle'),
})
