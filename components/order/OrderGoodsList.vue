<template>
  <div id="write_a_review" class="order-items-block order-b">
    <div v-if="fromTrackingPage" class="order_info_title">{{ nl('page_tracking_shipment_items') }}</div>
    <div v-else class="order_info_title">
      {{ orderGoodsQty }}&nbsp;{{ nl('page_order_item_ordered') }}
      <div v-if="orderInfo.party && orderInfo.party.name" :class="{ expired: orderInfo.party.disable }" class="party_select_div">
        <span class="separate_line"></span>
        {{ orderInfo.party.name }}({{ orderInfo.party.value }}) {{ nl('page_party_select_desc') }}
        <template v-if="orderInfo.party.disable">({{ nl('page_common_expired') }})</template>
      </div>
    </div>

    <div class="product-list">
      <!--  buy more save more -->
      <div v-for="(bundleListItem, bundleListIndex) in fillGoodsBundleList" :key="bundleListIndex" class="bundle-prod-list">
        <BundleListHeader :bundleListItem="bundleListItem">
          <pay-product-list-item
            v-for="(productItem, index) in bundleListItem.goodsList"
            :key="index"
            :productItem="productItem"
            :isMyOrder="isMyOrder"
            :isSamplePurchaseOrder="orderInfo.isSamplePurchaseOrder"
            :isNewReturnMethod="returnMethodData.isNewReturnMethod"
            :fromTrackingPage="fromTrackingPage"
            :showGetTime="orderInfo.orderStatus != 2 && isGroup && isAllUnpaid"
          ></pay-product-list-item>
        </BundleListHeader>
      </div>
      <pay-product-list-item
        v-for="(productItem, index) in orderGoods"
        :key="index"
        :productItem="productItem"
        :isMyOrder="isMyOrder"
        :isSamplePurchaseOrder="orderInfo.isSamplePurchaseOrder"
        :isNewReturnMethod="returnMethodData.isNewReturnMethod"
        :fromTrackingPage="fromTrackingPage"
        :showGetTime="orderInfo.orderStatus != 2 && isGroup && isAllUnpaid"
      ></pay-product-list-item>
    </div>

    <div v-if="showGroup || (!showGroup && orderInfo.payStatus == 2)" class="order-summary-block">
      <!-- 如果是拆单并且部分支付成功部分支付失败的情况下， 下面这个模块使用 orderInfo.paidInfo 的信息，表示支付成功的所有订单的金额信息 -->
      <!--  paidInfo 里面是没有countryCode字段的，所以这里需要额外传一个orderInfo.countryCode的过去-->
      <order-summary
        :orderInfo="isPaidAndUnpaid && orderInfo.paidInfo ? orderInfo.paidInfo : orderInfo"
        :isPaidAndUnpaid="isPaidAndUnpaid"
        :countryCode="orderInfo.countryCode"
      ></order-summary>
    </div>
  </div>
</template>

<script>
import PayProductListItem from '@/components/checkout/PayProductListItem'
import OrderSummary from '@/components/order/OrderSummary'
import BundleListHeader from '@/components/cart/BundleListHeader'

import { mapState } from 'vuex'
export default {
  name: 'OrderGoodsList',
  components: { PayProductListItem, OrderSummary, BundleListHeader },
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
    showGroup: {
      // 是否按拆单展示
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
    },
    isPaidAndUnpaid: {
      type: Boolean,
      default: false
    },
    isGroup: {
      // 是否拆单
      type: Boolean,
      default: false
    },
    isAllUnpaid: {
      // 是否全部未支付
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('checkout', ['fillGoodsBundleList']),
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
    },
    orderGoodsQty({ fillGoodsBundleList }) {
      // bundle 商品
      let tempList = []
      if (fillGoodsBundleList && Array.isArray(fillGoodsBundleList) && fillGoodsBundleList.length) {
        fillGoodsBundleList.forEach((item) => {
          tempList.push(...item.goodsList)
        })
      }
      // 加上普通商品
      tempList = tempList.concat(this.orderGoods)
      // 再计算每一个商品的数量之和
      let qty = 0
      tempList.forEach((item) => {
        qty += item.goodsNumber * 1
      })
      return qty
    }
  }
}
</script>

<style lang="less" scoped>
.bundle-prod-list {
  margin-top: 20px;
  /deep/ .pay-product-list-item {
    border-top: 1px solid var(--color-121212);
  }
}
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

  .order-summary-block {
    width: 270px;
    background: var(--color-f9f9f9);
    margin-left: auto;
    padding: 15px;
    margin-right: 15px;
    margin-bottom: 15px;
    margin-top: 15px;
  }

  /deep/ .product-list {
    padding: 0 15px;
    .pay-product-list-order-item {
      border-top: none;
      border-bottom: 1px solid var(--color-eeeeee);
      padding: 15px 0;
      &:last-child {
        border-bottom: none;
      }
    }
    .td-title h4 {
      font-weight: normal;
    }
    .td-desc {
      line-height: 21px;
      vertical-align: top;
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
