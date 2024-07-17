<template>
  <div id="rights_billing_address" class="shipping-address-block">
    <block-title
      :title="nl('page_order_bill_address')"
      :btnText="nl('page_common_change')"
      :btnShow="!!billingAddressId"
      @change="handleChange()"
    ></block-title>
    <div class="address-content pay-shipping-address">
      <template v-if="billingAddressId">
        <!-- 展示地址 -->
        <div class="address-defalut-content">
          <address-Info :addressInfo="billingAddress[0]"></address-Info>
        </div>
      </template>
      <!-- 编辑地址 -->
      <address-form
        v-else
        :addressInfo="billingAddress[0]"
        :verifyAddres="false"
        :addressType="addressType"
        @handleSaveAddress="handleSaveAddress"
        source="billing"
      ></address-form>
      <div :class="{ 'animated animate-shake': checkoutError.isBillingAddressError }" class="error-tip">
        {{ nl('page_js_save_address') }}
      </div>
    </div>
  </div>
</template>

<script>
import BlockTitle from '@/components/checkout/BlockTitle'
import AddressForm from '@/components/checkout/AddressForm'
import AddressInfo from '@/components/checkout/AddressInfo'
import { mapState } from 'vuex'
export default {
  name: 'RightsBillingAddress',
  components: {
    BlockTitle,
    AddressForm,
    AddressInfo
  },
  props: {},
  data() {
    return {
      addressType: 2 // 地址类型 1 购物地址
    }
  },
  computed: {
    ...mapState('checkout', ['checkoutError', 'billingAddress', 'billingAddressId'])
  },
  mounted() {
    document.querySelector('#rights_billing_address').addEventListener('click', () => {})
  },
  methods: {
    // 修改地址
    handleChange() {
      this.$store.commit('checkout/setBillingAddressId', '')
      this.$store.commit('checkout/setCheckoutError', { isBillingAddressError: false })
    },
    handleSaveAddress() {
      this.$store.commit('checkout/setBillingAddressId', this.billingAddress[0].addressId)
    }
  }
}
</script>

<style lang="less" scoped>
.shipping-address-block {
  text-align: left;
  .error-tip {
    height: 20px;
    color: #f00;
    // margin-left: 10px;
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
  .address_card_btn {
    text-transform: capitalize;
    color: #666;
    font-size: 13px;
    font-family: @font-family-500;
    line-height: 18px;
    display: inline-block;
    margin-top: 13px;
    text-decoration: underline;
    cursor: pointer;
    &.remove_address_btn {
      margin-left: 20px;
    }
    &:hover {
      color: @theme;
    }
  }

  .address-content {
    margin: 20px 0 60px;
  }
  .address-list-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .shipping-address-card {
      width: 367px;
      min-height: 166px;
      position: relative;
      padding: 15px;
      box-sizing: border-box;
      border: 1px solid #eee;
      // margin: 8px 10px;
      margin-bottom: 20px;
      background-color: #fff;
      cursor: pointer;
      display: flex;
      .shipping-add-address-card {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .plus {
          font-size: 15px;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          margin-right: 9px;
          fill: #666;
        }
        span {
          text-transform: capitalize;
        }
      }
      &.selected {
        border-color: #ccc;
        background-color: var(--color-f9f9f9);
      }
      &:hover {
        border-color: #ccc;
        background-color: var(--color-f9f9f9);
      }

      .shipping-address-card-content {
        flex: 1;
        margin-top: -5px;
        .info_part {
          // font-size: 14px;
          color: var(--color-121212);
          font-family: @font-family-500;
          word-break: break-word;
          .info_line:not(:first-of-type) {
            margin-top: 5px;
          }
        }
      }
    }
  }

  .btn-save {
    min-width: 80px;
    box-sizing: border-box;
    border-radius: 0%;
    font-size: 13px;
    font-family: @font-family-600;
  }
  .popup-address-content {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 40px;
    flex-wrap: wrap;
  }

  .popup-suggest-address-content {
    display: flex;
    justify-content: center;
    // padding: 40px;
    flex-wrap: wrap;
    .layer-title {
      font-family: @font-family-600;
      font-size: 16px;
      color: var(--color-121212);
      padding-bottom: 5px;
      margin-bottom: 15px;
      border-bottom: 1px solid #ccc;
      width: 100%;
    }
    .suggest-address-tips {
      width: 100%;
      /deep/ .diff {
        border: 1px solid orangered;
        padding: 0 2px;
      }
    }
    .suggest-address-list-content-wrap {
      border: 1px solid #ccc;
      width: 100%;
      text-align: center;
      margin-top: 15px;
      .suggest-address-item-title {
        background: linear-gradient(#fff, var(--color-f9f9f9));
        border-bottom-width: 0;
        font-weight: bold;
        padding: 8px 6px;
        text-align: left;
      }
      .suggest-address-list-content {
        display: flex;
        text-align: left;
        .suggest-shipping-address-card {
          width: 50%;
          border-right: 1px solid #ccc;
          display: flex;
          padding: 15px 6px;
          cursor: pointer;

          &:hover {
            background: #f6f6f6;
          }
          &:nth-child(2) {
            border: 0;
          }
          .shipping-address-card-content {
            margin-top: -4px;
            .shipping-address-card-content-title {
              font-weight: bold;
            }
          }
          &.selected {
            background-color: #f6f6f6;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
          }
        }
      }
    }
    .btn-suggest-save {
      margin-top: 20px;
    }
  }
}
</style>
