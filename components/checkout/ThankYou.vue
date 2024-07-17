<template>
  <!-- 由于订单成功页面情况比较多，跟M站分类不一样，列出区别 -->
  <!--
      1.拆单（!allPaid）和不拆单的标题不一样
      2.拆单的订单列表前面，不管支付成功或失败都会有 成功或失败的icon图标
      3.不拆单的订单列表前面，始终没有icon图标
      4.只有拆单订单才会有订单商品列表
      5.只有拆单订单才会有 getTime
      6.样衣购买订单（purchaseSamples）和正常订单标题不同
     -->
  <div id="thank_you" class="thank-you">
    <div v-if="!allPaid" class="order-dec">
      <div class="psuc-title">{{ nl('page_checkout_order_not_complete_yet') }}</div>
      <h2 class="psuc-sub-title">
        {{ nl('page_checkout_issue_processing_payment_Order') }}
        <span v-for="(unpaidItem, index) in unpaidOrders" :key="index" class="order-list">
          <a @click="junpToOrder(unpaidItem)" class="self_order_jump">
            {{ unpaidItem }}
          </a>
          <span v-if="Object.keys(unpaidOrders).length - 1 == index">.</span>
          <span v-else>,</span>
        </span>
        <span>{{ nl('page_checkout_issue_Order_checkout_again') }}</span>
      </h2>
    </div>
    <div v-else-if="purchaseSamples" class="order-dec">
      <div class="psuc-title">{{ nl('page_checkout_success_thank_samples') }}</div>
    </div>
    <template v-else>
      <div class="order-dec only-thank">
        <div class="psuc-title"><az-icon icon-class="icon-all_tick"></az-icon>{{ nl('page_checkout_success_thank') }}</div>
      </div>
      <p class="sent-to">
        {{ nl('page_checkout_email_sent_to_XX') }} <span>{{ userInfoEmail }}</span>
      </p>
      <div class="order-no-time">
        <span v-clipboard:copy="orderSns" v-clipboard:success="onCopySuccess" v-clipboard:error="onCopyError" class="order-no">
          {{ nl('page_common_order_no') }} {{ orderSns }} <az-icon icon-class="iconicon-copy" class="copy-icon"></az-icon>
        </span>
        <span class="order-time">{{ orderInfo.lastGetTime || '' }}</span>
      </div>
    </template>
    <az-button v-track.view.click="{ common: getBiCommon() }" @click="toOrderDetails" class="btn btn-success">
      {{ nl('page_checkout_success_order_detail') }}
    </az-button>
    <!-- <template v-if="false">
      <div v-for="(orderV, orderKey) in orderInfoList" :key="orderKey" class="group-order">
        <h2>
          <template v-if="isGroup && !allPaid">
            <img
              v-if="unpaidOrders.includes(orderV.orderSn)"
              :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/be/6c/8d0c953b6a9c3ebd50161c4d76a1be6c.png')"
              class="icon-warning order-status-icon"
              alt="error"
            />
            <img
              v-else
              :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/6c/22/5a4230d61cf3c2a55cba8ca9a6fc6c22.png')"
              class="icon-success order-status-icon"
              alt="success"
            />
          </template>
          <span>{{ nl('page_checkout_success_order_num') }} #{{ orderV.orderSn }}</span>
          <em class="pay-dot"></em>
          <span>{{ orderV.orderTime | formartYYMMDD(orderV.orderTime) }}</span>
          <em class="pay-dot"></em>
          <span>{{ orderV.onlyGiftCard ? `${nl('page_gift_card_order_delivery_date')}: ` : nl('page_checkout_success_order_rec') }} </span>
          <span v-if="!purchaseSamples" :class="{ 'is-gift-card': orderV.onlyGiftCard }" class="time">{{
            orderV.onlyGiftCard ? orderV.giftCard && showGiftCardDate(orderV.giftCard.deliveryDate) : orderV.lastGetTime
          }}</span>
        </h2>
        <template v-if="isGroup">
          <ul>
            <li
              v-for="(goodsItem, index) in orderInfoGoodsList[orderV.orderId]"
              :key="index"
              :data-order-id="orderV.orderId"
              class="disc-type"
            >
              <p>
                {{ goodsItem.shownGoodsName }}
                <template v-if="goodsItem.dressType == 'clearance'">({{ nl('page_bread_crumb_ready_to_ship') }})</template>
                <template v-if="goodsItem.dressType == 'outlet'">({{ nl('page_bread_crumb_outlet') }})</template>
              </p>
            </li>
          </ul>
        </template>
      </div>
    </template> -->

    <!-- <p v-if="purchaseSamples" style="margin-top: 20px;font-size: 13px;">
      {{ nl('page_samples_order_checkout_success_confirm_note') }}
    </p>
    <p v-else-if="allPaid" style="margin-top: 20px;font-size: 13px;">
      {{ nl('page_checkout_success_confirm_note') }}
    </p> -->
    <!-- <p v-if="!purchaseSamples && !isCouponSwatch && !orderInfo.onlyGiftCard" class="email_sent_tips2">
      {{ nl('page_checkout_update_shipping_address') }}
      &nbsp;<a :href="countryUrl('/order/list')" target="_blank">{{ nl('page_common_my_orders') }}</a
      >.&nbsp;
      <span v-html="nl('page_checkout_email_sent_tips2_dec')"></span>
    </p> -->
    <!-- <p v-show="!orderDetailShow && !isCouponSwatch" @click="showOrderDetail" class="show-order-detail">
      <span>{{ nl('page_checkout_show_order_details') }}</span>
    </p> -->
    <az-toast ref="toast" :message="toastMsg" :duration="3000"></az-toast>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AzButton from '@/components/az-ui/Button/AzButton'
import AzToast from '@/components/az-ui/AzToast'

export default {
  name: 'ThankYou',
  components: {
    AzButton,
    AzToast
  },
  languageKeys: [
    'page_checkout_order_not_complete_yet',
    'page_checkout_issue_processing_payment_Order',
    'page_checkout_issue_Order_checkout_again',
    'page_checkout_success_thank_samples',
    'page_checkout_success_thank',
    'page_checkout_success_order_num',
    'page_gift_card_order_delivery_date',
    'page_checkout_success_order_rec',
    'page_bread_crumb_ready_to_ship',
    'page_bread_crumb_outlet',
    'page_samples_order_checkout_success_confirm_note',
    'page_checkout_success_confirm_note',
    'page_checkout_update_shipping_address',
    'page_common_my_orders',
    'page_checkout_email_sent_tips2_dec',
    'page_checkout_show_order_details',
    'page_common_today',
    'page_checkout_success_order_detail',
    'page_checkout_email_sent_to_XX',
    'page_common_order_no',
    'page_common_copied'
  ],
  filters: {
    formartYYMMDD: (val) => {
      const date = new Date(val)
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      const nowDate = day + '/' + month + '/' + year
      return nowDate
    }
  },
  props: {
    unpaidOrders: {
      type: Array,
      default: () => {
        return []
      }
    },
    orderDetailShow: {
      type: Boolean,
      default: false
    },
    purchaseSamples: {
      type: Boolean,
      default: false
    },
    shippingInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      toastMsg: ''
    }
  },
  computed: {
    ...mapState('checkout', ['orderInfo', 'orderGoodsList', 'orderInfoList', 'orderInfoGoodsList', 'isGroup', 'allPaid']),
    orderSns() {
      let res = this.orderInfoList.map((ele) => {
        return ele.orderSn
      })
      if (res && res.length) res = res.join(', ')
      return res
    }
  },
  mounted() {
    if (!this.orderDetailShow) {
      this.setDataLayer({
        category: 'FurtherGuestCheckout',
        action: 'view',
        label: 'OrderComplete_SeeMoreDetails_View'
      })
    }
  },
  methods: {
    getBiCommon() {
      return {
        ec: 'ordersuccess',
        el: 'orderdetail',
        msg: JSON.stringify({
          order_id: this.orderInfo.orderSn
        })
      }
    },
    // 进入订单详情
    toOrderDetails() {
      location.href = this.countryUrl(`/order/detail?order_sn=${this.orderInfo.orderSn}`)
    },
    onCopySuccess() {
      this.toastMsg = this.nl('page_common_copied')
      this.$refs.toast.show()
    },
    onCopyError() {
      this.toastMsg = this.nl('page_common_share_copy_failed')
      this.$refs.toast.show()
    },
    showOrderDetail() {
      this.$emit('showOrderDetail')
      this.setDataLayer({
        category: 'FurtherGuestCheckout',
        action: 'click',
        label: 'OrderComplete_SeeMoreDetails_Click'
      })
    },
    junpToOrder(order) {
      this.$emit('junpToOrder', order)
    },
    showGiftCardDate(date) {
      if (!date) return ''
      const isToday = this.$dayjs(date).isSame(this.$dayjs(), 'day')
      if (isToday) {
        return this.nl('page_common_today')
      }
      return this.$dayjs(date).format('MM/DD/YYYY')
    }
  }
}
</script>

<style lang="less" scoped>
.thank-you {
  width: 680px;
  .only-thank {
    .az-icon {
      font-size: 20px;
      margin-right: 10px;
      fill: #37926b;
    }
    .psuc-title {
      font-size: 24px;
      font-family: @font-family-500;
      margin-bottom: 15px;
      line-height: normal;
      display: flex;
      align-items: center;
    }
  }
  .order-no-time {
    font-size: 16px;
    font-family: @font-family-600;
    margin-bottom: 30px;
    display: flex;
    flex-wrap: wrap;
    .order-no {
      cursor: pointer;
      margin-right: 5px;
      word-wrap: break-word;
      display: inline-block;
      text-align: left;
      width: 100%;
    }
    .copy-icon {
      font-size: 14px;
    }
    .order-time {
      color: var(--color-5fa452);
    }
  }
  .sent-to {
    font-size: 16px;
    margin-bottom: 15px;
    span {
      font-family: @font-family-600;
    }
  }
  .psuc-title {
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 22px;
    font-family: @font-family-600;
    text-transform: uppercase;
  }
  .psuc-sub-title {
    width: 660px;
    margin-bottom: 22px;
    font-size: 13px;
    border: none;
    a {
      color: var(--color-121212);
      text-decoration: underline;
    }
  }
  .order-status-icon {
    display: inline-block;
    vertical-align: top;
    margin: 2px 0 0 3px;
    width: 15px;
    height: 15px;
  }
  .group-order {
    font-size: 13px;
    font-family: @font-family-600;
    ul {
      margin-bottom: 12px;
      margin-left: 24px;
      margin-top: 7px;
      li {
        margin-bottom: 3px;
        list-style-type: disc;
      }
    }
  }
  .pay-dot {
    display: inline-block;
    vertical-align: middle;
    margin: 0 11px 2px 14px;
    width: 4px;
    height: 4px;
    background: url('~assets/images/a_sprite_l_20190128.png') -302px 0;
  }
  .time {
    color: var(--color-5fa452);
    &.is-gift-card {
      text-transform: capitalize;
    }
  }
  .email_sent_tips2 {
    margin-top: 5px;

    /deep/a {
      color: @theme;
      text-decoration: underline;
    }
  }
  .show-order-detail {
    color: var(--color-121212);
    text-decoration: underline;
    vertical-align: bottom;
    position: relative;
    top: 30px;
    cursor: pointer;
  }
}
</style>
