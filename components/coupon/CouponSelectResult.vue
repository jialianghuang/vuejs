<template>
  <div @click="_handleClick" v-track.view="{ common: { ec: 'mycoupon', el: 'couponcheckoutpage' } }" class="coupon-select-result">
    <div class="coupon-select-result-left">
      <az-icon :icon-class="isBridal ? 'icon-coupon3' : 'iconcoupon2'"></az-icon>
      <span v-if="!!showCouponStatus">
        {{ couponResult.couponCode }}{{ couponResult.couponValueTxt ? `(${couponResult.couponValueTxt})` : '' }}
      </span>
      <span v-else class="default-text">{{ nl('page_account_my_coupons') }}</span>
    </div>
    <div v-track.click="{ common: { ec: 'mycoupon', el: 'checkmycoupon' } }" class="coupon-select-result-right">
      <span v-if="!!showCouponStatus">-{{ couponResult.couponValue }}</span>
      <span v-else class="default-text">{{ nl('page_common_see_more') }}</span>
      <az-icon icon-class="icon-xxy_arrow_right_m"></az-icon>
    </div>
  </div>
</template>
<script>
/**
 * 优惠券选择结果
 */
export default {
  props: {
    val: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 优惠券选择结果
    couponResult: {
      type: Object,
      default: () => {
        return {}
      }
    },
    checkoutSummary: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    showCouponStatus({ couponResult, checkoutSummary, $route }) {
      // 如果折扣为0 展示选择coupon
      if (!checkoutSummary.bonus && $route.name == 'checkout') {
        this.$emit('init-coupon-status')
        return false
      }
      if ($route.name == 'cart' && !couponResult.couponValue) {
        this.$emit('init-coupon-status')
        return false
      }
      return couponResult.couponCode
    }
  },
  methods: {
    _handleClick() {
      this.$store.commit('checkout/setCouponSelectVisible', true)
    }
  }
}
</script>
<style lang="less" scoped>
.coupon-select-result {
  margin: 10px 0px;
  background: var(--color-f1e9e6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  font-size: 13px;
  line-height: 18px;
  // color: var(--color-121212);
  color: @theme-color;
  cursor: pointer;
  &-left {
    font-family: @font-family-500;
    display: flex;
    align-items: center;
    width: 60%;
    .az-icon {
      margin-right: 8px;
      font-size: 24px;
      color: @theme-color;
    }
    span {
      flex: 1;
    }
  }
  &-right {
    font-family: @font-family-500;
    display: flex;
    align-items: center;
    .az-icon {
      font-size: 12px;
      fill: #ccc;
      margin-left: 3px;
    }
  }
  .default-text {
    text-transform: capitalize;
  }
}
</style>
