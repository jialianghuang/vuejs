import Vue from 'vue'

export default ({ app, store, route, req, redirect }) => {
  const errorHandler = (error, vm, info, code) => {
    if (error.stack.includes('socket hang up')) return
    store.dispatch('getErr', {
      time: new Date(),
      appName: '网站PC',
      biz: ['NL', 'BE', 'SE', 'AT', 'DK', 'FI'].includes(store.state.country) ? 'FRONT2' : 'FRONT', // 业务线 FRONT BACKEND  ERP  BI  因为存在一部二部一起开发，FRONT2 代表二部接受报警
      level: 'ERROR', // 日志级别 FATAL、ERROR、WARN、INFO、DEBUG、TRACE等
      severity: `Sev-1`, // 告警级别 Sev-x Sev-${info == 'asyncdata' ? 1 : 2}
      errorCode: code || 420, // 错误码,##如果有标准错误码定义的话，没有该字段就去掉
      trackId: (store.state.orderInfo && store.state.orderTrackId) || '',
      errorMetric: vm && vm.$options && vm.$options.name + '--' + info, // 错误关键字, vm 会出现未 undefined 的情况
      message: error.stack, // 错误信息
      extra: {
        requestUri: req && req.headers && req.headers.host + vm.$route.fullPath, // abc
        sourceUri: req && req.headers && req.headers.host + vm.$route.fullPath
      },
      jsKey: store && store.state.jsKey
    })
    // sentry 报错,主动调用$throw的需要上传sentry，其他自动捕获的sentry会自动捕获上传，不需要这里手动处理
    if (['head', 'asyncdata'].includes(info)) {
      const captureExceptionData = {
        error,
        extra: {
          page: vm && vm.$options && vm.$options.name,
          error
        }
      }
      app.$AZCaptureException(captureExceptionData, info)
    }
    // 方便本地开发的时候能快速定位到错误
    if (store.state.environment.includes('dev')) {
      throw error
    }
  }
  Vue.config.errorHandler = errorHandler
  // Vue 实例
  app.$throw = (error, vm, info, code) => errorHandler(error, vm, info, code)
  Vue.prototype.$throw = errorHandler
}
