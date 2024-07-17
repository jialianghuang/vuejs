import { Base64 } from 'js-base64'
import { webpushCookieName } from '@/assets/js/webpushUtils'
import { addParam1AndWGDTag } from '@/assets/js/commonFun'
import { getDeviceId, getCookie, initSessionId, getChannel, getRoutePath, createThrottle, setMaxHttp } from './pointUtil'

const MD5 = require('js-md5')
const axios = require('axios').default

// const FirstOpenChannelCookieName = '9794F23A2A421FAE39C08825A7972EA1' // md5('cookie.riven.statistics.first.open.channel.v1') 首次打开的渠道

let _this = null

const user = {
  sessionId: ''
}

const trackNebulas = (vm, type = '', value = {}, extraDp = null, targetPage = '') => {
  if (vm && vm.$store && vm.$store.state.is_chrome_lighthouse) return
  const userInfo = {}
  try {
    if (typeof vm == 'object') {
      _this = vm
      userInfo.userId = vm.$store.state.userInfo.userId
      userInfo.email = vm.$store.state.userInfo.userInfoEmail
    }
    const azAutotest = getCookie('az_autotest')
    if (azAutotest == '1') return
    user.sessionId = initSessionId()
    const sessionId = user.sessionId
    const deviceId = getDeviceId()
    const userId = userInfo.userId
    const countryCode = window.$nuxt.$store.state.country || 'US' // 从store中获取当前网站的国家标识，如果没有，默认US
    const language = window.$nuxt.$store.state.language || 'en' // 从store中获取当前网站的语言标识，如果没有，默认en
    const airpushId = getCookie(webpushCookieName)

    const specialList = ['/we-help-brides'] // 特殊路径名单，取route.path，即url中显示的路径，getRoutePath返回的是matched中的path，即项目目录对应的路径
    let routePath = ''
    if (typeof vm == 'string') {
      routePath = vm
    } else if (specialList.includes(vm.$route.path)) {
      routePath = vm.$route.path
    } else {
      routePath = getRoutePath(vm.$route)
    }

    // 过滤掉ga的打点,在createTrack中已经过滤了，为了保险起见，这里兜底处理
    value = delGA4(value)

    // jira:14434打点接口统一上传完整地址，参数param1
    // wgd广告落地页标记
    value = addParam1AndWGDTag(vm, type, value)
    // 过滤events中无效的点
    value = delEmptyEvents(value, type)
    const requestFunc = (nw) => {
      const parameters = {
        pl: 1,
        p: 1,
        c: countryCode, // 国家标识
        fd: window.location.host,
        cid: deviceId,
        // ia: undefined,
        uid: userId,
        sid: sessionId,
        cv: '-1',
        nw: language,
        sr: window.screen.availWidth + '×' + window.screen.availHeight,
        // md: undefined,
        // ov: undefined,
        ua: window.navigator.userAgent,
        dh: window.location.host,
        dp: extraDp || routePath,
        dt: window.document.title,
        // ct: new Date().getTime(), // ct sign 移动到发送前
        ...getChannel()
      }
      if (!parameters.uid || parameters.uid == -1) {
        userInfo.email = null
        delete parameters.uid
      }
      // 强制改dp，因为要兼容当前页面所有的打点，所以需要在这里更改
      if (parameters.dp === '/order/tracking') {
        parameters.dp = '/pages/tracking'
      }
      let path
      if (type === 'pageview') {
        if (value.dp) parameters.dp = value.dp
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
      const host = window.location.host
      const isInternalTest = !host.startsWith('www.') && !host.startsWith('m.')
      const url = (isInternalTest ? 'https://collect-test.azazie.cn' : 'https://collect.azazie.cn') + path
      parameters.sign = isInternalTest ? 'me02kunyfqcejqbdwlaf0ghs3j2r8wuu' : 'cTjoS9QytJ2M4UKBnjNj3miow7ftkMu6'
      // 页面跳转数据存到sessionStorage，到下个页面打点
      if (targetPage) {
        let targetPagePoints = sessionStorage.getItem('point-pre-page')
        if (targetPagePoints && targetPagePoints != 'undefined') {
          targetPagePoints = JSON.parse(targetPagePoints)
        } else {
          targetPagePoints = []
        }
        targetPagePoints = [...targetPagePoints, ...parameters.events]
        if (targetPagePoints.length <= 10) {
          sessionStorage.setItem(
            'point-pre-page',
            JSON.stringify({
              url,
              path,
              parameters: {
                ...parameters,
                events: [...targetPagePoints]
              }
            })
          )
        }
        return
      }
      cachedBiAjax(url, parameters, path)
    }
    const msgExtra = {
      airpushId: window[webpushCookieName] || airpushId,
      email: userInfo.email
    }
    // AZWEB-16873 checkout页面支付方式排序规则更新 checkout 页面所有的打点加上 checkoutPayAbtest
    if (routePath == '/checkout') msgExtra.checkoutPayAbtest = vm && vm.$store.state.versionObj.checkoutPayAbtest
    // AZWEB-21052 /collection/all 商品集合页（搜索页 q=azazie）来源需要在product页面所有的打点加上 from_all_new_page_collection
    const isFromCollection = localStorage.getItem('FROM_COLLECTION_ALL')
    if (isFromCollection && document.referrer.includes('/collection/all') && routePath == '/product') msgExtra.isFromCollection = 1
    formatBiMsgToStr(value, msgExtra)
    requestFunc('-1')
  } catch (e) {
    console.log('trackNebulas', e)
    // comments: 加个日志
    // if (type == 'pageview') {
    //   sendKibanaLog(vm, e, type)
    // }
  }
}

// 只缓存键名对应的请求
const waitingAxios = {
  '/api/v1/timings': {
    list: [],
    key: 'timings'
  },
  '/api/v1/events': {
    list: [],
    key: 'events'
  }
}

/**
 * 触发请求
 */
const dispatchBiAjax = () => {
  for (const k in waitingAxios) {
    const list = waitingAxios[k].list || []
    while (list.length) {
      const parameters = list.shift()
      sendAjax(waitingAxios[k].url, parameters)
    }
  }
}

// 生成节流函数
const ajaxThrottle = createThrottle(200)

/**
 * 执行/缓存bi打点  path非waitingAxios子属性 直接执行
 * @param {*} url
 * @param {*} parameters
 * @param {*} path
 */
export function cachedBiAjax(url, parameters, path) {
  const cached = waitingAxios[path]
  if (!cached) {
    return sendAjax(url, parameters)
  } else {
    cached.url = url
    for (let i = 0; i < cached.list.length; i++) {
      if (!parameters[cached.key].length) break
      const p1 = cached.list[i]
      if (p1 && p1[cached.key] && p1[cached.key].length < 30 && judegIsSameParamBaseData(p1, parameters)) {
        if (parameters[cached.key].length + p1[cached.key].length <= 30) {
          p1[cached.key].push(...parameters[cached.key].splice(0))
          break
        } else {
          p1[cached.key].push(...parameters[cached.key].splice(0, 30 - p1[cached.key].length))
        }
      }
    }
    if (parameters[cached.key].length) {
      cached.list.push(parameters)
    }
    ajaxThrottle(dispatchBiAjax)
  }
}

/**
 * 判断数据参数是否相同
 * @param {*} p1
 * @param {*} p2
 */
const judegIsSameParamBaseData = (p1, p2) => {
  for (const k in p1) {
    if (['string', 'number', 'boolean'].includes(typeof p1[k])) {
      if (k === 'ct') continue
      if (p1[k] !== p2[k]) return false
    }
  }
  return true
}

// 设置最大bi并行请求数量
const { beginRequest } = setMaxHttp(5)

/**
 * 发送bi请求 生成ct sign
 * @param {*} url
 * @param {*} parameters
 */
const sendAjax = (url, parameters) => {
  if (parameters.events) biLogger(parameters.events, 602) // bi收录日志
  return beginRequest(() => {
    parameters.ct = new Date().getTime()
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
    signString += '&secretkey=' + parameters.sign
    parameters.sign = MD5(Base64.encode(signString.toLowerCase()))
    if (!window.is_chrome_lighthouse) {
      return axios
        .post(url, parameters)
        .then((res) => {
          // 日志  失败status: error 成功：status: ok
          if (parameters.events) {
            const errorCode = res.data && res.data.status == 'ok' ? 603 : 602
            biLogger(parameters.events, errorCode, res.data && res.data.status, res.msg) // bi收录日志
          }
        })
        .catch((error) => {
          // console.log('-----error---', error.message)
          // 日志 失败 status: catch
          if (parameters.events) biLogger(parameters.events, 602, 'catch', (error && error.message) || 'Error') // bi收录日志
          // if (url.includes('/api/v1/pageviews')) {
          //   console.log('--- sendAjax ---', e)
          //   sendKibanaLog(window.$nuxt, e, 'pageview')
          // }
        })
    }
  })
}

export default trackNebulas

// client beforeunload 发送请求
if (process.client && typeof window !== 'undefined') {
  window.addEventListener('beforeunload', function() {
    // https://caniuse.com/?search=beforeunload
    dispatchBiAjax()
  })
}

const formatBiMsgToStr = function(value, { email, airpushId, checkoutPayAbtest = '', isFromCollection = '' }) {
  const arr = Array.isArray(value) ? value : [value]
  arr.forEach((item) => {
    if (!item) return
    let msg = item.msg || {}
    msg = typeof msg == 'string' ? JSON.parse(msg) : msg
    msg = msg && typeof msg === 'object' ? msg : {}
    if (airpushId) msg.airship_id = airpushId
    if (email) msg.email = email
    if (checkoutPayAbtest) msg.checkoutPayAbtest = checkoutPayAbtest
    if (isFromCollection) msg.from_all_new_page_collection = isFromCollection
    if (msg.color && typeof msg.color == 'string') msg.color = transferStr(msg.color)
    item.msg = JSON.stringify(msg)
    if (item.param2) {
      item.param2 = item.param2.toUpperCase()
    }
  })
}

const transferStr = (str) => {
  return str.toLowerCase().replace(/[ -]/g, '_')
}

// const sendKibanaLog = (vm, error, type) => {
//   const captureExceptionData = {
//     error,
//     extra: {
//       error,
//       trackId: (vm.$store.state.orderInfo && vm.$store.state.orderTrackId) || '',
//       requestUri: location.href, // abc
//       sourceUri: location.href,
//       deviceId: getDeviceId() || '-1',
//       sessionId: user.sessionId || '-1',
//       type
//     }
//   }
//   vm.$AZCaptureException(captureExceptionData, 'trackNebulas-points-pc-error')
// }

// 过滤掉 ga4Event 的ga打点
const delGA4 = function(value) {
  if (Array.isArray(value)) {
    const newArr = value.filter((item) => {
      return item.event !== 'ga4Event'
    })
    return newArr
  } else if (value.event !== 'ga4Event') {
    return value
  }
}

// 修复events事件，参数为空的时候整条打点请求失败问题，过滤掉空的events事件
const delEmptyEvents = function(value, type) {
  if (type == 'events') {
    const arr = Array.isArray(value) ? value : [value]
    const newArr = arr.filter((item) => {
      return item && item.ea && item.ec && item.el
    })
    return newArr
  } else {
    return value
  }
}

/**
 *  bi日志收录
 *  根据指定的ec、el、ea 收录
 * errType: error、catch
 * errMsg: 报错信息
 */
const biLogger = function(events, errorCode, errType = '', errMsg = '') {
  const curEvents = events.filter((item) => item.ec == 'newcustomer' && item.el == 'unlockofferssuccess' && item.ea == 'click')
  if (curEvents && curEvents.length && _this) {
    const val = curEvents[0]
    const msg = val.msg && JSON.parse(val.msg)
    const { ec, el, ea } = val
    _this.$store.dispatch('getErr', {
      time: new Date(),
      appName: '网站PC',
      biz: 'FRONT', // 业务线 FRONT
      level: 'ERROR', // 日志级别 FATAL、ERROR、WARN、INFO、DEBUG、TRACE等
      severity: `Sev-3`, // 告警级别
      errorCode, // 错误码,##如果有标准错误码定义的话，没有该字段就去掉
      trackId: '',
      errorMetric: 'bisend', // 错误关键字, vm 会出现未 undefined 的情况
      message: JSON.stringify({
        email: msg && msg.email,
        user_step: msg && msg.user_step,
        errType,
        errMsg: JSON.stringify(errMsg),
        ec,
        el,
        ea
      }) // 错误信息
    })
  }
}
