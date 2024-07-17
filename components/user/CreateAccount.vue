<template>
  <div v-track.view.click="{ common: getBiParams('signup', 'popup') }" class="fs-content">
    <client-only>
      <div v-if="jsKey != 'user' && showFreeSwatchTips" class="freeswatches-wrap">
        <az-icon icon-class="icon-a-gift" fill="var(--color-121212)" class="login-coupon" />
        {{ nl(`page_login_coupon_tips_${country.toLowerCase()}`) }}
      </div>
    </client-only>
    <form id="form_reg" onsubmit="return false" name="form_reg" autocomplete="off">
      <div v-if="resultMsg" class="control-group error">
        <span class="help-block">{{ resultMsg }}</span>
      </div>
      <email-input
        ref="EMAIL"
        @submit="signUpEvent"
        @focus="emailFormFocus"
        @checkEmail="checkEmail"
        :tabindex="'1'"
        :validatorTxt="nl('page_login_check_email_format')"
        :needCheck="true"
        :readonly="true"
        :needIcon="true"
        :parentErrorText="parentErrorText"
      ></email-input>
      <password-input
        ref="PASSWORD"
        @submit="signUpEvent"
        @focus="resultMsg = ''"
        :hasForget="false"
        :tabindex="'2'"
        :rules="'type2'"
        :labelText="nl('page_regist_createpswd')"
        :readonly="true"
        :needIcon="true"
      ></password-input>

      <template v-if="showCategory">
        <div class="control-group interest-box">
          <p class="interest-title">{{ nl('page_common_new_user_role_title') }}</p>
          <Interested :goods-id="[]" @on-change="interestedChange" />
          <p v-if="categoriesError" class="error-tip">{{ nl('page_common_new_user_role_error') }}</p>
        </div>
        <div v-if="registScene.key !== 'david_bridal'" class="control-group">
          <label for="date">{{ nl('page_regist_wedding_date') }}</label>
          <AzDatePicker @on-date-picker="(e) => (wedding_date = e)" />
        </div>
      </template>

      <az-button
        :loading="loading"
        :disabled="loading"
        :needIcon="false"
        @click="signUpEvent"
        class="btn btn-success btn-user-form"
        tabindex="4"
        >{{ btnText }}</az-button
      >
      <tip-terms-and-policy :txt="nl('page_create_account_tip_text')"></tip-terms-and-policy>
      <p v-if="registScene.key !== 'david_bridal'" class="to-login">
        {{ nl('page_regist_ques') }}<a @click="toLogin" href="javascript:void(0)" class="js-switch">{{ nl('page_regist_login_btn') }}</a>
      </p>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AzButton from '@/components/az-ui/Button/AzButton'
import EmailInput from '@/components/user/EmailInput'
import PasswordInput from '@/components/user/PasswordInput'
import TipTermsAndPolicy from '@/components/user/TipTermsAndPolicy'
import Interested from '@/components/common/Interested'
import AzDatePicker from '@/components/az-ui-new/AzDatePicker'
import checkEmailDomain from '@/assets/js/checkEmailDomain'
export default {
  name: 'CreateAccount',
  languageKeys: [
    'page_create_account_text',
    'page_az_header_logo_text1',
    'page_login_check_email_format',
    'page_regist_createpswd',
    'page_regist_wedding_date',
    'page_order_progress_processing',
    'page_register_reg_submit',
    'page_create_account_tip_text',
    'page_regist_ques',
    'page_regist_login_btn',
    'page_sign_up_reveive_offers',
    'page_common_join_us',
    'page_common_email_save_continue',
    ...EmailInput.languageKeys,
    ...PasswordInput.languageKeys,
    ...TipTermsAndPolicy.languageKeys,
    ...Interested.languageKeys,
    ...AzDatePicker.languageKeys
  ],
  components: {
    AzButton,
    EmailInput,
    PasswordInput,
    TipTermsAndPolicy,
    Interested,
    AzDatePicker
  },
  mixins: [checkEmailDomain],
  props: {
    source: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      email: '',
      password: '',
      categories: [],
      wedding_date: null,
      resultMsg: '',
      loading: false,
      categoriesError: false,
      showFreeSwatchTips: false,
      showCategory: false,
      parentErrorText: ''
    }
  },
  computed: {
    ...mapState('userInfo', ['noMoreShowRoom']),
    ...mapState('checkout', ['buyNowUrl']),
    btnText() {
      let res = this.nl('page_common_join_us')
      if (this.registScene.key === 'david_bridal') {
        res = this.nl('page_sign_up_reveive_offers')
      }
      return this.loading ? `${this.nl('page_order_progress_processing')}...` : res
    }
  },
  created() {
    if (process.client) {
      const newUserStep = localStorage.getItem('new_user_step')
      // 只要不等于3表示没有领取coupon
      if (newUserStep != 3) {
        this.showFreeSwatchTips = true
      }
    }
  },
  methods: {
    getBiParams(ec, el) {
      if (process.server || this.registScene.key !== 'david_bridal') return
      return {
        ec,
        el
      }
    },
    keydownEvent(e) {
      const keyCode = e.which || e.keyCode
      if (keyCode == 13) {
        this.signUpEvent()
      }
    },
    signUpEvent() {
      this.buryPoint(this, 'event', {
        ec: 'signup',
        el: 'common',
        ea: 'click'
      })
      if (this.loading) {
        return false
      }
      const items = []
      if (!this.$refs.EMAIL.validateEvent()) {
        const temp = {
          ec: 'signup',
          el: 'error',
          ea: 'view',
          msg: JSON.stringify({ error: this.$refs.EMAIL && this.$refs.EMAIL.rulesResult && this.$refs.EMAIL.rulesResult.email })
        }
        items.push(temp)
      }
      if (!this.$refs.PASSWORD.validateEvent()) {
        const temp = {
          ec: 'signup',
          el: 'error',
          ea: 'view',
          msg: JSON.stringify({ error: this.$refs.PASSWORD && this.$refs.PASSWORD.rulesResult && this.$refs.PASSWORD.rulesResult.password })
        }
        items.push(temp)
      }
      if (this.categories.length === 0) {
        this.categoriesError = true
        return
      } else {
        this.categoriesError = false
      }
      this.buryPoint(this, 'items', items)
      if (!this.$refs.EMAIL.validateEvent() | !this.$refs.PASSWORD.validateEvent()) {
        return false
      }
      this.email = this.$refs.EMAIL.email
      this.password = this.$refs.PASSWORD.password
      this.regAxios()
      // ga4打点
      this.setGA4DataLayer({
        event: 'ga4Event',
        event_name: 'sign_up',
        event_parameters: {
          method: 'Email'
        }
      })
    },
    regAxios() {
      if (this.emailDomainError) {
        this.needCheckEmailDomain = 0
        this.emailDomainError = false
        this.$refs.EMAIL.rulesResult.email = ''
        this.parentErrorText = ''
      }
      this.retentionReject()
      this.loading = true
      const formData = new FormData()
      formData.append('email', this.email)
      formData.append('name', this.email.split('@')[0])
      formData.append('password', this.password)
      formData.append('is_check_email_suffix', this.needCheckEmailDomain)
      // categories 传一个字符串数组
      if (Array.isArray(this.categories)) {
        this.categories.forEach((value, index) => {
          formData.append(`categories[${index}]`, value)
        })
      }

      let url = '/1.0/user/register'

      if (this.registScene.key === 'david_bridal') {
        url = '/1.0/landing-page/davids-bridal/register'
        formData.append('event', this.registScene.data.event)
        formData.append('event_date', this.registScene.data.eventDate)
        formData.append('event_role', this.registScene.data.eventRole)
        formData.append('event_people', this.registScene.data.eventPeople)
      } else {
        this.wedding_date && formData.append('event_date', this.wedding_date)
      }

      // 调用注册接口
      this.$axios
        .$post(url, formData)
        .then(async (data) => {
          this.$refs.EMAIL.rulesResult.email = ''
          this.buryPoint(this, 'event', {
            ec: 'sign_user_tag',
            el: 'sign_user_tag_first_register',
            ea: 'view'
          })
          if (data.code == 100210) {
            this.loading = false
            this.emailDomainError = true
            this.parentErrorText = data.msg
            return
          }
          if (data.code == 0) {
            this.trackGA4NewEmail(this.email, 'sign_up')
            if (this.environment.includes('dev')) {
              // 本地开发的时候，可以使用 localhost 或者是 映射到 dev.azazie.com
              this.$cookie.setCookie('login_token', data.data.token, 7, 'localhost')
              this.$cookie.setCookie('login_token', data.data.token, 7, window.location.hostname)
            }

            const msg = {}
            // 如果存在网红link id，在msg里面带上此数据
            const linkId = this.$cookie.getCookie('link_id')
            if (linkId) {
              msg.link_id = linkId
            }
            const storefrontLink = localStorage.getItem('STOREFRONT_LINK') || ''
            if (storefrontLink) {
              msg.storefront_link = storefrontLink
            }
            const pointInfo = {
              ec: 'signup',
              el: 'success',
              ea: 'click',
              msg: JSON.stringify(msg)
            }
            this.buryPoint(this, 'event', pointInfo)
            this.setDataLayer({
              category: 'webtracking',
              action: 'signup_success',
              label: 'signup'
            })
            let userId = data.data && (data.data.userId || data.data.user_id)
            if (this.registScene.key === 'david_bridal') {
              userId = data.data.user.user_id
              this.$store.commit('userInfo/setDavidBridalCoupons', data.data.coupon)
            }
            this.$cookie.setCookie('user_id', userId || '-1', 7, '.' + this.APP_DOMAIN_LOWER)
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

            if (this.registScene.key === 'david_bridal') {
              return
            }
            if (this.source == 'showroom') {
              if (this.noMoreShowRoom) {
                location.reload()
              } else {
                this.createShowroom()
              }
            } else if (this.source == 'buyNow') {
              location.href = this.countryUrl(this.buyNowUrl)
            } else if (this.source == 'headerBuyNow') {
              location.href = this.countryUrl('/checkout')
            } else {
              location.href = this.source
            }
          } else {
            this.buryPoint(this, 'event', {
              ec: 'signup',
              el: 'error',
              ea: 'view',
              msg: JSON.stringify({ error: data.msg })
            })
            this.loading = false
            this.resultMsg = data.msg
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error)
        })
    },
    toLogin() {
      this.buryPoint(this, 'event', {
        ec: 'signin',
        el: 'lognin',
        ea: 'click'
      })
      this.$emit('toSignIn')
    },
    createShowroom() {
      this.$axios.$post(`/1.0/showroom`).then((res) => {
        // this.$emit('refreshUser')
        if (res.code == 0) {
          location.href = this.countryUrl(`/showroom/${res.data.showroomIdDisplay}`)
        } else {
          alert(res.msg)
        }
      })
    },
    interestedChange(val = []) {
      this.categories = val
      this.categoriesError = false
    },
    checkEmail(data) {
      // 校验返回为空数组时显示interested勾选框 有数组时展示已勾选样式(注册页不显示但要传categories和event_date参数)
      if (data.extensions && data.extensions.length === 0) {
        this.categoriesError = false
        this.showCategory = true
      } else {
        this.showCategory = false
        this.categories = data.extensions ? data.extensions.categories || [] : []
        this.wedding_date = data.extensions ? data.extensions.event_date || '' : ''
      }
    },
    emailFormFocus() {
      this.resultMsg = ''
      this.initEmailCheckDomain()
      this.parentErrorText = ''
    }
  }
}
</script>

<style lang="less" scoped>
.fs-content {
  width: 555px;
  margin: 0 auto;
  .freeswatches-wrap {
    background: @bg-color;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    .login-coupon {
      font-size: 18px;
      margin-right: 8px;
    }
  }
  /deep/ .btn-user-form {
    margin-top: 30px !important;
  }

  .to-login {
    margin: 15px 0 15px;
    color: var(--color-666666);
    a {
      color: var(--color-666666);
    }
  }
  form .control-group.email {
    z-index: @z-index-3;
  }
}

.interest-box {
  position: relative;
  .interest-title {
    color: var(--color-121212);
    font-family: @font-family-500;
    font-size: 13px;
    text-transform: capitalize;
    margin: 15px 0;
  }
  .error-tip {
    color: @highlight-lightest;
    font-family: @font-family-500;
    font-size: 13px;
    margin-top: 3px;
  }
}
</style>
