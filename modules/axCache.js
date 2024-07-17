const LRU = require('lru-cache')

module.exports = function cacheRenderer(nuxt, config) {
  // used as a nuxt module, only config is provided as argument
  // and nuxt instance will be provided as this context
  if (arguments.length < 2 && this.nuxt) {
    nuxt = this.nuxt
    config = this.options
  }
  const FIVE_MIN = 1000 * 60 * 5
  const axCache = new LRU({ maxAge: FIVE_MIN })

  nuxt.hook('vue-renderer:ssr:prepareContext', (ssrContext) => {
    ssrContext.$axCache = axCache
  })

  const renderer = nuxt.renderer
  if (!renderer) return
  const renderRoute = renderer.renderRoute.bind(renderer)

  renderer.renderRoute = function(route, context) {
    // if (route.startsWith('/web-api/lru')) {
    //   const query = getQueryString(route)
    //   let type = ''
    //   if (route.startsWith('/web-api/lru/delete-similar')) {
    //     const keys = axCache.keys()
    //     keys.forEach((item) => {
    //       if (item.includes(query.name)) {
    //         axCache.del(item)
    //       }
    //     })
    //     type = 'delete-similar'
    //   } else if (route.startsWith('/web-api/lru/delete')) {
    //     axCache.del(query.name)
    //     type = 'delete'
    //   } else if (route.startsWith('/web-api/lru/reset')) {
    //     axCache.reset()
    //     type = 'reset'
    //   } else if (route.startsWith('/web-api/lru/get')) {
    //     type = 'get'
    //   }
    //   context.res.write(
    //     JSON.stringify(
    //       type
    //         ? {
    //             type,
    //             keys: axCache.keys()
    //           }
    //         : 'error'
    //     )
    //   )
    //   context.res.end()
    //   return
    // }

    // console.log('axCache ==> init')

    context.webApiOptions = context.webApiOptions || {}
    context.webApiOptions.axCache = axCache

    return renderRoute(route, context)
  }
}

// const getQueryString = (route) => {
//   const queryString = route.split('?')[1]
//   if (!queryString) return {}
//   const query = {}
//   queryString.split('&').map((item) => {
//     const kv = item.split('=')
//     query[kv[0]] = kv[1]
//   })
//   return query
// }
