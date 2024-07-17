<template>
  <div class="checkout-box">
    <SvgPayment />
    <!-- 支付加载态 -->
    <PaymentProcessing v-if="isPaymentProcessing" />
    <main-app ref="main" v-else :navigation="{}" :isSimple="true">
      <div id="checkout" class="main">
        <checkout-progress></checkout-progress>
        <top-warning></top-warning>
        <div :class="{ 'pay-right-inner-fix': payRightInnerFix && !popupGiftCardVerifyShow }" class="pay-right">
          <order-summary
            ref="orderSummary"
            @setCheckoutAmount="getCheckoutAmount"
            :couponApplySuc="couponApplySuc"
            :continuePayFlag="continuePayFlag"
            :purchaseSamples="purchaseSamples"
            :isSwatchRedelivery="isSwatchRedelivery"
            :resParams="resParams"
            :refreshCoupons="refreshCoupons"
            @setCheckoutGA4="setCheckoutGA4"
          ></order-summary>
          <!-- <shipping-fee v-if="country != 'CA'"></shipping-fee> -->
          <checkout-icon></checkout-icon>
        </div>
        <div :class="{ 'only-gift-card': orderInfo.onlyGiftCard }" class="pay-left">
          <buy-now-notice v-if="buyNowNotice"></buy-now-notice>
          <!-- chekout -->
          <template v-else>
            <checkout-login
              v-if="!isLogin && !orderInfo.orderSn && userInfoUpdated && !$route.query.origin_order_sn"
              @guestEmailBlur="handleGuestEmailBlur"
            ></checkout-login>
            <div v-if="showSodCouponTips && !selectCouponCode" class="sod-coupon-checkout-tips-box">
              <az-icon icon-class="sod-coupon-checkout-tips" class="tips-item-icon"></az-icon>
              <span class="tips-item-text">{{ nl('page_common_expire_checkout_tip') }}</span>
            </div>
            <checkout-head-tips v-if="isSwatchRedelivery"></checkout-head-tips>
            <div v-if="userInfoUpdated && !isLogin" class="checkout-interested-box">
              <block-title :title="nl('page_common_new_user_role_title').replace('*', '')"></block-title>
              <Interested :goods-id="payProductGoodsIds" @on-change="interestedChange" />
              <p v-if="categoryError" class="error-tip animated-shake">{{ nl('page_common_new_user_role_error') }}</p>
            </div>
            <template v-if="!orderInfo.onlyGiftCard">
              <event-date v-if="eventDateShow && showEventDate"></event-date>
              <guest-checkout v-if="guestAddress && (orderInfo.orderSn || $route.query.origin_order_sn)"></guest-checkout>
              <shipping-address
                v-if="!purchaseSamples"
                @setCheckoutGA4="setCheckoutGA4"
                :shippingAddressList="Object.keys(shippingAddress).length ? shippingAddress : []"
                @setCheckoutAmount="getCheckoutAmount"
              ></shipping-address>
              <shipping-method
                @setCheckoutAmount="getCheckoutAmount"
                v-if="!purchaseSamples"
                @setCheckoutGA4="setCheckoutGA4"
              ></shipping-method>
            </template>
          </template>

          <payment-and-billing
            v-if="checkoutSummary.totalAmount * 1 > 0 || isCancleCoupon"
            :billingAddress="billingAddress && Object.keys(billingAddress).length ? billingAddress[0] : {}"
          ></payment-and-billing>

          <pay-product-list
            :payProductList="payProductList"
            :purchaseSamples="purchaseSamples"
            :isSwatchRedelivery="isSwatchRedelivery"
          ></pay-product-list>
        </div>
        <!-- shipping fee 弹框 -->
        <shipping-fee-layer></shipping-fee-layer>
        <!-- 下单、唤起三方支付加载态 -->
        <ca-payment-dialog></ca-payment-dialog>
      </div>
      <!-- 报错提示弹框 -->
      <error-dialog @continuePay="continuePay" @logout="logout"></error-dialog>
      <afterpay-layer></afterpay-layer>
      <checkout-retrieve
        :visible.sync="showCheckoutRetrieve"
        :info="retrieveActivitySummary"
        :couponInfo="couponInfo"
        @onBack="handleRetrieveBack"
      ></checkout-retrieve>
    </main-app>
    <!-- 三方需要用户主动点击唤起支付的确认弹框 -->
    <popup-pay-processing v-if="popupPayProcessingShow"></popup-pay-processing>
    <!-- 调validate接口更新summary数据使用的加载态 -->
    <az-loading v-if="loadingFlag"></az-loading>
    <!-- checkout有比cart更优coupon，使用更优coupon给提示 -->
    <!-- <az-toast ref="checkoutToast" :message="moreFavourableCouponCodeTips" :duration="3000"></az-toast> -->
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import PaymentProcessing from '@/components/checkout/PaymentProcessing'
import TopWarning from '@/components/checkout/TopWarning'
import CheckoutProgress from '@/components/checkout/CheckoutProgress'
import CheckoutLogin from '@/components/checkout/CheckoutLogin'
import BuyNowNotice from '@/components/checkout/BuyNowNotice'
import CheckoutHeadTips from '@/components/checkout/CheckoutHeadTips'
import EventDate from '@/components/checkout/EventDate'
import GuestCheckout from '@/components/checkout/GuestCheckout'
import ShippingAddress from '@/components/checkout/ShippingAddress'
import ShippingMethod from '@/components/checkout/ShippingMethod'
import PaymentAndBilling from '@/components/checkout/PaymentAndBilling'
import payProductList from '@/components/checkout/PayProductList'
import orderSummary from '@/components/checkout/OrderSummary'
import checkoutIcon from '@/components/checkout/CheckoutIcon'
import shippingFeeLayer from '@/components/cart/ShippingFeeLayer'
import CaPaymentDialog from '@/components/checkout/CaPaymentDialog'
import ErrorDialog from '@/components/checkout/ErrorDialog'
import azLoading from '@/components/az-ui/AzLoading'
import AfterpayLayer from '@/components/common/AfterpayLayer'
import PopupPayProcessing from '@/components/checkout/PopupPayProcessing' // paypal、after pay 支付弹框被拦截时，显示支付弹框，点击再次支付
import CheckoutRetrieve from '@/components/checkout/CheckoutRetrieve'
import BlockTitle from '@/components/checkout/BlockTitle'
import Interested from '@/components/common/Interested'
import { init, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { mapState } from 'vuex'
import SvgPayment from '@/components/svgs/SvgPayment'
import { getCookieByString } from '../assets/js/pointUtil'

export default {
  name: 'Checkout',
  components: {
    AfterpayLayer,
    MainApp,
    CheckoutLogin,
    BuyNowNotice,
    CheckoutHeadTips,
    PaymentProcessing,
    TopWarning,
    CheckoutProgress,
    EventDate,
    GuestCheckout,
    ShippingAddress,
    PaymentAndBilling,
    payProductList,
    orderSummary,
    ShippingMethod,
    checkoutIcon,
    shippingFeeLayer,
    CaPaymentDialog,
    ErrorDialog,
    azLoading,
    PopupPayProcessing,
    CheckoutRetrieve,
    BlockTitle,
    Interested,
    SvgPayment
  },
  data() {
    return {
      continuePayFlag: false,
      couponApplySuc: false,
      payRightInnerFix: false,
      isCancleCoupon: false,
      refreshCoupons: '', // 是否刷新可用券列表
      moreFavourableCouponCodeTips: '',
      showSodCouponTips: false,
      showCheckoutRetrieve: false,
      showEventDate: false,
      retrieveActivitySummary: {} // 离开挽回弹框信息
    }
  },
  computed: {
    ...mapState('checkout', [
      'checkoutSummary',
      'shippingAddress',
      'billingAddress',
      'addressId',
      'paymentInfoList',
      'paymentId',
      'bankCardInfo',
      'couponInfo',
      'eventDate',
      'orderInfo',
      'loadingFlag',
      'isPaymentProcessing',
      'payProductList',
      'buyNowData',
      'buyNowNotice',
      'shippingMethodList',
      'shippingMethodId',
      'checkoutLoginEmail',
      'progressId',
      'errorTipCode',
      'popupPayProcessingShow',
      'useAccountBalanceFlag',
      'maxDiscountCouponCode',
      'selectCouponCode',
      'categoryError'
    ]),
    ...mapState('cart', ['parties']),
    ...mapState({
      popupGiftCardVerifyShow: (state) => state.giftCard.popupGiftCardVerifyShow
    }),
    purchaseSamples() {
      return this.orderInfo.orderType == 'sample'
    },
    eventDateShow() {
      return this.eventDate && this.eventDate.isShow && !this.purchaseSamples
    },
    isSwatchRedelivery() {
      // 色卡重发 标识 // 隐藏 payment-and-billing(0元订单会隐藏) 商品change coupon(自动填充),
      return this.orderInfo.orderType == 'swatches'
    },
    guestAddress() {
      const isTrue = this.orderInfo.isGuest
      if (isTrue) {
        this.setPoint('emailaddress', 'common', 'view')
      }
      return isTrue
    },
    // url路径中携带的订单国家code，或者接口返回数据中的orderInfo中的countryCode
    orderCountryCode() {
      const res = this.$route.query.order_country_code || this.orderInfo.countryCode
      return res
    },
    // validate和/1.0/address/myCoupon接口要传递的参数
    resParams() {
      const res = {
        address_id: this.addressId,
        pre_order_sn: this.orderInfo.orderSn,
        order_type: this.purchaseSamples ? 'sample' : this.isSwatchRedelivery ? 'swatches' : 'normal',
        origin_order_sn: this.purchaseSamples || this.isSwatchRedelivery ? this.$route.query.origin_order_sn || '' : '',
        rec_ids: this.purchaseSamples || this.isSwatchRedelivery ? this.$route.query.rec_ids || '' : '',
        buy_now: this.buyNowData,
        party_value: this.selectedParty && this.selectedParty != 1 ? this.selectedParty.value : '',
        show_room_id: this.selectedParty && this.selectedParty != 1 ? this.selectedParty.id : '',
        shipping_method_id: this.shippingMethodId,
        shipping_address: Object.keys(this.shippingAddress).length ? this.shippingAddress[0] : {},
        guest_email: this.checkoutLoginEmail,
        auto_use_coupon: this.isCancleCoupon ? 0 : 1 // 取消红包的时候要传0
      }
      if (this.orderCountryCode) {
        res.order_country_code = this.orderCountryCode
      }
      return res
    },
    payProductGoodsIds({ payProductList }) {
      // 指定goodsId的色卡归为wd
      const specialIds = [1061464, 1061465, 1061466, 1061467, 1061468, 1061469]
      const arr = []
      for (let i = 0; i < payProductList.length; i++) {
        const item = payProductList[i]
        if (item.isGift) {
          continue
        }
        if (specialIds.includes(item.goodsId) && item.catId == 33) {
          arr.push(2)
        } else {
          arr.push(item.catId)
        }
      }
      return [...new Set(arr)]
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      /* 如果url上携带redirectResult，表示是adyen渠道支付回调，需要查询支付结果 */
      if (context.route.query.redirectResult) {
        const adyenPaymentDetail = await context.$axios.$get(`/1.0/order/paymentDetails`, {
          params: {
            redirectResult: context.route.query.redirectResult,
            order_sn: context.route.query.order_sn,
            payment_id: context.route.query.payment_id
          }
        })
        if (adyenPaymentDetail.code === 0) {
          if (adyenPaymentDetail.data.resultCode === 'Authorised') {
            // 支付成功
            context.redirect(
              302,
              resetSeoUrl(
                context,
                `/checkout_success/orderconfirm/${context.route.query.order_sn}?order_country_code=${
                  context.route.query.order_country_code
                }${context.store.state.isBridal ? '&subsite=bridal' : ''}`
              )
            )
            return
          } else {
            const resultCodeMap = {
              Cancelled: 'page_checkout_adyen_payment_cancel',
              Error: 'page_checkout_adyen_payment_error',
              Pending: 'page_checkout_adyen_payment_pending',
              Received: 'page_checkout_adyen_payment_received',
              Refused: 'page_checkout_adyen_payment_refused'
            }
            context.store.commit('checkout/setErrorDialogShow', true)
            context.store.commit(
              'checkout/setErrorTipText',
              resultCodeMap[adyenPaymentDetail.data.resultCode] || 'page_checkout_afterpay_payment_error'
            )
            context.store.commit('checkout/setErrorTipCode', 'adyen_payment')
          }
        } else if (adyenPaymentDetail.code === 400212) {
          // 订单已支付
          context.redirect(
            302,
            resetSeoUrl(
              context,
              `/checkout_success/orderconfirm/${context.route.query.order_sn}?order_country_code=${context.route.query.order_country_code}${
                context.store.state.isBridal ? '&subsite=bridal' : ''
              }`
            )
          )
          return
        }
      }

      const applyCouponCode =
        (context.req &&
          context.req.headers &&
          context.req.headers.cookie &&
          getCookieByString('applyCouponCode', context.req.headers.cookie)) ||
        null // 记录的上一次手动输入的couponcode
      let res = await context.$axios.$get(`/1.0/order/checkout`, {
        params: {
          ...context.route.query,
          use_account_balance: true,
          shoppingcart_coupon_code: applyCouponCode,
          checkout_pay_abtest: context.store.state.versionObj.checkoutPayAbtest
        }
      })

      if (res.code == 400303) {
        res = await context.$axios.$get(`/1.0/order/checkout`, {
          params: context.route.query,
          shoppingcart_coupon_code: applyCouponCode,
          checkout_pay_abtest: context.store.state.versionObj.checkoutPayAbtest
        })
      }
      if (res.code == 0) {
        context.store.commit('checkout/setCheckoutBaseInfo', { ...res.data, baseInfoKey: 'checkout' })
        // coupon的错误
        if (!applyCouponCode && res.data.errors && res.data.errors.couponError && res.data.errors.couponError.msg) {
          context.store.commit('checkout/setCheckoutError', { isCouponError: res.data.errors.couponError.msg })
        }
        // buyNow party信息
        context.store.commit('checkout/setBuyNow', context.route.query.buy_now)
        const parties = res.data.parties
        context.store.commit('cart/setParties', parties)
        if (parties && Object.keys(parties).length) {
          parties.forEach((item) => {
            if (item.selected) {
              context.store.commit('cart/setSelectedParty', item)
            }
          })
        }
        context.store.commit('checkout/setFillGoodsBundleList', res.data.fillGoodsBundleList) // buy more save more bundle list
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return
      } else if (res.code == 800404) {
        // 参数中无可购买样衣
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return
      } else if (res.code == 100501) {
        // 未登录
        context.redirect(302, resetSeoUrl(context, `/user/login?back=${context.route.fullPath}`))
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
      } else if (res.code == 65001) {
        // 不是自己订单
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return
      } else {
        context.redirect(302, resetSeoUrl(context, '/cart'))
        return
      }
      context.store.commit('setJsKey', 'checkout')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo
        // paymentInfo: res.data.paymentInfo
      }
    } catch (error) {
      console.log(error)
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
    if (this.checkoutSummary.userAccountBalance > 0 && !this.orderInfo.hasGiftCard) {
      this.$store.commit('checkout/setUseAccountBalance', true)
    }
  },
  mounted() {
    this.handleHistoryBack()
    // 滚动视图打点
    const elementList = [
      {
        elementId: '#btn-change-prd',
        triggerPercentage: 1,
        currentStatus: false,
        eventCategory: 'NewStructureCheckout',
        eventLabel: 'NewStructureCheckout_Item_ChangeButton'
      }
    ]
    this.moduleVisibleDataLayer(elementList)
    this.$nextTick(() => {
      window.addEventListener('scroll', this.payRightScroll, false)
    })
    this.trackInitiateCheckout({
      style_ids: this.payProductList,
      value: this.checkoutSummary.totalAmount,
      orderTrackId: this.orderInfo && this.orderInfo.orderTrackId
    })
    // validate接口会返回可用coupon有关的数据，如果有coupon，自动填充coupon
    this.getCheckoutAmount()
    this.showEventDate = true
  },
  beforeDestroy() {
    window.removeEventListener('popstate', this.popStateHandler, false)
  },
  methods: {
    handleRetrieveBack() {
      // 返回清空保存coupon信息
      localStorage.removeItem('sodCouponCode')
      window.removeEventListener('popstate', this.popStateHandler, false)
      history.go(-1)
      history.go(-1)
    },
    // 处理浏览器返回操作监听
    popStateHandler(state) {
      this.showCheckoutRetrieve = true
    },
    // 添加浏览器返回操作监听
    handleHistoryBack() {
      if (window.history && window.history.length > 1 && window.history.pushState) {
        window.history.pushState('checkout', null, location.hash)
        window.addEventListener('popstate', this.popStateHandler, false)

        // 判断页面展示的场景，是否是在历史记录中通过浏览器后退/前进进入详情页，如果是，则不执行弹窗挽留监听
        window.addEventListener('pageshow', (event) => {
          // event.persisted属性为true时，表示当前文档是从往返缓存中获取(ios移动端通过浏览器的前进后退进入页面)，此时页面是不会刷新的，但是会触发 popstate。所以需要在一进来的时候把挽留弹窗关掉
          if (event.persisted) {
            this.showCheckoutRetrieve = false
            window.removeEventListener('popstate', this.popStateHandler, false)
          }
        })
      }
    },
    // 游客邮箱失去焦点
    handleGuestEmailBlur(e) {
      this.refreshCoupons = e.guestEmail
      //  通过点击切换支付方式而失去焦点，则paymentId还未更新，所以需要延迟200ms,同时避免点击place my order 失焦，click事件没有触发
      setTimeout(() => {
        this.$store.commit('checkout/setLoadingFlag', true)
        this.getCheckoutAmount(e)
      }, 200)
    },
    // 处理validate接口返回的成功数据
    handleValidateResult(data, res, applyData) {
      const { isFromApply, autoUseApply, applyCouponCode } = applyData
      // shippingInfo methodInfo 更新
      res.data.shippingInfo && this.$store.commit('checkout/setShippingInfo', res.data.shippingInfo)
      this.isCancleCoupon = false // 防止使用coupon之前是0元订单的情况，最终支付模块的展示与否还是要根据订单金额来确定
      if (res.data.errors && res.data.errors.couponError && res.data.errors.couponError.msg) {
        // 访客登录使用coupon后修改邮箱生成订单情况的处理
        if (data && data.isCheckoutLogin) this.$refs.orderSummary.isProcessing = false
        // coupon的错误
        this.$cookie.removeCookie('applyCouponCode')
        if (!autoUseApply) {
          this.$store.commit('checkout/setCheckoutError', { isCouponError: res.data.errors.couponError.msg })
        }
        this.couponApplySuc = false
        if (res.data.errors.couponError.eventName) {
          this.setPoint('coupon', 'apply', 'click', { success: 0 })
          this.setPoint('coupon', 'error', 'view', { error: res.data.errors.couponError.msg })
          this.setDataLayer({
            action: 'click',
            category: 'NewStructureCheckout',
            label: res.data.errors.couponError.eventName
          })
        }
      } else {
        // 清空现有的coupon错误
        this.$store.commit('checkout/setCheckoutError', { isCouponError: null })
        // 访客登录使用coupon后修改邮箱生成订单情况的处理
        if (data && data.isCheckoutLogin) this.$refs.orderSummary.createAndUpdateOrder()
        this.setPoint('coupon', 'apply', 'click', { success: 1 })
        // 16869有新的提示，所以这个toast就不需要了。
        // checkout有比cart更优coupon，使用更优coupon给提示
        // if (res.data.couponInfo && res.data.couponInfo.moreFavourableCouponCode) {
        //   this.moreFavourableCouponCodeTips = this.nl('page_checkout_more_favourable_coupon_tips')
        //   this.$refs.checkoutToast.show()
        // }
        this.$store.commit('checkout/setCouponInfo', Array.isArray(res.data.couponInfo) ? {} : res.data.couponInfo)
        //  如果是手动输入的coupon，记录下来，有效期是30min
        if (
          (isFromApply || autoUseApply) &&
          res.data.couponInfo &&
          res.data.couponInfo.code &&
          (res.data.couponInfo.code === applyCouponCode || !applyCouponCode)
        ) {
          // 由于checked页面有自动应用最大coupon的逻辑，如果当前使用的couponcode不是本地记录的code，则清空
          this.$cookie.setCookie('applyCouponCode', res.data.couponInfo.code, 0.5 / 24)
        } else {
          this.$cookie.removeCookie('applyCouponCode')
        }
        this.couponApplySuc = true
        // sod 输入邮箱失去焦点重新调用userInfo接口
        const flag = this.payProductList.some((item) => this.isSpecialCatId(item.catId) && !item.isFinalSale)
        if (flag) {
          this.$refs.main.getUserInfo()
        }
      }
      // paymentInfo 更新
      this.$store.commit('checkout/setPaymentInfo', res.data.paymentInfo)
      this.paymentId == 255 && this.handleSelectPayMethod(res.data.paymentInfo, res.data.summary)
      // 需要改变summary和商品信息以及coupon信息
      this.$store.commit('checkout/setCheckoutSummary', res.data.summary)
      this.$store.commit('checkout/setPayProductList', res.data.prodList)
      this.$store.commit('checkout/setFillGoodsBundleList', res.data.fillGoodsBundleList) // buy more save more bundle list
      const orderInfoTemp = JSON.parse(JSON.stringify(this.orderInfo))
      orderInfoTemp.available = res.data.orderInfo.available
      this.$store.commit('checkout/setOrderInfo', orderInfoTemp)
      // 挽回弹框信息数据
      if (res.data.activitySummary) {
        this.retrieveActivitySummary = res.data.activitySummary
      }
    },
    getCheckoutAmount(data) {
      const isFromApply = data && data.isFromApply // 是否是手动输入的coupon
      const applyCouponCode = this.$cookie.getCookie('applyCouponCode')
      let autoUseApply
      let resCouponCode = ''
      if (data && !data.isCheckoutLogin) {
        resCouponCode = data.couponCode
      } else {
        resCouponCode = this.couponInfo.code
      }
      if (!data && applyCouponCode) {
        // 说明是自动应用上记录在本地的手动输入的coupon
        autoUseApply = true
      }
      if (data) {
        // 如果data中存在guestEmail参数，说明是guestEmail刚输入操作完，调用的此方法，
        // 为了避免多次用户修改guestEmail后，coupon_code传参相同问题，用户输入操作完guestEmail后，清空coupon_code，通过接口返回可用coupon信息
        if (data.guestEmail) {
          resCouponCode = ''
        } else if (!data.couponCode) {
          this.isCancleCoupon = true // 如果是使用coupon之后是0元订单，会隐藏支付方式模块，所以加个字段，取消coupon的时候要展示支付模块
        }
        if (data.validateResultObj) {
          this.handleValidateResult(data, data.validateResultObj, { isFromApply, autoUseApply, applyCouponCode })
          return
        }
      }
      // 通过地址和coupon更改订单金额等信息
      // 入参coupon_code备注： 通过coupon的apply按钮获取，入参取coupon组件传出的data.couponCode的值，点击apply之后couponInfo其实已经是正确的coupon了，所以其他的直接用store的couponInfo.code
      const params = {
        ...this.resParams,
        coupon_code: resCouponCode,
        use_account_balance: this.useAccountBalanceFlag,
        shoppingcart_coupon_code: applyCouponCode,
        checkout_pay_abtest: this.versionObj.checkoutPayAbtest
      }
      if (this.paymentId) params.selected_payment_id = this.paymentId
      // 获取本地缓存的券活动绑定邮箱
      const unLoginEmail = this.$cookie.getCookie('UnLoginEmail')
      if (unLoginEmail) {
        if (this.isLogin) {
          this.$cookie.removeCookie('UnLoginEmail')
        } else if (!params.guest_email) {
          // 如果用户没有填写游客邮箱并且有本地邮箱缓存，将guest_email设为缓存邮箱
          params.guest_email = unLoginEmail
        }
      }
      this.retentionReject()
      this.$axios
        .$get('/1.0/address/validate', { params })
        .then((res) => {
          this.clearShippingMethodIdPrev()
          this.$store.commit('checkout/setLoadingFlag', false)
          if (res.code == 0) {
            // sod coupon 本地存储数据
            this.saveCouponInfoCode(res.data)
            this.handleValidateResult(data, res, { isFromApply, autoUseApply, applyCouponCode })
          } else if (res.code == 400302) {
            // 购物车为空时
            this.redirect(res.data.url)
          } else if (res.code == 9) {
            window.location.href = res.data.redirectUrl
          }
        })
        .catch((err) => {
          console.log(err)
          // 请求异常取消loading 用户恢复shippingMethod数据
          this.$store.commit('checkout/setLoadingFlag', false)
          const shippingMethodIdPrev = this.getShippingMethodIdPrev()
          // 接口返回数据为string无需调整
          if (shippingMethodIdPrev) this.$store.commit('checkout/setShippingMethodId', shippingMethodIdPrev)
        })
    },
    // 卡分期根据金额支付方式处理
    handleSelectPayMethod(paymentInfo, checkoutSummary) {
      if (checkoutSummary.canUseInstallmentsPlan) {
        // 订单金额发生变化,支持的分期保持不变，不支持分期需要重置1期
        if (checkoutSummary.totalAmount != this.checkoutSummary.totalAmount) {
          if (paymentInfo.installmentsPlan && paymentInfo.installmentsPlan.installments) {
            const installments = paymentInfo.installmentsPlan.installments
            const supportInstallments = installments.filter((item) => item.installments == this.bankCardInfo.installments)
            if (supportInstallments.length) {
              // select的default不变时，需要先重置，再赋值
              this.$store.commit('checkout/setBankCardInfo', { ...this.bankCardInfo, installments: '' })
              this.$nextTick(() => {
                this.handleChooseInstallment(supportInstallments[0])
              })
            } else {
              this.handleChooseInstallment(installments[0])
            }
          }
        }
      } else {
        this.$refs.orderSummary.paymentMethodCheck()
      }
    },
    handleChooseInstallment(item) {
      const tempBankCardInfo = JSON.parse(JSON.stringify(this.bankCardInfo))
      tempBankCardInfo.installmentAmountDisplay = item.installment_amount_display
      tempBankCardInfo.installmentsTotalAmount = item.total_amount_display
      tempBankCardInfo.installmentsId = item.id
      tempBankCardInfo.installments = item.installments
      this.$store.commit('checkout/setBankCardInfo', tempBankCardInfo)
    },
    getShippingMethodIdPrev() {
      const shippingMethodIdPrev = sessionStorage.getItem('shippingMethodIdPrev')
      this.clearShippingMethodIdPrev()
      return shippingMethodIdPrev
    },
    clearShippingMethodIdPrev() {
      sessionStorage.removeItem('shippingMethodIdPrev')
    },
    continuePay() {
      this.continuePayFlag = true
    },
    // 重置
    reSetContinuePay() {
      this.continuePayFlag = false
    },
    logout() {
      this.$refs.main.logout()
    },
    payRightScroll() {
      if (document.querySelector('.pay-right')) {
        if (document.querySelector('.pay-left').getBoundingClientRect().top <= 88) {
          this.payRightInnerFix = true
        } else {
          this.payRightInnerFix = false
        }
      } else {
        this.payRightInnerFix = false
      }
    },
    setCheckoutGA4(obj = {}) {
      // checkout页面 ga4打点
      // 订单商品
      if (!obj.type) return false
      const items = []
      this.payProductList.forEach((item) => {
        items.push(this.getGA4CheckoutItem(item))
      })
      const gaParams = {
        event: 'ga4Event',
        event_name: obj.type,
        event_parameters: {
          currency: this.currencyCode,
          value: this.checkoutSummary.totalAmount, // 订单总金额
          items
        }
      }
      if (obj.type === 'begin_checkout') {
        // 监控邮寄地址模块,结算页面加载
      } else if (obj.type === 'add_shipping_info') {
        // 监控邮寄方式模块,点击邮寄方式
        gaParams.event_parameters.shipping_tier = obj.shippingTitle
      } else if (obj.type === 'add_payment_info') {
        // 监控支付模块, 点击下单按钮
        gaParams.event_parameters.coupon = this.couponInfo.code || ''
        gaParams.event_parameters.payment_type = this.getPaymentName(this.paymentId)
      }
      this.setGA4DataLayer(gaParams)
    },
    getPaymentName(id) {
      if (!this.paymentInfoList || !id) return 'none'
      let paymentName = ''
      this.paymentInfoList.forEach((item) => {
        if (id === item.paymentId) {
          paymentName = item.name
        }
      })
      return paymentName
    },
    saveCouponInfoCode(data) {
      if (!this.isLogin) {
        this.$store.commit('checkout/setSelectCouponCode', false)
      }
      if (data.couponInfo && !!Object.keys(data.couponInfo).length && data.couponInfo.code == 'HIBEAUTY') {
        localStorage.setItem('sodCouponCode', data.couponInfo.code)
      }
      // 还没输入邮箱 或者 未登录
      if (!this.isLogin && (!this.checkoutLoginEmail || this.showSodCouponTips)) {
        this.showSodCouponTips = false
      } else {
        const couponCode = localStorage.getItem('sodCouponCode')
        if (couponCode == 'HIBEAUTY' && data.couponInfo && data.couponInfo.code != 'HIBEAUTY') {
          this.showSodCouponTips = true
          localStorage.removeItem('sodCouponCode')
        }
      }
    },
    interestedChange(value) {
      this.$store.commit('checkout/setCategoryError', false)
      this.$store.commit('checkout/setCategories', value)
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 1200px;
  min-width: 1100px;
  // max-width: 1300px;
  padding: 9px 30px 20px 30px;
  margin: 0 auto 55px;
  min-height: 1100px;
  box-sizing: border-box;
  .pay-right {
    float: right;
    width: 350px;
    padding-top: 28px;
    &.pay-right-inner-fix {
      position: sticky;
      top: 88px;
      z-index: 5;
    }
  }
  .pay-left {
    margin-right: 390px;
    margin-bottom: 50px;
    min-height: 710px;
    &.only-gift-card {
      min-height: 1000px;
    }
    /deep/ .checkout-login {
      margin-bottom: 30px;
    }
    .sod-coupon-checkout-tips-box {
      margin-bottom: 30px;
      background-color: @theme-btn-bgColor;
      padding: 15px;
      box-sizing: border-box;
      display: flex;
      align-items: flex-start;
      .tips-item-icon {
        width: 15px;
        height: 15px;
        margin-right: 10px;
      }
      .tips-item-text {
        font-family: @font-family-500;
        font-size: 12px;
        color: @theme;
      }
    }
    .checkout-interested-box {
      margin: 50px auto;
      .error-tip {
        margin-top: 10px;
        color: #f00;
      }
    }
  }
  /deep/ .pay-title {
    width: auto;
  }
}
/deep/ input::placeholder {
  text-transform: capitalize !important;
}
/deep/ input:focus {
  border-color: var(--color-121212) !important;
}
/deep/ input:focus {
  background: #fff !important;
}
/deep/ .mx-datepicker-popup {
  z-index: @z-index !important;
}
</style>
