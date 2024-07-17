<template>
  <div class="pay-summary">
    <div class="order-summary-amount-info">
      <div class="order-summary-container">
        <div class="item clearfix mt-0">
          <span class="item-left fl">{{ nl('page_common_subtotal') }}</span>
          <span class="item-right fr">
            {{ orderInfo.goodsAmountDisplay }}
          </span>
        </div>
        <!-- <div v-if="orderInfo.isSSOrder" class="item clearfix">
          <span class="item-left fl init">{{ nl('page_common_try_on_fee') }}</span>
          <span class="item-right fr">
            {{ orderInfo.tryOnFeeDisplay }}
          </span>
        </div> -->
        <div v-if="!orderInfo.onlyGiftCardOrder" class="item clearfix">
          <span class="item-left fl"
            >{{ nl('page_checkout_coupon') }}
            <template v-if="orderInfo.bonusType == 'percent' && orderInfo.bonusValue">({{ orderInfo.bonusValue * 100 }}%)</template></span
          >
          <span class="item-right fr">{{ orderInfo.bonusDisplay }}</span>
        </div>
        <!-- 校园大使优惠 -->
        <div v-if="orderInfo.referralDiscount" class="item clearfix">
          <span class="item-left fl">{{ nl('page_cart_referral_discount') }}</span>
          <span class="item-right fr">{{ orderInfo.referralDiscountDisplay }}</span>
        </div>
        <div v-if="orderInfo.rushFee * 1 > 0 && !orderInfo.onlyGiftCardOrder" class="item clearfix">
          <span class="item-left fl">{{ nl('page_cart_rush_fee') }}</span>
          <span class="item-right fr">{{ orderInfo.rushFeeDisplay }}</span>
        </div>
        <div v-if="!orderInfo.onlyGiftCardOrder" class="item clearfix">
          <span class="item-left fl">{{ nl('page_common_goods_shipping').toLowerCase() }}</span>
          <span v-if="Number(orderInfo.shippingFee) > 0" class="item-right fr">{{ orderInfo.shippingFeeDisplay }}</span>
          <span v-else class="item-right fr shipping-free">{{ nl('page_common_free') }}</span>
        </div>
        <div v-if="showTaxText && (currentCountry == 'US' || currentCountry == 'CA') && !orderInfo.onlyGiftCardOrder" class="item clearfix">
          <span class="item-left fl">{{ nl('page_revie_tax') }}</span>
          <span class="item-right fr">{{ orderInfo.taxFeeDisplay }}</span>
        </div>
        <!-- 如果使用了giftcard 支付，要回显 -->
        <div v-if="orderInfo.orderAccountBalanceAmount" class="item clearfix">
          <span class="item-left fl">
            {{ nl('page_order_gift_card_balance') }}
          </span>
          <span class="item-right fr">-{{ orderInfo.orderAccountBalanceAmountDisplay }}</span>
        </div>
        <div class="item clearfix total-item">
          <span class="item-left fl total-txt">{{ nl('page_common_order_total') }}</span>
          <span class="item-right fr total-txt">
            {{ orderInfo.orderAmountDisplay }}
          </span>
        </div>
        <p v-if="taxIncluseText" class="item clearfix tax-incluse text-right">{{ taxIncluseText }}</p>
      </div>

      <template v-if="orderInfo.payStatus == 2">
        <div class="order-summary-bottom">
          <span>{{ orderInfo.paymentName }}:</span>
          <span> {{ orderInfo.orderAmountDisplay }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderSummary',
  props: {
    orderInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    isPaidAndUnpaid: {
      // 是否是支付和未支付共存的情况
      type: Boolean,
      default: false
    },
    countryCode: {
      type: String,
      default: ''
    }
  },
  computed: {
    // 当前应该展示的国家，如果有订单国家code，取订单国家code，否则就是country
    currentCountry() {
      const res = this.countryCode || (this.orderInfo && this.orderInfo.countryCode) || this.$route.query.order_country_code || this.country
      return res
    },
    isOxxoPayPrepare() {
      return (
        this.orderInfo.paymentExtension &&
        this.orderInfo.paymentExtension.hasOwnProperty('ticketPayCodeIsExpired') &&
        !this.orderInfo.paymentExtension.ticketPayCodeIsExpired
      )
    },
    taxIncluseText() {
      if (['AU'].includes(this.currentCountry)) {
        return this.nl('page_common_gst_included')
      } else if (['FR', 'ES', 'IT'].includes(this.currentCountry)) {
        return this.nl('page_common_vat_included')
      }
      return null
    }
  },
  methods: {
    getBiCommonParams(ec, el) {
      if (process.server) return
      const params = {
        common: {
          ec,
          el
        }
      }
      return params
    }
  }
}
</script>

<style lang="less" scoped>
.mt-0 {
  margin-top: 0 !important;
}
.pay-summary {
  width: 100%;
  display: flex;
  margin-left: auto;
  .order-summary-amount-info {
    width: 100%;
    .order-summary-container {
      .item {
        font-size: 13px;
        font-family: @font-family-500;
        color: var(--color-121212);
        line-height: 18px;
        margin-top: 5px;
        .shipping-free {
          text-transform: uppercase;
          color: var(--color-121212);
        }
        .item-left {
          text-transform: capitalize;
          &.init {
            text-transform: initial;
          }
        }
        .item-right {
          white-space: nowrap;
          margin-left: 15px;
        }
      }
      .total-txt {
        text-transform: uppercase !important;
        font-family: @font-family-600;
        color: var(--color-121212);
      }
    }
    .order-summary-bottom {
      color: #ccc;
      border-top: 1px dotted #ccc;
      padding-top: 10px;
      margin-top: 10px;
      text-align: right;
    }
  }
}
</style>
