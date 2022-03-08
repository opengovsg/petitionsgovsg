// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware')

/**
 * Forces all requests to `/api/v1/auth` to be proxied to the backend.
 *
 * This overrides default react-scripts behaviour for webpack-dev-server,
 * which attempts to handle traffic where the Accept header contains `text/html`
 * in its value.
 *
 * This may occur in typical OIDC authorization flow, when the browser
 * changes its window.location.href to the service provider path to start
 * the flow. When this happens, the browser would use a catch-all Accept header,
 * and run into the react-scripts behaviour above, unless overridden.
 *
 * @param {Express} app Express app supplied by react-scripts for webpack-dev-server
 */
module.exports = function (app) {
  app.use(
    '/api/v1/auth',
    createProxyMiddleware({
      target: `http://localhost:${process.env.SERVER_PORT}`,
      changeOrigin: true,
    }),
  )
}
