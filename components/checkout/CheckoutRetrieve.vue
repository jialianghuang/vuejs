<template>
  <az-popup-layer
    v-if="visible"
    v-track.view="{ common: getBiParams('retrieve_close') }"
    :zIndex="12"
    @close="handleClose(true)"
    width="405px"
    height="auto"
    padding="40px 20px"
  >
    <div class="checkout-retrieve">
      <p :class="['title', { 'no-mt': showSubText }]">{{ nl('page_sample_leave_now_title1') }}</p>
      <p v-if="showSubText" class="title sod-coupon">
        <span>{{ nl('page_common_checkout_sod_coupon_retrieve') }}</span>
      </p>
      <div class="info-box">
        <div v-for="(item, index) in summary" :key="index" class="info-item">
          <div class="info-icon">
            <az-icon v-if="item.type === 'shippingActivity'" icon-class="icon-a-FreeStandardShipping"></az-icon>
            <az-icon v-else-if="item.type === 'goodsActivity'" icon-class="icon-pig"></az-icon>
          </div>
          <span v-if="item.type === 'shippingActivity'" class="info-name">{{ nl('page_cart_free_shipping_tips') }}</span>
          <span v-else class="info-name">{{ item.title }}</span>
          <span v-if="item.type === 'goodsActivity' && countdown" v-track.view="{ common: getBiParams('coupon') }" class="info-des">
            {{ nl('page_year_end_ends_in_capitalize') }} <span class="countdown">{{ countdown }}</span>
          </span>
          <template v-else-if="item.description">
            <span
              v-track.view="{ common: getBiParams(item.reason === 'specialOffer' ? 'special_offer' : 'freeshipping119+') }"
              class="info-des"
            >
              {{ item.description }}
            </span>
          </template>
        </div>
      </div>
      <div class="btn-box">
        <az-button
          v-track.view.click="{ common: getBiParams('retrieve_returntocart') }"
          @click="clickReturnToCart"
          class="btn btn-default btn-hollow"
        >
          {{ btnText }}
        </az-button>
        <az-button
          v-track.view.click="{ common: getBiParams('retrieve_keepcheckout') }"
          @click="handleClose(false)"
          class="btn btn-default theme-btn"
        >
          {{ nl('page_checkout_keep_checkout') }}
        </az-button>
      </div>
    </div>
  </az-popup-layer>
</template>

<script>
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import AzButton from '@/components/az-ui/Button/AzButton'
import { countdownFormat } from '@/assets/js/utils'

/**
 * checkout返回操作挽回弹框
 */
export default {
  name: 'CheckoutRetrieve',
  components: {
    AzPopupLayer,
    AzButton
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    },
    couponInfo: {
      type: [Object, Array],
      default: () => {}
    }
  },
  data() {
    return {
      countdown: '', // 倒计时
      timeInterval: ''
    }
  },
  computed: {
    btnText() {
      let res = this.nl('page_checkout_return_to_cart')
      if (process.client) {
        if (document.referrer.includes('/cart')) {
          res = this.nl('page_checkout_return_to_cart')
        } else {
          res = this.nl('page_sample_leave_now_button_title')
        }
      }
      return res
    },
    summary() {
      let res = []
      if (this.info && this.info.info) {
        res = this.info.info
      }
      return res
    },
    showSubText({ couponInfo }) {
      return couponInfo.code == 'HIBEAUTY'
    }
  },
  watch: {
    summary() {
      // 如果存在活动信息，根据最新的活动结束时间，显示倒计时
      for (let i = 0; i < this.summary.length; i++) {
        const ele = this.summary[i]
        if (ele.type === 'goodsActivity' && ele.remainTime) {
          if (this.timeInterval) {
            clearInterval(this.timeInterval)
          }
          let remainTime = ele.remainTime
          if (remainTime && remainTime > 0) {
            this.getCountDown(remainTime)
          }
          this.timeInterval = setInterval(() => {
            remainTime -= 1
            if (remainTime && remainTime > 0) {
              this.getCountDown(remainTime)
            } else {
              this.countdown = ''
              clearInterval(this.timeInterval)
            }
          }, 1000)
          break
        }
      }
    }
  },
  beforeDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval)
    }
  },
  methods: {
    // 获取倒计时时分秒天结果
    getCountDown(remainTime) {
      const res = countdownFormat(remainTime)
      if (res && res.second) {
        this.countdown = res.hour + ':' + res.minute + ':' + res.second
        if (res.day) {
          this.countdown = res.day + 'd ' + this.countdown
        }
      }
    },
    getBiParams(el) {
      if (process.server) return
      const obj = {
        ec: 'checkout',
        el
      }
      return obj
    },
    handleClose(e) {
      this.setOrderSourceFlag('Retention_orders', true)
      if (e) {
        this.setPoint('checkout', 'retrieve_close', 'click')
      }
      this.$emit('update:visible', false)
    },
    // 返回上一页
    clickReturnToCart() {
      this.$emit('onBack')
    }
  }
}
</script>

<style lang="less" scoped>
.checkout-retrieve {
  text-align: center;
  .title {
    font-size: 16px;
    font-family: @font-family-500;
    line-height: 20px;
    margin-bottom: 15px;
    &.no-mt {
      margin-bottom: 0;
    }
    &.sod-coupon {
      margin: 5px 0 15px;
      font-size: 13px;
      color: @theme;
      letter-spacing: 0.26px;
    }
  }
  .info {
    &-box {
      margin: 0 auto;
      margin-bottom: 15px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }
    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0px 23px;
    }
    &-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #fbf1f2;
      line-height: 60px;
      font-size: 28px;
      margin-bottom: 5px;
    }
    &-name {
      font-size: 14px;
      font-family: @font-family-600;
    }
    &-des {
      font-size: 12px;
      .countdown {
        color: @theme;
      }
    }
  }
  .btn-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .btn {
      flex: 1;
      height: 46px;
      &.btn-hollow {
        margin-right: 15px;
        border-color: #ccc;
        color: var(--color-121212);
      }
    }
    .theme-btn {
      background-color: @theme-color!important;
      border-color: @theme-color;
    }
  }
}
</style>
