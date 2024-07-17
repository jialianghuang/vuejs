<template>
  <div class="checkout-box">
    <main-app ref="main" :isSimple="true">
      <div id="checkout" class="main">
        <div class="pay-left">
          <div class="pay-left-value">
            <span>{{ nl('page_azazie_perks_total_value') }}: {{ rightsPackage.showShopPrice }}</span>
          </div>
          <rights-payment-and-billing></rights-payment-and-billing>
          <div v-if="isApplePay">
            <button id="apple-pay-button" v-show="applePayBtnShow"></button>
          </div>
          <az-button id="btn_sbmt_order" v-else :needIcon="false" @click="createOrder" class="btn btn-default btn-pay">
            <span v-html="isProcessing ? `${nl('page_order_progress_processing')}...` : 'Complete Purchase'"></span>
          </az-button>
        </div>
      </div>
    </main-app>
    <!-- paypal afterpay 再次支付 -->
    <popup-pay-processing v-if="popupPayProcessingShow"></popup-pay-processing>
    <az-loading v-if="loadingFlag"></az-loading>
    <azazie-toast v-if="showToast" :success="payResult" @closeToast="closeToast"></azazie-toast>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import RightsPaymentAndBilling from '@/components/rights/RightsPaymentAndBilling'
import PopupPayProcessing from '@/components/checkout/PopupPayProcessing'
import AzButton from '@/components/az-ui/Button/AzButton'
import AzLoading from '@/components/az-ui/AzLoading'
import { init, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { mapState, mapMutations } from 'vuex'
import paymentCardMixins from '@/assets/js/paymentCardMixins.js'
import AzazieToast from '@/components/rights/AzazieToast'

export default {
  name: 'RightCheckout',
  components: {
    AzButton,
    MainApp,
    RightsPaymentAndBilling,
    PopupPayProcessing,
    AzLoading,
    AzazieToast
  },
  mixins: [paymentCardMixins],
  data() {
    return {
      isProcessing: false,
      isApplePay: false,
      applePayBtnShow: false,
      orderSn: '',
      paymentInfo: {},
      nonce: '',
      showToast: false,
      payResult: false
    }
  },
  computed: {
    ...mapState('rightsCheckout', ['paymentId', 'rightsPackage', 'rightsId', 'payList']),
    ...mapState('checkout', [
      'popupPayProcessingShow',
      'bankCardInfo',
      'billingAddress',
      'billingAddressId',
      'loadingFlag',
      'isPaymentProcessing'
    ])
  },
  async asyncData(context) {
    try {
      // AZWEB-19285 下掉权益包，路径重定向
      const hideRights = true
      if (hideRights) {
        context.redirect(302, '/404')
        return
      }

      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      if (!['US'].includes(context.store.state.country)) {
        return context.redirect(302, resetSeoUrl(context, '/order/list'))
      }

      const rightsId = context.route.query.rightsId
      if (!rightsId) {
        return context.redirect(302, resetSeoUrl(context, '/user?azazie_perks'))
      }
      context.store.commit('rightsCheckout/setRightsId', rightsId)
      const url = `/1.0/rights/order/checkout?rights_id=${rightsId}&order_type=rights_package`
      const res = await context.$axios.$post(url, { rights_id: rightsId, order_type: 'rights_package' })
      if (res.code == 0) {
        if (res.data.rightsPackage && res.data.paymentInfo) {
          context.store.commit('rightsCheckout/setPayList', res.data.paymentInfo.list)
          context.store.commit('rightsCheckout/setRightsPackage', res.data.rightsPackage)
          context.store.commit('rightsCheckout/setPaymentId', res.data.paymentInfo.selectedId)
          context.store.commit('checkout/setBillingAddress', [res.data.billingAddress])
          res.data.billingAddress && context.store.commit('checkout/setBillingAddressId', res.data.billingAddress.addressId)
        } else {
          context.redirect(302, resetSeoUrl(context, '/user?azazie_perks'))
          return
        }
      } else if (res.code == 5) {
        // code等于5表明redis链接失败，需要用户刷新重试
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(
          302,
          context.store.state.currentCountryUrl + `/sale_down?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`
        )
        return
      } else if (res.code == 100501) {
        // 未登录
        context.redirect(302, `/user/login?back=${context.route.fullPath}`)
        return
      } else {
        context.redirect(302, '/user?azazie_perks')
        return
      }

      return {
        ...commonAsyncData
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
  created() {},
  mounted() {
    this.setOrderSourceFlag('VersionB_guest', true)
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
  },
  methods: {
    ...mapMutations('rightsCheckout', ['setPaymentId']),
    closeToast() {
      this.showToast = false
    },
    hideLoadOrder() {
      this.$store.commit('checkout/setPopupPayProcessingShow', false)
      this.$store.commit('checkout/setLoadingFlag', false)
    },
    // 支付方式校验
    paymentMethodCheck() {
      let flag = true
      const isHasCardInfo =
        this.bankCardInfo &&
        (this.bankCardInfo.cardNumber || this.bankCardInfo.month || this.bankCardInfo.year || this.bankCardInfo.securityCode)
      // 是否是有卡信息

      const isPaymentFormError =
        this.paymentRulesResult.cardNumber || this.paymentRulesResult.expirateDate || this.paymentRulesResult.securityCode // 是否存在报错

      if (
        this.payList &&
        this.payList.length > 1 &&
        (!this.paymentId || (this.paymentId && [164, 177, 186].includes(this.paymentId) && !isPaymentFormError && !isHasCardInfo))
      ) {
        // 多种支付方式,没有选择支付方式
        this.$store.commit('checkout/setCheckoutError', { isPaymentError: true })
        this.setPoint('rightsCheckout', 'error', 'view', { error: this.nl('page_payment_select_method') })
        return false
      }

      if (this.paymentId && [164, 177, 186].includes(this.paymentId)) {
        const isHasCardInfo =
          this.bankCardInfo &&
          (this.bankCardInfo.cardNumber || this.bankCardInfo.month || this.bankCardInfo.year || this.bankCardInfo.securityCode)
        // 是否是有卡信息

        const isPaymentFormError =
          this.paymentRulesResult.cardNumber || this.paymentRulesResult.expirateDate || this.paymentRulesResult.securityCode // 是否存在报错

        if (((this.payList && this.payList.length == 1) || isHasCardInfo) && !isPaymentFormError) {
          // 卡支付的表单校验
          const rulesResult = JSON.parse(JSON.stringify(this.paymentRulesResult))
          const param = {
            cardNumber: this.bankCardForm.cardNumber,
            expirateDate: this.bankCardForm.expirateDate,
            securityCode: this.bankCardForm.securityCode
          }
          this.validator.validate(param, (errors, fields) => {
            let valiErrors = errors
            if (this.paymentId != 255) {
              // 只有mx支付需要校验'holderName', 'installmentsId'
              valiErrors = valiErrors.length && valiErrors.filter((item) => !['holderName', 'installmentsId'].includes(item.field))
            }
            if (valiErrors && valiErrors.length) {
              valiErrors.map((item) => {
                if (!rulesResult[item.field]) {
                  this.setPoint('rightsCheckout', 'error', 'view', { error: item.message })
                  rulesResult[item.field] = item.message
                }
              })
              this.$store.commit('checkout/setpPaymentRulesResult', rulesResult)
              flag = false
            }
          })
        } else {
          flag = false
        }
      }
      return flag
    },
    /**
     * 创建订单
     */
    createOrder() {
      // 支付校验
      if (!this.paymentMethodCheck()) return false
      // 账单地址校验
      if (!this.billingAddressId) {
        this.$store.commit('checkout/setCheckoutError', { isBillingAddressError: true })
        return false
      }
      const url = '/1.0/rights/order/create'
      const params = {
        version: 'a',
        order_track_id: '7b671f1b0b24eb2e742fe60a4fb316b8', // 待定
        rights_id: this.rightsId,
        payment_id: this.paymentId,
        address_id: this.billingAddressId,
        shipping_method_id: 2
      }
      this.$store.commit('checkout/setLoadingFlag', true)
      this.$axios
        .$post(url, params)
        .then((res) => {
          if (res.code == 0) {
            this.paymentInfo = res.data.paymentInfo
            this.orderSn = res.data.orderSn
            this.paymentFirstStep()
          } else {
            this.$store.commit('checkout/setLoadingFlag', false)
            alert(res.msg)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    /**
     * 支付在创建后
     */
    paymentFirstStep() {
      if ((this.paymentId == 97 || this.paymentId == 244) && this.paymentInfo.useBraintree == true) {
        this.paypalPayment()
      } else {
        this.paymentSecondStep()
      }
    },
    /**
     * 支付接口
     * ref TODO
     */
    paymentSecondStep() {
      const { cardNumber, securityCode, year, month, expirateDate } = this.bankCardInfo
      const params = {
        order_sn: this.orderSn,
        payment_id: this.paymentId,
        rights_id: this.rightsId,
        nonce: this.nonce,
        card_number: cardNumber,
        card_code: securityCode,
        year,
        month,
        exp_date: expirateDate
      }
      this.$axios
        .$post('/1.0/rights/order/pay', params)
        .then((res) => {
          this.setPoint('rightsCheckout', 'paypalOrderEnd', 'click')
          this.hideLoadOrder()
          this.showToast = true
          if (res.code == 0) {
            if (this.paymentId == 97 || this.paymentId == 244) {
              // paypal调用支付接口成功打点
              this.setPoint('rightsCheckout', 'paypalOrderSuccess', 'click')
            }
            this.payResult = true
            this.isSsueOrderRights()
          } else {
            // res.msg
            this.payResult = false
            window.location.href = this.countryUrl(`/user?azazie_perks`)
          }
        })
        .catch((error) => {
          this.setPoint('rightsCheckout', 'paypalOrderEnd', 'click')
          console.log(error)
        })
    },
    // 放发券接口
    isSsueOrderRights() {
      const params = {
        order_sn: this.orderSn
      }
      this.$axios
        .$post('/1.0/rights/order/issueRights', params)
        .then((res) => {
          if (res.code == 0) {
            window.location.href = this.countryUrl('/user?my_coupons')
          } else {
            window.location.href = this.countryUrl('/user?azazie_perks&coupon_history=1')
          }
        })
        .catch((error) => {
          window.location.href = this.countryUrl('/user?azazie_perks&coupon_history=1')
          console.log(error)
        })
    },
    paypalPayment() {
      const _this = this
      const token = _this.paymentInfo.token

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
    doPaypalPayment(paypalInstance, err) {
      // 唤起paypal打点
      this.setPoint('rightsCheckout', 'paypalTry', 'click')
      const _this = this
      if (typeof dataLayer != 'undefined') {
        window.dataLayer.push({ event: 'FlowReview2PayClick' })
      }
      // Tokenize here!
      paypalInstance.tokenize(
        {
          flow: 'vault', // Required
          amount: _this.rightsPackage.shopPrice, // Required
          currency: 'USD', // Required
          enableShippingAddress: true,
          shippingAddressEditable: false,
          offerCredit: _this.paymentId == 244
        },
        function(err, tokenizationPayload) {
          if (err != null) {
            _this.hideLoadOrder()
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
            } else if (err.code != 'PAYPAL_POPUP_CLOSED' && err.code != 'PAYPAL_TOKENIZATION_REQUEST_ACTIVE') {
              // 报错弹窗
              _this.$store.commit('checkout/setErrorDialogShow', true)
              _this.$store.commit('checkout/setErrorTipCode', 'paypal')
              _this.$store.commit('checkout/setErrorTipText', _this.nl('page_pay_paypal_error'))
            }
            return false
          }
          _this.nonce = tokenizationPayload.nonce
          _this.paymentSecondStep()
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 1140px;
  padding: 9px 30px 20px 30px;
  margin: 0 auto 245px;
  min-height: 535px;
  .pay-left {
    width: 70%;
    min-height: 527px;
    margin: 0 auto;
    text-align: center;
    .btn-pay {
      margin-top: 20px;
    }
    #apple-pay-button {
      background-color: black;
      background-image: -webkit-named-image(apple-pay-logo-white);
      background-size: 100% 100%;
      background-origin: content-box;
      background-repeat: no-repeat;
      width: 100%;
      height: 44px;
      padding: 10px 0;
      border-radius: 10px;
    }
    .pay-left-value {
      height: 33px;
      font-size: 24px;
      font-family: @font-family-500;
      color: var(--color-121212);
      line-height: 33px;
      text-align: center;
      padding: 21px 0 35px;
      margin-top: 30px;
    }
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
</style>
