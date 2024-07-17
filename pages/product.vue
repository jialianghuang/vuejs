<template>
  <div
    :class="[
      'product-box',
      { 'product-box-b': isSpecialCatId(catId), 'product-box-new': !isSpecialCatId(catId) },
      versionObj.listWithCodeAbtest
    ]"
  >
    <SvgProduct />
    <div style="display:none">
      <h1>{{ baseInfo.shownGoodsName }}</h1>
    </div>
    <main-app ref="main" v-if="!show404" :prodList="[{ goodsId: baseInfo.goodsId }]">
      <product-microdata :reviewInfo="reviewInfo" :detailsInfo="detailsInfo"></product-microdata>
      <div class="main-content">
        <div v-if="isSpecialCatId(catId)" style="height: 15px;"></div>
        <template v-else>
          <bread-crumb :baseInfo="baseInfo"></bread-crumb>
        </template>
        <div class="prod-thumb-box">
          <section class="prod-picture-look">
            <product-thumb
              :detailsInfo="detailsInfo"
              :videoInfo="videoInfo"
              :shareList="shareList"
              :stickerInfo="stickerInfo"
              :flashSaleInfo="flashSaleInfo"
              :stock-info="stockInfo"
            ></product-thumb>
            <client-only v-if="!is_chrome_lighthouse">
              <complete-the-look
                v-if="completeTheLookList.length > 0 && !isSpecialCatId(catId) && cmpPosition.left && !cmpPosition.right"
                :fromDialog="'product'"
                :completeTheLookList="completeTheLookList"
                @quickShop="quickShopClick"
                scene="productInfo"
              ></complete-the-look>
            </client-only>
          </section>
          <product-info
            :detailsInfo="detailsInfo"
            :videoInfo="videoInfo"
            :styleInfo="styleInfo"
            :swatchInfo="swatchInfo"
            :makeTimeInfo="makeTimeInfo"
            :reviewInfo="reviewInfo"
            :retireInfo="retireInfo"
            :flashSaleInfo="flashSaleInfo"
            :stock-info="stockInfo"
            :giftInfo="giftInfo"
            :stickerInfo="stickerInfo"
            :completeTheLookList="completeTheLookList"
            :showCompleteTheLook="!shopTheLookGoods.length"
            :customPhotoList="reviewInfoObject.customPhoto"
            :sellerInfo="sellerInfo"
            @quickShop="quickShopClick"
          ></product-info>
        </div>
        <client-only v-if="!is_chrome_lighthouse">
          <div ref="shopTheLook" v-if="shopTheLookGoods.length">
            <shop-the-look :baseInfo="baseInfo" :outfitInfo="shopTheLookGoods" @onItemClick="clickShopTheLookItem"></shop-the-look>
          </div>
          <product-related
            v-if="
              !!youMayAlsoLikeList.length || !!mostPopularList.length || !!swatchesToDressList.length || !!swatchesToMobDressList.length
            "
            :baseInfo="baseInfo"
            :youMayAlsoLikeList="youMayAlsoLikeList"
            :mostPopularList="mostPopularList"
            :swatchesToDressList="swatchesToDressList"
            :swatchesToMobDressList="swatchesToMobDressList"
            @quickShop="quickShopClick"
            :isSwatchModule="isSwatchModule"
          ></product-related>
          <template v-if="!isSpecialCatId(catId) && reviewInfoObject.customPhoto && reviewInfoObject.customPhoto.length > 0">
            <customer-photo :customPhotoList="reviewInfoObject.customPhoto" :baseInfo="baseInfo"></customer-photo>
          </template>
          <!-- 详情页评论模块 -->
          <reviews-qa-mix
            v-if="!baseInfo.isMeasurementHideGoods"
            :questionInfo="questionInfo"
            :reviewInfo="{ ...reviewInfo, ...reviewInfoObject }"
            :size="styleInfo.size"
            :customPhotoList="reviewInfoObject.customPhoto"
            @reviewsChange="reviewsChange"
            @questionsChange="questionsChange"
          >
          </reviews-qa-mix>
          <product-recentview :recentlyList="recentlyList" :fromDialog="'product'" @quickShop="quickShopClick"></product-recentview>
        </client-only>
      </div>
      <client-only>
        <quick-shop-dialog
          ref="quickShopDialog"
          :scene="scene"
          :fromDialog="quickShopFromDialog"
          @refreshCartList="getCartInfo()"
        ></quick-shop-dialog>
        <pannier-gift-video
          v-if="giftInfo && giftInfo.pannier && giftInfo.pannier.videoSource"
          :baseInfo="baseInfo"
          :giftInfo="giftInfo"
        ></pannier-gift-video>
        <!-- <popup-mask></popup-mask> -->
        <popup-pannier></popup-pannier>
        <popup-garment-bag></popup-garment-bag>
        <popup-add-to-cart-only></popup-add-to-cart-only>
        <!-- 详情页面这个色卡弹窗出现目前有两种情况：
          1：默认情况：showOrderSwatch 为true，则swatch-id拿接口给的swatchInfo。例如：点击样衣的颜色lebal上的Can't find your color?，
          2. showOrderSwatch === 'fromSwatchId'，则swatch-id拿baseInfo.swatchId。例如：点击颜色后面的Order a swatch，（这个是新的逻辑，jira:13182）
         -->
        <order-swatch
          v-if="(swatchInfo && showOrderSwatch) || (baseInfo.swatchId && showOrderSwatch === 'fromSwatchId')"
          :swatch-ids="showOrderSwatch === 'fromSwatchId' ? [baseInfo.swatchId] : swatchInfo.swatchIds"
        ></order-swatch>
        <popup-customer-photo
          v-if="customPhotoPopList && customPhotoPopList.length > 0 && popupCustomerPhoto.popupCustomerPhotoShow"
          :customPhotoPopList="customPhotoPopList"
        ></popup-customer-photo>
        <popup-customer-photo-upload></popup-customer-photo-upload>
        <size-chart-layer v-if="sizeChartLayerShow" :baseInfo="baseInfo" :sizeChartInfo="styleInfo.sizeChart"></size-chart-layer>
        <popup-ask-quest :baseInfo="baseInfo"></popup-ask-quest>
        <shop-the-look-drawer
          :visible.sync="shopTheLookVisible"
          :baseInfo="baseInfo"
          :goodsDatas="outfitRecommendation"
          :shopTheLookIndex="shopTheLookIndex"
        ></shop-the-look-drawer>
        <afterpay-layer></afterpay-layer>
        <popup-installment v-if="baseInfo.installments && baseInfo.installments.length" :list="baseInfo.installments"></popup-installment>
        <color-chart v-if="colorChartShow"></color-chart>
      </client-only>
      <!-- <download-app v-if="false"></download-app> -->
      <back-to-top :type="'static'" :id-name="'goods-backtop'"></back-to-top>
    </main-app>
    <template v-else>
      <page404
        :bindObj="{
          tips: tips,
          allGoods: allGoods,
          settled: settled
        }"
      />
    </template>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import breadCrumb from '@/components/product/Breadcrumb'
// import QuickShopDialog from '@/components/quickshop/QuickShopDialog'
import ProductThumb from '@/components/product/ProductThumb'
import PannierGiftVideo from '@/components/product/PannierGiftVideo'
import ProductInfo from '@/components/product/ProductInfo'
import CustomerPhoto from '@/components/product/CustomerPhoto'
import ProductRelated from '@/components/product/ProductRelated'
import CompleteTheLook from '@/components/product/CompleteTheLook'
import ProductRecentview from '@/components/product/ProductRecentview'
// import popupMask from '@/components/product/PopupMask'
import PopupPannier from '@/components/product/PopupPannier'
import PopupGarmentBag from '@/components/product/PopupGarmentBag'
import PopupAddToCartOnly from '@/components/product/PopupAddToCartOnly'
import PopupCustomerPhoto from '@/components/product/PopupCustomerPhoto'
import PopupAskQuest from '@/components/product/PopupAskQuest'
import PopupCustomerPhotoUpload from '@/components/product/PopupCustomerPhotoUpload'
import OrderSwatch from '@/components/product/OrderSwatch/OrderSwatch'
import SizeChartLayer from '@/components/product/SizeChartLayer'
import productMicrodata from '@/components/product/productMicrodata'
import BackToTop from '@/components/common/BackToTop'
import AfterpayLayer from '@/components/common/AfterpayLayer'
import ReviewsQaMix from '@/components/product/ReviewsQaMix'
import PopupInstallment from '@/components/product/PopupInstallment'
import ShopTheLook from '@/components/product/ShopTheLook'
import ShopTheLookDrawer from '@/components/product/ShopTheLookDrawer'
// import DownloadApp from '@/components/common/DownloadApp'
import ColorChart from '@/components/product/ColorChart'
import SvgProduct from '@/components/svgs/SvgProduct'

import { otherPageUrlToFormatUrl } from '@/assets/js/utils.js'
import { init, initWebLanguageKeys, resetSeoUrl, getNavigation, getNavigationDynamic } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { mapGetters, mapState } from 'vuex'
import colorHex from '@/assets/js/colorHex'
import page404 from './404.vue'

const languageKeys = [
  ...MainApp.languageKeys,
  ...AfterpayLayer.languageKeys,
  ...OrderSwatch.languageKeys,
  ...ProductInfo.languageKeys,
  ...breadCrumb.languageKeys,
  ...ShopTheLook.languageKeys,
  ...ReviewsQaMix.languageKeys,
  ...ProductThumb.languageKeys,
  ...ProductRelated.languageKeys,
  ...CompleteTheLook.languageKeys,
  ...ProductRecentview.languageKeys,
  ...PopupPannier.languageKeys,
  ...PopupGarmentBag.languageKeys,
  ...PopupAddToCartOnly.languageKeys,
  ...PopupCustomerPhoto.languageKeys,
  ...PopupAskQuest.languageKeys,
  ...PopupCustomerPhotoUpload.languageKeys,
  ...SizeChartLayer.languageKeys,
  ...BackToTop.languageKeys,
  ...PopupInstallment.languageKeys,
  // ...DownloadApp.languageKeys,
  ...ShopTheLook.languageKeys,
  ...ShopTheLookDrawer.languageKeys,
  ...ColorChart.languageKeys,
  ...page404.languageKeys
]

// 异步组件，会分开打包，有多语言的要在组件中请求多语言
const QuickShopDialog = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('@/components/quickshop/QuickShopDialog')
})

export default {
  name: 'Product',
  components: {
    MainApp,
    AfterpayLayer,
    OrderSwatch,
    breadCrumb,
    QuickShopDialog,
    ProductThumb,
    PannierGiftVideo,
    ProductInfo,
    CustomerPhoto,
    ProductRelated,
    CompleteTheLook,
    ProductRecentview,
    // popupMask,
    PopupPannier,
    PopupGarmentBag,
    PopupAddToCartOnly,
    PopupCustomerPhoto,
    PopupAskQuest,
    PopupCustomerPhotoUpload,
    SizeChartLayer,
    BackToTop,
    productMicrodata,
    ReviewsQaMix,
    PopupInstallment,
    // DownloadApp,
    ShopTheLook,
    ShopTheLookDrawer,
    ColorChart,
    page404,
    SvgProduct
  },
  mixins: [colorHex],
  data() {
    return {
      customData: {},
      reviewPostList: [],
      reviewLoading: false,
      axiosSource: {},
      videoInfo: null,
      giftInfo: null,
      customPhotoPopList: [],
      youMayAlsoLikeList: [],
      // completeTheLookList: [],
      mostPopularList: [],
      recentlyList: [],
      stockInfo: {},
      shopTheLookVisible: false,
      shopTheLookGoods: [],
      outfitRecommendation: [], // shopTheLook中的搭配商品详情
      shopTheLookIndex: '',
      quickShopFromDialog: 'product',
      swatchesToDressList: [],
      swatchesToMobDressList: [],
      scene: ''
    }
  },
  computed: {
    ...mapGetters({
      sizeChartLayerShow: 'product/getSizeChartLayerShow',
      selectedColor: 'product/getSelectedColor'
    }),
    ...mapState({
      baseInfo: (state) => state.product.baseInfo,
      selectedSize: (state) => state.product.selectedSize,
      selectedSashColor: (state) => state.product.selectedSashColor,
      defaultSelectedSashColor: (state) => state.product.defaultSelectedSashColor,
      makeTimeInfo: (state) => state.product.makeTimeInfo,
      showOrderSwatch: (state) => state.product.showOrderSwatch,
      popupCustomerPhoto: (state) => state.product.popupCustomerPhoto,
      showRoomNum: (state) => state.userInfo.showRoomNum,
      cmpPosition: (state) => state.product.completeTheLookPosition,
      selectedOptions: (state) => state.product.selectedOptions,
      sodPreSalePicVersion: (state) => state.product.sodPreSalePicVersion,
      plusSizeView: (state) => state.product.plusSizeView,
      colorChartShow: (state) => state.product.colorChartShow,
      imageInfo: (state) => state.product.imageInfo,
      customSizeSelected: (state) => state.product.customSizeSelected
    }),
    isSwatchModule() {
      // 包含 ： 色卡书（catId： 33），色卡（catId： 33），布料（catId： 36）详情页推荐模块
      // 1000291, 1003269 这两个id也是色卡33
      return this.baseInfo.catId == 33 || this.baseInfo.catId == 36 || [1000291, 1003269].includes(this.baseInfo.goodsId)
    },
    isSample({ baseInfo }) {
      return baseInfo.dressType == 'sample'
    },
    isClearance({ baseInfo }) {
      return baseInfo.dressType == 'clearance' || this.baseInfo.dressType == 'outlet'
    }
  },
  watch: {
    selectedColor: {
      handler(val, oldVal) {
        // 清仓取消颜色选择的情况调item-info 接口不传尺码
        if (this.isClearance && this.selectedColor.styleId == 0) {
          this.getProductInfo()
        }
        if (val.styleId != 0) {
          this.setBaseInfo()
          this.getProductInfo()
          this.getSimilarPopular()
          this.getCompleteTheLookList(this.baseInfo.color)
        }
      },
      deep: true
    },
    selectedSize: {
      handler(val, oldVal) {
        // 之前这里的逻辑不满足样衣、清仓取消尺码选择，需要更新数据的情况
        // 应该只要styleId发生变更，就更新相关数据
        if (val.styleId != oldVal.styleId) {
          this.getProductInfo()
          this.getSimilarPopular()
          // 大码图需要都同步更新大码图
          if (this.isInCatIds(this.baseInfo.catId)) {
            if (process.client) {
              if (this.setRecentlyCookie() > 0) {
                this.getRecentlyList()
              }
            }
            this.getCompleteTheLookList(this.baseInfo.color)
          }
        }
      },
      deep: true
    },
    // 监听 customsize 变动 是否选中都更新下数据
    customSizeSelected: {
      handler(val) {
        if (!this.selectedSize.styleId) this.getProductInfo()
      }
    },
    selectedSashColor: {
      handler(val, oldVal) {
        if (val.styleId != 0) {
          this.setBaseInfo()
          this.getProductInfo()
        }
      },
      deep: true
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setJsKey', 'product')
      initWebLanguageKeys(context, languageKeys)
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      let dressType = ''
      let catId = ''
      let goodsId = ''
      let isSupportStock = false // 是否卖库存
      let isSampleCat = false
      let stockInfo = {} // 库存信息
      // let colorHexCodeKeys = [] // 详情商品所使用的色圈key数组
      const query = otherPageUrlToFormatUrl(commonAsyncData.requestUrl)
      // 礼品卡需要重定向到礼品卡的详情页,兜底处理，内部人员使用入参方式访问链接的时候
      const giftCardGoodsId = [1056637]
      const giftCardGoodsName = ['azazie-digital-gift-card']
      if (giftCardGoodsId.includes(query.goods_id) || giftCardGoodsName.includes(query.goods_name)) {
        context.redirect(302, '/products/azazie-digital-gift-card')
      }
      let url = '/1.0/product/first-screen'
      if (query.hasOwnProperty('goods_id')) {
        url = url + '?goods_id=' + escape(query.goods_id)
      } else if (query.hasOwnProperty('goods_name')) {
        const goodsName = query.goods_name
        if (goodsName == 'azazie-swatches-bridesmaids-and-wedding-party') {
          url = url + '?goods_id=1000291'
        } else if (
          goodsName.includes('sample-bride') ||
          goodsName.includes('sample-modest') ||
          goodsName.includes('sample-maternity') ||
          goodsName.includes('sample-mother-of-the-bride') ||
          goodsName.includes('sample-junior-bridesmaid-dresses')
        ) {
          url = url + '?dress_type=sample&goods_name=' + escape(query.style)
        } else if (goodsName.includes('ready-to-ship') || goodsName.includes('clearance')) {
          url = url + '?dress_type=clearance&goods_name=' + escape(query.style)
        } else if (goodsName.includes('last-chance-outlet')) {
          url = url + '?dress_type=outlet&goods_name=' + escape(query.style)
        } else {
          url = url + '?goods_name=' + escape(goodsName)
        }
      } else {
        context.redirect(302, resetSeoUrl(context, `/sale_down?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return false
      }
      for (const i in query) {
        if (!['goods_id', 'goods_name'].includes(i)) {
          let param = query[i]
          if (Array.isArray(param)) {
            param = param[param.length - 1]
          }
          let key = i
          if (key == 'sourceTag') {
            key = 'source_tag'
            param = 'events_dresses'
          }
          url += '&' + escape(key) + '=' + escape(param)
        }
      }
      if (query.hasOwnProperty('from_showroom')) {
        context.store.commit('product/setFromShowroom', query.from_showroom)
      }
      if (query.hasOwnProperty('from_whatAreU')) {
        context.store.commit('product/setFromWhatAreU', query.from_whatAreU)
      }
      if (query.hasOwnProperty('recommend_flag') && context.store.state.country == 'CA') {
        context.store.commit('product/setRecommendFlag', query.recommend_flag)
      }
      if (query.hasOwnProperty('from_details_entry')) {
        context.store.commit('product/setFromDetailsEntry', query.from_details_entry)
      }
      if (query.utm_source == 'soldsie' && query.utm_medium == 'referral') {
        context.store.commit('product/setFromInstagram', true)
      }
      if (query.hasOwnProperty('is_plus_size')) {
        context.store.commit('product/setPlusSize', query.is_plus_size)
      }
      if (context.store.state.versionObj.activityAbtest) {
        url += '&activityVerison=' + context.store.state.versionObj.activityAbtest.toLowerCase()
      }
      // sod 强制获取图片ab版本
      let tempSodGalleryVersion = (context.store.state.versionObj.sodGalleryVersion || 'a').toLowerCase()
      if (query.sodGalleryVersion && query.sodGalleryVersion == 'b') {
        // sod 预售商品在列表页和预售列表页需要根据对应列表页传过来的sodGalleryVersion处理
        // tempSodGalleryVersion = ['b'].includes(query.sodGalleryVersion) ? query.sodGalleryVersion : 'a'
        url += '&sodGalleryVersion=b'
        tempSodGalleryVersion = 'b'
      } else {
        url += '&sodGalleryVersion=' + tempSodGalleryVersion
      }
      context.store.commit('product/setSodPreSalePicVersion', tempSodGalleryVersion)
      // AZWEB-18392 详情页颜色排序优化
      if (context.store.state.versionObj.productColorSort) {
        url += '&colorSortVersion=' + context.store.state.versionObj.productColorSort.toLowerCase()
      }
      // 首屏、次屏、colorHex 接口并发处理
      if (url.includes('barbie%25E2%2584%25A2')) url = decodeURIComponent(url)
      const [res] = await Promise.all([
        context.$axios.$get(url)
        // context.$axios.$get(url.replace('first-screen', 'second-screen')),
        // context.$axios.$get('/1.0/common/color-hex')
      ])
      // 首屏接口处理
      if (res.code == 0) {
        // #17566： giftCard兜底，如果是 giftCard 强制跳转礼品卡的 详情页,目前giftCard的详情页链接是写死的。修复用户手动更改链接导致 goods_name错误但是goodsStyleId正确的情况
        if (res.data && res.data.baseInfo && res.data.giftCardInfo && Object.keys(res.data.giftCardInfo).length) {
          const goodsStyleId = res.data.baseInfo.goodsStyleId
          const giftCardUrl = goodsStyleId ? `/products/azazie-digital-gift-card/${goodsStyleId}` : '/products/azazie-digital-gift-card'
          context.redirect(302, giftCardUrl)
        }

        if (
          (res.data.topic === 'bridal' || context.route.query.subsite === 'bridal') &&
          commonAsyncData.currentCountryInfo &&
          commonAsyncData.currentCountryInfo.isEnableForBridal
        ) {
          context.store.commit('setIsBridal', res.data.topic === 'bridal') // 这里以接口返回的topic为准
          // 获取bridal导航数据
          // 因为活动信息区分主题，婚纱页面在commonAsyncData文件里获取到的主题值有误，所以这里需要重新查询活动信息数据，否则婚纱页面会出现内容闪现问题
          await Promise.all([getNavigation(context), getNavigationDynamic(context, context.store.state.versionObj, true)])
        }
        // first-screen 数据处理
        dressType = res.data.baseInfo.dressType
        catId = res.data.baseInfo.catId
        goodsId = res.data.baseInfo.goodsId
        isSupportStock = res.data.baseInfo.isStockGoods || res.data.baseInfo.supportStockSales
        isSampleCat = res.data.baseInfo.isSampleCat
        context.store.commit('setDressType', dressType)
        context.store.commit('setCatId', catId)
        context.store.commit('setCatName', res.data.baseInfo.catName)
        context.store.commit('product/setMakeTimeInfo', res.data.makeTimeInfo)
        // EventsMenus
        context.store.commit('setSubSmallBox', res.data.subSmallBox || [])
        // 是否有免费色卡券
        context.store.commit('userInfo/setHasFreeSwatchCoupon', res.data.hasFreeSwatchCoupon)
        // 添加当前商品是否是rush
        res.data.baseInfo.isRush = res.data.detailsInfo.isRush
        // styleInfoSizeMap
        if (res.data.styleInfo && res.data.styleInfo.size && Object.keys(res.data.styleInfo.size).length) {
          const styleInfoSizeMap = {}
          for (const i in res.data.styleInfo.size) {
            styleInfoSizeMap[res.data.styleInfo.size[i].key] = res.data.styleInfo.size[i]
          }
          res.data.styleInfo.styleInfoSizeMap = styleInfoSizeMap
        }
        // 详情商品使用到的色圈key
        // if (res.data.styleInfo && res.data.styleInfo.color && res.data.styleInfo.color) {
        //   colorHexCodeKeys = Array.from(new Set(Object.keys(res.data.styleInfo.color))) // code去重
        // }
        // 根据链接获取的默认选中项,目前只需要取里面的size. color还是取的baseInfo的数据
        context.store.commit('product/setSelectedOptions', res.data.selectedOptions || {})
      } else if (res.code == 5) {
        // code等于5表明redis链接失败，需要用户刷新重试
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        // context.redirect(302, resetSeoUrl(context, `/sale_down?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        const params = {
          originUrl: context.route.query.originUrl
        }
        const res404 = await context.$axios.$get(`/1.0/error/p404`, { params })
        context.res.statusCode = 404
        return {
          ...commonAsyncData,
          show404: true,
          seoInfo: res404.data.seoInfo,
          dataLayerInfo: res404.data.dataLayerInfo,
          tips: res404.data.Tips || {},
          allGoods: res404.data.goods || {},
          settled: res404.data.settled || []
        }
      }

      // color-hex 数据处理
      // if (colorHexRes.code == 0) {
      //   const colorHexs = colorHexCodeKeys.reduce((pre, key) => {
      //     pre[key] = colorHexRes.data.colorHex[key]
      //     return pre
      //   }, {})
      //   context.store.commit('setColorHex', colorHexs)
      // }

      const params = {
        goods_id: goodsId,
        cat_id: catId,
        dress_type: dressType,
        sodGalleryVersion: tempSodGalleryVersion,
        from: 'product'
      }
      if (query.hasOwnProperty('is_plus_size')) {
        params.view_mode = 'plus'
      }

      let payload = { dress_type: dressType, cat_id: catId }
      if (dressType === 'clearance') {
        payload = {
          ...payload,
          discount: -1
        }
      }
      // 库存信息、商品折扣、complete the look、free shipping 卖点接口并发处理
      const [stockInfoRes, discountRes, colorChartRes, sampleInfoRes] = await Promise.all([
        isSupportStock ? context.$axios.$get('/1.0/stock/' + goodsId, { params: payload }) : Promise.resolve(),
        context.$axios.$get('/1.0/product/discount-info', { params }),
        // context.$axios.$post('/1.0/product/new-complete-the-look', {
        //   ...params,
        //   color: res.data.baseInfo.colorReal,
        //   exposure_goods_ids: [],
        //   abtest: 'A'
        // }),
        // context.$axios.$get('/1.0/product/free-shipping-fee-reminder', {
        //   params: {
        //     ...params,
        //     color: res.data.baseInfo.color
        //   }
        // }),
        context.$axios.$get(`/1.0/goods-color-chart?goodsId=${goodsId}`),
        isSampleCat
          ? context.$axios.$get('/1.0/product/sample-info', {
              params: { goods_id: res.data.baseInfo.goodsId, cat_id: catId }
            })
          : Promise.resolve()
      ])

      // stock 接口库存处理
      if (isSupportStock) {
        if (stockInfoRes.code == 0) {
          stockInfo = stockInfoRes.data || {}
          if ((!stockInfo.colorMap || stockInfo.colorMap.length === 0) && ['sample', 'clearance', 'outlet'].includes(dressType)) {
            const redirectUrl =
              dressType == 'clearance' || dressType == 'outlet'
                ? `/sale_down?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`
                : `/sale_down?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}&selected_country=${context.store.state.country}`
            context.redirect(302, redirectUrl)
            return
          }
          if (['sample', 'clearance', 'outlet'].includes(dressType) && !stockInfo.colorMap.hasOwnProperty(res.data.baseInfo.color)) {
            res.data.baseInfo.color = Object.keys(stockInfo.colorMap)[0]
            res.data.baseInfo.shownColor = res.data.styleInfo.color[res.data.baseInfo.color].name
            res.data.baseInfo.colorId = res.data.imageInfo.colorIdMap[res.data.baseInfo.color]
            if (res.data.baseInfo.hasSash) {
              const sashColor = Object.keys(stockInfo.sashColorMap)[0]
              const images = res.data.imageInfo.goodsGallery[res.data.baseInfo.color].images
              if (images[sashColor]) {
                res.data.baseInfo.goodsThumb = images[sashColor][0].imgUrl
              }
            } else {
              res.data.baseInfo.goodsThumb = res.data.imageInfo.goodsGallery[res.data.baseInfo.color].images[0].imgUrl
            }
          }
        } else if (stockInfoRes.code == 5) {
          // code等于5表明redis链接失败，需要用户刷新重试
          context.error({
            statusCode: 200,
            message: stockInfoRes.msg ? stockInfoRes.msg : 'service are unavailable temporarily, please refresh page!'
          })
          return
        }
      }

      // 库存商品defaultGoodsThumb更新
      res.data.baseInfo.defaultGoodsThumb = res.data.baseInfo.goodsThumb
      // 处理下是否是BD库存之后的商品信息
      context.store.commit('product/setBaseInfo', {
        ...res.data.baseInfo,
        reviewInfo: res.data.reviewInfo
      })
      // 默认色处理，且对色卡书、防尘袋做了特殊处理，
      //  #17348：样衣从样衣详情页similar和youmayalsolike推荐模块进入详情页也要有选中颜色，这个时候链接会带上color或者size
      const sampleInitColorFlag = dressType == 'sample' && (context.route.query.color || context.route.query.size)
      if (
        res.data.baseInfo.colorId &&
        (['dress', 'clearance'].includes(dressType) || sampleInitColorFlag) &&
        ![1002333, 1010976].includes(goodsId) &&
        res.data.styleInfo.color
      ) {
        const color = res.data.styleInfo.color[res.data.baseInfo.color]
        if (color) {
          if ([1000291, 1003269].includes(res.data.baseInfo.goodsId)) {
            context.store.commit('product/setSelectedColor', { ...color, aliasStyleId: 'bd-' + color.styleId })
            context.store.commit('product/setDefaultSelectedColor', { ...color, aliasStyleId: 'bd-' + color.styleId })
          } else {
            context.store.commit('product/setSelectedColor', { ...color, aliasStyleId: color.styleId })
            context.store.commit('product/setDefaultSelectedColor', { ...color, aliasStyleId: color.styleId })
          }
        }
      }
      if (res.data.baseInfo.hasSash && dressType == 'dress') {
        const sashColor = res.data.styleInfo.sashColor[res.data.baseInfo.sashColor]
        context.store.commit('product/setSelectedSashColor', sashColor)
        context.store.commit('product/setDefaultSelectedSashColor', sashColor)
      }

      // discount-info 色圈打折信息接口处理
      if (discountRes && discountRes.code == 0) context.store.commit('product/setDiscountInfoMessage', discountRes.data)

      // complete the look 推荐接口处理
      // if (completeResult && completeResult.code == 0) {
      //   if (completeResult.data.prodList && completeResult.data.prodList.length > 0) {
      //     completeTheLookList = completeResult.data.prodList.slice(0, 12)
      //   }
      // }

      // 获取免运费活动类型接口处理
      // if (context.store.state.country !== 'MX') {
      //   if (resFreeShipping && resFreeShipping.data.showWordsType) {
      //     context.store.commit('product/setShowWordsType', resFreeShipping.data.showWordsType)
      //   }
      // }

      const imageInfo = res.data.imageInfo
      let sodGalleryVersion = 'a'
      if (imageInfo.goodsGallery[res.data.baseInfo.color] && imageInfo.goodsGallery[res.data.baseInfo.color].sodGalleyVersion) {
        sodGalleryVersion = imageInfo.goodsGallery[res.data.baseInfo.color].sodGalleyVersion
      }
      context.store.commit('setSodGalleryVersion', sodGalleryVersion)
      context.store.commit('product/setImageInfo', imageInfo)

      // goods color chart 接口处理
      if (colorChartRes.data) {
        context.store.commit('product/setColorChart', colorChartRes.data || {})
      }

      // 获取关联样衣接口
      if (sampleInfoRes && sampleInfoRes.code === 0) {
        context.store.commit('product/setSampleInfo', sampleInfoRes.data)
        context.store.commit('product/setHasSample', sampleInfoRes.data.hasSample)
        context.store.commit('product/setSampleUrl', sampleInfoRes.data.sampleUrl) // 对应样衣的跳转地址
      }

      if (res.data.videoList) {
        context.store.commit('product/setVideoList', res.data.videoList.ktlaVideo)
      }
      const sellerInfo = Array.isArray(res.data.sellerInfo) ? {} : res.data.sellerInfo
      const retireInfo = {}
      if ([3, 3110].includes(res.data.baseInfo.catId)) {
        retireInfo.retireGoods = {}
      }
      context.store.commit('analysis/updateTime', ['asyncDataEnd', +new Date()])
      return {
        ...commonAsyncData,
        show404: false,
        stockInfo,
        seoInfo: res.data.seoInfo,
        detailsInfo: res.data.detailsInfo,
        reviewInfo: res.data.reviewInfo,
        videoInfo: res.data.videoList,
        styleInfo: res.data.styleInfo,
        giftInfo: res.data.giftInfo,
        swatchInfo: res.data.swatchInfo,
        shareList: res.data.shareInfo.list,
        dataLayerInfo: res.data.dataLayerInfo,
        url,
        flashSaleInfo: res.data.baseInfo.flashSaleInfo,
        completeTheLookList: [],
        sellerInfo, // 榜单信息
        questionInfo: {},
        reviewInfoObject: {},
        retireInfo,
        stickerInfo: [],
        customSizeInfo: {}
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
    if (!this.colorHex || !Object.keys(this.colorHex).length) {
      this.getColorHexAjax()
    }
    this.axiosSource = this.$axios.CancelToken.source()
    if (process.client) {
      this.getFreeShippingFeeReminder()
      this.getSecondScreenInfo()
      this.getCompleteTheLookList(this.baseInfo.colorReal)
      this.resetSelectOptions()
      // 只有不会默认选中size的情况下，才去请求 SimilarPopular 接口，修复线上 SimilarPopular 会请求两次的问题，因为在监听selectedSize变化的时候会请求一次
      if (!this.selectedOptions || !this.selectedOptions.size) {
        this.getSimilarPopular()
      }
      this.getCustomPhotoPopList()
      // jira:16800 删除这三个cookie，前后端已经不用了
      this.$cookie.removeCookie('viewProducts')
      this.$cookie.removeCookie('recently_viewed')
      this.$cookie.removeCookie('recent_view_good_list')
      if (this.setRecentlyCookie() > 0) {
        this.getRecentlyList()
      }
      if (this.baseInfo.catId == 3110) {
        this.getGoodsIds('product')
      }
    }
  },
  mounted() {
    // console.log('url: ', this.url)
    if (document.referrer.includes('/all/winter-wedding-guest-dresses') || this.sodPreSalePicVersion == 'b') {
      this.$store.commit('product/setIsFromSodPreSaleList', true)
    }
    this.trackViewContent({
      goodsId: this.baseInfo.goodsId,
      colorId: this.baseInfo.colorId,
      goodsName: this.baseInfo.goodsName,
      value: this.baseInfo.noDealPrice,
      catName: this.baseInfo.catName
    })
    const tempMsg = {
      goodsId: this.baseInfo.goodsId,
      color: this.selectedColor.key,
      cat_name: this.baseInfo.catName,
      dress_type: this.baseInfo.dressType || this.dressType,
      cat_id: this.baseInfo.catId,
      cdn_prvd: this.cdnPrvd(this.baseInfo.catId),
      ab: 'A',
      bestSellerAb: this.versionObj.bestSellerAbtest
    }
    if (this.baseInfo.catId == 33) {
      tempMsg.has_line_price = this.baseInfo.hasLinePrice ? 1 : 0
    }
    const isVersionB = this.sodDetailVersionFun(this.baseInfo)
    if (isVersionB) {
      tempMsg.ab = 'b'
    }
    if (this.baseInfo.discount && this.baseInfo.dressType === 'clearance') {
      tempMsg.discount = 10 - this.baseInfo.discount
    }
    this.buryPoint(this, 'events', [
      {
        ec: 'product',
        el: 'detailpage',
        ea: 'view',
        param1: (location && location.href) || '-1',
        // param2: this.versionObj.productColorSort,
        param2: this.versionObj.listWithCodeAbtest,
        msg: JSON.stringify(tempMsg)
      }
    ])
    // comments: 通过搜索的商品加订单追踪
    if (['searchrelate', 'search'].includes(this.$route.query.from)) {
      this.setOrderSourceFlag('search_result', true)
    }
    // comments: 设置complete the look 展示位置
    // ga4打点 浏览产品详情页（View Product Detail Page）*可多规格选择的产品，仅需触发1次
    this.setViewProductGA4()

    this.getShopTheLook()
  },
  methods: {
    // 次屏接口客户端处理
    async getSecondScreenInfo() {
      if (!this.url) return
      const secondScreenRes = await this.$axios.$get(this.url.replace('first-screen', 'second-screen'))
      if (secondScreenRes.code == 0) {
        this.questionInfo = secondScreenRes.data.questionInfo || {}
        this.reviewInfoObject = secondScreenRes.data.reviewInfo || {}
        this.retireInfo = secondScreenRes.data.retireInfo || {}
        this.stickerInfo = secondScreenRes.data.stickers || []
        this.$store.commit('product/setCustomSizeInfo', secondScreenRes.data.customSizeInfo || {})
      }
    },
    // 获取shop the look商品数据
    getShopTheLook() {
      this.$axios.$get(`/1.0/product/outfit?goodsId=${this.baseInfo.goodsId}`).then((res) => {
        if (res && res.data && Array.isArray(res.data)) {
          this.shopTheLookGoods = res.data
          const temp = this.$route.query.shopTheLookIndex
          if (res.data.length && temp) {
            // 如果url中存在shopTheLookIndex，滚动到视图中央，并且自动获取对应的搭配，展开弹框详情
            this.$nextTick(() => {
              if (this.$refs.shopTheLook) {
                this.$refs.shopTheLook.scrollIntoView({ block: 'center', behavior: 'smooth' })
              }
            })
            this.clickShopTheLookItem({ index: Number(temp) })
          }
        }
      })
    },
    // shop the look 点击，展开搭配商品详情弹框
    clickShopTheLookItem(e) {
      this.shopTheLookIndex = e.index
      this.$axios.$get(`/1.0/product/outfit-recommendation?goodsId=${this.baseInfo.goodsId}&index=${e.index}`).then((res) => {
        if (res && res.data && Array.isArray(res.data)) {
          this.outfitRecommendation = res.data
        }
        this.shopTheLookVisible = true
      })
    },
    // 筛选评论
    reviewsChange(val) {
      this.reviewLoading = true
      this.reviewPostList.push(new Date().getTime())
      if (this.reviewPostList.length > 1) {
        // 防止快速点击的无意义请求
        this.axiosSource.cancel('Operation canceled by the user.')
        this.axiosSource = this.$axios.CancelToken.source()
        this.reviewPostList = []
      }
      this.$axios
        .$post(
          `/1.0/review/${this.baseInfo.goodsId}`,
          {
            cat_id: this.baseInfo.catId,
            dress_type: this.baseInfo.dressType,
            page: val.isPageChange ? val.page : 1,
            limit: this.reviewInfoObject.pageInfo.limit,
            filters: {
              star_rating: val.star,
              fit: val.fit,
              color: val.color,
              sort_by: val.sortBy
            }
          },
          {
            cancelToken: this.axiosSource.token
          }
        )
        .then((res) => {
          this.reviewLoading = false
          this.reviewPostList = []
          if (res.code == 0) {
            this.$set(this.reviewInfoObject, 'reviewFilter', res.data.reviewFilter)
            this.$set(this.reviewInfoObject, 'reviewList', res.data.reviewList)
            this.$set(this.reviewInfoObject, 'pageInfo', res.data.pageInfo)
            if (val.isPageChange) {
              document.querySelector('#prod_reviews') && document.querySelector('#prod_reviews').scrollIntoView()
            }
          }
        })
        .catch((error) => {
          this.reviewLoading = false
          this.reviewPostList = []
          console.log(error)
        })
    },
    //  筛选问答
    questionsChange(val) {
      this.$axios
        .$get(`/1.0/product/goods-questions/${this.baseInfo.goodsId}`, {
          params: {
            page: val.isPageChange ? val.page : 1
          }
        })
        .then((res) => {
          if (res.code == 0) {
            this.questionInfo = res.data.questionInfo || {}
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /**
     * 获取custom photo 数据
     *goods_id
     *dress_type
     */
    getCustomPhotoPopList() {
      this.$axios
        .$get(`/1.0/review/${this.baseInfo.goodsId}/photo-details`, { params: { dress_type: this.baseInfo.dressType } })
        .then((res) => {
          if (res.code == 0) {
            if (res.data && res.data.photoList && res.data.photoList.length > 0) this.customPhotoPopList = res.data.photoList
          }
        })
    },
    /**
     * 根据不同颜色尺码获取商品信息
     * goods_id
     * dress_type
     * color
     * size
     * style_ids
     *  */
    getProductInfo() {
      const sizeStyleId = this.customSizeSelected ? 0 : this.selectedSize.styleId
      const params = {
        activityVerison: this.versionObj.activityAbtest && this.versionObj.activityAbtest.toLowerCase(),
        goods_id: this.baseInfo.goodsId,
        dress_type: this.baseInfo.dressType,
        color: this.baseInfo.color,
        size: this.selectedSize.name || '',
        style_ids: this.selectedColor.styleId + ',' + sizeStyleId + ',' + this.selectedSashColor.styleId,
        from: 'product', // 表明此接口是详情中调用
        sodGalleryVersion: this.sodPreSalePicVersion, // sod 强制获取图片ab版本
        is_custom_size: this.customSizeSelected // 如果点击了custome size，需要传true
      }
      if (this.isClearance && this.selectedColor.styleId == 0) {
        // 清仓取消颜色选择的情况调item-info 接口不传尺码
        delete params.color
        delete params.size
        delete params.style_ids
      }
      if (this.baseInfo.dressType === 'clearance') params.discount = -1
      this.$axios
        .$get(`/1.0/product/item-info`, {
          params
        })
        .then((res) => {
          if (res.code == 0) {
            const baseInfo = res.data.baseInfo
            const hasLinePrice = baseInfo.hasLinePrice
            const noDealPriceDisplay = baseInfo.noDealPriceDisplay
            const shopPriceDisplay = baseInfo.shopPriceDisplay
            const priceOffDisplay = baseInfo.priceOffDisplay
            const shopPrice = baseInfo.shopPrice
            const noDealPrice = baseInfo.noDealPrice
            const priceOff = baseInfo.priceOff
            const priceSymbol = baseInfo.priceSymbol
            const hasPriceRule = baseInfo.hasPriceRule
            const shownGoodsName = baseInfo.shownGoodsName
            const goodsUrl = baseInfo.goodsUrl
            const activityInfo = baseInfo.activityInfo
            const countdownEndTime = baseInfo.countdownEndTime
            const isMeasurementHideGoods = baseInfo.isMeasurementHideGoods
            const comingSoonInfo = baseInfo.comingSoonInfo
            const isComingSoon = baseInfo.isComingSoon
            const couponInfo = baseInfo.couponInfo || {}
            const _baseInfo = JSON.parse(JSON.stringify(this.baseInfo))
            this.flashSaleInfo = baseInfo.flashSaleInfo
            this.stickerInfo = res.data.stickers
            const imageInfo = res.data.imageInfo
            const warehouse = baseInfo.warehouse
            const sodPreSaleGoods = baseInfo.sodPreSaleGoods
            const swatchId = baseInfo.swatchId
            const hasRealStock = baseInfo.hasRealStock
            if (baseInfo.hasOwnProperty('clearanceDiscountStockNum') && baseInfo.clearanceDiscountStockNum) {
              this.stockInfo = this.updateStyleInfo(this.stockInfo, baseInfo.clearanceDiscountStockNum)
            }
            let sodGalleryVersion = 'a'
            if (imageInfo.goodsGallery[baseInfo.color] && imageInfo.goodsGallery[baseInfo.color].sodGalleyVersion) {
              sodGalleryVersion = imageInfo.goodsGallery[baseInfo.color].sodGalleyVersion
            }
            this.$store.commit('setSodGalleryVersion', sodGalleryVersion)

            this.retireInfo = res.data.retireInfo || {}
            this.$store.commit('product/setBaseInfo', {
              ..._baseInfo,
              hasLinePrice,
              noDealPriceDisplay,
              shopPriceDisplay,
              priceOffDisplay,
              shopPrice,
              noDealPrice,
              priceOff,
              priceSymbol,
              hasPriceRule,
              shownGoodsName,
              goodsUrl,
              activityInfo,
              countdownEndTime,
              isMeasurementHideGoods,
              comingSoonInfo,
              isComingSoon,
              couponInfo,
              warehouse,
              sodPreSaleGoods,
              swatchId,
              hasRealStock,
              activityCouponCode: baseInfo.activityCouponCode,
              discount: baseInfo.discount || '', // 使用sku对应的discount
              offRateValue: baseInfo.offRateValue,
              upToSaveRateValue: baseInfo.upToSaveRateValue || '',
              hasShopPriceRange: baseInfo.hasShopPriceRange, // AZWEB-21266 更新区间价
              minShopPriceDisplay: baseInfo.minShopPriceDisplay,
              maxShopPriceDisplay: baseInfo.maxShopPriceDisplay,
              rushSelectItems: baseInfo.rushSelectItems,
              afterPayTips: baseInfo.afterPayTips
            })
            if (!baseInfo.rushSelectItems) {
              this.$store.commit('product/setSelectRush', null) // 重置rush加急
            }
          }
        })
        .finally(() => {
          if (this.isSpecialCatId(this.baseInfo.catId)) {
            this.setBaseInfo('item-info')
          }
          this.$store.commit('product/setShowStockTips', true)
        })
    },
    /**
     * 获取 mostPopularList youMayAlsoLikeList 数据
     * 色卡相关的详情页获取的是 swatchesToDressList 数据（推荐逻辑不一致）
     */
    getSimilarPopular() {
      if (this.isSwatchModule) {
        this.$axios
          .$get(`/1.0/recommend/swatches-to-dress`, {
            params: {
              goods_id: this.baseInfo.goodsId,
              dress_type: this.baseInfo.dressType,
              color: this.selectedColor ? this.selectedColor.key : ''
            }
          })
          .then((res) => {
            if (res.code == 0) {
              this.swatchesToDressList = res.data.prodList || []
              this.swatchesToMobDressList = res.data.mobProdList || []
            }
          })
      } else {
        const params = {
          sodGalleryVersion: this.sodPreSalePicVersion, // sod 强制获取图片ab版本
          from_page: 'detail', // 鞋包：告诉后端这是详情页调用的
          goods_id: this.baseInfo.goodsId,
          cat_id: this.baseInfo.catId,
          dress_type: this.baseInfo.dressType,
          color: this.selectedColor ? this.selectedColor.key : '',
          size: this.selectedSize ? this.selectedSize.key : ''
        }
        if (this.isInCatIds(this.baseInfo.catId)) {
          params.view_mode = this.plusSizeView || this.selectedSize.isPlusSize ? 'plus' : 'petite' // 大小码图
        }
        this.$axios.$get(`/1.0/recommend/similar-popular`, { params }).then((res) => {
          if (res.code == 0) {
            const similar = res.data.similar || {}
            const mostPopular = res.data.mostPopular || {}
            if (similar.prodList && similar.prodList.length > 0) {
              this.youMayAlsoLikeList = similar.prodList.map((item, index) => {
                return {
                  ...item,
                  currentOrder: index // 鞋包做两排区分第几个商品
                }
              })
            } else {
              this.youMayAlsoLikeList = []
            }
            if (mostPopular && mostPopular.prodList) {
              this.mostPopularList = mostPopular.prodList
            } else {
              this.mostPopularList = []
            }
          }
        })
      }
    },
    getCompleteTheLookList(color) {
      const dataParam = {
        sodGalleryVersion: this.sodPreSalePicVersion, // sod 强制获取图片ab版本
        goods_id: this.baseInfo.goodsId,
        cat_id: this.baseInfo.catId,
        color: color || this.baseInfo.color,
        dress_type: this.baseInfo.dressType,
        exposure_goods_ids: [],
        abtest: 'A'
      }
      if (this.isInCatIds(this.baseInfo.catId)) {
        dataParam.view_mode = this.plusSizeView || this.selectedSize.isPlusSize ? 'plus' : 'petite' // 大小码图
      }
      this.$axios.$post(`/1.0/product/new-complete-the-look`, dataParam).then((res) => {
        if (res.code == 0) {
          if (res.data.prodList && res.data.prodList.length > 0) {
            // todo: complete the look 只展示3屏，每屏4个商品
            this.completeTheLookList = res.data.prodList.slice(0, 12)
          } else {
            this.completeTheLookList = []
          }
        }
      })
    },
    getRecentlyList() {
      try {
        const recentReviewed = localStorage.getItem('recently_viewed')
        if (recentReviewed) {
          const viewedArr = JSON.parse(recentReviewed)
            .map((item) => {
              if (item.id !== this.baseInfo.goodsId) {
                return {
                  goods_id: item.id,
                  color_name: item.color,
                  dress_type: item.type,
                  goods_style_id: item.style_id
                }
              }
            })
            .filter((item) => item)
          const dataParam = {
            sodGalleryVersion: this.sodPreSalePicVersion, // sod 强制获取图片ab版本
            goods_id: this.baseInfo.goodsId,
            goods_style_id: this.selectedColor.styleId,
            dress_type: this.baseInfo.dressType,
            view_data: viewedArr
          }
          if (this.isInCatIds(this.baseInfo.catId)) {
            dataParam.view_mode = this.plusSizeView || this.selectedSize.isPlusSize ? 'plus' : 'petite' // 大小码图
          }
          this.$axios.$post(`/1.0/recommend/recently-view`, dataParam).then((res) => {
            if (res.code == 0) {
              if (res.data.prodList && res.data.prodList.length > 0) {
                this.$set(this, 'recentlyList', res.data.prodList.reverse() || [])
              }
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    setRecentlyCookie() {
      const goodsId = this.baseInfo.goodsId
      const viewedArr = []
      const viewedStr = localStorage.getItem('recently_viewed')
      let index = 0
      if (viewedStr) {
        let vviewedObj = {}
        try {
          vviewedObj = JSON.parse(decodeURIComponent(viewedStr))
        } catch (error) {
          // 这里先关掉 console
          // console.log(error)
        }
        for (const key in vviewedObj) {
          // 排除当前页面的goodsId(样衣和正式衣服算做两件)，放到最后面
          // 时装类 同款式不同颜色的商品均展示
          if (!this.isSpecialCatId(this.baseInfo.catId)) {
            if (vviewedObj[key].id == goodsId && vviewedObj[key].type == this.baseInfo.dressType) {
              continue
            }
          } else if (
            vviewedObj[key].id == goodsId &&
            vviewedObj[key].type == this.baseInfo.dressType &&
            vviewedObj[key].color == this.selectedColor.name
          ) {
            continue
          }
          if (vviewedObj[key].id && vviewedObj[key].type && vviewedObj[key].color) {
            // viewedArr[index] = vviewedObj[key]
            viewedArr.push(vviewedObj[key])
            index++
          }
        }
        if (index > 18) {
          viewedArr.shift()
        }
      }
      // 插入当前页面的 goodsId
      const data = {
        id: goodsId,
        type: this.baseInfo.dressType,
        color: this.selectedColor.name ? this.selectedColor.name : this.baseInfo.defaultColor
      }
      // 时装类
      if (this.isSpecialCatId(this.baseInfo.catId)) {
        data.style_id = this.selectedColor.styleId
        data.supportMultiColors = true // 传给app使用，不同颜色都展示
      }
      if (goodsId && this.baseInfo.dressType && data.color) {
        viewedArr.push(data)
      }
      localStorage.setItem('recently_viewed', JSON.stringify(viewedArr))
      // 详细埋点信息
      this.setRecentViewGoodsCookie(goodsId)

      return index
    },
    // 商品浏览详细埋点
    setRecentViewGoodsCookie(goodsId) {
      const viewedGoodsStr = localStorage.getItem('recent_view_good_list')
      const viewTime = Date.parse(new Date()) / 1000

      let viewedGoodsList = []
      const sigleGoodDetail = {
        id: this.baseInfo.goodsId,
        type: this.baseInfo.dressType,
        color: this.selectedColor.name,
        viewTime
      }
      if (viewedGoodsStr) {
        let viewedGoods = []
        try {
          viewedGoods = JSON.parse(decodeURIComponent(viewedGoodsStr))
        } catch (error) {
          console.log(error)
        }
        for (const key in viewedGoods) {
          viewedGoodsList.push(viewedGoods[key])
        }
      }
      viewedGoodsList.push(sigleGoodDetail)

      viewedGoodsList = viewedGoodsList.length <= 18 ? viewedGoodsList : viewedGoodsList.slice(-18)

      // 写入商品浏览历史COOKIE
      localStorage.setItem('recent_view_good_list', JSON.stringify(viewedGoodsList))
    },
    setBaseInfo(from) {
      const _baseInfo = JSON.parse(JSON.stringify(this.baseInfo))
      if (this.selectedColor.key != '') {
        _baseInfo.color = this.selectedColor.key
        _baseInfo.shownColor = this.selectedColor.name
        _baseInfo.colorId = this.imageInfo.colorIdMap[this.selectedColor.key]
        if (!this.imageInfo.goodsGallery[this.selectedColor.key]) return
        let images = this.imageInfo.goodsGallery[this.selectedColor.key].images
        if (_baseInfo.hasSash) {
          let key = this.selectedSashColor.key
          if (key != '') {
            _baseInfo.sashColor = this.selectedSashColor.key
            _baseInfo.shownSashColor = this.selectedSashColor.name
            _baseInfo.sashColorId = this.imageInfo.colorIdMap[this.selectedSashColor.key]
          }
          if (key == '' || !images[key]) {
            key = this.defaultSelectedSashColor.key
            if (_baseInfo.dressType == 'sample' || _baseInfo.dressType == 'clearance' || _baseInfo.dressType == 'outlet') {
              const sashColors = Object.keys(this.stockInfo.colorMap[this.baseInfo.color].allSashColor)
              key = sashColors[0]
            }
          }
          images = images[key]
        }
        _baseInfo.goodsThumb = images ? images[0].imgUrl : _baseInfo.goodsThumb
      }
      // 由于点击颜色需要切换商品名称和商品链接，如果从接口拿会比较慢，所以先由前端根据基本信息匹配，再从接口拿，以防止匹配有错的情况
      // SOD:3,JBD:9,BD:7,WD:2,MOB:8,FGD:10,Separate:139 atelier:3110, maternity-bridesmaid-dresses:45, modest-bridesmaid-dresses:158
      if (
        ([9, 7, 2, 8, 10, 139, 45, 158].includes(this.baseInfo.catId) || this.isSpecialCatId(this.baseInfo.catId)) &&
        !['sample', 'clearance', 'outlet'].includes(this.baseInfo.dressType)
      ) {
        const regex = /\{Color\}/g
        const _regex = /\{color\}/g
        let goodsStyleId = ''
        if (this.baseInfo.goodsStyleIdInfo && this.selectedColor.key && this.baseInfo.goodsStyleIdInfo[this.selectedColor.key]) {
          goodsStyleId = this.baseInfo.goodsStyleIdInfo[this.selectedColor.key].goodsStyleId
        }
        // AZWEB-21478 商详切换颜色时URL按EN标准展示
        if (!this.isSpecialCatId(this.baseInfo.catId)) {
          _baseInfo.shownGoodsName = this.baseInfo.goodsName.replace(regex, this.selectedColor.name)
          _baseInfo.goodsUrl =
            this.baseInfo.goodsDefaultUrl.replace(_regex, this.selectedColor.key.toLowerCase().replace(/_|\//g, '-')) + '/' + goodsStyleId
        }
        // 特殊处理barbie颜色路径
        if (_baseInfo.goodsUrl.includes('barbie™-pink')) {
          _baseInfo.goodsUrl = _baseInfo.goodsUrl.replace('barbie™-pink', 'barbie-pink')
        }
        this.$store.commit('product/setBaseInfo', _baseInfo)
        // 切换颜色更改浏览器地址
        history.pushState('', '', this.HTTPS_HOST + this.countryUrl(_baseInfo.goodsUrl + window.location.search))
      } else {
        const color = this.getQueryValue(this.baseInfo.goodsUrl, 'color')
        _baseInfo.goodsUrl = _baseInfo.goodsUrl.replace(color, _baseInfo.shownColor.toLowerCase().replace(/\s+/g, '-'))
        this.$store.commit('product/setBaseInfo', _baseInfo)
      }
    },
    quickShopClick(params) {
      // quick-shop-dialog组件 的 :fromDialog 单独处理 addCartDialog 。其他的还是走原来的逻辑， 'product'
      if (params.fromDialog === 'addCartDialog') {
        this.quickShopFromDialog = params.fromDialog
      } else {
        this.quickShopFromDialog = 'product'
      }
      // 详情页often_bought_with做订单追踪区分 param接收到scene参数会设置quick-shop的scene prop
      if (params.scene && params.scene === 'product') {
        this.scene = params.scene
      }
      this.$refs.quickShopDialog.quickShopClick(params)
    },
    getCartInfo() {
      this.$refs.main.getCartInfo()
    },
    setViewProductGA4() {
      // ga4打点 浏览产品详情页
      const gaParams = {
        event: 'ga4Event',
        event_name: 'view_item',
        event_parameters: {
          product_name: this.baseInfo.shownGoodsName,
          currency: this.currencyCode,
          value: this.baseInfo.shopPrice,
          items: [
            {
              item_id: this.baseInfo.goodsId,
              item_name: this.baseInfo.shownGoodsName,
              item_category: this.baseInfo.catName,
              item_category2: this.baseInfo.shownColor,
              item_brand: this.baseInfo.brandId,
              price: this.baseInfo.shopPrice,
              sku_id: this.baseInfo.gaData && this.baseInfo.gaData.ecommProdId
            }
          ]
        }
      }
      this.setGA4DataLayer(gaParams)
    },
    resetSelectOptions() {
      // 判断默认尺码是否在sizes里面
      // stockInfo
      // styleInfo
      let tempSizes = []
      if (this.styleInfo && !this.styleInfo.hasSize) {
        tempSizes = []
      } else if (
        (this.baseInfo.isStockGoods || this.baseInfo.supportStockSales) &&
        (['clearance', 'outlet', 'sample'].includes(this.baseInfo.dressType) || this.baseInfo.isFinalSale)
      ) {
        for (const key in this.stockInfo.sizeMap) {
          if (this.styleInfo && this.styleInfo.styleInfoSizeMap && this.styleInfo.styleInfoSizeMap[key]) {
            tempSizes.push(this.styleInfo.styleInfoSizeMap[key])
          }
        }
      } else {
        tempSizes = (this.styleInfo && this.styleInfo.size) || []
      }
      if (this.selectedOptions) {
        if (!(tempSizes || []).some((item) => item.key == this.selectedOptions.size)) {
          this.$store.commit('product/setSelectedOptions', {})
        }
      }
    },
    // 获取免运费活动类型
    async getFreeShippingFeeReminder() {
      if (this.country == 'MX') return
      const params = {
        goods_id: this.baseInfo.goodsId,
        cat_id: this.baseInfo.catId,
        dress_type: this.baseInfo.dressType,
        sodGalleryVersion: this.sodPreSalePicVersion,
        from: 'product'
      }
      if (this.$route.query.hasOwnProperty('is_plus_size')) {
        params.view_mode = 'plus'
      }
      const resFreeShipping = await this.$axios.$get('/1.0/product/free-shipping-fee-reminder', {
        params: {
          ...params,
          color: this.baseInfo.color
        }
      })
      // 获取免运费活动类型接口处理
      if (resFreeShipping && resFreeShipping.data.showWordsType) {
        this.$store.commit('product/setShowWordsType', resFreeShipping.data.showWordsType)
      }
    },
    updateStyleInfo(stockInfo = {}, num) {
      if (this.baseInfo.dressType != 'clearance') {
        return stockInfo
      }
      if (this.selectedColor.key && this.selectedSize.key && num) {
        const tempKey = this.selectedColor.key + '*' + this.selectedSize.key
        stockInfo.stockNumberMap[tempKey] = parseInt(num)
      }
      return stockInfo
    }
  }
}
</script>

<style lang="less">
&.B {
  .current-price {
    color: var(--color-121212) !important;
  }
  .goods-price {
    color: var(--color-121212) !important;
  }
}

.product-box {
  .arraw-icon {
    width: 18px;
    height: 18px;
  }
  .prev-arraw,
  .next-arraw {
    display: block;
    cursor: pointer;
    background-image: none;
    width: auto;
    height: auto;
    &.swiper-button-disabled {
      cursor: default;
    }
    &:focus {
      outline: none;
    }
  }
  .main-content {
    max-width: 1920px;
    margin: 0 auto;
    padding: 0 30px;
    box-sizing: border-box;
    #bread_crumb {
      max-width: 100%;
    }
  }
  // comments: 非wgd样式css
  &.product-box-new {
    .main-content {
      .prod-thumb-box {
        display: flex;
        justify-content: space-between;
        .prod-picture-look {
          width: calc((100% - 20px) * 0.44);
        }
        .prod-info {
          width: calc((100% - 20px) * 0.56);
        }
      }
      #product_page_revires {
        max-width: 1860px;
      }
    }
    .recently-viewed-box {
      max-width: 1920px;
    }
    // comments: 1536临界值
    @media screen and (max-width: 1536px) {
      .main-content {
        .prod-thumb-box {
          .prod-picture-look,
          .prod-info {
            width: calc((100% - 20px) / 2);
          }
        }
      }
    }
  }
  // comments: wgd样式
  &.product-box-b {
    .main-content {
      .prod-thumb-box {
        display: grid;
        grid-template-columns: 36.12% 62.37%;
        column-gap: 30px;
        .prod-picture-look {
          width: 100%;
          margin-right: unset;
          .page-product-item-content-block {
            margin-bottom: 0;
          }
        }
        .prod-info {
          width: 100%;
          .add-to-bag-block {
            max-width: 808px;
            #add-to-bag,
            #buy-now {
              margin-top: 0;
            }
          }
        }
      }
    }
  }
}
</style>
