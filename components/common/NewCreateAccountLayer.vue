<template>
  <az-popup-layer :z-index="16" :title="nl('page_login_regist')" @close="createAccountClose" height="auto">
    <div class="create-account-layer">
      <create-account :source="source" @toSignIn="toLogin" :belong="'dialog'"></create-account>
    </div>
  </az-popup-layer>
</template>

<script>
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import CreateAccount from '@/components/user/CreateAccount'
export default {
  name: 'NewCreateAccountLayer',
  languageKeys: ['page_login_regist', ...CreateAccount.languageKeys],
  components: {
    AzPopupLayer,
    CreateAccount
  },
  props: {
    source: {
      type: String,
      default: ''
    }
  },
  methods: {
    createAccountClose() {
      if (this.registScene.key === 'david_bridal') {
        this.buryPoint(this, 'event', {
          ec: 'signup',
          el: 'close',
          ea: 'click'
        })
      }
      this.$emit('close')
    },
    toLogin() {
      this.$emit('close')
      this.$emit('toSign')
    }
  }
}
</script>

<style lang="less" scoped>
.create-account-layer {
  /deep/ .fs-content {
    .control-group {
      position: relative;
      &:nth-child(1) label {
        margin-top: 0;
      }
    }
    .loading-btn {
      background: #666 !important;
    }
    .data-picker-box {
      display: block;
      width: 100%;
      height: 40px;
      /deep/ .mx-input {
        width: 100%;
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
      margin: 10px 0 5px;
    }
    input[type='text'],
    input[type='password'],
    input[type='email'] {
      width: 100%;
      height: 40px;
      box-sizing: border-box;
    }
    .wedding_date {
      width: 256px;
    }
    select {
      width: 276px;
      height: 28px;
      line-height: 28px;
    }
    .btn-user-form {
      width: 100%;
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
        color: @theme;
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
    .tip-terms-and-policy {
      margin-top: 15px;
      a {
        color: @theme;
        text-decoration: underline;
        margin: 0;
        float: none;
        font-weight: normal;
      }
    }
    .email-domain-box {
      position: absolute;
      left: 0;
      top: 62px;
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
  }
  /deep/ .az-email-domain-box {
    max-height: 250px;
  }
}
</style>
