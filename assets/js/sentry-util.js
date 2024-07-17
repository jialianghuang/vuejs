import { getDeviceId, getCookie, getCookieByString, getDeviceIdServerByCookie } from './pointUtil'

// 初始化sentry
const initSentry = (Sentry, context) => {
  const { req, store, route } = context

  let token, deviceId, userId, cookie, Language, CountryCode, Currency, fullPath, userInfo

  if (process.client) {
    token = getCookie('login_token')
    deviceId = getDeviceId() // uuid
    cookie = document.cookie
    Language = getCookie('Language')
    CountryCode = getCookie('CountryCode')
    Currency = getCookie('Currency')
    fullPath = route.fullPath
    userId = getCookie('user_id')
    userInfo = store.state.userInfo || {}
  } else {
    const cookieStr = (req && req.headers.cookie) || ''
    cookie = cookieStr
    token = getCookieByString('login_token', cookieStr)
    deviceId = getDeviceIdServerByCookie(cookie) // uuid
    Language = getCookieByString('Language', cookieStr) || store.state.language
    CountryCode = getCookieByString('CountryCode', cookieStr) || store.state.country
    Currency = getCookieByString('Currency', cookieStr) || store.state.currencyCode
    fullPath = route.fullPath
    userId = null // 服务端的时候还没设置 userId
    userInfo = null // 服务端的时候还没设置 userInfo
  }

  Sentry.configureScope((scope) => {
    scope.setTags({
      project: '网站PC',
      platform: 'pc',
      env: store.state.environment,
      isClient: process.client,
      isServer: process.server,
      errorTitle: 'An error is automatically caught',
      deviceId,
      fullPath,
      Language,
      CountryCode
    })
    scope.setExtras({
      fullPath,
      userInfo,
      token,
      deviceId,
      userId,
      cookie,
      time: new Date(),
      Language,
      CountryCode,
      Currency
    })
  })
}

const ignoreMsgs = ['socket hang up', 'Network Error', 'Timeout']
const ignoreCode = ['ECONNABORTED', 'ECONNRESET']

// 定义CaptureException函数
const AZCaptureException = (context, Sentry, captureExceptionData, type) => {
  const { req, store, route } = context
  if (!captureExceptionData) return
  if (captureExceptionData.error) {
    const message = captureExceptionData.error.message || ''
    const code = captureExceptionData.error.code || ''
    if (ignoreMsgs.includes(message) || ignoreCode.includes(code)) {
      return
    }
  }
  // 这里重新设置下下面的参数，防止没有更新
  let token, deviceId, userId, fullPath, cookie, Language, CountryCode, Currency, userInfo
  if (process.client) {
    token = getCookie('login_token')
    deviceId = getDeviceId() // uuid
    fullPath = route.fullPath
    cookie = document.cookie || ''
    userId = getCookie('user_id')
    userInfo = store.state.userInfo || {}
    Language = getCookie('Language')
    CountryCode = getCookie('CountryCode')
    Currency = getCookie('Currency')
  } else {
    const cookieStr = (req && req.headers.cookie) || ''
    cookie = cookieStr
    token = getCookieByString('login_token', cookieStr)
    deviceId = getDeviceIdServerByCookie(cookieStr)
    fullPath = route.fullPath
    Language = getCookieByString('Language', cookieStr) || store.state.language
    CountryCode = getCookieByString('CountryCode', cookieStr) || store.state.country
    Currency = getCookieByString('Currency', cookieStr) || store.state.currencyCode
    userId = null // 服务端的时候还没设置 userId
    userInfo = null // 服务端的时候还没设置 userInfo
  }
  Sentry.configureScope((scope) => {
    scope.setTags({
      fullPath,
      Language,
      CountryCode
    })
    scope.setExtras({
      fullPath,
      userInfo,
      token,
      deviceId,
      userId,
      cookie,
      time: new Date(),
      Language,
      CountryCode,
      Currency
    })
  })

  const azTags = {
    ...captureExceptionData.tags
  }
  const azExtra = {
    ...captureExceptionData.extra
  }
  // level 等级： 包括: fatal、error、warning、info、debug。(fatal :严重, error错误, error为默认)
  let azLevel = captureExceptionData.level || 'error'

  let errDesc = ''
  switch (type) {
    case 'asyncdata':
      errDesc = `AsyncData error, page: ${fullPath}` // asyncData错误
      azLevel = 'fatal'
      break
    case 'head':
      errDesc = `head error, page: ${fullPath}` // head错误
      azLevel = 'error'
      break
    case 'axios-error':
      const apiUrl = captureExceptionData.extra && captureExceptionData.extra.api_url
      const status = captureExceptionData.extra && captureExceptionData.extra.status
      errDesc = `Axios error, ${status}-apiUrl: ${apiUrl}` // 接口异常
      azLevel = 'error'
      break
    case 'script-error':
      errDesc = 'Script error' // 第三方js的报错
      break
    case 'paypal-error':
      errDesc = 'Paypal error' // paypal支付报错
      break
    case 'console-error':
      errDesc = 'Console error' // console.error捕获到的Error
      break
    case 'console-log':
      errDesc = 'Console log error' // console.log捕获到的Error
      break
    default:
      errDesc = type || ''
      break
  }
  azTags.errorTitle = errDesc || captureExceptionData.error || 'Error'

  Sentry.captureException(new Error(errDesc || captureExceptionData.error || 'Error'), {
    tags: azTags,
    extra: azExtra,
    level: azLevel
  })
}

const sentryHandle = (vm) => {
  if (window && vm.$AZCaptureException) {
    // 捕获页面静态资源加载错误
    window.addEventListener(
      'error',
      function(e) {
        if (e) {
          const target = e.target || e.srcElement
          const isElementTarget = target instanceof HTMLElement
          if (isElementTarget) {
            const { type, timeStamp, target } = e
            const { localName, outerHTML, tagName } = target
            const typeName = target.localName
            let sourceUrl = ''
            if (typeName === 'link') {
              sourceUrl = target.href || ''
            } else if (typeName === 'script') {
              sourceUrl = target.src || ''
            }
            // 只捕获支付相关的js
            let sourcesType = 'sources-error'
            if (typeName === 'script' && (sourceUrl.includes('braintreegateway') || sourceUrl.includes('afterpay'))) {
              sourcesType = 'checkout-sources-error'
              const captureExceptionData = {
                tags: {
                  'sources-error': typeName
                },
                extra: {
                  type,
                  timeStamp,
                  target,
                  localName,
                  outerHTML,
                  tagName,
                  sourceUrl
                },
                level: 'warning'
              }
              vm.$AZCaptureException(captureExceptionData, sourcesType)
            }
          }
        }
      },
      true
    )
    //  第三方js的报错
    window.onerror = function(message, source, lineno, colno, error) {
      //     message：错误信息（字符串）。可用于HTML onerror=""处理程序中的event。
      // *   source：发生错误的脚本URL（字符串）
      // *   lineno：发生错误的行号（数字）
      // *   colno：发生错误的列号（数字）
      // *   error：Error对象
      if (message === 'Script error.') {
        const captureExceptionData = {
          tags: {
            'script-error': message
          },
          extra: {
            message,
            source,
            lineno,
            colno,
            error,
            href: window.location.href
          }
        }
        setTimeout(() => {
          vm.$AZCaptureException(captureExceptionData, 'script-error')
        }, 10)
      }
      return false
    }
  }
}

export default {
  initSentry,
  AZCaptureException,
  sentryHandle,
  ignoreMsgs,
  ignoreCode
}
