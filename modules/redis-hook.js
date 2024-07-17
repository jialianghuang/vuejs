export default function(nuxt, options) {
  this.nuxt.hook('render:route', (url, result, context) => {
    if (context.req.redis_cache_status) {
      context.res.setHeader('redis-cache-status', context.req.redis_cache_status)
    }
    if (context.res.statusCode !== 302) {
      context.res.setHeader('Content-Security-Policy', "frame-ancestors 'self' support.azazie.com customerservice.azazie.com")
    }
  })
}
