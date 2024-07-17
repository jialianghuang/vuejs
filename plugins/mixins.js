import azPicZoom from '@/components/az-ui/AzPicZoom'
import azIcon from '@/components/az-ui/AzIcon'
import PreSaleShippingNotice from '@/components/pre-sale/PreSaleShippingNotice'
import { mapState } from 'vuex'
import Vue from 'vue'
import 'lazysizes'
import 'lazysizes/plugins/attrchange/ls.attrchange'
import MD5 from 'js-md5'
import { loadScript } from '@/assets/js/utils'

import trackNebulas from '@/assets/js/point'
import { initSessionId, getDeviceId } from '@/assets/js/pointUtil'
import { getSourceTagFun } from '@/assets/js/commonFun'
Vue.component('az-icon', azIcon)
Vue.component('az-pic-zoom', azPicZoom)
Vue.component('PreSaleShippingNotice', PreSaleShippingNotice)

// 忽略 <klarna-placement> 组件未定义的报错，<klarna-placement> 为第三方使用的组件
Vue.config.ignoredElements = ['klarna-placement']

// Vue.config.errorHandler = function(err, vm, info) {
//   console.log(err)
//   console.log(vm)
//   console.log(info)
//   const msg = {
//     message: err.message,
//     time: new Date().getTime() / 1000,
//     components: vm && vm.$options.name,
//     route: vm && vm.$route
//   }
//   console.error(msg)
// }
const debug = process.env.NODE_ENV === 'development'
Vue.mixin({
  languageKeys: [...PreSaleShippingNotice.languageKeys],
  filters: {
    dropFanXie(str) {
      return (str || '').replace(/\\(['"])/g, '$1')
    }
  },
  data() {
    return {
      page_url: '',
      contentIdPrefix: 'AZcUSleng',
      currency: 'USD',
      followLinkList: [
        {
          type: 'facebook',
          label: 'FollowUs_FB_Click',
          href: 'https://www.facebook.com/azazieofficial',
          iconClass: 'icon-facebook'
        },
        {
          type: 'pinterest',
          label: 'FollowUs_PInterest_Click',
          href: 'http://www.pinterest.com/azazieofficial/',
          iconClass: 'icon-pinterest'
        },
        {
          type: 'twitter',
          label: 'FollowUs_Twitter_Click',
          href: 'https://twitter.com/azazieofficial',
          iconClass: 'icon-twitter'
        },
        {
          type: 'youtube',
          label: 'FollowUs_Youtube_Click',
          href: 'https://www.youtube.com/channel/UCwFD7opJZ9UeAp5ggadIUbA',
          iconClass: 'icon-youtube'
        },
        {
          type: 'instagram',
          label: 'FollowUs_Instagram_Click',
          href: 'http://instagram.com/azazieofficial',
          iconClass: 'icon-Instagram'
        },
        {
          type: 'tiktok',
          label: 'FollowUs_Tiktok_Click',
          href: 'https://www.tiktok.com/@azazieofficial',
          iconClass: 'icon-tiktok'
        }
      ],
      SecureWebScan: false, // 代码扫描 网站安全开关
      showCANotice: false
    }
  },
  computed: {
    ...mapState([
      'isSupportWebp',
      'dressType',
      'catId',
      'catIds',
      'catName',
      'jsKey',
      'APP_DOMAIN_LOWER',
      'HTTPS_HOST',
      'WEB_ROOT',
      'PIC_PATH',
      'APP_NAME_LOWER',
      'isFlashSale',
      'flashSale',
      'isComingSoon',
      'language',
      'languageName',
      'new_facebook_app_code',
      'country',
      'currentCountryUrl',
      'serverTime',
      'envApi',
      'environment',
      'activityInfo',
      'abtest',
      'versionObj',
      'versionGroup',
      'siteOptions',
      'languageOptions',
      'isNewLanguageCountry',
      'countryId',
      'countryName',
      'currencyCode',
      'currencySymbol',
      'headItemImageUrl',
      'popupActivityContentShow',
      'isCouponSwatch',
      'showLangsCode',
      'is_chrome_lighthouse',
      'wgdUesrTag',
      'isBridal',
      'version',
      'headerFixed',
      'openNotifyMe',
      'sodGalleryVersion',
      'registScene',
      'dbLandingPage',
      'showShoppingForDialog',
      'navigation'
    ]),
    ...mapState('userInfo', [
      'isLogin',
      'waitGetLogin',
      'userInfoName',
      'userInfoEmail',
      'cartNum',
      'showRoomNum',
      'storeRoomNum',
      'isGuest',
      'isRetailer',
      'guestCheckoutAuthorization',
      'userId',
      'userInfoUpdated',
      'intercom',
      'canReceiveSodCoupon'
    ]),
    countryLinkSource() {
      return this.country == 'CA' ? '?from=ca' : ''
    },
    domianLinkSource() {
      let source = ''
      if (this.country == 'CA') {
        source = 'from_domain=ca'
      } else if (this.country == 'US') {
        source = 'from_domain=com'
      } else if (this.country == 'AU') {
        source = 'from_domain=au'
      }
      return source
    },
    taxIncluseText() {
      // 优先取订单国家信息
      const resCountry = this.$route.query.order_country_code || this.country
      if (['AU'].includes(resCountry)) {
        return this.nl('page_common_gst_included')
      } else if (['FR', 'ES', 'IT'].includes(resCountry)) {
        return this.nl('page_common_vat_included')
      }
      return null
    },
    // 支付方式卡片
    payCardList({ country, $route }) {
      const currentCountry = $route.query.order_country_code || country
      let list = [
        'a-icon-visa',
        'a-icon-master_card',
        'a-icon-maestro',
        'a-icon-american_express',
        'a-icon-discover',
        'a-icon-diners_club',
        'a-icon-jcb'
      ]
      if (currentCountry == 'US') {
        list = [
          'a-icon-visa',
          'a-icon-master_card',
          'a-icon-maestro',
          'a-icon-american_express',
          'a-icon-discover',
          'a-icon-diners_club',
          'a-icon-jcb'
        ]
      } else if (['CA', 'MX'].includes(currentCountry)) {
        list = ['a-icon-visa', 'a-icon-master_card', 'a-icon-maestro', 'a-icon-american_express']
      } else if (['AU', 'GB', 'ES', 'DE', 'IT', 'IE', 'NL', 'BE', 'SE', 'AT', 'FI', 'DK'].includes(currentCountry)) {
        list = ['a-icon-visa', 'a-icon-master_card', 'a-icon-maestro']
      } else if (currentCountry == 'FR') {
        list = ['cartes-bancaires', 'a-icon-visa', 'a-icon-master_card', 'a-icon-maestro']
      }
      return list
    },
    otherPayCardList({ country, $route }) {
      let list = ['icon-paypal-card', 'icon-apple-pay-log']
      if (['SE', 'DK'].includes(country)) {
        list = ['icon-apple-pay-log']
      }
      if (country == 'US') {
        list = [...list, 'icon-afterpay', 'icon-cash-app-pay-log']
      }
      if (country != 'DE') {
        list = [...list, 'icon-google-pay-2']
      }
      // 西班牙/意大利/英国/DE/FR站点接入Klarna
      if (['ES', 'IT', 'GB', 'DE', 'FR'].includes(country)) {
        list = [...list, 'icon-klarna']
      }
      if (['DE'].includes(country)) {
        list = [...list, 'icon-sofort-log', 'icon-trustly-log']
      }
      if (['NL'].includes(country)) {
        list = [...list, 'icon-ideal']
      }
      if (['GB', 'ES'].includes(country)) {
        list = [...list, 'icon-trustly-log']
      }
      // if (['DE'].includes(country)) {
      //   list = [...list, 'icon-giropay']
      // }
      return list
    },
    // 支付方式卡片，每个国家包含的所有方式，主要用于页面底部展示
    allPayCardList({ country, $route }) {
      let list = [...this.payCardList, 'icon-paypal-card', 'icon-apple-pay-log']
      if (['SE', 'DK'].includes(country)) {
        list = [...this.payCardList, 'icon-apple-pay-log']
      }
      if (country == 'US') {
        list = [...list, 'icon-afterpay', 'icon-cash-app-pay-log']
      } else if (['MX'].includes(country)) {
        list = [...list, 'icon-oxxo']
      }
      if (country != 'DE') {
        list = [...list, 'icon-google-pay-1']
      }
      // 西班牙/意大利/英国/DE/FR站点接入Klarna
      if (['ES', 'IT', 'GB', 'DE', 'FR'].includes(country)) {
        // 购物车要根据商品是否包含样衣礼品卡来判断展示
        if (($route.name === 'cart' && this.$store.state.cart.cartHasKlarna) || $route.name !== 'cart') {
          list = [...list, 'icon-klarna']
        }
      }
      if (['DE'].includes(country)) {
        list = [...list, 'icon-sofort-log', 'icon-trustly-log']
      }
      if (['NL'].includes(country)) {
        list = [...list, 'icon-ideal']
      }
      if (['GB', 'ES'].includes(country)) {
        list = [...list, 'icon-trustly-log']
      }
      // if (['DE'].includes(country)) {
      //   list = [...list, 'icon-giropay']
      // }
      return list
    },
    // 默认使用cm单位
    showEuSize({ country }) {
      return ['CA', 'AU', 'FR', 'MX', 'DE', 'IT', 'ES', 'NL', 'BE', 'FI', 'SE', 'AT', 'DK'].includes(country)
    },
    // 根据语种展示日期格式
    dateFormatisplay({ country }) {
      switch (country) {
        case 'US':
        case 'CA':
          return 'MMM. DD, YYYY'
        case 'GB':
        case 'AU':
        case 'IE':
          return 'DD/MM/YYYY'
        case 'FR':
        case 'IT':
          return 'DD MMMM YYYY'
        case 'DE':
          return 'DD. MMM. YYYY'
        case 'MX':
          return 'D MMM. YYYY'
        default:
          return 'MMM. DD, YYYY'
      }
    },
    showTaxText({ country }) {
      // jira:20943 这些 IE/NL/BE 国家隐藏税率文案
      if (['IE', 'NL', 'BE'].includes(country)) {
        return false
      }
      return true
    },
    // 21040首页版本
    indexPageVersion({ versionObj }) {
      return versionObj.indexAbtest.toLowerCase()
    },
    catBiName() {
      const url = (this.$route && this.$route.path) || (typeof location === 'object' && location.href) || ''
      const res = (url || '').match(/(?:\/all\/)([^/]*)/)
      return res && res[1] ? res[1] : this.$store.state.list.apiCatName || ''
    },
    // shiping in 24 hours 开关
    shipingIn24Hours() {
      return true
    }
  },
  mounted() {
    this.page_url = location.href
  },
  methods: {
    /* 处理国家路径
      ignoreBridal: 是否忽略bridal参数判断
    */
    countryUrl(url, ignoreBridal) {
      if (url) {
        const reg = RegExp(
          /^\/checkout\/*|^\/checkout\?*|^\/cart\/*|^\/cart\?*|^\/all\/*|^\/dress\/*|^\/engagement-dresses*|^\/theme\/*|^\/swatches|^\/fabrics|^\/samples&swatches|^\/samples-swatches|^\/swatches&fabric|^\/swatches-fabric|^\/sashes|\/nbcf|\/nuxt\/list|\/products\/|\/*-g([0-9]+)\//
        )
        if (!url.startsWith('/') && !url.startsWith('http') && !url.startsWith('javascript')) {
          url = '/' + url
        }
        if (this.$store.state.isBridal && url.match(reg) && !url.includes('subsite=bridal') && !ignoreBridal) {
          url = url + (url.includes('?') ? '&' : '?') + 'subsite=bridal'
        }
        // 处理国家路径的拼接
        if (!this.currentCountryUrl) return url
        // 链接上如果已拼接国家语言路径，则不再拼接
        let langUrl = this.currentCountryUrl
        if (url.startsWith(this.currentCountryUrl)) {
          langUrl = ''
        }
        const host = 'https://www.azazie.com'
        if (url.startsWith(host + '/blog/') || url.startsWith('/blog/')) {
          // blog是nginx转发，非riven项目
          return url
        } else if (url.startsWith('http') || url.startsWith('javascript')) {
          // http开头、javascript 非host开头用自身值
          if (url.startsWith(host)) {
            // host开头的添加国家路径
            const path = url.split(host)[1]
            return host + langUrl + path
          }
          return url
        }
        return langUrl + url
      } else {
        return 'javascript:void(0)'
      }
    },
    unescape(html) {
      return html
        .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\\/g, '')
    },
    nl(key, defaultStr, obj) {
      // 入参 obj 可使用参数替换字符串中的占位符。
      // 例如：多语言字符串： page_common_hello_name: 'hello {name}'
      // 使用：this.nl('page_common_hello_name', null, { name: 'sunny' }) // 输出 hello sunny
      const showLangsCode = this.showLangsCode
      if (showLangsCode) {
        return key
      }
      const glVar = typeof window === 'object' ? window : global
      const langKey = `langs${this.$store.state.language}`
      const _langs = glVar[langKey] || {}
      // const _langs = this.$store.state.langs
      if (_langs[key] !== undefined) {
        let result = _langs[key]
        if (obj && obj.constructor === Object && Object.keys(obj).length > 0) {
          // 循环替换占位符数据
          for (const argKey in obj) {
            result = result.replace(new RegExp('\\{' + argKey + '\\}', 'g'), obj[argKey])
          }
        }
        return result
      }
      if (defaultStr !== undefined) {
        return defaultStr
      }

      // 多语言code为空日志阶段性关闭
      if (
        !this.$store.state.is_chrome_lighthouse &&
        key &&
        _langs[key] == undefined &&
        key.startsWith('page') &&
        this.environment &&
        this.environment.startsWith('prod')
      ) {
        // console.log('--------', key)
        // 多语言code key不存在，告警
        this.$store.dispatch('getErr', {
          time: new Date(),
          appName: '网站PC',
          biz: 'FRONT', // 业务线 FRONT
          level: 'ERROR', // 日志级别 FATAL、ERROR、WARN、INFO、DEBUG、TRACE等
          severity: `Sev-2`, // 告警级别
          errorCode: 423, // 错误码,##如果有标准错误码定义的话，没有该字段就去掉
          trackId: '',
          errorMetric: 'langue code error:  ' + key, // 错误关键字, vm 会出现未 undefined 的情况
          message: key, // 错误信息
          extra: {
            requestUri: this.$route.fullPath, // abc
            sourceUri: this.$route.fullPath
          }
        })
      }

      return key
    },
    setDataLayer(opts, isDataLayerAllow) {
      if (['list', 'product', 'index'].includes(this.$route.name) && !isDataLayerAllow) {
        return false
      }
      const isPro = this.HTTPS_HOST.match('^https://www.azazie.') || this.HTTPS_HOST.match('^https://m.azazie.')
      if (typeof opts === 'string' && opts != '') {
        if (typeof window.dataLayer !== 'undefined') {
          window.dataLayer.push({ event: opts })
          if (debug || !isPro) {
            console.log({ event: opts })
          }
        }
      } else if (typeof opts === 'undefined' || !opts.hasOwnProperty('category') || !opts.hasOwnProperty('label')) {
        return false
      } else {
        opts.action = opts.action ? opts.action : 'click'
        opts.value = opts.value ? opts.value : ''
        if (typeof window.dataLayer !== 'undefined' && typeof opts.category !== 'undefined' && typeof opts.label !== 'undefined') {
          window.dataLayer.push({
            event: 'common-event',
            'common-category': opts.category,
            'common-action': opts.action,
            'common-label': opts.label,
            'common-value': opts.value
          })
          // if (debug || !isPro) {
          //   console.table(opts)
          // }
        }
      }
    },
    // ga4打点
    setGA4DataLayer(opts) {
      if (!opts) return false
      delete opts.lgt
      delete opts.ea
      if (typeof window.dataLayer !== 'undefined' && typeof opts.event_name !== 'undefined') {
        if (opts.event_parameters && !opts.event_parameters.page_name) {
          opts.event_parameters.page_name = this.$route.path
        }
        opts.event = opts.event || 'ga4Event'
        window.dataLayer.push({ event_parameters: null })
        window.dataLayer.push({
          ...opts
        })
        // console.table({
        //   ...opts
        // })
      }
    },
    // ga4 打点，商品列表的单个商品数据整理。（备注：此方法仅适用于商品列表，比如推荐，列表页数据，不适用与加购或者订单模块）
    getGA4ListItem(type, info, index, itemListName) {
      const item = {
        item_id: info.goodsId,
        item_name: info.shownGoodsName,
        index: index + 1,
        item_category: info.catName,
        item_brand: info.brandId || 0,
        currency: this.currencyCode,
        item_list_name: itemListName
      }
      if (info.gaData && info.gaData.ecommProdId) {
        item.sku_id = info.ecommProdId
      }
      if (type != 'view') {
        // 点击商品的点会多两个信息
        item.item_category2 = info.shownColor
        item.price = info.shopPrice
      }
      return item
    },
    // ga4 打点，checkout的单个商品数据整理。（备注：此方法仅适用于checkout模块）
    getGA4CheckoutItem(info) {
      const item = {
        item_id: info.goodsId,
        item_name: info.shownGoodsName,
        item_category: info.catName,
        item_category2: info.shownColor,
        item_variant: this.getGoodsSize(info),
        item_brand: info.brandId || 0,
        price: info.shopPrice,
        quantity: info.goodsNumber,
        discount: info.priceOff,
        sku_id: info.gaData && info.gaData.ecommProdId
      }
      return item
    },
    getGoodsSize(item) {
      if (item.formatStyles && item.formatStyles.size) {
        if (item.formatStyles.size.CustomSize) {
          return item.formatStyles.size.CustomSize.name
        } else if (item.formatStyles.size.standardSize) {
          return item.formatStyles.size.standardSize.shownName
        }
      }
      return ''
    },
    // item list 相关的ga打点参数处理
    getGAItemListParams(item, index, type, from) {
      if (process.server || !item || !from) return
      const itemListName = this.getItemListName(from)
      const eventName = type === 'view' ? 'view_item_list' : 'select_item'
      let items = []
      if (Array.isArray(item)) {
        item.forEach((it, index) => {
          items.push(this.getGA4ListItem('view', it, index, itemListName))
        })
      } else {
        items = [this.getGA4ListItem(type, item, index, itemListName)]
      }

      const params = {
        event: 'ga4Event',
        event_name: eventName,
        event_parameters: {
          item_list_name: itemListName,
          items
        }
      }
      if (type === 'view') {
        // if (from == 'search') {
        //   params.event_parameters.search_term = this.$store.state.list.searchInfo ? this.$store.state.list.searchInfo.q : 'none'
        // }
      } else {
        const buttonName = type === 'imgClick' ? 'Image' : 'Title'
        params.event_parameters.product_name = item.shownGoodsName
        params.event_parameters.button_name = buttonName
      }
      return params
    },

    /**
     * GA4 new_email 事件
     * @param {string}  email 用户输入的邮箱，必传
     * @param {string}  type 区分类型，必传
     * @param {string}  role 角色参数，非必传
     * @param {string}  notReporting 是否不上报，非必传，默认false
     */
    trackGA4NewEmail(email, type, role, notReporting = false) {
      const { ip, country, region, regionCode, city } = this.$store.state.ipLocationData
      const _body = {
        email,
        type,
        ip,
        ip_country: country,
        ip_region: region,
        ip_region_code: regionCode,
        ip_city: city
      }
      if (role) _body.role = role
      this.$axios.$post('/1.0/email/email-list', _body).then((res) => {
        // 校验邮箱是否已存在，未存在情况下上报
        if (res.code === 0 && res.data && res.data.sendEvent && !notReporting) {
          this.setGA4DataLayer({
            event: 'ga4Event',
            event_name: 'new_email',
            event_parameters: {
              method: 'new_email',
              type
            }
          })
        }
      })
    },
    getItemListName(from) {
      let itemListName = ''
      if (from == 'completeTheLook') {
        // 详情页Complete The Look列表
        itemListName = 'complete the look list'
      } else if (from == 'youLookFor') {
        // 搜索页的 You May Look For列表 打点
        itemListName = 'you may look for list'
      } else if (from == 'youMayAlsoLike') {
        // 详情页you may also like
        itemListName = 'you may also like list'
      } else if (from == 'mostPopular') {
        // 详情页most popular
        itemListName = 'most popular list'
      } else if (from == 'recentlyViewd') {
        // 详情页recently viewed
        itemListName = 'recently viewed list'
      } else if (from == 'cartRecommend') {
        // 购物车 推荐
        itemListName = 'you may also like list'
      } else if (from == 'indexMostPopular') {
        // 为了跟详情页most popular 区分，这里用 indexMostPopular
        itemListName = 'most popular list'
      } else if (from == 'indexRecentlyViewd') {
        // 为了跟详情页recently viewed，这里用 indexRecentlyViewd
        itemListName = 'recently viewed list'
      } else if (from == 'list') {
        // 列表页
        itemListName = 'product list'
      } else if (from == 'search') {
        // 搜索列表页
        itemListName = 'search results list'
      } else if (from == 'designedtomatch') {
        // 加购成功弹窗
        itemListName = 'designed to match list'
      } else {
        itemListName = from + ' list'
      }
      return itemListName.toLowerCase()
    },
    // 邮箱正则校验
    emailFormCheck(email) {
      if (/^\w[\w.+-]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
        // 第一步校验通过正则校验（和上一版的区别在于@后面的从\w修改为了a-zA-Z0-9,因为_是不被允许的） 不过正则直接return false
        const splitArray = email.split('@')
        const localPart = splitArray[0]
        const domain = splitArray[1]
        return !(
          email.includes('..') || // 排除整个邮箱里的..
          localPart.charAt(localPart.length - 1) == '.' || // 排除Local-part以.结束 ，以.开头在正则里过滤掉
          domain.charAt(domain.length - 1) == '.' || // 排除domain以.结束 以.开头也在正则里过滤
          domain.charAt(domain.length - 1) == '-' || // 排除domain以-结束
          domain.charAt(0) == '-'
        ) // 排除domain以-开头
      } else {
        return false
      }
    },
    // 获取url参数
    getQueryValue(url, key) {
      const reg = new RegExp('(^|&|\\?|#)' + key + '=([^&]*)(&|\x24)', '')
      const match = url.match(reg)
      return match ? match[2] : ''
    },
    // key值去重
    uniqueByKey(arr, key) {
      const hash = {}
      const result = arr.reduce((total, currentValue) => {
        if (!hash[currentValue[key]]) {
          // 如果当前元素的key值没有在hash对象里，则可放入最终结果数组
          hash[currentValue[key]] = true // 把当前元素key值添加到hash对象
          total.push(currentValue) // 把当前元素放入结果数组
        }
        return total // 返回结果数组
      }, [])
      return result
    },
    setOrderTrackingLocalStorage(opts) {
      const labelName = opts.labelName
      const expireTime = opts.expireTime
      const curTime = Math.round(new Date() / 1000)
      const mainKey = 'OrderTracking'

      let mainValue = JSON.parse(this.$localStorage.getLocalStorage(mainKey))
      if (!mainValue) {
        // 初始值设置
        mainValue = {}
      }

      if (mainValue.hasOwnProperty(labelName)) {
        mainValue[labelName] = expireTime
        debug && console.log('local storage -> OrderTracking -> UPDATE item: ' + labelName)
      } else {
        mainValue[labelName] = expireTime
        debug && console.log('local storage -> OrderTracking -> INSERT item: ' + labelName)
      }
      // 清除过期项目， 保持大小
      for (const i in mainValue) {
        if (mainValue.hasOwnProperty(i)) {
          if (mainValue[i] <= curTime) {
            delete mainValue[i]
            debug && console.log('local storage -> OrderTracking -> REMOVE item: ' + i)
          }
        } else {
          debug && console.log('local storage -> OrderTracking -> ERROR iterating')
        }
      }

      // 更新配置
      this.$localStorage.setLocalStorage(mainKey, JSON.stringify(mainValue))
    },
    setOrderTrackingLocalStorageWithGoodsId(opts) {
      const labelName = opts.labelName
      const expireTime = opts.expireTime
      const goodsId = opts.goodsId
      const curTime = Math.round(new Date() / 1000)
      const mainKey = 'OrderTrackingWithGoodsId'

      let mainValue = JSON.parse(this.$localStorage.getLocalStorage(mainKey))
      if (!mainValue) {
        // 初始值设置
        mainValue = {}
      }

      if (mainValue.hasOwnProperty(labelName)) {
        mainValue[labelName].expireTime = expireTime
        !mainValue[labelName].goodsArr.includes(goodsId) && mainValue[labelName].goodsArr.push(goodsId)
        debug && console.log('local storage -> OrderTrackingWithGoodsId -> UPDATE item: ' + labelName)
      } else {
        this.$set(mainValue, labelName, { expireTime, goodsArr: [goodsId] })
        debug && console.log('local storage -> OrderTrackingWithGoodsId -> INSERT item: ' + labelName)
      }
      // 清除过期项目， 保持大小
      for (const i in mainValue) {
        if (mainValue.hasOwnProperty(i)) {
          if (mainValue[i].expireTime <= curTime) {
            delete mainValue[i]
            debug && console.log('local storage -> OrderTrackingWithGoodsId -> REMOVE item: ' + i)
          }
        } else {
          debug && console.log('local storage -> OrderTrackingWithGoodsId -> ERROR iterating')
        }
      }

      // 更新配置
      this.$localStorage.setLocalStorage(mainKey, JSON.stringify(mainValue))
    },
    // 订单追踪 添加强制执行标识
    setOrderSourceFlag(label, forced) {
      if (forced || this.jsKey === 'index' || this.jsKey === 'v6_category' || this.jsKey === 'cart') {
        const clickTimeStamp = Math.round(new Date() / 1000)
        const expire = clickTimeStamp + 7 * 24 * 3600
        this.setOrderTrackingLocalStorage({
          labelName: label,
          expireTime: expire
        })
      }
    },
    // 订单追踪 带goodsId
    setOrderSourceFlagWithGoodsId(label, goodsId) {
      const clickTimeStamp = Math.round(new Date() / 1000)
      const expire = clickTimeStamp + 7 * 24 * 3600
      this.setOrderTrackingLocalStorageWithGoodsId({
        labelName: label,
        goodsId,
        expireTime: expire
      })
    },
    // 滚动视图打点
    moduleVisibleDataLayer(elementList) {
      const that = this
      // 滚动响应检查可视
      window.addEventListener('scroll', function() {
        for (const p in elementList) {
          if (that.checkModuleVisible(elementList[p].elementId, elementList[p].triggerPercentage)) {
            if (elementList[p].currentStatus === false) {
              const eventCategory = elementList[p].eventCategory + '_View'
              const eventLabel = elementList[p].eventLabel + '_View'
              // event_point: 滚动而出现打点
              that.setDataLayer({
                action: 'View',
                category: eventCategory,
                label: eventLabel
              })
              elementList[p].currentStatus = true
            }
          } else {
            elementList[p].currentStatus = false
          }
        }
      })
    },
    checkModuleVisible(moduleName, percentage) {
      const module = document.querySelector(moduleName)
      if (!module) {
        return false
      }
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const screenInnerHeight = window.innerHeight
      let moduleTop = module.offsetTop
      const moduleHeight = module.offsetHeight
      // 递归找模块的绝对位置
      let curModule = module
      while ((curModule = curModule.offsetParent) != null) {
        moduleTop += curModule.offsetTop
      }
      const topLine = Math.max(scrollTop, moduleTop)
      const bottomLine = Math.min(scrollTop + screenInnerHeight, moduleTop + moduleHeight)
      const visibleHeight = bottomLine - topLine > 0 ? bottomLine - topLine : 0
      return visibleHeight / moduleHeight >= percentage
    },
    // 订单追踪 旧版 看还在使用中
    setModuleCookie(module, mark) {
      let key
      if (mark) {
        key = module + '-' + mark
      } else {
        key = module
      }
      const hasSetCookie = this.$cookie.getCookie(key)
      if (hasSetCookie === null) {
        this.$cookie.setCookie(key, 1, 7, '.' + this.APP_DOMAIN_LOWER)
      }
    },
    // fackbook Pixel 埋点
    trackFacebook(event, parameters) {
      const timeEventId = 'ATC_' + new Date().getTime()
      // if (typeof window.fbq !== 'undefined' && event) {
      //   window.fbq('track', event, { eventID: timeEventId, ...parameters }, { eventID: timeEventId })
      // }
      this.$axios.$post('/1.0/common/facebook/conversion-api', { event_id: timeEventId, event_name: event, ...parameters })
    },
    // Snapchat pixel 埋点
    trackSnapchat(event, parameters) {
      if (window && typeof window.snaptr !== 'undefined' && event) {
        window.snaptr('track', event, parameters)
      }
    },
    // 搜索页面
    trackSearch(item = {}) {
      this.trackFacebook('Search', {
        search_string: item.name,
        content_ids: item.style_ids.map((i) => this.contentIdPrefix + i.goodsId + 'c' + i.colorId),
        content_type: 'product',
        currency: this.currencyCode
      })
      // this.trackSnapchat('SEARCH')
      this.trackSnapchat('SEARCH', {
        search_string: item.name,
        item_ids: item.style_ids.map((i) => this.contentIdPrefix + i.goodsId + 'c' + i.colorId),
        currency: this.currencyCode
      })
    },
    // 列表页
    trackViewCategory(item = {}) {
      this.trackFacebook('ViewCategory', {
        content_ids: item.style_ids.map((i) => this.contentIdPrefix + i.goodsId + 'c' + i.colorId),
        content_type: 'product',
        currency: this.currencyCode
      })
      this.trackSnapchat('LIST_VIEW', {
        item_ids: item.style_ids.map((i) => this.contentIdPrefix + i.goodsId + 'c' + i.colorId),
        item_category: item.style_ids.map((i) => i.catName)[0],
        item_type: 'product',
        currency: this.currencyCode
      })
    },
    // 详情页
    trackViewContent(item = {}) {
      this.trackFacebook('ViewContent', {
        content_ids: [this.contentIdPrefix + item.goodsId + 'c' + item.colorId],
        content_name: item.goodsName,
        content_type: 'product',
        value: item.value,
        currency: this.currencyCode
      })
      this.trackSnapchat('VIEW_CONTENT', {
        item_ids: [this.contentIdPrefix + item.goodsId + 'c' + item.colorId],
        item_category: item.catName,
        item_type: 'product',
        price: item.value,
        currency: this.currencyCode
      })
    },
    // 加车按钮
    trackAddToCart(item = {}, baseInfo = {}) {
      this.trackFacebook('AddToCart', {
        content_ids: [this.contentIdPrefix + item.goodsId + 'c' + item.colorId],
        content_type: 'product',
        value: item.value,
        currency: this.currencyCode
      })
      this.trackSnapchat('ADD_CART', {
        item_ids: [this.contentIdPrefix + item.goodsId + 'c' + item.colorId],
        number_items: 1,
        currency: this.currencyCode,
        price: item.value
      })
    },
    // 支付按钮
    trackPurchase(item = {}) {
      this.trackFacebook('Purchase', {
        content_ids: item.style_ids.map((i) => this.contentIdPrefix + i.goodsId + 'c' + i.colorId),
        content_type: 'product',
        value: item.value,
        currency: this.currencyCode
      })
      this.trackSnapchat('PURCHASE', {
        item_ids: item.style_ids.map((i) => this.contentIdPrefix + i.goodsId + 'c' + i.colorId),
        transaction_id: item.orderSn,
        price: item.value,
        currency: this.currencyCode
      })
    },
    // Checkouti.formatStyles.color.id)
    trackInitiateCheckout(item = {}) {
      this.trackFacebook('InitiateCheckout', {
        content_ids: item.style_ids.map((i) => this.contentIdPrefix + i.goodsId + 'c' + i.colorId),
        content_type: 'product',
        value: item.value,
        currency: this.currencyCode
      })
      this.trackSnapchat('START_CHECKOUT', {
        item_ids: item.style_ids.map((i) => this.contentIdPrefix + i.goodsId + 'c' + i.colorId),
        payment_info_available: 1,
        currency: this.currencyCode,
        price: item.value
      })
    },
    trackInitiateCheckoutSuccess(orderInfo) {
      const that = this
      const id = orderInfo.orderSn
      const { paymentInfo, orderGoodsList } = this.$store.state.checkout
      let items = []
      items = orderGoodsList.map((item) => {
        return {
          item_id: item.goodsId,
          item_name: item.goodsName,
          discount: Math.abs(Number(item.bonus)),
          item_brand: item.brandId,
          item_category: item.catName,
          item_category2: '',
          item_category3: '',
          item_category4: '',
          item_variant: '',
          price: item.shopPrice,
          quantity: item.goodsNumber
        }
      })
      // gtm打点
      if (!window.is_chrome_lighthouse) {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          gtmId: 'GTM-M8LK9RD',
          'gtm.start': orderInfo.orderTime,
          event: 'purchase',
          currency: that.currencyCode, // 货币
          order_sn: MD5(id), // 订单号
          totalAmount: Number(orderInfo.totalAmount),
          payment_type: paymentInfo.name,
          value: Number(orderInfo.totalAmount),
          transaction_id: MD5(id),
          coupon: Number(orderInfo.bonus),
          shipping: Number(orderInfo.shippingFee),
          tax: Number(orderInfo.taxFee),
          ecommerce: { items }
        })
      }
      if (window.geq) {
        const params = {
          order_number: orderInfo.orderSn,
          order_amount: orderInfo.totalAmount,
          order_email: orderInfo.email
        }
        console.log('orderInfo:', orderInfo, params)
        window.geq.trackOrder(params)
      }
    },
    // upfluence 分析数据
    trackUpfluenceFun(orderInfo) {
      if (!window._upf) {
        window._upf = []
      }
      const { orderGoodsList } = this.$store.state.checkout
      const that = this
      const id = orderInfo.orderSn
      let items = []
      items = orderGoodsList.map((item) => {
        return {
          name: item.shownGoodsName,
          amount: Number(item.shopPrice),
          currency: that.currencyCode
        }
      })
      const upfArr = [
        'order',
        {
          order_id: id,
          order_name: id,
          amount: Number(orderInfo.totalAmount),
          currency: that.currencyCode,
          items,
          customer: {
            email: orderInfo.email
          }
        }
      ]
      window._upf.push(upfArr)
    },
    // signUp
    trackSignUp(item) {
      if (item === 'sign_up') {
        this.trackSnapchat('SIGN_UP', { success: 1 })
      }
    },
    // jira 4561
    subscribeSMSCode(phone) {
      const param = {
        phone
      }
      this.$axios.$post(`/1.0/user/phone-subscribe`, param).catch((error) => {
        console.log(error)
      })
    },
    ajaxRecordEmail(_email, _campaignId) {
      if (this.isLogin || !_email) return
      this.retentionReject()
      this.$axios
        .$post(`/1.0/email/add-user-email`, {
          params: {
            email: _email,
            activity_id: _campaignId
          }
        })
        .then((res) => {
          // console.log('success')
        })
        .catch((error) => {
          console.log(error)
        })
    },
    couponWheelFunc() {
      // coupon wheel 大转盘抽奖活动，用户未登录情况下，记录邮箱
      document.addEventListener('om.Optin.init.submit', (event) => {
        const email = event.detail.Optin.data.fields.email
        const phone = event.detail.Optin.data.fields.phone
        const campaignId = event.detail.Campaign.data.id
        if (email) {
          this.ajaxRecordEmail(email, campaignId)
        }
        // jiar 4561
        if (phone) {
          this.subscribeSMSCode(phone)
        }
      })
    },
    // 新的打点
    /**
     *
     * @param {*} vm
     * @param {*} type
     * @param {*} opts
     * @param {*} extraDp 路径，例如：'/list',默认路由地址
     * @param {*} targetPage 跳转到的目标页（目标页再进行打点），例如: 'product'
     * @returns
     */
    buryPoint(vm, type, opts, extraDp = null, targetPage = '') {
      // 为打点内容添加必传字段 lgt 必传
      const copyOpts = JSON.parse(JSON.stringify(opts))
      const typeString = Object.prototype.toString.call(copyOpts).slice(8, -1)
      if (typeString == 'Array') {
        copyOpts.forEach((item) => {
          item.lgt = item.lgt ? item.lgt : new Date().getTime()
        })
      } else {
        copyOpts.lgt = copyOpts.lgt ? copyOpts.lgt : new Date().getTime()
      }

      if (process.client) {
        if (Array.isArray(copyOpts) && copyOpts.length > 30) {
          let i = 0
          while (i * 30 < copyOpts.length) {
            trackNebulas(vm, type, copyOpts.slice(i * 30, (i + 1) * 30), extraDp, targetPage)
            i++
          }
        } else {
          trackNebulas(vm, type, copyOpts, extraDp, targetPage)
        }
      }
    },
    setPoint(ec, el, ea, msg = {}, extraDp = null, targetPage = '') {
      this.buryPoint(
        this,
        'event',
        {
          ec,
          el,
          ea,
          msg: JSON.stringify(msg)
        },
        extraDp,
        targetPage
      )
    },
    /**
     * event事件的打点信息
     * @param {string} ea  指定事件操作：click, view
     * @param {string} ec 组件的唯一名称
     * @param {string} el 事件标签
     * @param {json} msg 业务数据
     */
    pointInfo(ea, ec, el, msg, ...res) {
      const eventPointInfo = {
        lgt: new Date().getTime(),
        ec,
        el,
        ea,
        ...res[0]
      }
      if (msg) {
        eventPointInfo.msg = typeof msg === 'object' ? JSON.stringify(msg) : msg
      }
      return eventPointInfo
    },
    // 过滤因为轮播多余的gtm打点
    cancelExtraPoint(key, value) {
      const data = sessionStorage.getItem(key)
      if (data) {
        return false
      } else {
        sessionStorage.setItem(key, value)
        return true
      }
    },
    inViewPort(el, percent) {
      if (!el) {
        return false
      }
      const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      const top = el.getBoundingClientRect() && el.getBoundingClientRect().top
      const elHeight = el.offsetHeight
      const visibleHeight = top > 0 ? viewPortHeight - top : elHeight + top
      return visibleHeight / elHeight >= percent
    },
    isInTime(time1, time2, serverTime) {
      if (time1 && time2 && serverTime) {
        const time1GetTime = new Date(time1.replace(/-/g, '/')).getTime()
        const time2GetTime = new Date(time2.replace(/-/g, '/')).getTime()
        const serverTimeGetTime = new Date(serverTime.replace(/-/g, '/')).getTime()
        return time1GetTime < serverTimeGetTime && time2GetTime > serverTimeGetTime && time2GetTime > time1GetTime
      } else {
        return false
      }
    },
    addWebpSuffix(url, notWebp) {
      if (this.isSupportWebp && !notWebp && (url + '').startsWith('http') && (url + '').includes('cdn-1')) {
        return (url + '').replace(/(\.jpg|\.png|\.jpeg)$/g, ($, $1) => $1 + '.webp')
      } else {
        return url
      }
    },
    /**
     * 网站图片 替换 cnd 链接，为了不影响之前使用webp的地方，新增方法处理。
     * 在网站未使用 addWebpSuffix 方法的地方，加 replaceImgCdnUrl 方法处理替换cnd链接
     * 本次的处理方式是，先把网站确认能走webp格式的地方，都加上了addWebpSuffix方法，不能确认的加上了replaceImgCdnUrl
     * 最新需求: 网站图片全部走 cdn-1
     * @param {*} url 初始url
     */
    replaceImgCdnUrl(url) {
      return url
    },
    /**
     * 网站客服support链接处理域名方法
     * url: 老的Zendesk 链接
     * intercomUrl： 新的intercom的链接
     * 由于目前是过渡期，所以第一个参数url和第二个参数intercomUrl都要入参。（可以都直接给新的intercom链接）后续intercom完全稳定之后，再优化代码。
     * 避免因为网站语言缩写和faq语言缩写不匹配出错，后续新增语言再根据需要添加
     */
    getSupportUrl(url, intercomUrl) {
      const language = this.$store.state.language
      if (intercomUrl) {
        // 新的intercom
        let intercomBaseUrl = 'https://customerservice.azazie.com/en'
        if (language === 'fr') {
          intercomBaseUrl = 'https://customerservice.azazie.com/fr'
        } else if (language === 'es') {
          intercomBaseUrl = 'https://customerservice.azazie.com/es'
        } else if (language === 'de') {
          intercomBaseUrl = 'https://customerservice.azazie.com/de'
        } else if (language === 'it') {
          intercomBaseUrl = 'https://customerservice.azazie.com/it'
        } else if (language === 'nl') {
          intercomBaseUrl = 'https://customerservice.azazie.com/nl'
        } else if (language === 'da') {
          intercomBaseUrl = 'https://customerservice.azazie.com/da'
        } else if (language === 'se') {
          intercomBaseUrl = 'https://customerservice.azazie.com/sv'
        } else if (language === 'fi') {
          intercomBaseUrl = 'https://customerservice.azazie.com/fi'
        }
        return `${intercomBaseUrl}${intercomUrl || ''}`
      } else {
        // 老的Zendesk
        let supportUrl = 'https://support.azazie.com/hc/en-us'
        if (language === 'fr') {
          supportUrl = 'https://support.azazie.com/hc/fr'
        } else if (language === 'es') {
          supportUrl = 'https://support.azazie.com/hc/es'
        } else if (language === 'de') {
          supportUrl = 'https://support.azazie.com/hc/de'
        } else if (language === 'it') {
          supportUrl = 'https://support.azazie.com/hc/it'
        }
        return `${supportUrl}${url || ''}`
      }
    },
    // 获取不同国家对应的页面底部的blog链接
    getBlogUrl(url) {
      if (this.country === 'FR') {
        url = 'https://www.azazie.com/blog/fr/posts/'
      } else if (['DE', 'AT'].includes(this.country)) {
        url = 'https://www.azazie.com/blog/de/posts/'
      }
      return url
    },
    setMessageZindex(bol) {
      if (process.client) {
        const zIndex = bol ? 1 : 999998
        const messageBtn = document.getElementById('launcher')
        messageBtn && (messageBtn.style.zIndex = zIndex)
      }
    },
    async updateUserTag(params) {
      // comments: 登录且存在参数调用更新接口
      if ((this.isLogin || this.isGuest) && Object.keys(params).length > 0) {
        params.sessionId = initSessionId()
        params.deviceId = getDeviceId()
        params.version = process.env.GIT_VERSION || this.version
        await this.$axios.$post('/1.0/common/user-tag-update', params)
      }
      // comments: 订单追踪同时存在保留wgd_user_cpcsource
      const mainValue = JSON.parse(this.$localStorage.getLocalStorage('OrderTracking'))
      if (mainValue) {
        /* eslint-disable */
        if (mainValue['wgd_user_cpcsource'] && mainValue['wgd_user_list']) {
          delete mainValue['wgd_user_list']
        }
      }
    },
    async getUserTag() {
      const tagResult = await this.$axios.$post('/1.0/common/user-tag')
      if (tagResult.code == 0) {
        // WGDLanded  WGDSource
        this.$store.commit('setWgdUesrTag', tagResult.data)
      }
    },
    // todo: 记录并更新标记信息
    async updateWGDTag(bol) {
      if (bol) {
        await this.getUserTag()
      }
      const firstEntryCookie = this.$cookie.getCookie('wgd_first_entry_tag')
      const WGDLandedCookie = this.$cookie.getCookie('wgd_landed_is')
      const WGDSourceCookie = this.$cookie.getCookie('wgd_source_is_new')

      const params = {}
      let wgdSource = this.$route.query.src ? this.$route.query.src.toString() : ''
      // todo: 若不是入口看用户信息是否存在
      if (!wgdSource) {
        if (this.wgdUesrTag.WGDSource) {
          wgdSource = this.wgdUesrTag.WGDSource
        } else {
          // todo: 游客
          wgdSource = WGDSourceCookie && decodeURIComponent(WGDSourceCookie)
        }
      }
      if (wgdSource === 'Direct') {
        wgdSource = 'wgdcpc'
      } else if (wgdSource === 'nonDirect') {
        wgdSource = ''
      }
      let wgdLanded = 'no'
      // todo: 首次进入且命中目标页
      const isReferrer =
        !document.referrer || (document.referrer && !document.referrer.includes('.azazie.') && !document.referrer.includes('localhost'))
      if (isReferrer) {
        if ((firstEntryCookie == 'wgdList' || wgdSource) && this.$route.name == 'list' && this.isSpecialCatId(this.catId)) {
          wgdLanded = this.catId == 3110 ? 'atelier' : 'yes'
        } else if ((firstEntryCookie == 'wgdDetail' || wgdSource) && this.$route.name === 'product' && this.isSpecialCatId(this.catId)) {
          wgdLanded = this.catId == 3110 ? 'atelier' : 'yes'
        }
      }

      const textArr = ['atelier', 'yes']
      if (!textArr.includes(wgdLanded)) {
        if (this.isLogin && textArr.includes(this.wgdUesrTag.WGDLanded)) {
          wgdLanded = this.wgdUesrTag.WGDLanded
        }
        if (textArr.includes(WGDLandedCookie)) {
          wgdLanded = WGDLandedCookie
        }
      }
      if (wgdSource) {
        params.WGDSource = wgdSource
        this.$cookie.setCookie('wgd_source_is_new', wgdSource)
        this.setOrderSourceFlag('wgd_user_cpcsource', true)
        // todo: 补充当src存在且是wgd列表页或详情页
        if (['list', 'product'].includes(this.$route.name) && this.isSpecialCatId(this.catId) && isReferrer) {
          wgdLanded = this.catId == 3110 ? 'atelier' : 'yes'
        }
      }
      if (textArr.includes(wgdLanded)) {
        params.WGDLanded = wgdLanded
        this.$cookie.setCookie('wgd_landed_is', wgdLanded)
        this.setOrderSourceFlag('wgd_user_list', true)
      }
      // todo: 调用更新接口
      await this.updateUserTag(params)
    },
    // 点击加购或者购买按钮的时候获取sourceTag
    getSourceTag(baseInfo) {
      if (this.isSpecialCatId(baseInfo.catId)) {
        const path = this.$route.path
        const query = this.$route.query
        // 获取操作来源标签
        const sourceTag = getSourceTagFun(path, query, true, null, this, baseInfo.catId)
        return sourceTag
      }
      return null
    },
    /**
     * 获取跳转到商品详情页的url
     * @param {*} url 进入商品详情页的初始url
     * @param {*} tag 已存在的sourceTag，如购物车，showroom中的商品
     * @param {*} defaultTag 默认tag，用到的场景比较少，目前仅搜索弹框商品用到
     * @returns 修改的进入的商品详情页的url
     */
    getNavGoodsDetailUrl(url, tag, defaultTag, catId) {
      let sourceTag = ''
      if (tag) {
        sourceTag = tag
      } else {
        const path = this.$route.path
        const query = this.$route.query
        sourceTag = getSourceTagFun(path, query, false, defaultTag, this, catId)
      }
      // 在目标url路径上加上tag
      if (url && sourceTag) {
        if (url.includes('?')) {
          url = url + '&sourceTag=' + sourceTag
        } else {
          url = url + '?sourceTag=' + sourceTag
        }
      }
      return url
    },
    /**
     * 进入详情页的url
     * @param {*} url 原始url
     * @param {*} item 带有catId的对象
     * @param {*} defaultTag 默认tag，用到的场景比较少，目前仅搜索弹框商品用到
     */
    navToGoodsDetail(url, item = {}, defaultTag) {
      let resUrl = this.countryUrl(url)
      if (this.isSpecialCatId(item.catId)) {
        resUrl = this.getNavGoodsDetailUrl(resUrl, item.sourceTag, defaultTag, item.catId)
      }
      if (item && item.goodsId && item.goodsId == 1003491) {
        // 0.1元皮尺，不可点击跳转
        return 'javascript:void(0)'
      }
      return resUrl
    },
    // 链接跳转目标页是否新开标签
    targetBlank(flag) {
      if (flag) {
        return '_blank'
      }
      return '_self'
    },
    cdnReplace(url) {
      return url.replace('cdn-1.azazie.com', this.environment == 'prod' ? 'www.azazie.com' : 'p.azazie.com')
    },
    // 设置complete the look 模块展示位置
    setCompletePosition() {
      // wgd 固定展示在右边
      if (this.isSpecialCatId(this.catId)) {
        this.$store.commit('product/setCompleteTheLookPosition', {
          left: false,
          right: true
        })
        return
      }
      // 非wgd 在1440屏幕的时候根据左右高度展示
      this.$nextTick(() => {
        const bigPicDom = document.querySelector('.thumb_detail .prod-thumb-right')
        const productInfoDom = document.querySelector('.prod-thumb-box .prod-info .prod-info-container')
        if (bigPicDom && productInfoDom) {
          const leftHeight = bigPicDom.getBoundingClientRect().height
          const rightHeight = productInfoDom.getBoundingClientRect().height
          const bol = leftHeight < rightHeight
          if (document.documentElement.clientWidth <= 1440) {
            this.$store.commit('product/setCompleteTheLookPosition', {
              left: bol,
              right: !bol
            })
          } else {
            this.$store.commit('product/setCompleteTheLookPosition', {
              left: false,
              right: true
            })
          }
        }
      })
    },
    cdnPrvd(catId) {
      // cdn的供应商
      // cl: cloudfront， ak:Akamai
      // return catId == 9 ? this.versionObj && this.versionObj.imgCdnAbtest === 'B' ? 'ak' : 'cl' : -1
      return 'cl'
    },
    // sod 详情页abtest B版本 ， 非样衣 非rts商品
    sodDetailVersionFun(baseInfo) {
      const { catId, dressType, isFinalSale } = baseInfo
      return this.isSpecialCatId(catId) && dressType != 'sample' && !isFinalSale
    },
    /**
     * sod 激励打点
     * @param {*} el
     * @param {*} ec
     * @param {*} item 商品基本信息
     * @param {*} text 激励文案
     * @param {*} from 来源
     * @param {*} sticker 激励文案对象
     * @returns
     */
    getExcitationParams(el, ec, item, text, from, sticker) {
      if (!this.isSpecialCatId(item.catId) || item.isFinalSale || item.dressType == 'sample') return {}
      const msg = {
        goodsId: item.goodsId,
        color: item.color, // 这个color就是key 是当前商品的选中颜色
        cat_name: item.catName,
        dress_type: item.dressType,
        cat_id: item.catId,
        wgd_ver: 'A', // abtest
        attr2: from // 来源
      }
      return {
        id: item.goodsId + item.color + item.goodsUrl + el + ec + from,
        common: {
          ec,
          el,
          msg: JSON.stringify(msg)
        }
      }
    },
    // 列表页 推荐位 获取激励文案
    getExcitationSticker(item) {
      if (item.driveInfo && item.driveInfo.listSticker && Object.keys(item.driveInfo.listSticker).length) {
        return item.driveInfo.listSticker
      }
      return {}
    },
    getCouponCode(from) {
      if (from == 'completeTheLook') {
        return 'HiBeauty'
      }
      if (from == 'cartRecommend') {
        return '1stSOD'
      }
      return 'HiBeauty'
    },
    showCouponCode(item) {
      return this.isSpecialCatId(item.catId)
    },
    // 获取折扣信息函数
    getPromoteValue(selectedSize = {}, styleId, discountInfoMessage = {}) {
      const { promoteMap = {} } = discountInfoMessage
      const colorPromoteMap = promoteMap[styleId] || {}
      let value = null
      if (selectedSize.styleId) {
        if (colorPromoteMap[selectedSize.styleId]) {
          value = colorPromoteMap[selectedSize.styleId].value || ''
        }
      } else {
        value = (colorPromoteMap.allSize && colorPromoteMap.allSize.value) || ''
      }
      return value
    },
    /**
     * 判断某个catId dressType 是否是大码
     * @param {String | Number} catId 品类id
     * @param {Array} sizes 所选尺码, 存在多个值的情况
     * @returns {Boolean} 返回一个值判断是否是指定catId大码
     */
    /*
        2--WD16
        7--A16
        45--A16
        158--A16
        3--1x 2x 3x
        206--A16 WD16(clearance outlet sample)
    */
    validateIsPlusSize(catId, sizes = []) {
      if (!this.isInCatIds(catId)) return false
      let isPlusSize = false
      if (Array.isArray(sizes)) {
        if ([2, 7, 45, 158, 206].includes(catId)) {
          isPlusSize = !!sizes.length && sizes.every((item) => item.replace(/\D/g, '') >= 16)
        }
        // sod 目前只有 1x 2x 3x
        if (this.isSpecialCatId(catId)) {
          isPlusSize = !!sizes.length && sizes.every((item) => ['1x', '2x', '3x'].includes(item))
        }
      } else {
        isPlusSize = sizes.replace(/\D/g, '') >= 16 || ['1x', '2x', '3x'].includes(sizes)
      }
      return isPlusSize
    },
    /**
     * 以下分类做大小码图，根据返回值传参
     * @param {String | Number} catId
     * @returns {Boolean} 返回判断是否在内
     */
    isInCatIds(catId) {
      return [2, 3, 7, 45, 158, 206, 3110].includes(catId)
    },
    // 能收集邮箱的地方拒绝第三方收集
    retentionReject() {
      window.geq && window.geq.suppress && window.geq.suppress()
    },
    // 第三方加车收集信息
    retentionAddToCart(baseInfo = {}, rec_id) {
      let productID = `${baseInfo.goodsId}-${rec_id}`
      if (baseInfo.csText) {
        productID += `${baseInfo.csText}`
      }
      if (!this.isLogin || this.environment != 'prod') {
        const productItemInfo = {
          quantity: baseInfo.goodsNumber || 1,
          name: baseInfo.shownGoodsName,
          price: baseInfo.shopPriceDisplay,
          productID,
          categories: `${baseInfo.dressType}-${baseInfo.catId}`,
          imageURL: this.PIC_PATH + 's240/' + baseInfo.goodsThumb,
          URL: this.APP_DOMAIN_LOWER + baseInfo.goodsUrl,
          brand: baseInfo.brandId,
          compareAtPrice: baseInfo.shopPriceDisplay,
          country_code: this.country,
          language_code: this.language
        }
        window.geq && window.geq.addToCart(productItemInfo)
      }
    },
    trackClick(ec, el, ec2, el2, cdn, count, desc, targetPage = null) {
      const items = [{ ec, el, ea: 'click' }]
      if (ec2 && el2) {
        items.push({
          ec: ec2,
          el: el2,
          ea: 'click',
          msg: JSON.stringify({
            cdn,
            count,
            desc,
            isBridal: Number(this.isBridal)
          })
        })
      }
      this.buryPoint(this, 'events', items, null, targetPage)
    },
    // 图片url， 第几张，热区内容，描述
    getNewTrackParams(ec, el, cdn, count, clickzone, desc) {
      const msg = {}
      if (cdn) {
        msg.cdn = cdn
      }
      if (count) {
        msg.count = count
      }
      if (clickzone) {
        msg.clickzone = clickzone
      }
      if (desc) {
        msg.desc = desc
      }
      msg.isBridal = Number(this.isBridal)
      return {
        ec,
        el,
        msg: JSON.stringify(msg)
      }
    },
    // 动态获取定位 ip 地址 code
    async getLocationCode() {
      if (this.environment.includes('dev') || this.environment.includes('test')) return
      const result = await this.$axios.get('/1.0/geolocation')
      const { country, regionCode } = result.data
      this.$store.commit('setIpLocationData', result.data)
      if (country == 'US' && regionCode == 'CA') {
        this.showCANotice = true
        const randomId = new Date().getTime()
        loadScript('/polaris.js?1712129260030', randomId, () => {
          window.polaris && window.polaris.__reinitConsentBanner && window.polaris.__reinitConsentBanner()
        })
      }
    },
    // 色卡内容显示code逻辑
    showCode(baseInfo) {
      if (process.server) return null
      const UnLoginEmail = this.$cookie.getCookie('UnLoginEmail')
      if (!UnLoginEmail && !this.isLogin && baseInfo.activityCouponCode == 'swatch2024') {
        return null
      }
      return baseInfo.activityCouponCode
    },
    // 替换颜色 商品名称中间 / 替换成 and
    replaceBackslashToAndText(text, baseInfo) {
      if (text && this.isSpecialCatId(baseInfo.catId) && baseInfo.isMassProduct == 0) {
        return text.replace('/', ` ${this.nl('page_common_and')} `)
      }
      return text
    },
    isSpecialCatId(catId) {
      return [3, 3110].includes(catId)
    },
    async getGoodsIds(from = 'product') {
      const result = await this.$axios.$get('/1.0/get-skc-coming-soon-config')
      this.$store.commit(`${from}/setComingSoonGoodsId`, result.data)
    },
    getColorAndSizeText(formData) {
      const colorStyleId = formData.get('styles[select][color]')
      const sizeStyleId = formData.get('styles[select][size]')
      let colorAndSizeText = ''
      if (colorStyleId) {
        colorAndSizeText += `-c${colorStyleId}`
      }
      if (sizeStyleId) {
        colorAndSizeText += `-s${sizeStyleId}`
      }
      return colorAndSizeText
    }
  }
})
