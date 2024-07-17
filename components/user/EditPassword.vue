<template>
  <form id="password_form" onsubmit="return false" name="password_form" autocomplete="off">
    <password-input
      ref="OLD_PASSWORD"
      @submit="resetButtonEvent"
      @toForget="toForget"
      :tabindex="'1'"
      :rules="'type2'"
      :placeholder="nl('page_user_current_password')"
      :requiredText="nl('page_js_err_enter_old')"
    ></password-input>
    <password-input
      ref="PASSWORD"
      @submit="resetButtonEvent"
      :id="'new_password'"
      :hasForget="false"
      :tabindex="'3'"
      :rules="'type2'"
      :placeholder="nl('page_user_new_password')"
      :requiredText="nl('page_js_err_enter_new')"
    ></password-input>
    <password-input
      ref="PASSWORD_AGAIN"
      @submit="resetButtonEvent"
      :id="'password_again'"
      :hasForget="false"
      :tabindex="'4'"
      :placeholder="nl('page_user_reenter_new_password').replace(':', '')"
      :requiredText="nl('page_js_err_reenter_new')"
    ></password-input>
    <az-button :loading="loading" :disabled="loading" :needIcon="false" @click="resetButtonEvent" class="btn btn-default" tabindex="5">{{
      loading ? `${nl('page_order_progress_processing')}...` : nl('page_user_save_changes')
    }}</az-button>
  </form>
</template>

<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import PasswordInput from '@/components/user/PasswordInput'
export default {
  name: 'EditPassword',
  components: {
    AzButton,
    PasswordInput
  },
  data() {
    return {
      password: '',
      newPassword: '',
      newPasswordConfirm: '',
      loading: false
    }
  },
  mounted() {
    document.querySelector('#_password').focus()
  },
  methods: {
    resetButtonEvent(e) {
      let hasError = false
      if (this.loading) {
        return false
      }
      this.password = this.$refs.OLD_PASSWORD.password
      this.newPassword = this.$refs.PASSWORD.password
      this.newPasswordConfirm = this.$refs.PASSWORD_AGAIN.password
      // this.$refs[...].validateEvent() 返回false 检验未通过
      if (!this.$refs.OLD_PASSWORD.validateEvent() | !this.$refs.PASSWORD.validateEvent() | !this.$refs.PASSWORD_AGAIN.validateEvent()) {
        hasError = true
      }
      if (this.newPasswordConfirm && this.newPassword && this.newPasswordConfirm != this.newPassword) {
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
      formData.append('action', 'update')
      formData.append('password', this.password)
      formData.append('new_password', this.newPassword)
      formData.append('new_password_confirm', this.newPasswordConfirm)
      this.retentionReject()
      this.$axios
        .$post(`/1.0/user/password`, formData)
        .then((data) => {
          this.loading = false
          if (data.code == 0) {
            alert(data.msg)
            this.password = this.$refs.OLD_PASSWORD.password = ''
            this.newPassword = this.$refs.PASSWORD.password = ''
            this.newPasswordConfirm = this.$refs.PASSWORD_AGAIN.password = ''
          } else {
            this.$refs.OLD_PASSWORD.rulesResult.password = data.msg
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error)
        })
    },
    toForget() {
      location.href = this.countryUrl('/user/login?forget_password')
    }
  }
}
</script>

<style lang="less" scoped>
#password_form {
  width: 367px;
  margin: 0 auto;
  /deep/ #forgotPwd {
    color: var(--color-121212);
    text-decoration: underline;
    cursor: pointer;
    position: absolute;
    bottom: -23px;
    right: 0;
    z-index: 5;
    &:hover {
      color: @theme;
      // border-bottom: 1px solid @theme;
    }
  }
  /deep/ #new_password {
    margin-top: 23px;
  }
  /deep/ .control-group {
    position: relative;
    margin-bottom: 20px;
    label {
      display: inline-block;
      width: 160px;
      line-height: 28px;
      vertical-align: top;
      font-family: @font-family-600, sans-serif;
      white-space: nowrap;
      padding-right: 10px;
    }
    input {
      box-sizing: border-box;
      width: 367px;
      height: 40px;
      border-color: var(--color-cccccc);
      padding-left: 10px;
      &::placeholder {
        color: #999;
        text-transform: capitalize;
      }
      &:focus {
        background-color: #fff;
        border-color: var(--color-121212);
      }
    }
  }
  button {
    min-width: 184px;
    font-family: @font-family-600;
    font-size: 14px;
    line-height: 18px;
    height: 40px;
    line-height: 40px;
    padding: 0 18px;
  }
  .btn-default {
    background: var(--color-121212);
    border: 1px solid var(--color-121212);
    color: #fff;
    text-transform: uppercase;
  }
  .submit-loading {
    background: #666 !important;
  }
  /deep/ .control-group.error {
    /deep/ .mx-input {
      border-color: #f00 !important;
    }
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
  /deep/ .help-block,
  /deep/ .help-inline {
    color: #555;
    display: block;
  }
  /deep/ .help-block {
    margin-bottom: 9px;
    font-size: @font-size-small;
    color: #666;
  }
  /deep/ .help-inline {
    margin-top: 3px;
  }
  /deep/ .control-group.error {
    .help-inline,
    .help-block {
      color: #f00;
    }
    input {
      border-color: #f00 !important;
    }
  }
  /deep/ .error {
    padding: 0;
    background: none;
    border: none;
    width: auto;
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
  .btn-default.active,
  .btn-default:active,
  .btn-default:focus,
  .btn-default:hover {
    background: var(--color-1e1e1e);
    border-color: var(--color-1e1e1e);
  }
  .btn-default {
    &[disabled],
    &[disabled]:hover,
    &.disabled,
    &.disabled:hover {
      background-color: #666;
      border: solid 1px #666;
    }
  }
}
</style>
