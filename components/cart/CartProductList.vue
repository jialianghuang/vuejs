<template>
  <div class="cart-content">
    <div v-if="checkoutGoodsList && Object.keys(checkoutGoodsList).length" class="shopping-bag-content">
      <!-- <h1 class="cart-page-title">{{ nl('page_common_shoppingbag') }}</h1> -->
      <div class="pay-title">
        <h3>
          {{ nl('page_common_items') }} (<span id="cart_item_total">{{ forCheckoutQty }}</span
          >)
        </h3>
        <template v-if="parties && Object.keys(parties).length">
          <party-info :summaryInfo="summaryInfo"></party-info>
          <AzQuestionIcon :popTips="nl('page_showroom_party_tips')" :el="'cart-az-question'" :ec="'cart-az-question'" />
        </template>
      </div>
      <cart-label-banner></cart-label-banner>
      <!-- todo 活动结束删除 -->
      <div v-if="isSemiSale && summaryInfo.goodsAmount * 1 < 100" class="semisale">
        <img
          v-if="country == 'CA'"
          :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/54/16/c746ec488bb903e413df3a3768085416.png')"
          class="semisale_img ca"
          alt="semisale_img"
        />
        <img
          v-else
          :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/a7/9d/42b147f63cfe27aabd35708a3172a79d.png')"
          class="semisale_img"
          alt="semisale_img"
        />
        <span class="semisale_txt"
          >{{ nl('page_cart_add_more') }}
          <a
            :href="countryUrl('/all/dresses')"
            target="_blank"
            class="need_datalayer"
            data-datalayer-category="SemiSale"
            data-datalayer-label="SemiSale_DressesShoppingCart"
            >{{ nl('page_header_dresses') }}</a
          >,
          <a
            :href="countryUrl('/all/accessories')"
            target="_blank"
            class="need_datalayer"
            data-datalayer-category="SemiSale"
            data-datalayer-label="SemiSale_AccessoriesShoppingCart"
            >{{ nl('page_swatch_category_accessories') }}</a
          >
          {{ nl('page_common_or') }}
          <a
            :href="countryUrl('/swatches-fabric')"
            target="_blank"
            class="need_datalayer"
            data-datalayer-category="SemiSale"
            data-datalayer-label="SemiSale_SwatchesShoppingCart"
            >{{ nl('page_header_swatches') }}</a
          >
          {{ nl('page_cart_text1') }}</span
        >
      </div>
      <!-- 失效商品 -->
      <div v-if="invalidCheckoutGoodsList && Object.keys(invalidCheckoutGoodsList).length" class="unavailable-prod-list">
        <div class="list-header">
          <span class="desc">{{ showInvalidNote }}</span>
          <span @click="deleteAllUnavailableProductes" class="delete-all">{{ nl('page_common_delete_all') }}</span>
        </div>
        <div class="pay-prod-list list-body">
          <cart-product-item
            v-for="(item, index) in invalidCheckoutGoodsList"
            :key="item.goodId"
            :invalidCheckoutGoodsIndex="index"
            :item="item"
            :isLater="false"
            :isInvalid="true"
            :showRushNote="showRushNote"
            @refreshCartList="refreshCartList"
            @quickShop="quickShopClick"
            @getCartGiftActivity="getCartGiftActivity"
          ></cart-product-item>
        </div>
      </div>
      <!-- AZWEB-18459 Buy more save more -->
      <template v-if="cartInfo.cartBundleList">
        <!-- bundle 未满 -->
        <div
          v-for="(bundleListItem, bundleListIndex) in cartInfo.cartBundleList.underFillGoodsBundleList"
          :key="`underfill_${bundleListIndex}`"
          class="redeemed-prod-list bundle-prod-list"
        >
          <BundleListHeader :bundleListItem="bundleListItem">
            <cart-product-item
              v-for="(item, index) in bundleListItem.goodsList"
              :key="item.goodId"
              :bundleGoodsIndex="index"
              :item="item"
              :isLater="false"
              :isBundle="true"
              :showRushNote="showRushNote"
              @refreshCartList="refreshCartList"
              @quickShop="quickShopClick"
              @getCartGiftActivity="getCartGiftActivity"
              @triggleGiveUpBundle="triggleGiveUpBundle"
              :isFull="false"
            ></cart-product-item>
          </BundleListHeader>
        </div>
        <!-- bundle 已满 -->
        <div
          v-for="(bundleListItem, bundleListIndex) in cartInfo.cartBundleList.fillGoodsBundleList"
          :key="`fill_${bundleListIndex}`"
          class="redeemed-prod-list bundle-prod-list"
        >
          <BundleListHeader :bundleListItem="bundleListItem">
            <cart-product-item
              v-for="(item, index) in bundleListItem.goodsList"
              :key="item.goodId"
              :bundleGoodsIndex="index"
              :item="item"
              :isLater="false"
              :isBundle="true"
              :showRushNote="showRushNote"
              @refreshCartList="refreshCartList"
              @quickShop="quickShopClick"
              @getCartGiftActivity="getCartGiftActivity"
              @triggleGiveUpBundle="triggleGiveUpBundle"
            ></cart-product-item>
          </BundleListHeader>
        </div>
      </template>
      <!-- 购物车商品 -->
      <div :class="{ hasRedeemed: redeemedStatus && redeemedStatus.status && redeemedStatus.status.isEnabled }" class="pay-prod-list">
        <cart-product-item
          v-for="(item, index) in validCheckoutGoodsList"
          :key="item.goodId"
          :validCheckoutGoodsIndex="index"
          :item="item"
          :isLater="false"
          :showRushNote="showRushNote"
          @refreshCartList="refreshCartList"
          @quickShop="quickShopClick"
          @getCartGiftActivity="getCartGiftActivity"
          @triggleGiveUpBundle="triggleGiveUpBundle"
        ></cart-product-item>
      </div>
      <!-- 可换购商品或搭售商品 22294 搭售下线-->
      <div
        v-if="(!!redeemedBagGoodsList.length || showTyingEntrance) && false"
        v-track.viewOnce="getBiParams('wrapper')"
        class="redeemed-prod-list"
      >
        <!-- 已加车的换购商品-->
        <div v-if="redeemedBagGoodsList.length" class="pay-prod-list list-body">
          <cart-product-item
            v-for="(item, index) in redeemedBagGoodsList"
            :key="item.goodId"
            :redeemedGoodsIndex="index"
            :item="item"
            :isRedeemed="true"
            :isTying="isTying"
            :class="{ 'minus-margin': index == 0 && !showTyingEntrance }"
            v-track.viewOnce="getBiParams(index, item)"
            @refreshCartList="refreshCartList"
            @getCartGiftActivity="getCartGiftActivity"
            @quickShop="quickShopClick"
            @triggleGiveUpBundle="triggleGiveUpBundle"
          ></cart-product-item>
        </div>
        <template v-if="showTyingEntrance">
          <div ref="tylingSaleHeader" :class="['list-header', { 'can-click': isTying }]" @click="viewAllFun(isTying)">
            <p class="list-header-item">
              <az-icon class="icon-redeem" icon-class="icon-icon-redeem" />
              <span :class="['header-title', { bold: isTying }]">{{ redeemedTitle }}</span>
              <span v-if="isTying" class="header-title">{{ nl('page_common_tying_text2') }}</span>
              <span v-else class="redeemed_num">{{
                `${redeemedStatus.status.currentRedeemedGoodsCount}/${redeemedStatus.status.goodsNumLimit}`
              }}</span>
            </p>
            <p
              v-if="isTying"
              v-track.view.click="{
                common: {
                  ec: 'redeemedconfiguration',
                  el: 'viewall',
                  msg: JSON.stringify({ ab: versionObj.cartTyingAbtest.toLowerCase() })
                }
              }"
              class="list-header-item view-all"
            >
              <span>{{ nl('page_fg_view_all') }}</span>
            </p>
          </div>
          <div
            v-if="mergeRedeemedCatGoodsList && exceptRedeemedGoodsList(mergeRedeemedCatGoodsList).length"
            :class="['can-redeemed-prod-list', { 'pd-70': !!redeemedBagGoodsList.length }]"
          >
            <redeemed-goods-list
              :redeemedGoodsList="exceptRedeemedGoodsList(mergeRedeemedCatGoodsList)"
              :type="!isTying"
              @refreshCartList="refreshCartList"
              @quickShop="handleRedeemedQuickShop"
            ></redeemed-goods-list>
          </div>
        </template>
      </div>
    </div>
    <!-- save for later 商品 -->
    <div v-if="saveForLaterGoodsList && Object.keys(saveForLaterGoodsList).length" class="save-for-later-content">
      <div class="cart-page-title">
        {{ nl('page_cart_saved_for_later') }} (<span>{{ saveForLaterQty }}</span
        >)
      </div>
      <div class="pay-prod-list">
        <cart-product-item
          v-for="(item, index) in saveForLaterGoodsList"
          :key="item.goodId"
          :saveForLaterGoodsIndex="index"
          :item="item"
          :isLater="true"
          @refreshCartList="refreshCartList"
          @quickShop="quickShopClick"
          @getCartGiftActivity="getCartGiftActivity"
          @triggleGiveUpBundle="triggleGiveUpBundle"
        ></cart-product-item>
      </div>
    </div>
    <TyingList
      :list="exceptRedeemedGoodsList(mergeRedeemedCatGoodsList)"
      :visible="viewAll"
      @refreshCartList="refreshCartList"
      @quickShop="quickShopClick"
      @close="viewAllFun(false)"
    />
  </div>
</template>

<script>
import CartProductItem from '@/components/cart/CartProductItem'
import RedeemedGoodsList from '@/components/cart/RedeemedGoodsList'
import cartLabelBanner from '@/components/cart/CartLabelBanner'
import partyInfo from '@/components/cart/PartyInfo'
import AzQuestionIcon from '@/components/az-ui/AzQuestionIcon'
import BundleListHeader from '@/components/cart/BundleListHeader'
import TyingList from '@/components/cart/TyingList'
import { mapState } from 'vuex'

export default {
  name: 'CartProductList',
  components: { CartProductItem, cartLabelBanner, RedeemedGoodsList, partyInfo, AzQuestionIcon, BundleListHeader, TyingList },
  props: {
    forCheckoutQty: {
      type: Number,
      default: 0
    },
    saveForLaterQty: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      toggle: true, // 防重复点击
      viewAll: false
    }
  },
  computed: {
    ...mapState(['isSemiSale', 'cartInfo']),
    ...mapState('cart', [
      'checkoutGoodsList',
      'saveForLaterGoodsList',
      'summaryInfo',
      'invalidCheckoutGoodsList',
      'validCheckoutGoodsList',
      'redeemedBagGoodsList',
      'redeemedStatus',
      'invalidCheckoutGoodsRecIds',
      'parties'
    ]),
    showRushNote() {
      let rushNum = 0
      let standardNum = 0
      for (let index = 0; index < this.checkoutGoodsList.length; index++) {
        const element = this.checkoutGoodsList[index]
        if (element.rushType == 'rush') {
          rushNum++
        } else {
          standardNum++
        }
      }
      if (rushNum && standardNum) {
        return true
      } else {
        return false
      }
    },
    showInvalidNote() {
      return this.invalidCheckoutGoodsRecIds.length > 1
        ? this.nl('page_cart_list_text1') + ' ' + this.nl('page_cart_list_text2')
        : this.nl('page_cart_list_text3') + ' ' + this.nl('page_cart_list_text2')
    },
    redeemedTitle({ redeemedStatus, isTying }) {
      const { status = {} } = redeemedStatus || {}
      if (isTying) {
        return this.nl('page_common_tying_text1')
      }
      return status.canExchange
        ? `${this.nl('page_cart_redeemed_title_1')} ${status.throttle} ${this.nl('page_cart_redeemed_title_2')}`
        : `${status.gap} ${this.nl('page_cart_redeemed_title_3')}`
    },
    showTyingEntrance({ versionObj, redeemedStatus, isTying }) {
      const { status = {} } = redeemedStatus || {}
      return status.isEnabled
    },
    isTying({ redeemedStatus }) {
      const { status = {} } = redeemedStatus || {}
      return status.conditionType == 2
    },
    mergeRedeemedCatGoodsList({ redeemedStatus, isTying }) {
      // 活动类型字段名： conditionType   1：换购活动；2：搭售活动
      return redeemedStatus.goodsList || []
      // 搭售列表 分类排序采取交叉排序
      // const tempArr = []
      // const goodsListMapArr = []
      // const goodsLengthArr = []
      // if (redeemedStatus && redeemedStatus.catGoodsSortMap && redeemedStatus.catGoodsSortMap.length) {
      //   redeemedStatus.catGoodsSortMap.forEach((item) => {
      //     // 非空数组
      //     if (item.length) {
      //       goodsListMapArr.push(item)
      //       goodsLengthArr.push(item.length)
      //     }
      //   })
      // }
      // const maxLen = Math.max(...goodsLengthArr)
      // for (let i = 0; i < maxLen; i++) {
      //   for (let j = 0; j < goodsListMapArr.length; j++) {
      //     const arrItem = goodsListMapArr[j]
      //     if (i < arrItem.length) {
      //       tempArr.push(arrItem[i])
      //     }
      //   }
      // }
      // return tempArr
    }
  },
  watch: {
    redeemedBagGoodsList(newData, oldData) {
      // 当有新的搭售商品加入时，固定当前搭售推荐组件的位置
      if (process.client && newData.length > oldData.length) {
        this.$nextTick(() => {
          const tyingSaleScrollTop = sessionStorage.getItem('TYING_SALE_SCROLLTOP')
          if (tyingSaleScrollTop && this.$refs.tylingSaleHeader) {
            const tempOffsetTop = this.$refs.tylingSaleHeader.offsetTop
            document.documentElement.scrollTo(0, tempOffsetTop - tyingSaleScrollTop)
          }
        })
      }
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem('TYING_SALE_SCROLLTOP')
  },
  methods: {
    handleRedeemedQuickShop(params) {
      this.confirmScrollPosition()
      this.quickShopClick(params)
    },
    // 点击页面内容后确认当前页面的滚动距离
    confirmScrollPosition() {
      if (this.$refs.tylingSaleHeader) {
        const res = this.$refs.tylingSaleHeader.getBoundingClientRect()
        // 将当前搭售商品列表组件的页面位置缓存，有新的搭售商品加入时，用于固定当前搭售组件的位置
        sessionStorage.setItem('TYING_SALE_SCROLLTOP', parseInt(res.top))
      }
    },
    triggleGiveUpBundle(e) {
      this.$emit('triggleGiveUpBundle', e)
    },
    refreshCartList() {
      this.$emit('refreshCartList')
    },
    deleteAllUnavailableProductes() {
      if (this.toggle) {
        this.setDataLayer({
          action: 'click',
          category: 'CartUnavailable',
          label: 'CartUnavailable_TopDeleteButton_Click'
        })
        this.toggle = false
        this.$store.commit('cart/setLoadingFlag', true)
        const isRealDelete = this.isLater ? 1 : 0
        this.$axios
          .$post(`/1.0/cart/remove-by-ids`, { is_real_delete: isRealDelete, rec_ids: this.invalidCheckoutGoodsRecIds })
          .then((res) => {
            this.toggle = true
            if (res.code == 0) {
              this.refreshCartList()
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    quickShopClick(params) {
      this.$emit('quickShop', params)
    },
    getBiParams(index, item) {
      const ec = 'redeemgoods'
      let el = ''
      if (index == 'wrapper') {
        el = 'all'
        return {
          id: 'redeemgoods-all',
          common: {
            ec,
            el,
            msg: ''
          }
        }
      } else {
        el = 'items'
        return {
          id: `${ec}-${item && item.goodsId}-${item && item.color}`,
          common: {
            ec,
            el,
            msg: JSON.stringify({
              goodsId: item.goodsId,
              color: item.colorReal,
              size:
                item.formatStyles && item.formatStyles.size && item.formatStyles.size.standardSize
                  ? item.formatStyles.size.standardSize.name
                  : ''
            })
          }
        }
      }
    },
    getCartGiftActivity() {
      this.$emit('getCartGiftActivity')
    },
    exceptRedeemedGoodsList(list) {
      // 过滤掉维度为sku的已加购的商品
      const tempArr = []
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        if (!element.recId) tempArr.push(element)
      }
      return tempArr
    },
    viewAllFun(bol) {
      if (bol) {
        this.confirmScrollPosition()
      }
      this.viewAll = bol
    }
  }
}
</script>

<style lang="less">
.shopping-bag-content {
  margin-top: 10px;
}
.save-for-later-content {
  margin-top: 80px;
}
.pay-prod-list {
  border-top: 1px solid #ccc;
  &.hasRedeemed {
    // padding: 0 20px;
    border: 1px solid transparent;
    border-top: none;
  }
}
.cart-page-title {
  display: inline-block;
  padding: 0;
  line-height: 22px;
  font-size: 16px;
  font-family: @font-family-600;
  color: var(--color-121212);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 5px;
}
.pay-title {
  text-transform: uppercase;
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #ccc;
  h3 {
    padding-bottom: 0;
    line-height: 22px;
    font-family: @font-family-600, sans-serif;
    font-size: 14px;
    font-weight: 400;
    margin-right: 10px;
  }
}
.footer-notice {
  margin-top: 8px;
  span {
    &:nth-child(1) {
      color: @theme-color;
    }
  }
}
// 0504活动
.semisale {
  display: flex;
  align-items: center;
  margin: 10px auto;
  .semisale_img {
    display: block;
    width: 222px;
    &.ca {
      width: 238px;
    }
  }
  .semisale_txt {
    margin-left: 8px;
    font-size: 13px;
    color: var(--color-121212);
    a {
      color: var(--color-121212);
      text-decoration: underline;
    }
  }
}
.unavailable-prod-list {
  box-sizing: border-box;
  border: 1px solid var(--color-121212);
  margin-bottom: 20px;
  background: var(--color-f9f9f9);
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    background: var(--color-121212);
    padding: 0 20px;
    font-size: 13px;
    font-family: @font-family-500;
    color: #ffffff;
    line-height: 18px;
    .delete-all {
      display: inline-block;
      padding: 0 6px;
      height: 20px;
      border: 1px solid #fff;
      text-align: center;
      cursor: pointer;
      z-index: 1;
    }
  }
  .list-body {
    &.pay-prod-list {
      border-top: none;
      .cat-product-item {
        padding: 20px;
        border-color: #eee;
      }
    }
  }
}
.redeemed-prod-list {
  // border-top: 1px solid #ccc;
  padding-top: 15px;
  &.bundle-prod-list {
    border-top: none;
    padding-top: 0;
    margin-top: 20px;
  }
  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--color-f1e9e6);
    padding: 0 10px;
    height: 30px;
    border: 1px solid var(--color-f1e9e6);
    &.can-click {
      cursor: pointer;
    }
    .desc {
      color: var(--color-121212);
      font-family: @font-family-500;
      font-size: 13px;
      display: flex;
      align-items: center;
      .icon-redeem {
        font-size: 14px;
        margin-right: 5px;
        vertical-align: middle;
      }
    }
    .list-header-item {
      display: flex;
      column-gap: 10px;
      align-items: center;
      .icon-redeem {
        font-size: 20px;
        vertical-align: middle;
      }
      .header-title {
        color: var(--color-121212);
        font-family: @font-family-500;
        font-size: 12px;
        &.bold {
          font-family: @font-family-600;
          font-size: 14px;
        }
      }
      .redeemed_num {
        color: var(--color-121212);
        font-family: @font-family-500;
        font-size: 13px;
      }
      &.view-all {
        color: var(--color-121212);
        font-family: @font-family-500;
        font-size: 13px;
        text-decoration-line: underline;
        cursor: pointer;
      }
    }
  }
  .list-body {
    padding: 0 20px;
    // margin-bottom: 20px;
    &.pay-prod-list {
      border: 1px solid var(--color-f1e9e6);
      // border-top: none;
      .cat-product-item {
        border-top: 1px solid var(--color-f1e9e6);
        border-bottom: none;
        &:first-of-type {
          border: none;
        }
      }
    }
    .minus-margin {
      margin: 0 -20px;
      padding: 20px;
    }
  }
}
.can-redeemed-prod-list {
  border-right: 1px solid var(--color-f1e9e6);
  border-left: 1px solid var(--color-f1e9e6);
  border-bottom: 1px solid var(--color-f1e9e6);
  padding-bottom: 20px;
  &.pd-70 {
    .swiper-container {
      position: relative;
      // 下面的样式设置是为了解决 因为父元素overflow：hidden 导致  add_bag_notice 气泡元素hover的展示不可见的问题
      padding-bottom: 70px;
      margin-bottom: -70px;
      z-index: 0;
    }
  }
}
</style>
