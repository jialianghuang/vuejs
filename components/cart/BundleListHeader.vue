<template>
  <div>
    <div class="bundle-list-header">
      <span class="desc">
        <TagBuyMoreSaveMore
          :nameEl="`${jsKey}_name`"
          :descEl="`${jsKey}_description`"
          :bundlePromotionInfo="bundleListItem"
          :questionClass="'icon-icon-question'"
        />
      </span>
      <a
        :href="countryUrl(bundleListItem.linkUrl)"
        v-track.view.click="{
          common: getCommonBiParams('buy_more_save_more', `${jsKey}_${isFull ? 'full' : 'not_full'}`)
        }"
        @click="setOrderSourceFlag('buy_more_save_more', true)"
        v-if="bundleListItem.cartTips && bundleListItem.linkUrl"
        class="btn-add-sample"
        >{{ bundleListItem.cartTips.replace('${moreNum}', bundleListItem.countProgress) }}</a
      >

      <p v-if="jsKey == 'cart' && bundleListItem.isMoreThanType" class="bundle-list-more-tip">{{ bundleListItem.moreThanTypeCartTips }}</p>
      <!-- #19865: 根据bundleTotalPriceShow 判断是否展示 subtotal -->
      <div
        v-if="bundleListItem.bundleTotalPriceShow"
        v-track.view.click="{
          common: getCommonBiParams('buy_more_save_more', `${jsKey}_${isFull ? 'full' : 'not_full'}`)
        }"
        @click="setOrderSourceFlag('buy_more_save_more', true)"
        class="buy-more-save-more-tips"
      >
        <span> {{ nl('page_common_subtotal') }}: </span>
        <!-- 
          关于bundle的价格，（右上角的划线价）：
          1.购物车，checkout : 
          是否划线价 ： 判断totalPrice是否等于totalNoDealPrice
          存在划线价：
            划线价：取值totalNoDealPriceDisplay
            最总价: 取值totalPriceDisplay
          不存在划线价： (#19865需求不展示了)
            取值totalNoDealPriceDisplay 

          2.订单成功，订单详情：
          是否划线价 ： 判断是否存在bundleTotalPriceShow
          存在划线价：
            划线价：取值totalNoDealPriceDisplay
            最终价：取值判断是否存在bundleTotalPriceShow
          不存在划线价：(#19865需求不展示了)
            取值totalNoDealPriceDisplay -->
        <template v-if="['cart', 'checkout'].includes($route.name)">
          <template v-if="bundleListItem.totalPrice !== bundleListItem.totalNoDealPrice">
            <template>
              <span class="total-price">{{ bundleListItem.totalPriceDisplay }}</span>
            </template>

            <span class="no-deal-total-price">{{ bundleListItem.totalNoDealPriceDisplay }}</span>
          </template>
          <!-- <span v-else class="price">{{ bundleListItem.totalNoDealPriceDisplay }}</span> -->
        </template>
        <template v-else>
          <template>
            <span class="total-price">{{ bundleListItem.bundleTotalPriceShow }}</span>
            <span class="no-deal-total-price">{{ bundleListItem.totalNoDealPriceDisplay }}</span>
          </template>
          <!-- <span v-else class="price">{{ bundleListItem.totalNoDealPriceDisplay }}</span> -->
        </template>

        <!-- #19865:  m和app 订单完成页，详情页也会展示 subtotal 旁边的问号价格明细，pc不展示，只有'cart', 'checkout'展示-->
        <DiscountPricePop
          v-if="bundleListItem.bundleTotalPriceShow && ['cart', 'checkout'].includes($route.name)"
          :ec="'shoppingbag'"
          :el="'bundle sale subtotal discount'"
          :bonusDetail="bundleListItem.bonusDetail"
          :questionIcon="'icon-icon-question'"
        />
      </div>
    </div>
    <div :class="jsKey" class="list-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import TagBuyMoreSaveMore from '@/components/product/TagBuyMoreSaveMore'
import DiscountPricePop from '@/components/cart/DiscountPricePop'
/**
 * bundle 商品列表统一头部
 * 打点：jsKey: cart、checkout、checkoutSuccess、OrderDetail
 *  */
export default {
  name: 'BundleListHeader',
  components: {
    TagBuyMoreSaveMore,
    DiscountPricePop
  },
  props: {
    bundleListItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isFull: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    getCommonBiParams(ec, el) {
      if (process.server) return
      const obj = {
        ec,
        el
      }
      return obj
    }
  }
}
</script>

<style lang="less" scoped>
.bundle-list-header {
  height: 40px;
  background-color: var(--color-121212);
  color: #fff;
  border: 2px solid var(--color-121212);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  /deep/ .tag-buy_more_save_more {
    background: var(--color-121212);
    color: #fff !important;
    span {
      font-size: 16px;
    }
  }
  .desc {
    color: #fff;
  }
  .buy-more-save-more-tips {
    font-size: 16px;
    margin-left: 20px;
    span {
      &.no-deal-total-price {
        text-decoration: line-through;
      }
      &.total-price,
      &.price {
        font-family: @font-family-600;
      }
    }
  }
}
.btn-add-sample {
  text-decoration-line: underline;
  color: #fff;
  margin-left: auto;
  font-size: 16px;
  font-family: @font-family-600;
  line-height: 40px;
}
.bundle-list-more-tip {
  color: #fff;
  margin-left: auto;
  font-size: 16px;
  font-family: @font-family-600;
  line-height: normal;
}
.list-body {
  border: 1px solid var(--color-121212);
  background: @bg-light-color;
  margin-bottom: 0px !important;
  padding: 0 30px !important;
  &.OrderDetail {
    border: none;
  }
  /deep/ input {
    background: @bg-light-color !important;
  }
  /deep/ .cat-product-item {
    border-top: 1px solid var(--color-121212);
    border-bottom: none;
    &:nth-child(1) {
      border: none;
    }
    .goods-price-block {
      margin-left: 17px !important;
    }
  }
  /deep/ .pay-product-list-item {
    .goods-info .goods-name {
      max-width: 318px !important;
    }
    .goods-price-block {
      right: 0;
      .goods-item-total-price,
      .goods-item-total-price-box {
        right: 0;
      }
    }
    .price strong {
      margin-left: -6px;
    }
  }
}
</style>
