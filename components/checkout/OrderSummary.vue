<template>
  <div class="order-summary">
    <div class="pay-summary">
      <div class="summary-tittle">{{ nl('page_common_order_summary') }}</div>
      <!-- 订单金额部分 -->
      <order-summary-amount-info :checkoutSummary="checkoutSummary" :from="'checkout'"></order-summary-amount-info>
      <order-confirm-check-box :purchaseSamples="purchaseSamples" />
      <div id="ca-shipping-content" v-if="currentCountry == 'CA'">
        <img src="~assets/images/cart/notice_icon.png" alt="notice icon" />
        <span class="text">{{ nl('page_checkout_now_with') }}</span>
      </div>
      <template v-if="!orderInfo.onlyGiftCard">
        <coupon
          v-if="$route.name == 'checkout' && !isSwatchRedelivery && !(progressId == 2)"
          @setCheckoutAmount="getCheckoutAmount"
          :couponApplySuc="couponApplySuc"
        ></coupon>
        <coupon-select-result
          v-if="(couponInfo && couponInfo.code) || hasCoupons"
          :coupon-result="couponResultInfo"
          :checkoutSummary="checkoutSummary"
          @init-coupon-status="initCouponStatus = true"
        ></coupon-select-result>
        <coupon-select
          :res-params="resParams"
          :refresh="refreshCoupons"
          :init="initCouponStatus"
          @onFinish="getCheckoutAmount"
        ></coupon-select>
      </template>
      <div id="msg_con" v-if="confirmPopShow">
        <div class="left_triangle"></div>
        <div class="msg">{{ nl('page_js_accept_terms') }} &nbsp;{{ nl('page_checkout_conditions') }}</div>
      </div>
      <!-- afterpay tips -->
      <div
        id="after-tips"
        v-if="checkoutSummary.canUseAfterPay && paymentInfo.paymentId == 254"
        v-html="nl('page_afterpay_after_click')"
      ></div>
      <div id="checkout-btn" class="cc-btn-wrap">
        <button
          id="btn_sbmt_order"
          :disabled="!orderInfo.available || isProcessing || !!buyNowNotice"
          @click="placeOrder"
          :class="`btn-checkout-${paymentId}`"
          class="btn btn-theme btn-large new-btn-checkout"
        >
          <i v-if="country == 'CA' && ![190, 254, 261, 262].includes(paymentId)" class="secure_icon"></i>
          {{ btnText }}
        </button>
        <!-- google pay 初始化按钮display:none 通过click事件触发-->
        <div id="btn_google_pay"></div>
        <!-- <div v-if="showApplePay && [190, 262].includes(paymentId)" class="btn-apple-pay-wrap">
          <button id="apple-pay-button" v-show="applePayBtnShow"></button>
        </div> -->
      </div>
      <div class="tip-terms-and-policy">
        <template>
          {{ nl('page_checkout_terms_and_policy_1') }}
        </template>
        <a @click="hrefPoint('termsofuse')" :href="countryUrl('/terms-of-use')" class="az-link" target="_blank">{{
          nl('page_sitemap_terms')
        }}</a
        >&#44;
        <a
          @click="hrefPoint('privacypolicy')"
          :href="countryUrl(nl('page_common_provacy_policy_pdf_' + country.toLowerCase()))"
          class="az-link"
          target="_blank"
        >
          {{ nl('page_sitemap_privacy') }}
        </a>
        {{ nl('page_common_and') }}
        <a
          :href="countryUrl('https://privacy.azazie.com/privacy-policy#notice-of-financial-incentive')"
          target="_blank"
          class="truevault-polaris-privacy-notice"
          style="text-decoration: underline;"
          >{{ nl('page_common_financial_incentive') }}.
        </a>
      </div>
      <div id="klarna-payments-container" v-show="false"></div>
    </div>
    <!-- checkout有比cart更优coupon，使用更优coupon给提示 -->
    <az-toast ref="couponToast" :message="couponToastMsg" :duration="3000"></az-toast>
  </div>
</template>

<script>
import formValidatorType from '@/assets/js/formValidatorType'
import Schema from 'async-validator'
import OrderConfirmCheckBox from '@/components/checkout/OrderConfirmCheckBox'
import OrderSummaryAmountInfo from '@/components/checkout/OrderSummaryAmountInfo'
import Coupon from '@/components/checkout/Coupon'
import CouponSelectResult from '@/components/coupon/CouponSelectResult'
import CouponSelect from '@/components/coupon/CouponSelect'
import paymentCardMixins from '@/assets/js/paymentCardMixins.js'
import initGooglePay from '@/assets/js/googlePay'
import AzToast from '@/components/az-ui/AzToast'

// import webPush from '@/plugins/pushengage'
import { generateDeviceId, dateFormatFn, loadScript } from '@/assets/js/utils.js'
import { getChannel, OpenChannelChanCookieName } from '@/assets/js/pointUtil'

import { mapState } from 'vuex'

export default {
  name: 'OrderSummary',
  components: {
    OrderConfirmCheckBox,
    OrderSummaryAmountInfo,
    Coupon,
    CouponSelectResult,
    CouponSelect,
    AzToast
  },
  mixins: [paymentCardMixins],
  props: {
    continuePayFlag: {
      type: Boolean,
      default: false
    },
    purchaseSamples: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    isSwatchRedelivery: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    couponApplySuc: {
      type: Boolean,
      default: false
    },
    resParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
    refreshCoupons: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // applePayBtnShow: false,
      isProcessing: false,
      confirmPopShow: false,
      tempPaymentInfo: {},
      paymentData: {
        nonce: '',
        order_sn: '',
        REF: ''
      },
      orderCountryCode: '', // 订单国家code，生成订单后才能从接口中的orderInfo中拿到对应的订单国家code，并添加到后续checkout的url路径中
      couponToastMsg: '',
      initCouponStatus: false
    }
  },
  computed: {
    ...mapState('checkout', [
      'orderInfo',
      'isOrderConfirm',
      'checkoutSummary',
      'eventDate',
      'addressId',
      'defaultAddressShow',
      'isAddressRulesResult',
      'shippingAddress',
      'billingAddress',
      'paymentName',
      'shippingMethodId',
      'isCarPayment',
      'bankCardInfo',
      'couponInfo',
      'hasCoupons',
      'paymentInfo',
      'paymentInfoList',
      'methodInfo',
      'buyNowData',
      'buyNowNotice',
      'checkoutLoginEmail',
      'checkoutLoginEmailError',
      'paymentId',
      'progressId',
      'useAccountBalanceFlag',
      'popupPayProcessingShow',
      'maxDiscountCouponCode',
      'couponCodeTipsShow',
      'payProductList',
      'categories'
    ]),
    ...mapState('cart', ['selectedParty', 'parties']), // checkout 选择party
    btnText() {
      if (this.isProcessing) {
        return this.nl('page_order_progress_processing')
      } else if (this.paymentId == 254) {
        return this.nl('page_afterpay_place_order_by_afterpay')
      } else if (this.paymentId == 263) {
        return this.nl('page_checkout_place_order_by_klarna')
      } else {
        return this.nl('page_checkout_place_order')
      }
    },
    cardPayment() {
      // 255 mx分期支付
      return [164, 177, 186, 255, 267].includes(this.paymentId)
    },
    // 当前应该展示的国家数据，订单国家信息优先
    currentCountry() {
      const res = this.$route.query.order_country_code
      return res || this.country
    },
    // 优惠券确认结果内容显示，红框中显示的内容
    couponResultInfo() {
      return {
        couponCode: this.couponInfo.code,
        couponValueTxt: this.couponInfo.type == 'value' ? '' : this.couponInfo.couponValueTxt,
        couponValue: this.checkoutSummary.bonusDisplay
      }
    }
  },
  watch: {
    continuePayFlag(newVal) {
      if (newVal) {
        this.placeOrder()
      }
    },
    isOrderConfirm(newVal) {
      if (newVal) {
        this.hoverBtn(false)
        console.log('isOrderConfirm', newVal)
      }
    },
    paymentId(newVal) {
      // 切换apple pay
      if (newVal && newVal != 190) {
        this.isProcessing = false
      }
    },
    isProcessing(newVal) {
      if (!newVal) {
        this.$store.commit('checkout/setCaPaymentDialogShow', false)
      }
    },
    popupPayProcessingShow(newVal) {
      if (!newVal) this.isProcessing = false
    },
    couponResultInfo: {
      handler(val, oldVal) {
        if (val && val.couponCode && oldVal && val.couponCode !== oldVal.couponCode) {
          this.showCouponUseToast()
        }
      },
      immediate: false
    },
    couponCodeTipsShow(val, oldVal) {
      // 第一次进入页面的时候，如果请求了/1.0/address/myCoupon接口，就会设置couponCodeTipsShow为true。这个时候要执行一次toast
      if (val && !oldVal) {
        this.showCouponUseToast()
      }
    }
  },
  mounted() {
    // 初始化google
    loadScript('https://pay.google.com/gp/p/js/pay.js', 'google_pay', () => {
      initGooglePay()
    })
    // 判断apple pay 是否支持
    if (!window.is_app && window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
      this.$store.commit('checkout/setShowApplePay', true)
    }

    // 新增 AZWEB-22102 FR国家站 CKO 支付失败回到checkout页面,提示报错信息
    if (this.$route.query.error_tip_code && this.$route.query.error_tip_code == 'checkoutCardError') {
      this.$store.commit('checkout/setErrorTipCode', this.$route.query.error_tip_code)
      this.$store.commit('checkout/setErrorTipText', this.nl('page_checkout_card_error_fr'))
      document.querySelector('#payment_and_billing') &&
        document.querySelector('#payment_and_billing').scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  },
  methods: {
    // coupon emit
    getCheckoutAmount(data) {
      this.$emit('setCheckoutAmount', data)
    },
    hrefPoint(el) {
      this.setPoint('note', el, 'click')
    },
    // 协议是否勾选
    hoverBtn(flag) {
      // checkout按钮浮动提示显示控制
      if (!this.isOrderConfirm) {
        this.confirmPopShow = flag
      } else {
        this.confirmPopShow = false
      }
    },
    placeOrder() {
      // placeOrder 按钮打点
      const catIds = []
      this.payProductList.forEach((item) => {
        if (!catIds.includes(item.catId)) {
          catIds.push(item.catId)
        }
      })
      const msg = {
        category_ids: catIds.filter((a) => a).join(',')
      }
      this.setPoint('placemyorder', 'common', 'click', msg)
      if (this.$route.name == 'checkout') {
        this.setPoint('checkout', 'common', 'click', {
          payMethod: this.paymentName
        })
      }
      // 打点
      this.setDataLayer({
        category: 'NewStructureCheckout',
        action: 'Click',
        label:
          this.$route.name == 'checkout' ? 'NewStructureCheckout_CheckoutButtonAll_Click' : 'NewStructureCheckout_PaymentButtonAll_Click'
      })

      // ga4 打点
      this.$emit('setCheckoutGA4', {
        type: 'add_payment_info'
      })

      if (this.webCheck()) {
        if (!this.isLogin && !this.orderInfo.orderSn && !this.$route.query.origin_order_sn) {
          // 游客登录
          this.loginAxios()
        } else {
          this.serverCheck()
        }
      }
    },
    webCheck() {
      // 游客用户校验是否输入邮箱
      if (!this.emailCheck()) return false
      if (!this.categoryCheck()) return false
      if (!this.orderInfo.onlyGiftCard) {
        // 1、校验是否同意协议 2、时间校验 3、校验地址 4、支付方式校验
        if (!this.eventDateCheck()) {
          // this.setPoint('eventdate', 'window', 'view')
          return false
        }
        // eventDate 在最晚时间早于eventDate时会调起一个弹窗，当用户点击弹窗的继续往下支付之后，会继续走下面的校验逻辑，
        // 这里的做法是，监听到用户点击继续之后，重新再执行placeOrder方法，但是不会再调弹窗了，这样比较全面的检测，因为用户有可能会更改日期
        if (!this.shippingAddressCheck()) return false
      }
      this.hoverBtn(true)
      if (!this.confirmCheck()) return false
      if (this.checkoutSummary.totalAmount != 0) {
        if (!this.paymentMethodCheck()) return false
      }
      if (this.orderInfo.onlyGiftCard) {
        // old:购买礼品卡，选择卡支付的话需要校验billing address
        // new:购买礼品卡，不论哪种方式都需要billing address
        if (this.billingAddress.length <= 0) {
          this.$store.commit('checkout/setCheckoutError', { isBillingAddressError: true })
          document.querySelector('.billing-address').scrollIntoView({ block: 'center', behavior: 'smooth' })
          return false
        }
      }
      return true
    },
    serverCheck() {
      // 转为processing进行中
      if (this.isProcessing) {
        return false
      } else {
        this.isProcessing = true
        if (!this.isLogin && !this.orderInfo.orderSn && !this.$route.query.origin_order_sn) {
          this.$emit('setCheckoutAmount', { isCheckoutLogin: true })
        } else {
          this.createAndUpdateOrder()
        }
      }
    },
    emailCheck() {
      if (!this.isLogin && !this.orderInfo.orderSn && !this.$route.query.origin_order_sn) {
        const rules = {
          email: formValidatorType.email({ required: this.nl('page_login_eamil_required'), validator: this.nl('page_email_enter_valid') })
        }
        const rulesResult = { email: '' }
        this.emailValidator = new Schema(rules)
        this.emailValidator.validate(
          {
            email: this.checkoutLoginEmail
          },
          (errors, fields) => {
            if (errors) {
              errors.map((item) => {
                if (!rulesResult[item.field]) {
                  rulesResult[item.field] = item.message
                  this.$store.commit('checkout/setCheckoutLoginEmailError', item.message)
                }
              })
            }
          }
        )
      } else {
        return true
      }
      if (this.checkoutLoginEmailError) {
        const checkoutLoginDom = document.querySelector('#checkout_login')
        checkoutLoginDom && checkoutLoginDom.scrollIntoView({ block: 'start', behavior: 'smooth' })
        return false
      } else {
        return true
      }
    },
    eventDateCheck() {
      // 最晚时间早于eventDate验证
      if (this.eventDate.date && this.checkoutSummary.lastGetTime && !this.continuePayFlag) {
        const _lastGetTime = new Date(this.checkoutSummary.lastGetTime.replace(/-/g, '/')).getTime()
        const _eventDate = new Date(this.eventDate.date.replace(/-/g, '/').replace(/[,.]/g, ' ')).getTime()
        if (_eventDate < _lastGetTime) {
          const lastGetTimeFormat = dateFormatFn(this.checkoutSummary.lastGetTime, this.country)
          const errHtml = `${this.nl('page_order_event_date_important_date')}
          <span style="font-family: @font-family-600">${this.nl('page_order_event_date_before')}</span>
          ${this.nl('page_order_event_date_delivery_date')}&nbsp;
          <span style="font-family: @font-family-600">${lastGetTimeFormat}</span>.<br>
          ${this.nl('page_order_event_date_please_note')}&nbsp;
          <span style="font-family:@font-family-600">${this.nl('page_order_event_date_arrive_time')}</span>
          ${this.nl('page_order_event_date_wish_to_proceed')}`
          // 弹窗
          this.$store.commit('checkout/setErrorDialogShow', true)
          this.$store.commit('checkout/setErrorTipText', errHtml)
          this.$store.commit('checkout/setErrorTipCode', 'eventdate')
          // 从报错弹窗点击继续支付之后，往下走
          return this.continuePayFlag
        }
      }
      return true
    },
    // 配送地址校验
    shippingAddressCheck() {
      if (!(this.addressId && this.defaultAddressShow)) {
        if (Object.keys(this.shippingAddress).length || (!Object.keys(this.shippingAddress).length && this.isAddressRulesResult)) {
          this.$store.commit('checkout/setCheckoutError', { isShippingAddressError: true })
          this.setDataLayer({ category: 'NewStructureCheckout', action: 'view', label: 'NewStructureCheckout_Address_Error1_View' })
        } else {
          document.querySelector('#btn_address_save').click()
        }
        document.querySelector('#shipping_address').scrollIntoView({ block: 'center', behavior: 'smooth' })
        return false
      }
      return true
    },
    confirmCheck() {
      // 条款检验
      if (!this.isOrderConfirm) {
        this.$store.commit('checkout/setIsConfirmError', true)
        window.addEventListener(
          'click',
          () => {
            this.$store.commit('checkout/setIsConfirmError', false)
          },
          { once: true }
        )
        window.event.stopPropagation()
        document.querySelector('.confirm-order').scrollIntoView({ block: 'center', behavior: 'smooth' })
        // 打点
        this.setDataLayer({
          category: 'NewStructureCheckout',
          action: 'View',
          label: this.$route.name == 'checkout' ? 'NewStructureCheckout_Agreement_View' : 'NewStructureCheckout_Payment_Agreement_View'
        })
        return false
      }
      return true
    },
    // 卡支付校验
    paymentMethodCheck() {
      let flag = true
      if (this.isCarPayment) {
        // 如果编辑checkout的时候，本来是卡支付并且没有切换支付方式的（this.isCarPayment），就不需要走卡信息校验了
        return true
      }
      const isHasCardInfo =
        this.bankCardInfo &&
        (this.bankCardInfo.cardNumber || this.bankCardInfo.month || this.bankCardInfo.year || this.bankCardInfo.securityCode)
      // 是否是有卡信息

      const isPaymentFormError =
        this.paymentRulesResult.cardNumber || this.paymentRulesResult.expirateDate || this.paymentRulesResult.securityCode // 是否存在报错

      if (
        this.paymentInfoList &&
        this.paymentInfoList.length > 1 &&
        (!this.paymentId || (this.paymentId && this.cardPayment && !isPaymentFormError && !isHasCardInfo))
      ) {
        // 多种支付方式,没有选择支付方式
        document.querySelector('#payment_and_billing').scrollIntoView({ block: 'center', behavior: 'smooth' })
        this.$store.commit('checkout/setCheckoutError', { isPaymentError: true })
        this.setPoint('checkout', 'error', 'view', { error: this.nl('page_payment_select_method') })
        this.setDataLayer({ category: 'NewStructureCheckout', action: 'view', label: 'NewStructureCheckout_Payment_Error1_View' })
        return false
      }

      // 如果编辑checkout的时候，本来是卡支付并且没有切换支付方式的（this.isCarPayment），就不需要走卡信息校验了
      if (this.paymentId && this.cardPayment && !this.isCarPayment) {
        const isHasCardInfo =
          this.bankCardInfo &&
          (this.bankCardInfo.cardNumber || this.bankCardInfo.month || this.bankCardInfo.year || this.bankCardInfo.securityCode)
        // 是否是有卡信息

        const isPaymentFormError =
          this.paymentRulesResult.cardNumber || this.paymentRulesResult.expirateDate || this.paymentRulesResult.securityCode // 是否存在报错

        if (((this.paymentInfoList && this.paymentInfoList.length == 1) || isHasCardInfo) && !isPaymentFormError) {
          // 卡支付的表单校验
          const rulesResult = JSON.parse(JSON.stringify(this.paymentRulesResult))

          const param = {
            cardNumber: this.bankCardForm.cardNumber,
            expirateDate: this.bankCardForm.expirateDate,
            securityCode: this.bankCardForm.securityCode,
            // 分期支付
            holderName: this.bankCardForm.holderName,
            installmentsId: this.bankCardForm.installmentsId
          }

          this.validator.validate(param, (errors, fields) => {
            let valiErrors = errors
            if (this.paymentId != 255) {
              // 只有s支付需要校验'holderName', 'installmentsId'
              valiErrors = valiErrors.length && valiErrors.filter((item) => !['holderName', 'installmentsId'].includes(item.field))
            }
            if (valiErrors && valiErrors.length) {
              valiErrors.map((item) => {
                if (!rulesResult[item.field]) {
                  this.setPoint('checkout', 'error', 'view', { error: item.message })
                  rulesResult[item.field] = item.message
                  if (item.field == 'cardNumber') {
                    this.setDataLayer({
                      category: 'NewStructureCheckout',
                      action: 'view',
                      label: 'NewStructureCheckout_Payment_Error2_View'
                    })
                  }
                  if (item.field == 'expirateDate') {
                    this.setDataLayer({
                      category: 'NewStructureCheckout',
                      action: 'view',
                      label: 'NewStructureCheckout_Payment_Error3_View'
                    })
                  }
                  if (item.field == 'securityCode') {
                    this.setDataLayer({
                      category: 'NewStructureCheckout',
                      action: 'view',
                      label: 'NewStructureCheckout_Payment_Error4_View'
                    })
                  }
                }
              })
              document.querySelector('#payment_and_billing').scrollIntoView({ block: 'center', behavior: 'smooth' })
              this.$store.commit('checkout/setpPaymentRulesResult', rulesResult)
              flag = false
            }
          })
        } else {
          // 表单存在校验报错，定位到报错位置
          document.querySelector('#payment_and_billing').scrollIntoView({ block: 'center', behavior: 'smooth' })
          flag = false
        }
      }

      return flag
    },
    /**
     * 创建或修改订单
     */
    createAndUpdateOrder() {
      // ideal支付检查必填项
      if (this.paymentId === 265 && !this.paymentRulesResult.idealIssuer) {
        this.$store.commit('checkout/setpPaymentRulesResult', {
          idealPaymentErrorMsg: this.nl('page_payment_ideal_placeholder')
        })
        this.isProcessing = false
        return
      }
      // sepa支付检查必填项
      if (this.paymentId === 269 && (!this.paymentRulesResult.sepaOwnerName || !this.paymentRulesResult.sepaIbanNumber)) {
        const _errorMsg = { ...this.paymentRulesResult }
        _errorMsg.sepaPaymentOwnerNameErrorMsg = !this.paymentRulesResult.sepaOwnerName ? this.nl('page_checkout_sepa_ownername_error') : ''
        _errorMsg.sepaPaymentIbanErrorMsg = !this.paymentRulesResult.sepaIbanNumber ? this.nl('page_checkout_sepa_iban_error') : ''
        this.$store.commit('checkout/setpPaymentRulesResult', _errorMsg)
        this.isProcessing = false
        return
      }
      // 创建订单以及支付弹窗状态变更
      this.showCreateOrderLoading()
      // 礼品卡支付指定paymentId，考虑选择了其他支付方式之后，又切换礼品卡进行0元支付（扣款了礼品卡，且订单是0元）
      if (this.useAccountBalanceFlag && this.checkoutSummary.totalAmount * 1 <= 0 && this.checkoutSummary.orderAccountBalanceAmount > 0) {
        this.$store.commit('checkout/setPaymentId', 257)
      }
      let data = {
        order_sn: this.orderInfo.orderSn ? this.orderInfo.orderSn : '',
        payment_id: this.paymentId,
        shipping_method_id: this.shippingMethodId,
        address_id: this.addressId,
        coupon_code: this.couponInfo.code || '',
        use_account_balance: this.useAccountBalanceFlag, // 是否使用礼品卡余额支付
        order_track_id: this.orderInfo.orderTrackId,
        // shipping_type: '',
        event_date: this.eventDate.date,
        order_dot: this.uploadOrderTrackInfo(),
        order_goods_dot: this.uploadOrderTrackInfoWithGoodsId(),
        order_type: this.purchaseSamples ? 'sample' : this.isSwatchRedelivery ? 'swatches' : 'normal',
        origin_order_sn: this.purchaseSamples || this.isSwatchRedelivery ? this.$route.query.origin_order_sn || '' : '',
        rec_ids: this.purchaseSamples || this.isSwatchRedelivery ? this.$route.query.rec_ids || '' : '',
        buy_now: this.buyNowData,
        party_value: this.selectedParty && this.selectedParty != 1 ? this.selectedParty.value : '',
        show_room_id: this.selectedParty && this.selectedParty != 1 ? this.selectedParty.id : '',
        openSource: getChannel() // 订单来源字段，同打点ops opc opm 一样
      }
      if (this.orderInfo.onlyGiftCard) data.only_gift_card = this.orderInfo.onlyGiftCard // 是否纯礼品卡订单
      // 是否是卡支付
      if (this.cardPayment) {
        data = {
          ...data,
          card_number: this.bankCardInfo.cardNumber,
          exp_date: this.bankCardInfo.expirateDate,
          month: this.bankCardInfo.month,
          year: this.bankCardInfo.year,
          card_code: this.bankCardInfo.securityCode
        }
        if (this.paymentId == 255) {
          // 分期支付
          data = {
            ...data,
            holder_name: this.bankCardInfo.holderName,
            installments: this.bankCardInfo.installments,
            installments_id: this.bankCardInfo.installmentsId
          }
        }
      }
      // 未登录游客用户
      if (!this.isLogin && !this.orderInfo.orderSn && !this.$route.query.origin_order_sn) {
        let tempShippingAddress = ''
        let tempBillingaddress = ''
        const tempAddressInfo = {}
        // 礼品卡没有shipping address,如果选择卡支付会有billingAddress
        if (!this.orderInfo.onlyGiftCard) {
          if (this.shippingAddress.length) {
            tempShippingAddress = {
              check_validation: 0,
              address_type: 1,
              first_name: this.shippingAddress[0].firstName,
              last_name: this.shippingAddress[0].lastName,
              full_name: this.shippingAddress[0].fullName,
              country: this.shippingAddress[0].country,
              country_name: this.shippingAddress[0].countryName,
              country_code: this.shippingAddress[0].countryCode,
              province: this.shippingAddress[0].province,
              province_text: this.shippingAddress[0].provinceText,
              province_name: this.shippingAddress[0].provinceName,
              city: this.shippingAddress[0].city,
              city_text: this.shippingAddress[0].cityText,
              district: this.shippingAddress[0].district,
              district_text: this.shippingAddress[0].districtText,
              address: this.shippingAddress[0].address,
              sign_building: this.shippingAddress[0].signBuilding,
              zipcode: this.shippingAddress[0].zipcode,
              tel: this.shippingAddress[0].tel
            }
            if (this.country === 'DE') {
              tempShippingAddress.doorplate = this.shippingAddress[0].doorplate
            }
          }
        }
        if (this.billingAddress.length) {
          tempBillingaddress = {
            check_validation: 0,
            address_type: 2,
            first_name: this.billingAddress[0].firstName,
            last_name: this.billingAddress[0].lastName,
            country: this.billingAddress[0].country,
            country_name: this.billingAddress[0].countryName,
            country_code: this.billingAddress[0].country,
            province: this.billingAddress[0].province,
            province_text: this.billingAddress[0].provinceText,
            province_name: this.billingAddress[0].provinceName,
            city: this.billingAddress[0].city,
            city_text: this.billingAddress[0].cityText,
            district: this.billingAddress[0].district,
            district_text: this.billingAddress[0].districtText,
            address: this.billingAddress[0].address,
            sign_building: this.billingAddress[0].signBuilding,
            zipcode: this.billingAddress[0].zipcode,
            tel: this.billingAddress[0].tel,
            full_name: this.billingAddress[0].fullName,
            doorplate: this.billingAddress[0].doorplate
          }
          if (this.country === 'DE') {
            tempBillingaddress.doorplate = this.billingAddress[0].doorplate
          }
        }
        if (tempShippingAddress) tempAddressInfo.shippingAddress = tempShippingAddress
        if (tempBillingaddress) tempAddressInfo.billingAddress = tempBillingaddress
        if (Object.keys(tempAddressInfo).length) data.address = tempAddressInfo
        data.guest_email = this.checkoutLoginEmail
        data.address_id = ''
      }
      data.version = 'a'
      // interested 模块的内容
      if (!this.isLogin) {
        data.categories = this.categories
      }
      this.$axios[this.orderInfo.orderSn ? 'put' : 'post']('/1.0/order', data).then((response) => {
        this.hideLoadOrder()
        const res = response.data
        if (res.code == 0) {
          this.$cookie.setCookie(OpenChannelChanCookieName, JSON.stringify({ utm_campaign: 'web', utm_source: 'web', utm_medium: 'auto' }))
          this.orderCountryCode = res.data.orderInfo && res.data.orderInfo.countryCode // 订单国家code
          this.setDataLayer({
            category: 'NewStructureCheckout',
            action: 'Click',
            label: 'NewStructureCheckout_CheckoutButtonNoError_Order_Click'
          })
          // #17453： Guest checkout本地记录邮箱和order Number
          if (this.isGuest && ((res.data.isZero && res.data.orderSn) || (res.data.orderInfo && res.data.orderInfo.orderSn))) {
            const orderSn = res.data.isZero ? res.data.orderSn : res.data.orderInfo.orderSn
            this.handleGuestOrderInfo(orderSn) // 记录游客下单的订单号和邮箱
          }
          // 0元订单返回格式和正常订单不同，没有orderInfo字段
          if (res.data.isZero) {
            window.location.href = this.countryUrl(
              `/checkout_success/orderconfirm/${res.data.orderSn}${this.$store.state.isBridal ? '?subsite=bridal' : ''}`
            )
          } else {
            this.tempPaymentInfo = {
              checkoutSummary: { ...res.data.summary, countryCode: res.data.countryCode, currencyCode: res.data.currencyCode },
              shippingAddress: res.data.addressInfo && res.data.addressInfo.shippingAddress,
              paymentInfo: res.data.paymentInfo,
              orderInfo: res.data.orderInfo
            }
            const orderInfoTemp = JSON.parse(JSON.stringify(this.orderInfo))
            this.$store.commit('checkout/setOrderInfo', { ...orderInfoTemp, ...res.data.orderInfo })
            if (res.data.addressInfo) this.$store.commit('checkout/setAddressInfo', res.data.addressInfo)
            history.pushState(
              null,
              '',
              this.countryUrl(
                `/checkout?order_sn=${res.data.orderInfo.orderSn}&order_country_code=${this.orderCountryCode}${
                  this.$store.state.isBridal ? '&subsite=bridal' : ''
                }`
              )
            )
            if (
              this.useAccountBalanceFlag &&
              this.checkoutSummary.totalAmount * 1 == 0 &&
              this.checkoutSummary.orderAccountBalanceAmount > 0
            ) {
              // 礼品卡0元付（扣款了礼品卡，且订单是0元）
              this.paymentSecondStep()
            } else {
              this.paymentFirstStep()
            }
          }
          this.clearWGDcpcOrderTracking()
          // 删除sod coupon 本地存储数据
          localStorage.removeItem('sodCouponCode')
        } else if (res.code == 9) {
          window.location.href = res.data.redirectUrl
        } else if (res.code == 400213) {
          // afterpay rule error
          this.$store.commit('checkout/setErrorDialogShow', true)
          this.$store.commit('checkout/setErrorTipCode', 'afterpay')
          this.$store.commit('checkout/setErrorTipText', this.nl('page_checkout_afterpay_rule_error'))
          this.isProcessing = false
        } else if (res.code == 300105) {
          this.setPoint('checkout', 'error', 'view', { error: this.nl('page_black_email_login_fail') })
          // blacklist
          this.$store.commit('checkout/setErrorDialogShow', true)
          this.$store.commit('checkout/setErrorTipCode', 'blacklist')
          this.$store.commit('checkout/setErrorTipText', this.nl('page_black_email_login_fail'))
        } else if (res.code == 300006) {
          this.setPoint('checkout', 'error', 'view', { error: res.msg })
          // flashSale change
          this.$store.commit('checkout/setErrorDialogShow', true)
          this.$store.commit('checkout/setErrorTipCode', 'unavailable')
          this.$store.commit('checkout/setErrorTipText', res.msg)
        } else if (res.code == 200108) {
          // buy now 商品缺货
          this.$store.commit('checkout/setBuyNowNotice', { msg: res.msg, url: res.data.redirectUrl })
          this.isProcessing = false
        } else if ((res.code == 100501 && !this.checkoutLoginEmail) || res.code == 100201 || res.code == 100600) {
          this.$store.commit('checkout/setCheckoutLoginEmailError', res.msg)
          this.isProcessing = false
          this.$store.commit('checkout/setProgressId', 1)
          this.$nextTick(() => {
            document.querySelector('#checkout_login') &&
              document.querySelector('#checkout_login').scrollIntoView({ block: 'start', behavior: 'smooth' })
          })
        } else {
          this.setPoint('checkout', 'error', 'view', { error: this.nl('page_checkout_oops') })
          this.setDataLayer({
            category: 'NewStructureCheckout',
            action: 'View',
            label: 'NewStructureCheckout_Error_View'
          })
          alert(res.msg)
          window.location.reload()
        }
      })
    },
    /**
     * 支付在创建或修改订单后
     */
    paymentFirstStep() {
      // 创建订单以及支付弹窗状态变更
      this.showOrderProcessLoading()
      if (
        (this.tempPaymentInfo.paymentInfo.paymentId == 97 || this.tempPaymentInfo.paymentInfo.paymentId == 244) &&
        this.tempPaymentInfo.paymentInfo.useBraintree == true
      ) {
        this.paypalPayment()
      } else if (this.tempPaymentInfo.paymentInfo.paymentId == 243 && this.tempPaymentInfo.paymentInfo.useBraintree == true) {
        this.venmoPayment()
      } else if (this.tempPaymentInfo.paymentInfo.paymentId == 190) {
        this.applepayPayment()
      } else if (this.tempPaymentInfo.paymentInfo.paymentId == 262) {
        this.hideLoadOrder()
        this.$store.commit('checkout/setPopupPayProcessingCode', 'applepay')
        this.$store.commit('checkout/setPopupPayProcessingShow', true)
        this.$nextTick(() => {
          document.querySelector('#apple-pay-button').addEventListener('click', () => {
            this.onApplePayButtonClicked()
          })
        })
      } else if (this.tempPaymentInfo.paymentInfo.paymentId == 254) {
        this.initAfterpayPayment()
      } else if (this.tempPaymentInfo.paymentInfo.paymentId == 270) {
        this.initCashAppPay()
      } else if (this.tempPaymentInfo.paymentInfo.paymentId == 261) {
        // google pay 设置交易信息，自动触发按钮点击,google pay 和 apple pay一样，存在三方因安全原因无法主动触发按钮点击唤起支付，需要主动点击,注意!!!支付未完成，想重新支付，需要重置支付态 todo
        initGooglePay(this.tempPaymentInfo.checkoutSummary, this.googlepaycallBack)
        this.hideLoadOrder()
        this.$store.commit('checkout/setPopupPayProcessingCode', 'googlepay')
        this.$store.commit('checkout/setPopupPayProcessingShow', true)
        this.$nextTick(() => {
          document.querySelector('#btn_google_pay_continue') &&
            document.querySelector('#btn_google_pay_continue').addEventListener('click', () => {
              document.querySelector('#btn_google_pay button').click()
            })
        })
      } else if (this.tempPaymentInfo.paymentInfo.paymentId == 263) {
        this.klarnaPayment()
      } else if ([264, 265, 266, 268, 269].includes(this.tempPaymentInfo.paymentInfo.paymentId)) {
        this.adyenPayment()
      } else if (this.tempPaymentInfo.paymentInfo.usePaymentGateWay) {
        // AZWEB-22102 FR国家站 CKO
        this.hideLoadOrder()
        this.checkoutPayment('card')
      } else {
        this.paymentSecondStep()
      }
      //  else {
      //   document.querySelector('#btn_sbmt_order').addEventListener('click', () => {
      //     if (!this.confirmCheck()) return false
      //     this.paymentSecondStep()
      //   })
      // }
    },
    paypalPayment() {
      const _this = this
      const token = _this.tempPaymentInfo.paymentInfo.token

      window.braintree.client.create(
        {
          authorization: token
        },
        function(clientErr, clientInstance) {
          if (clientErr != null) {
            console.log(clientErr)
          }
          // Create PayPal component
          window.braintree.paypal.create(
            {
              client: clientInstance
            },
            function(err, paypalInstance) {
              // alert(err)
              if (err != null) {
                console.log(err)
              }
              _this.doPaypalPayment(paypalInstance, err)
            }
          )
        }
      )
    },
    // klarna支付
    klarnaPayment() {
      const _this = this
      if (!_this.tempPaymentInfo.paymentInfo.token) {
        this.$store.commit('checkout/setErrorDialogShow', true)
        this.$store.commit('checkout/setErrorTipText', this.nl('page_checkout_afterpay_token_error'))
        this.$store.commit('checkout/setErrorTipCode', 'klarna_token')
        _this.isProcessing = false
      } else if (window.Klarna) {
        window.Klarna.Payments.init({
          client_token: _this.tempPaymentInfo.paymentInfo.token
        })
        window.Klarna.Payments.load(
          {
            container: '#klarna-payments-container',
            payment_method_category: 'klarna'
          },
          function(res) {
            const resSer = JSON.parse(_this.tempPaymentInfo.paymentInfo.KlarnaPayCheckoutInfo)
            window.Klarna.Payments.authorize(
              {
                payment_method_category: 'klarna'
              },
              resSer,
              function(obj) {
                if (obj.authorization_token) {
                  _this.paymentData.relationId = obj.authorization_token
                  _this.paymentSecondStep()
                } else {
                  _this.$store.commit('checkout/setErrorDialogShow', true)
                  _this.$store.commit('checkout/setErrorTipText', _this.nl('page_checkout_afterpay_payment_error'))
                  _this.$store.commit('checkout/setErrorTipCode', 'klarna_payment')
                  _this.isProcessing = false
                }
              }
            )
          }
        )
      }
    },
    doPaypalPayment(paypalInstance, err) {
      // 唤起paypal打点
      this.setPoint('placemyorder', 'paypalTry', 'click')
      const _this = this
      if (typeof dataLayer != 'undefined') {
        window.dataLayer.push({ event: 'FlowReview2PayClick' })
      }
      const params = {
        flow: 'vault', // Required
        amount: _this.tempPaymentInfo.checkoutSummary.totalAmount, // Required
        currency: 'USD', // Required
        // locale: 'en_US',
        offerCredit: _this.tempPaymentInfo.paymentInfo.paymentId == 244
      }
      if (!this.orderInfo.onlyGiftCard) {
        // 单独礼品卡下单，没有地址
        params.enableShippingAddress = true
        params.shippingAddressEditable = false
        const { consignee, address, signBuilding, cityText, zipcode, province, tel } = _this.tempPaymentInfo.shippingAddress[0]
        params.shippingAddressOverride = {
          recipientName: consignee,
          line1: address || signBuilding,
          line2: '',
          city: cityText,
          countryCode: _this.country,
          postalCode: zipcode,
          state: province,
          phone: tel
        }
      }

      // Tokenize here!
      paypalInstance.tokenize(params, function(err, tokenizationPayload) {
        // Tokenization complete
        // Send tokenizationPayload.nonce to server
        // alert(err)
        if (err != null) {
          _this.isProcessing = false

          if (err.code == 'PAYPAL_POPUP_OPEN_FAILED') {
            // safri 弹框处理
            _this.$store.commit('checkout/setPopupPayProcessingCode', 'paypal')
            _this.$store.commit('checkout/setPopupPayProcessingShow', true)
            _this.$nextTick(() => {
              document.querySelector('#btn_paypal_continue') &&
                document.querySelector('#btn_paypal_continue').addEventListener('click', () => {
                  _this.doPaypalPayment(paypalInstance)
                })
            })
          } else if (err.code == 'PAYPAL_POPUP_CLOSED') {
            _this.$store.commit('checkout/setPopupPayProcessingShow', false)
          } else if (err.code != 'PAYPAL_POPUP_CLOSED' && err.code != 'PAYPAL_TOKENIZATION_REQUEST_ACTIVE') {
            // 报错弹窗
            _this.setDataLayer({
              category: 'NewStructureCheckout',
              action: 'View',
              label: 'NewStructureCheckout_Payment_Error5_View'
            })
            _this.$store.commit('checkout/setErrorDialogShow', true)
            _this.$store.commit('checkout/setErrorTipCode', 'paypal')
            _this.$store.commit('checkout/setErrorTipText', _this.nl('page_pay_paypal_error'))
          }
          return false
        }
        _this.paymentData.nonce = tokenizationPayload.nonce
        _this.paymentSecondStep()
      })
    },
    venmoPayment() {
      const _this = this
      const token = _this.tempPaymentInfo.paymentInfo.token
      // Create a client.
      window.braintree.client.create(
        {
          authorization: token
        },
        function(clientErr, clientInstance) {
          // Stop if there was a problem creating the client.
          // This could happen if there is a network error or if the authorization
          // is invalid.
          if (clientErr) {
            alert('Error creating client:', clientErr)
            return
          }

          window.braintree.dataCollector.create(
            {
              client: clientInstance,
              paypal: true
            },
            function(dataCollectorErr, dataCollectorInstance) {
              if (dataCollectorErr) {
                // Handle error in creation of data collector.
                return
              }

              // At this point, you should access the deviceData value and provide it
              // to your server, e.g. by injecting it into your form as a hidden input.
              console.log('Got device data:', dataCollectorInstance.deviceData)
              // 这个字段，暂时没有用到
            }
          )

          window.braintree.venmo.create(
            {
              client: clientInstance,
              // Add allowNewBrowserTab: false if your checkout page does not support
              // relaunching in a new tab when returning from the Venmo app. This can
              // be omitted otherwise.
              allowNewBrowserTab: false
            },
            function(venmoErr, venmoInstance) {
              if (venmoErr) {
                alert('Error creating Venmo:', venmoErr)
                return
              }

              // Verify browser support before proceeding.
              if (!venmoInstance.isBrowserSupported()) {
                alert('Browser does not support Venmo')
                return
              }

              displayVenmoButton(venmoInstance)
            }
          )
        }
      )

      const displayVenmoButton = function(venmoInstance) {
        _this.doVenmoPayment(venmoInstance)
      }
    },
    doVenmoPayment(venmoInstance) {
      const _this = this
      venmoInstance.tokenize(function(tokenizeErr, payload) {
        if (tokenizeErr) {
          _this.isProcessing = false
          handleVenmoError(tokenizeErr)
        } else {
          handleVenmoSuccess(payload)
        }
      })

      const handleVenmoError = function(err) {
        if (err.code === 'VENMO_CANCELED') {
          alert('App is not available or user aborted payment flow')
        } else if (err.code === 'VENMO_APP_CANCELED') {
          alert('User canceled payment flow')
        } else {
          alert('An error occurred:', err.message)
        }
      }

      const handleVenmoSuccess = function(payload) {
        // Send the payment method nonce to your server, e.g. by injecting
        // it into your form as a hidden input.
        console.log('Got a payment method nonce:', payload.nonce)
        // Display the Venmo username in your checkout UI.
        console.log('Venmo user:', payload.details.username)
        _this.paymentData.nonce = payload.nonce
        _this.paymentSecondStep()
      }
    },
    applepayPayment() {
      const _this = this
      const ApplePaySession = window.ApplePaySession
      const token = _this.tempPaymentInfo.paymentInfo.token
      window.braintree.client.create(
        {
          authorization: token
        },
        function(clientErr, clientInstance) {
          if (clientErr) {
            console.error('Error creating client:', clientErr)
            return
          }

          window.braintree.applePay.create(
            {
              client: clientInstance
            },
            function(applePayErr, applePayInstance) {
              if (applePayErr) {
                console.error('Error creating applePayInstance:', applePayErr)
                return
              }

              _this.hideLoadOrder()
              _this.$store.commit('checkout/setPopupPayProcessingCode', 'applepay')
              _this.$store.commit('checkout/setPopupPayProcessingShow', true)

              // 不再判断是否有可用的卡，没有的话，提示添加
              // _this.applePayBtnShow = true
              // const promise = ApplePaySession.canMakePaymentsWithActiveCard(applePayInstance.merchantIdentifier)
              // promise.then(function(canMakePaymentsWithActiveCard) {
              // eslint-disable-next-line no-constant-condition
              // console.log('canMakePaymentsWithActiveCard', canMakePaymentsWithActiveCard)

              // if (canMakePaymentsWithActiveCard) {
              const {
                goodsAmount = 0,
                shippingFee = 0,
                rushFee = 0,
                bonus = 0,
                taxFee = 0,
                totalAmount = 0
              } = _this.tempPaymentInfo.checkoutSummary
              const paymentRequest = applePayInstance.createPaymentRequest({
                lineItems: [
                  {
                    label: 'Subtotal',
                    amount: goodsAmount,
                    type: 'final'
                  },
                  {
                    label: 'Shipping',
                    amount: shippingFee,
                    type: 'final'
                  },
                  {
                    label: 'Rush',
                    amount: rushFee,
                    type: 'final'
                  },
                  {
                    label: 'Coupon',
                    amount: bonus,
                    type: 'final'
                  },
                  {
                    label: 'Tax',
                    amount: taxFee,
                    type: 'final'
                  }
                ],
                total: {
                  label: 'AZAZIE,INC.',
                  amount: totalAmount
                }
              })
              // new ApplePaySession必须在click事件内
              // https://developers.braintreepayments.com/guides/apple-pay/client-side/javascript/v3
              // 仅US含有apple pay支付
              _this.$nextTick(() => {
                document.querySelector('#apple-pay-button').addEventListener('click', () => {
                  if (!_this.confirmCheck()) return false
                  _this.doApplepayPayment(ApplePaySession, applePayInstance, paymentRequest)
                })
              })
              // }
              // })
            }
          )
        }
      )
    },
    doApplepayPayment(ApplePaySession, applePayInstance, paymentRequest) {
      const session = new ApplePaySession(1, paymentRequest)
      const _this = this
      session.onvalidatemerchant = function(event) {
        applePayInstance.performValidation(
          {
            validationURL: event.validationURL,
            displayName: 'Azazie'
          },
          function(validationErr, merchantSession) {
            if (validationErr) {
              // You should show an error to the user, e.g. 'Apple Pay failed to load.'
              console.error('Error validating merchant:', validationErr)
              session.abort()
              return
            }
            session.completeMerchantValidation(merchantSession)
          }
        )
      }
      session.onpaymentauthorized = function(event) {
        applePayInstance.tokenize(
          {
            token: event.payment.token
          },
          function(tokenizeErr, payload) {
            console.log(payload)
            if (tokenizeErr) {
              _this.isProcessing = false
              console.error('Error tokenizing Apple Pay:', tokenizeErr)
              session.completePayment(ApplePaySession.STATUS_FAILURE)
              return
            }
            session.completePayment(ApplePaySession.STATUS_SUCCESS)
            // Send payload.nonce to your server.
            _this.paymentData.nonce = payload.nonce
            _this.paymentSecondStep()
          }
        )
      }
      session.begin()
    },
    onApplePayButtonClicked() {
      let applePayPayment = {}

      let isDev = false // 是否是沙盒模式
      const env = this.$store.state.environment
      if (env.includes('dev') || env.includes('test')) isDev = true

      try {
        const { countryCode, currencyCode, totalAmount = 0 } = this.tempPaymentInfo.checkoutSummary
        const request = {
          countryCode,
          currencyCode,
          supportedNetworks: ['US', 'CA', 'MX'].includes(countryCode) ? ['visa', 'masterCard', 'amex', 'discover'] : ['visa', 'masterCard'],
          merchantCapabilities: ['supports3DS'],
          total: {
            label: 'AZAZIE,INC.',
            amount: totalAmount
          }
        }

        // console.log('apple payment request', request)
        // Create ApplePaySession 创建 Apple Pay 会话
        // eslint-disable-next-line no-undef
        const session = new ApplePaySession(3, request)

        session.onvalidatemerchant = async (event) => {
          // console.log('event', event)
          // Call your own server to request a new merchant session. 获取新的商户会话
          const res = await this.$axios.$post('/1.0/order/paymentSession', {
            merchantIdentifier: isDev ? 'merchant.com.azazie.checkoutdev' : 'merchant.com.azazie.checkout',
            displayName: 'Azazie',
            initiative: 'web',
            initiativeContext: window.location.host,
            requestUrl: event.validationURL
          })
          if (res.code == 0) {
            const merchantSession = res.data
            // console.log('merchantSession', merchantSession)
            // 商家会话对象传递给 Apple Pay 会话
            session.completeMerchantValidation(merchantSession)
          } else {
            this.setPoint('applepay', 'merchantSession fail', 'click')
          }
        }
        // session.onpaymentmethodselected = (event) => {
        //   console.log('paymentChange', event)
        //   // Define ApplePayPaymentMethodUpdate based on the selected payment method.
        //   // No updates or errors are needed, pass an empty object.
        //   session.completePaymentMethodSelection(ckeckoutUpdate)
        // }

        // session.onshippingmethodselected = (event) => {
        //   console.log('shippingMethodChange', event)
        //   // Define ApplePayShippingMethodUpdate based on the selected shipping method.
        //   session.completeShippingMethodSelection(ckeckoutUpdate)
        // }

        // session.onshippingcontactselected = (event) => {
        //   console.log('onshippingcontactselected', event)
        //   // Define ApplePayShippingContactUpdate based on the selected shipping contact.
        //   session.completeShippingContactSelection(ckeckoutUpdate)
        // }
        session.onpaymentauthorized = (event) => {
          // const billingAddressInfo = {
          //   countryId: 'US',
          //   zipCode: '',
          //   city: '',
          //   lastName: '',
          //   state: '',
          //   firstName: '',
          //   addressLine2: '',
          //   addressLine1: ''
          // }
          // console.log('Success1', event.payment)
          // eslint-disable-next-line no-undef
          // console.log('SuccessStatus', window.ApplePaySession.STATUS_SUCCESS)
          const result = {
            // eslint-disable-next-line no-undef
            status: window.ApplePaySession.STATUS_SUCCESS
          }
          // https://developer.apple.com/documentation/passkit/apple_pay/payment_token_format_reference
          // applePayPayment = {
          //   data: event.payment?.token.paymentData?.data,
          //   signature: event.payment?.token.paymentData.signature,
          //   header: event.payment?.token.paymentData.header,
          //   version: event.payment?.token.paymentData.version
          // }
          applePayPayment = event.payment.token.paymentData
          session.completePayment(result)
          this.setPoint('applepay', 'try', 'click')
          this.$store.commit('checkout/setPopupPayProcessingCode', '')
          this.$store.commit('checkout/setPopupPayProcessingShow', false)
          this.checkoutPayment('applepay', JSON.stringify(applePayPayment))
        }

        session.oncancel = (event) => {
          // Payment cancelled by WebKit
          console.log('cancel', event)
        }

        session.begin()
      } catch (e) {
        console.log('error', e)
      }
    },
    initAfterpayPayment() {
      const _this = this
      if (!this.tempPaymentInfo.paymentInfo.afterPayCheckoutInfo.token) {
        this.$store.commit('checkout/setErrorDialogShow', true)
        this.$store.commit('checkout/setErrorTipText', this.nl('page_checkout_afterpay_token_error'))
        this.$store.commit('checkout/setErrorTipCode', 'afterpay_token')
        _this.isProcessing = false
        return
      }
      const afterpay = window.AfterPay
      const afterpayInfo = this.tempPaymentInfo.paymentInfo.afterPayCheckoutInfo
      // afterpay 只支持以下国家
      const afterpayCountry = ['US', 'CA', 'GB', 'AU', 'NZ']
      afterpay.initialize({ countryCode: afterpayCountry.includes(this.country) ? this.country : 'US' })
      const afterpayWindow = afterpay.open()
      if (afterpayWindow) {
        // 判断是否能够打开弹窗
        afterpay.onComplete = (event) => {
          console.log('AfterPay.onComplete====>', event.data)
          if (event.data.status == 'SUCCESS') {
            this.paymentData.nonce = event.data.orderToken
            this.paymentSecondStep()
          } else {
            this.$store.commit('checkout/setErrorDialogShow', true)
            this.$store.commit('checkout/setErrorTipText', this.nl('page_checkout_afterpay_payment_error'))
            this.$store.commit('checkout/setErrorTipCode', 'afterpay_payment')
            _this.isProcessing = false
          }
        }
        afterpay.transfer({ token: afterpayInfo.token, expires: afterpayInfo.expires })
      } else {
        // safri 弹框处理
        if (document.querySelector('.buy-backdrop')) {
          if (document.querySelector('.buy-popup-message')) {
            document.querySelector('.buy-popup-message').style.display = 'none'
          }
          document.querySelector('.buy-backdrop').style.display = 'none'
          if (document.querySelector('.buy-container-closer')) {
            document.querySelector('.buy-container-closer').style.display = 'none'
          }
        }
        _this.isProcessing = false
        _this.$store.commit('checkout/setPopupPayProcessingCode', 'afterpay')
        _this.$store.commit('checkout/setPopupPayProcessingShow', true)
        _this.$nextTick(() => {
          document.querySelector('#btn_paypal_continue') &&
            document.querySelector('#btn_paypal_continue').addEventListener('click', () => {
              _this.initAfterpayPayment()
            })
        })
      }
    },
    // afterpay Cash App Pay
    initCashAppPay() {
      const _this = this
      const afterpayInfo = this.tempPaymentInfo.paymentInfo.afterPayCheckoutInfo
      if (!afterpayInfo.token) {
        this.$store.commit('checkout/setErrorDialogShow', true)
        this.$store.commit('checkout/setErrorTipText', this.nl('page_checkout_afterpay_token_error'))
        this.$store.commit('checkout/setErrorTipCode', 'afterpay_token')
        this.isProcessing = false
        return
      }
      this.hideLoadOrder()
      this.$store.commit('checkout/setPopupPayProcessingCode', 'cashapppay')
      this.$store.commit('checkout/setPopupPayProcessingShow', true)
      this.$nextTick(() => {
        const cashAppPayOptions = {
          button: {
            size: 'small', // "medium" | "small"
            width: 'full', // "full" | "static"
            theme: 'dark', // "dark" | "light"
            shape: 'round' // "round" | "semiround"
          },
          // redirectUrl: window.location.href, // where mobile customers should be redirected to
          onComplete(event) {
            const { status, orderToken } = event.data
            // console.log('---event.data--', event.data)
            if (status == 'SUCCESS') {
              _this.paymentData.nonce = orderToken
              _this.paymentSecondStep()
            } else {
              _this.$store.commit('checkout/setErrorDialogShow', true)
              _this.$store.commit('checkout/setErrorTipText', _this.nl('page_checkout_afterpay_payment_error'))
              _this.$store.commit('checkout/setErrorTipCode', 'afterpay_payment')
              _this.isProcessing = false
            }
          },

          /* Optional event listeners for merchants to track customer behavior and listen for transaction events in the lifecycle */
          eventListeners: {
            CUSTOMER_INTERACTION: ({ isMobile }) => {
              console.log(`CUSTOMER_INTERACTION`)
              if (isMobile) {
                // captureMobileMetrics()
              } else {
                // captureDesktopMetrics()
              }
            },
            CUSTOMER_REQUEST_DECLINED: () => {
              console.log(`CUSTOMER_REQUEST_DECLINED`)
              _this.$store.commit('checkout/setPopupPayProcessingCode', '')
              _this.$store.commit('checkout/setPopupPayProcessingShow', false)
              location.reload()
              _this.$store.commit('checkout/setErrorDialogShow', true)
              _this.$store.commit('checkout/setErrorTipText', _this.nl('page_checkout_afterpay_payment_error'))
              _this.$store.commit('checkout/setErrorTipCode', 'afterpay_payment')
            },
            CUSTOMER_REQUEST_APPROVED: () => {
              console.log(`CUSTOMER_REQUEST_APPROVED`)
            },
            CUSTOMER_REQUEST_FAILED: () => {
              console.log(`CUSTOMER_REQUEST_FAILED`)
            }
          }
        }
        window.AfterPay.initializeForCashAppPay({
          countryCode: 'US',
          token: afterpayInfo.token,
          cashAppPayOptions
        })
      })
    },
    googlepaycallBack(res) {
      this.setPoint('googlepay', 'try', 'click')
      this.$store.commit('checkout/setPopupPayProcessingCode', '')
      this.$store.commit('checkout/setPopupPayProcessingShow', false)
      if (res.error) {
        if (res.error.statusCode == 'CANCELED') {
          this.setPoint('googlepay', 'cancelpeyment', 'click')
        } else {
          this.setPoint('googlepay', res.error.statusCode, 'click', { msg: JSON.stringify(res.error) })
        }
        return
      }

      this.checkoutPayment('googlepay', res.paymentToken)
    },
    /**
     * checkout平台对接 订单支付接口
     * type:支付类型
     * tokenData: 支付token数据
     * 目前对接 googlepay、applepay、欧洲国家开启3ds卡支付267
     */
    checkoutPayment(type, tokenData) {
      // 避免重复调用支付
      this.$store.commit('checkout/setIsPaymentProcessing', true)
      this.paymentData.order_sn = this.tempPaymentInfo.orderInfo.orderSn
      this.paymentData.REF = this.tempPaymentInfo.paymentInfo.REF
      this.paymentData.device_id = generateDeviceId()
      this.paymentData.use_account_balance = this.useAccountBalanceFlag // 是否使用礼品卡余额支付

      let failureUrl =
        window.location.origin +
        `/checkout?order_sn=${this.tempPaymentInfo.orderInfo.orderSn}&order_country_code=${this.orderCountryCode}${
          this.$store.state.isBridal ? '&subsite=bridal' : ''
        }`
      if (type == 'card') {
        // 新增 AZWEB-22102 FR国家站 CKO 支付失败回到checkout页面,提示报错信息
        failureUrl = failureUrl + '&error_tip_code=checkoutCardError'
      }
      const successUrl =
        window.location.origin +
        this.countryUrl(
          `/checkout_success/orderconfirm/${this.tempPaymentInfo.orderInfo.orderSn}?order_country_code=${this.orderCountryCode}${
            this.$store.state.isBridal ? '&subsite=bridal' : ''
          }`
        )
      this.$axios
        .$post('/1.0/order/paymentGateWay', {
          success_url: successUrl,
          failure_url: failureUrl,
          token_data: tokenData || 'tmp',
          payment_id: this.paymentId,
          amount: this.checkoutSummary.totalAmount * 100,
          ...this.paymentData
        })
        .then((res) => {
          if (res.code == 0) {
            // 支付成功添加打点
            // 如果存在网红link id，在msg里面带上此数据
            const linkId = this.$cookie.getCookie('link_id')
            const tempMsg = {
              orderAmount: this.checkoutSummary.totalAmount // 订单金额
            }
            if (linkId) {
              tempMsg.link_id = linkId
            }
            this.setPoint(type, 'trysuccess', 'click')
            this.setPoint('placemyorder', 'success', 'click', tempMsg)
            // 新增 AZWEB-22102 FR国家站 CKO
            if ((type == 'googlepay' && res.data.risk && res.data.risk.flagged) || type == 'card') {
              // 需要3ds验证
              const googleRedirect = (res.data._links && res.data._links.redirect && res.data._links.redirect.href) || ''
              location.href = googleRedirect
            } else {
              // 支付成功
              location.href = successUrl
            }
          } else {
            this.setPoint(type, 'tryfail', 'click')
            this.setPoint('placemyorder', 'error', 'view', { error: res.msg })
            this.$store.commit('checkout/setIsPaymentProcessing', false)
            this.$nextTick(() => {
              this.$store.commit('checkout/setErrorTipCode', type)
              this.$store.commit('checkout/setErrorTipText', res.msg)
              document.querySelector('#payment_and_billing').scrollIntoView({ block: 'center', behavior: 'smooth' })
            })
          }
        })
        .catch((error) => {
          this.setPoint(type, 'tryfail', 'click', { msg: JSON.stringify(error) })
          this.setPoint('placemyorder', 'error', 'view')
          console.log(error)
        })
    },
    /** adyen支付 */
    adyenPayment() {
      if (!this.tempPaymentInfo.paymentInfo.adyenPaymentMethods) {
        this.$store.commit('checkout/setErrorDialogShow', true)
        this.$store.commit('checkout/setErrorTipText', this.nl('page_checkout_afterpay_token_error'))
        this.$store.commit('checkout/setErrorTipCode', 'afterpay_token')
        this.isProcessing = false
      } else {
        const payTypeMap = {
          264: 'directEbanking',
          265: 'ideal',
          266: 'trustly',
          268: 'giropay',
          269: 'sepadirectdebit'
        }
        const returnUrl =
          window.location.origin +
          `/checkout?order_sn=${this.tempPaymentInfo.orderInfo.orderSn}&payment_id=${this.paymentId}&order_country_code=${
            this.orderCountryCode
          }${this.$store.state.isBridal ? '&subsite=bridal' : ''}`
        const _data = {
          success_url: returnUrl,
          payment_id: this.paymentId,
          amount: this.tempPaymentInfo.checkoutSummary.totalAmount,
          order_sn: this.tempPaymentInfo.orderInfo.orderSn,
          paymentMethod: { type: payTypeMap[this.tempPaymentInfo.paymentInfo.paymentId] }
        }
        if (this.tempPaymentInfo.paymentInfo.paymentId === 265) {
          _data.paymentMethod.issuer = this.paymentRulesResult.idealIssuer
        }
        if (this.tempPaymentInfo.paymentInfo.paymentId === 269) {
          _data.paymentMethod['sepa.ownerName'] = this.paymentRulesResult.sepaOwnerName
          _data.paymentMethod['sepa.ibanNumber'] = this.paymentRulesResult.sepaIbanNumber
        }
        this.$axios
          .$post('/1.0/order/paymentGateWay', _data)
          .then((res) => {
            if (res.code == 0 && res.data) {
              if (this.tempPaymentInfo.paymentInfo.paymentId === 269 && res.data.resultCode === 'Authorised') {
                const successUrl =
                  window.location.origin +
                  this.countryUrl(
                    `/checkout_success/orderconfirm/${this.tempPaymentInfo.orderInfo.orderSn}?order_country_code=${this.orderCountryCode}${
                      this.$store.state.isBridal ? '&subsite=bridal' : ''
                    }`
                  )
                location.href = successUrl
                return
              } else if (res.data.action) {
                location.href = res.data.action.url
                return
              }
            }
            this.$store.commit('checkout/setErrorDialogShow', true)
            this.$store.commit('checkout/setErrorTipText', 'page_checkout_afterpay_payment_error')
            this.$store.commit('checkout/setErrorTipCode', 'afterpay_token')
            this.isProcessing = false
          })
          .catch((error) => {
            throw new Error(error)
          })
      }
    },
    /**
     * 调用支付接口
     */
    paymentSecondStep() {
      this.hideLoadOrder()
      this.paymentData.order_sn = this.tempPaymentInfo.orderInfo.orderSn
      this.paymentData.REF = this.tempPaymentInfo.paymentInfo.REF
      // 避免重复调用支付
      this.$store.commit('checkout/setIsPaymentProcessing', true)
      // webPush.payPushengageTrigger('Cart Abandonment')
      if (this.tempPaymentInfo.paymentInfo.paymentId == 97 || this.tempPaymentInfo.paymentInfo.paymentId == 244) {
        // paypal平台付款成功打点
        this.setPoint('placemyorder', 'paypalTrySuccess', 'click')
      }
      this.paymentData.device_id = generateDeviceId()
      this.paymentData.use_account_balance = this.useAccountBalanceFlag // 是否使用礼品卡余额支付
      this.$axios
        .$post('/1.0/order/payment', this.paymentData)
        .then((res) => {
          this.setPoint('placemyorder', 'paypalOrderEnd', 'click')
          if (res.code == 0) {
            // 支付成功添加打点
            // 如果存在网红link id，在msg里面带上此数据
            const linkId = this.$cookie.getCookie('link_id')
            const tempMsg = {
              orderAmount: this.checkoutSummary.totalAmount // 订单金额
            }
            if (linkId) {
              tempMsg.link_id = linkId
            }
            this.setPoint('placemyorder', 'success', 'click', tempMsg)
            if (this.tempPaymentInfo.paymentInfo.paymentId == 97 || this.tempPaymentInfo.paymentInfo.paymentId == 244) {
              // paypal调用支付接口成功打点
              this.setPoint('placemyorder', 'paypalOrderSuccess', 'click')
            }
            // 打点
            this.setDataLayer({
              category: 'NewStructureCheckout',
              action: 'Click',
              label:
                this.$route.name == 'checkout'
                  ? 'NewStructureCheckout_CheckoutButtonNoError_Payment_Click'
                  : 'NewStructureCheckout_PaymentButtonNoError_Click'
            })
            if (this.tempPaymentInfo.paymentInfo.paymentId == 256) {
              const tempwindow = window.open('_blank')
              tempwindow.location.href = `/es/order/invoice_detail?order_sn=${this.tempPaymentInfo.orderInfo.orderSn}`
              window.location.href = this.countryUrl(`/order/detail?order_sn=${this.tempPaymentInfo.orderInfo.orderSn}`)
            } else {
              window.location.href = this.countryUrl(
                `/checkout_success/orderconfirm/${this.tempPaymentInfo.orderInfo.orderSn}?order_country_code=${this.orderCountryCode}${
                  this.$store.state.isBridal ? '&subsite=bridal' : ''
                }`
              )
            }
          } else if (res.origin == 'DLocal' || (res.data && res.data.origin && res.data.origin == 'DLocal')) {
            // 不支持分期支付 code 40002等
            this.isProcessing = false
            this.$store.commit('checkout/setIsPaymentProcessing', false)
            this.$nextTick(() => {
              this.$store.commit('checkout/setErrorTipCode', 'installment')
              this.$store.commit('checkout/setErrorTipText', res.msg)
              document.querySelector('#payment_and_billing').scrollIntoView({ block: 'center', behavior: 'smooth' })
            })
          } else {
            // 一般报错提示刷新页面
            // alert(res.msg)
            this.setPoint('placemyorder', 'error', 'view', { error: res.msg })
            window.location.href = this.countryUrl(
              `/checkout?order_sn=${this.tempPaymentInfo.orderInfo.orderSn}&error=${res.msg}&order_country_code=${this.orderCountryCode}${
                this.$store.state.isBridal ? '&subsite=bridal' : ''
              }`
            )
          }
        })
        .catch((error) => {
          this.setPoint('placemyorder', 'paypalOrderEnd', 'click')
          console.log(error)
        })
    },
    /**
     * 获取订单追踪信息
     */
    uploadOrderTrackInfo() {
      const curTime = Math.round(new Date() / 1000)
      let orderTrackInfo = localStorage.getItem('OrderTracking')
      if (!orderTrackInfo) {
        return
      }
      // get order tracking label list && update order track info
      let dotList = []
      orderTrackInfo = JSON.parse(orderTrackInfo)
      for (const i in orderTrackInfo) {
        if (orderTrackInfo.hasOwnProperty(i)) {
          if (orderTrackInfo[i] <= curTime) {
            delete orderTrackInfo[i]
          } else {
            dotList.push(i)
          }
        }
      }
      // cdn abtest 加上订单追踪 ： VersionA_cdn VersionB_cdna
      dotList.push('VersionA_cdn')

      // 更新去除过期信息后的value
      localStorage.setItem('OrderTracking', JSON.stringify(orderTrackInfo))
      // 转为字符串保存
      dotList = dotList.toString()
      return dotList
    },
    uploadOrderTrackInfoWithGoodsId() {
      const curTime = Math.round(new Date() / 1000)
      let orderTrackInfo = localStorage.getItem('OrderTrackingWithGoodsId')
      if (!orderTrackInfo) {
        return
      }
      // get order tracking label list && update order track info
      const dotList = {}
      orderTrackInfo = JSON.parse(orderTrackInfo)
      for (const i in orderTrackInfo) {
        if (orderTrackInfo.hasOwnProperty(i)) {
          if (orderTrackInfo[i].expireTime <= curTime) {
            delete orderTrackInfo[i]
          } else {
            dotList[i] = orderTrackInfo[i].goodsArr
          }
        }
      }
      // 更新去除过期信息后的value
      localStorage.setItem('OrderTrackingWithGoodsId', JSON.stringify(orderTrackInfo))
      return dotList
    },
    /**
     * checkout支付弹窗状态变更
     */
    showCreateOrderLoading() {
      if (!this.orderInfo.orderSn) {
        this.$store.commit('checkout/setCaPaymentDialogText', this.nl('page_checkout_ca_wait_create_order'))
      } else {
        this.$store.commit('checkout/setCaPaymentDialogText', this.nl('page_checkout_ca_wait_submit_order'))
      }
      this.$store.commit('checkout/setCaPaymentDialogShow', true)
    },
    showOrderProcessLoading() {
      if (this.paymentId != '97' && this.paymentId != 254) {
        this.$store.commit('checkout/setCaPaymentDialogText', this.nl('page_checkout_ca_no_refresh'))
        this.$store.commit('checkout/setCaPaymentDialogShow', true)
      }
    },
    // 创建订单接口调完弹框关闭
    hideLoadOrder() {
      this.$store.commit('checkout/setPopupPayProcessingShow', false)
      this.$store.commit('checkout/setCaPaymentDialogShow', false)
    },
    loginAxios() {
      this.retentionReject()
      this.$axios
        .$post(`/1.0/user/guest`, { email: this.checkoutLoginEmail })
        .then((res) => {
          this.isProcessing = false
          if (res.data && res.data.email) this.$store.commit('checkout/setEmailAddress', res.data.email)
          this.$cookie.setCookie('user_id', res.data.userId || res.data.user_id || '-1', 7, '.' + this.APP_DOMAIN_LOWER)
          this.$cookie.setCookie('webpush_email', this.checkoutLoginEmail || res.data.email, 7, '.' + this.APP_DOMAIN_LOWER)
          if (this.environment.includes('dev')) {
            this.$cookie.setCookie('login_token', res.data.token)
          } else {
            this.$cookie.setCookie('login_token', res.data.token, 7, '.' + this.APP_DOMAIN_LOWER)
          }
          if (res.code == 0) {
            this.$store.commit('userInfo/updateInfo', { ...res.data, isGuest: true })
            this.updateWGDTag(true)
            this.buryPoint(this, 'event', {
              ec: 'sign_user_tag',
              el: 'sign_user_tag_guest',
              ea: 'view',
              msg: JSON.stringify({
                email: res.data.email,
                isLogin: Number(this.isLogin)
              })
            })
            this.trackGA4NewEmail(this.checkoutLoginEmail, 'guest_checkout')
            this.serverCheck()
          } else {
            this.$store.commit('checkout/setCheckoutLoginEmailError', res.msg)
            const checkoutLoginDom = document.querySelector('#checkout_login')
            checkoutLoginDom && checkoutLoginDom.scrollIntoView({ block: 'start', behavior: 'smooth' })
          }
        })
        .catch((error) => {
          this.isProcessing = false
          console.log(error)
        })
    },
    // todo: 清理wgdcpc订单追踪
    clearWGDcpcOrderTracking() {
      // todo: 重置订单追踪
      const mainValue = JSON.parse(this.$localStorage.getLocalStorage('OrderTracking'))
      if (mainValue) {
        /* eslint-disable */
        delete mainValue['wgd_user_cpcsource']
        delete mainValue['wgd_user_list']
        delete mainValue['sodab']
      }
      for (const trackKey in mainValue) {
        if (trackKey.indexOf('share_') == 0) {
          delete mainValue[trackKey]
        }
      }
      // 更新配置
      this.$localStorage.setLocalStorage('OrderTracking', JSON.stringify(mainValue))
    },
    showCouponUseToast() {
      // 如有coupon应用，toast显示coupon已被应用+最大优惠金额
      if (this.couponResultInfo && this.couponResultInfo.couponCode) {
        this.couponToastMsg = this.nl(
          this.couponResultInfo.couponCode === this.maxDiscountCouponCode
            ? 'page_checkout_automatically_coupon_tip'
            : 'page_checkout_applied_coupon_tip',
          null,
          { bonusAmount: this.checkoutSummary.bonusDisplay }
        )
        this.$refs.couponToast.show()
      }
    },
    //记录游客下单的订单号和邮箱
    handleGuestOrderInfo(orderSn) {
      const guestCheckout = {
        orderSn,
        checkoutLoginEmail: this.checkoutLoginEmail
      }
      const guestCheckoutInfo = localStorage.getItem('guestCheckoutInfo')
      let guestCheckoutList = []
      if (guestCheckoutInfo) {
        guestCheckoutList = JSON.parse(guestCheckoutInfo)
      }
      guestCheckoutList = this.uniqueByKey([guestCheckout, ...guestCheckoutList], 'orderSn') //去重
      guestCheckoutList = guestCheckoutList.slice(0, 10) // 保留最新的10条数据
      localStorage.setItem('guestCheckoutInfo', JSON.stringify(guestCheckoutList))
    },
    categoryCheck() {
      if (!this.isLogin && this.categories.length == 0) {
        this.$store.commit('checkout/setCategoryError', true)
        document.querySelector('.interested-list-container').scrollIntoView({ block: 'center', behavior: 'smooth' })
        return false
      }
      return true
    }
  }
}
</script>

<style lang="less" scoped>
.pay-summary {
  width: 310px;
  padding: 15px 20px 20px 20px;
  background: #f6f6f6;
  .summary-tittle {
    text-transform: uppercase;
    padding: 0 0 8px;
    border-bottom: solid 1px #ccc;
    font-family: @font-family-600;
    font-size: 14px;
  }
  .cc-btn-wrap {
    display: flex;
    justify-content: center;
    text-align: center;
    margin-top: 20px;
    .secure_icon {
      display: inline-block;
      margin-right: 10px;
      width: 13px;
      height: 16px;
      background-image: url(~assets/images/checkout/ic-secure.png);
    }
  }
  .tip-terms-and-policy {
    margin-top: 15px;
    a {
      text-decoration: underline;
      color: var(--color-121212);
      text-transform: uppercase;
    }
  }
  a.btn-theme {
    width: 240px;
  }
  button.btn-theme {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 310px;
    background: var(--color-121212);
    color: #fff;
    border: none;
    text-transform: uppercase;
    padding: 10px;
    font-size: 14px;
    font-weight: bold;
    &:hover {
      background: var(--color-1e1e1e);
    }
    &[disabled] {
      background-color: #666 !important;
    }
  }
  p {
    margin-top: 1em;
    text-align: left;
    padding-left: 0.7em;
  }
}
#checkout-btn {
  position: relative;
  cursor: pointer;
}
.party-notice {
  color: var(--color-ff0000);
  font-family: @font-family-500;
  padding-top: 9px;
}

#msg_con {
  color: red;
  margin-top: 5px;
}
#ca-shipping-content {
  display: flex;
  align-items: flex-start;
  margin-top: 15px;
  img {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    margin-left: -4px;
  }
  .text {
    align-self: center;
    font-family: @font-family-500;
    color: var(--color-121212);
    font-size: 12px;
    margin-left: 3px;
    letter-spacing: -0.4px;
    line-height: 16px;
  }
}
#after-tips {
  margin-top: 10px;
  margin-bottom: -10px;
}
// #apple-pay-button {
//   // display: none;
//   background-color: var(--color-121212);
//   background-image: -webkit-named-image(apple-pay-logo-white);
//   background-size: 100% 100%;
//   background-origin: content-box;
//   background-repeat: no-repeat;
//   width: 310px;
//   height: 40px;
//   padding: 10px 0;
//   border-radius: 0;
// }
.az-link {
  color: var(--color-121212) !important;
  text-decoration: underline;
}
.checkout-box {
  .new-btn-checkout {
    background-color: @black-btn-color !important;
    &:hover,
    &:focus,
    &:active,
    &.active {
      background-color: @black-btn-hover-color !important;
    }
  }
  .az-link {
    color: var(--color-121212) !important;
    text-decoration: underline;
  }
}
.icon-google-pay,
.icon-apple-pay {
  fill: currentColor;
  color: #fff;
  width: 47px;
  height: 18px;
}
#btn_google_pay {
  width: 310px;
  // height: 40px;
  display: none;
}
</style>
