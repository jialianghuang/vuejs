<template>
  <form onsubmit="return false" autocomplete="off">
    <p class="txt">{{ nl('page_track_form_title') }}</p>
    <div class="control-group error">
      <span class="help-block">{{ resultMsg }}</span>
    </div>
    <email-input
      ref="EMAIL"
      @submit="loginSubmit"
      @focus="resultMsg = ''"
      :requiredTxt="nl('page_js_email_input')"
      :validatorTxt="nl('page_js_enter_valid_add')"
      :tabindex="1"
      :className="'track-order-email'"
      @emailChange="emailChange"
    ></email-input>
    <guest-order-input
      ref="ORDERSN"
      @submit="loginSubmit"
      @focus="resultMsg = ''"
      :tabindex="2"
      :guestEmail="guestEmail"
    ></guest-order-input>
    <p>{{ nl('page_track_your_order_tips') }}</p>
    <az-button :loading="loading" :disabled="loading" :needIcon="false" @click="loginSubmit" class="btn btn-theme btn-user-form">{{
      loading ? `${nl('page_order_progress_processing')}...` : nl('page_track_form_view_order')
    }}</az-button>
    <tip-terms-and-policy :txt="nl('page_track_form_tip_text')"></tip-terms-and-policy>
  </form>
</template>

<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import GuestOrderInput from '@/components/user/GuestOrderInput'
import EmailInput from '@/components/user/EmailInput'
import TipTermsAndPolicy from '@/components/user/TipTermsAndPolicy'
export default {
  name: 'TrackForm',
  components: {
    AzButton,
    EmailInput,
    GuestOrderInput,
    TipTermsAndPolicy
  },
  props: {
    source: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      guestEmail: '',
      guestOrder: '',
      loading: false,
      resultMsg: ''
    }
  },
  mounted() {
    this.setPoint('guest checkout', 'vieworder', 'view')
  },
  methods: {
    emailChange(val) {
      this.guestEmail = val
    },
    loginSubmit() {
      this.setPoint('signin', 'vieworder', 'click')
      if (this.loading) {
        return false
      }
      if (!this.$refs.EMAIL.validateEvent()) {
        this.setPoint('signin', 'errortrackyourorder', 'click', { error: this.nl('page_js_email_input') })
      }
      if (!this.$refs.ORDERSN.validateEvent()) {
        this.setPoint('signin', 'errortrackyourorder', 'click', { error: this.nl('page_js_email_input_number') })
      }
      this.setDataLayer({
        action: 'click',
        category: 'PC_GuestCheckout',
        label: 'PC_TrackOrder_Click'
      })
      this.setPoint('guest checkout', 'vieworder', 'click')
      if (!this.$refs.EMAIL.validateEvent() || !this.$refs.ORDERSN.validateEvent()) {
        return false
      }
      // this.guestEmail = this.$refs.EMAIL.email
      this.guestOrder = this.$refs.ORDERSN.orderSn
      this.loginAxios()
    },
    loginAxios() {
      this.retentionReject()
      this.loading = true
      const backUrl = this.$route.query.back
      const params = { email: this.guestEmail, order_sn: this.guestOrder, back: backUrl }
      this.$axios
        .$post(`/1.0/order/track`, params)
        .then((res) => {
          if (res.code == 0) {
            this.trackGA4NewEmail(this.guestEmail, 'track_your_order', null, true)
            this.handleGuestOrderInfo(this.guestOrder, this.guestEmail)
            this.setDataLayer({
              action: 'click',
              category: 'PC_GuestCheckout',
              label: 'PC_TrackOrderSuccess_Click'
            })
            // 查询订单成功后，自动完成 guest 用户 隐式登录，再跳转到订单详情页,正式用户不登录
            // orderType  1:正式用户订单 2：游客用户订单
            if (res.data.orderType == 2) {
              this.$axios
                .$post(`/1.0/user/guest`, { email: this.guestEmail })
                .then((res) => {
                  if (res.code == 0) {
                    this.$cookie.setCookie('user_id', res.data.userId || res.data.user_id || '-1', 7, '.' + this.APP_DOMAIN_LOWER)
                    this.$cookie.setCookie('webpush_email', this.checkoutLoginEmail || res.data.email, 7, '.' + this.APP_DOMAIN_LOWER)
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
                    this.setPoint('guest checkout', 'viewordersuccess', 'click')
                    location.href = this.countryUrl(
                      backUrl && backUrl.includes('order_review')
                        ? backUrl
                        : '/order/detail?order_sn=' + this.guestOrder + '&email=' + this.guestEmail + '&is_guest=1&origin_type=track_order'
                    )
                  } else {
                    this.setPoint('guest checkout', 'viewordererror', 'view', {
                      error: res.msg
                    })
                  }
                })
                .catch((error) => {
                  this.loading = false
                  console.log(error)
                })
            } else {
              this.setPoint('guest checkout', 'viewordersuccess', 'click')
              location.href = this.countryUrl(
                backUrl && backUrl.includes('order_review')
                  ? backUrl
                  : '/order/detail?order_sn=' + this.guestOrder + '&email=' + this.guestEmail + '&is_guest=1&origin_type=track_order'
              )
            }
          } else if (res.code == 1002 || res.code == 1003) {
            this.loading = false
            this.setPoint('signin', 'errortrackyourorder', 'click', {
              error: this.nl('page_track_form_result_msg')
            })
            this.resultMsg = this.nl('page_track_form_result_msg')
            this.setPoint('guest checkout', 'viewordererror', 'view', {
              error: this.resultMsg
            })
          } else {
            this.loading = false
            this.setPoint('signin', 'errortrackyourorder', 'click', {
              error: this.nl('page_track_form_result_msg')
            })
            this.resultMsg = this.nl('page_track_form_result_msg')
            this.setPoint('guest checkout', 'viewordererror', 'view', {
              error: this.resultMsg
            })
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error)
        })
    },
    // 记录游客下单的订单号和邮箱
    handleGuestOrderInfo(orderSn) {
      const guestCheckout = {
        orderSn,
        checkoutLoginEmail: this.checkoutLoginEmail
      }
      const guestCheckoutInfo = localStorage.getItem('guestCheckoutInfo')
      let guestCheckoutList = []
      if (guestCheckoutInfo) {
        guestCheckoutList = JSON.parse(guestCheckoutInfo)
      }
      guestCheckoutList = this.uniqueByKey([guestCheckout, ...guestCheckoutList], 'orderSn') // 去重
      guestCheckoutList = guestCheckoutList.slice(0, 10) // 保留最新的10条数据
      localStorage.setItem('guestCheckoutInfo', JSON.stringify(guestCheckoutList))
    }
  }
}
</script>

<style lang="less" scoped>
.txt {
  margin-bottom: 20px;
}
</style>
