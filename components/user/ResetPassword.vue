<template>
  <div class="forget-password-box fs-content">
    <p class="send-tip">{{ nl('page_forgotpswd_enter_confirm_new') }}</p>
    <form id="form_pwd" onsubmit="return false" name="form_pwd" autocomplete="off">
      <div v-show="resultMsg" class="control-group error">
        <span class="help-block">{{ resultMsg }}</span>
      </div>
      <password-input
        ref="PASSWORD"
        @submit="resetButtonEvent"
        @focus="resultMsg = ''"
        :hasForget="false"
        :tabindex="'1'"
        :rules="'type2'"
        :labelText="nl('page_user_new_password')"
      ></password-input>
      <password-input
        ref="PASSWORD_AGAIN"
        @submit="resetButtonEvent"
        @focus="resultMsg = ''"
        :id="'password_again'"
        :hasForget="false"
        :tabindex="'2'"
        :rules="'type2'"
        :labelText="nl('page_user_reenter_new_password')"
      ></password-input>
      <az-button
        :loading="loading"
        :disabled="loading"
        :needIcon="false"
        @click="resetButtonEvent"
        class="btn btn-success btn-user-form"
        tabindex="3"
        >{{ loading ? `${nl('page_order_progress_processing')}...` : nl('page_forgotpassword_new_submit') }}</az-button
      >
    </form>
  </div>
</template>

<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import PasswordInput from '@/components/user/PasswordInput'
export default {
  name: 'ResetPassword',
  components: {
    AzButton,
    PasswordInput
  },
  props: {
    resetPasswordData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      password: '',
      passwordAgain: '',
      resultMsg: '',
      loading: false
    }
  },
  methods: {
    resetButtonEvent() {
      let hasError = false
      if (this.loading) {
        return false
      }
      this.password = this.$refs.PASSWORD.password
      this.passwordAgain = this.$refs.PASSWORD_AGAIN.password
      // this.$refs[...].validateEvent() 返回false 检验未通过
      if (!this.$refs.PASSWORD.validateEvent() | !this.$refs.PASSWORD_AGAIN.validateEvent()) {
        hasError = true
      }
      if (this.passwordAgain && this.password && this.passwordAgain != this.password) {
        this.$refs.PASSWORD_AGAIN.rulesResult.password = this.nl('page_register_pwd_not_match')
        hasError = true
      }
      if (hasError) {
        return false
      }
      this.resetAxios()
    },
    resetAxios() {
      this.loading = true
      const formData = new FormData()
      formData.append('action', 'reset')
      formData.append('token', this.resetPasswordData.token)
      formData.append('email', this.resetPasswordData.email)
      formData.append('password', this.password)
      formData.append('password_confirm', this.passwordAgain)
      this.retentionReject()
      this.$axios
        .$post(`/1.0/user/password`, formData)
        .then((data) => {
          if (data.code == 0) {
            alert(data.msg)
            location.href = this.countryUrl('/user/login')
          } else {
            this.loading = false
            this.resultMsg = data.msg
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
  width: 276px;
  padding: 20px 0 150px;
  margin: 0 auto;
}
.forget-password-box {
  .control-group {
    position: relative;
  }
  .btn-success {
    background: var(--color-121212);
    color: #fff;
    border: none;
    text-transform: uppercase;
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
    width: 264px;
    height: 18px;
  }
  .wedding_date {
    width: 256px;
  }
  select {
    width: 276px;
    height: 28px;
    line-height: 28px;
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
    margin: 20px 0 15px;
    a {
      color: var(--color-121212);
    }
  }
  .term-policy {
    font-size: 11px;
  }
  .password-domain-box {
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
      font-family: @font-family-500, sans-serif;
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
    margin-bottom: 25px;
  }
}
</style>
