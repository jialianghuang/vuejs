<template>
  <div :class="{ 'unpaid-orders': !allPaid }" class="order-suc-address">
    <div class="content">
      <template v-if="!orderInfo.onlyGiftCardOrder">
        <div class="content-l">
          <div class="sa content-item">
            <h3 class="item-title">{{ nl('page_order_shipping_address') }}:</h3>
            <ul class="item-group">
              <address-info
                :addressInfo="shippingAddress && Object.keys(shippingAddress).length ? shippingAddress[0] : orderAddressInfo || {}"
              ></address-info>
            </ul>
          </div>
        </div>
        <div class="content-m">
          <div class="sm content-item">
            <h3 class="item-title">{{ nl('page_order_shipping_method') }}:</h3>
            <ul class="item-group">
              <li :sm-id="methodInfo.id" class="item">{{ methodInfo.shippingTitle }}</li>
            </ul>
          </div>
          <div v-if="allPaid" class="pm mt-19 content-item">
            <h3 class="item-title">{{ nl('page_order_payment_method') }}:</h3>
            <ul class="item-group">
              <li class="item">{{ paymentInfo.name }}</li>
            </ul>
          </div>
        </div>
        <div v-if="!allPaid" class="pm content-item">
          <h3 class="item-title">{{ nl('page_order_payment_method') }}:</h3>
          <ul class="item-group">
            <li class="item">{{ paymentInfo.name }}</li>
          </ul>
        </div>
      </template>

      <div class="content-r">
        <div
          v-if="
            billingAddress &&
              Object.keys(billingAddress).length &&
              orderInfo.totalAmount * 1 > 0 &&
              [164, 177, 186].includes(paymentInfo.paymentId)
          "
          class="ba content-item"
        >
          <h3 class="item-title">{{ nl('page_order_bill_address') }}:</h3>
          <ul class="item-group">
            <address-info :addressInfo="billingAddress && Object.keys(billingAddress).length ? billingAddress[0] : {}"></address-info>
          </ul>
        </div>
      </div>
      <div v-if="orderInfo.onlyGiftCardOrder" class="content-item content-item-gift-card">
        <h3 class="item-title">{{ nl('page_order_payment_method') }}:</h3>
        <ul class="item-group">
          <li class="item">{{ paymentInfo.name }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import AddressInfo from '@/components/checkout/AddressInfo'
import { mapState } from 'vuex'

export default {
  name: 'OrderSucAddress',
  components: {
    AddressInfo
  },
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('checkout', [
      'shippingAddress',
      'billingAddress',
      'methodInfo',
      'paymentInfo',
      'isGroup',
      'allPaid',
      'orderInfo',
      'orderInfoList'
    ]),
    orderAddressInfo() {
      const orderInfo = this.orderInfoList && this.orderInfoList[0]
      return orderInfo
        ? {
            fullName: orderInfo.consignee,
            address: orderInfo.address,
            signBuilding: orderInfo.signBuilding,
            districtText: orderInfo.districtText,
            cityText: orderInfo.cityText,
            provinceName: orderInfo.provinceName,
            provinceText: orderInfo.provinceText,
            countryName: orderInfo.countryName,
            zipcode: orderInfo.zipcode,
            tel: orderInfo.tel
          }
        : null
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.order-suc-address {
  font-size: 13px;
  float: left;
  background: #f6f6f6;
  padding: 7px 10px 15px 20px;
  line-height: 18px;
  .content {
    display: flex;
    justify-content: flex-start;
    .content-item {
      width: 210px;
      padding-right: 10px;
      padding-top: 9px;
      &.content-item-gift-card {
        margin-left: 20px;
      }
    }
    .item-title {
      display: inline-block;
      padding-right: 3px;
    }
    .order-link {
      color: #1084bf;
      text-decoration: underline;
    }
    .item-group {
      padding-top: 8px;
    }
    .mt-25 {
      margin-top: 25px;
    }
    .mt-19 {
      margin-top: 19px;
    }
  }
  &.unpaid-orders {
    width: 100%;
    background: #fff;
  }
}
</style>
