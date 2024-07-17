import { getOriginalVersionGroup } from '@/assets/js/originalVersionGroup'
import { getCookieByString } from '../assets/js/pointUtil'
import { handleReqHeaderCountry, getQueryString, getCurrentCountryUrl } from '../assets/js/utils'
import localLangs from '../assets/js/localLangs'
const { getEnvironment } = require('@/modules/environment')

/**
 * 站点信息，获取国家列表数据
 */
const getWebCongfig = async function(context) {
  const res = await context.$axios.$get(`/1.0/common/web-config`, { useCache: true })
  if (res.code == 0) {
    context.store.commit('setSiteOptions', res.data)
  }
}

/** 多语言 */
const getCommonMultiLanguages = async function(context) {
  const res = await context.$axios.$get(`/1.0/common/multi-languages?language=${context.store.state.language}`, { useCache: true })
  // code等于5表明redis链接失败，需要用户刷新重试
  if (res.code == 5) {
    context.error({
      statusCode: 200,
      message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
    })
    return
  }
  const glVar = typeof window === 'object' ? window : global
  const langKey = `langs${context.store.state.language}`
  // 方便本地开发的时候，可以在本地先新增多语言，上测试环境后记得去lego配置
  let allLangs = {
    ...res.data
  }
  const environment = context.store.state.environment
  if (environment.includes('dev')) {
    allLangs = {
      ...localLangs,
      ...res.data
    }
  }
  glVar[langKey] = allLangs

  // if (context.store.state.is_chrome_lighthouse && ['product'].includes(context.store.state.jsKey)) {
  //   allLangs = context.store.state.webLanguageKeys.reduce((pre, key) => {
  //     pre[key] = allLangs[key]
  //     return pre
  //   }, {})
  //   context.store.commit('setLangs', allLangs)
  // } else {
  //   // index list 多语言组件化拆分
  //   if (['index', 'list'].includes(context.store.state.jsKey)) {
  //     allLangs = context.store.state.webLanguageKeys.reduce((pre, key) => {
  //       pre[key] = allLangs[key]
  //       return pre
  //     }, {})
  //   }
  //   context.store.commit('setLangs', allLangs)
  // }

  return true
}

/**
 * 初始化页面支持的多语言key
 * @param {*} context
 * @param {*} languageKeys
 */
const initWebLanguageKeys = (context, languageKeys = []) => {
  if (languageKeys.length) {
    const webLanguageKeys = context.store.state.webLanguageKeys
    // 多语言code 去重
    context.store.commit('setWebLanguageKeys', Array.from(new Set([...webLanguageKeys, ...languageKeys])))
  }
}

/**
 * 异步组件，客户端更新多语言
 * @param {*} context
 * @param {*} languageKeys
 */
const loadLanguagePromise = async (context, languageKeys = []) => {
  const res = await context.$axios.$post(`/1.0/common/multi-languages?language=${context.store.state.language}`, {
    codes: Array.from(new Set(languageKeys))
  })
  if (res.code == 0) {
    if (process.client) {
      const glVar = typeof window === 'object' ? window : global
      const langKey = `langs${context.store.state.language}`
      const allLangs = { ...glVar[langKey], ...res.data }
      glVar[langKey] = allLangs
      // const allLangs = { ...context.store.state.langs, ...res.data }
      // context.store.commit('setLangs', allLangs)
      initWebLanguageKeys(context, languageKeys)
    }
  }
}

/** navigation 菜单 分类接口 */
const getNavigation = async function(context) {
  const res = await context.$axios.$get(`/1.0/navigation`, {
    params: {
      version: 'a',
      navigationBannerVersion: context.store.state.versionGroup.banner_navigation_top,
      countryCode: context.store.state.country,
      show_code: context.store.state.showLangsCode,
      topic: context.store.state.isBridal ? 'bridal' : 'azazie',
      langs: context.store.state.language
    },
    useCache: true
  })
  // code等于5表明redis链接失败，需要用户刷新重试
  if (res.code == 5) {
    context.error({
      statusCode: 200,
      message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
    })
    return
  }
  if (res.code == 0) {
    context.store.commit('setTopBarInfo', res.data.topBarInfo)
    context.store.commit('setNavigationData', res.data) // navigationData 放store
  }
}

const initActivity = function(context, activity) {
  const activities = []
  let cyberSaleInfo = null
  for (const key in activity) {
    const activityNow = activity[key]
    if (['CYBERWAZ', 'CYBERAZZ', 'CYBERWAZtes', 'CYBERAZZtes'].includes(activityNow.base.couponCode)) {
      let desc = ''
      if (activityNow.banner && activityNow.banner.activityBanner) {
        desc = activityNow.banner.activityBanner.desc || ''
      }
      cyberSaleInfo = {
        couponCode: activityNow.base.couponCode,
        desc
      }
    }
    const status = activityNow.base.status
    if (status == 'end' || status == 'not started') {
      continue
    }

    if (activityNow && activityNow.banner && activityNow.banner.navBanner) delete activityNow.banner.navBanner
    activities.push(activityNow)
  }
  context.store.commit('setCyberSaleInfo', cyberSaleInfo)
  context.store.commit('setActivityInfo', activities)
}

/**
 *  活动信息
 * @param {*} context
 * @param {*} versionObj
 * @param {*} isPageAsync 是否是页面再次请求接口，wd会在列表和详情再次调用getNavigation、getNavigationDynamic
 */
const getNavigationDynamic = async function(context, versionObj, isPageAsync = false) {
  const res = await context.$axios.$get('/1.0/navigation/dynamic', {
    params: {
      version: versionObj.activityAbtest && versionObj.activityAbtest.toLowerCase(),
      topic: context.store.state.isBridal ? 'bridal' : 'azazie',
      countryCode: context.store.state.country,
      langs: context.store.state.language
    },
    useCache: isPageAsync //  接口获取wd主题数据,针对这种情况做接口缓存
  })
  if (res.code == 0) {
    initActivity(context, res.data.activityInfo)
    if (!isPageAsync) context.store.commit('setServerTime', res.data.serverInfo.serverTime) // serverTime实时更新,不能使用缓存数据
    if (res.data.flashSaleInfo) {
      context.store.commit('setIsFlashSale', true)
      context.store.commit('setFlashSale', res.data.flashSaleInfo)
    }
  }
}

/**
 * 获取lego配置网站功能模块版本和分流
 */
const getCommonVersionGroup = async function(context) {
  const res = await context.$axios.$get(
    `/1.0/common/test-version?countryCode=${context.store.state.country}&language=${context.store.state.language}`,
    {
      useCache: true
    }
  )
  if (res.code == 0) {
    const versionGroup = res.data.versionGroup || {}
    if (Object.keys(versionGroup).length) {
      context.store.commit('setVersionGroup', getVersionInfo(context, versionGroup))
    }
  }
  return {}
}

// 获取模块具体版本
const getVersionInfo = (context, versionGroup) => {
  // 方便指定abtest A-Z 版本,地址栏query queryAbtest
  const reg = /^[a-zA-Z]+$/
  // 全站模块一个版本,例如 queryAbtest=A/a 不限制大小写 ,判断当前页面是否带有queryAbtest参数
  let queryAbtest = (context && context.route && context.route.query.queryAbtest) || ''
  // 判断上一个页面是否带有queryAbtPest参数
  const referer = context && context.req && context.req.headers && context.req.headers.referer
  if (referer && !queryAbtest) {
    // 当前页面不带有queryAbtest参数，则从referer判断是否存在参数queryAbtest
    queryAbtest = getQueryString(referer).queryAbtest || ''
  }
  const queryAbtestForce = (context && context.route && context.route.query.queryAbtestForce) || '' // 定版本的强制版本查看
  const abtest = context.store.state.abtest.length == 32 ? context.store.state.abtest : new Array(32).fill(0).join('')
  const versionInfo = {}
  for (const key in versionGroup) {
    let versionList = []
    if (versionGroup[key].list && versionGroup[key].list.length) {
      // flowRate 大于0
      let list = versionGroup[key].list
      list = list.filter((item) => item.flowRate)
      versionList = list
    } else if (key === 'list_content_gallery_ab') {
      // 如果是列表图片ab，版本可以为空，其他的ab设置，给一个默认a版本
      versionList = [{ version: '', flowRate: 1 }]
    } else {
      versionList = [{ version: 'A', flowRate: 1 }]
    }
    const abIndex = versionGroup[key].randomNumber && versionGroup[key].randomNumber.length ? versionGroup[key].randomNumber : [31]
    const module = []
    versionList.map((element) => {
      module.push(element.flowRate)
    })
    const configs = {
      module, // 模块比例
      abIndex // 使用abtest的index值
    }
    const index = getVersion(abtest, configs)
    versionInfo[key] = index && versionList[index] ? versionList[index].version : versionList[0].version

    if (queryAbtest && queryAbtest.length == 1 && reg.test(queryAbtest)) {
      if (queryAbtestForce) {
        // 定版本的强制版本查看
        versionInfo[key] = queryAbtest.toUpperCase()
      } else if (versionList.length > 1) {
        // 未定版本的版本查看
        versionInfo[key] = queryAbtest.toUpperCase()
      }
    }
    // 具体模块指定版本,例如 banner_list_top=A/a 不限制大小写
    const queryModuleAbtest = (context && context.route && context.route.query[key]) || ''
    if (queryModuleAbtest && queryModuleAbtest.length == 1 && reg.test(queryModuleAbtest)) {
      versionInfo[key] = queryModuleAbtest.toUpperCase()
    }
  }

  return versionInfo
}

// 获取对应模块index
const getVersion = (abtest, configs) => {
  if (configs.module.length <= 1) {
    return 0
  }
  // 获取使用的abtest值
  const hex = configs.abIndex.map((abIndex) => abtest[abIndex]).join('')
  // 获取模块比例进制
  const radix = configs.module.reduce((count, item) => count + item, 0)
  // 获取最后一位 => 转化为10进制
  const num = parseInt(hex, 16) % radix
  let count = -1
  for (let i = 0; i < configs.module.length; i++) {
    count += configs.module[i]
    if (count >= num) {
      // 获取对应模块index
      // console.log(i)
      return i
    }
  }
}

// 路径重定向拼接国家,针对ca 切 com 页面里面重定向不带query的情况
const resetSeoUrl = (context, url) => {
  const query = context.route.query
  const urlQueryCountry = query.country ? `country=${query.country}` : ''
  let tempUrl = context.store.state.currentCountryUrl + url
  if (urlQueryCountry) {
    if (/\?/g.test(tempUrl)) {
      tempUrl = tempUrl + '&' + urlQueryCountry
    } else {
      tempUrl = tempUrl + '?' + urlQueryCountry
    }
  }
  return tempUrl
}

const getWGDUesrTag = async (context) => {
  const tagResult = await context.$axios.$post('/1.0/common/user-tag')
  if (tagResult.code == 0) {
    context.store.commit('setWgdUesrTag', tagResult.data)
  }
}

// 获取是否是门店或网红身份接口
const getUserIdentity = async (context) => {
  const identityRes = await context.$axios.$get('/1.0/referrer/user-identity')
  if (identityRes.code === 0) {
    context.store.commit('userInfo/setInfluencerStatus', identityRes.data.influencerStatus)
    context.store.commit('userInfo/setInfluencerCountryCode', identityRes.data.influencerCountryCode)
    context.store.commit('userInfo/setStorefrontStatus', identityRes.data.storefrontStatus)
    context.store.commit('userInfo/setStorefrontCountryCode', identityRes.data.storefrontCountryCode)
  }
}

const init = async function(context) {
  const version = process.env.GIT_VERSION
  context.store.commit('setVersion', version)

  context.store.commit('analysis/updateTime', ['commonAsyncDataInit', +new Date()])
  let country = 'US'
  let requestUrl = ''
  let host
  const query = context.route && context.route.query
  // 网站显示多语言code,方便查找配置
  if (query.hasOwnProperty('show_code')) {
    context.store.commit('setShowLangsCode', true)
  }

  if (context.req) {
    if (context.route && context.route.query && context.route.query.gclid) {
      delete context.route.query.gclid
    }
    context.store.commit('setLogHeaders', context.req.headers)
    host = context.req.headers['x-original-host'] || context.req.headers.host
    requestUrl = context.req.headers['x-original-uri'] || context.req.originalUrl
    const environment = getEnvironment(host)
    // 设置store里的abtst
    const abtest =
      (context.req.headers && context.req.headers.cookie && getCookieByString('abtest', context.req.headers.cookie)) ||
      context.req.headers['x-abtest']
    if (abtest) context.store.commit('setAbtest', abtest)

    // DB landing page 推广
    const dbLandingPage =
      context.req.headers && context.req.headers.cookie && getCookieByString('db_landing_page', context.req.headers.cookie)
    if ((query.type && query.type == 'db') || dbLandingPage) {
      context.store.commit('setDBLandingPage', true)
    }

    // 浏览器相关ua判断参数 // 来自于ssr-cache
    if (context.req.is_chrome_lighthouse) {
      context.store.state.is_chrome_lighthouse = true
    }
    if (context.req.is_support_webp) {
      context.store.state.isSupportWebp = true
    }

    const httpsHost = `${environment.includes('dev') ? 'http://' : 'https://'}${host}`
    context.store.commit('setEnvironment', environment)
    context.store.commit('setHttpsHost', httpsHost)
    const isPreviewWebsite = host.includes('preview') // 网址预览
    context.store.commit('setIsPreviewWebsite', isPreviewWebsite)

    if (host.includes('.ca')) {
      country = 'CA'
      // context.store.commit('setEnvApi', httpsHost + '/' + environment + '-ca')
      context.store.commit('setEnvApi', httpsHost + '/' + environment)
      context.store.commit('setAppDomainLower', 'azazie.ca')
    } else {
      context.store.commit('setEnvApi', httpsHost + '/' + environment)
      context.store.commit('setAppDomainLower', 'azazie.com')
    }

    // 先获取国家列表数据
    await getWebCongfig(context)

    // 从上下文的请求头中拿到headers, countrycode, cookie等数据
    const resCountry = handleReqHeaderCountry(context, country)
    if (resCountry) {
      country = resCountry
    } else {
      // 如果没有值，阻断代码继续执行
      return
    }

    const siteOptions = context.store.state.siteOptions
    context.store.commit('setCountry', country) // 设置国家，此处设置的国家数据，会在接口中通过header中的x-countryCode传给后台
    context.store.commit('setSiteOptions', siteOptions) // 确认国家后，需要再次执行setSiteOptions，因为此操作会根据country更新网站对应的国家，货币等信息
    let currentCountryInfo = null // 当前国家信息
    let currentLanguage = context.store.state.language // 当前语言信息
    if (siteOptions && siteOptions.length) {
      const currentCountryList = siteOptions.filter((item) => item.countryCode == context.store.state.country)
      if (currentCountryList.length) {
        currentCountryInfo = currentCountryList[0]
      }
    }
    if (currentCountryInfo) {
      context.store.commit(
        'setIsBridal',
        Boolean(currentCountryInfo.isEnableForBridal) && (context.store.state.isBridal || context.route.query.subsite === 'bridal')
      )
      context.store.commit('setIsEnableForBridal', Boolean(currentCountryInfo.isEnableForBridal))
      if (currentLanguage == 'en' && country !== 'DE') {
        // 非路由指定的多语言，取默认语言
        currentLanguage = currentCountryInfo.language
        context.store.commit('setLanguage', currentLanguage)
      }
      const currentLanguageList = currentCountryInfo.multilanguages.filter((item) => item.code == currentLanguage)
      if (currentLanguageList.length) {
        context.store.commit('setLanguageName', currentLanguageList[0].name) // 取默认语言
      }
      context.store.commit('setCurrencyCode', currentCountryInfo.currencyCode) // 取默认汇率
    }

    context.store.commit('setCurrentCountryUrl', getCurrentCountryUrl(context.store.state.country, context.store.state.language)) // 设置国家站拼接路径

    const newVersionObj = getVersionInfo(context, getOriginalVersionGroup(context)) // 获取前端手动划分的功能版本
    context.store.commit('setVersionObj', newVersionObj)

    let seoRequestUrl = requestUrl
    if (context.store.state.currentCountryUrl && requestUrl.startsWith(context.store.state.currentCountryUrl)) {
      seoRequestUrl = requestUrl.substring(context.store.state.currentCountryUrl.length, requestUrl.length)
    }
    let seoUrl = seoRequestUrl
    if (seoUrl.includes('?')) {
      seoUrl = seoUrl.split('?')[0]
    }

    const [hasMulti, seoInfoRes] = await Promise.all([
      getCommonMultiLanguages(context),
      context.$axios.get(`/1.0/common/seo?url=${seoUrl}`),
      getCommonVersionGroup(context), // 获取lego配置的功能版本
      getNavigation(context),
      getNavigationDynamic(context, newVersionObj),
      getWGDUesrTag(context)
    ])
    if (!hasMulti) return

    // clouflare缓存设置响应头
    if (!seoRequestUrl.startsWith('/products/') && !seoRequestUrl.startsWith('/all/') && seoInfoRes.headers.hasOwnProperty('set-cookie')) {
      context.res.setHeader('Set-Cookie', seoInfoRes.headers['set-cookie'])
    }
    context.store.commit('analysis/updateTime', ['commonAsyncDataEnd', +new Date()])
    return {
      currentCountryInfo,
      requestUrl: seoRequestUrl,
      seoInfo: seoInfoRes.data && seoInfoRes.data.data
    }
  } else {
    // 不同路由别名带参数跳转的时候会重新走 asyncData ，并且无 req/res 参数(目前只有列表、详情会使用到路由)
    requestUrl = context.route.fullPath
    let seoRequestUrl = requestUrl
    if (context.store.state.currentCountryUrl && requestUrl.startsWith(context.store.state.currentCountryUrl)) {
      seoRequestUrl = requestUrl.substring(context.store.state.currentCountryUrl.length, requestUrl.length)
    }
    return {
      requestUrl: seoRequestUrl
    }
  }
}

export { init, resetSeoUrl, getNavigation, initWebLanguageKeys, loadLanguagePromise, getUserIdentity, getNavigationDynamic }
