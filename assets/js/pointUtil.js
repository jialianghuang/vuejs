import { v4 as uuidv4 } from 'uuid'
import Vue from 'vue'
import { cookieInterceptor } from './webCookiesMap'
const creatUUID = () => {
  // const s = []
  // const hexDigits = '0123456789abcdef'
  // for (let i = 0; i < 36; i++) {
  //   s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  // }
  // s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  // s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  // s[8] = s[13] = s[18] = s[23] = '-'

  // const uuid = s.join('')
  // return uuid
  return uuidv4()
}
const SessionIdName = 'BF59152FE42FBCCA45876067ED4DA6A4' // md5('cookie.riven.statistics.sessionId.v1')
const SessionActiveTimeName = '4D338C8D1BB6A90E2B4607ADC7D566CE' // md5('cookie.riven.statistics.active.time.v1')
const SessionMaxDutation = 60 * 30 // 最大session间隔
const OpenChannelChanCookieName = '0608760AF2A0CEFB029C77EB1EF57E82' // md5('cookie.riven.statistics.open.channel.v1') 当前打开的渠道
// 初始化 sessionId
const initSessionId = () => {
  // 替换为cookie获取，保证清除cookie后是重新生成的内容
  const lastActiveTime = getCookie(SessionActiveTimeName) || 0
  const currentTime = new Date().getTime()
  const duration = currentTime - parseInt(lastActiveTime)
  const isForceUpdate = duration > 1000 * SessionMaxDutation
  const sessionId = isForceUpdate ? creatUUID() : getCookie(SessionIdName) || creatUUID()
  setCookie(SessionActiveTimeName, currentTime)
  setCookie(SessionIdName, sessionId)

  return sessionId
}

const matchPages = {
  'categories/[categoryIds]/[categoryName]': '/goods/list',
  'products/[goodsName]/[colorId]': '/goods/detail'
}
/**
 *
 * @param {*} path 路径
 * 严格按照demo格式，不接受/categories/3_0/all-dresses
 * 例如 categories/3_0/all-dresses
 */
const dynamicParser = (path) => {
  if (path && path.startsWith('/')) {
    path = path.substring(1)
  }
  const keys = Object.keys(matchPages)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const parameters = getDynamicMatchParameters(key, path)
    if (parameters) {
      return {
        parameters,
        path: matchPages[key]
      }
    }
  }
  return undefined
}

const getDynamicMatchParameters = (match, path) => {
  if (!match || !path) return false
  const paths = path.split('/')
  const matches = match.split('/')
  if (paths.length !== matches.length) {
    return undefined
  } else {
    const parameters = {}
    for (let i = 0; i < paths.length; i++) {
      // 动态参数
      if (matches[i].startsWith('[') && matches[i].endsWith(']')) {
        const parameterName = matches[i].replace(/[\\[|\]]/g, '')
        parameters[parameterName] = paths[i]
      } else if (matches[i] !== paths[i]) {
        return undefined
      }
    }
    return parameters
  }
}
const parametersFromSearch = (search) => {
  if (!search) return undefined
  if (search.startsWith('?')) {
    search = search.substring(1)
  }
  const keyValues = search.split('&')
  const parameters = {}
  keyValues.map((keyValue) => {
    const values = keyValue.split('=')
    if (values && values.length === 2) {
      parameters[decodeURIComponent(values[0])] = decodeURIComponent(values[1])
    }
  })
  return parameters
}

// const UUIDCookieName = 'A1FFCA598376D3B33C82786BEE5E461B' // md5('cookie.riven.statistics.v1')
const UUIDCookieName = '5CC1BD247E2BFD3B72C61CD8CC091E01' // md5('cookie.riven.statistics.v4')

const getDeviceId = () => {
  const uuid = getCookie(UUIDCookieName)
  if (uuid) {
    if (uuid.length == 36) {
      setCookie(UUIDCookieName, uuid, 360)
      return uuid
    } else {
      removeCookie(UUIDCookieName, '/')
      const generateUUID = creatUUID()
      if (generateUUID && generateUUID.length == 36) {
        setCookie(UUIDCookieName, generateUUID, 360)
        return generateUUID
      }
    }
  } else {
    const generateUUID = creatUUID()
    if (generateUUID && generateUUID.length == 36) {
      setCookie(UUIDCookieName, generateUUID, 360)
      return generateUUID
    }
  }
}

// 服务端获取 uuid
const getDeviceIdServerByCookie = (cookie) => {
  if (!cookie) return ''
  const uuid = getCookieByString(UUIDCookieName, cookie)
  return uuid
}

/**
 * 查询获取cookie字符串中的指定值
 * @param {*} key 想要查询的cookie字段
 * @param {*} cookie 被查询的cookie字符串
 * @returns
 */
const getCookieByString = (key, cookie) => {
  if (cookie && cookie.length > 0) {
    let begin = cookie.indexOf(key + '=')
    if (begin !== -1) {
      begin += key.length + 1
      let end = cookie.indexOf(';', begin)
      if (end === -1) {
        end = cookie.length
      }
      return unescape(cookie.substring(begin, end))
    }
  }
  return null
}

const setCookie = (nameOfCookie, value, expireDays, domain, bol) => {
  const isIn = cookieInterceptor(Vue.prototype, nameOfCookie)
  if (isIn && !bol) return
  if (expireDays === null || expireDays === undefined || expireDays === '' || isNaN(expireDays)) {
    expireDays = 365
  }
  const ExpireDate = new Date()
  ExpireDate.setTime(ExpireDate.getTime() + expireDays * 24 * 3600 * 1000)
  const _domain = domain ? ';domain=' + domain : ''
  document.cookie =
    nameOfCookie + '=' + escape(value) + _domain + (expireDays == null ? '' : ';path=/; expires=' + ExpireDate.toGMTString())
}

const getCookie = (nameOfCookie) => {
  if (document.cookie.length > 0) {
    const cookieArr = document.cookie.split(';')
    const cookieObj = {}
    cookieArr.forEach((cookie) => {
      const tempCookieArr = cookie.trim().split('=')
      cookieObj[tempCookieArr[0]] = tempCookieArr[1] || null
    })
    return (cookieObj[nameOfCookie] && unescape(cookieObj[nameOfCookie])) || null
  }
  return null
}

const removeCookie = (sKey, sPath, sDomain) => {
  const value = sKey && getCookie(sKey)
  if (!value) return false

  // document.cookie =
  //   encodeURIComponent(sKey) +
  //   '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
  //   (sDomain ? '; domain=' + sDomain : '') +
  //   (sPath ? '; path=' + sPath : '')
  setCookie(sKey, '', -1, sDomain)
  return true
}

const getCurrentChannel = () => {
  const parameters = parametersFromSearch(window.location.search) || {}
  if (parameters.hasOwnProperty('gclid')) {
    parameters.utm_medium = 'gclid=' + parameters.gclid
  }
  if (parameters.utm_source) {
    return {
      utm_source: parameters.utm_source,
      utm_medium: parameters.utm_medium,
      utm_campaign: parameters.utm_campaign
    }
  } else {
    return {
      utm_medium: parameters.utm_medium
    }
  }
}
const getChannelFromCookie = (cookieName) => {
  const value = getCookie(cookieName)
  try {
    return JSON.parse(value) || {}
  } catch (e) {
    return {}
  }
}
const getChannel = () => {
  const currentChannel = getCurrentChannel()
  const openChannel = getChannelFromCookie(OpenChannelChanCookieName)
  if (
    (currentChannel.utm_medium || '').indexOf('gclid=') === 0 ||
    (!openChannel.utm_source && (openChannel.utm_medium || '').indexOf('gclid=') !== 0) ||
    (currentChannel.utm_source && currentChannel.utm_source != 'direct')
  ) {
    openChannel.utm_source = currentChannel.utm_source
    openChannel.utm_medium = currentChannel.utm_medium
    openChannel.utm_campaign = currentChannel.utm_campaign
    setCookie(OpenChannelChanCookieName, JSON.stringify(openChannel), 360)
  }
  return {
    ops: openChannel.utm_source || 'web',
    opm: openChannel.utm_medium || 'auto',
    opc: openChannel.utm_campaign || 'web'
  }
}
// 根据当前的路由获取当前path,比如首页是 '/', 商品详情 '/product'
const getRoutePath = (route) => {
  const matched = route.matched
  let path = ''
  if (matched[0]) {
    // 单独处理首页path
    if (matched[0].path == '') {
      path = '/'
    } else {
      path = matched[0].path
    }
  }
  return path
}

/**
 * 节流生成函数
 */
const createThrottle = (time = 50) => {
  let timer = 0
  return function(cb) {
    if (timer) return
    timer = setTimeout(() => {
      cb()
      timer = null
    }, time)
  }
}

/**
 * 设置最大请求数量
 * @param {number} maxConcurrency  最大请求数量
 */
const setMaxHttp = (maxConcurrency = 5) => {
  const willRequests = []
  // 只关注数量
  const onGoingRequests = []

  const beginRequest = (func) => {
    if (func) {
      if (onGoingRequests.length < maxConcurrency) {
        onGoingRequests.push(func)
        func().finally(() => {
          stopRequest()
        })
      } else {
        willRequests.push(func)
      }
    }
  }
  const stopRequest = () => {
    onGoingRequests.shift()
    if (willRequests.length > 0) {
      const func = willRequests.shift()
      onGoingRequests.push(func)
      func().finally(() => {
        stopRequest()
      })
    }
  }
  return {
    beginRequest,
    stopRequest
  }
}

export {
  setMaxHttp,
  createThrottle,
  creatUUID,
  dynamicParser,
  parametersFromSearch,
  getDeviceId,
  getDeviceIdServerByCookie,
  getCookie,
  setCookie,
  getCookieByString,
  removeCookie,
  initSessionId,
  getChannel,
  getCurrentChannel,
  getChannelFromCookie,
  getRoutePath,
  OpenChannelChanCookieName
}
