<template>
  <div class="index-box">
    <main-app :navigation="navigation">
      <div id="checkout-success" class="main">
        <!-- <checkout-progress></checkout-progress> -->
        <div class="top">
          <thank-you
            @showOrderDetail="showOrderDetail"
            @junpToOrder="junpToOrder"
            :unpaidOrders="unpaidOrders"
            :orderDetailShow="orderDetailShow"
            :purchaseSamples="purchaseSamples"
            :shippingInfo="shippingInfo"
          ></thank-you>
          <checkout-success-share v-if="!orderInfo.onlyGiftCard"></checkout-success-share>
        </div>
        <div
          v-if="hasBanner && versionObj.checkoutSuccessBannerAbtest == 'B' && country === 'US'"
          v-track.view.click="{
            common: getBiParams('ordersuccess', 'banner')
          }"
          class="banner-box"
        >
          <a :href="bannerInfo.link && !bannerInfo.link.startsWith('page_') ? bannerInfo.link : 'javascript:;'">
            <img :src="bannerInfo.imgUrl" class="img" alt="" />
          </a>
        </div>
        <!-- <template v-if="orderDetailShow && false">
          <template v-if="!allPaid">
            <div v-for="(orderV, orderKey) in orderInfoList" :key="orderKey">
              <pay-product-list
                :payProductList="orderInfoGoodsList[orderV.orderId]"
                :orderItemInfo="orderV"
                :isForOrder="true"
              ></pay-product-list>
              <order-summary-amount-info
                :width="'310px'"
                :checkoutSummary="orderV"
                :isForOrder="true"
                class="list-summary-amount"
              ></order-summary-amount-info>
              <az-button
                :id="`order-${orderV.orderSn}`"
                v-if="unpaidOrders.includes(orderV.orderSn)"
                :needIcon="false"
                @click="continueCheckout(orderV.orderSn)"
                class="btn btn-success continue-btn"
                tabindex="4"
                >{{ nl('page_common_continue_checkout') }}</az-button
              >
            </div>
            <div class="clearfix">
              <hollow-out-title :title="nl('page_checkout_order_information')" class="mb-15"></hollow-out-title>
              <order-suc-address></order-suc-address>
            </div>
          </template>

          <template v-else>
            <div class="order-b">
              <div class="order_info_title">
                {{ nl('page_checkout_order_information') }}
              </div>
              <div id="pay_product_list_mask" v-if="orderGoodsList.length && notShowAllGoods">
                <span @click="notShowAllGoods = false">{{ nl('page_common_see_more') }}</span>
              </div>
              <pay-product-list
                :class="{ not_show_all_goods: notShowAllGoods }"
                :payProductList="orderGoodsList"
                :isForOrder="true"
                :purchaseSamples="purchaseSamples"
                style="margin-top:0;"
              ></pay-product-list>
            </div>
            <div class="order-suc-info">
              <order-suc-address v-if="!purchaseSamples"></order-suc-address>
              <div v-else width="1px"></div>
              <order-summary-amount-info :width="'310px'" :checkoutSummary="orderInfo" :isForOrder="true"></order-summary-amount-info>
            </div>
          </template>
        </template> -->
        <ProductModule v-bind="youLikeBindValue" ec="ordersuccess" />
        <!-- 校园大使入口（美国站显示） -->
        <ambassador-apply v-if="['US', 'CA', 'GB', 'AU'].includes(country)"></ambassador-apply>
        <guest-checkout-guide v-if="orderInfo.isGuest"></guest-checkout-guide>
        <suggest-prod-list-swiper
          v-if="suggestProdList && Object.keys(suggestProdList).length > 0"
          :suggestProdList="suggestProdList"
          style="padding:0;"
        ></suggest-prod-list-swiper>
      </div>
    </main-app>
    <az-loading v-if="loadingFlag"></az-loading>
    <!-- <img :src="url" alt="" width="1" height="1" /> -->
  </div>
</template>

<script>
import MainApp from '@/components/Main'
// import CheckoutProgress from '@/components/checkout/CheckoutProgress'
import ThankYou from '@/components/checkout/ThankYou'
import CheckoutSuccessShare from '@/components/checkout/CheckoutSuccessShare'
// import PayProductList from '@/components/checkout/PayProductList'
// import OrderSucAddress from '@/components/checkout/OrderSucAddress'
// import OrderSummaryAmountInfo from '@/components/checkout/OrderSummaryAmountInfo'
import GuestCheckoutGuide from '@/components/checkout/GuestCheckoutGuide'
// import HollowOutTitle from '@/components/checkout/HollowOutTitle'
import AmbassadorApply from '@/components/checkout/AmbassadorApply'
// import AzButton from '@/components/az-ui/Button/AzButton'
import SuggestProdListSwiper from '@/components/common/SuggestProdListSwiper'
import azLoading from '@/components/az-ui/AzLoading'
import ProductModule from '@/components/product/ProductModule'
import { otherPageUrlToFormatUrl } from '@/assets/js/utils.js'
import { init, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { mapState } from 'vuex'

export default {
  name: 'CheckoutSuccess',
  components: {
    MainApp,
    // CheckoutProgress,
    ThankYou,
    CheckoutSuccessShare,
    // PayProductList,
    // OrderSucAddress,
    // OrderSummaryAmountInfo,
    GuestCheckoutGuide,
    AmbassadorApply,
    // HollowOutTitle,
    // AzButton,
    SuggestProdListSwiper,
    azLoading,
    ProductModule
  },
  data() {
    return {
      notShowAllGoods: false,
      orderDetailShow: false,
      suggestProdList: {},
      loadingFlag: true, // 第三方加载loading
      pollingTimes: 0 // googlepay 接口轮询次数
    }
  },
  computed: {
    ...mapState('checkout', ['orderInfo', 'orderGoodsList', 'orderInfoList', 'orderInfoGoodsList', 'allPaid']),
    unpaidOrders() {
      const arr = []
      for (let i = 0; i < this.orderInfoList.length; i++) {
        const item = this.orderInfoList[i]
        if (item.payStatus != 2) {
          // 支付失败订单
          arr.push(item.orderSn)
        }
      }
      return arr
    },
    purchaseSamples() {
      return this.orderInfo.orderType == 'sample'
    },
    mainOrderCoupon() {
      // 主订单的 couponCode,由于 orderInfo 中没有给， orderInfoList中给了，所以从orderInfoList 中取
      let couponCode = ''
      for (let i = 0; i < this.orderInfoList.length; i++) {
        const item = this.orderInfoList[i]
        if (item.orderSn === this.orderInfo.orderSn) {
          couponCode = item.couponCode
        }
      }
      return couponCode
    },
    youLikeBindValue({ recommendList }) {
      return {
        moduleKey: 'youmayalsolike',
        list: recommendList,
        title: 'page_common_you_may_also_like',
        swiperText: 'youLikeSwiper',
        fromText: 'youmayalsolike',
        moduleTitle: 'order_success_you_may_also_like'
      }
    },
    bannerInfo() {
      return {
        imgUrl: this.nl('page_image_checkoutsuccess_banner_img_pc'),
        link: this.nl('page_checkoutsuccess_banner_link_pc')
      }
    },
    hasBanner() {
      return this.bannerInfo && this.bannerInfo.imgUrl && !this.bannerInfo.imgUrl.startsWith('page_') // 如果没有配置多语言
    }
  },
  watch: {
    orderInfo(val) {
      if (process.client) {
        this.fbPoint(val)
      }
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      const query = otherPageUrlToFormatUrl(commonAsyncData.requestUrl)
      const res = await context.$axios.$get(`/1.0/order/success`, { params: { ...query, type: 'firstScreen' } })
      const alsoRes = await context.$axios.$get('/1.0/recommend/order-success-also-like')
      if (res.code == 0) {
        context.store.commit('checkout/setFillGoodsBundleList', res.data.fillGoodsBundleList) // buy more save more bundle list
        // comments: pageview 打点用数据
        context.store.commit('checkout/setOrderAllList', res.data)
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else if (res.code == 100501) {
        // 未登录
        context.redirect(302, resetSeoUrl(context, `/user/login?back=${context.route.fullPath}`))
        return
      } else if (res.code == 65001) {
        // 不是自己订单
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return
      } else {
        context.redirect(302, resetSeoUrl(context, '/cart'))
        return
      }
      context.store.commit('setJsKey', 'checkoutSuccess')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        query,
        paymentId: res.data.paymentInfo && res.data.paymentInfo.paymentId,
        shippingInfo: res.data.shippingInfo,
        recommendList: alsoRes.data.recommendList || []
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
    this.orderDetailShow = this.country != 'CA' && !this.orderInfo.isGuest
    if (process.client) {
      this.getFirstScreenInfo([261, 264, 265, 266, 268, 269].includes(this.paymentId) ? 'firstScreen' : '')
    }
  },
  methods: {
    fbPoint(info) {
      const url =
        'https://www.shareasale.com/sale.cfm?tracking=' + info.orderSn + '&amount=' + info.totalAmount + '&merchantID=56053&transtype=sale'
      const imgEle = document.createElement('img')
      imgEle.src = url
      imgEle.style.width = '1px'
      imgEle.style.height = '1px'
      document.body.appendChild(imgEle)
    },
    // 首屏信息更换到客户端获取
    async getFirstScreenInfo(type) {
      const params = this.query
      if (params.type) delete params.type
      if (type) params.type = type
      const res = await this.$axios.$get('/1.0/order/success', { params })
      this.pollingTimes++
      if (res.code == 0) {
        // googlepay 支付回调结果有延迟，allPaid flase 时需要前端轮询接口 && !res.data.allPaid
        // AZWEB-22102 FR国家站 CKO 卡支付开启3DS认证 paymentId:267
        if (type && res.data.paymentInfo && [261, 264, 265, 268, 269, 267].includes(res.data.paymentInfo.paymentId)) {
          if (this.pollingTimes < 10 && !res.data.allPaid) {
            this.getFirstScreenInfo(type) // type不传firstScreen,游客会清空token,轮询接口会报错
            return
          }
          this.loadingFlag = false
          this.getFirstScreenInfo('') // type不传firstScreen,游客需要清空token
          return
        }
        this.$store.commit('checkout/setCheckoutBaseInfo', { ...res.data, baseInfoKey: 'checkoutSuccess' })
        this.suggestProdList = res.data.recommend || {}
        this.loadingFlag = false
        // 页面加载完成打点
        if (this.$cookie.getCookie(`orderSn${this.orderInfo.orderSn}`) !== this.orderInfo.orderSn) {
          this.$cookie.setCookie(`orderSn${this.orderInfo.orderSn}`, this.orderInfo.orderSn, 60, '.' + this.APP_DOMAIN_LOWER)
          this.trackPurchase({ style_ids: this.orderGoodsList, value: this.orderInfo.goodsAmount, orderSn: this.orderInfo.orderSn })
          this.trackInitiateCheckoutSuccess(this.orderInfo)
          if (this.country == 'US') {
            this.trackUpfluenceFun(this.orderInfo)
          }
          this.renderOptIn(this.orderInfo)
          // ga4打点 支付成功页加载
          this.setCheckoutSucGA4()
        }
      }
    },
    showOrderDetail() {
      this.orderDetailShow = true
    },
    continueCheckout(orderSn) {
      if (orderSn) {
        location.href = this.countryUrl(`/checkout?order_sn=${orderSn}`)
      }
    },
    junpToOrder(order) {
      document.querySelector(`#order-${order}`) && document.querySelector(`#order-${order}`).scrollIntoView(false)
    },
    renderOptIn(info) {
      const that = this
      const orderInfo = info || that.orderInfo
      if (!orderInfo.orderSn) return
      window.gapi.load('surveyoptin', function() {
        window.gapi.surveyoptin.render({
          // REQUIRED FIELDS
          merchant_id: 103331110,
          order_id: orderInfo.orderSn,
          email: that.userInfoEmail,
          delivery_country: orderInfo.countryCode || that.country,
          estimated_delivery_date: orderInfo.endDeliveryTime
        })
      })
    },
    setCheckoutSucGA4() {
      const items = []
      this.orderGoodsList.forEach((item) => {
        items.push(this.getGA4CheckoutItem(item))
      })
      const gaParams = {
        event: 'ga4Event',
        event_name: 'purchase',
        user_email: this.orderInfo.email,
        user_phone: this.orderInfo.tel,
        event_parameters: {
          currency: this.currencyCode,
          transaction_id: this.orderInfo.orderTrackId,
          value: this.orderInfo.totalAmount * 1, // 订单总金额,
          coupon: this.mainOrderCoupon,
          shipping: this.orderInfo.shippingFee * 1,
          tax: this.orderInfo.taxFee * 1,
          items
        }
      }
      this.setGA4DataLayer(gaParams)
    },
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        ec,
        el,
        msg: JSON.stringify({
          picurl: this.bannerInfo && this.bannerInfo.imgUrl
        })
      }
      return obj
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 1140px;
  padding: 40px 30px 0px 30px;
  min-height: 535px;
  font-size: 12px;
  color: var(--color-121212);
  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
    /deep/ .thank-you {
      width: 580px;
    }
  }
  .banner-box {
    .img {
      width: 100%;
      height: auto;
      vertical-align: middle;
    }
  }
  .order-suc-info {
    display: flex;
    justify-content: space-between;
  }
  .list-summary-amount {
    margin-left: 100%;
    transform: translateX(-100%);
    margin-bottom: 25px;
  }
  .continue-btn {
    margin-left: 100%;
    transform: translateX(-100%);
    box-sizing: border-box;
    width: 290px;
    padding: 12px 10px;
    font-weight: 600;
    letter-spacing: 1px;
    margin-bottom: 25px;
    &.disabled {
      background-color: #666;
    }
  }
  .order-b {
    position: relative;
  }
  .order_info_title {
    border-bottom: 1px solid var(--color-cccccc);
    font-size: 16px;
    padding-bottom: 5px;
    font-weight: bold;
    text-transform: uppercase;
  }
  /deep/ .product-module-container {
    margin: 40px 0px;
    .module-title {
      font-size: 24px;
      line-height: normal;
      font-family: @font-family-500;
      padding: 10px;
      border-bottom: 1px solid #ccc;
      box-shadow: none;
      margin-bottom: 15px;
    }
  }
  /deep/ .az-footer-box {
    margin-top: 80px;
  }
  /deep/ .swiper-wrapper {
    .swiper-slide {
      // max-height: 316px;
      max-width: 175px;
      margin-right: 10px;
    }
  }
}
.order-suc-info {
  margin-top: 13px;
}
#pay_product_list_mask {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 3;
  top: 60px;
  width: 1276px;
  height: 147px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
  color: #666;
  font-size: 13px;
  text-decoration: underline;
  span {
    cursor: pointer;
  }
}
/deep/ .pay-product-list.not_show_all_goods {
  .product-list {
    max-height: 147px;
    overflow: hidden;
  }
}
/deep/ input:focus {
  border-color: var(--color-121212) !important;
  background: #fff !important;
}
/deep/ textarea:focus {
  border-color: var(--color-121212) !important;
  background: #fff !important;
}
</style>
