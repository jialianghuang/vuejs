// import envConfig from '../config'
// import { getCookieByString } from '../assets/js/pointUtil'
// const url = require('url')
// const redis = require('redis')
// const md5 = require('js-md5')
// const LRU = require('lru-cache')
// const { logger } = require('../server/logger')

module.exports = function cacheRenderer(nuxt, config) {
  // used as a nuxt module, only config is provided as argument
  // and nuxt instance will be provided as this context
  if (arguments.length < 2 && this.nuxt) {
    nuxt = this.nuxt
    config = this.options
  }
  const renderer = nuxt.renderer
  if (renderer !== undefined) {
    const renderRoute = renderer.renderRoute.bind(renderer)
    renderer.renderRoute = function(route, context) {
      // hopefully cache reset is finished up to this point.

      // custom function to return cache key, when used previous
      // properties (useHostPrefix, pages) are ignored. return
      // falsy value to bypass the cache
      // const host = context.req.headers['x-original-host'] || context.req.headers.host

      // 用户登录态相关页面禁止浏览器缓存
      // const pages = ['/cart', '/checkout', '/order', '/showroom', '/user', '/review', '/purchaseSample']
      // console.log('------cache--------', route)
      // const hasSomePage = pages.some((item) => route.includes(item))

      // clouflare缓存设置响应头
      if (!route.includes('/riven/') && !route.includes('/products/') && !route.includes('/all/')) {
        context.res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
        context.res.setHeader('Pragma', 'no-cache')
        context.res.setHeader('Expires', 0)
      }

      // let NABTEST = getCookieByString('NABTEST', context.req.headers.cookie)
      // let environment = 'dev'
      // let country = 'US'
      // const host = context.req.headers['x-original-host'] || context.req.headers.host
      // if (host.includes('.ca')) {
      //   country = 'CA'
      // }
      // const resCountry = handleCacheCountry(context, country)
      // if (resCountry) country = resCountry

      // if (host.includes('p.') || host.includes('px.') || host.includes('p2.') || host.includes('p3.')) {
      //   environment = 'pre'
      // } else if (host.includes('www.') || host.includes('x.') || host.includes('x-internal.')) {
      //   environment = 'prod'
      // } else if (host.includes('ft')) {
      //   environment = 'test'
      // }
      // if (!NABTEST) {
      //   NABTEST = context.req.headers['x-abtest'] || 'A'
      //   const domain = country == 'CA' ? '.azazie.ca' : '.azazie.com'
      //   const ExpireDate = new Date()
      //   ExpireDate.setTime(ExpireDate.getTime() + 7 * 24 * 3600 * 1000)
      //   const cookie = 'NABTEST=' + escape(NABTEST) + ';domain=' + domain + ';path=/; expires=' + ExpireDate.toGMTString()
      //   context.res.setHeader('Set-Cookie', cookie)
      //   context.req.headers.cookie = 'NABTEST=' + NABTEST + ';' + context.req.headers.cookie
      //   context.req.headers['x-abtest'] = NABTEST
      // }
      // // eslint-disable-next-line node/no-deprecated-api
      // let urlOrigin = 'http://localhost:3000'
      // if (context.req && context.req.headers) {
      //   if (host) urlOrigin = 'http://' + host
      // }
      // const urlFormat = new url.URL(route, urlOrigin)
      // // const urlFormat = require('url').parse(route, true)
      // let isCache = false
      // let pageType = ''
      // let cacheKey = ''
      // if (urlFormat.pathname == '/') {
      //   isCache = true
      //   pageType = 'riven-index'
      // }
      // if (urlFormat.pathname.includes('/product')) {
      //   isCache = true
      //   pageType = 'riven-product'
      // }
      // // 库存商品不使用前端缓存
      // if (
      //   route.includes('sample') ||
      //   route.includes('ready-to-ship') ||
      //   route.includes('last-chance-outlet') ||
      //   route.includes('clearance') ||
      //   route.includes('-flower-girl-dresses') ||
      //   route.includes('gentlemen-collection') ||
      //   route.includes('-satin-vest') ||
      //   route.includes('goods_style_id')
      // ) {
      //   isCache = false
      // }
      // if (environment == 'dev' || environment == 'test') {
      //   isCache = false
      // }
      // isCache = false
      // if (isCache && pageType != '') {
      //   cacheKey = md5(host + route) + '-' + NABTEST + '-' + country
      // } else {
      return renderRoute(route, context)
      // }
      // const cache = redis.createClient(envConfig.redis[environment].port, envConfig.redis[environment].host)
      // const { promisify } = require('util')
      // const getAsync = promisify(cache.hget).bind(cache)
      // let result = false
      // return getAsync(pageType, cacheKey).then((r) => {
      //   // console.log(r)
      //   result = r
      //   if (result) {
      //     return JSON.parse(result)
      //   } else {
      //     return renderRoute(route, context).then(function(result) {
      //       if (!result.error && !result.redirected) {
      //         cache.hset(pageType, cacheKey, JSON.stringify(result))
      //       }
      //       cache.ttl(pageType, (err, ttl) => {
      //         if (!err && ttl == -1) {
      //           cache.expire(pageType, 3600 * 3)
      //         }
      //       })
      //       return result
      //     })
      //   }
      // })
    }
  }
}
