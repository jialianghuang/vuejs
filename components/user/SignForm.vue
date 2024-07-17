<template>
  <form onsubmit="return false" autocomplete="off">
    <h3 v-if="formTitle">{{ formTitle }}</h3>
    <div v-if="resultMsg" class="control-group error">
      <div v-if="resultCode === 100209" v-html="resultMsg" class="help-block"></div>
      <span v-else class="help-block">{{ resultMsg }} </span>
    </div>
    <email-input ref="EMAIL" @submit="loginSubmit" @focus="resultMsg = ''"></email-input>
    <password-input ref="PASSWORD" @toForget="toForget" @submit="loginSubmit" @focus="resultMsg = ''"></password-input>
    <az-button :loading="loading" :disabled="loading" :needIcon="false" @click="loginSubmit" class="btn btn-theme btn-user-form">{{
      loading ? `${nl('page_order_progress_processing')}...` : nl('page_login_note')
    }}</az-button>
    <auth-login :position="'bottom'" :source="source"></auth-login>
    <tip-terms-and-policy :txt="nl('page_sign_form_tip_text')"></tip-terms-and-policy>
  </form>
</template>

<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import EmailInput from '@/components/user/EmailInput'
import PasswordInput from '@/components/user/PasswordInput'
import TipTermsAndPolicy from '@/components/user/TipTermsAndPolicy'
import AuthLogin from '@/components/user/AuthLogin'

import { mapState } from 'vuex'
export default {
  name: 'SignForm',
  languageKeys: [
    'page_order_progress_processing',
    'page_login_note',
    'page_sign_form_tip_text',
    ...EmailInput.languageKeys,
    ...PasswordInput.languageKeys,
    ...TipTermsAndPolicy.languageKeys,
    ...AuthLogin.languageKeys
  ],
  components: {
    AzButton,
    EmailInput,
    PasswordInput,
    TipTermsAndPolicy,
    AuthLogin
  },
  props: {
    source: {
      type: String,
      default: ''
    },
    formTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      resultMsg: '',
      resultCode: ''
    }
  },
  computed: {
    ...mapState('userInfo', ['noMoreShowRoom']),
    ...mapState('checkout', ['buyNowUrl', 'shippingAddress'])
  },
  methods: {
    loginSubmit() {
      this.setPoint('signin', 'common', 'click')
      if (this.loading) {
        return false
      }
      if (this.$route.name === 'cart' && this.guestCheckoutAuthorization) {
        this.setDataLayer({
          action: 'click',
          category: 'PC_GuestCheckout',
          label: 'PCA_PopupSignIn_Click'
        })
      }
      if (this.$route.name === 'cart' && !this.guestCheckoutAuthorization) {
        this.setDataLayer({
          action: 'click',
          category: 'PC_GuestCheckout',
          label: 'PCB_PopupSignIn_Click'
        })
      }
      const items = []
      if (!this.$refs.EMAIL.validateEvent()) {
        const temp = {
          ec: 'signin',
          el: 'error',
          ea: 'view',
          msg: JSON.stringify({ error: this.$refs.EMAIL && this.$refs.EMAIL.rulesResult && this.$refs.EMAIL.rulesResult.email })
        }
        items.push(temp)
      }
      if (!this.$refs.PASSWORD.validateEvent()) {
        const temp = {
          ec: 'signin',
          el: 'error',
          ea: 'view',
          msg: JSON.stringify({ error: this.$refs.PASSWORD && this.$refs.PASSWORD.rulesResult && this.$refs.PASSWORD.rulesResult.password })
        }
        items.push(temp)
      }
      this.buryPoint(this, 'items', items)
      if (!this.$refs.EMAIL.validateEvent() | !this.$refs.PASSWORD.validateEvent()) {
        return false
      }
      this.email = this.$refs.EMAIL.email
      this.password = this.$refs.PASSWORD.password
      this.loginAxios()
      // ga4打点
      this.setGA4DataLayer({
        event: 'ga4Event',
        event_name: 'login',
        event_parameters: {
          method: 'Email'
        }
      })
    },
    loginAxios() {
      this.retentionReject()
      this.loading = true
      const formData = new FormData()
      formData.append('email', this.email)
      formData.append('password', this.password)
      // checkout页面先填写了地址后登录操作，需要把地址在登录接口传过去
      if (this.shippingAddress && this.shippingAddress[0] && this.$route.name === 'checkout') {
        formData.append('shipping_address', JSON.stringify(this.shippingAddress[0]))
      }
      this.$axios
        .$post(`/1.0/user/login`, formData)
        .then(async (data) => {
          if (data.code == 0) {
            if (this.environment.includes('dev')) {
              // 本地开发的时候，可以使用 localhost 或者是 映射到 dev.azazie.com
              this.$cookie.setCookie('login_token', data.data.token, 7, window.location.hostname)
              this.$cookie.setCookie('user_id', data.data && (data.data.userId || data.data.user_id))
              this.$cookie.setCookie('webpush_email', this.email, 7)
            }
            // 登录后清空详情页获取交期的地址cookie
            this.$cookie.removeCookie('delivery_province', '.' + this.APP_DOMAIN_LOWER)
            this.$cookie.removeCookie('delivery_province_new', '.' + this.APP_DOMAIN_LOWER)
            this.setDataLayer({
              category: 'webtracking',
              action: 'signin_success',
              label: 'signin'
            })
            this.trackGA4NewEmail(this.email, 'login', null, true)
            this.$cookie.setCookie(
              'user_id',
              (data.data && (data.data.userId || data.data.user_id)) || '-1',
              7,
              '.' + this.APP_DOMAIN_LOWER
            )
            this.$cookie.setCookie('webpush_email', this.email, 7, '.' + this.APP_DOMAIN_LOWER)
            // 若本地存有ambassador_info_id绑定校园大使关系
            const ambassadorInfoId = sessionStorage.getItem('ambassador_info_id') || this.$cookie.getCookie('ambassador_info_id')
            if (ambassadorInfoId) {
              await this.$axios.$post('/1.0/ambassador/relation', {
                ambassador_info_id: ambassadorInfoId
              })
              sessionStorage.removeItem('ambassador_info_id')
              this.$cookie.removeCookie('ambassador_info_id')
            }
            if (this.$route.name === 'cart' && this.guestCheckoutAuthorization) {
              this.setDataLayer({
                action: 'click',
                category: 'PC_GuestCheckout',
                label: 'PCA_PopupSignSuccess_Click'
              })
            }
            if (this.$route.name === 'cart' && !this.guestCheckoutAuthorization) {
              this.setDataLayer({
                action: 'click',
                category: 'PC_GuestCheckout',
                label: 'PCB_PopupSignSuccess_Click'
              })
            }
            this.reloadFunc()
          } else {
            this.setPoint('signin', 'error', 'click', { error: data && data.msg })
            this.loading = false
            this.resultMsg = data.msg
            this.resultCode = data.code
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error)
        })
    },

    // 登录成功之后页面跳转
    reloadFunc() {
      // 订单追踪页登录之后，跳转订单列表页
      if (this.$route.query.hasOwnProperty('has_track')) {
        location.href = this.countryUrl('/order/list')
        return
      }
      if (this.source === 'headerBuyNow') {
        this.$axios.$get('/1.0/cart').then((res) => {
          window.location.href = this.countryUrl('/checkout')
        })
      } else if (this.source === 'buyNow') {
        window.location.href = this.countryUrl(this.buyNowUrl)
      } else if (this.source == 'showroom') {
        if (this.noMoreShowRoom) {
          location.reload()
        } else {
          this.$emit('createShowroom')
        }
      } else if (this.source == '/cart' || this.source == '/cart.php') {
        location.href = this.source + '?isLoginBack=1'
      } else {
        location.href = this.source
      }
    },
    toForget() {
      this.$emit('toForget')
    }
  }
}
</script>

<style lang="less" scoped>
.click_here {
  color: #f00;
  text-decoration: underline;
}
.checkout-box {
  .btn-user-form {
    background-color: @black-btn-color;
  }
}
</style>
