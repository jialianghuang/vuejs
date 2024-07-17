<template>
  <az-popup-layer
    :close-color="'var(--color-121212)'"
    :zIndex="12"
    @close="closeAlert()"
    v-if="errorDialogShow"
    :width="layerWidth"
    :padding="errorTipCode == 'afterpay' ? '40px' : '0'"
    height="auto"
  >
    <div :class="errorTipCode" class="alert-content">
      <img :src="errorImg[errorTipCode.toLowerCase()]" alt="error" />
      <p v-if="errorTipCode === 'adyen_payment'" v-html="nl(errorTipText)"></p>
      <p v-else v-html="errorTipText"></p>
      <template v-if="errorTipCode == 'eventdate'">
        <az-button @click="closeAlert('yes')" class="btn btn-default w-240 bg-btn" style="text-transform:uppercase;">
          {{ nl('page_order_event_date_continue_checkout') }}
        </az-button>
        <az-button
          v-if="['US', 'CA'].includes(orderCountryCode)"
          @click="closeAlert('no')"
          class="btn btn-default  bgf w-240"
          style="text-transform:uppercase;"
        >
          {{ nl('page_order_event_date_shop_ready_to_ship') }}
        </az-button>
      </template>
      <template v-else>
        <az-button v-if="errorTipCode == 'duplicate'" @click="closeAlert" class="btn btn-default">{{
          nl('page_pay_check_my_order')
        }}</az-button>
        <az-button v-else @click="closeAlert" class="btn btn-default">{{ nl('page_pay_got_it') }}</az-button>
      </template>
    </div>
  </az-popup-layer>
</template>

<script>
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import AzButton from '@/components/az-ui/Button/AzButton'
import { mapState } from 'vuex'
export default {
  name: 'ErrorDialog',
  components: {
    AzPopupLayer,
    AzButton
  },
  data() {
    return {
      errorImg: {
        unknown_error: require('~/assets/images/checkout/unknown_error_popup.png'),
        blacklist: require('~/assets/images/checkout/blacklist_error_popup.png'),
        duplicate: require('~/assets/images/checkout/duplicate_error_popup.png'),
        paypal: require('~/assets/images/checkout/paypal_error_popup.png'),
        unavailable: require('~/assets/images/checkout/unavailable_error_popup.png'),
        eventdate: require('~/assets/images/checkout/eventdate_error_popup.png'),
        afterpay_token: require('~/assets/images/checkout/paypal_error_popup.png'),
        afterpay_payment: require('~/assets/images/checkout/paypal_error_popup.png'),
        afterpay: require('~/assets/images/checkout/afterpay_error_popup.png'),
        klarna_token: require('~/assets/images/checkout/paypal_error_popup.png'),
        klarna_payment: require('~/assets/images/checkout/paypal_error_popup.png'),
        adyen_payment: require('~/assets/images/checkout/paypal_error_popup.png')
      }
    }
  },
  computed: {
    ...mapState('checkout', ['errorDialogShow', 'errorTipCode', 'errorTipText', 'orderInfo']),
    layerWidth() {
      if (this.errorTipCode == 'afterpay') {
        return '332px'
      } else if (['afterpay_token', 'afterpay_payment', 'klarna_token', 'klarna_payment', 'adyen_payment'].includes(this.errorTipCode)) {
        return '412px'
      } else {
        return '320px'
      }
    },
    paymentError() {
      return (
        this.errorTipCode &&
        !['duplicate', 'unknown_error', 'unavailable', 'blacklist', 'paypal', '', 'eventdate'].includes(this.errorTipCode.toLowerCase())
      )
    },
    orderCountryCode() {
      const res = this.$route.query.order_country_code || this.country
      return res
    }
  },
  watch: {
    errorDialogShow(val) {
      if (val) {
        this.setPoint('eventdate', 'window', 'view')
      }
    }
  },
  mounted() {
    // 需要弹框的报错 duplicate 重复提交订单 unknown_error 其他位置信息造成支付进程失败
    if (this.errorTipCode.toLowerCase() == 'duplicate' || this.errorTipCode.toLowerCase() == 'unknown_error') {
      this.$store.commit('checkout/setErrorDialogShow', true)
    }

    // 失效商品报错弹窗处理
    if (this.orderInfo.unavailableGoodsCnt > 0) {
      this.$store.commit('checkout/setErrorDialogShow', true)
      this.$store.commit('checkout/setErrorTipCode', 'unavailable')
      this.$store.commit('checkout/setErrorTipText', this.nl('page_pay_unavailable_items'))
    }

    // payment报错定位
    if (this.paymentError) {
      document.querySelector('#payment_and_billing').scrollIntoView({ block: 'center', behavior: 'smooth' })
    }

    this.setDataLayer({ category: 'NewStructureCheckout', action: 'view', label: this.errorTipCode })
  },
  methods: {
    closeAlert(type) {
      if (type == 'yes') {
        this.setPoint('eventdate', 'continuecheckout', 'click')
      }
      if (type == 'no') {
        this.setPoint('eventdate', 'shopreadytoship', 'click')
      }

      if (this.errorTipCode == 'duplicate') {
        window.location.href = this.countryUrl('/order/list')
      } else if (this.errorTipCode == 'blacklist') {
        this.$emit('logout')
      } else if (this.errorTipCode == 'eventdate') {
        if (type && type == 'no') {
          window.location.href = this.countryUrl('/all/ready-to-ship?current_in_stock=yes')
        } else if (type && type == 'yes') {
          // 继续支付
          this.$emit('continuePay')
        }
      } else if (['afterpay', 'afterpay_token', 'klarna_token'].includes(this.errorTipCode)) {
        window.location.reload()
      }
      this.$store.commit('checkout/setErrorDialogShow', false)
    }
  }
}
</script>

<style lang="less" scoped>
.btn {
  cursor: pointer;
}
.alert-content {
  width: 100%;
  height: fit-content;
  background: #ffffff;
  padding-bottom: 30px;
  text-align: center;
  img {
    width: 280px;
    height: 125px;
    display: block;
    margin: auto;
  }
  p {
    width: 270px;
    color: var(--color-121212);
    line-height: 20px;
    font-size: 13px;
    margin: 20px auto auto auto;
    text-align: center;
  }
  button {
    margin-top: 20px;
  }
  .bgf {
    background: #ffffff;
    border: 1px solid var(--color-cccccc);
    margin-top: 10px;
    color: var(--color-121212);
  }
  .w-240 {
    width: 240px;
  }
  &.afterpay,
  .afterpay_payment,
  .afterpay_token,
  .klarna_payment,
  .adyen_payment,
  .klarna_token {
    padding-bottom: 0;
    img {
      height: auto;
      width: 55px;
    }
    p {
      width: 100%;
      margin: 15px auto 25px auto;
      line-height: 18px;
    }
    button {
      margin-top: 0;
      width: 200px;
    }
  }
  &.afterpay_payment,
  &.afterpay_token,
  &.klarna_payment,
  &.klarna_token,
  &.adyen_payment {
    padding-bottom: 40px;
    img {
      width: 100%;
      height: auto;
    }
    p {
      width: 225px;
      margin: 15px auto 25px auto;
      line-height: 18px;
    }
    button {
      margin-top: 0;
      width: 200px;
    }
  }
  &.afterpay_token p,
  &.klarna_token p {
    width: 263px;
  }

  &.eventdate {
    button {
      height: 45px;
      white-space: normal;
      padding: 0px 18px;
    }
  }
}
.bg-btn {
  background: var(--color-121212) !important;
  border: solid 1px var(--color-121212) !important;
}
</style>
