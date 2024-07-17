// import webpushDialog from '@/components/webpush/webpushPlugin'
import trackNebulas from '@/assets/js/point'
import { setCookie } from '@/assets/js/pointUtil'

export const webpushCookieName = 'airship_id'

export const jobs = [
  // 判断执行依赖
  () => window.UA && window.UA.then,
  // 执行代码
  () => {
    // console.log('webpushUtils ready ===>')
    window.UA &&
      window.UA.then((sdk) => {
        // console.log('webpushUtils sdk ===>', sdk, window.$nuxt)
        // 注册事件
        utils.addEventListener(sdk)
        // 是否支持
        if (!sdk.isSupported) return
        // 是否可以注册
        if (!sdk.canRegister) return
        window.$nuxt && (window.$nuxt.$airpush = sdk)
        // 确认权限
        // console.log('webpushUtils permission  ===>', sdk.permission)
        if (sdk.permission == 'default' || (sdk.permission == 'granted' && !sdk.channel)) {
          // 首次唤出引导弹窗，内部调用register
          utils.init(sdk)
        } else if (sdk.permission == 'granted' && sdk.channel) {
          // 读取sdk数据
          utils.afterRegister(sdk.channel.channel_id)
        } else if (sdk.permission == 'denied') {
          // 拒绝/隐身模式
        }
      }).catch(() => {})
  }
]

export function sendAjax(url, data, cb) {
  const noop = cb || ((res) => console.log('sendAjax ===>', res.data))
  if (window.$nuxt && window.$nuxt.$axios) {
    window.$nuxt.$axios.post(url, data).then(noop)
  }
}

export const utils = {
  trackStack: [],
  // 页面tab激活状态默认激活，执行js事件监听前切换tab，无法出发首次隐藏
  tabHidden: false,
  init: (sdk) => {
    utils.trackNebulas({
      ec: 'airshipPopup',
      el: 'popup',
      ea: 'view'
    })
    sdk
      .register()
      .then((data) => {
        console.log('webpushUtils register result ===>', data)
        const { channel_id: channelId } = data
        if (channelId) {
          utils.afterRegister(channelId)
          sendAjax('/1.0/user/collect-airship-id', { [webpushCookieName]: channelId }, () => {})
          console.log('webpush - if data && data.channel && data.channel.channel_id', data)
        } else {
          console.log('webpush - else', data)
        }
        utils.trackNebulas({
          ec: 'airshipPopup',
          el: 'granted',
          ea: 'click'
        })
      })
      .catch((err) => {
        console.log('----webpush - failed----')
        console.dir(err)
        utils.trackNebulas({
          ec: 'airshipPopup',
          el: 'denied',
          ea: 'click',
          msg: {
            error: err.message
          }
        })
      })
  },
  afterRegister: (channelId) => {
    // 添加cookie和全局值
    setCookie(webpushCookieName, channelId, 360)
    window[webpushCookieName] = channelId
    // register成功后触发
    utils.triggerCached()
    // 添加tag分组 订阅全站广播
    utils.tagsAdd('subscribe')
  },
  // 默认只有 device分组
  tagsAdd: (tag) => {
    // 已订阅不会重复发请求
    window.UA.then((sdk) => {
      sdk.channel.tags.add(utils.getTagName(tag))
    })
  },
  // 获取tag值 添加国家标识
  getTagName: (tag) => {
    const country = (window.$nuxt.$store.state.country || '').toLocaleLowerCase() || 'us'
    return tag + '_' + country
  },
  // 触发事件
  trigger: (event, ...args) => {
    if (window.UA && window.UA.then) {
      return utils[event](...args)
    } else {
      utils.trackStack.push(event, args)
    }
  },
  // 触发 未执行事件
  triggerCached: () => {
    if (!utils.trackStack.length) return
    utils.trackStack.forEach(([event, args]) => {
      utils[event](...args)
    })
    utils.trackStack.length = 0
  },
  // 监听webpsuh
  addEventListener: (sdk) => {
    // 浏览器打开是需要监听webpush推送消息
    // 多个窗口会监听多次
    sdk.addEventListener('push', (ev) => {
      // console.log('webpushUtils addEventListener push ===>', ev, ev.psuh)
      // console.log('webpushUtils addEventListener push ===>', JSON.stringify(ev))
      // 当前tab未激活
      if (utils.tabHidden) return
      const pushData = (ev && ev.push) || {}
      const tilte = pushData.title
      const extrasData = (pushData.data && pushData.data.extras) || {}
      utils.trackNebulas({
        ec: 'airshipPush',
        el: 'receiveWhenWebOpen',
        ea: 'view',
        msg: {
          ...extrasData,
          tilte
        }
      })
      // ev.push is the push payload object
    })
    //   sdk.addEventListener(
    //     'channel',
    //     (ev) => {
    //       console.log('webpushUtils addEventListener channel ===>', ev.channel, sdk.channel, ev.channel === sdk.channel)
    //     },
    //     { once: true }
    //   )
    //   sdk.addEventListener('tags', (ev) => {
    //     console.log('webpushUtils addEventListener tags ===>', ev.tags, sdk.channel.tags.list, ev.tags === sdk.channel.tags.list)
    //   })
  },
  // webpsuh打点
  trackNebulas(options, type = 'event') {
    trackNebulas(window.$nuxt || {}, type, options)
  }
}

// 推荐打点使用新模式或event
// * 随机生成的 设备id
// * airpush加载完成，获取 channel - id
//    允许注册
//    注册成功
// * coockie - uid
//    调用登录相关接口，成功后记录返回参数
//    user-info获取userId
// * coockie - webpush_email
//    调用登录相关接口，成功后记录请求参数
//    user-info获取userEmail
// 'event', { ec: 'webpush', ea: 'view', el: 'webpush'}

// Register a channel
// UA.then((sdk) => console.log(sdk.register()))
// // Check if the channel is opted in
// UA.then((sdk) => console.log(sdk.channel.optedIn))
// // Opt out. You must re-register after
// UA.then((sdk) => console.log(sdk.channel.optOut()))
// // Get channel ID
// UA.then((sdk) => console.log(sdk.channel.id))
// // Add tag
// UA.then((sdk) => console.log(sdk.channel.tags.add('avocado')))
// // List tags
// UA.then((sdk) => console.log(sdk.channel.tags.list))
// // Check for existence of a tag
// UA.then((sdk) => console.log(sdk.channel.tags.has('avocado')))
// // Set named user
// UA.then((sdk) => console.log(sdk.channel.namedUser.set('pierre')))
// // List named user
// UA.then((sdk) => console.log(sdk.channel.namedUser.id))

export const loadJob = [
  () => typeof window != 'undefined' && !window.is_chrome_lighthouse && window.$nuxt && window.$nuxt.$store.state.environment,
  () => {
    /* eslint-disable */
    if (window.$nuxt.$store.state.environment == 'prod') {
      // !function(n,r,e,t,c){var i,o="Promise"in n,u={then:function(){return u},catch:function(n){
      //   return n(new Error("Airship SDK Error: Unsupported browser")),u}},s=o?new Promise((function(n,r){i=function(e,t){e?r(e):n(t)}})):u
      //   ;s._async_setup=function(n){if(o)try{i(null,n(c))}catch(n){i(n)}},n[t]=s;var a=r.createElement("script");a.src=e,a.async=!0,a.id="_uasdk",
      //   a.rel=t,r.head.appendChild(a)}(window,document,'https://aswpsdkus.com/notify/v1/ua-sdk.min.js',
      //     'UA', {
      //       vapidPublicKey: 'BHZ__uw5VTpEh2wXbo79EmUWNPgCW34lzEqcT8FH9mzN-S8AleNURZDXATlBUE1E0f2Sha70p_ZNhWfJZ9cz8xk=',
      //       appKey: '7lVtaMejRNuNMsbn7qQuDQ',
      //       token: 'MTo3bFZ0YU1lalJOdU5Nc2JuN3FRdURROjlpeWV5ODBkdFNvaU16c0IyM2R2SzBZRUttdEJaXzFlaDNUMVh6TjUydnc'
      //     });

      // 86acbd31cd7c09cf30acb66d2fbedc91daa48b86:1663831166.3687587
      !(function(n, r, e, t, c) {
        var i,
          o = 'Promise' in n,
          u = {
            then: function() {
              return u
            },
            catch: function(n) {
              return n(new Error('Airship SDK Error: Unsupported browser')), u
            }
          },
          s = o
            ? new Promise(function(n, r) {
                i = function(e, t) {
                  e ? r(e) : n(t)
                }
              })
            : u
        ;(s._async_setup = function(n) {
          if (o)
            try {
              i(null, n(c))
            } catch (n) {
              i(n)
            }
        }),
          (n[t] = s)
        var a = r.createElement('script')
        ;(a.src = e),
          (a.async = !0),
          (a.id = '_uasdk'),
          (a.dataset.polarisConsent = 'statistics,marketing'),
          (a.rel = t),
          r.head.appendChild(a)
      })(window, document, 'https://aswpsdkus.com/notify/v1/ua-sdk.min.js', 'UA', {
        vapidPublicKey: 'BLsj4jXgYPDnQhyzOhRlU_8McDI0spQmyjD-V2sdiWrQSqJ9eL5v3f1sEFRZbiZGnpJ2W4enolzrbLr7zflVjuM=',
        appKey: '3j2RQvqfQ0Ster2Kh5wDsw',
        token: 'MTozajJSUXZxZlEwU3RlcjJLaDV3RHN3OlRzNTB6Vnk0blB0YlhBemQxSXE2WTlMemFoME5EX0lqQUtHVWhJVXZfTFE'
      })
    } else {
      // // 86acbd31cd7c09cf30acb66d2fbedc91daa48b86:1622451746.0561914
      // !function(n,r,e,t,c){var i,o="Promise"in n,u={then:function(){return u},catch:function(n){
      //   return n(new Error("Airship SDK Error: Unsupported browser")),u}},s=o?new Promise((function(n,r){i=function(e,t){e?r(e):n(t)}})):u
      //   ;s._async_setup=function(n){if(o)try{i(null,n(c))}catch(n){i(n)}},n[t]=s;var a=r.createElement("script");a.src=e,a.async=!0,a.id="_uasdk",
      //   a.rel=t,r.head.appendChild(a)}(window,document,'https://aswpsdkus.com/notify/v1/ua-sdk.min.js',
      //     'UA', {
      //       vapidPublicKey: 'BFMgQanFOaptlBYadx6KOPvUz7R35djNwIViFoT5ngs45lrEKHUVLmJgxvPV8tJVkYprxIgQnmyOmKgMcB-iU6A=',
      //       appKey: 'Cr_0vwMqQQetfKEqtTDq_A',
      //       token: 'MTpDcl8wdndNcVFRZXRmS0VxdFREcV9BOlBBZUpXbGU5RXllcVNSM1Z2MDZRMmwwNXdVNU9OTnBETlpfbDdDSnE0UjA'
      //     });

      // 86acbd31cd7c09cf30acb66d2fbedc91daa48b86:1664272743.3224788
      !(function(n, r, e, t, c) {
        var i,
          o = 'Promise' in n,
          u = {
            then: function() {
              return u
            },
            catch: function(n) {
              return n(new Error('Airship SDK Error: Unsupported browser')), u
            }
          },
          s = o
            ? new Promise(function(n, r) {
                i = function(e, t) {
                  e ? r(e) : n(t)
                }
              })
            : u
        ;(s._async_setup = function(n) {
          if (o)
            try {
              i(null, n(c))
            } catch (n) {
              i(n)
            }
        }),
          (n[t] = s)
        var a = r.createElement('script')
        a.dataset.polarisConsent = 'statistics,marketing'
        ;(a.src = e), (a.async = !0), (a.id = '_uasdk'), (a.rel = t), r.head.appendChild(a)
      })(window, document, 'https://aswpsdkus.com/notify/v1/ua-sdk.min.js', 'UA', {
        // Only needed when used on insecure hosts:
        // secureIframeUrl: 'https://your.secure.domain/path/to/web-push-secure-bridge.html',
        vapidPublicKey: 'BNzFs442l3-dBonv6ECXTMO9eekTLcZeIB2s0oG2Fl-QTPNUjuBjZrqJ1LmJdsls3QQhGNIGCiuHY1LpC40c4kY=',
        appKey: 'WHqUkvwjT1q8H07YiOXNAg',
        token: 'MTpXSHFVa3Z3alQxcThIMDdZaU9YTkFnOnpMcmtINWk2OTBVbEM2cndYbnNZRHdOODRwdEdqZW0ycUxYcFhaNkUxbnc'
      })
    }
    /* eslint-enable */
    // 添加页面tab状态监听
    let hidden, visibilityChange
    if (typeof document.hidden !== 'undefined') {
      hidden = 'hidden'
      visibilityChange = 'visibilitychange'
    } else if (typeof document.mozHidden !== 'undefined') {
      hidden = 'mozHidden'
      visibilityChange = 'mozvisibilitychange'
    } else if (typeof document.msHidden !== 'undefined') {
      hidden = 'msHidden'
      visibilityChange = 'msvisibilitychange'
    } else if (typeof document.webkitHidden !== 'undefined') {
      hidden = 'webkitHidden'
      visibilityChange = 'webkitvisibilitychange'
    }
    // 添加监听器
    document.addEventListener(
      visibilityChange,
      function() {
        // console.log('当前页面是否被隐藏：' + document[hidden])
        // window.$nuxt.$store.state.tabHidden = document[hidden]
        utils.tabHidden = document[hidden]
      },
      false
    )
  }
]
