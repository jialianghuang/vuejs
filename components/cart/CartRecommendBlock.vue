<template>
  <div :class="{ hide: isEmpty }" class="cart-recommend-block">
    <h2 class="recommend-desc">{{ nl('page_cart_recommend_desc') }}</h2>
    <div v-if="isEmpty" class="recommend-list-empty">
      <div v-for="index in emptyList" :key="index" class="item-block">
        <img :src="require('~/assets/images/cart/default_img.jpg')" alt="Azazie" />
        <div class="item_name">
          <div></div>
        </div>
        <div class="item_price">
          <div></div>
        </div>
      </div>
    </div>
    <div
      id="recommend-list"
      v-else
      v-track.view="{
        view: { ec: 'youmayalsolike', el: 'all', ea: 'view' }
      }"
      class="recommend-list"
    >
      <template v-if="recommendProducts && recommendProducts.prodList">
        <div
          v-for="(item, index) in recommendProducts.prodList"
          :title="item.shownGoodsName"
          :key="index"
          v-track.view.click="{ common: getBiParams(item, index) }"
          class="item-block goods-item"
        >
          <product-swiper-item
            :item="item"
            :index="index"
            :myStyle="myStyle"
            :fromDialog="fromDialog"
            @quickShop="showQuickShopDialog"
            :hasQuick="true"
            :isWrap="true"
            :hasQuickBtn="true"
            :from="'cartRecommend'"
          ></product-swiper-item>
        </div>
      </template>
      <AzSkeleton v-else :num="15" />
    </div>
  </div>
</template>

<script>
import ProductSwiperItem from '@/components/product/productSwiperItem'
import AzSkeleton from '@/components/az-ui/AzSkeleton'
export default {
  name: 'CartRecommendBlock',
  components: {
    ProductSwiperItem,
    AzSkeleton
  },
  props: {
    recommendProducts: {
      type: Object,
      default() {
        return {}
      }
    },
    fromDialog: {
      type: String,
      default: ''
    },
    validCheckoutGoodsList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      emptyList: [0, 1, 2, 3],
      myStyle: { width: '176px' },
      views: [],
      showNum: 5
    }
  },
  computed: {
    isEmpty() {
      return this.recommendProducts && this.recommendProducts.totalCount == 0
    }
  },
  methods: {
    getBiParams(item, index) {
      if (process.server) return
      const msg = {
        position: index,
        color: item.colorReal,
        goodsId: item.goodsId,
        cat_name: item.catName
      }
      return {
        ec: 'youmayalsolike',
        el: 'items',
        msg: JSON.stringify(msg)
      }
    },
    // 显示quick shop弹框
    showQuickShopDialog(params) {
      this.setDataLayer({
        action: 'click',
        category: 'PC_ShoppingCartRevision',
        label: 'ShoppingCart_Recommend_Click'
      })
      if (this.isSpecialCatId(params.catId)) {
        this.setDataLayer({
          action: 'click',
          category: 'Dress',
          label: 'Dress_QuickShop_Click'
        })
      }
      // 根据4947号需求
      if (params.need_point) {
        this.setDataLayer({
          action: 'click',
          category: 'CartRecommend',
          label: 'pc_CartRecommend_FaceMask_Click'
        })
      }
      this.$emit('quickShop', params)
    }
  }
}
</script>

<style lang="less" scoped>
.cart-recommend-block {
  margin: 0px auto 30px;
  .recommend-desc {
    padding: 30px 0 5px 0;
    font-family: @font-family-600, sans-serif;
    font-size: 16px;
    color: var(--color-121212);
    border-bottom: 1px solid #ccc;
  }
  .recommend-list-empty {
    display: flex;
    flex-wrap: wrap;
    margin: 3px 0 0;
    .item-block {
      width: 176px;
      margin-right: 15px !important;
      margin-top: 17px;
      display: inline-block;
      cursor: pointer;
      vertical-align: top;
      position: relative;
      .item_img {
        margin: 0;
        width: 176px;
        height: 241px;
      }
      .item_name {
        margin: 7px 0 1px;
        div {
          width: 90%;
          height: 20px;
          background-color: #f6f6f6;
          margin-left: 5%;
        }
      }
      .item_price {
        div {
          width: 40%;
          height: 20px;
          background-color: #f6f6f6;
          margin-left: 30%;
        }
      }
    }
    .item-block:nth-child(4n) {
      margin-right: 0 !important;
    }
    @media screen and (min-width: 1263px) {
      .item-block {
        flex: 1;
        min-width: 140px;
      }
      .item-block:nth-child(4n) {
        margin-right: 15px !important;
      }
      .item-block:nth-child(5n) {
        margin-right: 0 !important;
      }
    }
  }
  .recommend-list {
    display: flex;
    flex-wrap: wrap;
    margin: 3px 0 0;
    .item-block {
      flex: 1;
      min-width: 176px;
      margin-right: 15px !important;
      margin-top: 17px;
      display: inline-block;
      cursor: pointer;
      vertical-align: top;
      position: relative;
    }
    .item-block:nth-child(4n) {
      margin-right: 0 !important;
    }
    @media screen and (min-width: 1263px) {
      .item-block {
        flex: 1;
        min-width: 150px;
      }
      .item-block:nth-child(4n) {
        margin-right: 15px !important;
      }
      .item-block:nth-child(5n) {
        margin-right: 0 !important;
      }
    }
    @media screen and (max-width: 1155px) {
      .item-block {
        width: calc((100% - 30px) / 3);
        flex: unset;
        min-width: unset;
      }
      .item-block:nth-child(4n) {
        margin-right: 15px !important;
      }
      .item-block:nth-child(3n) {
        margin-right: 0 !important;
      }
    }
  }
}
</style>
