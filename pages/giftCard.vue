<template>
  <div :class="['gift-card-box']">
    <main-app ref="main" :navigation="navigation" :prodList="[{ goodsId: baseInfo.goodsId }]">
      <div class="main-content">
        <bread-crumb :baseInfo="baseInfo" :hasCatName="false"></bread-crumb>
        <div class="prod-thumb-box">
          <section class="prod-picture-look gift-card-prod-picture-look">
            <gift-card-product-thumb :shareList="shareList"></gift-card-product-thumb>
          </section>
          <gift-card-product-info
            @quickShop="quickShopClick"
            v-bind="giftCardProductInfoBindValue"
            @getCartInfo="getCartInfo"
          ></gift-card-product-info>
        </div>
        <div class="gift-card-selling-points">
          <img :src="addWebpSuffix(nl('page_image_gift_card_selling_points_pc_1'))" alt="gift card1" class="points-item" />
          <img :src="addWebpSuffix(nl('page_image_gift_card_selling_points_pc_2'))" alt="gift card2" class="points-item" />
        </div>
        <client-only v-if="!is_chrome_lighthouse">
          <reviews-qa-mix :questionInfo="questionInfo" @questionsChange="questionsChange" :from="'giftcardProduct'"> </reviews-qa-mix>
          <quick-shop-dialog ref="quickShopDialog" :fromDialog="quickShopFromDialog" @refreshCartList="getCartInfo()"></quick-shop-dialog>
        </client-only>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import breadCrumb from '@/components/product/Breadcrumb'
import GiftCardProductThumb from '@/components/giftCard/GiftCardProductThumb'
import GiftCardProductInfo from '@/components/giftCard/GiftCardProductInfo'
import ReviewsQaMix from '@/components/product/ReviewsQaMix'
import quickShopDialog from '@/components/quickshop/QuickShopDialog'
import { init, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { otherPageUrlToFormatUrl } from '@/assets/js/utils.js'
import { mapState } from 'vuex'
import colorHex from '@/assets/js/colorHex'

export default {
  name: 'GiftCard',
  components: {
    mainApp,
    breadCrumb,
    GiftCardProductThumb,
    GiftCardProductInfo,
    ReviewsQaMix,
    quickShopDialog
  },
  mixins: [colorHex],
  data() {
    return {
      questionInfo: {},
      quickShopFromDialog: 'product'
    }
  },
  computed: {
    ...mapState('giftCard', ['giftCardInfo']),
    ...mapState('product', ['baseInfo']),
    giftCardProductInfoBindValue({ detailsInfo, videoInfo, styleInfo, swatchInfo, makeTimeInfo, reviewInfo, shareList, giftInfo }) {
      return {
        detailsInfo,
        videoInfo,
        styleInfo,
        swatchInfo,
        makeTimeInfo,
        reviewInfo,
        shareList,
        giftInfo
      }
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context, 'product')
      if (!commonAsyncData) return

      context.store.commit('setJsKey', 'giftCard')
      const query = otherPageUrlToFormatUrl(commonAsyncData.requestUrl)
      let url = '/1.0/product/first-screen'
      if (query.hasOwnProperty('goods_id')) {
        url = url + '?goods_id=' + escape(query.goods_id)
      } else if (query.hasOwnProperty('goods_name')) {
        const goodsName = query.goods_name
        url = url + '?goods_name=' + escape(goodsName)
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
          url += '&' + escape(i) + '=' + escape(param)
        }
      }
      // 首屏接口
      const [res] = await Promise.all([context.$axios.$get(url)])
      // code等于5表明redis链接失败，需要用户刷新重试
      if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, resetSeoUrl(context, `/sale_down?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return false
      }

      context.store.commit('product/setBaseInfo', res.data.baseInfo)
      if (res.data.giftCardInfo) {
        const giftCardInfo = res.data.giftCardInfo
        // 对giftCardInfo.cardImage中的数据去重
        if (giftCardInfo.cardImage) {
          const resMap = new Map()
          giftCardInfo.cardImage = giftCardInfo.cardImage.filter((item) => !resMap.has(item.imgId) && resMap.set(item.imgId, 1))
        }
        context.store.commit('giftCard/setGiftCardInfo', giftCardInfo)
      } else {
        context.redirect(302, resetSeoUrl(context, `/sale_down?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return false
      }

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        detailsInfo: res.data.detailsInfo,
        reviewInfo: res.data.reviewInfo,
        videoInfo: res.data.videoList,
        styleInfo: res.data.styleInfo,
        giftInfo: res.data.giftInfo,
        swatchInfo: res.data.swatchInfo,
        makeTimeInfo: res.data.makeTimeInfo,
        shareList: res.data.shareInfo.list,
        dataLayerInfo: res.data.dataLayerInfo,
        url
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
    this.initGiftCardFrom()
    if (process.client) {
      this.$axios.$get(this.url.replace('first-screen', 'second-screen')).then((res) => {
        this.questionInfo = res.data.questionInfo || {}
        this.$set(this, 'reviewInfoObject', res.data.reviewInfo || this.reviewInfoObject)
        // this.popularColors = res.data.popularColor || {}
        this.retireInfo = res.data.retireInfo || {}
        this.stickerInfo = res.data.stickers
        this.customSizeInfo = res.data.customSizeInfo || {}
      })
      this.getColorHexAjax()
    }
  },
  mounted() {
    // ga4打点 浏览产品详情页（View Product Detail Page）*可多规格选择的产品，仅需触发1次
    this.setViewProductGA4()
  },
  methods: {
    initGiftCardFrom() {
      if (this.baseInfo.isGiftCard && this.giftCardInfo) {
        // 处理giftcard表单数据以及默认值
        const giftCardFromData = {
          to_email: '',
          from_user: '',
          card_msg: this.nl('page_gift_card_detail_message_default'),
          goods_number: 1,
          delivery_date: '',
          confirmCheckbox: false,
          selectedGiftCard: {},
          selectedCardPrice: {},
          selectedShippingType: {},
          giftCardDefaultImgUrl: this.giftCardInfo.giftCardDefaultImgUrl
        }
        if (this.giftCardInfo.cardImage) {
          this.giftCardInfo.cardImage.forEach((item) => {
            if (item.selected) {
              giftCardFromData.selectedGiftCard = item
            }
          })
          if (!giftCardFromData.selectedGiftCard || !Object.keys(giftCardFromData.selectedGiftCard).length) {
            giftCardFromData.selectedGiftCard = this.giftCardInfo.cardImage[0]
          }
        }
        if (this.giftCardInfo.fixedPrice) {
          this.giftCardInfo.fixedPrice.forEach((item) => {
            if (item.selected) {
              giftCardFromData.selectedCardPrice = item
            }
          })
          if (!giftCardFromData.selectedCardPrice || !Object.keys(giftCardFromData.selectedCardPrice).length) {
            giftCardFromData.selectedCardPrice = this.giftCardInfo.fixedPrice[0]
          }
        }
        if (this.giftCardInfo.shippingType) {
          this.giftCardInfo.shippingType.forEach((item) => {
            if (item.selected) {
              giftCardFromData.selectedShippingType = item
            }
          })
          if (!giftCardFromData.selectedShippingType || !Object.keys(giftCardFromData.selectedShippingType).length) {
            giftCardFromData.selectedShippingType = this.giftCardInfo.shippingType[0]
          }
        }
        this.$store.commit('giftCard/setGiftCardFromData', giftCardFromData)
      }
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
    quickShopClick(params) {
      // quick-shop-dialog组件 的 :fromDialog 单独处理 addCartDialog 。其他的还是走原来的逻辑， 'product'
      if (params.fromDialog === 'addCartDialog') {
        this.quickShopFromDialog = params.fromDialog
      } else {
        this.quickShopFromDialog = 'product'
      }
      this.$refs.quickShopDialog.quickShopClick(params)
    }
  }
}
</script>

<style lang="less" scoped>
.gift-card-box {
  .main-content {
    box-sizing: border-box;
    max-width: 1353px;
    width: 100%;
    clear: both;
    padding: 0;
    margin: auto;
    padding: 0 30px;
    .prod-thumb-box {
      display: flex;
      .gift-card-prod-picture-look {
        width: 52.6%;
        margin-right: 2.5%;
        max-width: 680px;
      }
    }
    .gift-card-selling-points {
      margin: 40px 0;
      .points-item {
        vertical-align: middle;
        width: 100%;
        height: auto;
      }
    }
  }
}
</style>
