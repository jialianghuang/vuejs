<template>
  <div>
    <az-overlay :zIndex="12" :overlayStyle="{ 'background-color': 'rgba(0, 0, 0, 0.75)' }" @click="overlayClick">
      <div class="payment-tip-content">
        <az-icon v-if="popupPayProcessingCode == 'afterpay'" icon-class="icon-icon_afterpay_tran-copy" class="icon-paypal"></az-icon>
        <az-icon v-if="popupPayProcessingCode == 'paypal'" icon-class="icon-Paypal" class="icon-paypal"></az-icon>
        <az-icon v-if="popupPayProcessingCode == 'googlepay'" icon-class="icon-google-pay-3" class="icon-google-pay"></az-icon>
        <p>{{ payTip }}</p>
        <p>{{ nl('page_continue_pay_tip') }}</p>
        <div v-if="popupPayProcessingCode == 'googlepay'" v-track.view="{ common: getBiParams('googlepay', 'popup') }" class="btn-pay-wrap">
          <a id="btn_google_pay_continue" :class="language" v-track.click="{ common: getBiParams('googlepay', 'popupbuywithgogle') }">
            <az-icon :iconClass="language == 'en' ? 'icon-google-pay-btn' : 'icon-google-pay-btn-2'" class="icon-google-pay-btn"></az-icon>
          </a>
          <a @click="overlayClick">{{ nl('page_common_cancel') }}</a>
        </div>
        <div v-else-if="popupPayProcessingCode == 'applepay'" class="btn-pay-wrap">
          <button id="apple-pay-button"></button>
          <a @click="overlayClick">{{ nl('page_common_cancel') }}</a>
        </div>
        <div v-else-if="popupPayProcessingCode == 'cashapppay'" class="btn-pay-wrap">
          <div id="cash-app-pay"></div>
          <a @click="overlayClick">{{ nl('page_common_cancel') }}</a>
        </div>
        <div v-else class="btn-wrap">
          <a @click="overlayClick">{{ nl('page_common_cancel') }}</a>
          <a id="btn_paypal_continue">{{ nl('page_payment_continue') }}</a>
        </div>
      </div>
    </az-overlay>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
export default {
  name: 'PopupPayProcessing',
  components: { AzOverlay },
  data() {
    return {}
  },
  computed: {
    ...mapState('checkout', ['popupPayProcessingShow', 'popupPayProcessingCode']),
    payTip() {
      let tip = ''
      if (this.popupPayProcessingCode == 'paypal') {
        tip = this.nl('page_paypal_tip')
      } else if (this.popupPayProcessingCode == 'afterpay') {
        tip = this.nl('page_afterpay_tip')
      } else if (this.popupPayProcessingCode == 'googlepay') {
        tip = this.nl('page_googlepay_tip')
      }
      return tip
    }
  },
  methods: {
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        ec,
        el
      }
      return obj
    },
    overlayClick() {
      if (this.popupPayProcessingCode == 'cashapppay') {
        location.reload()
        return
      }
      if (this.popupPayProcessingCode == 'googlepay') {
        this.setPoint('googlepay', 'cancel', 'click')
      }
      this.$store.commit('checkout/setPopupPayProcessingShow', false)
    }
  }
}
</script>
<style lang="less" scoped>
.payment-tip-content {
  color: #fff;
  text-align: center;
  .icon-google-pay {
    width: 95px;
    height: 51px;
    margin-bottom: 30px;
  }
  .icon-paypal {
    font-size: 130px;
    color: #fff;
    fill: currentColor;
  }
  .btn-pay-wrap {
    width: 335px;
    margin: auto;
    a {
      text-decoration: underline;
      color: #fff;
      margin-top: 15px;
      display: block;
    }
    #btn_google_pay_continue {
      border-radius: 100vh;
      background: var(--color-121212) !important;
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 30px;
      margin-bottom: 15px;
      text-decoration: none;
      border: 1px solid #747775;
      cursor: pointer;
      min-width: 240px;
      .icon-google-pay-btn {
        width: 61px;
        height: 24px;
      }
      &.en {
        .icon-google-pay-btn {
          width: 132px;
          height: 24px;
        }
      }
    }
    #apple-pay-button {
      background-color: black;
      background-image: -webkit-named-image(apple-pay-logo-white);
      background-size: 100% 100%;
      background-origin: content-box;
      background-repeat: no-repeat;
      width: 335px;
      height: 44px;
      padding: 10px 0;
      // border-radius: 10px;
      text-decoration: none;
      margin-top: 30px;
      margin-bottom: 15px;
      border: 1px solid #747775;
    }
    #cash-app-pay {
      margin-top: 30px;
    }
  }

  .btn-wrap {
    margin-top: 20px;
    a {
      text-decoration: underline;
      font-size: 16px;
      font-family: @font-family-600;
      cursor: pointer;
      color: #fff;
      &:nth-child(1) {
        margin-right: 40px;
      }
    }
  }
}
</style>
