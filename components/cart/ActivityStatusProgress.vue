<template>
  <div :class="[from]" class="activity-status-progress-box">
    <div
      v-if="showFreeShipProgress"
      @click="clickAdd('free-ship')"
      v-track.view.click="getBiParams('free-ship')"
      :class="{ cursor: fsprogress < 0 && from == 'cart' }"
      class="free-ship-box item-box"
    >
      <div class="info">
        <az-icon icon-class="icon-a-FreeStandardShipping" class="icon" />
        <div
          v-html="fsDesc ? fsDesc.replace(/var(--color-121212)/g, isBridal ? 'var(--color-121212)' : 'var(--color-121212)') : ''"
          class="txt"
        ></div>
        <div v-if="fsprogress < 0 && from == 'cart'" class="add">{{ nl('page_common_add') }} ></div>
      </div>
    </div>
    <div
      @click="clickAdd('promotion')"
      v-track.view.click="getBiParams('promotion')"
      :class="{ cursor: !activityCartInfo.isFullProgress && from == 'cart' }"
      class="promotion-box item-box"
    >
      <div class="info">
        <az-icon icon-class="icon-coupon" class="icon" />
        <div
          v-html="
            activityCartInfo.discountDesc
              ? activityCartInfo.discountDesc.replace(/var(--color-121212)/g, isBridal ? 'var(--color-121212)' : 'var(--color-121212)')
              : ''
          "
          class="txt"
        ></div>
        <div v-if="!activityCartInfo.isFullProgress && from == 'cart'" class="add">{{ nl('page_common_add') }} ></div>
      </div>
      <div :class="{ isInterlace: isInterlace }" class="progress">
        <promotion-progress
          :interlace="isInterlace"
          :list="list"
          :progressPercentLength="progressPercentLength"
          class="progress-box"
        ></promotion-progress>
      </div>
    </div>
  </div>
</template>
<script>
import promotionProgress from '@/components/cart/promotionProgress'

export default {
  name: 'ActivityStatusProgress',
  languageKeys: ['page_common_add', 'page_cart_progress_free_shipping_style', 'page_cart_progress_free_shipping_away_style'],
  components: {
    promotionProgress
  },
  props: {
    activityCartInfo: {
      type: Object,
      default: () => {}
    },
    freeShippingProgress: {
      type: Object,
      default: () => {}
    },
    from: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    isFreeShipProgressCountry: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      progressPercentLength: 0
    }
  },
  computed: {
    showFreeShipProgress() {
      return (this.from === 'add-cart-pop' && this.isFreeShipProgressCountry) || this.from !== 'add-cart-pop'
    },
    list() {
      const tempList = []
      this.activityCartInfo.discountList.forEach((item) => {
        tempList.push({
          name: `${item.savedDisplay}`,
          width: parseFloat((item.throttle / this.activityCartInfo.maxThrottle) * 100).toFixed(2) * 1,
          info: item.throttleDisplay
        })
      })
      return tempList
    },
    // freeShipping当前进度条的进度，占比-100，就是左偏移量，左偏移0为进度100%展示
    fsprogress() {
      if (this.freeShippingProgress && this.freeShippingProgress.freeShippingFeeThreshold) {
        const res = (this.freeShippingProgress.goodsFreeShippingAmount / this.freeShippingProgress.freeShippingFeeThreshold) * 100 - 100
        return res >= 0 ? 0 : res
      } else {
        return 0
      }
    },
    fsDesc() {
      return this.fsprogress >= 0
        ? this.nl('page_cart_progress_free_shipping_style')
        : this.nl('page_cart_progress_free_shipping_away_style', null, { amount: this.freeShippingProgress.freeShippingDifferenceDisplay })
    },
    isInterlace() {
      return ['cart-pop'].includes(this.from) || ['AUD', 'MXN', 'CAD'].includes(this.currencyCode)
    }
  },

  watch: {
    activityCartInfo: {
      handler() {
        if (!process.client) return
        this.setProccess()
      },
      immediate: true,
      deep: true
    },
    visible(e) {
      if (e) {
        this.setProccess()
      } else {
        this.progressPercentLength = 0
      }
    }
  },
  methods: {
    getBiParams(e) {
      if (e === 'free-ship' && this.fsprogress < 0 && this.from == 'cart') {
        return {
          common: { ec: 'shopping_bag', el: 'addon' }
        }
      } else if (e === 'promotion' && !this.activityCartInfo.isFullProgress && this.from == 'cart') {
        return {
          common: { ec: 'shopping_bag_progressbar', el: 'addon' }
        }
      }
    },
    setProccess() {
      setTimeout(() => {
        this.progressPercentLength =
          parseFloat((this.activityCartInfo.satisfiedGoodsAmount / this.activityCartInfo.maxThrottle) * 100).toFixed(2) * 1
      }, 50)
    },
    clickAdd(type) {
      if (
        (type === 'free-ship' && this.fsprogress < 0 && this.from == 'cart') ||
        (type === 'promotion' && !this.activityCartInfo.isFullProgress && this.from == 'cart')
      ) {
        this.$emit('clickAdd', type)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.activity-status-progress-box {
  &.cart {
    margin: 15px 0;
  }
  &.cart-pop,
  &.add-cart-pop {
    margin: 0 15px;
    .item-box {
      background: transparent !important;
      padding: 15px 0;
    }
    .free-ship-box {
      border-bottom: 1px solid #eee;
    }
    /deep/ .progress-msg-top-text {
      background: #fff;
    }
    .promotion-box .progress {
      padding: 30px 5.5px 20px 0;
    }
  }
  &.add-cart-pop {
    margin-top: -15px;
  }
  .item-box {
    padding: 15px;
    .info {
      display: flex;
      align-items: center;
      .icon {
        font-size: 22px;
      }
      .txt {
        margin-left: 10px;
        font-size: 13px;
        color: var(--color-121212);
        .bold {
          font-family: @font-family-600;
          color: @theme-color;
        }
      }
      .add {
        font-size: 12px;
        text-decoration-line: underline;
        color: var(--color-121212);
        font-family: @font-family-600;
        margin-left: 20px;
        cursor: pointer;
      }
    }
  }
  .free-ship-box {
    background: var(--color-f9f9f9);
    &.cursor {
      cursor: pointer;
    }
  }
  .promotion-box {
    background: rgba(254, 248, 248, 0.8);
    .progress {
      padding: 30px 5.5px 2px 0;
      &.isInterlace {
        padding-bottom: 20px;
      }
    }
    &.cursor {
      cursor: pointer;
    }
  }
}
</style>
