/**
 * ProductSellingPoint相关组件的mixin
 */
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    stockInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    giftInfo: {
      type: Object,
      default() {
        return null
      }
    },
    makeTimeInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    ...mapState({
      customSizeInfo: (state) => state.product.customSizeInfo
    }),
    ...mapGetters({
      baseInfo: 'product/getBaseInfo'
    }),
    isClearance() {
      return ['clearance', 'outlet'].includes(this.baseInfo.dressType)
    },
    isFreeFacemask() {
      const isTrue = this.giftInfo && this.giftInfo.free_face_mask
      if (isTrue) {
        this.setPoint('freefacemask')
      }
      return isTrue
    },
    freePannier() {
      const isTrue = this.giftInfo && this.giftInfo.pannier
      if (isTrue) {
        this.setPoint('freepannier')
      }
      return isTrue
    },
    addToCartOnly({ country }) {
      const isTrue = ['sample'].includes(this.baseInfo.dressType) && country !== 'CA'
      if (isTrue) {
        this.setPoint('tapemeasure', 'view')
      }
      return isTrue
    },
    // 是否展示free shipping后面的问号，16179需求
    showFreeShippingTips() {
      return this.baseInfo.isThresholdFreeShipping || this.baseInfo.dressType === 'sample'
    },
    freeShipping({ country }) {
      // 排除mx和色卡礼品卡，都免运费
      if (!['MX', 'US', 'CA'].includes(this.country) && ![33, 3108].includes(this.baseInfo.catId)) {
        return true
      }

      if (this.showFreeShippingTips) return true
      const isTrue = (country != 'US' && [2].includes(this.baseInfo.catId)) || this.baseInfo.dressType == 'sample'
      if (isTrue) {
        this.setPoint('freeshipping')
      }

      return isTrue
    },
    freeCustomSize({ customSizeInfo }) {
      if (this.country == 'MX' && this.baseInfo.mxBdBatch) {
        return false
      }
      if (['IE', 'IT', 'ES', 'FR', 'DE', 'NL', 'BE', 'SE', 'AT', 'FI', 'DK'].includes(this.country)) {
        if (this.baseInfo.dressType === 'sample') {
          return false
        }
        return [7, 2, 8, 9, 45, 158, 10].includes(this.catId)
      }
      const isTrue =
        !!customSizeInfo.custom_size_status &&
        [7, 45, 158, 139, 9, 8, 2].includes(this.baseInfo.catId) &&
        !['sample'].includes(this.baseInfo.dressType) &&
        this.baseInfo.brandId !== 12
      if (isTrue) {
        this.setPoint('freecustomsize')
      }
      return isTrue
    },
    freeReturns({ country }) {
      // AZWEB-18777 全站部分品类的free return卖点下线 ，所有国家统一收取，统一比例 sample 除外
      if ([7, 45, 158, 2, 9, 3, 10, 8, 139, 3102, 3109, 3110].includes(this.baseInfo.catId) && this.baseInfo.dressType != 'sample') {
        return false
      }

      // 16334-DE所有品类去掉free returns卖点
      if (['AU', 'IE', 'IT', 'ES', 'FR', 'DE', 'NL', 'BE', 'SE', 'AT', 'FI', 'DK'].includes(country)) {
        // 样衣展示free return
        if (this.baseInfo.dressType === 'sample') {
          return true
        }
        return false
      }
      if (country == 'MX' && (this.baseInfo.mxBdBatch || this.baseInfo.mxNotReturn)) {
        return false
      }
      // 15387-us的裙子品类商品详情页去掉free return卖点标签
      if (
        ((['US', 'CA', 'GB'].includes(country) && [7, 45, 158, 139, 9, 8, 2, 3098].includes(this.baseInfo.catId)) ||
          (this.isSpecialCatId(this.baseInfo.catId) && country === 'GB')) &&
        this.baseInfo.dressType != 'sample'
      ) {
        return false
      }
      const isTrue =
        [7, 45, 158, 139, 9, 8, 2, 10, 138, 107, 40, 13, 15, 6, 37, 3098].includes(this.baseInfo.catId) ||
        ['sample'].includes(this.baseInfo.dressType)
      if (isTrue) {
        this.setPoint('freereturns')
      }
      return isTrue
    },
    readyToShip({ baseInfo }) {
      const { catId, dressType, isMassProduct } = baseInfo
      // 3102是shoes品类 去掉男配
      let isTrue = [3099].includes(catId) && !['sample'].includes(dressType)
      // isMssProduct 是0表示定制商品
      if (!isMassProduct) {
        isTrue = false
      }
      if (isTrue) {
        this.setPoint('readytoship')
      }
      return isTrue
    },
    // 判断是否满足显示fianlSale的条件，shapewear显示final sale
    finalSale() {
      const isTrue = [3099].includes(this.baseInfo.catId)
      return isTrue
    },
    // 展示 防尘袋与否 以下的catId下展示
    isGarmentBags() {
      if (
        ['IE', 'IT', 'ES', 'FR', 'DE', 'NL', 'BE', 'SE', 'AT', 'FI', 'DK'].includes(this.country) &&
        this.isSpecialCatId(this.baseInfo.catId)
      ) {
        return false
      }
      return this.giftInfo && this.giftInfo.garment_bag_gift
    },
    isSevenDaysDelivery() {
      return (
        !['AU', 'GB'].includes(this.country) &&
        this.baseInfo.supportStockSales &&
        this.stockInfo &&
        this.stockInfo.hasStock &&
        this.baseInfo.showExpeditedShipping
      )
    },
    processTime() {
      if (this.baseInfo.isStockGoods) {
        return `${this.makeTimeInfo.minDays} - ${this.makeTimeInfo.maxDays} business days`
      } else {
        return this.makeTimeInfo.useMinWeek ? `Within: ${this.makeTimeInfo.minWeeks} weeks` : `${this.makeTimeInfo.description}`
      }
    },
    // 判断内容是否为空，所有判断项都是false，不展示本组件
    isEmpty() {
      if (
        this.isFreeFacemask ||
        this.freePannier ||
        this.addToCartOnly ||
        this.freeShipping ||
        this.freeCustomSize ||
        this.freeReturns ||
        this.readyToShip ||
        this.isGarmentBags ||
        this.isSevenDaysDelivery ||
        this.makeTimeInfo.specialOfferTime
      ) {
        return false
      }
      return true
    },
    addToBagText({ country }) {
      let text = null
      switch (country) {
        case 'GB':
          text = 'page_product_selling_point_value_gb'
          break
        case 'AU':
          text = 'page_product_selling_point_value_au'
          break
        default:
          text = 'page_product_selling_point_value'
      }
      return text
    },
    showSellingPoint({ isClearance, isEmpty }) {
      return !isClearance && !isEmpty
    },
    freeReturnText({ country, catId }) {
      let text = 'page_product_selling_point_free_returns_tips'
      if (['US', 'CA', 'GB'].includes(country) && this.isSpecialCatId(catId)) {
        text = 'page_product_selling_point_free_returns_tips_wgd'
      }
      return text
    }
  },
  methods: {
    setPoint(el, type) {
      this.buryPoint(this, 'event', {
        ec: 'sellingpoint',
        el,
        ea: type || 'view',
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType
        })
      })
    }
  }
}
