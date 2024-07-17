<template>
  <div id="payment_and_billing" class="payment-and-billing-block">
    <block-title
      :title="nl('page_checkout_payment_desc')"
      :secureSslShow="true"
      :btnShow="isCarPayment"
      :btnText="nl('page_common_change')"
      @change="handleChange()"
    >
    </block-title>

    <!-- 编辑checkout页面时，之前选择的支付方式是卡，直接显示支付方式 -->
    <div v-if="isCarPayment" class="payment-card">
      <span :class="cardType" class="card-type"></span>
      <span class="card-end">{{ nl('page_checkout_ending_in') }}{{ paymentInfo.last4CardNumber }}</span>
    </div>

    <template v-else>
      <div :class="{ 'animated animate-shake': checkoutError.isPaymentError }" class="error-tip">
        {{ nl('page_payment_select_method') }}
      </div>

      <div class="payment-method-list">
        <ul v-track.view.click="{ common: getBiParams('all') }">
          <li v-for="(item, index) in showPaymentList" :key="index" v-track.view.click="{ common: getBiParams(item.key) }">
            <div
              :class="{
                selected: paymentId == item.paymentId,
                unused: !item.canUse
              }"
              @click="handleSelectPayMethod(item)"
              class="payment-method-item"
            >
              <span v-if="item.isRecommend" class="icon-payment-recommend">{{ nl('page_common_recommend') }}</span>
              <span :class="{ selected: paymentId == item.paymentId }" class="radio-icon"></span>
              <div>
                <div class="payment-method-item-content">
                  <span v-if="item.paymentId == 254" class="afterpay-icon">
                    <az-icon
                      :class="{ unused: !checkoutSummary.canUseAfterPay }"
                      class="icon-afterpay"
                      icon-class="icon-icon_afterpay_tran"
                    ></az-icon>
                    <afterpay-view :afterpayTips="nl(checkoutSummary.afterPayTips)"></afterpay-view>
                  </span>
                  <span v-else-if="item.key == 'paypal'" class="paypal-icon">
                    <az-icon class="icon-paypal" icon-class="a-icon-paypal"></az-icon>
                  </span>
                  <span v-else-if="item.key == 'paypal_credit'" class="icon-paypal-credit">
                    <az-icon class="icon-paypal_credit" icon-class="icon-paypal_credit"></az-icon>
                  </span>
                  <az-icon v-else-if="item.key == 'oxxo'" class="icon-oxxo" icon-class="a-icon-oxxo"></az-icon>
                  <az-icon v-else-if="[190, 262].includes(item.paymentId)" icon-class="icon-apple-pay" class="icon-apple-pay"></az-icon>
                  <az-icon v-else-if="item.paymentId == 261" icon-class="icon-google-pay-1" class="icon-google-pay"></az-icon>
                  <span v-else-if="item.paymentId == 263">
                    <!-- #19119： DE checkout 页面不展示 klarna 卖点信息 -->
                    <az-icon v-if="currentCountry === 'DE'" icon-class="icon-theme-klarna" class="icon-klarna"></az-icon>
                    <!-- Klarna 卖点信息 -->
                    <klarna-messaging
                      id="klarna-messaging-checkout-payment"
                      v-else
                      :purchaseAmount="(checkoutSummary.totalAmount * 100).toFixed() * 1"
                      :dataKey="'credit-promotion-badge'"
                      :needInitial="true"
                    ></klarna-messaging>
                  </span>
                  <span v-else-if="item.paymentId == 264">
                    <az-icon icon-class="icon-sofort" class="icon-sofort"></az-icon>
                  </span>
                  <span v-else-if="item.paymentId == 265">
                    <az-icon icon-class="icon-ideal" class="icon-ideal"></az-icon>
                  </span>
                  <span v-else-if="item.paymentId == 266">
                    <az-icon icon-class="icon-trustly" class="icon-trustly"></az-icon>
                  </span>
                  <span v-else-if="item.paymentId == 268">
                    <az-icon icon-class="icon-giropay" class="icon-giropay"></az-icon>
                  </span>
                  <span v-else-if="item.paymentId == 269">
                    <az-icon icon-class="icon-sepa" class="icon-sepa"></az-icon>
                  </span>
                  <!-- after pay cash app pay -->
                  <span v-else-if="item.paymentId == 270">
                    <az-icon icon-class="icon-cash-app-pay" class="icon-cashapppay"></az-icon>
                    <span v-if="!item.canUse" class="text">{{ checkoutSummary.cashAppPayTips }}</span>
                  </span>
                  <span v-else>{{ item.name }}</span>
                  <ul v-if="[164, 177, 186, 255, 267].includes(item.paymentId)" class="icon-card icon-all-cards">
                    <template v-for="(card_item, card_index) in payCardList">
                      <!-- mx dlocal账单分期，卡片支持 'a-icon-visa', 'a-icon-master_card', 'a-icon-maestro' -->
                      <li
                        :key="`${card_index}-${card_item}`"
                        :class="{
                          card_item,
                          selected: paymentId == item.paymentId && bankCardInfo.cardName == card_item.replace('a-icon-', '')
                        }"
                        v-if="!(item.paymentId == 255 && !['a-icon-visa', 'a-icon-master_card', 'a-icon-maestro'].includes(card_item))"
                        class="card-item"
                      >
                        <img
                          v-if="card_item == 'cartes-bancaires'"
                          :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/77/51/723e448f39d9ccc6f8f1c96bcefa7751.png')"
                          aria-label="cartes bancaires"
                          alt="cartes bancaires"
                        />
                        <az-icon v-else :icon-class="card_item" class="icon"></az-icon>
                      </li>
                    </template>
                  </ul>
                </div>
                <p v-if="!checkoutSummary.canUseInstallmentsPlan && item.paymentId == 255" class="tips-pay-method">
                  {{ nl('page_checkout_payment_installment_disable') }}
                </p>
              </div>
            </div>
            <p v-if="item.key == 'oxxo' && paymentId == item.paymentId" class="tips-pay-method-content">
              {{ nl('page_checkout_oxxo_pay_tips') }}
            </p>
            <payment-card-form
              ref="paymentCardForm"
              :payType="item.paymentId == 255 ? 'installment' : ''"
              v-if="
                [164, 177, 186, 255, 267].includes(item.paymentId) &&
                  paymentId == item.paymentId &&
                  !(!checkoutSummary.canUseInstallmentsPlan && item.paymentId == 255)
              "
            ></payment-card-form>
            <!-- ideal支付显示银行选择框 -->
            <div v-if="item.paymentId == 265 && paymentId == 265" class="ideal-select-form">
              <az-select
                :class="{ 'error-border': paymentRulesResult.idealPaymentErrorMsg }"
                :defaultValue="paymentRulesResult.idealIssuer"
                :options="idealBankOptions"
                :placeholder="nl('page_payment_ideal_placeholder')"
                @on-change="idealBankChange"
              ></az-select>
              <p v-if="paymentRulesResult.idealPaymentErrorMsg" class="ideal-payment-error-tips theme-warning">
                {{ paymentRulesResult.idealPaymentErrorMsg }}
              </p>
            </div>
            <!-- sepa支付需要输入账户名和账户 -->
            <div v-if="item.paymentId == 269 && paymentId == 269" class="sepa-input-form">
              <az-input
                :class="{ 'error-input': paymentRulesResult.sepaPaymentOwnerNameErrorMsg }"
                :placeholder="nl('page_checkout_sepa_ownername_placeholder')"
                :errorMsg="paymentRulesResult.sepaPaymentOwnerNameErrorMsg"
                @input="sepaInput($event, 'sepaOwnerName', 'sepaPaymentOwnerNameErrorMsg')"
                class="ownername-form-item"
              ></az-input>
              <az-input
                :class="{ 'error-input': paymentRulesResult.sepaPaymentIbanErrorMsg }"
                :placeholder="nl('page_checkout_sepa_iban_placeholder')"
                :errorMsg="paymentRulesResult.sepaPaymentIbanErrorMsg"
                @input="sepaInput($event, 'sepaIbanNumber', 'sepaPaymentIbanErrorMsg')"
                class="iban-form-item"
              ></az-input>
            </div>
          </li>
          <i v-for="i in 2" :key="i - 30"></i>
        </ul>
      </div>

      <div v-if="paymentError" class="error-tip payment-error">
        {{ errorTipCode === 'adyen_payment' ? nl(errorTipText) : errorTipText }}
      </div>
    </template>
    <!-- 如果只有礼品卡，那么不论选择什么支付方式，都展示billing address -->
    <billing-address v-if="payCardFormShow || orderInfo.onlyGiftCard" :billingAddress="billingAddress"></billing-address>
  </div>
</template>
<script>
import BlockTitle from '@/components/checkout/BlockTitle'
import PaymentCardForm from '@/components/checkout/PaymentCardForm'
import AfterpayView from '@/components/common/AfterpayView'
import BillingAddress from '@/components/checkout/BillingAddress'
import AzSelect from '@/components/az-ui/AzSelect'
import KlarnaMessaging from '@/components/common/KlarnaMessaging'
import AzInput from '@/components/az-ui/AzInput'
import { mapState } from 'vuex'
export default {
  name: 'PaymentAndBilling',
  components: { BlockTitle, PaymentCardForm, AfterpayView, BillingAddress, KlarnaMessaging, AzSelect, AzInput },
  props: {
    billingAddress: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      cardRules: [
        { cardName: 'visa', cardReg: /^4[0-9]/ },
        { cardName: 'master_card', cardReg: /^5[1-5]/ },
        { cardName: 'american_express', cardReg: /^(34|37)/ },
        { cardName: 'discover', cardReg: /^6011|^(6(4[4-9]|5[0-9]))/ },
        { cardName: 'diners_club', cardReg: /^(30[0-5]|309|36|38|39)[0-9]/ },
        { cardName: 'jcb', cardReg: /^(35(2[8-9]|[3-8][0-9]))/ }
      ],
      idealBankOptions: []
    }
  },
  computed: {
    ...mapState('checkout', [
      'paymentInfo',
      'paymentId',
      'isCarPayment',
      'paymentInfoList',
      'checkoutError',
      'errorTipCode',
      'errorTipText',
      'checkoutSummary',
      'bankCardInfo',
      'showGooglePay',
      'showApplePay',
      'paymentRulesResult',
      'orderInfo'
    ]),
    payCardFormShow() {
      return [164, 177, 186, 255, 267].includes(this.paymentId)
    },
    paymentError() {
      return (
        this.errorTipCode &&
        !['duplicate', 'unknown_error', 'unavailable', 'blacklist', 'paypal', '', 'eventdate'].includes(this.errorTipCode.toLowerCase())
      )
    },
    cardType() {
      let cardType = ''
      for (let i = 0; i < this.cardRules.length; i++) {
        if (this.cardRules[i].cardReg.test(this.paymentInfo.cardNumber)) {
          cardType = this.cardRules[i].cardName
        }
      }
      return cardType
    },
    // 当前应该展示的国家数据，订单国家信息优先
    currentCountry() {
      const res = this.$route.query.order_country_code
      return res || this.country
    },
    /**
     * 1.可展示的支付方式
     * 接口逻辑 该支付方式是否支持
     * ApplePay 是否支持
     * GooglePay 是否支持
     * 2.显示支付方式但是置灰不可用 canUse:false
     */
    showPaymentList() {
      // 可展示的支付方式
      let showPaymentList = JSON.parse(JSON.stringify(this.paymentInfoList))
      showPaymentList = showPaymentList.filter((item) => {
        return (
          item.isShow && !([190, 262].includes(item.paymentId) && !this.showApplePay) && !(item.paymentId == 261 && !this.showGooglePay)
        )
      })

      showPaymentList.forEach((item, index) => {
        // 展示但是不可用时需要置灰的支付方式: afterpay、分期、oxxo
        if (
          ([254, 270].includes(item.paymentId) && !this.checkoutSummary.canUseAfterPay) ||
          (item.paymentId == 255 && !this.checkoutSummary.canUseInstallmentsPlan) ||
          (item.paymentId == 256 && !this.checkoutSummary.canUseTicket)
        ) {
          item.canUse = false
        } else {
          item.canUse = true
        }
      })
      return showPaymentList
    }
  },
  created() {
    const action = this.$route.query.action
    if (
      this.$route.query.order_sn &&
      action == 'edit_shipping_address' &&
      this.payCardFormShow &&
      !this.errorTipCode &&
      this.paymentInfo.last4CardNumber
    ) {
      this.$store.commit('checkout/setIsCarPayment', true)
    }
  },
  mounted() {
    const action = this.$route.query.action
    if (action == 'edit_payment') {
      document.querySelector('#payment_and_billing').scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
    if (this.paymentId === 265) {
      this.getIdealBankOptions()
    }
  },
  methods: {
    getBiParams(el) {
      if (process.server) return
      const obj = {
        ec: 'paymentway',
        el
      }
      return obj
    },
    // 获取ideal支付可选银行列表
    getIdealBankOptions() {
      this.$axios
        .$get('/1.0/order/paymentMethods', {
          params: {
            totalAmount: this.checkoutSummary.totalAmount
          }
        })
        .then((res) => {
          if (res.code == 0 && res.data.paymentMethods && res.data.paymentMethods.length > 0) {
            const _obj = res.data.paymentMethods.find((item) => {
              return item.type === 'ideal'
            })
            if (_obj && _obj.issuers) {
              this.idealBankOptions = _obj.issuers.map((item) => {
                return {
                  ...item,
                  value: item.id,
                  key: item.id,
                  img: `https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/ideal/${item.id}.svg`
                }
              })
            }
          }
        })
    },
    // ideal银行选择
    idealBankChange(e) {
      this.$store.commit('checkout/setpPaymentRulesResult', {
        idealIssuer: e.id
      })
    },
    // sepa表单输入
    sepaInput(e, formKey, errorKey) {
      const _obj = { ...this.paymentRulesResult }
      _obj[formKey] = e
      if (e && e.trim()) _obj[errorKey] = ''
      this.$store.commit('checkout/setpPaymentRulesResult', _obj)
    },
    handleChange() {
      this.$store.commit('checkout/setIsCarPayment', false)
    },
    handleSelectPayMethod(item) {
      if (this.paymentId == item.paymentId || !item.canUse) {
        return
      }
      if (item.paymentId === 265) {
        this.getIdealBankOptions()
      }

      // this.$store.commit('checkout/setErrorTipCode', '')
      this.$store.commit('checkout/setErrorTipText', '')
      this.$store.commit('checkout/setCheckoutError', { isPaymentError: false })
      this.$store.commit('checkout/setPaymentId', item.paymentId)
      this.$store.commit('checkout/setPaymentName', item.name)
      this.$store.commit('checkout/setBankCardInfo', {})
      this.$store.commit('checkout/setpPaymentRulesResult', {
        cardNumber: '',
        expirateDate: '',
        securityCode: '',
        holderName: '',
        installmentsId: ''
      })
    }
  }
}
</script>
<style lang="less" scoped>
.icon-payment-recommend {
  background: var(--color-5fa452);
  display: flex;
  padding: 1px 5px;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 40px;
  top: -15px;
  color: #fff;
  font-size: 10px;
  &::before {
    // 气泡下三角
    content: '';
    width: 5px;
    height: 5px;
    position: absolute;
    bottom: -2.5px;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    left: 6px;
    background: var(--color-5fa452);
  }
}
.checkout-a {
  .payment-and-billing-block {
    margin-top: 60px;
  }
}
.payment-and-billing-block {
  .error-tip {
    // height: 20px;
    color: #f00;
    margin-top: 10px;
    display: none;
    &.payment-error {
      display: block;
      margin-bottom: 10px;
    }
  }
  .animated {
    animation-duration: 1s;
    animation-fill-mode: both;
    display: block;
  }
  .animate-shake {
    animation-name: shake;
  }
  @keyframes shake {
    from,
    to {
      transform: translate3d(0, 0, 0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translate3d(-6px, 0, 0);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translate3d(6px, 0, 0);
    }
  }
  .payment-card {
    display: flex;
    margin: 15px 0;
    .card-type {
      background-image: url(~assets/images/checkout/review_card_type.png);
      background-repeat: no-repeat;
      display: inline-block;
      height: 21px;
      margin-top: -2px;
      &.visa {
        width: 35px;
        background-position: -37px 0;
      }
      &.master_card {
        width: 35px;
        background-position: -116px 0;
      }
      &.american_express {
        width: 35px;
        background-position: -77px 0;
      }
      &.discover {
        width: 35px;
        background-position: 3px 0;
      }
      &.diners_club {
        width: 35px;
        background-position: -155px 0;
      }
      &.jcb {
        width: 35px;
        background-position: -197px 0;
      }
    }
    .card-end {
      margin-left: 6px;
    }
  }
  .payment-method-list {
    margin: 20px 0;
    ul {
      li {
        margin-bottom: 5px;
        &.hide {
          display: none;
        }
        .payment-method-item {
          position: relative;
          width: fit-content;
          height: 22px;
          padding: 8px 0;
          display: flex;
          align-items: center;
          cursor: pointer;
          border: solid 1px #fff;
          &.unused {
            -webkit-filter: grayscale(100%); /* Chrome, Safari, Opera */
            filter: grayscale(100%);
            opacity: 0.4;
            .radio-icon {
              border-color: #eee;
            }
            span {
              color: #999;
            }
            .text {
              font-size: 12px;
            }
            /deep/ .afterpay span {
              color: #999;
            }
          }
          .radio-icon {
            display: block;
            width: 15px;
            height: 15px;
            padding: 2px;
            border-radius: 50%;
            margin-left: 3px;
            margin-right: 10px;
            border: 1px solid #ccc;
            background-clip: content-box;
            box-sizing: border-box;
            &.selected {
              background-color: var(--color-121212);
              cursor: default;
            }
          }
          .payment-method-item-content {
            display: flex;
            height: 23px;
            align-items: center;
          }
          .tips-pay-method {
            font-size: 10px;
            color: #999;
            margin-top: 2px;
          }
          .icon-card {
            &.icon-all-cards {
              margin-left: 10px;
              display: flex;
              .card-item {
                width: 35px;
                height: 23px;
                margin: 0 5px 0 0;
                &.selected {
                  svg {
                    border: 0.5px solid var(--color-121212);
                    border-radius: 3px;
                  }
                }
                img {
                  width: 100%;
                  height: 100%;
                  display: block;
                }
              }
              svg {
                width: 35px;
                height: 23px;
                vertical-align: top;
              }
            }
            &.icon-card-type {
              top: 13px;
            }
            &.az-icon {
              width: 35px;
              height: 20px;
            }
          }
          .credit-card-icon {
            display: inline-block;
            height: 22px;
            vertical-align: top;
            overflow: hidden;
            margin-left: 7px;
            width: 35px;
            .icon-checkout_card {
              width: 35px;
              height: 22px;
            }
          }
          .afterpay-icon {
            display: inline-flex;
            height: 16px;
            vertical-align: top;
            overflow: hidden;
            margin-right: 5px;
            align-items: center;
            .icon-afterpay {
              width: 70px;
              height: 16px;
              fill: currentColor;
              color: var(--color-121212);
              &.unused {
                color: #999;
              }
            }
            /deep/ .afterpay {
              margin-top: 0;
              margin-left: 5px;
              .text {
                font-size: 12px;
              }
              .icon {
                margin-top: 0;
              }
              .icon-afterpay {
                display: none;
              }
              .icon-i {
                width: 10px;
                height: 10px;
                margin-top: 3px;
                margin-left: 2px;
              }
            }
          }
          .paypal-icon {
            display: inline-block;
            height: 16px;
            vertical-align: top;
            overflow: hidden;
            // margin-left: 7px;
            width: 62px;
            .icon-paypal {
              width: 62px;
              height: 16px;
            }
          }
          .icon-klarna {
            width: 60px;
            height: 30px;
          }
          .icon-sofort,
          .icon-ideal,
          .icon-trustly {
            width: 70px;
            height: 50px;
          }
          .icon-giropay {
            width: 85px;
            height: 45px;
          }
          .icon-sepa {
            width: 65px;
            height: 30px;
          }
          .icon-cashapppay {
            width: 94px;
          }
          .icon-paypal-credit {
            display: inline-block;
            height: 22px;
            vertical-align: top;
            overflow: hidden;
            // margin-left: 7px;
            width: 47px;
            .icon-paypal_credit {
              width: 47px;
              height: 22px;
            }
          }
          .icon-oxxo {
            width: 48px;
            height: 22px;
          }
          .icon-google-pay {
            width: 44px;
            height: 24px;
          }
          .icon-apple-pay {
            fill: currentColor;
            color: var(--color-121212);
            width: 41px;
            height: 16px;
          }
        }
      }
    }
    i {
      order: 3;
      width: 50px;
      height: 0;
      display: block;
    }
  }
}
.checkout-box {
  .radio-icon.selected {
    background-color: @black-btn-color!important;
  }
}
.ideal-select-form {
  margin-top: 10px;
  /deep/ .az-select,
  /deep/.az-select-main {
    width: 355px !important;
  }
}
.ideal-payment-error-tips {
  margin-top: 5px;
}
// 设置 klarna-placement 的样式
// https://docs.klarna.com/on-site-messaging/in-depth-knowledge/styling-on-site-messaging-with-css/
/deep/ #klarna-messaging-checkout-payment {
  margin-top: 0;
}
.sepa-input-form {
  display: flex;
  .ownername-form-item {
    width: 240px;
  }
  .iban-form-item {
    width: 400px;
    margin-left: 10px;
  }
  /deep/ .error-input {
    input {
      border: solid 1px #f00 !important;
    }
  }
}
</style>
