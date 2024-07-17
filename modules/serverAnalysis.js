import { Base64 } from 'js-base64'
// import { getDeviceId, getCookie, initSessionId, getChannel, getRoutePath } from './pointUtil'

const MD5 = require('js-md5')
const axios = require('axios').default
const glob = require('glob')

const entries = getEntry('./pages/**/*.vue')

let mergeRouters = []

export default function(nuxt, options) {
  this.nuxt.hook('render:before', (renderer, options) => {
    const renderRoute = renderer.renderRoute.bind(renderer)
    // 重写renderer.renderRoute
    renderer.renderRoute = function(route, context) {
      if (mergeRouters.length < entries.length) {
        mergeRouters = this.nuxt.options.router.extendRoutes([...entries])
      }

      let path = route.split('?')[0]
      path = path.split('#')[0]
      let routePath = getRoutePath(mergeRouters, path)

      context._bi = {
        date: new Date(),
        route,
        routePath,
        path,
        host:
          context &&
          context.req &&
          ((context.req.headers && (context.req.headers['x-original-host'] || context.req.headers.host)) ||
            context.req.hostname ||
            context.req.host)
      }
      path = routePath = null
      return renderRoute(route, context)
    }
  })

  // add cache hit header
  this.nuxt.hook('render:route', (url, result, context) => {
    try {
      let currentDate = +new Date()
      let list = [
        {
          utc: 'page',
          utv: 'ssr_render',
          utl: -1,
          utt: currentDate - context._bi.date,
          lgt: currentDate,
          param1: context._bi.path,
          param4: ((result && result.html) + '').length
        }
      ]
      if (context.nuxt.state.analysis) {
        list.push({
          utc: 'page',
          utv: 'ssr_ayncdata_before',
          utl: -1,
          utt: context.nuxt.state.analysis.commonAsyncDataInit - context._bi.date,
          param1: context._bi.path,
          lgt: currentDate
        })
        if (context.nuxt.state.analysis.asyncDataEnd) {
          list.push({
            utc: 'page',
            utv: 'ssr_ayncdata',
            utl: -1,
            utt: context.nuxt.state.analysis.asyncDataEnd - context.nuxt.state.analysis.commonAsyncDataInit,
            param1: context._bi.path,
            lgt: currentDate
          })
          list.push({
            utc: 'page',
            utv: 'ssr_ayncdata_after',
            utl: -1,
            utt: currentDate - context.nuxt.state.analysis.asyncDataEnd,
            param1: context._bi.path,
            lgt: currentDate
          })
        }
        list.push({
          utc: 'page',
          utv: 'ssr_ayncdata_common',
          utl: -1,
          utt: context.nuxt.state.analysis.commonAsyncDataEnd - context.nuxt.state.analysis.commonAsyncDataInit,
          param1: context._bi.path,
          lgt: currentDate
        })
      }
      trackData(context._bi.host, context._bi.routePath, 'timings', list)
      list = currentDate = context._bi = null
    } catch (error) {
      // console.log()
    }
  })

  // 以下未触发
  // this.nuxt.hook('render:end', (url, result, context) => {
  //   console.log('render:end')
  // })

  // this.nuxt.hook('render:after', (url, result, context) => {
  //   console.log('render:after')
  // })
  // this.nuxt.hook('render:beforeResponse', (url, result, context) => {
  //   console.log('render:beforeResponse')
  // })
  // this.nuxt.hook('render:createRenderer', (url, result, context) => {
  //   console.log('render:createRenderer')
  // })
  // this.nuxt.hook('render:resourcesLoaded', (url, result, context) => {
  //   console.log('render:resourcesLoaded')
  // })
}

const getRoutePath = (routers, path, prePath = '') => {
  // {
  //   name: 'index',
  //   path: '/',
  //   component: 'D:\\\\code\\\\riven-az-pc\\\\pages\\\\index.vue',
  //   chunkName: 'pages/index',
  //   _name: '_3843dca2'
  // }
  let page = ''
  for (let i = 0; i < routers.length; i++) {
    if (routers[i].path === path) {
      page = routers[i].path
      break
    } else if (routers[i].alias) {
      for (let j = 0; j < routers[i].alias.length; j++) {
        const item = routers[i].alias[j]
        const reg = new RegExp(item.replace(/\*/g, '.*'))
        if (reg.test(path)) {
          page = routers[i].path
          break
        }
      }
      if (page) break
    }
  }

  if (page) {
    return page
  } else {
    return '-1'
  }
}

/* eslint-disable */
const trackData = (host, routePath, type = '', value = {}) => {
  try {
    const sessionId = 'server-sessionId'
    const deviceId = 'server-deviceId'
    const userId = 'server-userId'
    const userAgent = 'server-userAgent'
    const title = 'server-title'
    const requestFunc = () => {
      const parameters = {
        pl: 1,
        p: 1, // 1 pc 2 m
        fd: host,
        cid: deviceId,
        // ia: undefined,
        uid: userId,
        sid: sessionId,
        cv: '-1',
        nw: '-1',
        sr: '-1',
        // md: undefined,
        // ov: undefined,
        ua: userAgent,
        dh: host,
        dp: routePath,
        dt: title,
        ct: new Date().getTime(),
        ops: '-1',
        opm: '-1',
        opc: '-1'
      }
      let path
      if (type === 'pageview') {
        parameters.pageviews = [value]
        path = '/api/v1/pageviews'
      } else if (type === 'event') {
        parameters.events = [value]
        path = '/api/v1/events'
      } else if (type === 'events') {
        parameters.events = value
        path = '/api/v1/events'
      } else if (type === 'timing') {
        parameters.timings = [value]
        path = '/api/v1/timings'
      } else if (type === 'timings') {
        parameters.timings = value
        path = '/api/v1/timings'
      } else if (type === 'transaction') {
        parameters.transactions = [value]
        path = '/api/v1/transactions'
      } else if (type === 'item') {
        parameters.items = [value]
        path = '/api/v1/items'
      } else if (type === 'items') {
        parameters.items = value
        path = '/api/v1/items'
      } else {
        // do nothing
        return
      }
      const isInternalTest = !host.startsWith('www.') && !host.startsWith('m.')
      const url = (isInternalTest ? 'https://collect-test.azazie.cn' : 'https://collect.azazie.cn') + path
      if (isInternalTest) {
        // console.table(parameters)
        // console.table(value)
      }
      // sign
      let signString = ''
      Object.keys(parameters)
        .sort()
        .map((key) => {
          if (
            key != 'sign' &&
            key != 'pageviews' &&
            key != 'events' &&
            key != 'timings' &&
            key != 'transactions' &&
            key != 'items' &&
            parameters[key]
          ) {
            if (signString.length > 0) signString += '&'
            signString += key + '=' + parameters[key]
          }
        })
      signString += '&secretkey=' + (isInternalTest ? 'me02kunyfqcejqbdwlaf0ghs3j2r8wuu' : 'cTjoS9QytJ2M4UKBnjNj3miow7ftkMu6')
      parameters.sign = MD5(Base64.encode(signString.toLowerCase()))
      axios
        .post(url, parameters)
        .then((res) => {
          // console.log('track nebulas success ====>', JSON.stringify(parameters))
        })
        .catch((e) => {
          // console.table('statisticsLebbay====fail  ', JSON.stringify(parameters));
        })
    }
    requestFunc()
  } catch (e) {
    // console.log('trackNebulas:', e)
  }
}

function getEntry(globPath) {
  const entries = []
  if (typeof globPath !== 'object') {
    globPath = [globPath]
  }
  globPath.forEach((itemPath) => {
    glob.sync(itemPath).forEach(function(entry) {
      let arr = entry.split('/')
      arr = arr.slice(2).map((item) => {
        return item.endsWith('.vue') ? item.slice(0, item.length - 4) : item
      })
      entries.push({
        path: '/' + arr.join('/')
      })
      if (arr[arr.length - 1] === 'index') {
        entries.push({
          path: '/' + arr.slice(0, arr.length - 1).join('/')
        })
      }
    })
  })
  return entries
}
