import LRU from 'lru-cache'
import buildURL from 'axios/lib/helpers/buildURL'
import { getCookieByString } from '../assets/js/pointUtil'
const FIVE_MIN = 1000 * 60 * 5
export default function({ $axios, ssrContext, route, store, app }) {
  // const defaultCache = process.server ? ssrContext.$axCache : new LRU({ maxAge: FIVE_MIN })
  const defaults = $axios.defaults

  defaults.adapter = azazieAdapter(defaults.adapter)

  function azazieAdapter(adapter, options) {
    const mergeOptions = {
      // 默认删除cookie/set-cookie防止数据感染
      delCookie: true,
      // 默认不缓存
      enabledByDefault: false,
      // 启动标识
      cacheFlag: 'useCache',
      // // cache 必传
      defaultCache: process.server ? ssrContext.$axCache : new LRU({ maxAge: FIVE_MIN }),
      // 数据校验 ==> code:0 data:真值
      checkResultByDefault(data) {
        try {
          if (!(data && data.data)) return false
          if (typeof data.data === 'string') {
            const res = JSON.parse(data.data)
            return !!(+res.code === 0 && res.data)
          } else if (typeof data.data === 'object') {
            return !!(+data.data.code === 0 && data.data.data)
          } else {
            return !!data.data
          }
        } catch {
          return false
        }
      }
    }

    const { enabledByDefault, cacheFlag, defaultCache, checkResultByDefault, delCookie } = Object.assign(mergeOptions, options)

    return function(config) {
      const url = config.url
      const method = config.method
      const useCache = config[cacheFlag] !== null && config[cacheFlag] !== undefined ? config[cacheFlag] : enabledByDefault
      const isPreivew = !!config.headers['x-preview']
      if (method === 'get' && useCache && !isPreivew) {
        const forceUpdate = config.forceUpdate
        const params = config.params
        const paramsSerializer = config.paramsSerializer
        const checkResult = config.checkResult || checkResultByDefault
        const cacheKey = buildURL(url, params, paramsSerializer)
        const cached = defaultCache.get(cacheKey)
        if (!cached || forceUpdate) {
          if (delCookie) delete config.headers.cookie
          return adapter(config).then((data) => {
            if (checkResult(data)) {
              if (delCookie && data.headers['set-cookie']) {
                delete data.headers['set-cookie']
              }
              defaultCache.set(cacheKey, data)
            }
            return data
          })
        } else {
          return Promise.resolve(cached).then((data) => {
            return data
          })
        }
      } else {
        return adapter(config)
      }
    }
  }

  $axios.onRequest((config) => {
    config._startTime = +new Date()
    const environment = store.state.environment
    // if (store.state.country == 'CA') {
    //   environment += '-ca'
    // }
    //  else if (store.state.country == 'AU') {
    //   environment += '-au'
    // }
    // 请求路径根据不同国家进行配置路径，例如：test-au/api...
    // if (store.state.country != 'US') environment += `-${store.state.country.toLocaleLowerCase()}`
    if (!/^https?:\/\//.test(config.url)) {
      config.url = environment + config.url
    }
    // config.headers.common['x-token'] = getCookieByString('login_token', config.headers.common.cookie) 取的是cookie里的值，这里用不到
    // config.headers.common['x-token'] =
    //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhemF6aWUiLCJhdWQiOiJ1c2VycyIsImlhdCI6MTU5NzkxMjM0NSwiZXhwIjoxNTk4NTE3MTQ1LCJ1c2VyX2lkIjoxNH0.o5gUgrzx-hSFlLeDqZ0S2W6KGDcXe9OuohSPbprQFkY'
    if (store.state.isPreviewWebsite) config.headers.common['x-preview'] = '1'
    if (store.state.showLangsCode) config.headers.common['x-show-code'] = true
    config.headers.common['x-countryCode'] = store.state.country // 接口header中带上国家code
    config.headers.common['x-languageCode'] = store.state.language // 接口header中带上语言code
    config.headers.common['x-original-uri'] = ''
    // 添加日志追踪
    config.headers.common['x-request-trace-user-uid'] = store.state.logsId.reqHeaders.request_trace_user_uid
      ? store.state.logsId.reqHeaders.request_trace_user_uid
      : ''
    config.headers.common['x-refer-request-trace-id'] = store.state.logsId.reqHeaders.request_trace_id
      ? store.state.logsId.reqHeaders.request_trace_id
      : ''
    if (process.server) {
      // 跟后端确认过，ZZSID已经弃用了
      // if (!config.headers.common.cookie || !config.headers.common.cookie.includes('ZZSID')) {
      //   const zzsid = store.state.ZZSID
      //   if (zzsid != '' && zzsid != null && zzsid != 'undefined') {
      //     config.headers.common.cookie = 'ZZSID=' + zzsid + '; ' + (config.headers.common.cookie ? config.headers.common.cookie : '')
      //   }
      // }
      if (!config.headers.common.cookie || !config.headers.common.cookie.includes('SRSID')) {
        const srsid = store.state.SRSID
        if (srsid != '' && srsid != null && srsid != 'undefined') {
          config.headers.common.cookie = 'SRSID=' + srsid + '; ' + (config.headers.common.cookie ? config.headers.common.cookie : '')
        }
      }
    }
  })
  $axios.onResponse((response) => {
    if (!/logs?/.test(response.config.url))
      store.dispatch('analysis/setBiRecords', {
        type: 'timing',
        opts: {
          utc: 'api',
          utv: response.config && response.config.url ? response.config.url.split('?')[0] : '-1',
          utl: (response.config && response.config.method) || '-1',
          utt: new Date() - (response.config && response.config._startTime)
        }
      })
    if (process.server && response.headers.hasOwnProperty('set-cookie')) {
      const cookieArray = response.headers['set-cookie']
      cookieArray.forEach((item) => {
        // 跟后端确认过，ZZSID已经弃用了
        // if (item.includes('ZZSID')) {
        //   const zzsid = getCookieByString('ZZSID', item)
        //   store.commit('setZZSID', zzsid)
        // }
        if (item.includes('SRSID')) {
          const srsid = getCookieByString('SRSID', item)
          store.commit('setSRSID', srsid)
        }
        if (item.includes('AZSID')) {
          const azsid = getCookieByString('AZSID', item)
          store.commit('setAZSID', azsid)
        }
      })
    }
  })
  $axios.setHeader('x-app', 'pc')
  $axios.setHeader('x-project', 'azazie')
  // 错误处理
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code == 429) {
      throw new Error('axios')
    }
    if (code !== 200) {
      // sentry 报错
      let errorData = {}
      const ignoreMsgs = ['socket hang up', 'Network Error', 'Timeout']
      const ignoreCode = ['ECONNABORTED', 'ECONNRESET']
      if (error && error.response) {
        const status = error.response.status ? error.response.status * 1 : ''
        const ignoreStatus = [420, 418] // 需要忽略的状态码
        if (
          !ignoreCode.includes(error.response.code) &&
          !ignoreMsgs.includes(error.response.message) &&
          !ignoreStatus.includes(status) &&
          !(status + '').startsWith(5)
        ) {
          errorData = {
            status,
            api_url: error.response.config && error.response.config.url,
            method: error.response.config && error.response.config.method,
            params: error.response.config && error.response.config.params,
            data: error.response.config && error.response.config.data
          }

          const captureExceptionData = {
            error,
            tags: {
              'axios-error': error.response && error.response.status
            },
            extra: {
              ...errorData,
              error
            }
          }
          app.$AZCaptureException(captureExceptionData, 'axios-error')
        }
      }

      if (!/logs?/.test(error.config.url) && !/serverLog?/.test(error.config.url)) {
        store.dispatch('getErr', {
          time: new Date(),
          appName: '网站PC',
          biz: ['NL', 'BE', 'SE', 'AT', 'DK', 'FI'].includes(store.state.country) ? 'BACKEND2' : 'BACKEND', // 业务线 FRONT BACKEND  ERP  BI 因为存在一部二部一起开发，BACKEND2代表二部接受报警
          level: 'ERROR', // 日志级别 FATAL、ERROR、WARN、INFO、DEBUG、TRACE等
          severity: 'Sev-1', // 告警级别 Sev-x
          errorCode: code, // 错误码,##如果有标准错误码定义的话，没有该字段就去掉
          trackId: (store.state.orderInfo && store.state.orderTrackId) || '',
          errorMetric: 'axios', // 错误关键字
          message: error.message, // 错误信息
          extra: {
            requestUri: error.config.url, // abc
            sourceUri: error.config.headers.referer
          },
          // 以下字段方便sentry查看控制台报错
          status: error.response && error.response.status,
          requestUri: error.config.url,
          sourceUri: error.config.headers && error.config.headers.referer
        })
        throw new Error('axios')
      }
      // console.error('Request Error ' + code, 'url:' + error.config.url)
    }
  })
}
