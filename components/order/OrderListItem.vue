<template>
  <div class="order-list-item">
    <div class="cell">
      <template v-if="order.productList && order.productList.length">
        <order-list-item-img
          :classKey="order.orderSn"
          :list="order.productList"
          :imgHref="countryUrl(`/order/detail?order_sn=${order.orderSn}`)"
        ></order-list-item-img>
      </template>
      <a :href="countryUrl(`/order/detail?order_sn=${order.orderSn}`)">{{ nl('page_common_order_no') }}{{ order.orderSn }}</a>
    </div>
    <div class="cell order-amount">{{ order.orderAmountDisplay }}</div>
    <div class="cell">{{ order.orderTime }}</div>
    <!-- <div v-html="order.statusInfo.txt" class="break cell"></div> -->
    <div class="break cell order-status">
      <!-- oxxo Payment Preparation -->
      <template v-if="isOxxoPayPrepare">
        {{ nl('page_order_payment') }}
        <div class="order-status-prepare">
          {{ nl('page_order_preparation') }}
          <span class="after">
            <az-icon icon-class="icon-gwc-_question_"></az-icon>
            <span class="order_desc">
              {{ nl('page_order_oxxo_preparation_tips') }}
            </span>
          </span>
        </div>
      </template>
      <template v-else>
        {{ order.statusInfo.flag }}
      </template>
    </div>
    <div class="cell">
      <!-- oxxo 查看票据 -->
      <div v-if="isOxxoPayPrepare" class="action_line btn-invoice">
        <a :href="countryUrl(`/order/invoice_detail?order_sn=${order.orderSn}`)">{{ nl('page_order_btn_invoice') }}</a>
      </div>
      <!-- oxxo 支付倒计时 -->
      <div v-if="isOxxoPayPrepare" class="action_line status-count-down theme-color">
        <az-count-down :isOrderItem="true" :endTime="order.paymentExtension.paymentExpiredDate"></az-count-down>
        <span class="after">
          <span class="order_desc">
            {{ nl('page_order_oxxo_count_down_tips') }}
          </span>
        </span>
      </div>
      <!-- continue checkout -->
      <div v-if="order.checkoutAble" class="action_line">
        <a
          :href="
            countryUrl(`/checkout?order_sn=${order.orderSn}&order_country_code=${order.countryCode}${isBridal ? '&subsite=bridal' : ''}`)
          "
          class="a_checkout"
          >{{ nl('page_common_continue_checkout') }}</a
        >
      </div>
      <!-- 写评论 -->
      <div v-if="order.whiteReviewAble" class="action_line">
        <a :href="countryUrl(`/review/order_reviews?order_sn=${order.orderSn}`)" class="a_review">{{
          nl('page_category_write_a_review')
        }}</a>
      </div>
      <!-- track order -->
      <div v-if="order.trackPackagesAble" v-track.view.click="getBiCommonParams('orderlistpage', 'tracknumber')" class="action_line">
        <a v-if="order.isGroup" :href="countryUrl(`/order/detail?order_sn=${order.orderSn}`)" target="_blank" class="cur">{{
          nl('page_order_track_package')
        }}</a>
        <a v-else :href="order.trackingPageUrl" target="_blank" class="cur">{{ nl('page_order_track_package') }}</a>
      </div>
      <!-- 修改地址 -->
      <div v-if="order.addressEditable && !(order.paymentId == 256 && order.payStatus == 1)" class="action_line">
        <a :href="order.editAddressUrl + '&order_country_code=' + order.countryCode">{{ nl('page_email_change_shipping_address') }}</a>
      </div>
      <!-- 取消订单 -->
      <div v-if="order.cancelable && !(order.paymentId == 256 && order.payStatus == 1)" class="action_line">
        <div @click="showCancelOrderLayer()" class="a_cancel_order">{{ nl('page_email_cancel_order') }}</div>
      </div>
      <!-- Track Shipment -->
      <div v-if="order.trackShipmentable" v-track.view.click="getBiCommonParams('trackshipment', 'button')" class="action_line">
        <a
          v-if="order.isGroup || order.countryCode != 'US'"
          :href="countryUrl(`/order/detail?order_sn=${order.orderSn}`)"
          class="a_track-shipment"
          >{{ nl('page_tracking_track_shipment') }}</a
        >
        <a v-else :href="order.trackingPageUrl" target="_blank" class="a_track-shipment">{{ nl('page_tracking_track_shipment') }}</a>
      </div>
      <!-- 退货 #12280 判断 isNewReturnMethod的订单走弹窗逻辑，其余订单走之前的逻辑-->
      <!-- 还有一种特殊情况,基于新版退货方式：returnable为false && showContactUs为true && isNewReturnMethod为true,不可退货的订单会弹出退货弹窗,比如remake的订单 -->
      <!-- 备注：下面这样的代码判断逻辑看起来比较绕，是因为这个需求测试过程中产品一直有对逻辑的增删改。为了使影响面较小，避免因为更改判断逻辑需要重新回归所有的测试流程，先保留下面的判断方式，望理解，如果看不懂，可以直接找对应开发 -->
      <div v-if="order.returnable || (order.showContactUs && order.isNewReturnMethod)" class="action_line">
        <template v-if="country === 'US'">
          <a v-if="order.allSample" @click="handleReturnOrder()" class="a_return_items">{{ nl('page_order_return_items') }}</a>
          <a v-else :href="countryUrl('/return_exchange?order_sn=' + order.orderSn)" class="a_return_items">
            {{ nl('page_order_return_items') }}
          </a>
        </template>
        <template v-else>
          <a
            v-if="order.returnable && !order.isNewReturnMethod"
            :href="countryUrl(`/order/return?order_sn=${order.orderSn}`)"
            class="a_return_items"
            >{{ nl('page_order_return_items') }}</a
          >
          <a v-else @click="handleReturnOrder()" class="a_return_items">{{ nl('page_order_return_items') }}</a>
        </template>
      </div>
      <!-- sample purchase -->
      <div v-if="order.samplePurchasable" class="action_line">
        <a :href="order.samplePurchaseUrl + '&order_country_code=' + order.countryCode" class="a_sample_purchase">{{
          nl('page_order_purchase_samples')
        }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import OrderListItemImg from '@/components/order/OrderListItemImg'
import AzCountDown from '@/components/az-ui/AzCountDown'
/**
 * 订单列表单项组件
 */
export default {
  name: 'OrderListItem',
  components: {
    OrderListItemImg,
    AzCountDown
  },
  props: {
    order: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    isOxxoPayPrepare() {
      return (
        this.order &&
        this.order.paymentExtension &&
        this.order.paymentExtension.hasOwnProperty('ticketPayCodeIsExpired') &&
        !this.order.paymentExtension.ticketPayCodeIsExpired
      )
    }
  },
  methods: {
    showCancelOrderLayer() {
      this.$store.commit('order/setCancelOrderLayerShow', true)
      this.handleSetOrder()
    },
    handleReturnOrder() {
      this.$store.commit('order/setReturnOrderLayerShow', true)
      this.handleSetOrder()
    },
    handleSetOrder() {
      this.$emit('handleSetOrder', this.order)
    },
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
.order-list-item {
  position: relative;
  display: flex;
  align-items: center;
  .cell {
    font-family: @font-family-500;
    font-size: 13px;
    color: var(--color-121212);
    padding: 10px 0 10px 10px;
    box-sizing: border-box;

    a,
    .a_cancel_order {
      cursor: pointer;
      color: var(--color-121212);
      text-decoration: underline;
      &.a_checkout,
      &.a_review,
      &.a_track-shipment {
        color: @theme;
      }
      &:hover {
        color: @theme;
      }
    }
    .action_line {
      &:not(:first-of-type) {
        margin-top: 10px;
      }
      &.btn-invoice {
        a {
          color: @theme;
        }
      }
      &.status-count-down {
        cursor: pointer;
        position: relative;
        .after {
          margin-left: 5px;
          color: var(--color-121212);
          .order_desc {
            display: none;
            position: absolute;
            left: 43px;
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
    }
    &:nth-child(1) {
      width: 210px;
    }
    &:nth-child(2) {
      width: 183px;
    }
    &:nth-child(3) {
      width: 190px;
    }
    &:nth-child(4) {
      width: 140px;
    }
    &:nth-child(5) {
      width: 180px;
      padding-left: 10px;
    }
    &.order-status {
      cursor: pointer;
      .order-status-prepare {
      }
      .after {
        margin-left: 5px;
        position: relative;
        .order_desc {
          display: none;
          position: absolute;
          left: 4px;
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
      .after:hover .order_desc {
        display: inline-block;
      }
    }
  }
  .goods-img {
    height: 80px;
    display: block;
  }
}
</style>
