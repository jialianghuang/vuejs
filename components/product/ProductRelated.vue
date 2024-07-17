<template>
  <div id="product_related" class="product_related">
    <section :class="['product_related_tab_module', { 'hide-title': !isSodOrShoesAndbags }]">
      <div v-if="!isSodOrShoesAndbags" class="product_related-tabs">
        <p
          v-track.view.click="{ common: { ec: item.ec, el: item.el } }"
          v-for="(item, index) in tabs"
          :key="index"
          @click="cuurentTab = item.tab"
          :class="['tab-item', { active: cuurentTab == item.tab, big: tabs.length == 2 }]"
        >
          <span>{{ nl(item.title) }}</span>
        </p>
      </div>
      <template v-if="isSodOrShoesAndbags">
        <ProductModule key="mostpopular" v-bind="mostPoularBindValue" @quickShop="showQuickShopDialog" />
        <ProductModule key="youmayalsolike" v-bind="youLikeBindValue" @quickShop="showQuickShopDialog" />
      </template>
      <template v-else-if="isSwatchModule">
        <ProductModule key="bddress" v-if="cuurentTab == 0" v-bind="swatchesToDressBindValue" @quickShop="showQuickShopDialog" />
        <ProductModule key="mobdress" v-if="cuurentTab == 1" v-bind="swatchesToMobDressBindValue" @quickShop="showQuickShopDialog" />
      </template>
      <template v-else>
        <ProductModule key="youmayalsolike" v-if="cuurentTab == 0" v-bind="youLikeBindValue" @quickShop="showQuickShopDialog" />
        <ProductModule key="mostpopular" v-if="cuurentTab == 1" v-bind="mostPoularBindValue" @quickShop="showQuickShopDialog" />
      </template>
    </section>
  </div>
</template>

<script>
import ProductModule from '@/components/product/ProductModule'
import { mapState } from 'vuex'
export default {
  name: 'ProductRelated',
  languageKeys: [
    'page_common_you_may_also_like',
    'page_index_most_popular',
    'page_product_dresses_in_this_color',
    'page_commom_mob_in_color',
    'page_commom_bd_in_color',
    'page_product_dresses_in_this_fabric',
    'page_product_dresses_in_this_color_and_fabric',
    'page_commom_bd_in_color_and_fabric',
    'page_commom_mob_in_color_and_fabric',
    ...ProductModule.languageKeys
  ],
  components: {
    ProductModule
  },
  props: {
    youMayAlsoLikeList: {
      type: Array,
      default() {
        return []
      }
    },
    mostPopularList: {
      type: Array,
      default() {
        return []
      }
    },
    swatchesToDressList: {
      type: Array,
      default() {
        return []
      }
    },
    swatchesToMobDressList: {
      type: Array,
      default() {
        return []
      }
    },
    isSwatchModule: {
      // 是否是色卡或者色卡书以及布料
      type: Boolean,
      defaultl: false
    }
  },
  data() {
    return {
      viewArr: [],
      hasSet: false,
      cuurentTab: 0
    }
  },
  computed: {
    ...mapState({
      selectedColor: (state) => state.product.selectedColor,
      baseInfo: (state) => state.product.baseInfo
    }),
    ...mapState('product', ['alsoLikeCurScreens', 'mostPopularCurScreens']),
    mostPopularListInfo() {
      return this.mostPopularList.concat([])
    },
    youLikeBindValue({ youMayAlsoLikeList, baseInfo }) {
      return {
        moduleKey: 'youmayalsolike',
        list: youMayAlsoLikeList,
        title: 'page_common_you_may_also_like',
        swiperText: 'youLikeSwiper',
        fromText: 'youmayalsolike',
        moduleTitle: 'product_you_may_also_like'
      }
    },
    mostPoularBindValue({ mostPopularList }) {
      return {
        moduleKey: 'mostpopular',
        list: mostPopularList,
        title: 'page_index_most_popular',
        swiperText: 'mostpopularSwiper',
        fromText: 'mostpopular',
        moduleTitle: 'product_most_popular'
      }
    },
    swatchesToDressBindValue({ swatchesToDressList }) {
      return {
        moduleKey: 'designinthiscolorandfabric',
        list: swatchesToDressList,
        title: 'page_product_dresses_in_this_color',
        swiperText: 'designinthiscolorandfabricSwiper',
        fromText: 'designinthiscolorandfabric',
        moduleTitle: 'designinthiscolorandfabric',
        ec: 'designinthiscolorandfabric'
      }
    },
    swatchesToMobDressBindValue({ swatchesToMobDressList }) {
      return {
        moduleKey: 'designinthiscolorandfabric-mob',
        list: swatchesToMobDressList,
        title: 'page_commom_mob_in_color',
        swiperText: 'designinthiscolorandfabricmobSwiper',
        fromText: 'designinthiscolorandfabric',
        moduleTitle: 'designinthiscolorandfabric',
        ec: 'designinthiscolorandfabric',
        isMob: true
      }
    },
    tabs({ youMayAlsoLikeList, mostPopularList, swatchesToDressList, swatchesToMobDressList, baseInfo }) {
      let list = [
        {
          tab: 0,
          title: 'page_common_you_may_also_like',
          ec: 'youmayalsolike',
          el: 'youmayalsoliketab'
        },
        {
          tab: 1,
          title: 'page_index_most_popular',
          ec: 'mostpopular',
          el: 'mostpopulartab'
        }
      ]
      if (youMayAlsoLikeList.length == 0) {
        list.splice(0, 1)
      }
      if (mostPopularList.length == 0) {
        if (list.length > 1) {
          list.splice(1, 1)
        } else {
          list.splice(0, 1)
        }
      }
      if (this.isSwatchModule) {
        let title = ''
        if ([1000291, 1003269].includes(this.baseInfo.goodsId)) {
          // 色卡组合集
          title = swatchesToMobDressList.length ? 'page_commom_bd_in_color' : 'page_product_dresses_in_this_color'
        } else if (this.baseInfo.isSwatchBooklet) {
          // 色卡书
          title = 'page_product_dresses_in_this_fabric'
        } else if (this.baseInfo.catId == 36) {
          // 布料
          title = 'page_product_dresses_in_this_color_and_fabric'
        } else {
          // 单片色卡
          title = 'page_product_dresses_in_this_color_and_fabric'
        }
        const bdText = {
          [baseInfo.goodsId]: {
            bd: title,
            mob: title
          },
          1000291: {
            bd: 'page_commom_bd_in_color',
            mob: 'page_commom_mob_in_color'
          },
          1003269: {
            bd: 'page_commom_bd_in_color_and_fabric',
            mob: 'page_commom_mob_in_color_and_fabric'
          }
        }
        list = [
          {
            tab: 0,
            title: bdText[this.baseInfo.goodsId] && bdText[this.baseInfo.goodsId].bd,
            ec: 'designinthiscolorandfabric',
            el: 'bdtab'
          },
          {
            tab: 1,
            title: bdText[this.baseInfo.goodsId] && bdText[this.baseInfo.goodsId].mob,
            ec: 'designinthiscolorandfabric',
            el: 'mobtab'
          }
        ]
        if (swatchesToDressList.length == 0) {
          list.splice(0, 1)
        }
        if (swatchesToMobDressList.length == 0) {
          if (list.length > 1) {
            list.splice(1, 1)
          } else {
            list.splice(0, 1)
          }
        }
      }
      return list
    },
    isSodOrShoesAndbags({ baseInfo }) {
      return [3, 3110, 3102, 3109].includes(baseInfo.catId)
    }
  },
  watch: {
    youMayAlsoLikeList: {
      handler(val) {
        if (val && val.length == 0) {
          this.cuurentTab = 1
        }
      },
      deep: true
    },
    swatchesToDressList: {
      handler(val) {
        if (!this.isSwatchModule) return
        if (val && val.length == 0) {
          this.cuurentTab = 1
        } else {
          this.cuurentTab = 0
        }
      },
      deep: true
    },
    swatchesToMobDressList: {
      handler(val) {
        if (!this.isSwatchModule) return
        // aliasStyleId 包含mob-前缀表示选中的是mob的颜色
        if (
          this.selectedColor.aliasStyleId &&
          this.selectedColor.aliasStyleId.toString().includes('mob-') &&
          this.swatchesToMobDressList.length
        ) {
          this.cuurentTab = 1
        } else {
          this.cuurentTab = 0
        }
      },
      deep: true
    }
  },
  methods: {
    showQuickShopDialog(params) {
      this.$emit('quickShop', params)
    }
  }
}
</script>

<style lang="less" scoped>
#product-mix-and-match {
  .mix-title {
    .page-product-item-title {
      color: #ccc;
      &:nth-child(1) {
        margin-right: 39px;
      }
      &.checked {
        color: var(--color-121212);
        border-bottom: 3px solid var(--color-121212);
        padding-bottom: 6px;
      }
    }
  }

  #sale-shop-all {
    background-color: #f6f6f6;
    width: 100%;
    text-align: center;
    .goods-item-a {
      position: relative;
      font-family: @font-family-600, sans-serif;
      font-size: 14px;
      color: var(--color-121212);
      &::after {
        position: absolute;
        content: '';
        width: 100%;
        height: 2px;
        background-color: var(--color-121212);
        left: 0;
        bottom: 0;
      }
    }
  }
}
.product_related {
  .product_related_tab_module {
    &.hide-title {
      /deep/ .product-module-container {
        margin-top: 0;
        .module-title {
          display: none;
        }
      }
    }
    .product_related-tabs {
      margin-top: 60px;
      margin-bottom: 20px;
      padding-bottom: 6px;
      box-shadow: 0 1px 0 var(--color-121212);
      .tab-item {
        display: inline-block;
        position: relative;
        font-family: @font-family-600;
        font-size: 16px;
        line-height: 22px;
        text-transform: uppercase;
        color: var(--color-121212);
        &.big {
          cursor: pointer;
          &.active::after {
            content: '';
            position: absolute;
            display: inline-block;
            width: 100%;
            height: 5px;
            background-color: var(--color-121212);
            left: 0;
            bottom: -9px;
          }
        }
      }
      > :first-child {
        margin-right: 30px;
      }
    }
  }
}
</style>
