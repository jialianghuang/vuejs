<template>
  <div class="az-interest-subscribe">
    <section
      v-if="!subscribeResult"
      v-track.viewOnce="{ id: 'newsletter-common', common: getBiParams('newsletter', 'common') }"
      class="content"
    >
      <div v-if="title" class="subscribe-title">{{ title }}</div>

      <div class="subscribe-flex">
        <div class="interest-box">
          <div class="interest-title">{{ nl('page_common_new_user_role_title') }}</div>
          <Interested :goodsId="[]" @on-change="onCheckboxChange" />
          <p v-if="categoriesError" class="error-tip">{{ nl('page_common_new_user_role_error') }}</p>
        </div>

        <div class="subscribe-box">
          <div :class="[scene, { marginBot: resResult || rulesRes.email }]" class="mailbox-subscription">
            <div class="date-box">
              <label for="date">{{ nl('page_regist_wedding_date') }}</label>
              <AzDatePicker @on-date-picker="(e) => (date = e)" />
            </div>
            <div class="input-box">
              <label for="email" class="input-label">{{ '*' + nl('page_email_input_label_text') }}</label>
              <div class="input-item">
                <input
                  v-model="email"
                  :class="{ error: rulesRes.email || resResult }"
                  @focus="onFocus"
                  @blur="onBlurEmail"
                  aria-label="email"
                  type="email"
                  name="email"
                />
                <AzEmailDomain :show="emailDomainShow" :origin-email="email" @domain-handler="(value) => (email = value)" />
              </div>
              <p v-if="resResult" class="error-tip">{{ resResult }}</p>
              <p v-if="rulesRes.email" class="error-tip">{{ rulesRes.email ? rulesRes.email : nl('page_js_enter_valid_add') }}</p>
            </div>
            <az-button
              :loading="subscribeLoading"
              @click="subscribeCheck"
              class="need_datalayer"
              data-datalayer-category="Newsletter_Click"
              data-datalayer-label="Newsletter_Click"
            >
              {{ nl('page_footer_sign_up') }}
            </az-button>
          </div>
          <PrivacyPolicyTips />
        </div>
      </div>
    </section>

    <!-- 订阅成功 -->
    <div id="sub-success-mask" v-else class="sub-success-mask">
      <div class="flex-box">
        <span class="email-icon"></span>
        <p v-if="successMsg === 'subscribe_success'">
          {{ nl('page_email_added') }}
          <a v-track.view.click="{ common: getBiParams('swatch', 'signupnewsletter') }" href="/user?my_coupons">
            {{ nl('page_get_your_swatches_now') }}
          </a>
        </p>
        <p v-else>{{ successMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script>
/*
 ** #21905 修改web端页尾邮箱订阅组件 新增checkbox模块
 ** 不需要checkbox使用AzFooterSubscribe组件
 */

import AzButton from '@/components/az-ui/Button/AzButton'
import formValidatorType from '@/assets/js/formValidatorType'
import Schema from 'async-validator'
import PrivacyPolicyTips from '@/components/common/PrivacyPolicyTips'
import Interested from '@/components/common/Interested'
import AzDatePicker from '@/components/az-ui-new/AzDatePicker'
import AzEmailDomain from '@/components/az-ui-new/AzEmailDomain'
import checkEmailDomain from '@/assets/js/checkEmailDomain'

export default {
  name: 'AzInterestSubscribe',
  languageKeys: [
    'page_az_footer_subscribe_text1',
    'page_az_footer_subscribe_text2',
    'page_notify_me_when_flash_sale_update',
    'page_receive_special_offers_and_more',
    'page_email_your_email',
    'page_placeholder_your_email',
    'page_footer_sign_up',
    'page_js_enter_valid_add',
    'page_email_added',
    'page_get_your_swatches_now',
    'page_js_enter_valid_add',
    'page_email_enter_valid',
    'page_az_footer_subscribe_text3',
    'page_cyber_monday_identity',
    'page_common_new_user_role_title',
    'page_regist_wedding_date',
    'page_email_input_label_text',
    'page_common_new_user_category_bd',
    'page_common_new_user_category_wd',
    'page_common_new_user_category_mom',
    'page_common_new_user_category_fgd',
    'page_common_new_user_category_sod',
    'page_common_new_user_category_acc',
    'page_common_new_user_role_error',
    'page_common_new_user_role_title',
    'page_common_email_save_continue',
    ...PrivacyPolicyTips.languageKeys,
    ...Interested.languageKeys,
    ...AzDatePicker.languageKeys,
    ...AzEmailDomain.languageKeys
  ],
  components: {
    AzButton,
    PrivacyPolicyTips,
    Interested,
    AzDatePicker,
    AzEmailDomain
  },
  mixins: [checkEmailDomain],
  props: {
    title: {
      type: String,
      default: ''
    }, // 自定义显示title
    isEvent: {
      type: Boolean,
      default: false
    }, // 父组件自定义调用接口需要传入该prop
    resResult: {
      type: String,
      default: ''
    }, // 接口返回错误提示文案
    parentEmail: {
      type: String,
      default: ''
    }, // 传入email 自动填充
    showContinue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      email: '',
      date: null,
      categories: [],
      subscribeResult: false,
      successMsg: '',
      subscribeLoading: false,
      scene: 'az',
      categoriesError: false,
      // 邮箱校验
      validator: '',
      rulesRes: {
        email: ''
      }
    }
  },
  watch: {
    parentEmail(e) {
      this.email = e
    }
  },
  mounted() {
    const rules = {
      email: formValidatorType.email({ required: this.nl('page_js_enter_valid_add'), validator: this.nl('page_email_enter_valid') })
    }
    this.validator = new Schema(rules)

    if (this.scene !== 'freeSwatch') {
      this.buryPoint(this, 'event', {
        dp: 'home',
        ec: 'newsletter',
        el: 'signup',
        ea: 'view'
      })
    }
    this.setPoint('customer', 'identity', 'view')
  },
  methods: {
    onCheckboxChange(value) {
      this.categories = value
      this.categoriesError = false
    },
    onFocus() {
      this.initEmailCheckDomain()
      this.$emit('initError')
    },
    subscribeCheck() {
      if (this.categories.length === 0) {
        this.categoriesError = true
        return
      } else {
        this.categoriesError = false
      }
      if (this.scene !== 'freeSwatch') {
        const msg = {}
        this.buryPoint(this, 'event', {
          dp: 'home',
          ec: 'newsletter',
          el: 'signup',
          ea: 'click',
          msg
        })
      }
      this.validator.validate(
        {
          email: this.email
        },
        (errors) => {
          if (errors) {
            errors.map((item) => {
              if (!this.rulesRes[item.field]) {
                this.rulesRes[item.field] = item.message
              }
            })
            return false
          }
          this.subscribeSubmit({
            email: this.email,
            event_date: this.date,
            categories: this.categories
          })
        }
      )
    },
    subscribeSubmit(e) {
      if (this.isEvent) {
        this.$emit('subscribeSubmit', e)
        return
      }
      if (this.emailDomainError) {
        this.needCheckEmailDomain = 0
        this.emailDomainError = false
        this.rulesRes.email = ''
      }
      if (this.subscribeLoading) return false
      this.successMsg = ''
      const axiosParamsData = {
        categories: e.categories,
        event_date: e.event_date,
        email: e.email,
        is_check_email_suffix: this.needCheckEmailDomain
      }
      this.subscribeLoading = true
      this.retentionReject()
      this.$axios
        .get(`/1.0/email/subscribe`, {
          params: axiosParamsData
        })
        .then((response) => {
          this.subscribeLoading = false
          const res = response.data
          if (res.code == 100210) {
            this.emailDomainError = true
            this.rulesRes.email = res.msg
            return
          }
          if (res.code == 0) {
            this.$cookie.setCookie('UnLoginEmail', e.email, 30, '.' + this.APP_DOMAIN_LOWER) // 设置未登录邮箱缓存
            const params = this.getBiParams('newsletter', 'success')
            params.ea = 'click'
            this.buryPoint(this, 'event', params)
            this.subscribeResult = true
            // this.successMsg = res.data
            this.successMsg = 'subscribe_success'
            this.trackGA4NewEmail(axiosParamsData.email, 'bottom_3_swatch_coupon_subscribe')
            localStorage.setItem('new_user_step', 3)
            this.$emit('subscribe-submit', true)
          } else {
            this.rulesRes.email = res.msg
          }
        })
        .catch((error) => {
          console.log(error)
          this.subscribeLoading = false
        })
    },
    // 导入date picker组件
    disabledDate(current) {
      // Can not select days before today
      return current && current < this.$dayjs().startOf('day')
    },
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        dp: 'home',
        ec,
        el
      }
      return obj
    }
  }
}
</script>

<style lang="less" scoped>
.az-interest-subscribe {
  position: relative;
  background: var(--color-f1e9e6);
  padding: 30px;
  --min-width: 235px;
  --max-width: 309px;
  --btn-width: 160px;
  .content {
    margin: 0 auto;
    padding: 0;
    max-width: 1600px;
  }
  .subscribe-title {
    margin: 0 0 20px 0;
    color: var(--color-121212);
    font-family: @font-Ivy-Mode-600;
    font-size: 18px;
    text-transform: capitalize;
  }
  .subscribe-flex {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .interest-box {
      max-width: 685px;
      width: 42%;
      margin-right: 20px;
      .error-tip {
        color: @highlight-lightest;
        font-family: @font-family-500;
        font-size: 13px;
        margin-top: 15px;
      }
      .interest-title {
        color: var(--color-121212);
        font-family: @font-family-600;
        font-size: 14px;
        font-weight: 500;
        text-transform: capitalize;
        margin: 0 0 20px 0;
      }
      /deep/ .check-box-item-text {
        font-size: 14px;
      }
    }
    .subscribe-box {
      flex: 1;
      label {
        color: var(--color-121212);
        font-family: @font-family-600;
        font-size: 14px;
        text-transform: capitalize;
        display: block;
        margin: 0 0 20px 0;
      }
      .mailbox-subscription {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        column-gap: 20px;
        .date-box {
          display: block;
          min-width: var(--min-width);
          width: calc((100% - 200px) / 2);
          max-width: var(--max-width);
        }
        .input-box {
          min-width: var(--min-width);
          width: calc((100% - 200px) / 2);
          max-width: var(--max-width);
          position: relative;
          .input-item {
            position: relative;
            &::after {
              content: '*';
              position: absolute;
              right: 10px;
              top: 50%;
              transform: translateY(-50%);
              color: @theme-color;
            }
          }
          input::-ms-clear {
            display: none;
          }
          input {
            width: 100%;
            height: 45px;
            line-height: 14px;
            color: var(--color-121212);
            outline: none;
            padding: 0 6px;
            background: var(--color-ffffff);
            border: solid 1px @border-color;
            box-sizing: border-box;
            &:focus {
              padding: 10px 5px;
              background: var(--color-ffffff);
            }
            &.error {
              border-color: @highlight-lightest;
              padding: 10px 5px;
            }
          }
        }
        button {
          padding: 0;
          width: var(--btn-width);
          height: 45px;
          overflow: hidden;
          line-height: 45px;
          border: none;
          color: var(--color-ffffff);
          background-color: var(--color-121212);
          text-transform: uppercase;
          font-family: @font-family-700;
          font-size: 14px;
        }
        .error-tip {
          color: @highlight-lightest;
          font-family: @font-family-500;
          font-size: 13px;
          text-transform: none;
          text-align: left;
          position: absolute;
          bottom: -21px;
          white-space: nowrap;
        }
        &.bridal {
          input {
            background: var(--color-f2e9e6);
            border-color: #050708;
          }
          button {
            background: var(--color-121212);
            color: var(--color-ffffff);
            font-family: @font-Ivy-Mode-400;
          }
        }
        &.freeSwatch {
          margin-top: 30px;
          .input-box {
            margin: 0px 5px;
          }
          input {
            width: 240px;
          }
        }
        &.marginBot {
          margin-bottom: 36px;
        }
      }
    }
  }
  .privacy-policy-box {
    text-align: right;
    margin-top: 20px;
  }
  .sub-success-mask {
    text-align: center;
    width: 100%;
    height: 120px;
    background: var(--color-f1e9e6);
    &.sub-success-mask-sale {
      background: #ffdfe1;
    }
    &.color-activity {
      background: linear-gradient(269.03deg, #ecf8fb 0%, #ebf3ff 19.14%, #f6f2fe 39.89%, #fff3f5 58.99%, #fffae9 79.39%, #eefcea 100%);
      .email-icon {
        width: 27.57px;
        height: 19.55px;
        background: url('~assets/images/index/email_icon.png') no-repeat;
        background-size: 100% 100%;
      }
      p {
        font-size: 16px;
        font-family: @font-family-500;
      }
    }
    .flex-box {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      a {
        color: @theme-color;
        text-decoration: underline;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .email-icon {
      width: 24px;
      height: 17px;
      margin: 10px 15px;
      background: url('~assets/images/index/email_icon.png') no-repeat;
    }
    p {
      color: var(--color-121212);
      font-family: @font-family-500;
      font-size: 16px;
      text-transform: uppercase;
    }
  }
  /deep/ .az-checkbox-icon {
    width: 15px;
    height: 15px;
    margin-right: 10px;
    line-height: 15px;
  }

  /deep/ .az-checkbox-icon .icon {
    width: 12px;
    height: 12px;
  }
  /deep/ .az-check-box-item {
    background: var(--color-ffffff);
  }
}
</style>
