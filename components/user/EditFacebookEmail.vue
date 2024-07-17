<template>
  <form id="email_form" onsubmit="return false" name="email_form" autocomplete="off">
    <div class="control-group error">
      <span class="help-block">{{ signResultMsg }}</span>
    </div>
    <div id="change-email" class="change-pwd">
      <div class="control-group">
        <label>{{ nl('page_email_curr_noti') }}</label>
        <span class="user_email">{{ userInfoEmail }}</span>
      </div>
      <email-input ref="EMAIL" @submit="newEmaliSubmit(e)" :tabindex="'1'" :labelText="nl('page_email_new_noti')"></email-input>
      <div class="change-note-fac">
        <span class="note-title">{{ nl('page_email_note') }}</span>
        {{ nl('page_update_your_email') }}
      </div>
    </div>
    <az-button :loading="loading" :disabled="loading" :needIcon="false" @click="newEmaliSubmit" class="btn btn-default" tabindex="2">{{
      loading ? `${nl('page_order_progress_processing')}...` : nl('page_user_save_changes')
    }}</az-button>
  </form>
</template>

<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import EmailInput from '@/components/user/EmailInput'
import { mapState } from 'vuex'
export default {
  name: 'EditMyFacebookEmail',
  components: {
    AzButton,
    EmailInput
  },
  data() {
    return {
      email: '',
      loading: false,
      signResultMsg: ''
    }
  },
  computed: {
    ...mapState('userInfo', ['userInfoEmail'])
  },
  mounted() {
    // mock
    this.$store.commit('userInfo/setEmail', 'Zli@tetx.com')
  },
  methods: {
    newEmaliSubmit(e) {
      if (this.loading) {
        return false
      }
      const validateResult = !this.$refs.EMAIL.validateEvent()
      if (validateResult) {
        return false
      }
      this.email = this.$refs.EMAIL.email
      this.loginAxios()
    },
    loginAxios() {
      this.loading = true
      const formData = new FormData()
      formData.append('email', this.userInfoEmail)
      formData.append('new_email', this.email)
      this.retentionReject()
      this.$axios
        .$post(`/1.0/user/update-email`, formData)
        .then((data) => {
          if (data.error == 0) {
            this.setDataLayer({
              event: 'CustomTrackEvent',
              eventCategory: 'webtracking',
              eventAction: 'signup_success',
              eventLabel: 'signup'
            })
            location.reload()
          } else {
            this.loading = false
            this.signResultMsg = data.msg
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
#email_form {
  width: 624px;
  span.user_email {
    line-height: 28px;
  }
  /deep/ .control-group {
    position: relative;
    margin-bottom: 16px;
    label {
      display: inline-block;
      width: 215px;
      line-height: 28px;
      vertical-align: top;
      font-family: @font-family-600, sans-serif;
      white-space: nowrap;
      padding-right: 10px;
    }
    input {
      box-sizing: border-box;
      width: 276px;
      height: 40px;
      border-color: var(--color-cccccc);
    }
    .email-domain-box {
      position: absolute;
      left: 191px;
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
    margin-left: 191px;
    font-size: 14px;
    line-height: 20px;
    margin-top: 4px;
  }
  .btn-default {
    background: var(--color-e3bda1);
    border: 1px solid var(--color-e3bda1);
    color: #fff;
    text-transform: uppercase;
    padding: 7px 18px;
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
    margin-left: 228px;
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
    width: 464px;
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
    background: var(--color-121212);
    border-color: var(--color-121212);
  }
}
</style>
