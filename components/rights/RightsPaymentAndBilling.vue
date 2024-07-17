<template>
  <div id="rights_payment_and_billing" class="rights-payment-and-billing-block">
    <SvgPayment />
    <!-- 标题 -->
    <block-title :secureSslShow="true" :btnShow="false" :btnText="nl('page_common_change')" title="PAYMENT"></block-title>

    <template>
      <div :class="{ 'animated animate-shake': checkoutError.isPaymentError }" class="error-tip">
        {{ nl('page_payment_select_method') }}
      </div>

      <div class="payment-method-list">
        <ul>
          <li v-for="(item, index) in payList" :key="index" :class="{ hide: item.key == 'applepay' && !showApplePay }">
            <div
              v-track.click="{ common: { ec: 'payment', el: item.name } }"
              :class="{
                selected: paymentId == item.paymentId,
                can_not_use_afterpay: !checkoutSummary.canUseAfterPay && item.paymentId == 254
              }"
              @click="handleSelectPayMethod(item)"
              class="payment-method-item"
            >
              <span :class="{ selected: paymentId == item.paymentId }" class="radio-icon"></span>
              <span v-if="item.paymentId != '97'">{{ item.name }}</span>
              <span v-if="item.key == 'paypal'" class="paypal-icon">
                <az-icon class="icon-paypal" icon-class="a-icon-paypal"></az-icon>
              </span>
              <span v-else-if="item.key == 'paypal_credit'" class="icon-paypal-credit">
                <az-icon class="icon-paypal_credit" icon-class="icon-paypal_credit"></az-icon>
              </span>
              <template v-else-if="[164, 177, 186].includes(item.paymentId)">
                <span v-for="(card, cardIndex) in payCardList" :key="cardIndex" class="card-item">
                  <img
                    v-if="card == 'cartes-bancaires'"
                    :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/77/51/723e448f39d9ccc6f8f1c96bcefa7751.png')"
                    alt="cartes bancaires"
                  />
                  <az-icon v-else :icon-class="card" class="icon"></az-icon>
                </span>
              </template>
            </div>
            <!-- 展示卡号输入表单 -->
            <template v-if="[164, 177, 186].includes(item.paymentId)">
              <payment-card-form ref="paymentCardForm" v-show="payCardFormShow"></payment-card-form>
            </template>
          </li>
          <i v-for="i in 2" :key="i - 30"></i>
        </ul>
      </div>

      <div v-if="paymentError" class="error-tip payment-error">
        {{ errorTipCode === 'adyen_payment' ? nl(errorTipText) : errorTipText }}
      </div>
    </template>

    <rights-billing-address v-if="payCardFormShow"></rights-billing-address>
  </div>
</template>
<script>
import BlockTitle from '@/components/checkout/BlockTitle'
import PaymentCardForm from '@/components/checkout/PaymentCardForm'
// import AfterpayView from '@/components/common/AfterpayView'
import RightsBillingAddress from '@/components/rights/RightsBillingAddress'
import { mapState, mapMutations } from 'vuex'
import SvgPayment from '@/components/svgs/SvgPayment'

export default {
  name: 'RightsPaymentAndBilling',
  components: {
    BlockTitle,
    PaymentCardForm,
    // AfterpayView,
    RightsBillingAddress,
    SvgPayment
  },
  data() {
    return {
      showApplePay: false, // 是否支持apple pay
      cardRules: [
        { cardName: 'visa', cardReg: /^4[0-9]/ },
        { cardName: 'master_card', cardReg: /^5[1-5]/ },
        { cardName: 'american_express', cardReg: /^(34|37)/ },
        { cardName: 'discover', cardReg: /^6011|^(6(4[4-9]|5[0-9]))/ },
        { cardName: 'diners_club', cardReg: /^(30[0-5]|309|36|38|39)[0-9]/ },
        { cardName: 'jcb', cardReg: /^(35(2[8-9]|[3-8][0-9]))/ }
      ]
    }
  },
  computed: {
    ...mapState('checkout', ['checkoutError', 'errorTipCode', 'errorTipText', 'checkoutSummary']),
    ...mapState('rightsCheckout', ['payList', 'paymentId']),
    payCardFormShow() {
      return [164, 177, 186].includes(this.paymentId)
    },
    paymentError() {
      return (
        this.errorTipCode &&
        !['duplicate', 'unknown_error', 'unavailable', 'blacklist', 'paypal', '', 'eventdate'].includes(this.errorTipCode.toLowerCase())
      )
    }
  },
  mounted() {
    if (!window.is_app && window.ApplePaySession && window.ApplePaySession.canMakePayments()) this.showApplePay = true
  },
  methods: {
    ...mapMutations('rightsCheckout', ['setPaymentId']),
    // 选择支付方式
    handleSelectPayMethod(item) {
      this.setPaymentId(item.paymentId)
      this.$store.commit('checkout/setCheckoutError', { isPaymentError: false })
    }
  }
}
</script>
<style lang="less" scoped>
.rights-payment-and-billing-block {
  width: 752px;
  text-align: left;
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
      // display: flex;
      // justify-content: space-between;
      // flex-wrap: wrap;
      li {
        // margin-left: 20px;
        // &:nth-child(1) {
        //   margin-left: 0;
        // }
        &.hide {
          display: none;
        }
        .payment-method-item {
          width: fit-content;
          height: 22px;
          padding: 10px 0;
          display: flex;
          align-items: center;
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
            outline: 10px solid transparent;
            cursor: pointer;
            &.selected {
              background-color: var(--color-121212);
              cursor: default;
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
          &.can_not_use_afterpay {
            .radio-icon {
              border-color: #eee;
            }
            /deep/ .afterpay span {
              color: #999;
            }
          }
          .paypal-icon {
            display: inline-block;
            height: 16px;
            vertical-align: top;
            overflow: hidden;
            width: 62px;
            .icon-paypal {
              width: 62px;
              height: 16px;
            }
          }
          .icon-paypal-credit {
            display: inline-block;
            height: 22px;
            vertical-align: top;
            overflow: hidden;
            margin-left: 7px;
            width: 41px;
            .icon-paypal_credit {
              width: 41px;
              height: 22px;
            }
          }
          .card-item {
            .icon,
            img {
              border-radius: 2px;
              width: 35px;
              height: 23px;
              margin-left: 5px;
              vertical-align: middle;
            }
            &:nth-child(3) {
              margin-left: 5px;
            }
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
</style>
