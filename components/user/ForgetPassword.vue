<template>
  <div class="forget-password-box fs-content">
    <p class="send-tip">{{ nl('page_reset_detail') }}</p>
    <form id="form_pwd" onsubmit="return false" name="form_pwd" autocomplete="off">
      <div v-show="resultMsg" class="control-group error">
        <span class="help-block">{{ resultMsg }}</span>
      </div>
      <email-input
        ref="EMAIL"
        @submit="resetButtonEvent"
        @focus="resultMsg = ''"
        :tabindex="'1'"
        :validatorTxt="nl('page_login_check_email_format')"
      ></email-input>
      <az-button
        :loading="loading"
        :disabled="loading"
        :needIcon="false"
        @click="resetButtonEvent"
        class="btn btn-success btn-user-form"
        tabindex="2"
        >{{ loading ? `${nl('page_order_progress_processing')}...` : nl('page_reset_reset') }}</az-button
      >
      <p class="to-login">
        {{ nl('page_reset_ques') }}<a @click="toCreate" href="javascript:void(0)" class="js-switch">{{ nl('page_reset_regist') }}</a>
      </p>
    </form>
  </div>
</template>

<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import EmailInput from '@/components/user/EmailInput'
export default {
  name: 'ForgetPassword',
  languageKeys: [
    'page_reset_detail',
    'page_login_check_email_format',
    'page_order_progress_processing',
    'page_reset_reset',
    'page_reset_ques',
    'page_reset_regist',
    'page_js_email_sent',
    ...EmailInput.languageKeys
  ],
  components: {
    AzButton,
    EmailInput
  },
  props: {
    belong: {
      type: String,
      default: 'page'
    }
  },
  data() {
    return {
      email: '',
      resultMsg: '',
      loading: false
    }
  },
  methods: {
    toCreate() {
      this.$emit('toCreateAccount')
    },
    resetButtonEvent(e) {
      if (this.loading) {
        return false
      }
      if (!this.$refs.EMAIL.validateEvent()) {
        return false
      }
      this.email = this.$refs.EMAIL.email
      this.resetAxios()
    },
    resetAxios() {
      this.retentionReject()
      this.loading = true
      const formData = new FormData()
      formData.append('action', 'forget')
      formData.append('email', this.email)
      this.$axios
        .$post(`/1.0/user/password`, formData)
        .then((data) => {
          if (data.code == 0) {
            alert(this.nl('page_js_email_sent'))
            if (this.belong == 'dialog') {
              this.$emit('close')
            } else {
              location.href = this.countryUrl('/user/login')
            }
          } else {
            this.resultMsg = data.msg
            this.loading = false
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.fs-content {
  width: 318px;
  padding: 50px 0 150px;
  margin: 0 auto;
}
.forget-password-box {
  .control-group {
    position: relative;
  }
  .submit-loading {
    background: #666 !important;
  }
  .data-picker-box {
    display: block;
    width: 276px;
    height: 40px;
    /deep/ .mx-input {
      display: block;
      height: 40px;
      border-radius: 0;
      border: 1px solid @border-color !important;
    }
  }
  .control-group.error {
    /deep/ .mx-input {
      border-color: #f00 !important;
    }
  }
  label,
  input,
  select,
  textarea {
    display: block;
  }
  label {
    margin: 10px 0 4px;
  }
  input[type='text'],
  input[type='password'],
  input[type='email'] {
    width: 306px;
    height: 18px;
  }
  .wedding_date {
    width: 318px;
  }
  select {
    width: 276px;
    height: 28px;
    line-height: 28px;
  }
  .btn-user-form {
    margin-top: 30px !important;
  }
  .btn-large {
    width: 232px;
    padding: 12px 10px;
    font-weight: 600;
    letter-spacing: 1px;
  }
  form .btn-large {
    margin-top: 25px;
  }
  .help-block,
  .help-inline {
    color: #555;
    display: block;
  }
  .help-block {
    margin-bottom: 9px;
    font-size: @font-size-small;
    color: #666;
  }
  .help-inline {
    margin-top: 3px;
  }
  .wedding_date {
    position: relative;
  }
  .control-group.error {
    .help-inline,
    .help-block {
      color: #f00;
    }
  }
  .error {
    padding: 0;
    background: none;
    border: none;
    width: auto;
  }
  .waiting {
    position: absolute;
    left: 280px;
    top: 30px;
    padding: 5px 30px 5px 0;
    height: 16px;
    background: url(~assets/images/loading_s16.gif) no-repeat 10px 4px;
  }
  h3 {
    text-transform: uppercase;
    font-family: @font-family-600, sans-serif;
  }

  a {
    color: var(--color-121212);
    &:hover {
      color: @theme !important;
    }
  }

  input.wedding_date {
    background: #fff url(~assets/images/wedding-date-icon_20190129.png) right 10px no-repeat;
  }
  .to-login {
    margin: 15px 0 15px;
    a {
      color: var(--color-121212);
    }
  }
  .term-policy {
    font-size: 11px;
  }
  .email-domain-box {
    position: absolute;
    left: 0;
    top: 60px;
    z-index: 10;
    width: 100%;
    max-height: 284px;
    font-size: 13px;
    background: #fff;
    color: var(--color-121212);
    box-sizing: border-box;
    border: 1px solid #4b83af;
    .title {
      padding: 0 5px;
      font-family: @font-family-600, sans-serif;
      line-height: 20px;
    }
    .domian-item {
      padding: 0 5px;
      font-family: @font-family-500;
      line-height: 22px;
      cursor: pointer;
      span {
        color: #666;
      }
      &:hover {
        color: #fff;
        span {
          color: #fff;
        }
        background-color: #4b83af;
      }
    }
  }
  .send-tip {
    margin-bottom: 30px;
  }
}
</style>
