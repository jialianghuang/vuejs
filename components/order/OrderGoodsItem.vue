<template>
  <div class="order-items-block">
    <div v-if="fromTrackingPage" class="tracking_order_info_title">{{ nl('page_tracking_shipment_items') }}</div>
    <div v-else class="order_info_title">
      {{ nl('page_common_items') }}
      <template v-if="orderGoodsQty">
        (<span>{{ orderGoodsQty }}</span
        >)
      </template>
      <div v-if="orderInfo.party && orderInfo.party.name" :class="{ expired: orderInfo.party.disable }" class="party_select_div">
        <span class="separate_line"></span>
        {{ orderInfo.party.name }}({{ orderInfo.party.value }}) {{ nl('page_party_select_desc') }}
        <template v-if="orderInfo.party.disable">({{ nl('page_common_expired') }})</template>
      </div>
    </div>

    <div class="product-list">
      <pay-product-list-item
        v-for="(productItem, index) in orderGoods"
        :key="index"
        :productItem="productItem"
        :isMyOrder="isMyOrder"
        :isSamplePurchaseOrder="orderInfo.isSamplePurchaseOrder"
        :isNewReturnMethod="returnMethodData.isNewReturnMethod"
        :fromTrackingPage="fromTrackingPage"
      ></pay-product-list-item>
    </div>

    <div v-if="isPaidAndUnpaid" class="pay-summary-block">
      <div class="pay-summary">
        <div class="order-summary-amount-info">
          <div class="order-summary-container">
            <div class="item clearfix">
              <span id="subtotal_txt" class="item-left fl">{{ nl('page_common_subtotal') }}</span>
              <span id="sc_goods_total" class="item-right fr">{{ orderInfo.goodsAmountDisplay }}</span>
            </div>
            <div class="item clearfix">
              <span class="item-left fl"
                >{{ nl('page_checkout_coupon') }}
                <template v-if="orderInfo.bonusType == 'percent' && orderInfo.bonusValue"
                  >({{ orderInfo.bonusValue * 100 }}%)</template
                ></span
              >
              <span class="item-right fr">{{ orderInfo.bonusDisplay }}</span>
            </div>
            <div v-if="orderInfo.rushFee * 1 > 0" class="item clearfix">
              <span class="item-left fl">{{ nl('page_cart_rush_fee') }}:</span>
              <span class="item-right fr">{{ orderInfo.rushFeeDisplay }}</span>
            </div>
            <div class="item clearfix">
              <span class="item-left fl">{{ nl('page_common_goods_shipping') }}</span>
              <span class="item-right fr">{{ orderInfo.shippingFeeDisplay }}</span>
            </div>
            <div v-if="!['AU', 'GB', 'FR', 'MX', 'ES', 'DE', 'IT'].includes(currentCountry)" class="item clearfix">
              <span class="item-left fl">{{ nl('page_revie_tax') }}</span>
              <span class="item-right fr">{{ orderInfo.taxFeeDisplay }}</span>
            </div>
            <!-- 如果使用了giftcard 支付，要回显 -->
            <div v-if="orderInfo.orderAccountBalanceAmount > 0" class="item clearfix">
              <span class="item-left fl">
                {{ nl('page_order_gift_card_balance') }}
              </span>
              <span class="item-right fr">-{{ orderInfo.orderAccountBalanceAmountDisplay }}</span>
            </div>
          </div>
          <div class="order-summary-total clearfix">
            <strong class="item-left fl">{{ nl('page_common_order_total') }}</strong>
            <strong class="item-right fr">{{ orderInfo.orderAmountDisplay }}</strong>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!fromTrackingPage" class="order-option">
      <!-- oxxo 支付倒计时 -->
      <a
        :id="orderInfo.orderSn"
        v-if="isOxxoPayPrepare"
        :href="countryUrl(`/order/invoice_detail?order_sn=${orderInfo.orderSn}`)"
        target="_blank"
        class="continue-checkout"
      >
        <az-button :needIcon="false" :disabled="!orderInfo.available" class="btn btn-default continue-btn">
          {{ nl('page_order_btn_invoice') }}
        </az-button>
        <div class="status-count-down theme-color">
          <az-count-down :isOrderItem="true" :endTime="orderInfo.paymentExtension.paymentExpiredDate"></az-count-down>
          <span class="after">
            <span class="order_desc">
              {{ nl('page_order_oxxo_count_down_tips') }}
            </span>
          </span>
        </div>
      </a>
      <!-- continue -->
      <a
        :id="orderInfo.orderSn"
        v-else-if="orderInfo.continueCheckout"
        :href="
          orderInfo.available
            ? countryUrl(
                `/checkout?order_sn=${orderInfo.orderSn}&order_country_code=${orderInfo.countryCode}${isBridal ? '&subsite=bridal' : ''}`
              )
            : `javascript:;`
        "
        class="continue-checkout"
      >
        <az-button :needIcon="false" :disabled="!orderInfo.available" class="btn btn-default continue-btn">
          {{ nl('page_common_continue_checkout') }}
        </az-button>
      </a>
    </div>
  </div>
</template>

<script>
import PayProductListItem from '@/components/checkout/PayProductListItem'
import AzButton from '@/components/az-ui/Button/AzButton'
import AzCountDown from '@/components/az-ui/AzCountDown'
export default {
  name: 'OrderGoodsItem',
  components: { PayProductListItem, AzButton, AzCountDown },
  props: {
    orderInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    orderGoods: {
      type: Array,
      default() {
        return []
      }
    },
    isPaidAndUnpaid: {
      // 是否是支付和未支付共存的情况
      type: Boolean,
      default: false
    },
    isMyOrder: {
      type: Boolean,
      default: false
    },
    returnMethodData: {
      type: Object,
      default() {
        return {}
      }
    },
    fromTrackingPage: {
      // 是否来自/pages/tracking 物流查询页面
      type: Boolean,
      default: false
    }
  },
  computed: {
    orderGoodsQty() {
      return this.orderInfo.goodsQty
    },
    // 当前应该展示的国家数据，有订单国家根据订单国家字段来展示
    currentCountry() {
      const res = this.orderInfo.countryCode
      return res || this.country
    },
    isOxxoPayPrepare() {
      return (
        this.orderInfo.paymentExtension &&
        this.orderInfo.paymentExtension.hasOwnProperty('ticketPayCodeIsExpired') &&
        !this.orderInfo.paymentExtension.ticketPayCodeIsExpired
      )
    }
  }
}
</script>

<style lang="less" scoped>
.order-items-block {
  .tracking_order_info_title {
    font-size: 16px;
    line-height: 22px;
    font-family: @font-family-600;
    padding: 9px 0;
    text-transform: uppercase;
  }
  .order_info_title {
    border-bottom: none !important;
    .party_select_div {
      display: inline-block;
      color: @theme;
      font-family: @font-family-600, sans-serif;
      font-size: 13px;
      text-transform: capitalize;
      &.expired {
        color: #666;
      }
      .separate_line {
        display: inline-block;
        margin-left: 5px;
        border-left: 1px solid var(--color-666666);
        padding-right: 2px;
        height: 12px;
        line-height: 12px;
      }
    }
  }
  .pay-summary-block {
    border-top: solid 1px var(--color-cccccc);
    .pay-summary {
      width: 278px;
      padding: 7px 11px 20px;
      display: flex;
      margin-left: auto;
      .order-summary-amount-info {
        width: 100%;
        .order-summary-container {
          padding: 10px 7px;
          .item {
            font-size: 13px;
            font-family: @font-family-500, sans-serif;
            color: var(--color-121212);
            line-height: 18px;
            padding: 4px 0;
            .shipping-fee-save,
            .shipping-free,
            .discount_part {
              text-transform: uppercase;
              color: var(--color-121212);
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
          }
          .icon {
            cursor: pointer;
          }
          .icon-question {
            margin-left: 6px;
            width: 12px;
            height: 12px;
          }
          #subtotal_txt {
            text-transform: uppercase;
            font-weight: bold;
          }
        }
        .order-summary-total {
          border-top: solid 1px var(--color-121212);
          padding: 14px 7px 0;
          font-family: @font-family-600, sans-serif;
          color: var(--color-121212);
          font-size: 13px;
        }
      }
    }
  }

  .order-option {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
  }

  .status-count-down {
    cursor: pointer;
    position: relative;
    text-align: center;
    margin-top: 5px;
    .after {
      margin-left: 5px;
      color: var(--color-121212);
      .order_desc {
        display: none;
        position: absolute;
        left: 88px;
        top: 24px;
        width: 245px;
        transform: translateX(-50%);
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 3px;
        // text-align: center;
        padding: 10px;
        box-sizing: border-box;
        z-index: 1;
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
      }
    }
    &:hover .order_desc {
      display: inline-block;
    }
  }
  /deep/ .product-list {
    .pay-product-list-order-item {
      // padding: 19px 0;
    }
    .td-title h4 {
      font-weight: normal;
    }
    .td-desc {
      line-height: 21px;
      span {
        color: var(--color-121212);
      }
    }
    .write-a-review-wrap {
      // bottom: 19px;
    }
  }
}
</style>
