'use strict'
const path = require('path')
const request = require('request')
const userAgent = require('useragent')
const { getEnvironment } = require('../environment')
const { logger2 } = require('../../server/logger')
const { handleCacheCountry, removeURLParameters } = require('../../assets/js/utils')
const { getOriginalVersionGroup } = require('../../assets/js/originalVersionGroup')
const supportCountryList = require('../../modules/supportCountryList')
const seoLanguages = require('../../modules/supportSeoLanguage')
const { redisListSod } = require('../../modules/redisPages')
const _require = require('./serializer')
const serialize = _require.serialize
const deserialize = _require.deserialize

const makeCache = require('./cache-builders')

const isDevelopment = !['production'].includes(process.env.NODE_ENV) || process.env.NODE_ENV_TEST
const isLocalDev = false // 开启本地redis调试
const versionUtils = require('./getVersion')
const filterParams = [
  'country',
  'currency',
  'utm_type',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_id',
  'utm_term',
  'utm_content',
  'from',
  'from_type',
  'bundleId',
  'fromPage',
  'campaigncountry',
  'gclid',
  'gbraid',
  'gad_source',
  'model_source',
  't',
  'from_showroom',
  'share_channel',
  'client_id',
  'session_id',
  'msclkid',
  'epik',
  'pp'
] // 缓存路径过滤参数

module.exports = function cacheRenderer(nuxt, config) {
  if (isDevelopment && !isLocalDev) return
  // used as a nuxt module, only config is provided as argument
  // and nuxt instance will be provided as this context
  if (arguments.length < 2 && this.nuxt) {
    nuxt = this.nuxt
    config = this.options
  }

  if (!config.cache || !Array.isArray(config.cache.pages) || !config.cache.pages.length || !nuxt.renderer) {
    return
  }

  const currentVersion = config.version || config.cache.versionrn
  const cache = makeCache(config.cache.store)
  cleanIfNewVersion(cache, currentVersion)

  const renderer = nuxt.renderer
  const renderRoute = renderer.renderRoute.bind(renderer)

  // 判断路由匹配
  function isCacheFriendly(path, context) {
    // 推广参数截取 utm_source=facebook&utm_medium=cpc&utm_campaign={{campaign.id}}&utm_id={{campaign.name}}&utm_term={{adset.id}}&utm_content={{ad.id}}
    // country=US&currency=USD
    // subsite=bridal
    // from=search
    let tempPath = path
    // 针对特殊路径处理参数后进行路径匹配，进行redis缓存
    let redisParams = ['subsite', ...filterParams]
    if (tempPath.startsWith('/products/')) redisParams = [...redisParams, 'q', 'size', 'color'] // 详情页移除q、size、color参数
    tempPath = removeURLParameters(tempPath, redisParams)

    if (tempPath == '') tempPath = '/'
    if (typeof config.cache.isCacheable === 'function') {
      return config.cache.isCacheable(tempPath, context)
    }

    return (
      !(context && context.res && context.res.spa) &&
      config.cache.pages.some(function(pat) {
        return pat instanceof RegExp ? pat.test(tempPath) : tempPath === pat
      })
    )
  }

  // lighthouse简化
  function getLightHouseKey(route, context, config, forced, country, tempPath) {
    const host =
      context.req &&
      ((context.req.headers && (context.req.headers['x-original-host'] || context.req.headers.host)) ||
        context.req.hostname ||
        context.req.host)

    const environment = getEnvironment(host)

    const isPreview = host.includes('preview')

    if (isPreview) return false

    if (!['prod', 'pre'].includes(environment)) {
      return false
    }

    if (forced || isCacheFriendly(tempPath, context)) {
      // 定制首页渲染
      const webpKey = context.req && context.req.is_support_webp ? '/wp' : '/nwp'
      const cacheKey = `${environment}/${country}/${config.cache.platform}/light-house${webpKey}${route}`
      return config.cache.useHostPrefix === true ? path.join(host, cacheKey) : cacheKey
    } else {
      // console.log('没有命中')
      return false
    }
  }

  // 获取redis key
  function getRedisKey(route, context, config) {
    let tempPath = route
    // 处理MX、FR 根据语言路径定国家
    const currentSeoLanguages = seoLanguages.filter(
      (item) => route == `/${item}` || route.startsWith(`/${item}?`) || route.startsWith(`/${item}/`)
    )
    if (currentSeoLanguages.length) {
      tempPath = route.substring(currentSeoLanguages[0].length + 1, route.length)
    }

    if (!context.req.is_chrome_lighthouse) {
      // 路由相等判断
      const needCache = isCacheFriendly(tempPath, context)
      if (!needCache) return Promise.resolve()
    }

    const resCountry = handleCacheCountry(context)
    if (!resCountry) {
      // 如果没有获取到国家，则不进行缓存
      return Promise.resolve('')
    }

    if (isLocalDev) {
      // const webVersionName = getWebAkey(getOriginalVersionGroup(context), '15b0ff5248f0e31a24481b7987a8fcdc', tempPath)
      // console.log('----webVersionName--', webVersionName)
      // console.log('----tempPath---', tempPath)
      return Promise.resolve(route)
    }

    if (context.req.is_chrome_lighthouse) {
      // is_chrome_lighthouse 维持
      const forcePages = config.cache.lighthousePages || [/^\/products\//, /^\/$/]
      const hasLighthouse =
        context.req.is_chrome_lighthouse &&
        !(context && context.res && context.res.spa) &&
        forcePages.some(function(pat) {
          return pat instanceof RegExp ? pat.test(route) : route === pat
        })
      const cachedKey = getLightHouseKey(route, context, config, hasLighthouse, resCountry, tempPath)
      if (cachedKey && hasLighthouse) {
        if (!cachedLighthouse.includes(cachedKey)) cachedLighthouse.push(cachedKey)
        if (cachedLighthouse.length > cachedLighthouseMaxLength) {
          cache.del(cachedLighthouse.shift())
        }
      }
      return Promise.resolve(cachedKey)
    } else {
      // return requestCountryList(context).then((countryData) => {
      let hasSupport = false //  是否是支持的国家
      if (supportCountryList && supportCountryList.length && resCountry) {
        hasSupport = supportCountryList.some((ele) => {
          return ele.toUpperCase() === resCountry
        })
      }
      if (hasSupport) {
        // 判断是否是支持的国家，是的话，则对页面数据进行缓存
        // 用户缓存 缺少 preview账户判断
        return getCustomKey(route, context, config, resCountry, tempPath)
      } else {
        return Promise.resolve('')
      }
      // })
    }
  }

  // 获取客户端key
  function getCustomKey(route, context, config, country, tempPath) {
    // host 判断
    const host = context.req.headers['x-original-host'] || context.req.headers.host || context.req.hostname || context.req.host
    const isPreview = host.includes('preview')
    if (isPreview) return Promise.resolve()
    const hostKey = config.cache.useHostPrefix === true && !host.includes('www.') ? host : '' // 特殊处理:正式环境不加host
    // 国家 语言 webp判断
    const baseKey = getPageKey(context, country)
    let basePageKey = `${host.includes('www.') ? '' : '/' + baseKey.environment}/${baseKey.country}/${baseKey.platform}/${baseKey.webp}`
    // 特殊处理dresses大小图
    if (tempPath === '/all/dresses') {
      const SOD_VIEW_NEW = getCookie('SOD_VIEW_NEW', context.req.headers.cookie)
      basePageKey += '/' + SOD_VIEW_NEW
    }
    // 本地端口号
    // const apiHost = (config.server && config.server.port) || 3000
    const apiHost = context.req.headers.host
    // console.log(context.req.headers)
    // 获取ab配置
    return requestVerison(apiHost, baseKey).then((versionGroup) => {
      // console.log('请求结果 requestVerison', !!versionGroup)
      // 存在versionGroup ==> {} 返回 redis缓存key名
      if (versionGroup) {
        let abKey = 'abKey'
        const abtest = (context.req.headers.cookie && getCookie('abtest', context.req.headers.cookie)) || context.req.headers['x-abtest']
        // 获取abkey
        abKey = getAbKey(versionGroup, abtest, tempPath, context)
        // view_switch SOD_VIEW_NEW 判断
        if (isList(tempPath)) {
          let viewSwitch = context.req.headers.cookie && getCookie('view_switch', context.req.headers.cookie)
          if (!['smaller', 'larger'].includes(viewSwitch)) viewSwitch = 'smaller'
          if (tempPath === '/all/dresses') {
            const firstQuery = pathToFilters(tempPath)
            const sodViewNewCookie =
              (context.req && context.req.headers && getCookie('SOD_VIEW_NEW', context.req.headers.cookie)) || 'petite'
            let sodViewNew = firstQuery.viewMode ? firstQuery.viewMode : [sodViewNewCookie]
            sodViewNew = sodViewNew || 'petite'
            if (sodViewNew[0] === 'petite_plus') {
              viewSwitch = 'smaller'
            }
            abKey += '/' + sodViewNewCookie
          }
          abKey += '/' + viewSwitch
        }
        let redisRoute = route
        // 针对特殊路径处理参数后进行路径匹配，进行redis缓存,'subsite' 不处理，因为缓存内容不同
        let redisParams = filterParams
        if (tempPath.startsWith('/products/')) redisParams = [...redisParams, 'q', 'size', 'color'] // 详情页移除q、size参数
        redisRoute = removeURLParameters(redisRoute, redisParams)
        return hostKey + basePageKey + redisRoute + abKey
      } else {
        // 不存在 ==> 缓存失效或者并发请求 ==> 页面正常渲染 且 不缓存
        return ''
      }
    })
  }

  renderer.renderRoute = function(route, context) {
    context.webApiOptions = context.webApiOptions || {}
    context.webApiOptions.apiStore = apiStore
    context.webApiOptions.redisCache = cache

    // 依据ua 获取 webp lighthouse信息
    const chromeAgent = 'chrome-lighthouse'
    if (context && context.req && context.req.headers && context.req.headers['user-agent']) {
      const userAgent = context.req.headers['user-agent'] || ''
      if (userAgent.toLocaleLowerCase().includes(chromeAgent)) {
        context.req.is_chrome_lighthouse = true
      }
      context.req.is_support_webp = isSupportWebp(userAgent)
      // requestXApp为空是响应式页面
      context.req.request_x_app = requestXApp || (judgeIsMobileDevice(userAgent) ? 'h5' : 'pc')
      context.req.platform = context.req.request_x_app
      if (!requestXApp) {
        context.req.platform = 'react-' + context.req.platform
        if (context.req.platform === 'react-pc') {
          context.req.platform += getCookie('isSmallScreen', context.req.headers.cookie || '') === 'true' ? '-small' : '-big'
        }
        config.cache.platform = context.req.platform
      }
    }
    // hopefully cache reset is finished up to this point.
    tryStoreVersion(cache, currentVersion)
    // 获取键名 执行渲染
    return getRedisKey(route, context, config)
      .then((cacheKey) => {
        // console.log('-----cacheKey---->', cacheKey)
        // 无键名 直接渲染
        if (!cacheKey) return renderRoute(route, context)

        function renderSetCache() {
          return renderRoute(route, context).then(function(result) {
            // 仅缓存 非异常数据
            if (!result.error && !result.redirected) {
              cache.setAsync(cacheKey, serialize(result))
            }
            return result
          })
        }

        return cache
          .getAsync(cacheKey)
          .then(function(cachedResult) {
            if (cachedResult) {
              context.req.redis_cache_status = 'HIT'
              return deserialize(cachedResult)
            }

            return renderSetCache()
          })
          .catch(renderSetCache)
      })
      .catch((e) => {
        const host =
          context.req &&
          ((context.req.headers && (context.req.headers['x-original-host'] || context.req.headers.host)) ||
            context.req.hostname ||
            context.req.host)

        const environment = getEnvironment(host)
        // 只收录生产环境的报错
        if (environment == 'prod') {
          const errInfo = {
            time: new Date(),
            appName: '网站PC',
            biz: 'FRONT', // 业务线 FRONT BACKEND  ERP  BI
            level: 'ERROR', // 日志级别 FATAL、ERROR、WARN、INFO、DEBUG、TRACE等
            severity: `Sev-3`, // 告警级别 Sev-x
            errorCode: `420`, // 错误码,如果有标准错误码定义的话，没有该字段就去掉
            errorMetric: `redis-error&msg=${e.message}`, // 错误关键字
            message: e.stack, // 错误信息
            extra: {
              requestUri: route, // abc
              sourceUri: route
            }
          }
          logger2.error(JSON.stringify(errInfo))
        }

        return renderRoute(route, context)
      })
  }

  return cache
}

const isSupportWebp = (userAgentString) => {
  const agent = userAgent.lookup(userAgentString)
  const browsersToInclude = [
    { browser: 'Chrome', version: 23 },
    { browser: 'Opera', version: 15 },
    { browser: 'Android', version: 53 },
    { browser: 'Chrome Mobile', version: 55 },
    { browser: 'Opera Mobile', version: 37 },
    { browser: 'UC Browser', version: 11 },
    { browser: 'Samsung Internet', version: 4 }
  ]

  const supportingBrowser = browsersToInclude.find((browser) => browser.browser === agent.family && agent.major >= browser.version)

  return supportingBrowser
}

// 前端定义ab 自定义各页面的abtest
const getWebAkey = (originalVersionGroup, abtest, route) => {
  const data = versionUtils.getVersionInfo(originalVersionGroup, abtest)
  const keys = []
  // 全站abtest
  if (data.activityAbtest) keys.push(`activity=${data.activityAbtest}`)

  // 首页abtest
  if (route === '/') {
    //
  }

  // 详情页面的abtest
  if (route.startsWith('/products/')) {
    if (data.bestSellerAbtest) keys.push(`bestSeller=${data.bestSellerAbtest}`)
  }

  // 列表、详情 abtest
  if (redisListSod.includes(route) || route.startsWith('/products/')) {
    if (data.sodGalleryVersion) keys.push(`sodGalleryVersion=${data.sodGalleryVersion}`)
  }

  const pageVersionName = keys.join('_')
  return pageVersionName
}

const getAbKey = (versionGroup, abtest, route, context) => {
  const data = versionUtils.getVersionInfo(versionGroup, abtest)
  const keys = []
  // banner_navigation_top
  if (data.banner_navigation_top) keys.push(`navigation_top=${data.banner_navigation_top}`)
  // 自定义各页面的abtest
  if (route === '/') {
    keys.push(`custom_home=${data.home_custom_home}`)
  }
  if (isList(route)) {
    keys.push(`banner_left=${data.filter_banner_list_left}`)
    keys.push(`banner_top=${data.banner_list_top}`)
  }
  if (route === '/all/sale') {
    keys.push(`banner_footer=${data.banner_sale_footer}`)
    keys.push(`banner_top=${data.banner_sale_top}`)
  }
  // 需要处理ngnix转发的 abtest,如列表页
  const pageVersionName = keys.join('_')
  const webVersionName = getWebAkey(getOriginalVersionGroup(context), abtest, route)
  return '/' + pageVersionName + '-' + webVersionName
}

const isList = (route) => {
  const list = [
    '/all/bridesmaids-bridal-party',
    '/all/bridesmaid-dresses',
    '/all/bridesmaid-dresses/colors/terracotta',
    '/all/bridesmaid-dresses/colors/dusty-rose',
    '/all/bridesmaid-dresses/with/brand/pnina-tornai-for-azazie',
    '/all/bridesmaid-dresses/colors/burgundy',
    '/all/bridesmaid-dresses/colors/red',
    '/all/bridesmaid-dresses/colors/eucalyptus',
    '/all/bridesmaid-dresses/colors/champagne',
    '/all/bridesmaid-dresses/colors/blushing-pink',
    '/all/maternity-bridesmaid-dresses',
    '/all/modest-bridesmaid-dresses',
    '/all/junior-bridesmaid-dresses',
    '/all/flower-girl-dresses',
    '/all/separates',
    '/all/wedding-dresses',
    '/all/mother-of-the-bride-dresses',
    '/all/plus-size-mother-of-the-bride-dress',
    '/all/dresses',
    '/all/communion-dresses',
    '/all/accessories',
    '/all/groomsmen-accessories',
    '/all/women-accessories',
    '/all/face-masks',
    '/all/garment-bags',
    '/all/guest-of-wedding-dresses',
    '/all/guest-of-wedding-dresses?current_in_stock=yes',
    '/all/formal-and-evening-dresses',
    '/all/formal-and-evening-dresses?current_in_stock=yes',
    '/swatches-fabric',
    '/all/sample-dresses?current_in_stock=yes',
    '/all/sample-brides?current_in_stock=yes',
    '/all/sample-maternity?current_in_stock=yes',
    '/all/sample-modest?current_in_stock=yes',
    '/all/sample-mother-of-the-bride?current_in_stock=yes',
    '/all/ready-to-ship?current_in_stock=yes',
    '/all/ready-to-ship-brides?current_in_stock=yes',
    '/all/ready-to-ship-bridesmaids?current_in_stock=yes',
    '/all/ready-to-ship-maternity?current_in_stock=yes',
    '/all/ready-to-ship-modest?current_in_stock=yes',
    '/all/ready-to-ship-mother-of-the-brides?current_in_stock=yes',
    '/all/ready-to-ship-formal?current_in_stock=yes',
    '/all/last-chance-outlet?current_in_stock=yes'
  ]
  return list.some((item) => item === route)
}

/**/

/**
 * 获取缓存键名/文件夹
 * @param {*} context
 * @param {*} baseKey
 * @returns
 */
// 目录 / 环境 / 国家/ webp
const getPageKey = (context, country = '') => {
  // 国家 或语言
  // ab-test
  // preivew?
  let host = ''
  // 不同路由别名带参数跳转的时候会重新走 asyncData ，并且无 req/res 参数
  if (context.req) {
    // 添加报错日志路径追踪
    host = context.req.headers['x-original-host'] || context.req.headers.host
  }
  let environment = 'dev'
  if (
    host.includes('p.') ||
    host.includes('px') ||
    host.includes('p2.') ||
    host.includes('p3.') ||
    host.includes('p4.') ||
    host.includes('p5.')
  ) {
    environment = 'pre'
  } else if (host.includes('www.') || host.includes('x.') || host.includes('x-internal.')) {
    environment = 'prod'
  } else if (host.includes('ft')) {
    environment = 'test'
  }

  const webp = context.req.is_support_webp ? 'wp' : 'nwp'
  const platform = context.req.platform
  const xApp = context.req.request_x_app
  return {
    environment,
    country,
    webp,
    platform,
    xApp
  }
}

function cleanIfNewVersion(cache, version) {
  if (!version) return
  return cache.getAsync('appVersion').then(function(oldVersion) {
    if (oldVersion !== version) {
      // console.log('Cache updated from '.concat(oldVersion, ' to ').concat(version))
      return cache.resetAsync() // unfortunately multi cache doesn't return a promise
      // and we can't await for it so as to store new version
      // immediately after reset.
    }
  })
}

function tryStoreVersion(cache, version) {
  if (!version || cache.versionSaved) return
  return cache
    .setAsync('appVersion', version, {
      ttl: null
    })
    .then(function() {
      cache.versionSaved = true
    })
}

// 数据写入加锁与解锁 并转化为promise
const triggerEvent = (lockedKey, cb) => {
  if (!lockMap.get(lockedKey)) {
    // 加锁
    lockMap.set(lockedKey, true)
    let p = cb()
    p = p instanceof Promise ? p : Promise.resolve(p)
    return p.finally((data) => {
      // console.log('解锁', lockedKey, data)
      lockMap.set(lockedKey, false)
    })
  } else {
    // console.log('已锁定', lockedKey)
    return Promise.resolve()
  }
}

/**
 * test-version请求
 * @param {*} options 请求参数
 * @param {*} storeKey 缓存key
 * @param {*} date 时间
 * @returns
 */
const requestVerisonAxios = (options, storeKey, date) => {
  // console.log('执行请求', storeKey)
  return new Promise((resolve, reject) => {
    request(options, (error, res, body) => {
      try {
        if (error) {
          reject(error)
        }
        const data = JSON.parse(body)
        const versionGroup = data && data.data && data.data.versionGroup
        // console.log(versionGroup)
        // 是否修正数据中只有一个配置的?
        // for (const k in versionGroup) {
        //   if (versionGroup[k].list.length > 1) {
        //     // console.log(k, versionGroup[k].list.length)
        //   }
        // }
        // // 已缓存数据
        // if (versionData && versionData.versionGroup) {
        //   const ischanged = versionUtils.configHasChange(versionData.versionGroup, versionGroup)
        //   if (ischanged) {
        //     try {
        //       // flushdb
        //     } catch {}
        //   }
        // }
        if (versionGroup) {
          apiStore.set(storeKey, {
            versionGroup,
            date
          })
          resolve(versionGroup)
        } else {
          reject(new Error('response error: no versionGroup'))
        }
      } catch (error) {
        reject(error)
      }
    })
  })
}

/**
 * 获取配置数据
 * @param {*} apiHost
 * @param {*} baseKey
 * @returns
 */
const requestVerison = (apiHost, baseKey) => {
  const baseUrl = `http://${apiHost}/${baseKey.environment}`
  // const baseUrl = `http://localhost:${apiHost}/${baseKey.environment}`
  // const baseUrl = `/${baseKey.environment}` // request.js => Invalid URI "/dev/1.0-2/common/test-version"
  const url = baseUrl + '/1.0/common/test-version?countryCode=' + baseKey.country
  const storeKey = `${url}-${baseKey.country}-${baseKey.xApp}`
  const versionData = apiStore.get(storeKey)
  const date = new Date()
  if (versionData && date - versionData.date <= expire.api) {
    // console.log('有效数据', storeKey)
    return Promise.resolve(versionData.versionGroup)
  } else {
    // console.log('无数据或者无效数据', storeKey)
    return triggerEvent(storeKey, () => {
      return requestVerisonAxios(
        {
          url,
          method: 'get',
          headers: {
            'x-countryCode': baseKey.country,
            'x-app': baseKey.xApp
          }
        },
        storeKey,
        date
      )
    })
  }
}

/**
 * web-config请求
 * @param {*} options 请求参数
 * @param {*} storeKey 缓存key
 * @param {*} date 时间
 * @returns
 */
// const requestCountryAxios = (options, storeKey, date) => {
//   return new Promise((resolve, reject) => {
//     request(options, (error, res, body) => {
//       try {
//         // logger.error({ error: `redis-error-body&${body}&error=${error}` })
//         if (error) {
//           reject(error)
//         }
//         const data = JSON.parse(body)
//         const countryData = data && data.data
//         if (countryData) {
//           apiStore.set(storeKey, {
//             countryData,
//             date
//           })
//           resolve(countryData)
//         } else {
//           reject(new Error('response error: no countryData'))
//         }
//       } catch (error) {
//         reject(error)
//       }
//     })
//   })
// }

/**
 * 获取国家数据
 * @param {*} apiHost
 * @param {*} baseKey
 * @returns
 */
// const requestCountryList = (context) => {
//   const apiHost = context.req.headers.host
//   const baseKey = getPageKey(context)
//   const baseUrl = `http://${apiHost}/${baseKey.environment}`
//   const url = baseUrl + '/1.0/common/web-config'
//   const storeKey = `${url}-${baseKey.xApp}`
//   const countryData = apiStore.get(storeKey)
//   const date = new Date()
//   if (countryData && date - countryData.date <= expire.api) {
//     return Promise.resolve(countryData.countryData)
//   } else {
//     return triggerEvent(storeKey, () => {
//       return requestCountryAxios(
//         {
//           url,
//           method: 'get',
//           headers: {
//             'x-app': baseKey.xApp
//           }
//         },
//         storeKey,
//         date
//       )
//     })
//   }
// }

const getCookie = function(cookieName, cookie = '') {
  if (cookie.length > 0) {
    const cookieArr = cookie.split(';')
    const cookieObj = {}
    cookieArr.forEach((cookie) => {
      const tempCookieArr = cookie.trim().split('=')
      cookieObj[tempCookieArr[0]] = tempCookieArr[1] || null
    })
    return (cookieObj[cookieName] && unescape(cookieObj[cookieName])) || null
  }
  return null
}

const judgeIsMobileDevice = (userAgent) => {
  const ua = userAgent || (typeof navigator === 'object' && navigator.userAgent) || ''
  // pad 不算mobile
  const ipad = ua.match(/(iPad).*OS\s([\d_]+)/)
  const isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/)
  const isAndroid = ua.match(/(Android)\s+([\d.]+)/)
  const isMobile = !!ua.match(/Mobile/g) || isIphone || isAndroid
  return !!isMobile
}

// 配置
const expire = {
  api: 1000 * 60 * 5
}
// 缓存与锁
const lockMap = new Map()
const apiStore = new Map()
// 最大缓存键值数量
const cachedLighthouse = []
const cachedLighthouseMaxLength = 10
// 请求头-平台
const requestXApp = 'pc' // 'pc' => pc, 'h5' => h5, '' => 响应式
function pathToFilters(urlPath) {
  const url = urlToFormatUrl(urlPath)
  try {
    // 将url中的path和query区分
    // 处理 query
    let path
    if (url.includes('?')) {
      path = /(.*)\?.*/.exec(url)
      path && path.length && (path = path[1])
    } else {
      path = url
    }
    // const query = getUrlQuery(url)
    if (path === '/swatches-fabric') {
      return {
        viewMode: ['petite']
      }
    }
    if (path === '/fabrics') {
      return {
        viewMode: ['petite']
      }
    }
    if (path === '/swatches') {
      return {
        viewMode: ['petite']
      }
    }
    // plus-size 处理
    let viewMode
    if (path.includes('/plus-size')) {
      viewMode = ['plus']
    }
    // if (query.sod_view) {
    //   switch (query.sod_view) {
    //     case 'petite':
    //       viewMode = ['petite']
    //       break
    //     case 'plus':
    //       viewMode = ['plus']
    //       break
    //     case 'petite_plus':
    //       viewMode = ['petite_plus']
    //       break
    //     default:
    //       viewMode = ['petite']
    //       break
    //   }
    // }

    return {
      viewMode
    }
  } catch (error) {
    return {
      viewMode: ['petite']
    }
  }
}

// 链接映射表
const formatUrlList = [
  {
    reg: '(/[a-zA-Z]{2})?/engagement-dresses/?$',
    format: '$1/all/bridesmaid-dresses?earmarkGoodsKey=engagement'
  },
  {
    reg: '(/[a-zA-Z]{2})?/engagement-dresses/(.*)$',
    format: '$1/all/bridesmaid-dresses/$2?earmarkGoodsKey=engagement'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/little-black-dresses(.*)?',
    format: '$1/all/dresses/colors-family/black/with/length/midi,mini/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/white-dresses(.*)?',
    format: '$1/all/dresses/colors-family/white/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/maxi-dresses(.*)?',
    format: '$1/all/dresses/with/length/maxi/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/midi-dresses(.*)?',
    format: '$1/all/dresses/with/length/midi/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/short-dresses(.*)?',
    format: '$1/all/dresses/with/length/midi,mini/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/long-sleeve-dresses(.*)?',
    format: '$1/all/dresses/with/sleeves/long-sleeve/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/halter-dresses(.*)?',
    format: '$1/all/dresses/with/neckline/halter/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/black-dresses(.*)?',
    format: '$1/all/dresses/colors-family/black/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/blue-dresses(.*)?',
    format: '$1/all/dresses/colors-family/blue/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/red-dresses(.*)?',
    format: '$1/all/dresses/colors-family/red/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/pink-dresses(.*)?',
    format: '$1/all/dresses/colors-family/pink/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/green-dresses(.*)?',
    format: '$1/all/dresses/colors-family/green/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/yellow-dresses(.*)?',
    format: '$1/all/dresses/colors-family/yellow/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/grey-dresses(.*)?',
    format: '$1/all/dresses/colors-family/grey/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/gold-dresses(.*)?',
    format: '$1/all/dresses/colors-family/gold/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/dress/([^/]+)-bridesmaid-dresses',
    format: '$1/all/bridesmaid-dresses/colors/$2?is_seo_color=true'
  },
  {
    reg: '/(nbcf)',
    format: '/all/bridesmaid-dresses/colors-family/$1'
  },
  {
    reg: '(/[a-zA-Z]{2})?/theme/([^/]*)/?$',
    format: '$1/all/bridesmaid-dresses?theme=$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/theme/([^/]*)/(.*)$',
    format: '$1/all/bridesmaid-dresses/with/$3?theme=$2'
  }
]

/**
 * 链接映射
 * @param {String} url : 待处理链接
 * @return: String 处理之后的链接
 */
function urlToFormatUrl(url) {
  let res
  let flag = false
  for (let index = 0, len = formatUrlList.length; index < len; index++) {
    const element = formatUrlList[index]
    const regexp = new RegExp(element.reg)
    if (regexp.test(url)) {
      flag = true
      res = url.replace(regexp, formatUrlList[index].format)
      break
    }
  }
  return !flag ? url : res
}

// function getUrlQuery(url) {
//   const query = {
//     page: 1
//   }
//   if (url.includes('?')) {
//     const queryReg = /.*\?(.*)/.exec(url)
//     if (queryReg && queryReg.length) {
//       const queryStr = queryReg[1]
//       if (queryStr) {
//         const queryArr = queryStr.split('&')
//         queryArr.map((item) => {
//           const list = item.split('=')
//           query[list[0]] = list[1]
//         })
//       }
//     }
//   }
//   return query
// }
