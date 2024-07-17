const url = require('url')
const cheerio = require('cheerio')
const superagent = require('superagent')
const { logger } = require('../../server/logger')
const { sendDataToClient, sendCommonErrorToClient, requestWebApi } = require('./utils')

/**
 * web-api处理
 *  只对get请求进行了处理
 * @param {*} route
 * @param {*} context
 * @returns
 */
const webApiController = (route, context, servePort) => {
  let origin
  let host
  let urlOrigin = 'http://localhost:3000'
  if (context.req && context.req.headers) {
    origin = context.req.headers && context.req.headers.origin
    host = context.req.headers && context.req.headers.host
    if (host) urlOrigin = 'http://' + host
  }
  try {
    const routeUrl = new url.URL(route, urlOrigin)
    if (routeUrl.pathname.startsWith('/web-api/lru')) {
      return lruApiController(routeUrl, context, origin)
    } else if (routeUrl.pathname.startsWith('/web-api/page-redis')) {
      return pageRedisApiController(routeUrl, context, origin)
    } else if (routeUrl.pathname.startsWith('/web-api/page-api')) {
      return pageApiApiController(routeUrl, context, origin)
    } else if (routeUrl.pathname.startsWith('/web-api/group')) {
      return groupApiContoller(routeUrl, context, origin, servePort)
    } else if (routeUrl.pathname.startsWith('/web-api/get-list-content-params')) {
      return showListQueryApiContoller(routeUrl, context, origin, urlOrigin)
    } else {
      return sendCommonErrorToClient(context, origin)
    }
  } catch (e) {
    logger.error({ error: `redis-error&route=${route}&msg=${e.message}&stack=${JSON.stringify(e.stack || '')}` })
    return sendCommonErrorToClient(context, origin)
  }
}

/**
 * 接口缓存 清理接口
 * @param {*} routeUrl
 * @param {*} context
 * @param {*} origin
 * @returns
 */
const lruApiController = (routeUrl, context, origin) => {
  const axCache = context.webApiOptions && context.webApiOptions.axCache
  let type = ''
  if (axCache) {
    const searchParams = routeUrl.searchParams
    if (routeUrl.pathname === '/web-api/lru/delete-similar') {
      const keys = axCache.keys()
      keys.forEach((item) => {
        if (item.includes(searchParams.get('name'))) {
          axCache.del(item)
        }
      })
      type = 'delete-similar'
    } else if (routeUrl.pathname === '/web-api/lru/delete') {
      axCache.del(searchParams.get('name'))
      type = 'delete'
    } else if (routeUrl.pathname === '/web-api/lru/reset') {
      axCache.reset()
      type = 'reset'
    } else if (routeUrl.pathname === '/web-api/lru/get') {
      type = 'get'
    }
  }
  if (type) {
    const keys = axCache.keys()
    sendDataToClient(
      context,
      {
        type,
        keys: axCache.keys(), // 兼容jenkins 使用keys
        data: keys
      },
      origin
    )
  } else {
    sendCommonErrorToClient(context, origin)
  }
}

/**
 * 页面缓存 redis清理接口
 * @param {*} routeUrl
 * @param {*} context
 * @param {*} origin
 * @returns
 */
const pageRedisApiController = (routeUrl, context, origin) => {
  const cache = context.webApiOptions && context.webApiOptions.redisCache
  let type = ''
  if (cache) {
    const searchParams = routeUrl.searchParams
    if (routeUrl.pathname === '/web-api/page-redis/get') {
      type = 'get'
      return cache.keysAsync().then((data) => {
        sendDataToClient(context, { type, data }, origin)
      })
    } else if (routeUrl.pathname === '/web-api/page-redis/reset') {
      type = 'reset'
      return cache.resetAsync().then(() => {
        sendDataToClient(context, { type }, origin)
      })
    } else if (routeUrl.pathname === '/web-api/page-redis/delete') {
      type = 'delete'
      return cache.delAsync(searchParams.get('name') || '').then(() => {
        sendDataToClient(context, { type }, origin)
      })
    }
  }
  if (!type) {
    sendCommonErrorToClient(context, origin)
  }
}

/**
 * 页面缓存api清理接口
 * @param {*} routeUrl
 * @param {*} context
 * @param {*} origin
 * @returns
 */
const pageApiApiController = (routeUrl, context, origin) => {
  const apiStore = context.webApiOptions && context.webApiOptions.apiStore
  let type = ''
  if (apiStore) {
    const searchParams = routeUrl.searchParams
    if (routeUrl.pathname === '/web-api/page-api/delete-similar') {
      const keys = [...apiStore.keys()]
      keys.forEach((item) => {
        if (item.includes(searchParams.get('name'))) {
          apiStore.delete(item)
        }
      })
      type = 'delete-similar'
    } else if (routeUrl.pathname === '/web-api/page-api/delete') {
      apiStore.delete(searchParams.get('name'))
      type = 'delete'
    } else if (routeUrl.pathname === '/web-api/page-api/reset') {
      apiStore.clear()
      type = 'reset'
    } else if (routeUrl.pathname === '/web-api/page-api/get-data') {
      type = 'get-data'
      sendDataToClient(context, { type, name: searchParams.get('name'), data: apiStore.get(searchParams.get('name')) })
      return
    } else if (routeUrl.pathname === '/web-api/page-api/get') {
      type = 'get'
    }
  }
  if (type) {
    sendDataToClient(
      context,
      {
        type,
        data: [...apiStore.keys()]
      },
      origin
    )
  } else {
    sendCommonErrorToClient(context, origin)
  }
}

/**
 * 多台前置遍历接口
 * @param {*} routeUrl
 * @param {*} context
 * @param {*} origin
 * @returns
 */
const groupApiContoller = (routeUrl, context, origin, servePort) => {
  const cache = context.webApiOptions && context.webApiOptions.redisCache
  if (!cache) return sendCommonErrorToClient(context, origin)
  // @Ruizi/瑞兹
  // p环境：all_hosts_by_ops_p
  // 生产环境： all_hosts_by_ops
  let type = ''
  const searchParams = routeUrl.searchParams
  let keyName = searchParams.get('key')
  keyName =
    keyName ||
    (['www.azazie.com', 'azazie.com', 'm.azazie.com', 'www.azazie.ca', 'azazie.ca', 'm.azazie.ca'].includes(routeUrl.hostname)
      ? 'all_hosts_by_ops'
      : 'all_hosts_by_ops_p')

  if (routeUrl.pathname === '/web-api/group/get') {
    type = 'get'
    return cache.getAsync(keyName).then((data) => {
      sendDataToClient(context, { type, data }, origin)
    })
  } else if (routeUrl.pathname === '/web-api/group/trigger') {
    type = 'trigger'
    const url = searchParams.get('url')
    // 防止循环调用
    if (url && url.includes('/web-api/group')) {
      return sendCommonErrorToClient(context, origin)
    }

    return cache.getAsync(keyName).then((data) => {
      // data = data || [routeUrl.host]
      // redis无数据 默认请求当前服务接口
      data = data || ['localhost:' + servePort]
      const origins = data.map((item) => {
        return 'http://' + item + url
      })
      const jobs = origins.map((url) => {
        return requestWebApi({
          url,
          method: 'get'
        })
      })

      return Promise.allSettled(jobs).then((responses) => {
        const count = responses.length
        const responseValues = responses.filter((item) => item.status === 'fulfilled').map((item) => item.value)
        const results = responseValues.filter((item) => item.data || item.keys).map((item) => item.data || item.keys)
        const data = [...new Set(results.flat())]
        const total = {
          count,
          httpErr: count - responseValues.length,
          hasData: results.length,
          data: data.length
        }
        sendDataToClient(context, { data, total, responses }, origin)
      })
    })
  }
}

// 爬取列表页的商品数量以及listcontent接口入参数据
const showListQueryApiContoller = async (routeUrl, context, origin, urlOrigin) => {
  const searchParams = routeUrl.searchParams
  const listUrl = urlOrigin + searchParams.get('listUrl')
  const data = await getListContentParams(listUrl)
  sendDataToClient(context, { data }, origin)
}
const getListContentParams = function(listUrl) {
  let webData = {}
  return new Promise((resolve, reject) => {
    const url = decodeURIComponent(listUrl)
    superagent
      .get(url)
      .buffer(true)
      .end((err, data) => {
        // 页面获取到的数据
        if (err) {
          webData = {
            status: 404,
            data: {
              url
            },
            errMsg: err
          }
          console.error('数据获取失败了')
          resolve(webData)
          return
        }
        const html = data.text
        const $ = cheerio.load(html, {
          decodeEntities: false,
          ignoreWhitespace: false,
          xmlMode: false,
          lowerCaseTags: false
        }) // 用cheerio解析页面数据
        webData = {
          status: 200,
          data: {
            url,
            num: $('#cat-title-goods-total') && $('#cat-title-goods-total').text(), // 当前页面商品数量
            listContentQueryData:
              $('#listContentQueryData') && $('#listContentQueryData').text() && JSON.parse($('#listContentQueryData').text()) // 列表页list-content接口入参
          }
        }
        resolve(webData)
      })
  })
}

module.exports = {
  webApiController
}
