<template>
  <div :style="{ width }" class="order-summary-amount-info">
    <div :class="[from, { checkout_success: $route.name == 'checkoutSuccess' }]" class="order-summary-container">
      <!-- goodsSubtotal -->
      <div class="item clearfix">
        <span id="subtotal_txt" class="item-left fl"
          >{{ nl('page_common_subtotal') }}
          <DiscountPricePop
            v-if="from === 'checkout' && checkoutSummary.totalNoDealGoodsAmount != checkoutSummary.goodsAmount"
            :ec="'shoppingbag'"
            :el="'subtotal discount'"
            :bonusDetail="bonusDetail"
          />
        </span>
        <template v-if="from === 'checkout'">
          <div v-if="checkoutSummary.totalNoDealGoodsAmount != checkoutSummary.goodsAmount" class="item-right fr">
            <span class="current-goods-amount">{{ checkoutSummary.goodsAmountDisplay }}</span>
            <span class="no-deal-goods-amount">{{ checkoutSummary.totalNoDealGoodsAmountDisplay }}</span>
          </div>
          <span v-else class="item-right fr">{{ checkoutSummary.goodsAmountDisplay }}</span>
        </template>
        <span id="sc_goods_total" v-else class="item-right fr">{{ checkoutSummary.goodsAmountDisplay }}</span>
      </div>

      <template v-if="!orderInfo.onlyGiftCard">
        <!-- couponFee -->
        <template v-if="checkoutSummary.bonus > 0">
          <template v-if="from === 'checkout'">
            <div class="item clearfix">
              <span class="item-left fl"> {{ couponInfo.couponValueTxtDisplay }} {{ nl('page_cart_coupon_applied') }} </span>
              <span class="item-right fr coupon-b">-{{ checkoutSummary.bonusDisplay }}</span>
            </div>
            <az-with-code :code="couponInfo.code" :need-color="true" class="cart-with-code"></az-with-code>
          </template>
          <template v-else>
            <div class="item clearfix">
              <span class="item-left fl">
                {{ nl('page_checkout_coupon') }}
                <template v-if="checkoutSummary.bonusType == 'percent'">({{ checkoutSummary.bonusValue * 100 }}%)</template>
              </span>
              <span class="item-right fr">-{{ checkoutSummary.bonusDisplay }}</span>
            </div>
          </template>
        </template>

        <!-- 校园大使优惠 -->
        <div v-if="checkoutSummary.referralDiscount" class="item clearfix">
          <div class="item-left fl referral-discount">
            {{ nl('page_cart_referral_discount') }}
            <p v-if="!isForOrder" class="referral-tip">
              <az-icon
                @mouseover.native="showReferralTip = true"
                @mouseleave.native="showReferralTip = false"
                icon-class="icon-gwc-_question_"
                class="icon-question"
              ></az-icon>
              <span v-if="showReferralTip">{{
                nl(`page_cart_referral_discount_dec${country !== 'US' ? `_${country.toLowerCase()}` : ''}`)
              }}</span>
            </p>
          </div>
          <span class="item-right fr">-{{ checkoutSummary.referralDiscountDisplay }}</span>
        </div>
        <!-- rushFee -->
        <div v-if="checkoutSummary.totalRushFee && checkoutSummary.totalRushFee > 0" class="item clearfix">
          <div class="cart-rush-fee">
            <rush-desc :title="nl('page_cart_rush_fee')"></rush-desc>
          </div>
          <span class="item-right fr">{{ checkoutSummary.totalRushFeeDisplay }}</span>
        </div>
        <!-- shippingFee -->
        <div class="item clearfix">
          <span class="item-left fl">{{ nl('page_common_goods_shipping').toLowerCase() }}</span>
          <span v-if="!isForOrder" @click.stop.prevent="handleShippingFee()" class="icon">
            <az-icon icon-class="icon-gwc-_question_" class="icon-question" />
          </span>
          <div v-if="checkoutSummary.savedShippingFee && !isForOrder" class="item-right fr">
            <span class="show-shipping-save">{{ checkoutSummary.oldShippingFeeDisplay }}</span>
            <span>{{ checkoutSummary.shippingFeeDisplay }}</span>
          </div>
          <template v-else-if="checkoutSummary.shippingFee > 0">
            <!-- 加急运费有折扣 -->
            <span v-if="checkoutSummary.shippingFeeDisplayNew" class="item-right fr shipping-fee-line-through">{{
              checkoutSummary.shippingFeeDisplayNew
            }}</span>
            <span :class="{ 'theme-color': checkoutSummary.shippingFeeDisplayNew }" class="item-right fr">{{
              checkoutSummary.shippingFeeDisplay
            }}</span>
          </template>
          <span v-else class="item-right fr shipping-free">{{ nl('page_common_free') }}</span>
        </div>
        <div v-if="checkoutSummary.savedShippingFee && !isForOrder" class="item clearfix">
          <span class="item-right fr shipping-fee-save">{{ nl('page_common_save') }} {{ checkoutSummary.savedShippingFeeDisplay }}</span>
        </div>
        <!-- taxFee -->
        <div v-if="showTaxText && !['AU', 'GB', 'FR', 'MX', 'ES', 'DE', 'IT'].includes(currentCountry)" class="item clearfix">
          <span class="item-left fl">{{ nl('page_revie_tax') }}</span>
          <span id="checkout_tax_radio" v-if="checkoutSummary.taxRatio && checkoutSummary.originTaxFee > 0">
            ({{ checkoutSummary.taxRatio }})
          </span>
          <span class="item-right fr">{{ checkoutSummary.originTaxFeeDisplay }}</span>
        </div>
        <!-- NY_rate_duty -->
        <div v-if="checkoutSummary.NYRateDuty" class="item item_flex">
          <span class="item-left fl">
            {{ nl('Exempt NY State rate for item less than $110') }}
            <template v-if="checkoutSummary.NYStateRate">({{ checkoutSummary.NYStateRate }})</template>
          </span>
          <span id="ny_tax_total" class="item-right fr"> -{{ checkoutSummary.NYRateDutyDisplay }}</span>
        </div>
        <!-- rebateTax -->
        <div v-if="checkoutSummary.rebateTaxFee > 0" class="item item_flex">
          <span class="item-left fl">
            {{ nl('page_rebate_tax') }}
            <template v-if="checkoutSummary.rebateTaxRatio">({{ checkoutSummary.rebateTaxRatio }})</template>
          </span>
          <span id="rebate_tax_total" class="item-right fr"> -{{ checkoutSummary.rebateTaxFeeDisplay }} </span>
        </div>
      </template>

      <!-- 使用gift card -->
      <div v-if="checkoutSummary.orderAccountBalanceAmount > 0" class="item clearfix">
        <span class="item-left fl">
          {{ nl('page_order_gift_card_balance') }}
        </span>
        <span class="item-right fr">-{{ checkoutSummary.orderAccountBalanceAmountDisplay }}</span>
      </div>
    </div>

    <div :class="[from]" class="order-summary-total clearfix">
      <span class="item-left fl">{{ nl('page_cart_total') }}</span>
      <span class="item-right fr">{{ checkoutSummary.totalAmountDisplay }}</span>
    </div>
    <!-- save 的金额 -->
    <div v-if="checkoutSummary.saveAmount && from === 'checkout'" class="order-summary-save clearfix">
      <span class="item-left fl">{{ nl('page_cart_you_saved') }}</span>
      <span class="item-right fr">{{ checkoutSummary.saveAmountDisplay }}</span>
    </div>

    <!-- 展示含税提示 -->
    <p v-if="taxIncluseText" class="tax-incluse text-right pt-6">{{ taxIncluseText }}</p>
    <!-- cyber monday活动，活动期间免shipping fee -->
    <div v-if="isCyberMondayActivity" class="tips-free-shipping-fee">
      <az-icon icon-class="icon_shipping_car_common" class="icon-shipping-car-common"></az-icon>
      <span>{{ nl(`page_cat_free_shipping_tip_${country.toLowerCase()}`) }}</span>
    </div>
  </div>
</template>

<script>
import RushDesc from '@/components/product/RushDesc'
import AzWithCode from '@/components/az-ui/AzWithCode'
import DiscountPricePop from '@/components/cart/DiscountPricePop'
import { mapState } from 'vuex'
export default {
  name: 'OrderSummaryAmountInfo',
  components: { RushDesc, AzWithCode, DiscountPricePop },
  props: {
    width: {
      type: String,
      default: '100%'
    },
    checkoutSummary: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isForOrder: {
      type: Boolean,
      default: false
    },
    from: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showReferralTip: false
    }
  },
  computed: {
    ...mapState('checkout', ['orderInfo', 'couponInfo', 'bonusDetail']),
    // 当前应该展示的国家，如果有订单国家code，取订单国家code，否则就是country
    currentCountry() {
      const res = (this.orderInfo && this.orderInfo.countryCode) || this.$route.query.order_country_code || this.country
      return res
    },
    // 是否是cyber monday活动，活动期间免shipping fee
    isCyberMondayActivity() {
      return (
        this.activityInfo && this.activityInfo.length && this.activityInfo.some((item) => item.base && item.base.couponCode == 'AZCYBER')
      )
    }
  },
  methods: {
    handleShippingFee() {
      this.$store.commit('cart/setShippingFeeLayerShow', true)
    }
  }
}
</script>

<style lang="less" scoped>
.order-summary-amount-info {
  width: 100%;
  .order-summary-container {
    padding: 9px 0 15px 0;
    .item {
      font-size: 13px;
      font-family: @font-family-500, sans-serif;
      color: var(--color-121212);
      line-height: 18px;
      margin-top: 6px;
      .current-goods-amount {
        font-size: 13px;
        font-family: @font-family-600;
        color: var(--color-121212);
      }
      .no-deal-goods-amount {
        font-size: 13px;
        color: #999;
        font-family: @font-family-500;
        text-decoration: line-through;
      }
      .shipping-fee-save,
      .shipping-free,
      .discount_part,
      .coupon-b {
        text-transform: uppercase;
        color: @theme-color;
      }
      .show-shipping-save {
        text-decoration: line-through;
        color: var(--color-999999);
      }

      .item-left {
        text-transform: capitalize;
      }
      .item-right {
        white-space: nowrap;
        margin-left: 15px;
      }
      &.item_flex {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .shipping-fee-line-through {
        color: var(--color-999999);
        text-decoration: line-through;
        margin-left: 5px;
      }
    }
    &.checkout {
      .item {
        .item-right {
          font-family: @font-family-600;
        }
      }
    }
    &.checkout_success {
      padding-top: 0;
      .item:first-of-type {
        padding-top: 0;
      }
    }
    .cart-with-code {
      justify-content: flex-start;
      margin-top: 5px;
    }
    .icon {
      position: relative;
      cursor: pointer;
    }
    .icon-question {
      margin-left: 5px;
      width: 13px;
      height: 13px;
      cursor: pointer;
    }
    #subtotal_txt {
      text-transform: capitalize;
    }
  }
  .order-summary-total {
    border-top: solid 1px #ccc;
    padding-top: 5px;
    font-family: @font-family-600, sans-serif;
    color: var(--color-121212);
    font-size: 14px;
    &.checkout {
      .item-left {
        font-family: @font-family-500;
      }
    }
  }
  .order-summary-save {
    font-size: 13px;
    line-height: 18px;
    color: @theme-color;
    padding-top: 5px;
  }
  .cart-rush-fee {
    display: inline-block;
  }
}
.tips-free-shipping-fee {
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 12px;
  .icon-shipping-car-common {
    font-size: 24px;
    fill: currentColor;
    color: var(--color-121212);
    margin-right: 5px;
  }
  span {
    flex: 1;
  }
}
.referral-discount {
  display: flex;
}
.referral-tip {
  position: relative;
  margin-left: 8px;
  .icon-question {
    margin-left: 0 !important;
  }
  span {
    display: block;
    position: absolute;
    left: -141px;
    top: 22px;
    padding: 12px;
    width: 270px;
    border: 1px solid var(--color-cccccc);
    border-radius: 5px;
    background: #fff;
    z-index: 4;
    font-family: @font-family-500;
    font-size: 13px;
    line-height: 18px;
    color: var(--color-121212);
    &::after {
      position: absolute;
      top: -6px;
      left: 50%;
      margin-left: -5px;
      content: '';
      display: inline-block;
      z-index: 3;
      width: 10px;
      height: 10px;
      background: #fff;
      border-left: 1px solid var(--color-cccccc);
      border-top: 1px solid var(--color-cccccc);
      transform: rotate(45deg);
    }
  }
}
</style>
