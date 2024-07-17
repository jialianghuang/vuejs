const { clearWebOptions } = require('./utils')
const { webApiController } = require('./controller')

module.exports = function cacheRenderer(nuxt, config) {
  // used as a nuxt module, only config is provided as argument
  // and nuxt instance will be provided as this context
  if (arguments.length < 2 && this.nuxt) {
    nuxt = this.nuxt
    config = this.options
  }

  const renderer = nuxt.renderer
  if (!renderer) return
  const renderRoute = renderer.renderRoute.bind(renderer)

  const servePort = (config.server && config.server.port) || 3000

  renderer.renderRoute = function(route, context) {
    // console.log(url.parse(route))
    if (route.startsWith('/web-api')) {
      return webApiController(route, context, servePort)
    } else {
      clearWebOptions(context)
      return renderRoute(route, context)
    }
  }
}
