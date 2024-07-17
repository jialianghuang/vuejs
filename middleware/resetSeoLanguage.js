import { getCookieByString } from '../assets/js/pointUtil'
import { getQueryString, isExcludeUrl, getCountryRedirectUrl } from '../assets/js/utils'
const seoLanguages = require('../modules/supportSeoLanguage')

export default function(context) {
  if (context.req && context.route) {
    const host = (context.req.headers && (context.req.headers['x-original-host'] || context.req.headers.host)) || ''
    let requestUrl = context.route && context.route.fullPath
    let redirectUrl = '' // 重定向路径

    // 特殊参数重定向
    if (requestUrl) {
      if (isExcludeUrl(requestUrl)) {
        context.redirect(302, '/404')
        return
      }
    }

    const query = getQueryString(requestUrl)
    let currentCountry = '' // 当前国家
    let currentLanguage =
      (context.req.headers && context.req.headers.cookie && getCookieByString('Language', context.req.headers.cookie)) || '' // cookie里语言
    const headerCookieCountryCode =
      (context.req.headers && context.req.headers.cookie && getCookieByString('CountryCode', context.req.headers.cookie)) || '' // cookie国家
    const headersCountryCode = (context.req.headers && context.req.headers.countrycode) || '' // 获取请求headers中的countrycode，这是根据访问ip确定的国家
    let currentSeoLanguages = seoLanguages.filter((item) => {
      return requestUrl == `/${item}` || requestUrl.startsWith(`/${item}?`) || requestUrl.startsWith(`/${item}/`)
    })

    currentCountry = query.country || headerCookieCountryCode || headersCountryCode || ''
    // 特殊处理:/es/?country=US ==> /es-us/
    if (currentSeoLanguages && currentSeoLanguages.length && currentSeoLanguages[0] == 'es' && currentCountry == 'US') {
      currentLanguage = 'es' // 从路径上截取语言
      requestUrl = requestUrl.substring(currentSeoLanguages[0].length + 1, requestUrl.length) // 要重新拼接路径，所以去掉之前的路径
      currentSeoLanguages = [] // 重置路径数组
    }

    // 重定向非拼接路径
    // host是ca，则不处理路径，即没有query.country 、 headerCookieCountryCode
    if (!currentSeoLanguages.length && !(host && host.includes('.ca') && !query.country && headerCookieCountryCode)) {
      // 将默认语言en去掉传空过去，避免同一个国家有多种语言的时候匹配不中第一语言
      redirectUrl = getCountryRedirectUrl(requestUrl, currentCountry, currentLanguage || '')
    }

    if (redirectUrl && redirectUrl != requestUrl) {
      try {
        // 处理多语言国家路径拼接
        context.redirect(302, redirectUrl)
      } catch (error) {
        // 带有特殊字符的链接，redirect方法报错，不再使用语音拼接路径比如： /all/groomsmen-accessories/with/accessory-type/nœud-papillon,cravate-fine,cravate-large?country=FR&currency=EUR
        context.redirect(302, '/')
      }
    } else if (requestUrl == '//' || requestUrl == '//undefined') {
      // 处理异常路径
      context.redirect(302, '/')
    }
  }
}
