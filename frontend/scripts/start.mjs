import { serve } from 'esbuild'
import { createServer, request } from 'http'
import { getBundleBuildOptions } from './build-defaults.mjs'

const onRequest = (bundler) => (arg) => {
  console.log(`[${bundler}] <${arg.status}> ${arg.path}`)
}

const serveBundle = serve(
  {
    servedir: 'bundle',
    port: 8079,
    onRequest: onRequest('bundle'),
  },
  {
    ...getBundleBuildOptions(),
  },
)

Promise.all([serveBundle]).then(([bundleResult]) => {
  // The result tells us where esbuild's local server is
  const { host, port } = bundleResult

  const proxy = createServer((req, res) => {
    // forwardRequest forwards an http request through to esbuid.
    const forwardRequest = (path, redirectHost = host, redirectPort = port) => {
      /**
       * @type {import('http').RequestOptions} The options to use when making the request.
       */
      const options = {
        hostname: redirectHost,
        port: redirectPort,
        path,
        host: `${host}:${port}`,
        method: req.method,
        headers: req.headers,
      }

      const proxyReq = request(options, (proxyRes) => {
        if (proxyRes.statusCode === 404) {
          return forwardRequest('/')
        }

        // Otherwise esbuild handled it like a champ, so proxy the response back.
        res.writeHead(proxyRes.statusCode, proxyRes.headers)
        proxyRes.pipe(res, { end: true })
      })

      req.pipe(proxyReq, { end: true })
    }

    // When we're called pass the request right through to esbuild.
    forwardRequest(req.url)
  })

  // Start our proxy server at the specified `listen` port.
  proxy.listen(8080)
})
