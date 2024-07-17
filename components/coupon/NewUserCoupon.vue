<template>
  <div class="new-user-coupon-page">
    <section :class="[`new-user-container-step-${newUserStep}`, { 'muti-lang': language != 'en' }]" class="new-user-coupon-container">
      <!-- 第一步email提交后回显券包 -->
      <template v-if="newUserStep == 1">
        <!-- 用户是否已经领取过 -->
        <template v-if="hasLucked">
          <CouponLucked />
        </template>
        <!-- 邮箱操作弹框区 -->
        <div v-else :class="{ error: rulesResult.email }" class="new-user-coupon-content email">
          <div class="new-user-coupon-title">
            {{ nl('page_common_new_user_15_off_tips') }}
          </div>
          <template v-if="versionObj.newUserCouponCodeAbtest == 'B'">
            <CouponCode />
          </template>
          <div class="new-user-coupon-form">
            <input
              v-model="email"
              @focus="initEmailCheckDomain"
              @blur="onBlurEmail"
              :disabled="disabled"
              :placeholder="nl('page_lucky_wheel_placeholder_text')"
              type="text"
            />
            <AzEmailDomain :show="emailDomainShow" :origin-email="email" @domain-handler="(value) => (email = value)" />
            <p class="error-tips">{{ rulesResult.email }}</p>
          </div>
          <div v-track.view.click="getBiParams('unlockoffers')">
            <az-button @click="subscribeSubmit" class="btn btn-default btn-submit">
              {{ loading ? nl('page_js_processing') : nl('page_common_new_user_unlock_offers') }}
            </az-button>
          </div>
          <div class="new-user-coupon-content-footer">
            <TipTermsAndPolicy :txt="nl('page_new_user_email_terms_1')">{{ nl('page_new_user_email_terms_2') }}</TipTermsAndPolicy>
          </div>
        </div>
      </template>

      <!-- 第二步身份和eventDate提交后回显券包 -->
      <template v-if="newUserStep == 2 || newUserStep == 3">
        <!-- 领取的卡券列表 -->
        <div
          v-if="newCouponList.length"
          v-track.view="getBiParams('couponpopup')"
          class="new-user-coupon-content identity-event-date congrats"
        >
          <div class="new-user-coupon-title">
            {{ nl('page_common_congrats') }}
          </div>
          <p class="new-user-coupon-description">{{ nl('page_common_coupon_list_desc') }}</p>
          <div class="new-user-coupon-list">
            <coupon-item
              v-for="item in newCouponList"
              :key="item.id"
              :val="item"
              :isSimple="true"
              v-track.view.click="getBiParams(item.click_name)"
            ></coupon-item>
          </div>
          <div v-track.view.click="getBiParams('continueshopping')">
            <az-button @click="close()" class="btn btn-default btn-submit">
              {{ nl('page_common_continue_shopping') }}
            </az-button>
          </div>
        </div>
        <!-- 身份和eventDate操作区 -->
        <div v-else :class="{ error: rulesResult.identity }" class="new-user-coupon-content identity-event-date">
          <div class="new-user-coupon-title">
            {{ nl('page_common_new_user_almost_there') }}
          </div>
          <p class="new-user-coupon-description">{{ nl('page_common_new_user_offers_tips') }}</p>
          <CouponCode />
          <div class="new-user-coupon-identity">
            <p class="new-user-coupon-identity-title">{{ nl('page_common_new_user_role_title') }}</p>
            <div class="identity-options">
              <Interested :goodsId="[]" :isConfig="true" :userRoleOptions="identityOptions" @on-change="identityChange" />
            </div>
            <p class="error-tips">{{ rulesResult.identity }}</p>
          </div>
          <div class="data-picker-box">
            <AzDatePicker @on-date-picker="handleDate" @open="handleDatePickerOpen(true)" @close="handleDatePickerOpen(false)" />
          </div>
          <div v-track.view.click="getBiParams('submit')">
            <az-button @click="submitAxios" class="btn btn-default btn-submit">
              {{ loading ? nl('page_js_processing') : nl('page_common_just_submit') }}
            </az-button>
          </div>
          <div class="new-user-coupon-content-footer">
            <TipTermsAndPolicy :txt="nl('page_sign_form_tip_text')"></TipTermsAndPolicy>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<script>
/**
 * AZWEB-21824 新客弹窗替换coupon wheel
 */
import Schema from 'async-validator'
import formValidatorType from '@/assets/js/formValidatorType'
import TipTermsAndPolicy from '@/components/user/TipTermsAndPolicy'
import CouponItem from '@/components/coupon/CouponItem'
import AzButton from '@/components/az-ui/Button/AzButton'
import Interested from '@/components/common/Interested'
import AzDatePicker from '@/components/az-ui-new/AzDatePicker'
import CouponCode from '@/components/coupon/CouponCode'
import AzEmailDomain from '@/components/az-ui-new/AzEmailDomain'
import checkEmailDomain from '@/assets/js/checkEmailDomain'
import CouponLucked from '@/components/coupon/CouponLucked'

import { mapState } from 'vuex'

export default {
  name: 'NewUserCoupon',
  languageKeys: [
    'page_subscribe_submit_tip',
    'page_login_enter_email',
    'page_login_check_email_format',
    'page_lucky_wheel_copy_success_text',
    'page_lucky_wheel_placeholder_text',
    'page_js_processing',
    ...new Array(17).fill().map((v, i) => 'page_wgd_coupon_box_text' + (i + 1)),
    'page_common_help_terms_of_use',
    'page_common_new_user_role_bridesmaid',
    'page_common_new_user_role_bride',
    'page_common_new_user_role_mom',
    'page_common_new_user_role_groomsmen',
    'page_common_new_user_role_guest',
    'page_common_new_user_role_going_to_event',
    'page_order_what_is_date',
    'page_common_just_submit',
    'page_sign_form_tip_text',
    'page_common_new_user_unlock_offers',
    'page_common_new_user_almost_there',
    'page_common_new_user_offers_tips',
    'page_common_congrats',
    'page_common_new_user_15_off_tips',
    'page_common_new_user_role_title',
    'page_common_new_user_role_error',
    'page_common_coupon_list_desc',
    'page_common_continue_shopping',
    'page_new_user_email_terms_1',
    'page_new_user_email_terms_2',
    'page_common_new_user_category_bd',
    'page_common_new_user_category_wd',
    'page_common_new_user_category_mom',
    'page_common_new_user_category_fgd',
    'page_common_new_user_category_sod',
    'page_common_new_user_category_acc',
    'page_common_email_save_continue',
    ...CouponItem.languageKeys,
    ...Interested.languageKeys,
    ...AzDatePicker.languageKeys,
    ...CouponCode.languageKeys,
    ...AzEmailDomain.languageKeys,
    ...CouponLucked.languageKeys
  ],
  components: {
    TipTermsAndPolicy,
    CouponItem,
    AzButton,
    Interested,
    AzDatePicker,
    CouponCode,
    AzEmailDomain,
    CouponLucked
  },
  mixins: [checkEmailDomain],
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      email: '', // 邮箱
      identity: '', // 身份
      eventDate: '', // event Date
      rulesResult: {
        email: '',
        identity: ''
      }, // 校验规则
      disabled: false,
      newCouponList: [], // coupon 列表
      identityOptions: [], // 身份选择列表
      selectedIdentityList: [], // 选择的身份
      newUserStep: 1, // 弹框进度
      loading: false,
      hasLucked: false // 曾经是否领取过
    }
  },
  computed: {
    ...mapState({
      showNewUserCoupon: (state) => state.showNewUserCoupon,
      fromAzHeaderActivitySource: (state) => state.fromAzHeaderActivitySource
    }),
    datePickerLang() {
      // 备注： 处理 DatePicker 组件的语言设置。需要跟插件语言对上
      // 新增语言的话，需要 import 对应的语言包
      const datePickerLang = this.language || 'en' // 如果网站的语言缩写跟插件语言包对不上，需要单独设置，否则插件就直接默认英语了
      return datePickerLang
    }
  },
  created() {
    this.getUserRole()
  },
  mounted() {
    // new_user_step 2 则默认展示第二步身份和eventDate提交弹框
    const step = localStorage.getItem('new_user_step')
    if (step && step == 2) {
      this.newUserStep = 2
      this.$emit('setNewUserStep', 2)
    }
    const descriptor = {
      email: formValidatorType.email({
        required: this.nl('page_login_enter_email'),
        validator: this.nl('page_login_check_email_format')
      })
    }
    this.validator = new Schema(descriptor)
    // comments: 登录过的用户记录登录的邮箱
    this.$axios.$get(`/1.0/common/user-info`).then((res) => {
      this.email = res.data.userEmail || this.$store.state.userInfo.userInfoEmail
    })
  },
  methods: {
    getBiParams(el) {
      if (process.server) return
      return {
        common: {
          ec: 'newcustomer',
          el,
          msg: JSON.stringify({
            email: this.email ? 1 : 0,
            identity: this.selectedIdentityList && this.selectedIdentityList.length ? this.selectedIdentityList.join(',') : '',
            ab: this.versionObj.newUserCouponCodeAbtest
          })
        }
      }
    },
    // 身份选择，支持多选
    identityChange(val) {
      this.selectedIdentityList = val
      this.rulesResult.identity = ''
    },
    // 获取身份
    getUserRole() {
      this.$axios.$get('/1.0/email/subscribe-user-role-new').then((res) => {
        if (res.code == 0) {
          this.identityOptions = res.data.map((item) => {
            return {
              catIds: [],
              checked: false,
              value: item
            }
          })
        }
      })
    },
    subscribeSubmit(e) {
      // 校验email
      this.validator.validate(
        {
          email: this.email
        },
        (errors, fields) => {
          console.log('errors fields: ', errors, fields)
          if (errors) {
            errors.map((item) => {
              if (!this.rulesResult[item.field]) {
                this.rulesResult[item.field] = item.message
              }
            })
            e.preventDefault()
            return false
          }
          this.getUserOffers()
        }
      )
    },
    // 提交email获取卡券列表offers
    getUserOffers() {
      this.loading = true
      if (this.emailDomainError) {
        this.needCheckEmailDomain = 0
        this.emailDomainError = false
        this.rulesResult.email = ''
      }
      this.$axios
        .$get('/1.0/coupon-wheel/v2/unlock-offers', {
          params: {
            email: this.email,
            from: this.fromAzHeaderActivitySource ? 'topbar' : 'normal',
            ab: this.versionObj.newUserCouponCodeAbtest,
            is_check_email_suffix: this.needCheckEmailDomain
          }
        })
        .then((res) => {
          this.loading = false

          if (res.code == 100210) {
            this.emailDomainError = true
            this.rulesResult.email = res.msg
            return
          }

          if (res.code == 0) {
            // 测试环境记录订阅邮箱
            if (this.environment.includes('dev')) {
              this.$cookie.setCookie('UnLoginEmail', this.email, 30)
            }
            // 1->跳第二个弹框
            // 2->提示 on our list
            this.$cookie.setCookie('UnLoginEmail', this.email, 30, '.' + this.APP_DOMAIN_LOWER) // 设置未登录邮箱缓存
            if (res.data.user_step == 1) {
              this.setPoint('newcustomer', 'unlockofferssuccess', 'click', {
                email: this.email,
                user_step: res.data.user_step,
                ab: this.versionObj.newUserCouponCodeAbtest
              })
              this.trackGA4NewEmail(this.email, 'new_customer_pop_up')
              localStorage.setItem('new_user_step', 2)
              this.newUserStep = 2
              this.$emit('setNewUserStep', 2)
            } else if (res.data.user_step == 2) {
              localStorage.setItem('new_user_step', 3)
              this.hasLucked = true
            }
          }

          // 打点日志：code、email、user_step
          this.$store.dispatch('getErr', {
            time: new Date(),
            appName: '网站PC',
            biz: 'FRONT', // 业务线 FRONT
            level: 'ERROR', // 日志级别 FATAL、ERROR、WARN、INFO、DEBUG、TRACE等
            severity: `Sev-3`, // 告警级别
            errorCode: 601, // 错误码,##如果有标准错误码定义的话，没有该字段就去掉
            trackId: '',
            errorMetric: 'bisend', // 错误关键字, vm 会出现未 undefined 的情况
            message: JSON.stringify({
              email: this.email,
              user_step: res.data.user_step,
              code: res.code
            }) // 错误信息
          })
        })
        .catch((error) => {
          this.loading = false
          console.log(error)
        })
    },
    // 提交email、身份、eventDate   { "email":"ruipeng@gaoyaya.com", "user_role":"bridesmaids", "event_date":"2025-01-02" }
    submitAxios() {
      const unLoginEmail = this.$cookie.getCookie('UnLoginEmail') || ''
      let params = {
        email: this.email || unLoginEmail,
        from: this.fromAzHeaderActivitySource ? 'topbar' : 'normal',
        ab: this.versionObj.newUserCouponCodeAbtest,
        is_check_email_suffix: 0
      }
      // if (this.newUserStep == 2) {
      // }
      // 第二步，收录用户身份和eventDate
      // 校验user_role，为空提示 Please select a role.
      if (!this.selectedIdentityList.length) {
        this.rulesResult.identity = this.nl('page_common_new_user_role_error')
        return false
      }
      params = {
        ...params,
        categories: this.selectedIdentityList,
        event_date: this.eventDate
      }
      this.loading = true
      this.$axios
        .$post('/1.0/coupon-wheel/v2/submit', params)
        .then((res) => {
          this.loading = false
          if (res.code == 0) {
            // 领取成功
            this.$store.commit('setShowSlideNewUserCoupon', false)
            this.setPoint('newcustomer', 'submitsuccess', 'click', {
              identity: this.selectedIdentityList.join(','),
              ab: this.versionObj.newUserCouponCodeAbtest
            })
            this.newUserStep = 3
            localStorage.setItem('new_user_step', 3)
            this.$emit('setNewUserStep', 3)
            if (Array.isArray(res.data)) {
              this.newCouponList = res.data
            }
          } else {
            alert(res.msg)
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error)
        })
    },
    close() {
      localStorage.setItem('new_user_close', true)
      // comments: 保证打点数据正常传输，延时1s关闭弹框
      setTimeout(() => {
        if (this.newUserStep == 3) this.$store.commit('setShowSlideNewUserCoupon', false)
        this.$store.commit('setShowNewUserCoupon', false)
        this.hasLucked = false
        this.$emit('handle-box', false)
      }, 1000)
    },
    handleDate(val) {
      this.eventDate = val
    },
    handleDatePickerOpen(show) {
      this.$emit('dateChange', show)
    }
  }
}
</script>

<style lang="less" scoped>
.data-picker-box {
  display: block;
  width: 100%;
  margin-top: 25px;
  /deep/ .mx-input {
    display: block;
    height: 45px;
    line-height: 43px;
    border-radius: 0;
    border: 1px solid #fff !important;
    box-shadow: none;
  }
  /deep/ .mx-icon-calendar {
    display: inline-block;
  }
  /deep/ .mx-datepicker-popup {
    left: 0 !important;
  }
}
.new-user-coupon-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  /deep/ .coupon-item {
    width: calc((100% - 15px) / 2);
    margin-top: 15px;
    .coupon-item-top {
      min-height: fit-content;
      height: auto;
      border: 1px solid var(--color-e3bda1);
      border-top: 4px solid var(--color-e3bda1);
      border-bottom: none;
      background: #fff6f8;
      .off {
        font-size: 18px;
        font-family: @font-family-600;
      }
      > p {
        font-family: @font-family;
        font-size: 12px;
        letter-spacing: 0.06em;
        text-align: left;
        color: @theme-color;
        span {
          font-family: @font-family-600;
        }
      }
    }
    .coupon-item-center {
      background: url(https://cdn-1.azazie.com/upimg/userfiles/images/1/a2/a4/68d93d6647520689f955d19c804ca2a4.png) no-repeat center;
      background-size: 100% 100%;
    }
    .coupon-item-bottom {
      border: 1px solid var(--color-e3bda1);
      border-top: none;
      overflow: initial;
      line-height: 17px;
      background: #fff6f8;
      > p {
        font-family: @font-family;
        font-size: 12px;
        letter-spacing: 0.02em;
        text-align: left;
        color: @theme-color;
        // overflow: inherit;
        a {
          border-bottom: 1px solid @theme-color;
        }
      }
    }
  }
}
.new-user-coupon-page {
  /deep/ .az-dialog-content {
    .btn-close {
      svg {
        fill: #333;
      }
    }
  }

  /deep/ .az-dialog-content {
    width: unset;
    padding: 0;
    .btn-close {
      background-color: unset;
    }
  }
  .new-user-coupon-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px;
    background-color: var(--color-f2e9e6);
    .new-user-coupon-content {
      box-sizing: border-box;
      width: 410px;
      &.congrats {
        width: 615px;
      }
      .new-user-coupon-title {
        font-family: @font-family-600;
        font-size: 32px;
        letter-spacing: 0.04em;
        text-align: center;
      }
      .new-user-coupon-sub-title {
        margin: 25px 0 25px;
        color: @theme-color;
        font-size: 16px;
        line-height: normal;
        letter-spacing: 0.96px;
        text-transform: uppercase;
        text-align: center;
      }
      .new-user-coupon-description {
        color: #999;
        font-size: 13px;
        line-height: normal;
        margin-top: 5px;
        font-family: @font-family;
        text-align: center;
      }
      .error-tips {
        // position: absolute;
        color: red;
      }
      .new-user-coupon-form {
        position: relative;
        width: 100%;
        margin: 20px 0 0;
        &.error {
          outline: 1px solid red;
          outline-offset: -1px;
        }
        input {
          width: 100%;
          height: 45px;
          box-sizing: border-box;
          background-color: #fff;
          border: 1px solid #eee;
          &::placeholder {
            text-transform: capitalize;
          }
        }
        /deep/ .az-email-domain-box {
          max-height: 185px;
        }
      }
      .new-user-coupon-identity {
        width: 100%;
        .new-user-coupon-identity-title {
          font-family: @font-family-600;
          font-size: 13px;
          line-height: 16px;
          letter-spacing: 0em;
          text-align: left;
        }
        .identity-options {
          display: flex;
          flex-wrap: wrap;
          /deep/ .az-checkbox {
            margin-top: 15px;
            margin-right: 15px;
            height: auto;
            line-height: initial;
            .az-checkbox-icon {
              width: 15px;
              height: 15px;
              &.checked {
                .icon {
                  margin-top: 2px;
                  margin-left: -1px;
                }
              }
            }
          }
        }
        /deep/ .az-radio-main {
          flex-wrap: wrap;
          margin-top: 0;
          .az-radio-option {
            margin-top: 15px;
            input[type='radio'] {
              &::before {
                background: #fff;
              }
            }
          }
        }
      }
      .btn-submit {
        width: 100%;
        height: 50px;
        font-size: 14px;
        margin-top: 25px;
        font-family: @font-family-600;
      }
      &-footer {
        color: @theme-color;
        font-family: @font-family;
        font-size: 13px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0px;
        text-align: left;
      }
    }
  }
}
</style>
