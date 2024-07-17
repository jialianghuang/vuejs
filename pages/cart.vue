<template>
  <div class="cart-box">
    <main-app :navigation="navigation" :adaptive="true" class="adaptive-box">
      <div class="cart-main">
        <cart-warning></cart-warning>
        <div style="display:none">
          <h1>{{ nl('page_common_shoppingbag') }}</h1>
        </div>
        <template v-if="!cookieEnabled">
          <cookie-disabled></cookie-disabled>
        </template>
        <template v-else>
          <section class="pay-box">
            <div class="pay-left">
              <template v-if="isEmpty">
                <empty-cart></empty-cart>
                <cart-product-list
                  v-if="saveForLaterGoodsList && Object.keys(saveForLaterGoodsList).length"
                  @refreshCartList="getCartProdList"
                  :saveForLaterQty="saveForLaterQty"
                  @getCartGiftActivity="getCartGiftActivity"
                  @triggleGiveUpBundle="triggleGiveUpBundle"
                ></cart-product-list>
                <most-popular
                  v-if="Object.keys(mostPopular).length > 0"
                  :mostPopular="mostPopular"
                  @mostPopularItemClick="mostPopularItemClick"
                  v-track.view.click="{ common: { ec: 'shoppingbag', el: 'empty_waterfalls' } }"
                  :from="'empty_cart_recommend'"
                ></most-popular>
                <recently-view @recentlyViewedItemClick="recentlyViewedItemClick"></recently-view>
              </template>
              <template v-else>
                <h1 class="cart-title">{{ nl('page_common_shoppingbag') }}</h1>
                <!-- 去掉之前的Note逻辑， -->
                <!-- <div v-if="summaryInfo.hasDiffCat" class="do-not-ship">
                  <span>NOTE:</span>
                  <span class="more_cat_notice">{{ nl('page_cart_order_notship_untill_complete') }}</span>
                </div> -->
                <!-- 只针对不拆单的订单进行Note  等后端确认字段-->
                <!-- 产品Edirp让去掉购物车提示 -->
                <!-- <div v-if="!goodsIsSplitOrder" class="do-not-ship">
                  <span>{{ nl('page_party_tip_note') }}:</span>
                  <span class="more_cat_notice">{{ nl('page_cart_order_notship_untill_complete_and_no_split') }}</span>
                </div> -->
                <activity-status-progress
                  :from="'cart'"
                  v-if="activityCartInfo && activityCartInfo.showProgress"
                  :activityCartInfo="activityCartInfo"
                  :freeShippingProgress="cartInfo.freeShippingProgress"
                  :visible="true"
                  @clickAdd="clickFreeShipProgressAdd"
                ></activity-status-progress>
                <free-gift-bar v-if="showGiftBar" @getCartGiftActivity="getCartGiftActivity"></free-gift-bar>
                <cart-product-list
                  @refreshCartList="getCartProdList"
                  :forCheckoutQty="forCheckoutQty"
                  :saveForLaterQty="saveForLaterQty"
                  @quickShop="quickShopClick"
                  @getCartGiftActivity="getCartGiftActivity"
                  @triggleGiveUpBundle="triggleGiveUpBundle"
                ></cart-product-list>
                <cart-recommend-block
                  :validCheckoutGoodsList="validCheckoutGoodsList"
                  :recommendProducts="recommendProducts"
                  :fromDialog="'youmayalsolike'"
                  @quickShop="quickShopClick"
                ></cart-recommend-block>
              </template>
            </div>
            <div v-if="!isEmpty" class="pay-right">
              <!-- couponSelectVisible 这里的作用是去掉ordersummary sticky 样式 -->
              <div id="payRightInner" :class="{ 'pay-right-inner-fix': payRightInnerFix && !couponSelectVisible }" class="pay-right-inner">
                <!-- #18080: 免运费活动+阶梯活动 同时存在的时候，使用新的样式，在 activity-status-progress 组件内 -->
                <free-ship-progress
                  v-if="
                    cartInfo.freeShippingProgress &&
                      cartInfo.freeShippingProgress.isShowProgressBar &&
                      (!activityCartInfo || !activityCartInfo.showProgress)
                  "
                  :progress-data="cartInfo.freeShippingProgress"
                  :visible="true"
                  @clickAdd="clickFreeShipProgressAdd"
                  scene="cart"
                ></free-ship-progress>
                <order-summary
                  :refreshCoupon="refreshCoupon"
                  @setCheckoutAmount="getCheckoutAmount"
                  :hasMxBdBatch="hasMxBdBatch"
                ></order-summary>
              </div>
            </div>
          </section>
        </template>
      </div>
      <shipping-fee-layer></shipping-fee-layer>
      <add-on-items
        :visible.sync="showAddOnItems"
        :list="addOnItems"
        :goodsIds="addOnIds"
        :progress-data="cartInfo.freeShippingProgress"
        :addType="addType"
        :activityCartInfo="activityCartInfo"
        @onAddToBag="quickShopClick"
        @loadMore="addOnLoadMore"
      ></add-on-items>
      <quick-shop-dialog
        ref="quickShopDialog"
        :fromDialog="fromDialog"
        @refreshCartList="getCartProdList"
        @refreshGiftActivity="getCartGiftActivity"
      ></quick-shop-dialog>
      <afterpay-layer></afterpay-layer>
      <back-to-top></back-to-top>
      <free-gift-dialog
        ref="freeGiftDialog"
        @quickShop="quickShopClick"
        @refreshGiftActivity="getCartGiftActivity"
        @refreshCartList="getCartProdList"
        @setConfirmDialog="setConfirmDialog"
      ></free-gift-dialog>
      <give-up-bundle
        :visible.sync="giveUpBundleVisible"
        :list="redeemedBagGoodsList"
        :deleteItem="deleteItem"
        @refreshCartList="getCartProdList"
      ></give-up-bundle>
      <az-confirm
        :showCancel="true"
        :confirmContent="nl('page_fg_close_popup_tips')"
        v-if="showConfirmDialog"
        @closeConfirmDialog="closeConfirmDialog"
      ></az-confirm>
      <az-toast ref="cartToast" :message="cartErrorMsg" @toastHide="toastHide"></az-toast>
    </main-app>
    <az-loading v-if="loadingFlag" :zIndex="setLoadingZIndex"></az-loading>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import MostPopular from '@/components/index/MostPopular'
import RecentlyView from '@/components/index/RecentlyView'
import CartProductList from '@/components/cart/CartProductList'
import emptyCart from '@/components/cart/EmptyCart'
import orderSummary from '@/components/cart/OrderSummary'
import shippingFeeLayer from '@/components/cart/ShippingFeeLayer'
import cartWarning from '@/components/cart/CartWarning'
import cartRecommendBlock from '@/components/cart/CartRecommendBlock'
// import QuickShopDialog from '@/components/quickshop/QuickShopDialog'
import azLoading from '@/components/az-ui/AzLoading'
import CookieDisabled from '@/components/cart/CookieDisabled'
import backToTop from '@/components/common/BackToTop'
import AfterpayLayer from '@/components/common/AfterpayLayer'
import FreeGiftBar from '@/components/freeGift/FreeGiftBar'
import FreeGiftDialog from '@/components/freeGift/FreeGiftDialog'
import { init, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import colorHex from '@/assets/js/colorHex'
import { mapState } from 'vuex'
import ActivityStatusProgress from '@/components/cart/ActivityStatusProgress'
import AzConfirm from '@/components/az-ui/AzConfirm.vue'
import AzToast from '@/components/az-ui/AzToast'
import FreeShipProgress from '@/components/cart/FreeShipProgress'
import AddOnItems from '@/components/cart/AddOnItems'
import GiveUpBundle from '@/components/cart/GiveUpBundle'
import { getCookieByString } from '../assets/js/pointUtil'

// 异步组件，会分开打包，有多语言的要在组件中请求多语言
const QuickShopDialog = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('@/components/quickshop/QuickShopDialog')
})

export default {
  name: 'Cart',
  components: {
    AfterpayLayer,
    RecentlyView,
    MostPopular,
    MainApp,
    CartProductList,
    emptyCart,
    orderSummary,
    shippingFeeLayer,
    cartWarning,
    cartRecommendBlock,
    QuickShopDialog,
    azLoading,
    CookieDisabled,
    backToTop,
    ActivityStatusProgress,
    FreeGiftBar,
    FreeGiftDialog,
    AzConfirm,
    AzToast,
    FreeShipProgress,
    GiveUpBundle,
    AddOnItems
  },
  mixins: [colorHex],
  data() {
    return {
      available: true,
      mostPopular: {},
      cartWarningDec: [], // 购物车错误提示
      recommendProducts: {}, // 购物车推荐商品
      payRightInnerFix: false,
      cookieEnabled: true,
      fromDialog: 'cart',
      cartEditRecId: 0,
      showConfirmDialog: false,
      tempGiftActivityInfo: {},
      isCancleCoupon: false,
      refreshCoupon: false, // 是否刷新可用券，需要刷新时，此字段只要有变化即可
      showAddOnItems: false, // 是否展示凑单组件
      giveUpBundleVisible: false,
      deleteItem: {}, // 要删除的商品
      addOnItems: [], // 凑单商品列表
      addType: '',
      addOnIds: [] // 凑单所有商品的id
    }
  },
  computed: {
    ...mapState('cart', [
      'parties',
      'checkoutGoodsList',
      'saveForLaterGoodsList',
      'invalidCheckoutGoodsList',
      'summaryInfo',
      'giftActivityInfo',
      'hasGiftActivity',
      'freeGiftDialogShow',
      'cartErrorMsg',
      'validCheckoutGoodsList',
      'redeemedBagGoodsList',
      'view_mode',
      'redeemedStatus'
    ]),
    ...mapState(['cartInfo']),
    ...mapState('checkout', ['couponInfo', 'couponSelectVisible']),
    ...mapState({
      baseInfo: (state) => state.product.baseInfo,
      sizeChartLayerShow: (state) => state.quickshop.sizeChartLayerShow,
      styleInfo: (state) => state.quickshop.styleInfo,
      loadingFlag: (state) => state.cart.loadingFlag,
      isNormalStock: (state) => state.quickshop.isNormalStock
    }),
    setLoadingZIndex() {
      // 赠品弹窗的zindex 为 1010，要在赠品弹窗里面再弹弹窗，这个时候的loading需要覆盖1010，所以这种情况下设置loading的zindex为1011，其他情况不变
      if (this.freeGiftDialogShow) {
        return 1011
      } else {
        return 1001
      }
    },
    showGiftBar({ hasGiftActivity, giftActivityInfo }) {
      return (
        hasGiftActivity &&
        giftActivityInfo &&
        giftActivityInfo.giftActivityGoodsList &&
        !!Object.keys(giftActivityInfo.giftActivityGoodsList).length
      )
    }
  },
  watch: {
    cartErrorMsg(val) {
      if (this.cartErrorMsg) {
        this.$refs.cartToast.show()
      }
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      let isEmpty = false
      let hasMxBdBatch = false // 是否包含特殊商品
      const applyCouponCode =
        (context.req &&
          context.req.headers &&
          context.req.headers.cookie &&
          getCookieByString('applyCouponCode', context.req.headers.cookie)) ||
        null // 记录的上一次手动输入的couponcode
      const queryParams = {
        ...context.route.query,
        activityVerison: context.store.state.versionObj.activityAbtest && context.store.state.versionObj.activityAbtest.toLowerCase(),
        coupon_code: applyCouponCode,
        sodGalleryVersion: (context.store.state.versionObj.sodGalleryVersion || 'A').toLowerCase(),
        bundleExchangeVersion: (context.store.state.versionObj.cartTyingAbtest || 'A').toLowerCase()
      }
      delete queryParams.access_token
      const res = await context.$axios.$get(`/1.0/cart`, {
        params: { ...queryParams }
      })
      if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return
      } else if (res.code == 0) {
        const checkoutGoodsList = res.data.checkoutGoodsList || []
        const saveForLaterGoodsList = res.data.saveForLaterGoodsList || []
        const invalidCheckoutGoodsList = res.data.invalidCheckoutGoodsList || []
        const validCheckoutGoodsList = res.data.validCheckoutGoodsList || []
        const invalidCheckoutGoodsRecIds = res.data.invalidCheckoutGoodsRecIds || []
        const redeemedBagGoodsList = res.data.redeemedGoodsList || []
        const redeemedStatus = res.data.redeemedStatus || {}
        const giftActivityInfo = res.data.giftActivityInfo || {}
        const hasGiftActivity = res.data.hasGiftActivity
        isEmpty = !checkoutGoodsList || Object.keys(checkoutGoodsList).length == 0
        if (context.store.state.country == 'MX') {
          for (let i = 0; i < checkoutGoodsList.length; i++) {
            // mxBdBatch和mxNotReturn都是mx下的一批特殊商品新增的字段
            if (checkoutGoodsList[i].mxBdBatch || checkoutGoodsList[i].mxNotReturn) {
              hasMxBdBatch = true
              break
            }
          }
        }
        const parties = res.data.parties
        context.store.commit('cart/setCheckoutGoodsList', checkoutGoodsList)
        context.store.commit('cart/setSaveForLaterGoodsList', saveForLaterGoodsList)
        context.store.commit('cart/setInvalidCheckoutGoodsList', invalidCheckoutGoodsList)
        context.store.commit('cart/setValidCheckoutGoodsList', validCheckoutGoodsList)
        context.store.commit('cart/setRedeemedBagGoodsList', redeemedBagGoodsList)
        context.store.commit('cart/setInvalidCheckoutGoodsRecIds', invalidCheckoutGoodsRecIds)
        context.store.commit('cart/setGiftActivityInfo', giftActivityInfo)
        context.store.commit('cart/setHasGiftActivity', hasGiftActivity)
        context.store.commit('cart/setRedeemedStatus', redeemedStatus)
        context.store.commit('cart/setParties', parties)
        context.store.commit('cart/setViewMode', res.data.allPlusSize ? 'plus' : 'petite')
        if (res.data.showroomId && parties && !!Object.keys(parties).length) {
          parties.forEach((item) => {
            if (item.selected) {
              context.store.commit('cart/setSelectedParty', item)
            }
          })
        }
        const summaryInfo = { ...res.data.summary, available: res.data.available, statusToCheck: res.data.statusToCheck }
        context.store.commit('cart/setSummaryInfo', summaryInfo)
        context.store.commit('cart/setBonusDetail', res.data.bonusDetail || [])
        if (res.data.summary) {
          context.store.commit('setCartInfo', {
            totalCount: res.data.forCheckoutQty,
            prodList: res.data.checkoutGoodsList || [],
            totalPrice: res.data.summary.goodsAmountDisplay,
            sample_gift_goods_id: '', //  后端说这个送头纱现在没有了
            freeShippingProgress: res.data.freeShippingProgress, // 免运费进度条相关数据
            cartBundleList: res.data.cartBundleList, // buy more get more
            activityInfo: res.data.activityInfo || {},
            recommendInfo: res.data.recommendInfo || {}
          })
        } else {
          context.store.commit('setCartInfo', {
            totalCount: 0,
            prodList: [],
            totalPrice: 0,
            sample_gift_goods_id: '',
            cartBundleList: res.data.cartBundleList, // buy more get more
            freeShippingProgress: null,
            activityInfo: {},
            recommendInfo: res.data.recommendInfo || {}
          })
        }
        res.data.awardInfo && context.store.commit('cart/setAwardInfo', res.data.awardInfo)
        // coupon的错误, 如果是获取cookie里面记录的手动输入的coupon，错误的时候不展示错误提示
        if (res.data.errors && res.data.errors.couponError && res.data.errors.couponError.msg) {
          if (!applyCouponCode) {
            context.store.commit('checkout/setCheckoutError', { isCouponError: res.data.errors.couponError.msg })
          }
        } else {
          context.store.commit('checkout/setCouponInfo', res.data.couponInfo || {})
        }
        context.store.commit('setJsKey', 'cart')
      }
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        goodsIsSplitOrder: res.data.goodsIsSplitOrder,
        dataLayerInfo: res.data.dataLayerInfo,
        isEmpty,
        saveForLaterQty: res.data.saveForLaterQty,
        forCheckoutQty: res.data.forCheckoutQty,
        hasGiftGarmentBag: res.data.hasGiftGarmentBag,
        activityCartInfo: res.data.activityInfo && Object.keys(res.data.activityInfo).length ? res.data.activityInfo : {},
        hasMxBdBatch
      }
    } catch (error) {
      if (!/axios/.test(error)) {
        context.app.$throw(error, { $options: { name: context.route.name }, $route: context.route }, 'asyncdata')
      }
      context.error({
        statusCode: 200,
        message: 'service are unavailable temporarily, please refresh page!'
      })
    }
  },
  head() {
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  created() {
    if (process.client) {
      this.getCartRecommend()
      this.getCartProdList('init')
      this.getMostPopular()
      this.getColorHexAjax()
    }
  },
  mounted() {
    const items = []
    if (this.checkoutGoodsList.length) {
      this.checkoutGoodsList.forEach((item) => {
        const msg = { goodsId: item.goodsId, color: item.colorReal, cat_id: item.catId }
        if (this.isSpecialCatId(item.catId)) {
          const text = this.getStickerText(item)
          msg.wgd_ver = 'A'
          msg.attr2 = 'cartpage' // 来源
          if (text && msg.wgd_ver == 'B') {
            msg.attr1 = text.toLowerCase()
          }
        }
        const temp = {
          ec: 'goods',
          el: 'items',
          ea: 'view',
          msg: JSON.stringify(msg)
        }
        items.push(temp)
      })
    }
    if (this.saveForLaterGoodsList.length) {
      this.saveForLaterGoodsList.forEach((item) => {
        const temp = {
          ec: 'goods',
          el: 'saveforlater',
          ea: 'view',
          msg: JSON.stringify({ goodsId: item.goodsId, color: item.colorReal, cat_id: item.catId })
        }
        items.push(temp)
      })
    }
    if (items.length) {
      this.buryPoint(this, 'events', items)
    }
    this.cookieEnabled = navigator.cookieEnabled
    // 进页面打点
    this.setDataLayer({
      action: 'view',
      category: 'PC_ShoppingCartRevision',
      label: 'ShoppingCart_View'
    })
    // 存在失效商品打点
    if (Object.keys(this.invalidCheckoutGoodsList).length) {
      this.setDataLayer({
        action: 'view',
        category: 'CartUnavailable',
        label: 'CartUnavailable_Cart_View'
      })
      this.setPoint('note', 'invalid', 'view', 'This item is OUT OF STOCK')
    }
    if (this.isEmpty) {
      this.setDataLayer({
        action: 'view',
        category: 'PC_ShoppingCartRevision',
        label: 'ShoppingCart_NoItem_View'
      })
    } else {
      this.setDataLayer({
        action: 'view',
        category: 'PC_ShoppingCartRevision',
        label: 'ShoppingCart_WithItem_View'
      })
    }
    // 滚动视图打点
    const elementList = [
      {
        elementId: '#most-popular-recommend',
        triggerPercentage: 1,
        currentStatus: false,
        eventCategory: 'PC_ShoppingCartRevision',
        eventLabel: 'ShoppingCart_MostPopular_View'
      },
      {
        elementId: '#recently-viewed-module',
        triggerPercentage: 1,
        currentStatus: false,
        eventCategory: 'PC_ShoppingCartRevision',
        eventLabel: 'ShoppingCart_RecentlyView_View'
      },
      {
        elementId: '#cart_recommend_block',
        triggerPercentage: 0.5,
        currentStatus: false,
        eventCategory: 'PC_ShoppingCartRevision',
        eventLabel: 'ShoppingCart_Recommend_View'
      }
    ]
    this.moduleVisibleDataLayer(elementList)
    this.$nextTick(() => {
      window.addEventListener('scroll', this.payRightScroll, false)
    })

    // 购物车页面加载  ga4打点
    this.setViewCartGA4()
  },
  methods: {
    getStickerText(item) {
      return (item.driveInfo && item.driveInfo.cartSticker && item.driveInfo.cartSticker[0] && item.driveInfo.cartSticker[0].subText) || ''
    },
    // 凑单商品加载更多，每次加载20个商品，传递goodsId
    addOnLoadMore() {
      const listLength = this.addOnItems.length
      if (listLength < this.addOnIds.length) {
        // 获取需要传递的商品id
        let goodsIds = this.addOnIds.slice(listLength, listLength + 20)
        // 将数组改成逗号分隔的字符串
        goodsIds = goodsIds.join(',')
        this.clickFreeShipProgressAdd(this.addType, goodsIds)
      }
    },
    // 点击免运费进度上的add文字按钮
    clickFreeShipProgressAdd(type, goodsIds) {
      if (!type) return false
      this.$store.commit('cart/setLoadingFlag', true)
      let amount = 0
      if (type === 'promotion') {
        // 促销活动
        if (this.cartInfo && this.cartInfo.activityInfo && this.cartInfo.activityInfo.gap) {
          amount = this.cartInfo.activityInfo.gap
        }
      } else if (type === 'free-ship') {
        // 默认运费
        // eslint-disable-next-line
        if (this.cartInfo && this.cartInfo.freeShippingProgress && this.cartInfo.freeShippingProgress.freeShippingDifference) {
          amount = this.cartInfo.freeShippingProgress.freeShippingDifference
        }
      }
      this.addType = type
      let params = '?amount=' + amount + '&type=shippingFee'
      if (goodsIds) {
        params += '&goodsIds=' + goodsIds
      }
      // 调用获取凑单商品接口
      this.$axios
        .$post('/1.0/cart/making-up-goods' + params)
        .then((res) => {
          this.$store.commit('cart/setLoadingFlag', false)
          if (res && res.data) {
            // 只有第一次请求会返回goodsList，后续请求不会返回此参数
            if (res.data.goodsList) {
              this.addOnIds = res.data.goodsList
            }
            if (res.data.prodList) {
              if (goodsIds) {
                res.data.prodList.forEach((ele) => {
                  this.addOnItems.push(ele)
                })
              } else {
                this.addOnItems = []
                this.$nextTick(() => {
                  this.addOnItems = res.data.prodList
                })
              }
            }
            this.showAddOnItems = true
          }
        })
        .catch((err) => {
          console.log(err)
          this.$store.commit('cart/setLoadingFlag', false)
        })
    },
    // 弹窗提示用户删掉裙子会丧失鞋包权益
    triggleGiveUpBundle(e) {
      this.deleteItem = e
      this.giveUpBundleVisible = true
    },
    // coupon 校验 data 数据结构 { params: { couponCode: '' },then:()=>{},finally:()=>{}}
    getCheckoutAmount(options) {
      let resCouponCode = ''
      if (options && options.params && options.params.couponCode) {
        resCouponCode = options.params.couponCode
        this.isCancleCoupon = false
      } else {
        this.isCancleCoupon = true
      }
      delete options.params.couponCode
      options.params.coupon_code = resCouponCode
      options.params.auto_use_activity_coupon = this.isCancleCoupon ? 0 : 1 // 取消红包的时候要传0
      this.getCartProdList(options)
    },
    // 获取购物车商品列表 数据结构 { params: { couponCode: '' },then:()=>{},finally:()=>{}}
    getCartProdList(options) {
      const couponParams = (options && options.params) || {} // params 是coupon 入参
      const isFromApply = couponParams.isFromApply // 是否是手动输入的coupon
      let autoUseApply
      const applyCouponCode = this.$cookie.getCookie('applyCouponCode')
      // 一进来,或者更新商品数据后获取之前使用过的手动输入的coupon
      if (options === 'init' || !options) {
        if (applyCouponCode) {
          autoUseApply = true
          couponParams.coupon_code = applyCouponCode
        }
      }
      try {
        const params = {
          ...this.$route.query,
          activityVerison: this.versionObj.activityAbtest && this.versionObj.activityAbtest.toLowerCase(),
          sodGalleryVersion: (this.versionObj.sodGalleryVersion || 'A').toLowerCase(),
          bundleExchangeVersion: (this.versionObj.cartTyingAbtest || 'A').toLowerCase(),
          ...couponParams
        }
        this.$axios
          .$get('/1.0/cart', { params })
          .then((res) => {
            this.$store.commit('cart/setLoadingFlag', false)
            if (res.code == 0) {
              const checkoutGoodsList = res.data.checkoutGoodsList || []
              const saveForLaterGoodsList = res.data.saveForLaterGoodsList || []
              const invalidCheckoutGoodsList = res.data.invalidCheckoutGoodsList || []
              const validCheckoutGoodsList = res.data.validCheckoutGoodsList || []
              const invalidCheckoutGoodsRecIds = res.data.invalidCheckoutGoodsRecIds || []
              this.isEmpty = !checkoutGoodsList || Object.keys(checkoutGoodsList).length == 0
              const redeemedBagGoodsList = res.data.redeemedGoodsList || []
              const redeemedStatus = res.data.redeemedStatus || {}
              this.saveForLaterQty = res.data.saveForLaterQty
              this.forCheckoutQty = res.data.forCheckoutQty
              this.goodsIsSplitOrder = res.data.goodsIsSplitOrder
              this.hasGiftGarmentBag = res.data.hasGiftGarmentBag
              this.activityCartInfo = res.data.activityInfo || {}
              const giftActivityInfo = res.data.giftActivityInfo || {}
              const hasGiftActivity = res.data.hasGiftActivity
              this.$store.commit('cart/setCheckoutGoodsList', checkoutGoodsList)
              this.$store.commit('cart/setSaveForLaterGoodsList', saveForLaterGoodsList)
              this.$store.commit('cart/setInvalidCheckoutGoodsList', invalidCheckoutGoodsList)
              this.$store.commit('cart/setValidCheckoutGoodsList', validCheckoutGoodsList)
              this.$store.commit('cart/setInvalidCheckoutGoodsRecIds', invalidCheckoutGoodsRecIds)
              this.$store.commit('cart/setRedeemedStatus', redeemedStatus)
              this.$store.commit('cart/setRedeemedBagGoodsList', redeemedBagGoodsList)
              this.$store.commit('cart/setParties', res.data.parties)
              this.$store.commit('cart/setGiftActivityInfo', giftActivityInfo)
              this.$store.commit('cart/setHasGiftActivity', hasGiftActivity)
              this.$store.commit('cart/setBonusDetail', res.data.bonusDetail || [])
              this.$store.commit('cart/setViewMode', res.data.allPlusSize ? 'plus' : 'petite')

              if (this.country == 'MX') {
                this.hasMxBdBatch = false
                for (let i = 0; i < checkoutGoodsList.length; i++) {
                  if (checkoutGoodsList[i].mxBdBatch || checkoutGoodsList[i].mxNotReturn) {
                    this.hasMxBdBatch = true
                    break
                  }
                }
              }
              if (res.data.showroomId && this.parties && !!Object.keys(this.parties).length) {
                this.parties.forEach((item) => {
                  if (item.selected) {
                    this.$store.commit('cart/setSelectedParty', item)
                  }
                })
              }
              const summaryInfo = { ...res.data.summary, available: res.data.available, statusToCheck: res.data.statusToCheck }
              this.$store.commit('cart/setSummaryInfo', summaryInfo)
              res.data.awardInfo && this.$store.commit('cart/setAwardInfo', res.data.awardInfo)
              if (options != 'init') this.getCartRecommend()
              if (res.data.summary) {
                this.$store.commit('setCartInfo', {
                  totalCount: res.data.forCheckoutQty,
                  prodList: res.data.checkoutGoodsList || [],
                  totalPrice: res.data.summary.goodsAmountDisplay,
                  sample_gift_goods_id: '', //  后端说这个送头纱现在没有了
                  freeShippingProgress: res.data.freeShippingProgress, // 免运费进度条相关数据
                  cartBundleList: res.data.cartBundleList, // buy more get more
                  activityInfo: res.data.activityInfo || {},
                  recommendInfo: res.data.recommendInfo || {}
                })
              } else {
                this.$store.commit('setCartInfo', {
                  totalCount: 0,
                  prodList: [],
                  totalPrice: 0,
                  sample_gift_goods_id: '',
                  cartBundleList: res.data.cartBundleList, // buy more get more
                  freeShippingProgress: null,
                  activityInfo: {},
                  recommendInfo: res.data.recommendInfo || {}
                })
              }
              if (res.data.errors && res.data.errors.couponError && res.data.errors.couponError.msg) {
                // coupon的错误
                this.$cookie.removeCookie('applyCouponCode')
                if (!autoUseApply) {
                  this.$store.commit('checkout/setCheckoutError', { isCouponError: res.data.errors.couponError.msg })
                }
              } else {
                this.$store.commit('checkout/setCouponInfo', res.data.couponInfo || {})
                //  如果是手动输入的coupon，记录下来，有效期是30min
                if ((isFromApply || autoUseApply) && ((res.data.couponInfo && res.data.couponInfo.code) || applyCouponCode)) {
                  this.$cookie.setCookie('applyCouponCode', (res.data.couponInfo && res.data.couponInfo.code) || applyCouponCode, 0.5 / 24)
                } else {
                  this.$cookie.removeCookie('applyCouponCode')
                }
                // 清空现有的coupon错误
                this.$store.commit('checkout/setCheckoutError', { isCouponError: null })
              }
              // refreshCoupon字段只要有变动，就会触发可用券刷新
              this.refreshCoupon = !this.refreshCoupon
              const cbRes = (res.data.errors && res.data.errors.couponError) || {}
              if (options && typeof options.then === 'function') options.then(cbRes)

              // 如果当前凑单组件显示，刷新凑单商品数据
              if (this.showAddOnItems && this.cartInfo) {
                if (this.addType === 'promotion') {
                  if (this.cartInfo.activityInfo && this.cartInfo.activityInfo.gap) {
                    this.clickFreeShipProgressAdd(this.addType)
                  }
                } else if (this.addType === 'free-ship') {
                  if (this.cartInfo.freeShippingProgress && this.cartInfo.freeShippingProgress.freeShippingDifference) {
                    this.clickFreeShipProgressAdd(this.addType)
                  }
                }
              }
            }
          })
          .finally(() => {
            if (options == 'init') {
              this.$nextTick(() => {
                const query = JSON.parse(JSON.stringify(this.$route.query))
                if (query.access_token) {
                  delete query.access_token
                  this.$router.replace({
                    path: this.$route.path,
                    query
                  })
                }
              })
            }
            if (options && typeof options.finally === 'function') options.finally()
          })
      } catch (error) {
        if (options && typeof options.finally === 'function') options.finally()
        this.cartErrorExtra()
      }
    },
    cartErrorExtra(msg) {
      const _msg = msg || this.nl('page_error_something_wrong')
      this.$store.commit('cart/setLoadingFlag', false)
      alert(_msg)
    },
    // 获取购物车推荐商品
    getCartRecommend() {
      this.recommendProducts = {}
      const { status = {}, goodsList = [] } = this.redeemedStatus
      const params = {
        view_mode: this.view_mode,
        sodGalleryVersion: (this.versionObj.sodGalleryVersion || 'A').toLowerCase()
      }
      if (status.conditionType == 2) {
        params.exceptGoodsList = goodsList.map((item) => item.goodsId).join(',')
      }
      this.$axios.$get('/1.0/cart/recommend', { params }).then((res) => {
        if (res.code == 0) {
          this.recommendProducts = Object.keys(res.data).length ? res.data : { totalCount: 0 }
          if (!this.isEmpty && this.recommendProducts && this.recommendProducts.prodList && this.recommendProducts.prodList.length) {
            const gaParams = this.getGAItemListParams(this.recommendProducts.prodList, null, 'view', 'cartRecommend')
            this.setGA4DataLayer(gaParams)
          }
        }
      })
    },
    payRightScroll() {
      if (document.querySelector('#payRightInner')) {
        if (document.querySelector('.pay-left').getBoundingClientRect().top <= 88) {
          this.payRightInnerFix = true
        } else {
          this.payRightInnerFix = false
        }
      } else {
        this.payRightInnerFix = false
      }
    },
    getMostPopular() {
      const recentReviewed = localStorage.getItem('recently_viewed')
      const recentViewGoodList = localStorage.getItem('recent_view_good_list')
      this.$axios
        .$post('/1.0/recommend/recently-view-recommend', {
          topic: this.$store.state.isBridal ? 'bridal' : 'azazie',
          recently_viewed: recentReviewed,
          recent_view_good_list: recentViewGoodList
        })
        .then((res) => {
          if (res.code == 0) {
            this.mostPopular = res.data ? res.data : {}
          }
        })
    },
    mostPopularItemClick() {
      this.setDataLayer({
        action: 'click',
        category: 'PC_ShoppingCartRevision',
        label: 'ShoppingCart_MostPopular_Click'
      })
    },
    recentlyViewedItemClick() {
      this.setDataLayer({
        action: 'click',
        category: 'PC_ShoppingCartRevision',
        label: 'ShoppingCart_RecentlyView_Click'
      })
    },
    quickShopClick(params) {
      this.cartEditIsLater = params.isLater ? 0 : 1
      this.cartEditRecId = params.rec_id ? params.rec_id : 0
      this.fromDialog = params.fromDialog // 区分修改商品和商品推荐弹窗
      if (this.isNormalStock) params.supportStockSales = 1
      this.$refs.quickShopDialog.quickShopClick(params)
    },
    // 获取购物车商品满足的free gift 活动信息
    getCartGiftActivity(options) {
      this.$store.commit('cart/setLoadingFlag', true)
      this.$axios
        .$post('/1.0/gift/goods/cart', {
          params: {
            ...this.$route.query,
            activityVerison: this.versionObj.activityAbtest && this.versionObj.activityAbtest.toLowerCase()
          }
        })
        .then((res) => {
          if (res.code == 0) {
            const giftActivityInfo = {
              giftActivityGoodsList: this.giftActivityInfo.giftActivityGoodsList,
              ...res.data
            }
            this.tempGiftActivityInfo = JSON.parse(JSON.stringify(giftActivityInfo))
            this.$store.commit('cart/setLoadingFlag', false)
            this.$store.commit('cart/setGiftActivityInfo', giftActivityInfo)
            this.$store.commit('cart/setFreeGiftDialogShow', true)
          }
        })
        .catch(() => {
          this.$store.commit('cart/setLoadingFlag', false)
        })
    },
    setConfirmDialog(type) {
      this.showConfirmDialog = type
    },
    closeConfirmDialog(eventType) {
      this.showConfirmDialog = false
      if (eventType == 'yes') {
        // 未提交赠品关闭弹窗之后要恢复数据
        this.$store.commit('cart/setGiftActivityInfo', this.tempGiftActivityInfo)
        this.$store.commit('cart/setFreeGiftDialogShow', false)
      }
    },
    toastHide() {
      this.$store.commit('cart/setCartErrorMsg', '')
    },
    setViewCartGA4() {
      // 购物车页面加载 ga4打点
      const items = []
      this.validCheckoutGoodsList.forEach((item) => {
        items.push(this.getGA4CheckoutItem(item))
      })
      const gaParams = {
        event: 'ga4Event',
        event_name: 'view_cart',
        event_parameters: {
          currency: this.currencyCode,
          value: this.summaryInfo.totalAmount || 0, // 总金额
          items
        }
      }
      this.setGA4DataLayer(gaParams)
    }
  }
}
</script>

<style lang="less">
.cart-box {
  // min-width: 1368px; 不要定死页面宽度
  .cart-main {
    // display: flex;
    min-width: 768px;
    max-width: 1353px;
    margin-left: auto;
    margin-right: auto;
    clear: both;
    min-height: 535px;
    padding: 9px 20px 20px 20px;
    box-sizing: border-box;
    /deep/ .most-popular,
    /deep/ .recently-view {
      // padding: 0;
      margin: 60px auto 0;
      .title {
        font-family: @font-family-600, sans-serif;
        font-size: 16px;
        line-height: 22px;
        color: var(--color-121212);
      }
    }
    .pay-box {
      display: flex;
    }
    .pay-left {
      flex: auto;
      margin-right: 0;
      min-height: 470px;
      min-width: 378px;
      margin-bottom: 50px;
      .cart-title {
        display: inline-block;
        padding: 0;
        // margin: 35px 0 5px;
        line-height: 22px;
        font-size: 16px;
        font-family: @font-family-500;
        color: var(--color-121212);
        text-transform: uppercase;
      }
      .do-not-ship {
        margin-top: 12px;
        margin-bottom: 25px;
        span {
          color: var(--color-121212);
          &:first-child {
            color: var(--color-121212);
          }
          margin-right: 3px;
          line-height: 18px;
        }
      }
      .footer-notice {
        margin-top: 8px;
        span {
          color: var(--color-121212);
          &:first-child {
            color: var(--color-121212);
          }
        }
      }
    }
    .pay-right {
      margin-top: 22px;
      margin-left: 40px;
      min-width: 380px;
      width: 380px;
      float: right;
      margin-bottom: 50px;
      .pay-right-inner {
        position: static;
        &.pay-right-inner-fix {
          position: sticky;
          top: 134px;
        }
      }
    }
  }
  /deep/.prev-arraw,
  .next-arraw {
    top: 105px !important;
    margin-top: 0 !important;
  }
}
</style>
