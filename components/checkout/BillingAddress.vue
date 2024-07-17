<template>
  <div class="billing-address">
    <div v-if="orderInfo.onlyGiftCard || isHaveAddress" class="checkout-edit-block">
      <h2>{{ nl('page_order_bill_address') }}:</h2>
      <a v-if="orderInfo.editable && isHaveAddress" @click="showAddressPopup" href="javascript:void(0)">{{ nl('page_common_edit') }}</a>
    </div>

    <!-- 有地址 -->
    <template v-if="isHaveAddress">
      <!-- 默认地址 -->
      <address-info :addressInfo="billingAddress"></address-info>

      <!-- 编辑地址 -->
      <popup-address
        :addressInfo="billingAddress"
        v-if="isAddressPopupShow"
        :verifyAddress="false"
        @closeAddressPopup="closeAddressPopup"
        @handleSaveAddress="handleSaveAddress"
        :addressType="2 * 1"
        :popupTitle="nl('page_order_bill_address')"
        source="billing"
      ></popup-address>
    </template>
    <!-- 礼品卡因为没有shipping address 所以billing address 需要新增地址(没有地址) -->
    <address-form v-else-if="orderInfo.onlyGiftCard" @handleSaveAddress="handleSaveAddress" :addressType="1 * 2"></address-form>
    <div :class="{ 'animated animate-shake': checkoutError.isBillingAddressError }" v-if="!isHaveAddress" class="error-tip">
      {{ nl('page_js_save_address') }}
    </div>
  </div>
</template>

<script>
import AddressInfo from '@/components/checkout/AddressInfo'
import PopupAddress from '@/components/checkout/PopupAddress'
import AddressForm from '@/components/checkout/AddressForm'

import { mapState } from 'vuex'

export default {
  name: 'BillingAddress',
  components: { AddressInfo, PopupAddress, AddressForm },
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
      isAddressPopupShow: false // 新增编辑地址弹框是否显示
    }
  },
  computed: {
    ...mapState('checkout', ['checkoutError', 'orderInfo']),
    isHaveAddress({ billingAddress }) {
      return billingAddress && Object.keys(billingAddress).length
    }
  },
  methods: {
    showAddressPopup() {
      this.buryPoint(this, 'event', {
        ec: 'billingaddress',
        el: 'edit',
        ea: 'click'
      })
      this.isAddressPopupShow = true
    },
    // 关闭弹窗
    closeAddressPopup() {
      this.isAddressPopupShow = false
    },
    handleSaveAddress() {
      this.closeAddressPopup()
    }
  }
}
</script>

<style lang="less" scoped>
.billing-address {
  margin-top: 35px;
  .error-tip {
    height: 20px;
    color: #f00;
    margin-top: 10px;
    display: none;
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
  .checkout-edit-block {
    margin-bottom: 7px;
    overflow: hidden;
    h2 {
      float: left;
      margin-right: 3px;
    }
    a {
      text-decoration: underline;
      color: @theme;
      text-transform: capitalize;
    }
  }
}
.checkout-box {
  .checkout-edit-block a {
    color: @black-btn-color!important;
  }
}
</style>
