<template>
  <form id="email_form" onsubmit="return false" name="email_form" autocomplete="off">
    <div class="email-info">
      <label>{{ nl('page_email_curr_mail') }}</label>
      <span class="user_email">{{ myEmail }}</span>
    </div>
    <email-input
      ref="EMAIL"
      @submit="newEmaliSubmit"
      @focus="emailFormFocus"
      :tabindex="'1'"
      :placeholder="nl('page_email_new_mail')"
      :requiredTxt="nl('page_js_change_email_check_email')"
      :validatorTxt="nl('page_js_change_email_check_email_new')"
      :readonly="true"
    ></email-input>
    <email-input
      ref="EMAIL_CONFIRM"
      @submit="newEmaliSubmit"
      :tabindex="'2'"
      :id="'email_confirm'"
      :placeholder="nl('page_email_confirm')"
      :requiredTxt="nl('page_js_change_email_check_email')"
      :validatorTxt="nl('page_js_change_email_check_email_new')"
    ></email-input>
    <password-input
      ref="PASSWORD"
      @submit="newEmaliSubmit"
      @toForget="toForget"
      :tabindex="'3'"
      :rules="'type2'"
      :placeholder="nl('page_user_current_password')"
      :requiredText="nl('page_js_change_email_check_password')"
      :readonly="true"
    ></password-input>
    <div class="change-note">
      <span class="note-title">{{ nl('page_email_note') }}</span
      >{{ nl('page_email_note_desc') }}
    </div>
    <az-button :loading="loading" :disabled="loading" :needIcon="false" @click="newEmaliSubmit" class="btn btn-default" tabindex="4">{{
      loading ? `${nl('page_order_progress_processing')}...` : nl('page_user_save_changes')
    }}</az-button>

    <div v-if="emailDialogShow" class="emai_dialog_overlay">
      <az-overlay :zIndex="12">
        <div class="dialog-wrapper">
          <a @click="closeDialog" href="javascript:void(0)" class="dialog-close"></a>
          <div class="emai-dialog-content">
            <div id="emai_succeed_dialog">
              <div class="emai_dialog_container">
                <img src="~/assets/images/checkout/email_success.png" alt="success" />
                <div class="txt">{{ successMsg }}</div>
                <az-button :needIcon="false" @click="closeDialog" class="btn btn-default emai-submit">
                  <span>{{ nl('page_common_ok') }}</span>
                </az-button>
              </div>
            </div>
          </div>
        </div>
      </az-overlay>
    </div>
  </form>
</template>

<script>
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
import AzButton from '@/components/az-ui/Button/AzButton'
import EmailInput from '@/components/user/EmailInput'
import PasswordInput from '@/components/user/PasswordInput'
import checkEmailDomain from '@/assets/js/checkEmailDomain'
export default {
  name: 'EditMyEmail',
  components: {
    AzOverlay,
    AzButton,
    EmailInput,
    PasswordInput
  },
  mixins: [checkEmailDomain],
  props: {
    myEmail: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      emailDialogShow: false,
      successMsg: '',
      email: '',
      emailConfirm: '',
      password: '',
      loading: false
    }
  },
  methods: {
    newEmaliSubmit() {
      let hasError = false
      if (this.loading) {
        return false
      }
      this.email = this.$refs.EMAIL.email
      this.emailConfirm = this.$refs.EMAIL_CONFIRM.email
      this.password = this.$refs.PASSWORD.password
      // this.$refs[...].validateEvent() 返回false 检验未通过
      if (!this.$refs.EMAIL.validateEvent() | !this.$refs.EMAIL_CONFIRM.validateEvent() | !this.$refs.PASSWORD.validateEvent()) {
        hasError = true
      }
      if (this.emailConfirm && this.email && this.emailConfirm != this.email) {
        this.$refs.EMAIL_CONFIRM.rulesResult.email = this.nl('page_js_change_email_check_same_email')
        hasError = true
      }
      if (hasError) {
        return false
      }
      this.loginAxios()
    },
    loginAxios() {
      this.loading = true
      if (this.emailDomainError) {
        this.needCheckEmailDomain = 0
        this.emailDomainError = false
        this.$refs.EMAIL.rulesResult.email = ''
        this.$refs.EMAIL_CONFIRM.rulesResult.email = ''
      }
      const formData = new FormData()
      formData.append('new_email', this.email)
      formData.append('new_email_confirm', this.emailConfirm)
      formData.append('password', this.password)
      formData.append('is_check_email_suffix', this.needCheckEmailDomain)
      this.retentionReject()
      this.$axios
        .$post(`/1.0/user/email`, formData)
        .then((data) => {
          this.loading = false
          if (data.code == 100210) {
            this.emailDomainError = true
            this.$refs.EMAIL.rulesResult.email = data.msg
            this.$refs.EMAIL_CONFIRM.rulesResult.email = data.msg
            return
          }
          this.trackGA4NewEmail(this.email, 'edit_email', null, true)
          if (data.code == 0) {
            // alert(data.msg)
            this.successMsg = data.msg
            this.emailDialogShow = true
            // location.reload()
          } else {
            this.$refs.EMAIL.rulesResult.email = ''
            this.$refs.EMAIL_CONFIRM.rulesResult.email = ''
            this.$refs.PASSWORD.rulesResult.password = data.msg
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error)
        })
    },
    closeDialog() {
      this.emailDialogShow = false
      location.reload()
    },
    toForget() {
      location.href = this.countryUrl('/user/login?forget_password')
    },
    emailFormFocus() {
      this.$refs.EMAIL_CONFIRM.rulesResult.email = ''
      this.initEmailCheckDomain()
    }
  }
}
</script>

<style lang="less" scoped>
#email_form {
  width: 367px;
  margin: 0 auto;
  .email-info {
    span {
      font-family: @font-family-500;
    }
    padding-bottom: 20px;
    line-height: 18px;
    height: 18px;
  }
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
  /deep/ .control-group {
    position: relative;
    margin-bottom: 20px;
    label {
      display: inline-block;
      width: 178px;
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
    .email-domain-box {
      position: absolute;
      left: 0;
      top: 40px;
      z-index: 10;
      width: 276px;
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
  }
  button {
    min-width: 184px;
    font-family: @font-family-500;
    font-size: 14px;
    line-height: 18px;
    margin-top: 20px;
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
    // margin-left: 191px;
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
      border-color: #f00;
    }
  }
  /deep/ .error {
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
  .change-note {
    margin-top: 43px;
  }

  .change-note-fac {
    width: 508px;
  }

  .change-note,
  .change-note-fac {
    .note-title {
      color: @theme;
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

  .emai_dialog_overlay {
    .dialog-wrapper {
      position: relative;
      width: 320px;
      background: #ffffff;
      .dialog-close {
        position: absolute;
        top: -12px;
        right: -12px;
        display: block;
        width: 24px;
        height: 24px;
        background: data-uri('~assets/images/icon-close.png') 0 no-repeat;
        background-size: cover;
      }
      .emai-dialog-content {
        width: 100%;
        height: 100%;
        text-align: center;
        box-sizing: border-box;
        img {
          width: 280px;
          filter: grayscale(1);
        }
      }
      .txt {
        color: var(--color-121212);
        font-size: 13px;
        margin-top: 15px;
        padding: 0 20px;
      }
      .emai-submit {
        margin-top: 20px;
        margin-bottom: 30px;
        margin-left: 0;
        width: 170px;
        height: 40px;
      }
    }
  }
}
</style>
