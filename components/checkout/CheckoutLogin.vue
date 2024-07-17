<template>
  <div class="checkout-guest-login">
    <div id="checkout_login" class="checkout-login">
      <div class="guest_block">
        <div class="title">{{ nl('page_login_checkout_as_guest') }}</div>
        <div class="slogan">{{ nl('page_login_email_receipt') }}</div>
        <div class="email_title">{{ nl('page_common_email_address') }}</div>
        <input v-model="guestEmail" @focus="inputFocus" @blur="inputBlur" class="guest_email" type="email" />
        <AzEmailDomain
          :show="emailDomainShow"
          :origin-email="guestEmail"
          @domain-handler="(value) => ((guestEmail = value), inputBlur())"
        />
        <div v-show="checkoutLoginEmailError" class="error-tips">{{ checkoutLoginEmailError }}</div>
      </div>
      <div class="normal_block">
        <div class="title">{{ nl('page_login_sign_in_up') }}</div>
        <div class="slogan">{{ nl('page_login_sign_in_faster') }}</div>
        <div @click="signIn" class="sign_btn">{{ nl('page_login_secure_sign_in') }}</div>
        <div @click="signUp" class="sign_up">{{ nl('page_footer_sign_up') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import AzEmailDomain from '@/components/az-ui-new/AzEmailDomain'
import checkEmailDomain from '@/assets/js/checkEmailDomain'
import { mapState } from 'vuex'

export default {
  name: 'CheckoutLogin',
  components: { AzEmailDomain },
  mixins: [checkEmailDomain],
  props: {},
  computed: {
    ...mapState('checkout', ['eventDate', 'checkoutError', 'orderInfo', 'checkoutLoginEmail', 'checkoutLoginEmailError']),
    guestEmail: {
      get() {
        return this.checkoutLoginEmail
      },
      set(val) {
        this.$store.commit('checkout/setCheckoutLoginEmail', val)
      }
    }
  },
  watch: {},
  mounted() {},
  methods: {
    inputFocus() {
      this.initEmailCheckDomain()
      this.$store.commit('checkout/setCheckoutLoginEmailError', '')
    },
    signIn() {
      this.$parent.newGuestLoginLayer = true
    },
    signUp() {
      this.$parent.createAccountLayerShow = true
    },
    // 失去焦点后，将内容传给父组件，现功能用于游客输完邮箱后，获取可用coupon并自动填充功能
    inputBlur() {
      this.onBlurEmail()
      this.$emit('guestEmailBlur', { guestEmail: this.guestEmail })
    }
  }
}
</script>

<style lang="less" scoped>
.checkout-login {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 750px;
  padding: 20px;
  border: 1px solid #eee;
  box-sizing: border-box;
  margin-bottom: 60px;
  .guest_block {
    position: relative;
    text-align: left;
    padding-right: 35px;
    text-align: left;
    border-right: 1px solid #eee;
    /deep/ .az-email-domain-box {
      width: 318px;
      border-top: none;
    }
  }
  .normal_block {
    margin-left: 35px;
    text-align: left;
  }
  .title {
    font-family: @font-family-600;
    font-size: 16px;
    color: var(--color-121212);
    text-transform: uppercase;
  }
  .slogan {
    font-family: @font-family-500;
    font-size: 13px;
    color: var(--color-121212);
    // text-transform: capitalize;
  }
  .email_title {
    margin-top: 15px;
    font-family: @font-family-500;
    font-size: 13px;
    color: var(--color-121212);
    text-transform: capitalize;
  }
  .guest_email {
    width: 318px;
    height: 40px;
    border: 1px solid #eee;
    box-sizing: border-box;
    margin-top: 5px;
  }
  .sign_btn {
    border: 1px solid var(--color-121212);
    height: 40px;
    line-height: 40px;
    width: 318px;
    font-size: 14px;
    font-family: @font-family-600;
    color: var(--color-121212);
    text-align: center;
    margin-top: 15px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .sign_up {
    text-transform: capitalize;
    text-decoration: underline;
    cursor: pointer;
    font-size: 13px;
    color: var(--color-121212);
    font-family: @font-family-500;
    text-align: center;
    margin-top: 15px;
  }
}
.error-tips {
  color: var(--color-ff0000);
  font-size: 13px;
  line-height: 18px;
}
</style>
