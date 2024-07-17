<template>
  <!-- swatch 弹框 -->
  <div class="swatch-box">
    <az-icon @click="closePopCouponSwatch" icon-class="icon-icon_style_gallery_off" class="icon-close"></az-icon>
    <div class="swatch-checkout-progress">
      <div class="swatch-checkout-progress-title">{{ nl('page_coupon_swatches_title') }}</div>
      <az-checkout-progress :list="list" :progressId="progressId"></az-checkout-progress>
    </div>
    <!-- choose color -->
    <swatch-dialog v-if="progressId == 1 && componentReady" @handleContinue="handleContinue"></swatch-dialog>
    <!-- Fill in your shipping address -->
    <div v-if="progressId == 2">
      <shipping-address @setCheckoutAmount="createOrder"></shipping-address>
    </div>
    <!-- Order completed -->
    <div v-if="progressId == 3" class="order-success">
      <thank-you></thank-you>
      <div class="order-success-goods">
        <div v-for="(item, index) in orderGoodsList" :key="index">
          <img :src="addWebpSuffix(item.imgUrl)" alt="order goods" />
          <p>{{ item.shownColor }}</p>
        </div>
      </div>
      <az-button :needIcon="false" @click="closePopCouponSwatch" class="btn btn-default btn-continue">
        Continue Shopping
      </az-button>
    </div>
    <az-loading v-if="loadingFlag || !componentReady"></az-loading>
  </div>
</template>
<script>
/**
 * 大转盘中奖免费3张色卡，可在弹框直接购买
 * 异步组件
 */
import AzLoading from '@/components/az-ui/AzLoading'
import AzButton from '@/components/az-ui/Button/AzButton'
import AzCheckoutProgress from '@/components/az-ui/AzCheckoutProgress'
import SwatchDialog from '@/components/product/OrderSwatch/SwatchDialog'
import ShippingAddress from '@/components/checkout/ShippingAddress'
import ThankYou from '@/components/checkout/ThankYou'
import { mapState } from 'vuex'
import colorHex from '@/assets/js/colorHex'
import { loadLanguagePromise } from '@/plugins/commonAsyncData'

const languageKeys = [
  /** 异步组件多语言key提前获取 */
  'page_coupon_swatches_title',
  ...new Array(3).fill().map((v, i) => 'page_coupon_swatches_step_' + (i + 1)),
  /** 异步组件多语言key提前获取 end */
  ...SwatchDialog.languageKeys,
  ...ShippingAddress.languageKeys,
  ...ThankYou.languageKeys
]

export default {
  name: 'CouponOrderSwatch',
  components: { AzLoading, AzButton, AzCheckoutProgress, SwatchDialog, ShippingAddress, ThankYou },
  mixins: [colorHex],
  props: {
    rewardCode: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      componentReady: false, // 异步多语言是否加载完成
      progressId: 1,
      loadingFlag: false,
      swatchGoodsList: []
    }
  },
  computed: {
    ...mapState({
      orderGoodsList: (state) => state.checkout.orderGoodsList,
      addressId: (state) => state.checkout.addressId,
      shippingAddress: (state) => state.checkout.shippingAddress
    }),
    list() {
      return [
        { id: 1, name: this.nl('page_coupon_swatches_step_1') },
        { id: 2, name: this.nl('page_coupon_swatches_step_2') },
        { id: 3, name: this.nl('page_coupon_swatches_step_3') }
      ]
    }
  },
  created() {
    this.loadLanguagePromise()
    this.loadingFlag = true
    this.getColorHexAjax().then(() => {
      this.loadingFlag = false
    })
  },
  methods: {
    async loadLanguagePromise() {
      try {
        this.componentReady = false
        await loadLanguagePromise({ store: this.$store, $axios: this.$axios, $loading: this.$loading }, languageKeys)
        this.componentReady = true
      } catch (e) {
        console.log(e)
      }
    },
    closePopCouponSwatch() {
      this.$store.commit('setIsCouponSwatch', false)
      this.$emit('closeCouponWheel')
    },
    handleContinue(swatchGoodsList) {
      this.progressId = 2
      this.swatchGoodsList = swatchGoodsList
    },
    /**
     * 创建订单
     */
    createOrder() {
      const url = '/1.0/order'
      const shippingItem = this.shippingAddress[0]
      const tempShippingAddress = {
        check_validation: 0,
        address_type: 1,
        first_name: shippingItem.firstName,
        last_name: shippingItem.lastName,
        country: shippingItem.country,
        province: shippingItem.province,
        city_text: shippingItem.cityText,
        address: shippingItem.address,
        sign_building: shippingItem.signBuilding,
        zipcode: shippingItem.zipcode,
        tel: shippingItem.tel,
        province_name: shippingItem.provinceName,
        country_name: shippingItem.countryName,
        country_code: shippingItem.countryCode,
        full_name: shippingItem.fullName
      }
      const params = {
        is_free_swatch: 1,
        shipping_method_id: '2', // 默认值
        coupon_code: this.rewardCode,
        swatch_goods_list: this.swatchGoodsList,
        address: { shippingAddress: tempShippingAddress },
        guest_email: this.email,
        payment_id: 97
      }

      this.$axios
        .$post(url, params)
        .then((res) => {
          this.loadingFlag = false
          if (res.code == 0) {
            this.progressId = 3
            this.orderDetail(res.data.orderSn)
          } else {
            alert(res.msg)
          }
        })
        .catch((error) => {
          this.loadingFlag = false
          console.error(error)
        })
    },
    orderDetail(orderSn) {
      // 游客登陆的token需要清空
      const swatchLoginToken = this.$cookie.getCookie('swatch_login_token')
      this.$cookie.setCookie('login_token', swatchLoginToken, 7, '.' + this.APP_DOMAIN_LOWER)
      this.loadingFlag = true
      this.$axios
        .$get('/1.0/order/success', { params: { order_country_code: this.country, action: 'orderconfirm', order_sn: orderSn } })
        .then((res) => {
          this.$cookie.removeCookie('swatch_login_token')
          this.$cookie.removeCookie('login_token')
          this.loadingFlag = false
          if (res.code == 0) {
            this.$store.commit('checkout/setCheckoutBaseInfo', { ...res.data, baseInfoKey: 'checkoutSuccess' })
          }
        })
        .catch((error) => {
          this.$cookie.removeCookie('swatch_login_token')
          this.$cookie.removeCookie('login_token')
          this.loadingFlag = false
          console.error(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.icon-close {
  position: absolute;
  right: 15px;
  top: 15px;
  fill: currentColor;
  color: var(--color-121212);
  font-size: 15px;
  cursor: pointer;
}
.btn-order {
  position: absolute;
  bottom: 25px;
  left: 25px;
  width: 275px;
  height: 40px;
}
.swatch-box {
  width: 855px;
  height: 475px;
  overflow: hidden;
  position: relative;
  transform-origin: 855px 350px;
  box-shadow: -10px 7px 16px -1px rgba(0, 0, 0, 0.15);
  border-radius: 5px 0px 0px 5px;
  background: #fff;
  .swatch-checkout-progress {
    box-shadow: 0px 1px 4px var(--color-eeeeee);
    display: flex;
    .swatch-checkout-progress-title {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 260px;
      height: 50px;
      // line-height: 50px;
      text-align: center;
      background: linear-gradient(269.03deg, #ecf8fb 0%, #ebf3ff 19.14%, #f6f2fe 39.89%, #fff3f5 58.99%, #fffae9 79.39%, #eefcea 100%);
    }
  }
  /deep/.swatch-dialog {
    height: 426px;
    .content {
      max-width: initial;
      padding: 0;
      width: auto;
      .big-pic {
        width: 36%;
        margin: 0;
        img {
          width: 100%;
        }
      }
      .product-info {
        flex: 1;
        width: auto;
        height: 376px;
        // overflow: auto;
        background: var(--color-f9f9f9);
        padding: 25px;
        .goods-name {
          font-size: 16px;
          margin: 0;
        }
        .style-block {
          padding: 0;
        }
      }
    }
  }
  /deep/ .shipping-address-block {
    padding: 25px;
    height: 376px;
    overflow: auto;

    .address-form .pay-address-form li {
      margin-bottom: 10px;
    }
  }
  .order-success {
    margin: 15px 25px;
    /deep/.thank-you {
      .psuc-title {
        font-size: 18px;
        font-family: @font-family-500;
      }
    }
    .order-success-goods {
      display: flex;
      margin-top: 10px;
      > div {
        text-align: center;
        &:not(:last-child) {
          margin-right: 20px;
        }
        img {
          width: 100px;
          height: 130px;
        }
      }
    }
    .btn-continue {
      margin-top: 20px;
    }
  }
}
/deep/ .btn-default {
  width: 275px;
  font-family: @font-family-500, sans-serif;
  font-weight: 600;
}
</style>
