import * as Sentry from '@sentry/vue' // client
import SentryUtil from '@/assets/js/sentry-util'
import Vue from 'vue'
import { BrowserTracing } from '@sentry/tracing'

export default (context) => {
  const { app, store } = context
  const environment = store.state.environment
  const isChromeLighthouse = store.state.is_chrome_lighthouse
  const flag = false
  if (environment.includes('dev') || environment.includes('test') || isChromeLighthouse || flag) {
    Vue.prototype.$sentry = null
    app.$sentry = null
    Vue.prototype.$AZCaptureException = () => {}
    app.$AZCaptureException = () => {}
    return false
  }
  Sentry.init({
    Vue,
    dsn: process.env.SENTRY_DSN,
    environment: `${environment}`,
    // 参考https://docs.sentry.io/platforms/javascript/guides/wasm/configuration/filtering/
    ignoreErrors: [
      // Random plugins/extensions
      'top.GLOBALS',
      // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      'http://tt.epicplay.com',
      "Can't find variable: ZiteReader",
      'jigsaw is not defined',
      'ComboSearch is not defined',
      'http://loading.retry.widdit.com/',
      'atomicFindClose',
      // Facebook borked
      'fb_xd_fragment',
      // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
      // reduce this. (thanks @acdha)
      // See http://stackoverflow.com/questions/4113268
      'bmi_SafeAddOnload',
      'EBCallBackMessageReceived',
      // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
      'conduitPage',
      'Non-Error exception captured',
      'Non-Error promise rejection captured',
      'Network Error',
      'socket hang up',
      'Failed to fetch',
      'Load failed',
      'cancelled'
    ],
    denyUrls: [
      // Facebook flakiness
      /graph\.facebook\.com/i,
      // Facebook blocked
      /connect\.facebook\.net\/en_US\/all\.js/i,
      // Woopra flakiness
      /eatdifferent\.com\.woopra-ns\.com/i,
      /static\.woopra\.com\/js\/woopra\.js/i,
      // Chrome extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /safari-extension:\/\//i,
      // Other plugins
      /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
      /webappstoolbarba\.texthelp\.com\//i,
      /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
      // zdassets
      /zdassets\.com/i,
      /sc-static\.net/i,
      /static\.cloudflareinsights\.com/i,
      /cdn\.attn\.tv/i,
      /googletagmanager\.com/i,
      /analytics\.tiktok\.com/i,
      /aswpsdkus\.com/i
    ],
    beforeSend(event, hint) {
      const ignoreMsgs = SentryUtil.ignoreMsgs || []
      const ignoreCode = SentryUtil.ignoreCode || []
      if (ignoreMsgs.includes(hint.originalException)) return null
      if (hint.originalException && ignoreCode.includes(hint.originalException.code)) return null
      return event
    },
    integrations: [new BrowserTracing()],
    // 测试的时候采样率设置成1.0，上线后需要改成0.1。防止数据太多，让Sentry服务器一下子打满
    tracesSampleRate: 0.1,
    tracingOptions: {
      trackComponents: true
    }
  })
  SentryUtil.initSentry(Sentry, context)

  const AZCaptureException = (captureExceptionData, type) => {
    SentryUtil.AZCaptureException(context, Sentry, captureExceptionData, type)
  }

  Vue.prototype.$sentry = Sentry
  Vue.prototype.$AZCaptureException = AZCaptureException
  app.$sentry = Sentry
  app.$AZCaptureException = AZCaptureException
}
