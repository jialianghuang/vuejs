<template>
  <client-only>
    <div class="main-box support-box">
      <svg style="position: absolute; width: 0px; height: 0px; overflow: hidden;">
        <symbol id="icon-xxy_arrow_left_l" viewBox="0 0 1024 1024">
          <path
            d="M743.082667 1022.634667l48.469333-48.469334L329.045333 512 791.552 49.834667 743.082667 1.365333 232.448 512l510.634667 510.634667z"
          ></path>
        </symbol>
        <symbol id="iconic-logo" viewBox="0 0 7936 1024">
          <path
            d="M0 1022.3104L393.8816 0h146.176l419.6352 1022.3104h-154.624L685.568 712.704H256.768l-112.5888 309.6064H0z m295.936-419.84h347.5456l-106.8544-283.0336c-32.6656-86.016-56.9856-156.672-72.8064-211.968a1300.224 1300.224 0 0 1-55.296 195.1744l-112.64 299.776z m1283.2256 419.84v-125.5424l525.312-654.6944a1686.4256 1686.4256 0 0 1 106.2912-121.344H1638.656V0H2373.12v120.6784L1797.376 829.8496 1735.168 901.632h654.848v120.7296H1579.1616z m1458.1248 0L3431.2192 0h146.176l419.584 1022.3104h-154.5216l-119.6032-309.6064h-428.8512l-112.64 309.6064h-144.0768z m296.0384-419.84h347.648L3573.76 319.3856c-32.5632-86.016-56.832-156.672-72.704-211.968a1279.744 1279.744 0 0 1-55.296 195.1744l-112.4864 299.776z m1283.072 419.84v-125.5424l525.4144-654.6944a1680.384 1680.384 0 0 1 106.1888-121.344H4675.9424V0h734.464v120.6784L4834.6624 829.8496l-62.2592 71.7824H5427.2v120.7296H4616.3968z m1588.736 0V0h135.6288v1022.3104h-135.68z m965.2736 0V0h741.632v120.6784H7306.24v313.1392h567.3984v119.808H7306.24v348.0064h629.504v120.7296h-765.3376z"
            fill="var(--color-121212)"
          ></path>
        </symbol>
      </svg>
      <img v-if="ogUrl" :src="`https://graph.facebook.com/?id=${ogUrl}&scrape=true`" alt="og" style="display: none" />
      <template v-if="isMobile">
        <div class="is-mobile">
          <a :href="`/`" aria-label="back" class="back">
            <az-icon class="back-icon" icon-class="icon-xxy_arrow_left_l"></az-icon>
          </a>
          <a href="/" aria-label="logo" class="logo">
            <az-icon class="logo-icon" icon-class="iconic-logo"></az-icon>
          </a>
        </div>
      </template>
      <template v-else>
        <top-notification :notification="{}"></top-notification>
        <az-header-topbar :isMobile="isMobile"></az-header-topbar>
        <az-header-logo ref="azHeaderLogo" @refreshUser="getUserInfo" @refreshCart="getCartInfo" :isSupport="true"></az-header-logo>
      </template>
      <main-app v-if="showMainApp"></main-app>
    </div>
  </client-only>
</template>

<script>
import mainApp from '@/components/Main'
import _$ from '@/plugins/delegate'
import azHeaderTopbar from '@/components/common/AzHeaderTopbar'
import azHeaderLogo from '@/components/common/AzHeaderLogo'
import topNotification from '@/components/common/TopNotification'
import { init } from '@/plugins/commonAsyncData'
import { addGTM } from '@/assets/js/utils'

export default {
  name: 'SupportHeader',
  components: {
    mainApp,
    topNotification,
    azHeaderTopbar,
    azHeaderLogo
  },
  data() {
    return {
      ogUrl: '',
      showMainApp: false,
      isSemiSale: false,
      isMobile: false
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      return {
        ...commonAsyncData
      }
    } catch (error) {
      if (!/axios/.test(error)) {
        context.app.$throw(error, { $options: { name: context.route.name }, $route: context.route }, 'asyncdata')
      }
      context.error({
        statusCode: 200,
        message: 'service are unavailable temporarily, please refresh page!'
      })
    }
  },
  head() {
    const headJson = {
      // base: { target: '_blank', href: '/' }
      script: [
        {
          innerHTML: `var base = document.createElement('base');base.setAttribute('target', '_parent');document.head.appendChild(base)`,
          hid: 'baseHtml'
        }
      ],
      noscript: [],
      __dangerouslyDisableSanitizersByTagID: { baseHtml: ['innerHTML'] }
    }

    const glVar = typeof window === 'object' ? window : global
    const store = this.$store || this.store
    const langKey = `langs${store.state.language}`

    let glHTML = ''
    glHTML = `window.${langKey} =` + JSON.stringify(glVar[langKey])
    headJson.script.push({ innerHTML: glHTML, hid: 'global_data' })
    headJson.__dangerouslyDisableSanitizersByTagID.global_data = ['innerHTML']
    headJson.title = headJson.title === 'Azazie' || !headJson.title ? 'Azazie Header' : headJson.title

    addGTM(headJson, store.state.country)
    return headJson
  },
  created() {
    if (process.client) {
      this.getUserInfo()
      this.getCartInfo()
    }
  },
  mounted() {
    this.setMobile()
    window.onresize = () => {
      this.setMobile()
    }
    this.buryPoint(this, 'pageview', {
      lgt: new Date().getTime(),
      param1: (location && location.href) || '-1'
    })
    this.$cookie.setCookie('CountryCode', this.country, 30, '.' + this.APP_DOMAIN_LOWER)
    this.markReferer()
    this.bindGtmEvent()
    const criteoCookieHeader = this.$cookie.getCookie('criteo_cookie_header')
    if (criteoCookieHeader === null) {
      this.$cookie.setCookie('criteo_cookie_header', '1', 1)
    }
    const criteoPermCookie = this.$cookie.getCookie('criteo_cookie_perm')
    if (criteoPermCookie === null) {
      this.$cookie.setCookie('criteo_cookie_perm', '1', 1)
    }
    this.ogUrl = location.href
    let url = ''
    if (parent !== window) {
      try {
        url = window.parent.href
      } catch (e) {
        url = document.referrer
      }
    }
    if ((url && url.includes('subsite=bridal')) || (location.href && location.href.includes('subsite=bridal'))) {
      this.$store.commit('setIsBridal', true)
    }
  },
  methods: {
    getUserInfo() {
      this.$axios.$get(`/1.0/common/user-info`).then((res) => {
        this.$store.commit('userInfo/setUserInfoDown')
        if (res.code === 0) {
          const hasLogin = res.data.userId != null && res.data.userId != undefined && res.data.userId != 0
          const firstTime = this.$cookie.getCookie('first-in-time')
          if (typeof firstTime == 'undefined' || firstTime == null || firstTime.length == 0) {
            this.$cookie.setCookie('first-in-time', res.data.firstInTime, 100 * 12 * 31)
          }
          this.$store.commit('userInfo/updateInfo', res.data)
          if (hasLogin) {
            if (res.data.emailHashed != undefined) {
              if (typeof window.dataLayer !== 'undefined') {
                window.dataLayer.push({
                  event: 'UserInfo',
                  emailHashed: res.data.emailHashed ? res.data.emailHashed : 'unknown'
                })
              }
            }
            this.$cookie.setCookie('hasLogin', 1, 7, '.' + this.APP_DOMAIN_LOWER)
          } else {
            this.$cookie.setCookie('hasLogin', 0, 7, '.' + this.APP_DOMAIN_LOWER)
          }
        }
        this.$store.commit('userInfo/setWaitGetLogin', false)
      })
    },
    markReferer() {
      const referer = document.referrer
      const url = document.URL
      const re = new RegExp(/https*:\/\/(dev|d|ft|m|mp|p|www)\.azazie\.com/)
      if (referer == '' || referer.search(re) == -1) {
        this.$axios.$post(`/1.0/common/mark-referer`, { referer, url }).then((res) => {
          if (res.code == 0) {
            this.$cookie.setCookie('JJSREF', res.data.newTag, 180, '.' + this.APP_DOMAIN_LOWER)
          }
        })
      }
    },
    bindGtmEvent() {
      const self = this
      let obj = {}
      _$('body').delegate('click', '.need_datalayer', (e, node) => {
        obj = {
          category: node.getAttribute('data-datalayer-category'),
          label: node.getAttribute('data-datalayer-label'),
          action: node.getAttribute('data-datalayer-action') || 'Click'
        }
        self.setDataLayer(obj)
      })
    },
    async getCartInfo() {
      // 导航栏的购物车icon,hover上去有删除功能，删除之后获取购物车状态
      try {
        const res = await this.$axios.$get(`/1.0/cart`, {
          params: { for_checkout: 1, sodGalleryVersion: this.versionObj.sodGalleryVersion.toLowerCase() }
        })
        if (res.code == 0) {
          if (res.data.summary) {
            this.$store.commit('setCartInfo', {
              totalCount: res.data.forCheckoutQty,
              prodList: res.data.checkoutGoodsList || [],
              totalPrice: res.data.summary.goodsAmountDisplay,
              sample_gift_goods_id: '', //  后端说这个送头纱现在没有了
              activityInfo: res.data.activityInfo || {}
            })
          } else {
            this.$store.commit('setCartInfo', {
              totalCount: 0,
              prodList: [],
              totalPrice: 0,
              sample_gift_goods_id: '',
              activityInfo: {}
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    logout() {
      this.$refs.azHeaderLogo.logout()
    },
    setMobile() {
      const WIDTH = 980
      const rect = document.body && document.body.getBoundingClientRect()
      this.isMobile = rect.width - 1 < WIDTH
    }
  }
}
</script>

<style lang="less" scoped>
.main-box {
  border-bottom: 3px solid #f1f1f1;
  .is-mobile {
    font-size: 18px;
    padding-top: 25px;
    padding-bottom: 25px;
    font-family: @font-family-600, sans-serif;
    text-align: center;
    position: relative;
    text-transform: uppercase;
    .back {
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 15px;
      font-size: 19px;
      transform: translateY(-50%);
      .back-icon {
        width: 18px;
        height: 19px;
      }
    }
    .logo {
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 19px;
      transform: translate(-50%, -50%);
      .logo-icon {
        width: 156px;
        height: 18px;
      }
    }
  }
  &.support-box {
    width: 100%;
    min-width: unset;
    /deep/ #top-notification,
    /deep/ .az-header-topbar,
    /deep/ .activity-box,
    /deep/ .header-widgets,
    /deep/ .az-header-box {
      width: 100%;
      min-width: unset;
    }
  }
}
.blog-language {
  display: none;
}
</style>
