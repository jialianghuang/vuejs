// intercom.js

export default function({ app, store }) {
  if (window.is_chrome_lighthouse) {
    return false
  }
  if (
    window.location.href.includes('support/header') ||
    window.location.href.includes('support/footer') ||
    window.location.href.includes('/unsubscribe') ||
    window.location.href.includes('/comingsoon') ||
    window.location.href.includes('/maintenance') ||
    window.location.href.includes('/freeGift') ||
    window.location.href.includes('/all/special-occasion-dresses/kendall-kylie') ||
    window.location.href.includes('/checkout')
  ) {
    return false
  }

  // 在此处替换为您的Intercom app_id
  // const environment = store.state.environment
  // ste4q60c 为Azazie正式的id
  const APP_ID = 'ste4q60c'
  window.intercomSettings = {
    // api_base: 'https://api-iam.intercom.io',
    app_id: APP_ID,
    custom_launcher_selector: '#az_custom_link' // 自定义启动器的id
  }

  // 在页面加载时加载Intercom脚本
  ;(function() {
    const w = window
    const ic = w.Intercom
    if (typeof ic === 'function') {
      ic('reattach_activator')
      ic('update', w.intercomSettings)
    } else {
      const d = document
      const i = function() {
        i.c(arguments)
      }
      i.q = []
      i.c = function(args) {
        i.q.push(args)
      }
      w.Intercom = i
      const l = function() {
        const s = d.createElement('script')
        s.type = 'text/javascript'
        s.async = true
        s.src = `https://widget.intercom.io/widget/${APP_ID}`
        // const x = d.getElementsByTagName('script')[0]
        // x.parentNode.insertBefore(s, x)
        d.body.appendChild(s)
      }
      if (w.attachEvent) {
        w.attachEvent('onload', l)
      } else {
        w.addEventListener('load', l, false)
      }
    }
  })()
}
