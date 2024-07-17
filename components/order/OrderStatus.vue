<template>
  <div class="order-b order-b-status">
    <div v-if="orderInfo.isSamplePurchaseOrder" class="purchase_sample_order_info">
      <!-- 样衣可购买的订单状态 -->
      <p v-html="orderInfo.payStatus != 2 ? nl('page_purchase_sample_info_copy_unpaid') : nl('page_purchase_sample_info_copy')"></p>
    </div>
    <template v-else>
      <div class="order_info_title">
        {{ statusTitle ? statusTitle : nl('page_order_order_status') }}
      </div>
      <div class="order-status">
        <div v-if="orderInfo.statusInfo" class="status-info">
          <div v-if="orderInfo.orderStatus == 2 || orderInfo.payStatus == 0 || isPaidAndUnpaid" class="cancelled-tips">
            <h2>{{ orderInfo.statusInfo.title }}:</h2>
            <span>{{ orderInfo.statusInfo.txt }}</span>
          </div>
          <h2 v-else v-html="orderInfo.statusInfo.status.replace(/<\/?br ?\/?>/g, ' ')"></h2>
        </div>

        <template v-for="(orderInfoItem, index) in orderInfoList">
          <div :key="index">
            <div :class="{ 'gift-card-status-et': orderInfoItem.onlyGiftCard }" class="status-et">
              <!-- 拆单 -->
              <template v-if="isGroup">
                <h2 v-if="!isPaidAndUnpaid">{{ nl('page_order_order_num') }}: #{{ orderInfoItem.orderSn }}</h2>
                <template v-if="orderInfo.orderStatus != 2">
                  <em v-if="!isPaidAndUnpaid" class="az-dot"></em>
                  <!-- deleriver 状态下特殊处理 -->
                  <span v-if="orderInfoItem.shippingStatus == 2 && orderInfoItem.actionInfo && orderInfoItem.actionInfo.shippingSigned">
                    <span class="order-received">{{ nl(orderInfoItem.statusInfo.title) }}:</span>
                    <span class="status-time">
                      {{ orderInfoItem.statusInfo && orderInfoItem.statusInfo.progressTxt }}
                    </span>
                  </span>
                  <!-- gift card 订单详情页特殊展示 -->
                  <span v-else-if="orderInfoItem.onlyGiftCard" class="gift-card-received-box is-group">
                    <span class="order-received">{{ nl('page_gift_card_order_delivery_date') }}:</span>
                    <span class="status-time">
                      {{ orderInfoItem.giftCard ? showGiftCardDate(orderInfoItem.giftCard.deliveryDate) : '' }}</span
                    >
                  </span>
                  <span v-else>
                    <span class="order-received">{{ nl('page_checkout_success_order_rec') }}</span>
                    <span class="status-time">
                      {{ orderInfoItem.lastGetTime }} {{ orderInfoItem.rushFee * 1 > 0 ? '(' + nl('page_order_rushed') + ')' : '' }}
                    </span>
                  </span>
                </template>

                <!-- 订单详情页 Track Shipment的按钮，点击跳转物流落地页 -->
                <a
                  v-if="orderInfoItem.trackShipmentable"
                  :href="`/pages/tracking?tracking=${orderInfoItem.trackingNumber}&order=${orderInfoItem.orderSn}`"
                  v-track.view.click="getBiCommonParams('trackshipment', 'button')"
                  class="track-shipment"
                  >{{ nl('page_tracking_track_shipment') }}</a
                >

                <ul>
                  <li v-for="(orderGoodsItem, orderGoodsIndex) in orderGoodsList[index]" :key="orderGoodsIndex">
                    <em class="az-dot"></em>
                    {{ orderGoodsItem.shownGoodsName }}
                  </li>
                </ul>
              </template>

              <!-- 非拆单 -->
              <template v-else>
                <template v-if="orderInfo.orderStatus != 2">
                  <!-- delevied 特殊处理 -->
                  <span v-if="orderInfoItem.shippingStatus == 2 && orderInfoItem.actionInfo && orderInfoItem.actionInfo.shippingSigned">
                    <span>{{ nl(orderInfoItem.statusInfo.title) }}:</span>
                    <span class="status-time">
                      {{ orderInfoItem.statusInfo && orderInfoItem.statusInfo.progressTxt }}
                    </span>
                  </span>
                  <!-- gift card 订单详情页特殊展示 -->
                  <span v-else-if="orderInfoItem.onlyGiftCard" class="gift-card-received-box">
                    <span class="order-received">{{ nl('page_gift_card_order_delivery_date') }}:</span>
                    <span class="status-time">
                      {{ orderInfoItem.giftCard ? showGiftCardDate(orderInfoItem.giftCard.deliveryDate) : '' }}</span
                    >
                  </span>
                  <span v-else>
                    <span>{{ nl('page_order_expected_delivery') }}:</span>
                    <span class="status-time">
                      {{ orderInfoItem.lastGetTime }} {{ orderInfoItem.rushFee * 1 > 0 ? '(' + nl('page_order_rushed') + ')' : '' }}
                    </span>
                  </span>

                  <!-- 订单详情页 Track Shipment的按钮，点击跳转物流落地页 -->
                  <a
                    v-if="orderInfoItem.trackShipmentable"
                    :href="`/pages/tracking?tracking=${orderInfoItem.trackingNumber}&order=${orderInfoItem.orderSn}`"
                    v-track.view.click="getBiCommonParams('trackshipment', 'button')"
                    class="track-shipment"
                    >{{ nl('page_tracking_track_shipment') }}</a
                  >
                </template>
              </template>
            </div>

            <!--tracking order-->
            <div v-if="orderInfoItem.trackingNumber && orderInfoItem.trackingUrl" class="status-tracking-no">
              <span>{{ nl('page_order_tracking_no') }}:</span>
              <a :href="orderInfoItem.trackingUrl">{{ orderInfoItem.trackingNumber }}</a>
            </div>

            <!-- TODO 样式待确认 -->
            <div v-if="!isGroup && orderInfo.orderStatus != 2 && orderInfo.payStatus != 0">
              <span v-if="orderInfoItem.actionInfo && orderInfoItem.actionInfo.shippingSigned">{{ nl('page_order_delivered') }}</span>
              <!-- <span v-else-if="![8, 9, 13].includes(orderInfoItem.shippingStatus)">{{ orderInfo.statusInfo.txt }}</span> -->
            </div>

            <!-- 订单未取消的情况下 支付与未支付并存 或者 订单不是未支付 -->
            <order-status-progress
              v-if="orderInfo.orderStatus != 2 && (isPaidAndUnpaid || orderInfo.payStatus != 0)"
              :isBatch="orderInfoItem.statusInfo && orderInfoItem.statusInfo.isBatch ? orderInfoItem.statusInfo.isBatch : false"
              :onlyGiftCard="!!orderInfoItem.onlyGiftCard"
              :progress="
                orderInfoItem.statusInfo && orderInfoItem.statusInfo.progress && orderInfoItem.statusInfo.progress * 1 >= 1
                  ? orderInfoItem.statusInfo.progress * 1 - 1
                  : 0
              "
              :hasTracking="Number(orderInfoItem.hasTracking)"
              :progressTxt="orderInfoItem.statusInfo && orderInfoItem.statusInfo.progressTxt ? orderInfoItem.statusInfo.progressTxt : ''"
              :progressPercent="
                orderInfoItem.statusInfo && orderInfoItem.statusInfo.progressPercent ? orderInfoItem.statusInfo.progressPercent : 0
              "
            ></order-status-progress>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
// 备注： 这个组件现在已经不再使用了，之前用于订单详情页，先留着，做之前逻辑的参考，订单详情页重构上线之后就可以删掉了
import OrderStatusProgress from '@/components/order/OrderStatusProgress'

export default {
  name: 'OrderStatus',
  components: { OrderStatusProgress },
  props: {
    isGroup: {
      type: Boolean,
      default: false
    },
    statusTitle: {
      type: String,
      default: ''
    },
    orderInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    orderInfoList: {
      type: Object,
      default() {
        return {}
      }
    },
    orderGoodsList: {
      type: Object,
      default() {
        return {}
      }
    },
    isPaidAndUnpaid: {
      // 是否是支付和未支付共存的情况
      type: Boolean,
      default: false
    }
  },
  methods: {
    showGiftCardDate(date) {
      if (!date) return ''
      const isToday = this.$dayjs(date).isSame(this.$dayjs(), 'day')
      if (isToday) {
        return this.nl('page_common_today')
      }
      return this.$dayjs(date).format('MM/DD/YYYY')
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
.order-b.order-b-status {
  margin-bottom: 0;
}
.purchase_sample_order_info {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-top: 1px solid var(--color-121212);
  img {
    width: 100px;
    height: 100px;
    margin: 50px 0 25px;
  }
  p {
    font-size: 16px;
    line-height: 22px;
    color: var(--color-121212);
    font-family: @font-family-500;
    text-align: center;
  }
}
.order-status {
  padding-top: 15px;
  h2 {
    font-size: 13px;
    font-family: @font-family-500;
    font-weight: normal;
    text-transform: capitalize;
  }
  .cancelled-tips {
    h2 {
      // text-transform: capitalize;
      display: inline-block;
    }
  }
  .status-et {
    margin-top: 15px;
    &.gift-card-status-et {
      margin-top: 10px;
    }
    .az-dot {
      margin: 0 11px;
      width: 4px;
      height: 4px;
      background: var(--color-121212);
      border-radius: 50%;
      display: inline-block;
      vertical-align: middle;
    }
    h2 {
      display: inline-block;
    }
    .order-received {
      font-weight: bold;
    }
    .status-time {
      color: var(--color-5fa452);
      font-weight: bold;
    }
    .gift-card-received-box {
      &:not(.is-group) {
        .order-received {
          font-weight: normal;
        }
      }
      .status-time {
        font-weight: normal;
        text-transform: capitalize;
      }
    }
    .track-shipment {
      color: @theme-color;
      margin-left: 11px;
      text-decoration: underline;
    }
  }
  .status-tracking-no {
    a {
      color: var(--color-121212);
      text-decoration: underline;
    }
  }
  .progress-box {
    // margin: 45px auto 103px - 50px - 17px;
    margin: 60px auto (60px + (31px - 28px + 18px)) - 17px;
    width: 988px;
  }
  .product-list {
    border-bottom: solid 1px var(--color-121212);
  }
}
</style>
