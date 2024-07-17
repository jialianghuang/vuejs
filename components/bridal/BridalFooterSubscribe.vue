<template>
  <div id="idx-footer-sub" class="idx-footer-sub">
    <div
      v-if="!subscribeResult"
      v-track.viewOnce="{ id: 'newsletter-common', common: { ec: 'newsletter', el: 'common' } }"
      :class="{ 'footer-subscribe-flash-sale': isFlashSalePage }"
      class="footer-subscribe footer-subscribe-A"
    >
      <div class="h3">
        {{ nl('page_bridal_sign_up_to_newsletter') }}
      </div>
      <mailbox-subscription
        :subscribeLoading="subscribeLoading"
        :isFlashSalePage="isFlashSalePage"
        :rulesResult="rulesResult"
        :buttonText="isFlashSalePage ? nl('page_notify_me') : nl('page_footer_sign_up')"
        @on-submit="subscribeSubmit"
        scene="bridal"
      ></mailbox-subscription>
    </div>
    <div id="sub-success-mask" v-else :class="{ 'sub-success-mask-sale': isFlashSalePage }" class="sub-success-mask">
      <div class="flex-box">
        <span class="email-icon"></span>
        <p v-if="successMsg === 'subscribe_success'">
          {{ nl('page_email_added') }}
          <a v-track.view.click="{ common: { ec: 'swatch', el: 'signupnewsletter' } }" href="/swatches">{{
            nl('page_get_your_swatches_now')
          }}</a>
        </p>
        <p v-else>{{ successMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import MailboxSubscription from '@/components/common/MailboxSubscription'

export default {
  name: 'BridalFooterSubscribe',
  languageKeys: [
    'page_bridal_sign_up_to_newsletter',
    'page_bridal_footer_subscribe',
    'page_email_your_email',
    'page_placeholder_your_email',
    'page_footer_sign_up',
    'page_js_enter_valid_add',
    'page_email_added',
    'page_email_enter_valid',
    'page_get_your_swatches_now',
    'page_az_footer_subscribe_text3',
    'page_cyber_monday_identity'
  ],
  components: {
    MailboxSubscription
  },
  props: {
    isFlashSalePage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      email: '',
      wedding_date: null,
      rulesResult: '',
      subscribeResult: false,
      successMsg: '',
      subscribeLoading: false
    }
  },
  mounted() {},
  methods: {
    subscribeSubmit(e) {
      if (this.subscribeLoading) return false
      this.rulesResult = ''
      this.successMsg = ''
      const axiosParamsData = {
        // act: 'submit_email',
        email: e.email,
        role: e.role
      }
      if (this.isFlashSalePage) {
        axiosParamsData.subscribe_type = 1
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
          if (res.code == 0) {
            this.$cookie.setCookie('UnLoginEmail', e.email, 30, '.' + this.APP_DOMAIN_LOWER) // 设置未登录邮箱缓存
            this.setPoint('newsletter', 'success', 'click')
            this.subscribeResult = true
            if (this.isFlashSalePage) {
              this.successMsg = this.nl('page_az_footer_subscribe_text3')
            } else {
              // this.successMsg = res.data
              this.successMsg = 'subscribe_success'
            }
            this.trackGA4NewEmail(axiosParamsData.email, 'bottom_3_swatch_coupon_subscribe', axiosParamsData.role)
          } else {
            this.rulesResult = res.msg
          }
        })
        .catch((error) => {
          console.log(error)
          this.subscribeLoading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.idx-footer-sub {
  position: relative;
  margin-bottom: 30px;
  .footer-subscribe-A {
    &.color-activity {
      background: linear-gradient(269.03deg, #ecf8fb 0%, #ebf3ff 19.14%, #f6f2fe 39.89%, #fff3f5 58.99%, #fffae9 79.39%, #eefcea 100%);
      .h3 {
        font-size: 24px;
        font-family: @font-family;
        font-weight: 300;
        text-transform: uppercase;
        font-style: normal;
        span {
          font-weight: 600;
        }
      }
      input {
        border: solid 1px #ccc;
        height: 45px;
        padding: 0 10px;
        &:focus {
          padding: 0 10px;
        }
      }
      button {
        background: var(--color-121212);
        height: 45px;
        line-height: 45px;
      }
    }
    .h3 {
      font-family: @font-Ivy-Mode-400;
      font-size: 24px;
      line-height: 30px;
      color: var(--color-121212);
      text-transform: none;
      margin-bottom: 20px;
    }
    form {
      position: relative;
      display: flex;
      align-items: center;
      div {
        display: inline-block;
      }
      .az-button {
        width: 120px;
        height: 40px;
        line-height: 40px;
        font-family: @font-Ivy-Mode-400;
        margin-left: 10px;
      }
      &.form-flash-sale {
        margin-left: 51px;
      }
      > label {
        margin-left: 10px;
        position: relative;
      }
      .required-prompt {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: @theme-color;
      }
      /deep/ .az-select-main {
        border-color: #050708;
        background: @theme-bridal;
        > .az-icon {
          width: 8px;
        }
        .az-select-options {
          border-color: #050708;
          background: @theme-bridal;
        }
      }
    }
    input::-ms-clear {
      display: none;
    }
    input {
      width: 245px;
      height: 40px;
      line-height: 14px;
      color: #666;
      outline: none;
      padding: 0 6px 0 6px;
      background: @border-color;
      border: solid 1px #050708;
      box-sizing: border-box;
      &:focus {
        padding: 10px 5px;
      }
      &::placeholder {
        text-transform: uppercase;
        color: var(--color-999999);
      }
      &.error {
        border: solid 1px #f00;
        background: var(--color-f9f9f9);
        padding: 10px 5px;
      }
    }
    button {
      // position: absolute;
      padding: 0;
      width: 120px;
      height: 40px;
      overflow: hidden;
      line-height: 40px;
      border: none;
      color: #ffffff;
      background-color: var(--color-121212);
    }
    .error-tip {
      color: #f00;
      font-style: normal;
      padding: 7px 0 9px;
      text-transform: none;
      position: absolute;
    }
    .loading {
      display: none;
      width: 16px;
      height: 16px;
      position: absolute;
      top: 12px;
      right: 12px;
    }
  }
  .footer-subscribe-flash-sale {
    background-color: #ffdfe1;
  }
  .idx-footer-sub {
    position: relative;
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
    }
    .email-icon {
      width: 24px;
      height: 17px;
      margin: 10px;
      background: url('~assets/images/index/email_icon@1x.png') no-repeat;
    }
    p {
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      font-family: @font-family-500, sans-serif;
      text-transform: uppercase;
      color: rgba(51, 51, 51, 1);
    }
  }
}
</style>
