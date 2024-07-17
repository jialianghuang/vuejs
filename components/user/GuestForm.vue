<template>
  <form id="form_login" onsubmit="return false" name="form_login" autocomplete="off">
    <az-button
      v-if="$route.name != 'checkout'"
      :loading="loading"
      :disabled="loading"
      :needIcon="false"
      :textColor="'var(--color-121212)'"
      :color="'#fff'"
      @click="loginSubmit"
      class="btn btn-theme btn-user-form btn-guest"
      tabindex="6"
      >{{ loading ? `${nl('page_order_progress_processing')}...` : nl('page_guest_form_guest_checkout') }}</az-button
    >
    <p class="txt-2">
      {{ nl('page_guset_form_txt_2') }}
      <a @click="toCreateAccount" class="regist-txt js-switch">{{ nl('page_login_regist') }}!</a>
    </p>
  </form>
</template>

<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import validateCart from '@/assets/js/validateCart'
import { mapState } from 'vuex'
export default {
  name: 'GuestForm',
  languageKeys: ['page_order_progress_processing', 'page_guest_form_guest_checkout', 'page_guset_form_txt_2', 'page_login_regist'],
  components: {
    AzButton
  },
  mixins: [validateCart],
  props: {
    source: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      email: '',
      loading: false,
      resultMsg: '',
      isNewUser: 'true'
    }
  },
  computed: {
    ...mapState('checkout', ['buyNowUrl'])
  },
  methods: {
    loginSubmit() {
      this.buryPoint(this, 'event', {
        ec: 'signin',
        el: 'guestcheckout',
        ea: 'click'
      })
      if (this.loading) {
        return false
      }
      this.setDataLayer({
        action: 'click',
        category: 'PC_GuestCheckout',
        label: 'PCA_GuestCheckout_Click'
      })
      if (this.source == 'buyNow') {
        window.location.href = this.countryUrl(this.buyNowUrl)
      } else {
        window.location.href = this.countryUrl('/checkout')
      }
    },
    loginAxios() {
      this.retentionReject()
      this.loading = true
      this.$axios
        .$post(`/1.0/user/guest`, { email: this.email })
        .then((res) => {
          // todo: 游客登录
          if (res.code == 0) {
            this.$cookie.setCookie('user_id', res.data.userId || res.data.user_id || '-1', 7)
            this.$cookie.setCookie('login_token', res.data.token, 7, '.' + this.APP_DOMAIN_LOWER)
            this.$store.commit('userInfo/updateInfo', { ...res.data, isGuest: true })
            this.updateWGDTag(true)
            this.buryPoint(this, 'event', {
              ec: 'sign_user_tag',
              el: 'sign_user_tag_guest',
              ea: 'view',
              msg: JSON.stringify({
                email: res.data.email,
                isLogin: Number(this.isLogin)
              })
            })
            if (this.source == 'buyNow') {
              window.location.href = this.countryUrl(this.buyNowUrl)
            } else if (this.validateCart()) {
            } else {
              this.loading = false
              this.$emit('close')
            }
          } else {
            this.loading = false
            this.buryPoint(this, 'event', {
              ec: 'signin',
              el: 'guestcheckouterror',
              ea: 'view',
              msg: JSON.stringify({ error: res.msg })
            })
            if (res.code == 100600) {
              this.isNewUser = false
              this.$parent.$refs.SIGN.$refs.EMAIL.email = this.email
              this.$parent.$refs.SIGN.$refs.PASSWORD.password = ''
              this.$refs.EMAIL.rulesResult.email = res.msg
            } else {
              this.resultMsg = res.msg
            }
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error)
        })
    },
    toCreateAccount() {
      this.setDataLayer({
        action: 'click',
        category: 'PC_GuestCheckout',
        label: 'PCA_PopupCreateAccount_Click'
      })
      this.$emit('toCreateAccount')
    }
  }
}
</script>

<style lang="less" scoped>
.is_checkout {
  border-top: none;
}
.txt-1 {
  margin: 20px 0;
}
.txt-2 {
  margin: 15px 0 0 0 !important;
  a {
    color: var(--color-121212);
    text-decoration: underline;
    cursor: pointer;
  }
}
.btn-guest {
  background: #fff !important;
  color: var(--color-121212) !important;
  border: 1px solid var(--color-121212) !important;
  &:hover {
    background: #f6f6f6 !important;
  }
  &:active {
    background: #f6f6f6 !important;
  }
  &:focus {
    background: #f6f6f6 !important;
  }
}
.checkout-box {
  .regist-txt {
    color: @black-btn-color;
  }
}
</style>
