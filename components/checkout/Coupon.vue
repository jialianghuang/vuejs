<template>
  <div id="checkout-coupon">
    <div id="new_pay_coupon" class="new_pay_coupon">
      <div class="pc-content">
        <div class="content">
          <input
            id="coupon_code"
            @focus="clearError"
            :class="{ error: errorMsg }"
            v-model="couponCodeInput"
            :placeholder="placeholderText"
            @change="couponCodeChangeFun"
            type="text"
          />
          <button id="coupon_btn" @click="couponButtonClick" type="button" class="btn btn-white">
            {{ buttonTxt }}
          </button>
        </div>
        <p v-if="errorMsg" class="error-tip">{{ errorMsg }}</p>
        <!--  激活gift card时进行判断登陆态 -->
        <p v-if="showLoginTip" class="error-tip">
          {{ nl('page_common_please') }}
          <a @click="signIn" href="javascript:;" class="btn-login">{{ nl('page_checkout_gift_card_login_tips_1') }}</a>
          {{ nl('page_checkout_gift_card_login_tips_2') }}
        </p>
      </div>
    </div>
    <!-- gift card  购物车页面不显示gift card-->
    <div
      v-if="jsKey != 'cart' && checkoutSummary.userAccountBalance > 0"
      :class="{ disable: orderInfo.hasGiftCard }"
      class="checkbox-gift-card"
    >
      <az-checkbox
        :disable="orderInfo.hasGiftCard"
        :isThemeStyle="true"
        :show-bg="false"
        :value="useAccountBalanceFlag"
        @onChange="handleGiftCardChange"
        >{{ nl('page_checkout_gift_card_balance') }} <span>{{ checkoutSummary.userAccountBalanceDisplay }}</span>
        <span class="after">
          <az-icon icon-class="icon-gwc-_question_"></az-icon>
          <span
            v-html="orderInfo.hasGiftCard ? nl('page_order_gift_card_balance_disabled_tips') : nl('page_order_gift_card_balance_tips')"
            class="order_desc"
          ></span>
        </span>
      </az-checkbox>
    </div>
    <popup-gift-card-verify
      ref="popup_gift_card_verify"
      v-if="popupGiftCardVerifyShow"
      @handleVerifySubmit="handleSubmit"
    ></popup-gift-card-verify>
    <az-toast ref="azToast" :message="successMsg" @toastHide="toastHide"></az-toast>
  </div>
</template>

<script>
import AzCheckbox from '@/components/az-ui/AzCheckbox'
import PopupGiftCardVerify from '@/components/giftCard/PopupGiftCardVerify'
import AzToast from '@/components/az-ui/AzToast'

import { mapState } from 'vuex'
export default {
  name: 'Coupon',
  components: {
    AzCheckbox,
    PopupGiftCardVerify,
    AzToast
  },
  props: {},
  data() {
    return {
      // isCancle: false,
      couponCodeInput: '',
      errorMsg: '',
      showLoginTip: false,
      successMsg: ''
    }
  },
  computed: {
    ...mapState('checkout', ['couponInfo', 'checkoutSummary', 'checkoutError', 'orderInfo', 'useAccountBalanceFlag']),
    ...mapState({
      popupGiftCardVerifyShow: (state) => state.giftCard.popupGiftCardVerifyShow
    }),
    buttonTxt() {
      return this.nl('page_checkout_apply').toUpperCase()
    },
    // 当前应该展示的国家数据，订单国家信息优先
    currentCountry() {
      const res = this.$route.query.order_country_code
      return res || this.country
    },
    placeholderText() {
      return this.orderInfo && this.orderInfo.hasGiftCard
        ? this.nl('page_checkout_coupon_gift_input_place2')
        : this.currentCountry == 'US' && this.jsKey != 'cart'
        ? this.nl('page_checkout_coupon_gift_input_place')
        : this.nl('page_checkout_promo_code')
    }
  },
  watch: {
    checkoutError: {
      handler(newVal) {
        if (newVal.isCouponError) {
          // coupon 验证
          this.errorMsg = newVal.isCouponError
        } else {
          this.errorMsg = ''
        }
      },
      immediate: true
    },
    couponInfo: {
      handler(newVal) {
        if (newVal) {
          if (this.errorMsg == '') {
            // 如果没有有效的返回coupon，并且也没有错误信息，清空输入内容
            this.couponCodeInput = ''
          }
        }
      },
      immediate: true
    }
  },
  created() {},
  methods: {
    toastHide() {
      this.successMsg = ''
    },
    // gift card 是否使用
    handleGiftCardChange() {
      this.$store.commit('checkout/setUseAccountBalance', !this.useAccountBalanceFlag)
      this.$nextTick(() => {
        this.$emit('setCheckoutAmount', { couponCode: this.couponInfo.code })
      })
    },
    clearError() {
      this.errorMsg = ''
      this.$store.commit('checkout/setCheckoutError', { isCouponError: false })
    },
    // 使用coupon or gift card
    couponButtonClick() {
      this.clearError()
      if (!this.couponCodeInput) {
        this.$nextTick(() => {
          this.errorMsg = this.nl('page_checkout_coupon_code_information_is_required')
        })
        this.setDataLayer({
          action: 'click',
          category: 'NewStructureCheckout',
          label: `NewStructureCheckout_Coupon_Error1_View`
        })
        return false
      }

      // 判断是否是gift card 如果是，则激活后，选择使用，再调用validate
      let isGiftCardCode = false
      const pattern21 = /\d{21}/
      const pattern25 = /\d{4}-\d{4}-\d{5}-\d{4}-\d{4}/
      if (
        this.currentCountry == 'US' &&
        ((this.couponCodeInput.length == 21 && pattern21.test(this.couponCodeInput)) ||
          (this.couponCodeInput.length == 25 && pattern25.test(this.couponCodeInput)))
      ) {
        isGiftCardCode = true
      }

      if (isGiftCardCode) {
        if (!this.isLogin && !this.orderInfo.orderSn && this.userInfoUpdated && !this.$route.query.origin_order_sn) {
          this.showLoginTip = true
          return
        }
        this.handleSubmit()
      } else if (this.jsKey == 'cart') {
        // isFromApply 表示是点击 apply按钮手动输入的coupon
        this.$emit('setCheckoutAmount', { params: { couponCode: this.couponCodeInput, isFromApply: true } })
      } else {
        this.$emit('setCheckoutAmount', { couponCode: this.couponCodeInput, isFromApply: true })
      }
    },
    // 激活礼品卡
    handleSubmit(giftCardverifyCode) {
      const params = { givex_number: this.couponCodeInput }
      if (giftCardverifyCode) params.verification_code = giftCardverifyCode
      this.$axios
        .$post('/1.0/user/gift-cart-recharge', params)
        .then((res) => {
          if (this.$refs.popup_gift_card_verify) this.$refs.popup_gift_card_verify.submitFlag = false
          if (res.code === 0) {
            if (res.data) {
              this.successMsg = this.currencySymbol + res.data + ' ' + this.nl('page_gift_card_success_tips')
              this.$refs.azToast.show()
            }
            this.$store.commit('giftCard/setPopupGiftCardVerifyShow', false)
            this.$store.commit('checkout/setUseAccountBalance', true)
            this.$nextTick(() => {
              this.$emit('setCheckoutAmount', { couponCode: this.couponInfo.code })
            })
          } else if (res.code == 800503) {
            // 超过10次需要显示验证弹框
            this.$store.commit('giftCard/setPopupGiftCardVerifyShow', true)
          } else if (res.code == 800504) {
            // 判断报错是否验证码报错
            alert(res.msg)
          } else {
            this.errorMsg = res.msg
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    signIn() {
      this.$parent.$parent.newGuestLoginLayer = true
    },
    couponCodeChangeFun(e) {
      this.$store.commit('checkout/setSelectCouponCode', true)
    }
  }
}
</script>

<style lang="less" scoped>
#checkout-coupon {
  margin-top: 20px;
  #new_pay_coupon {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .pc-content {
      width: 100%;
    }
    #coupon_btn {
      height: 40px;
      min-width: 80px;
      border: 1px solid #ccc;
      border-left: none;
      background: #fff;
      font-size: 13px;
      &:hover {
        background: #f6f6f6;
      }
    }
    .content {
      display: flex;
      // width: 310px;
    }
    .add_code {
      display: flex;
      cursor: pointer;
      .icon {
        width: 15px;
        height: 15px;
        svg {
          fill: #666;
        }
      }
      .txt {
        font-size: 13px;
        font-family: @font-family-500;
        text-decoration: underline;
        margin-left: 10px;
      }
    }
    input {
      // width: 219px;
      flex: 1;
      border: solid 1px #ccc;
      padding-left: 10px;
      &.error {
        background: #eee;
        border: solid 1px #f00;
      }
      &:focus {
        background: #fff;
        border-color: var(--color-121212);
      }
    }
    input[readonly] {
      background: var(--color-f9f9f9);
      border-color: #ccc !important;
    }

    .error-tip {
      color: #f00;
      position: relative;
      .btn-login {
        text-decoration: underline;
        color: unset;
      }
    }
    .btn-white {
      background: none;
      .border-radius(0);
      &[disabled],
      &.disabled {
        opacity: 0.5;
        cursor: default;
        background: #fff !important;
      }
    }
  }

  .checkbox-gift-card {
    cursor: pointer;
    &.disable {
      color: #ccc;
    }
    .after {
      margin-left: 5px;
      position: relative;
      .order_desc {
        display: none;
        position: absolute;
        left: 4px;
        top: 24px;
        width: 245px;
        transform: translateX(-50%);
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 3px;
        padding: 10px;
        box-sizing: border-box;
        z-index: 1;
        color: var(--color-121212);
        /deep/ a {
          color: @theme-color;
        }
        &:before {
          content: '';
          width: 0;
          height: 0;
          border-right: 6px solid transparent;
          border-bottom: 6px solid var(--color-cccccc);
          border-left: 6px solid transparent;
          position: absolute;
          top: 0%;
          left: 48.4%;
          margin-top: -7px;
        }
        &:after {
          content: '';
          width: 0;
          height: 0;
          border: 6px solid transparent;
          border-bottom-color: #ffffff;
          position: absolute;
          top: 0%;
          left: 48.4%;
          margin-top: -11px;
        }
      }
    }
    .after:hover .order_desc {
      display: inline-block;
    }
  }
}
</style>
