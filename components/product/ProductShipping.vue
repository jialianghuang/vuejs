<template>
  <div
    id="shipping"
    v-if="!baseInfo.isComingSoon && !baseInfo.isGiftCard"
    :class="{ ca_shipping: country == 'CA' && ![33, 36].includes(baseInfo.catId) }"
  >
    <div class="shipping_list">
      <div class="shipping_item">
        <svg class="icon-left">
          <use :xlink:href="shipping.icon[0]"></use>
        </svg>
      </div>
      <div class="shipping_desc">
        <p class="shipping_desc1">{{ nl(shipping.desc[0]) }}</p>
        <p id="placeholder">{{ nl(shipping.maxDesc) }}</p>
        <p class="shipping-desc2">{{ nl(shipping.desc[2]) }}</p>
      </div>
      <div>
        <svg class="icon-center">
          <use :xlink:href="shipping.icon[1]"></use>
        </svg>
      </div>
      <div class="shipping_desc">
        <p class="shipping_desc1">{{ nl(shipping.desc[1]) }}</p>
        <p id="placeholder">{{ nl(shipping.maxDesc) }}</p>
        <div class="delivery-shipping-to">
          {{ nl(shipping.desc[3]) }}
          <!-- AZWEB-16169 -->
          <!-- <div
            v-if="!['AU', 'GB', 'FR', 'MX', 'ES', 'DE', 'IT'].includes(country) && isCurrentStyleSupportStock && !isSpecialCatId(baseInfo.catId)"
            @mouseenter="handlePopupShippingRush(shipping.desc[3])"
            @mouseleave="handlePopupShippingRush(shipping.desc[3])"
            class="icon-question-content"
          >
            <az-icon class="icon-question" icon-class="icon-gwc-_question_" />
            <div
              @mouseenter="handlePopupShippingRush(nl(shipping.desc[3]))"
              @mouseleave="handlePopupShippingRush(nl(shipping.desc[3]))"
              :class="{ hide: !popupShippingRush }"
              class="introduce-hover-content free-return-intro-pop"
            >
              <div>
                {{ nl('page_expedited_shipping_des') }}
              </div>
            </div>
          </div> -->
        </div>
      </div>
      <div>
        <svg class="icon-right">
          <use :xlink:href="shipping.icon[2]"></use>
        </svg>
      </div>
    </div>
    <!--    仓库关了暂时逻辑下掉-->
    <!--    <div v-if="+baseInfo.catId === 33 && !['AU', 'GB', 'CA'].includes(country)" class="shipping_desc_allow">
      <az-icon class="selling_point_icon" icon-class="icon-all_tick" fill="@theme-color" /><span>{{
        nl('page_product_shipping_allow_desc')
      }}</span>
    </div>-->
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ProductShipping',
  languageKeys: [
    'page_order_progress_processing',
    'page_expedited_shipped_to_you',
    'page_expedited_made_to_order',
    'page_expedited_within',
    'page_expedited_shipping_time_ca',
    'page_expedited_shipping_time_au',
    'page_expedited_shipping_time_gb',
    'page_expedited_shipping_time',
    'page_common_faster_shipping_duty_free',
    'page_order_business_days'
  ],
  props: {
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    makeTimeInfo: {
      type: Object,
      default() {
        return null
      }
    },
    swatchShippingInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    from: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      popupShippingRush: false,
      shipping: {
        icon: [],
        desc: [],
        maxDesc: ''
      }
    }
  },
  computed: {
    ...mapState('product', ['isCurrentStyleSupportStock', 'shippingInfo']),
    // 由于这个组件，商品详情页和SwatchDialog都在使用，如果直接使用store里面的 shippingInfo 会导致色卡弹窗的交期显示错误，所以判断下，去过父组件是色卡弹窗的时候用props里面的swatchShippingInfo值
    actingShippingInfo() {
      if (this.from === 'swatchDialog') {
        return this.swatchShippingInfo
      }
      return this.shippingInfo
    }
  },
  watch: {
    makeTimeInfo(val) {
      this.handleShippingStyle()
    },
    actingShippingInfo() {
      this.handleShippingStyle()
    }
  },
  created() {
    this.handleShippingStyle()
    // console.log('makeTimeInfo:', this.makeTimeInfo)
  },
  methods: {
    handlePopupShippingRush(text) {
      this.popupShippingRush = !this.popupShippingRush
      if (this.popupShippingRush && text === '3-6 business days') {
        this.buryPoint(this, 'event', {
          ec: 'shipping&return',
          el: '3-6businessday',
          ea: 'click'
        })
      }
    },
    handleShippingStyle() {
      // icons数组
      const icons = []
      // 文案数组
      const descs = []
      // 判断是否是库存商品，展示不同icon
      const baseIcon = '#icon-shipping_time_'

      // descs[2]使用后端返回的deliveryDescription
      descs[2] = this.makeTimeInfo.deliveryDescription

      if (this.makeTimeInfo.isExpeditedShippingGoods) {
        // bd库存加急
        icons[0] = baseIcon + 'order'
        descs[0] = 'page_order_progress_processing'
        descs[1] = 'page_expedited_shipped_to_you'
        // descs[2] = this.nl(this.makeTimeInfo.expeditedDeliverStr)
      } else if (this.baseInfo.isStockGoods || (this.isCurrentStyleSupportStock && this.isSpecialCatId(this.baseInfo.catId))) {
        // 库存、定制库存
        icons[0] = baseIcon + 'order'
        descs[0] = 'page_order_progress_processing'
        descs[1] = 'page_expedited_shipped_to_you'
        // 如果最小天数和最大天数一样，显示一个，否则，显示区间
        // if (this.makeTimeInfo.minDays == this.makeTimeInfo.maxDays) {
        //   descs[2] = `${this.makeTimeInfo.maxDays} ${this.nl('page_order_business_days')}`
        // } else {
        //   descs[2] = `${this.makeTimeInfo.minDays} - ${this.makeTimeInfo.maxDays} ${this.nl('page_order_business_days')}`
        // }
        // if (this.country == 'MX' && this.baseInfo.mxBdBatch) {
        //   descs[2] = this.nl('page_goods_detail_24hour_shiping')
        // }
      } else {
        icons[0] = baseIcon + 'made'
        descs[0] = 'page_expedited_made_to_order'
        descs[1] = 'page_expedited_shipped_to_you'
        // descs[2] = this.makeTimeInfo.useMinWeek
        //   ? `${this.nl('page_expedited_within')} ${this.makeTimeInfo.minWeeks} ${this.nl('page_expedited_weeks')}`
        //   : `${this.makeTimeInfo.description}`
        if (this.makeTimeInfo.useMinWeek) {
          descs[2] = `${this.nl('page_expedited_within')} ${this.makeTimeInfo.deliveryDescription}`
        }
      }

      // if (this.baseInfo.catId === 33) {
      //   if (this.country === 'AU') {
      //     descs[2] = '2 ' + this.nl('page_order_business_days')
      //   }
      //   if (this.country === 'GB') {
      //     descs[2] = '5 ' + this.nl('page_order_business_days')
      //   }
      // }
      if (this.makeTimeInfo.isExpeditedShippingGoods) {
        if (this.country == 'CA') {
          descs[3] = this.nl('page_expedited_shipping_time_ca')
        } else if (this.country == 'AU') {
          descs[3] = this.nl('page_expedited_shipping_time_au')
        } else if (this.country == 'GB') {
          descs[3] = this.nl('page_expedited_shipping_time_gb')
        } else {
          descs[3] = this.nl('page_expedited_shipping_time')
        }
      }
      // else if (this.country == 'CA' && this.baseInfo.catId != 33) {
      //   // #14417: CA站点色卡详情页的ship to you的时间，去掉特殊逻辑字段：faster shipping + duty-free，改成具体的物流时效时间
      //   descs[3] = this.nl('page_common_faster_shipping_duty_free')
      // }
      else if (Object.keys(this.actingShippingInfo).length) {
        // descs[3] = '1 - 7  business days'
        let desc = ''
        if (this.actingShippingInfo.minDays == this.actingShippingInfo.maxDays && this.actingShippingInfo.maxDays * 1 != 0) {
          desc = this.actingShippingInfo.maxDays
        } else {
          desc = `${this.actingShippingInfo.minDays} - ${this.actingShippingInfo.maxDays}`
        }
        descs[3] = `${desc} ${this.nl('page_order_business_days')}`
      }

      // 根据是否是WD，展示第二个icon
      if ((this.country != 'US' && this.baseInfo.catId == 2 && this.baseInfo.dressType == 'dress') || this.baseInfo.dressType == 'sample') {
        icons[1] = '#icon-a-xxy_shippingtime_freecar-' + this.language
      } else {
        icons[1] = baseIcon + 'car'
      }
      // 根据是否是裙子，展示第三个icon
      if (this.baseInfo.isDress && !this.baseInfo.isStockGoods && !this.isCurrentStyleSupportStock) {
        icons[2] = baseIcon + 'dress'
      } else {
        icons[2] = baseIcon + 'bag'
      }
      this.shipping.icon = icons
      this.shipping.desc = descs
      // 最长的文案
      let maxDesc = ''
      descs.forEach((item) => {
        maxDesc = item && item.length > maxDesc.length ? item : maxDesc
      })
      this.shipping.maxDesc = maxDesc
    },
    handleShippingMBD() {
      this.MBDTipShow = !this.MBDTipShow
    }
  }
}
</script>

<style lang="less" scoped>
#shipping {
  margin: 24px 0;
  &.ca_shipping {
    margin-top: 24px;
    margin-bottom: 24px;
  }
  .icon-left {
    height: 42px;
    width: 33px;
  }
  .icon-center {
    height: 42px;
    width: 37px;
  }
  .icon-right {
    height: 42px;
    width: 33px;
  }
  .shipping_desc {
    font-family: @font-family-500;
    // font-size: 13px;
    color: var(--color-121212);
    text-align: left;
    line-height: 18px;
    .delivery-shipping-to {
      color: @theme-color;
      font-family: @font-family-600;
      display: flex;
      justify-content: center;
    }
    .inner_desc {
      margin: 0 10px;
      text-align: center;
      width: 178px;
    }
    .ready-to-ship-tip {
      color: @theme-color;
      font-family: @font-family-600;
    }
  }
  .shipping_icon {
    font-size: 42px;
  }
  .shipping_list {
    display: flex;
    justify-content: flex-start;
    .icon_font {
      font-size: 42px;
    }
    .shipping_desc {
      margin: 0 10px;
      text-align: center;
      .icon-question-content {
        cursor: pointer;
        position: relative;
        color: var(--color-121212);
        margin-left: 3px;
        .icon-question {
          fill: currentColor;
          color: @theme-color;
        }
        div {
          font-family: @font-family-500, sans-serif;
          text-align: left;
        }
      }

      p {
        padding: 0 10px;
      }
      p:first-child {
        padding-bottom: 2px;
        border-bottom: 1px solid #ccc;
      }
      p:last-child {
        margin-top: 3px;
      }
    }
    #placeholder {
      opacity: 0;
      height: 0;
    }
  }
}
.shipping_desc_allow {
  margin-top: 10px;
  .selling_point_icon {
    margin-right: 4px;
  }
}
.shipping-desc1 {
  font-family: @font-family-500;
}
.shipping-desc2 {
  color: @theme-color;
  font-family: @font-family-600;
}
.introduce-hover-content {
  position: absolute;
  z-index: 1;
  font-weight: initial;
  background: #fff;
  border: 1px solid var(--color-cccccc);
  border-radius: 3px;
  margin-top: 2px;
  &:before {
    content: '';
    width: 0;
    height: 0;
    border-right: 6px solid transparent;
    border-bottom: 6px solid var(--color-cccccc);
    border-left: 6px solid transparent;
    position: absolute;
    top: 0%;
    left: 48.4%;
    margin-top: -7px;
  }
  &:after {
    content: '';
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-bottom-color: #ffffff;
    position: absolute;
    top: 0%;
    left: 48.4%;
    margin-top: -11px;
  }
  &.free-return-intro-pop {
    width: 291px;
    padding: 10px;
    left: -150px;
    top: 24px;
  }
}
</style>
