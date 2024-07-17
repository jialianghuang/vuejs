<template>
  <div>
    <div class="order-summary">
      <h2 class="title">{{ nl('page_common_order_summary') }}</h2>
      <div class="order-summary-container">
        <div class="item clearfix">
          <span class="item-left fl"
            >{{ nl('page_common_subtotal') }}
            <DiscountPricePop
              v-if="summaryInfo.totalNoDealGoodsAmount != summaryInfo.goodsAmount"
              :ec="'shoppingbag'"
              :el="'subtotal discount'"
              :bonusDetail="bonusDetail"
            />
          </span>
          <div v-if="summaryInfo.totalNoDealGoodsAmount != summaryInfo.goodsAmount" class="item-right fr">
            <span class="current-goods-amount">{{ summaryInfo.goodsAmountDisplay }}</span>
            <span class="no-deal-goods-amount">{{ summaryInfo.totalNoDealGoodsAmountDisplay }}</span>
          </div>
          <span v-else class="item-right fr">{{ summaryInfo.goodsAmountDisplay }}</span>
        </div>
        <!-- 校园大使优惠 -->
        <div v-if="summaryInfo.referralDiscount" class="item clearfix">
          <div class="item-left fl referral-discount">
            {{ nl('page_cart_referral_discount') }}
            <p class="referral-tip">
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
          <span class="item-right fr">-{{ summaryInfo.referralDiscountDisplay }}</span>
        </div>
        <div v-if="summaryInfo.rushFee && summaryInfo.rushFee > 0" class="item clearfix">
          <div class="cart-rush-fee">
            <rush-desc :title="nl('page_cart_rush_fee')"></rush-desc>
          </div>
          <span class="item-right fr">{{ summaryInfo.rushFeeDisplay }}</span>
        </div>
        <template v-if="summaryInfo.originalShippingFee && summaryInfo.originalShippingFee != summaryInfo.shippingFee">
          <div class="item clearfix">
            <span class="item-left fl">{{ nl('page_cart_estimated_desc') }}</span>
            <span id="original_shipping_fee_display" class="item-right fr">{{ summaryInfo.originalShippingFeeDisplay }}</span>
          </div>
          <div class="item clearfix">
            <span class="item-right fr discount_part">{{ summaryInfo.shippingFeeDisplay }} (50% OFF)</span>
          </div>
        </template>
        <template v-else>
          <div class="item clearfix flex-center">
            <div>
              <span class="item-left">{{ hasMxBdBatch ? nl('page_cart_estimated_desc_mx') : nl('page_cart_estimated_desc') }}</span>
              <span @click.stop.prevent="handleShippingFee()" class="icon">
                <az-icon icon-class="icon-gwc-_question_" class="icon-question" />
              </span>
            </div>
            <div v-if="summaryInfo.savedShippingFee" class="item-right fr">
              <span class="show-shipping-save">{{ summaryInfo.oldShippingFeeDisplay }}</span>
              <span>{{ summaryInfo.shippingFeeDisplay }}</span>
            </div>
            <span v-else-if="summaryInfo.shippingFee" class="item-right fr">{{ summaryInfo.shippingFeeDisplay }}</span>
            <span v-else class="item-right fr shipping-free">{{ nl('page_checkout_free') }}</span>
          </div>
          <div v-if="summaryInfo.savedShippingFee" class="item clearfix">
            <span class="item-right fr shipping-fee-save">{{ nl('page_index_save') }} {{ summaryInfo.savedShippingFeeDisplay }}</span>
          </div>
        </template>
        <!-- couponFee -->
        <template v-if="summaryInfo.activityOrderBonus && summaryInfo.activityOrderBonus > 0">
          <div class="item clearfix">
            <span class="item-left fl">{{ couponInfo.couponValueTxtDisplay }} {{ nl('page_cart_coupon_applied') }}</span>
            <span class="item-right fr coupon-b">-{{ summaryInfo.activityOrderBonusDisplay }}</span>
          </div>
          <az-with-code :code="couponInfo.code" :need-color="true" class="cart-with-code"></az-with-code>
        </template>
      </div>
      <div class="order-summary-total clearfix">
        <span class="item-left fl">{{ nl('page_cart_total') }}</span>
        <span class="item-right fr">{{ summaryInfo.totalAmountDisplay }}</span>
      </div>
      <!-- save 的金额 -->
      <div v-if="summaryInfo.saveAmount" class="order-summary-save clearfix">
        <span class="item-left fl">{{ nl('page_cart_you_saved') }}</span>
        <span class="item-right fr">{{ summaryInfo.saveAmountDisplay }}</span>
      </div>
      <!-- 展示含税提示 -->
      <p v-if="taxIncluseText" class="tax-incluse text-right pt-6">{{ taxIncluseText }}</p>
      <afterpay-view v-if="summaryInfo.hasAfterPay" :afterpayTips="nl(summaryInfo.afterPayTips)" />
      <!-- Klarna 卖点信息 -->
      <template v-if="summaryInfo.hasKlarna">
        <!-- DE 使用自定义的Klarna卖点，不使用sdk的-->
        <az-klarna-messaging v-if="country == 'DE'" :purchaseAmountDisplay="summaryInfo.totalAmountDisplay"></az-klarna-messaging>
        <klarna-messaging
          id="klarna-messaging-cart-summary"
          v-else
          :purchaseAmount="(summaryInfo.totalAmount * 100).toFixed() * 1"
          :dataKey="'credit-promotion-badge'"
        ></klarna-messaging>
      </template>
      <!-- cyber monday活动，活动期间免shipping fee -->
      <div v-if="isCyberMondayActivity" class="tips-free-shipping-fee">
        <az-icon icon-class="icon_shipping_car_common" class="icon-shipping-car-common"></az-icon>
        <span>{{ nl(`page_cat_free_shipping_tip_${country.toLowerCase()}`) }}</span>
      </div>
      <incentive-info v-else-if="currentCountry == 'CA' && Object.keys(awardInfo).length"></incentive-info>
      <template v-if="!hideCoupon">
        <coupon @setCheckoutAmount="getCheckoutAmount"></coupon>
        <coupon-select-result
          v-if="(couponInfo && couponInfo.code) || hasCoupons"
          :coupon-result="couponResultInfo"
          @init-coupon-status="initCouponStatus = true"
        ></coupon-select-result>
        <coupon-select :refresh="refreshCoupon" :init="initCouponStatus" @setCheckoutAmount="getCheckoutAmount"></coupon-select>
      </template>
      <section v-if="couponInfo.code == 'HIBEAUTY'" class="sod-coupon-container">
        <div class="sod-coupon-expire-box">
          <span class="sod-coupon-expire-box-item text">{{ nl('page_common_expire_soon_pay') }}</span>
          <div v-if="!couponInfo.couponEndTime" class="sod-coupon-expire-box-item tips">
            <az-icon icon-class="icon-gwc-_question_" class="sod-tip"></az-icon>
            <p class="tips-box">
              <span>{{ nl('page_common_expire_soon_desc') }}</span>
            </p>
          </div>
        </div>
      </section>
      <div @click="beforeCheckout" class="btn-continue">
        <az-button
          id="btn-continue"
          v-track.viewOnce.click="{ id: 'cart-continue-btn', common: getCommon() }"
          @click="continueCheckout"
          :text="nl('page_cart_secure_checkout')"
          :loading="loading"
          :loadingText="nl('page_js_processing')"
          :color="'var(--color-121212)'"
          :round="'2px'"
          :disable="!summaryInfo.available"
          :icon="'icon-gwc_ca_secure_checkout'"
        ></az-button>
      </div>
    </div>
    <CheckoutIcon :from="'cart'" />
  </div>
</template>

<script>
import AzButton from '@/components/az-ui/AzButton'
import afterpayView from '@/components/common/AfterpayView'
import incentiveInfo from '@/components/cart/IncentiveInfo'
import validateCart from '@/assets/js/validateCart'
import RushDesc from '@/components/product/RushDesc'
import CheckoutIcon from '@/components/checkout/CheckoutIcon'
import Coupon from '@/components/checkout/Coupon'
import CouponSelectResult from '@/components/coupon/CouponSelectResult'
import CouponSelect from '@/components/coupon/CouponSelect'
import AzWithCode from '@/components/az-ui/AzWithCode'
import KlarnaMessaging from '@/components/common/KlarnaMessaging'
import AzKlarnaMessaging from '@/components/common/AZKlarnaMessaging'
import DiscountPricePop from '@/components/cart/DiscountPricePop'
import { mapState } from 'vuex'
export default {
  name: 'OrderSummary',
  components: {
    AzButton,
    afterpayView,
    incentiveInfo,
    RushDesc,
    CheckoutIcon,
    Coupon,
    CouponSelectResult,
    CouponSelect,
    AzWithCode,
    KlarnaMessaging,
    AzKlarnaMessaging,
    DiscountPricePop
  },
  mixins: [validateCart],
  props: {
    // mx下，是否包含特殊商品
    hasMxBdBatch: {
      type: Boolean,
      default: false
    },
    // 是否刷新券
    refreshCoupon: {
      type: [Boolean, String],
      default: false
    }
  },
  data() {
    return {
      loading: false,
      showReferralTip: false,
      initCouponStatus: false
    }
  },
  computed: {
    ...mapState('cart', [
      'selectedParty',
      'parties',
      'awardInfo',
      'summaryInfo',
      'invalidCheckoutGoodsList',
      'checkoutGoodsList',
      'validCheckoutGoodsList',
      'bonusDetail',
      'redeemedStatus'
    ]),
    ...mapState('checkout', ['hasCoupons', 'couponInfo', 'checkoutSummary']),
    // 当前应该展示的国家数据，订单国家信息优先
    currentCountry() {
      const res = this.$route.query.order_country_code
      return res || this.country
    },
    // 是否是cyber monday活动，活动期间免shipping fee
    isCyberMondayActivity() {
      return (
        this.activityInfo && this.activityInfo.length && this.activityInfo.some((item) => item.base && item.base.couponCode == 'AZCYBER')
      )
    },
    // 优惠券确认结果内容显示，红框中显示的内容
    couponResultInfo() {
      return {
        couponCode: this.couponInfo.code,
        couponValueTxt: this.couponInfo.type == 'value' ? '' : this.couponInfo.couponValueTxt,
        couponValue: this.summaryInfo.activityOrderBonusDisplay
      }
    },
    // 礼品卡不显示 coupon
    hideCoupon() {
      return (
        this.checkoutGoodsList &&
        this.checkoutGoodsList.length &&
        this.checkoutGoodsList.length == 1 &&
        this.checkoutGoodsList[0].isGiftCard
      )
    }
  },
  mounted() {},
  methods: {
    // coupon emit
    getCheckoutAmount(options) {
      this.$emit('setCheckoutAmount', options)
    },
    getCommon() {
      const catIds = []
      let flag = false
      this.validCheckoutGoodsList.forEach((item) => {
        if (item.driveInfo && item.driveInfo.cartSticker && Object.keys(item.driveInfo.cartSticker).length) {
          flag = true
        }
        if (!catIds.includes(item.catId)) {
          catIds.push(item.catId)
        }
      })
      const msg = {
        category_ids: catIds.join(','),
        wgd_ver: 'A',
        attr1: flag
      }
      // 搭售ab
      if (this.redeemedStatus.status.conditionType == 2 && !!this.redeemedStatus.goodsList.length) {
        msg.ab = this.versionObj.cartTyingAbtest.toLowerCase()
      }
      return {
        ec: 'continuecheckout',
        el: 'button',
        msg: JSON.stringify(msg)
      }
    },
    continueCheckout() {
      // 用户信息刷新前 禁止checkout
      if (this.waitGetLogin) return
      if (this.currentCountry == 'CA' && Object.keys(this.awardInfo).length) {
        this.setDataLayer({
          action: 'click',
          category: 'CartMotivationCheckout',
          label: `CartMotivationCheckout_Click`
        })
      }
      // ga4 打点
      this.setGA4DataLayer({
        event: 'ga4Event',
        event_name: 'checkout',
        event_parameters: {
          button_name: 'Secure Checkout'
        }
      })

      // 已登录的时候
      if (this.isLogin) {
        // party的选择校验
        // if (!this.selectedParty && this.parties && Object.keys(this.parties).length > 0 && !this.summaryInfo.isSpringRush) {
        //   this.setDataLayer({
        //     action: 'view',
        //     category: 'PC_ShoppingCartRevision',
        //     label: `ShoppingCart_PartyError_View`
        //   })
        // } else {
        this.loading = true
        this.validateCart()
        // }
      } else {
        window.location.href = this.countryUrl('/checkout')
      }
    },
    handleShippingFee() {
      this.setPoint('shipping', 'note', 'click')
      this.$store.commit('cart/setShippingFeeLayerShow', true)
    },
    beforeCheckout() {
      // 有实效商品的时候
      if (Object.keys(this.invalidCheckoutGoodsList).length) {
        this.setDataLayer({
          action: 'click',
          category: 'CartUnavailable',
          label: 'CartUnavailable_CheckoutButton_Click'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.order-summary {
  padding: 15px 20px 20px;
  width: 340px;
  background: var(--color-f9f9f9);
  .title {
    font-size: 14px;
    line-height: 19px;
    padding: 0 0 6px;
    font-family: @font-family-600;
    font-weight: unset;
    text-transform: uppercase;
    border-bottom: 1px solid var(--color-cccccc);
    color: var(--color-121212);
  }
  .order-summary-container {
    padding: 9px 0 15px 0;
    .item {
      font-size: 13px;
      font-family: @font-family-500;
      color: var(--color-121212);
      line-height: 18px;
      margin-top: 6px;
      .item-right {
        font-family: @font-family-600;
        &.sod-coupon {
          color: @theme;
        }
      }
      .current-goods-amount {
        font-size: 13px;
        font-family: @font-family-600;
        color: var(--color-121212);
      }
      .no-deal-goods-amount {
        font-size: 13px;
        color: var(--color-999999);
        font-family: @font-family-500;
        text-decoration: line-through;
      }
      .shipping-fee-save,
      .shipping-free,
      .discount_part,
      .coupon-b {
        color: @theme-color;
      }
      .show-shipping-save {
        text-decoration: line-through;
        color: var(--color-999999);
      }
      #original_shipping_fee_display {
        text-decoration: line-through;
        color: var(--color-999999);
      }
      &.flex-center {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > div:first-of-type {
          flex: 1;
        }
        .item-left:first-of-type {
          // margin-right: 8px;
        }
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
      width: 13px;
      height: 13px;
      cursor: pointer;
      margin-left: 2px;
    }
  }
  .order-summary-total {
    border-top: solid 1px var(--color-cccccc);
    padding: 0;
    padding-top: 5px;
    font-family: @font-family-500;
    color: var(--color-121212);
    font-size: 13px;
    line-height: 18px;
    .item-right {
      font-family: @font-family-600;
    }
  }
  .order-summary-save {
    font-size: 13px;
    line-height: 18px;
    color: @theme-color;
    padding-top: 5px;
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
  .sod-coupon-container {
    .sod-coupon {
      margin: 15px 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 10px;
      background-color: var(--btn-light-hover-color);
      box-sizing: border-box;
      &-item {
        font-family: @font-family-600;
        font-size: 12px;
        color: @theme;
        &.right {
          font-family: @font-family-500;
          font-size: 13px;
        }
      }
    }
    .sod-coupon-expire-box {
      display: flex;
      align-items: center;
      .sod-coupon-expire-box-item.text {
        color: @theme;
        letter-spacing: -0.26px;
        text-transform: capitalize;
      }
      .sod-coupon-expire-box-item.tips {
        margin-left: 5px;
        position: relative;
        &:hover {
          .tips-box {
            display: block;
          }
        }
        .tips-box {
          display: none;
          position: absolute;
          right: 10px;
          transform: translate(20px, 10px);
          max-width: 280px;
          width: max-content;
          padding: 15px;
          box-sizing: border-box;
          background-color: #fff;
          box-shadow: 0 0 2px 1px #d9d9d9;
          &:before,
          &:after {
            content: '';
            width: 0;
            height: 0;
            border: 8px solid transparent;
            border-bottom-color: #ccc;
            position: absolute;
            top: -16px;
            right: 8px;
          }
          &:after {
            border-bottom-color: #fff;
            top: -15px;
          }
        }
      }
    }
  }
  .btn-continue {
    margin-top: 15px;
    #btn-continue {
      padding: 10px;
      font-size: 14px;
      font-family: @font-family-600;
      text-transform: uppercase;
      line-height: 20px;
      background-color: @black-btn-color !important;
      &:hover,
      &:focus,
      &:active,
      &.active {
        background-color: @black-btn-hover-color !important;
      }
      &.disable,
      &.disable:hover {
        background-color: #ccc !important;
      }
    }
    .coupon-code-notice {
      margin-top: 15px;
      font-size: 12px;
      font-family: @font-family-500;
      color: var(--color-121212);
      line-height: 16px;
      padding: 0 7px;
      text-align: center;
    }
  }
}
.cart-rush-fee {
  display: inline-block;
}
.referral-discount {
  display: flex;
}
.referral-tip {
  position: relative;
  margin-left: 8px;
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
