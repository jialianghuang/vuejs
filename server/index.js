const { Nuxt, Builder } = require('nuxt')
const Koa = require('koa')
const consola = require('consola')
const bodyParser = require('koa-bodyparser')
const config = require('../nuxt.config.js')
const { logger, logger2 } = require('./logger')
// const merchant = require('./merchant')
const redirect = require('./redirect')

const SecureWebScan = false // 代码扫描 网站安全开关
const app = new Koa()
// const router = new KoaRouter();
// Import and Set Nuxt.js options
config.dev = app.env !== 'production'
async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)
  // 添加性能监听
  // eslint-disable-next-line no-unused-vars
  // const apm = addListen()
  const { host = process.env.HOST || '127.0.0.1', port = process.env.PORT || 3000 } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // 日志接口收集,注意：必须放在最前面
  app.use(async (ctx, next) => {
    // consola.log('-------server-', ctx.request.url)
    if (/serverLog/.test(ctx.request.url)) {
      if (ctx.request.method == 'POST') {
        await bodyParser()(ctx, next)
        try {
          if (ctx.request.header.cookie) {
            let cookie = deleteCookieValue('recent_view_good_list', ctx.request.header.cookie)
            cookie = deleteCookieValue('recently_viewed', cookie)
            ctx.request.header.cookie = cookie
          }
        } catch {}
        if ([420, 418].includes(ctx.request.body.errorCode) || (ctx.request.body.errorCode + '').startsWith(5)) {
          // axios 5XX 和 errorHandler 所有报错进行电话告警
          logger2.error(JSON.stringify({ ...ctx.request.body, header: ctx.request.header }))
        } else {
          logger.error(JSON.stringify({ ...ctx.request.body, header: ctx.request.header }))
        }
      }
      ctx.response.body = ''
    } else {
      next()
    }
  })

  // 路径拦截重定向
  app.use((ctx, next) => {
    const redirectUrl = redirect.validate(ctx.request.url)
    if (redirectUrl) {
      ctx.response.redirect(redirectUrl)
    } else {
      next()
    }
  })

  // app.use(async (ctx, next) => {
  //   if (ctx.request.method == 'POST' && /merchant-validate/.test(ctx.request.url)) {
  //     // await bodyParser()(ctx, next)
  //     // 对接口进行处理
  //     const res = await merchant.validate(ctx.request, ctx.response)
  //     // consola.log('--res---', res)
  //     ctx.body = res
  //   } else {
  //     next()
  //   }
  // })

  // 网站安全，异常请求拦截
  if (SecureWebScan) {
    app.use(async (ctx, next) => {
      if (ctx.request.url.includes('/all/')) {
        if (ctx.request.url.includes('SLEEP') || ctx.request.url.includes('sleep')) {
          ctx.response.body = 'There is an illegal operation'
        } else if (ctx.request.method == 'POST') {
          await bodyParser()(ctx, next)
          try {
            // 针对 列表页 参数 sleep 做特殊处理
            // consola.log('-ctx.request.body---', ctx.request.body)
            const bodyStr = JSON.stringify(ctx.request.body)
            if (bodyStr.includes('SLEEP') || bodyStr.includes('sleep')) {
              ctx.response.body = 'There is an illegal operation'
            } else {
              next()
            }
          } catch {
            next()
          }
        } else {
          next()
        }
      } else {
        next()
      }
    })
  }

  app.use((ctx) => {
    if (/serverLog/.test(ctx.request.url)) {
      return
    }
    try {
      // ctx.url = ctx.url.replace(/%25/g, '%') // 浏览器不能解码%字符，需要处理一下
      decodeURIComponent(ctx.url)
      ctx.status = 200
      ctx.respond = false // Bypass Koa's built-in response handling
      ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
      nuxt.render(ctx.req, ctx.res)
    } catch (e) {
      ctx.response.redirect(`/404?originUrl=${encodeURIComponent(ctx.request.url)}`)
      // ctx.res.end()
    }
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

const deleteCookieValue = function(cookieName, cookie) {
  if (cookie.length > 0) {
    let begin = cookie.indexOf(cookieName + '=')
    if (begin !== -1) {
      begin += cookieName.length + 1
      let end = cookie.indexOf(';', begin)
      if (end === -1) {
        end = cookie.length
      }
      return cookie.substr(0, begin) + cookie.substr(end)
    }
  }
  return cookie
}

// function addListen() {
//   if (process.env.STAGE_NAME === 'test' || process.env.ENV_ID == 4) {
//     return require('elastic-apm-node').start({
//       // logLevel: 'trace',
//       // Override service name from package.json
//       // Allowed characters: a-z, A-Z, 0-9, -, _, and space
//       serviceName: `riven-az-pc-${process.env.STAGE_NAME}${process.env.ENV_ID ? '-' + process.env.ENV_ID : ''}`,
//
//       // Use if APM Server requires a token
//       secretToken: '',
//
//       // Use if APM Server uses API keys for authentication
//       apiKey: '',
//
//       // Set custom APM Server URL (default: http://localhost:8200)
//       serverUrl: 'http://kibana-apm.opsfun.com:8200/'
//     })
//   }
// }
start()
