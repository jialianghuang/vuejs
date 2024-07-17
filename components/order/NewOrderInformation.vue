<template>
  <div class="order-b">
    <div class="order_info_title">
      {{ nl('page_checkout_order_information') }}
    </div>
    <div class="order-detail-info">
      <div v-if="!orderInfo.isSamplePurchaseOrder && !orderInfo.onlyGiftCardOrder" class="item-order-detail-info item-shipping-address">
        <h3 class="item-title">{{ nl('page_order_shipping_address') }}:</h3>
        <address-info
          :addressInfo="{
            fullName: orderInfo.consignee,
            address: orderInfo.address,
            signBuilding: orderInfo.signBuilding,
            countryName: orderInfo.countryName,
            provinceName: orderInfo.provinceName,
            provinceText: orderInfo.provinceText,
            cityText: orderInfo.cityText,
            districtText: orderInfo.districtText,
            zipcode: orderInfo.zipcode,
            tel: orderInfo.tel,
            doorplate: orderInfo.doorplate
          }"
        ></address-info>
        <a
          v-if="orderInfo.addressEditable && !(orderInfo.paymentId == 256 && orderInfo.payStatus == 1)"
          :href="orderInfo.editAddressUrl + '&order_country_code=' + orderInfo.countryCode"
          class="change-shipping-address"
        >
          {{ nl('page_email_change_shipping_address') }}
        </a>
      </div>

      <!-- gift card 的订单详情页如果是卡支付要显示 billingAddress,注意，订单详情页返回的 billingAddress 是一个对象 -->
      <!-- orderInfo 里面的 onlyGiftCardOrder 表示这个订单组是否是只含有 gift card-->
      <div v-if="showBillingAddress" class="item-order-detail-info item-billing-address">
        <h3 class="item-title">{{ nl('page_order_bill_address') }}:</h3>
        <address-info :addressInfo="billingAddress"></address-info>
      </div>

      <div class="item-order-detail-info">
        <div v-if="!orderInfo.isSamplePurchaseOrder && !orderInfo.onlyGiftCardOrder" class="item-shipping-method">
          <h3 class="item-title">{{ nl('page_order_shipping_method') }}:</h3>
          <div>{{ orderInfo.shippingMethod }}</div>
        </div>

        <!-- 如果是全额用giftcard 支付paymentId:257，要隐藏这个模块  -->
        <div
          v-if="orderInfo.paymentId != 257"
          :class="{ 'mt-30': !orderInfo.isSamplePurchaseOrder && !orderInfo.onlyGiftCardOrder }"
          class="item-payment-method"
        >
          <h3 class="item-title">{{ nl('page_order_payment_method') }}:</h3>
          <div>{{ orderInfo.paymentName }}</div>
        </div>
      </div>

      <div class="item-order-detail-info">
        <div class="item-order-number">
          <h3 class="item-title">{{ nl('page_common_order_number') }}:</h3>
          <div
            v-clipboard:copy="orderInfo.orderSn"
            v-clipboard:success="onCopySuccess"
            v-clipboard:error="onCopyError"
            class="order-sn-box"
          >
            {{ orderInfo.orderSn }}
            <span>
              <az-icon icon-class="iconicon-copy" class="copy-icon"></az-icon>
            </span>
          </div>
        </div>
        <div class="item-order-time mt-30">
          <h3 class="item-title">{{ nl('page_order_order_time') }}:</h3>
          <div>{{ orderInfo.orderDate }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddressInfo from '@/components/checkout/AddressInfo'

export default {
  name: 'NewOrderInformation',
  components: {
    AddressInfo
  },
  props: {
    orderInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    isPaidAndUnpaid: {
      // 是否是支付和未支付共存的情况
      type: Boolean,
      default: false
    },
    billingAddress: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    showBillingAddress() {
      return this.orderInfo.onlyGiftCardOrder && this.billingAddress && Object.keys(this.billingAddress).length
    }
  },
  methods: {
    onCopySuccess() {
      this.$emit('onCopySuccess')
    },
    onCopyError() {
      this.$emit('onCopyError')
    }
  }
}
</script>

<style lang="less" scoped>
.mt-30 {
  margin-top: 30px;
}
.order-detail-info {
  display: flex;
  padding: 15px;
  .item-order-detail-info {
    flex: 1;
    /deep/ .info_line {
      margin-top: 0;
    }
    .item-title {
      font-family: @font-family-600;
      padding-bottom: 10px;
      text-transform: uppercase;
    }
    & > div {
      line-height: 18px;
      font-size: 13px;
    }
    .order-sn-box {
      cursor: pointer;
    }
    .copy-icon {
      cursor: pointer;
      font-size: 14px;
    }
  }
  .change-shipping-address {
    color: @theme-color;
    text-decoration: underline;
  }
}
</style>
