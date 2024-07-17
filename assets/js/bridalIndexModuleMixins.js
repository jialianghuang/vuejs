/**
 * bridal首页各模块共用数据
 */
export default {
  props: {
    bridalIndexBannerPosition: {
      type: Array,
      default() {
        return []
      }
    },
    moduleItem: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    bannerCreativeSlot() {
      const position = this.bridalIndexBannerPosition.indexOf(this.moduleItem.keyStr)
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
    }
  }
}
