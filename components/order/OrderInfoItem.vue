<template>
  <div class="order-b order-info-item">
    <div v-if="showGroup" class="order_info_title">
      <div>{{ nl('page_order_package') }}&nbsp;{{ orderInfoItem.packageNumber }}</div>
      <div v-clipboard:copy="orderInfoItem.orderSn" v-clipboard:success="onCopySuccess" v-clipboard:error="onCopyError" class="desc">
        {{ nl('page_common_order_no') }}
        {{ orderInfoItem.orderSn }}
        <span>
          <az-icon icon-class="iconicon-copy" class="copy-icon"></az-icon>
        </span>
      </div>
      <div @mouseenter="showGoods = true" @mouseleave="showGoods = false" class="item-box">
        <div>
          {{ goodsQuantity }}
          &nbsp;{{ nl('page_common_items') }}
          <az-icon class="q-icon" icon-class="icon-gwc-_question_"></az-icon>
        </div>
        <client-only>
          <order-info-item-goods
            :showGoods="showGoods"
            :goodsList="orderItemGoodsList"
            :showGetTime="orderInfoItem.orderStatus != 2 && isGroup && isAllUnpaid"
          ></order-info-item-goods>
        </client-only>
      </div>
    </div>
    <div v-else class="order_info_title">{{ nl('page_common_order_no') }}&nbsp;{{ orderInfoItem.orderSn }}</div>
    <div class="order-info-item-body">
      <div class="order-info-item-content">
        <!-- 左侧订单状态 -->
        <div class="order-info-item-left">
          <div v-if="orderInfoItem.statusInfo" class="status-info">
            <div class="status-desc">
              <div v-html="orderInfoItem.statusInfo.title" class="status-desc-title"></div>
              <div v-html="orderInfoItem.statusInfo.progressDesc" class="status-desc-txt"></div>
            </div>
            <!-- 时间 -->
            <!-- 拆单且全部未支付的时候这里不展示时间交期，买断订单也不展示 -->
            <div
              v-if="orderInfoItem.orderStatus != 2 && !(isGroup && isAllUnpaid) && !orderInfoItem.isSamplePurchaseOrder"
              class="status-time"
            >
              <!-- delevied 特殊处理 -->
              <template v-if="orderInfoItem.shippingStatus == 2 && orderInfoItem.actionInfo && orderInfoItem.actionInfo.shippingSigned">
                <span class="time">
                  {{ orderInfoItem.statusInfo && orderInfoItem.statusInfo.progressTxt }}
                </span>
              </template>
              <!-- gift card 订单详情页特殊展示 -->
              <template v-else-if="orderInfoItem.onlyGiftCard">
                <span class="time-desc">{{ nl('page_gift_card_order_delivery_date') }}:</span>
                <span class="time">{{ orderInfoItem.giftCard ? showGiftCardDate(orderInfoItem.giftCard.deliveryDate) : '' }}</span>
              </template>
              <template v-else>
                <span class="time">
                  {{ orderInfoItem.lastGetTime }} {{ orderInfoItem.rushFee * 1 > 0 ? '(' + nl('page_order_rushed') + ')' : '' }}
                </span>
              </template>
            </div>

            <!--tracking order-->
            <div v-if="orderInfoItem.isNoTrackCarrier" class="order-tracking">
              <!--无物流轨迹订单-->
              <span v-if="orderInfoItem.statusInfo.statusCode !== 11" class="order-tracking-desc">{{
                nl('page_order_no_trackCarrier')
              }}</span>
            </div>
            <div v-else-if="orderInfoItem.trackingNumber && orderInfoItem.trackingUrl" class="order-tracking">
              <span class="order-tracking-desc">{{ nl('page_order_tracking_no') }}:</span>
              <a :href="orderInfoItem.trackingUrl" class="order-tracking-number">
                {{ orderInfoItem.trackingNumber }}
              </a>
            </div>
          </div>
        </div>

        <!-- 右侧订单金额模块 -->
        <div :class="{ 'no-order-summary': orderInfoItem.payStatus == 2 }" class="order-info-item-right">
          <!-- 只有在支付失败的情况下才展示金额 -->
          <order-summary :orderInfo="orderInfoItem" v-if="orderInfoItem.payStatus != 2" class="pay-summary-block"></order-summary>
          <div class="order-option">
            <!-- 订单未支付的情况 -->
            <template v-if="orderInfoItem.payStatus != 2">
              <!-- oxxo 支付倒计时 -->
              <a
                :id="orderInfoItem.orderSn"
                v-if="isOxxoPayPrepare"
                :href="countryUrl(`/order/invoice_detail?order_sn=${orderInfoItem.orderSn}`)"
                target="_blank"
                class="continue-checkout"
              >
                <az-button :needIcon="false" :disabled="!orderInfoItem.available" class="btn btn-default order-option-btn">
                  {{ nl('page_order_btn_invoice') }}
                </az-button>
                <div class="status-count-down-desc">{{ nl('page_order_oxxo_count_down_tip') }}</div>
                <div class="status-count-down theme-color">
                  <az-count-down :isOrderItem="true" :endTime="orderInfoItem.paymentExtension.paymentExpiredDate"></az-count-down>
                  <span class="after">
                    <span class="order_desc">
                      {{ nl('page_order_oxxo_count_down_tips') }}
                    </span>
                  </span>
                </div>
              </a>
              <!-- continue -->
              <a
                :id="orderInfoItem.orderSn"
                v-else-if="orderInfoItem.continueCheckout"
                :href="
                  orderInfoItem.available
                    ? countryUrl(
                        `/checkout?order_sn=${orderInfoItem.orderSn}&order_country_code=${orderInfoItem.countryCode}${
                          isBridal ? '&subsite=bridal' : ''
                        }`
                      )
                    : `javascript:;`
                "
                class="continue-checkout"
              >
                <az-button :needIcon="false" :disabled="!orderInfoItem.available" class="btn btn-default order-option-btn">
                  {{ nl('page_common_continue_checkout') }}
                </az-button>
              </a>
            </template>
            <a
              v-if="!orderInfoItem.isNoTrackCarrier && orderInfoItem.trackShipmentable && orderInfoItem.statusInfo.statusCode === 6"
              :href="`/pages/tracking?tracking=${orderInfoItem.trackingNumber}&order=${orderInfoItem.orderSn}`"
              v-track.view.click="getBiCommonParams('trackshipment', 'button')"
              class="track-shipment"
            >
              <az-button :needIcon="false" class="btn btn-default order-option-btn">
                {{ nl('page_tracking_track_shipment') }}
              </az-button>
            </a>
            <a
              v-if="orderInfoItem.samplePurchasable"
              :href="orderInfoItem.samplePurchaseUrl + '&order_country_code=' + orderInfoItem.countryCode"
              v-track.view.click="getBiCommonParams('myorder', 'sample_purchase')"
              class="sample-purchase"
            >
              <az-button
                :needIcon="false"
                :class="{
                  'btn-default':
                    orderInfoItem.statusInfo.statusCode === 11 || !(!orderInfoItem.isNoTrackCarrier && orderInfoItem.trackShipmentable),
                  'btn-hollow':
                    orderInfoItem.statusInfo.statusCode === 6 && !orderInfoItem.isNoTrackCarrier && orderInfoItem.trackShipmentable
                }"
                class="btn order-option-btn"
              >
                {{ nl('page_order_purchase_samples') }}
              </az-button>
            </a>
            <!-- 订单详情页 Track Shipment的按钮，点击跳转物流落地页 -->
            <a
              v-if="!orderInfoItem.isNoTrackCarrier && orderInfoItem.trackShipmentable && orderInfoItem.statusInfo.statusCode === 11"
              :href="`/pages/tracking?tracking=${orderInfoItem.trackingNumber}&order=${orderInfoItem.orderSn}`"
              v-track.view.click="getBiCommonParams('trackshipment', 'button')"
              class="track-shipment"
            >
              <az-button
                :needIcon="false"
                :class="orderInfoItem.samplePurchasable ? 'btn-hollow' : 'btn-default'"
                class="btn order-option-btn"
              >
                {{ nl('page_tracking_track_shipment') }}
              </az-button>
            </a>
          </div>
        </div>
      </div>
      <!-- 进度条，已支付的订单才会展示 -->
      <!-- payStatus: 0 未支付   1 支付中 oxxo   2 已支付 -->
      <!-- orderStatus:  2 订单取消 -->
      <!-- 买断订单不展示物流进度 -->
      <div
        v-if="orderInfoItem.orderStatus != 2 && orderInfoItem.payStatus == 2 && !orderInfoItem.isSamplePurchaseOrder"
        class="order-info-item-progress"
      >
        <order-status-progress :statusInfo="orderInfoItem.statusInfo"></order-status-progress>
      </div>
    </div>
  </div>
</template>

<script>
import OrderStatusProgress from '@/components/order/OrderStatusProgress'
import OrderInfoItemGoods from '@/components/order/OrderInfoItemGoods'
import OrderSummary from '@/components/order/OrderSummary'
import AzButton from '@/components/az-ui/Button/AzButton'
import AzCountDown from '@/components/az-ui/AzCountDown'
export default {
  name: 'OrderInfoItem',
  components: { OrderStatusProgress, OrderSummary, OrderInfoItemGoods, AzButton, AzCountDown },
  props: {
    isGroup: {
      // 是否拆单
      type: Boolean,
      default: false
    },
    showGroup: {
      // 是否按拆单展示
      type: Boolean,
      default: false
    },
    statusTitle: {
      type: String,
      default: ''
    },
    orderInfoItem: {
      // 单个订单信息
      type: Object,
      default() {
        return {}
      }
    },
    orderItemGoodsList: {
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
    orderSummaryInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    isAllUnpaid: {
      // 是否全部未支付
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showGoods: false
    }
  },
  computed: {
    // 当前应该展示的国家，如果有订单国家code，取订单国家code，否则就是country
    currentCountry() {
      const res = (this.orderInfoItem && this.orderInfoItem.countryCode) || this.$route.query.order_country_code || this.country
      return res
    },
    isOxxoPayPrepare() {
      return (
        this.orderInfoItem.paymentExtension &&
        this.orderInfoItem.paymentExtension.hasOwnProperty('ticketPayCodeIsExpired') &&
        !this.orderInfoItem.paymentExtension.ticketPayCodeIsExpired
      )
    },
    goodsQuantity({ orderItemGoodsList }) {
      return orderItemGoodsList.reduce((pre, cur) => {
        return pre + cur.goodsNumber
      }, 0)
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
    },
    showGiftCardDate(date) {
      if (!date) return ''
      const isToday = this.$dayjs(date).isSame(this.$dayjs(), 'day')
      if (isToday) {
        return this.nl('page_common_today')
      }
      return this.$dayjs(date).format('MM/DD/YYYY')
    },
    onCopySuccess() {
      this.$emit('onCopySuccess')
    },
    onCopyError() {
      this.$emit('onCopyError')
    }
  }
}
</script>

<style lang="less" scoped>
.order_info_title {
  display: flex;
  .desc {
    font-size: 13px;
    color: #999;
    margin-left: 10px;
    text-transform: capitalize;
    cursor: pointer;
    .copy-icon {
      cursor: pointer;
      fill: #999;
      color: currentColor;
    }
  }
  .item-box {
    margin-left: auto;
    font-size: 13px;
    color: var(--color-121212);
    font-family: @font-family-500;
    text-transform: lowercase;
    position: relative;
    .q-icon {
      font-size: 12px;
      margin-left: 5px;
    }
  }
}
.order-info-item-body {
  padding: 15px;
  .order-info-item-content {
    display: flex;
    .order-info-item-left {
      flex: 1;
      margin-right: 30px;
    }
    .order-info-item-right {
      width: 240px;
      &.no-order-summary {
        display: flex;
        align-items: flex-end;
      }
    }
    .status-info {
      .status-desc {
        .status-desc-title {
          font-size: 16px;
          line-height: 22px;
          text-transform: uppercase;
          color: var(--color-121212);
          font-family: @font-family-600;
        }
        .status-desc-txt {
          font-size: 13px;
          line-height: 18px;
          margin-top: 10px;
          color: var(--color-121212);
        }
      }
      .status-time {
        margin-top: 10px;
        .time-desc {
          font-family: @font-family-600;
        }
        .time {
          color: var(--color-5fa452);
          font-size: 13px;
          line-height: 18px;
          margin-top: 10px;
        }
      }
      .order-tracking {
        color: var(--color-121212);
        font-size: 13px;
        line-height: 18px;
        margin-top: 10px;
        .order-tracking-desc {
        }
        .order-tracking-number {
          text-decoration: underline;
          color: var(--color-121212);
        }
      }
    }

    .order-option {
      margin-top: 10px;
      width: 240px;
      .track-shipment,
      .sample-purchase {
        width: 100%;
        display: block;
      }
      .sample-purchase {
        margin: 10px 0;
      }
      .order-option-btn {
        width: 100%;
      }
      .continue-checkout {
        width: 100%;
        .status-count-down-desc {
          text-align: center;
          color: var(--color-121212);
          margin-top: 5px;
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
      }
    }
  }

  .order-info-item-progress {
    margin-top: 15px;
    border-top: 1px solid #eee;
    // padding: 20px 0;
  }
}
</style>
