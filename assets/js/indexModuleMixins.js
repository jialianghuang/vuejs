/**
 * 新版首页各模块共用数据
 */
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    skeleton: {
      type: Boolean,
      default() {
        return true
      }
    },
    indexBannerPosition: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loaded: false,
      defaultBackgroundImg: require('~/assets/images/goodsList/img-bg.png')
    }
  },
  computed: {
    styleInfo() {
      return {
        background: `url(${this.defaultBackgroundImg}) no-repeat center center/ 74px 80px, var(--color-f9f9f9)`
      }
    },
    bannerCreativeSlot() {
      const position = this.indexBannerPosition.indexOf(this.item.keyStr)
      let creativeSlot = null
      // ga4 首页banner 打点从上往下排，如果后面还有新增，下面的key继续往后加
      const creativeSlotList = [
        'top banner',
        'first mid banner',
        'second mid banner',
        'third mid banner',
        'fourth mid banner',
        'fifth mid banner'
      ]
      if (position > -1) {
        creativeSlot = creativeSlotList[position]
      }
      return creativeSlot
    }
  },
  methods: {
    getBiParams(ec, el) {
      if (process.server || !ec) return
      const obj = {
        dp: 'home',
        ec,
        el
      }
      return obj
    },
    getImgStyle({ _imgLoaded }) {
      if (_imgLoaded) return {}
      // 默认取第一个图片宽高
      const el = this.$el && this.$el.querySelector('img')
      const height = el && el.offsetHeight
      const width = el && el.offsetWidth
      if (height >= 80 && width >= 74) {
        return {
          background: `url(${this.defaultBackgroundImg}) no-repeat center center/ 74px 80px, var(--color-f9f9f9)`
        }
      } else if (!height && !width) {
        // ssr
        return {
          background: `var(--color-f9f9f9)`
        }
      } else {
        // 过小
        return {
          background: `url(${this.defaultBackgroundImg}) no-repeat center center/ contain, var(--color-f9f9f9)`
        }
      }
    },
    imgLoad(banner) {
      this.loaded = true
      this.$set(banner, '_imgLoaded', true)
    },
    getGAParams(it, index, type) {
      // ga打点
      if (process.server || !this.bannerCreativeSlot) return
      const creativeSlot = `${this.bannerCreativeSlot}_${index + 1}`
      const creativeName = it.imageLabel || it.alt
      const params = {
        event: 'ga4Event',
        event_parameters: {
          creative_slot: creativeSlot,
          creative_name: creativeName,
          promotion_name: it.activityName || 'none',
          items: [
            {
              item_id: 'none',
              item_name: 'none',
              item_category: 'none',
              item_brand: 'none',
              currency: this.currencyCode,
              promotion_id: it.activityId || 'none',
              promotion_name: it.activityName || 'none'
            }
          ]
        }
      }
      if (type === 'view') {
        params.event_name = 'view_promotion'
      } else {
        params.event_name = 'select_promotion'
      }
      return params
    },
    handleClickLink(e) {
      const url = this.countryUrl(e.linkUrl)
      if (e.newWindows) {
        window.open(url)
      } else {
        location.href = url
      }
    }
  }
}
