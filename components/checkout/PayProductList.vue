<template>
  <div class="pay-product-list">
    <hollow-out-title :title="`ORDER ${orderItemInfo.orderSn}`" v-if="!allPaid && isForOrder" class="mb-15"></hollow-out-title>
    <div v-else class="product-list-title">
      <h2 :class="{ 'is-for-order-h2': isForOrder }">
        {{ nl('page_common_items') }} (<span>{{ orderGoodsQty }}</span
        >)
        <span v-if="orderInfo.party && orderInfo.party.selected" class="party_select_h2_span">
          <div class="party_select_div">
            <span :class="{ expired: orderInfo.party.disabled }" class="separate_line">
              &nbsp;&nbsp;{{ orderInfo.party.name }}({{ orderInfo.party.value }}) {{ nl('page_party_select_desc').toUpperCase() }}
              <template v-if="orderInfo.party.disabled">(Expired)</template></span
            >
          </div>
        </span>
        <!-- buy now party -->
        <span v-else-if="selectedParty && selectedParty != 1" class="party_select_h2_span">
          <div class="party_select_div">
            <span :class="{ expired: selectedParty.disabled }" class="separate_line">
              &nbsp;&nbsp;{{ selectedParty.name }}({{ selectedParty.value }}) {{ nl('page_party_select_desc').toUpperCase() }}
              <template v-if="selectedParty.disabled">(Expired)</template></span
            >
          </div>
        </span>
      </h2>
    </div>
    <!--  buy more save more -->
    <div v-for="(bundleListItem, bundleListIndex) in fillGoodsBundleList" :key="bundleListIndex" class="bundle-prod-list">
      <BundleListHeader :bundleListItem="bundleListItem">
        <pay-product-list-item
          v-for="productItem in bundleListItem.goodsList"
          :key="productItem.recId"
          :productItem="productItem"
          :purchaseSamples="purchaseSamples"
        ></pay-product-list-item>
      </BundleListHeader>
    </div>
    <div class="product-list">
      <pay-product-list-item
        v-for="productItem in payProductList"
        :key="productItem.recId"
        :productItem="productItem"
        :purchaseSamples="purchaseSamples"
      ></pay-product-list-item>
      <p v-if="!isForOrder" style="color: #888888;float: right;margin-top: 6px">
        <az-icon icon-class="icon-SSLSecureCheckout" class="icon-ssl" />{{ nl('page_checkout_ssl_note') }}
      </p>
    </div>
  </div>
</template>

<script>
import payProductListItem from '@/components/checkout/PayProductListItem'
import HollowOutTitle from '@/components/checkout/HollowOutTitle'
import BundleListHeader from '@/components/cart/BundleListHeader'

import { mapState } from 'vuex'

export default {
  name: 'PayproductList',
  components: {
    payProductListItem,
    HollowOutTitle,
    BundleListHeader
  },
  props: {
    payProductList: {
      type: Array,
      default: () => {
        return []
      }
    },
    isForOrder: {
      type: Boolean,
      default: false
    },
    orderItemInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    purchaseSamples: {
      type: Boolean,
      default: false
    },
    isSwatchRedelivery: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('checkout', ['checkoutSummary', 'orderInfo', 'allPaid', 'buyNowData', 'fillGoodsBundleList']),
    ...mapState('cart', ['selectedParty']),
    orderGoodsQty() {
      if (this.isForOrder) {
        return this.orderInfo.goodsQty
      } else {
        return this.checkoutSummary.goodsQty
      }
    }
  },
  mounted() {
    // this.trackPurchase({ style_ids: this.payProductList, value: this.orderInfo.goodsAmount })
  },
  methods: {
    hrefPoint() {
      this.buryPoint(this, 'event', {
        ec: 'items',
        el: 'goods',
        ea: 'click'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.pay-product-list {
  min-height: 220px;
  clear: left;
  width: 100%;
  margin-top: 60px;
  // overflow: hidden;
  .product-list-title {
    color: var(--color-121212);
    text-transform: uppercase;
    h2 {
      background: none;
      padding-bottom: 5px;
      border-bottom: solid 1px #ccc;
      font-weight: 600;
      &.is-for-order-h2 {
        font-size: 13px;
        // border: none;
        padding: 6px 0 8px;
      }
    }
    .party_select_h2_span {
      text-transform: capitalize;
    }
    .party_select_div {
      display: inline-block;
      text-transform: capitalize;
    }
    .separate_line {
      color: var(--color-121212);
      font-family: @font-family-600, sans-serif;
      text-transform: none;
      font-weight: normal;
      font-size: 13px;
      display: inline-block;
      margin-left: 5px;
      border-left: 1px solid var(--color-666666);
      padding-right: 2px;
      height: 12px;
      line-height: 12px;
      &.expired {
        color: gray;
      }
    }
  }
  .product-list {
    font-size: 13px;
    margin-top: -1px;
    // border-top: 1px solid #ccc;
    .icon-ssl {
      margin-right: 5px;
      width: 12px;
      height: 13px;
    }
  }
  #btn-change-prd {
    color: var(--color-121212);
    float: right;
    font-size: 13px;
    text-transform: capitalize;
    text-decoration: underline;
    &:hover {
      color: @theme-color;
    }
  }
  .bundle-prod-list {
    margin-top: 20px;
    /deep/ .pay-product-list-item {
      border-top: 1px solid var(--color-121212);
      border-bottom: none;
      &:nth-child(1) {
        border: none;
      }
    }
  }
}
</style>
