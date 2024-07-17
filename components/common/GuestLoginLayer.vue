<template>
  <az-popup-layer :lockScroll="true" :z-index="12" :title="nl('page_login_sign_in')" @close="signLayerClose" width="318px" height="auto">
    <div class="sign-layer-box">
      <guest-login
        :source="source"
        @layerToCreate="toCreateAccount"
        @layerToForget="toForget"
        @close="signLayerClose"
        :belong="'dialog'"
      ></guest-login>
    </div>
  </az-popup-layer>
</template>

<script>
import GuestLogin from '@/components/user/GuestLogin'
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
// import { mapState } from 'vuex'
export default {
  name: 'GuestLoginLayer',
  languageKeys: ['page_login_sign_in', ...GuestLogin.languageKeys],
  components: {
    AzPopupLayer,
    GuestLogin
  },
  props: {
    source: {
      type: String,
      default: ''
    }
  },
  methods: {
    toCreateAccount() {
      this.$emit('close')
      this.$emit('toCreateAccount')
    },
    signLayerClose() {
      this.$emit('close')
    },
    toForget() {
      this.$emit('close')
      this.$emit('toForget')
    }
  }
}
</script>

<style lang="less" scoped>
.sign-layer-box {
  /deep/ .fs-content {
    width: 318px;
    .loading-btn {
      background: #666 !important;
    }
    .control-group {
      position: relative;
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
    .fsc-left {
      width: 318px;
      #forgotPwd {
        outline: none;
        color: var(--color-121212);
        cursor: pointer;
        margin-top: 10px;
        display: block;
        float: right;
        border-bottom: 1px solid var(--color-121212);
        &:hover {
          color: var(--color-121212);
          border-bottom: 1px solid var(--color-121212);
        }
      }
      .fb-login-box {
        .bottom {
          margin-top: 45px;
        }
      }
    }
    .fsc-right {
      // padding: 0 0 22px 50px;
      width: 318px;
      // border-left: solid 1px #ccc;
      p,
      li {
        line-height: 16px;
      }
      p {
        margin: 15px 0 25px;
      }
      ul {
        padding-top: 17px;
      }
      li {
        margin: 3px 0 5px;
        &:before {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: url(~assets/images/a_sprite_l_20190128.png) no-repeat -227px 0;
          content: '';
          margin: 4px 9px 0 2px;
          vertical-align: top;
        }
      }
      .btn-user-form {
        margin-top: 0;
      }
    }
    .fb-login {
      margin: 15px 0 45px;
      height: 22px;
      overflow: hidden;
    }
    .tip-terms-and-policy {
      margin-top: 25px;
      a {
        color: @theme;
        text-decoration: underline;
        margin: 0;
        float: none;
        font-weight: normal;
      }
    }
    label,
    input,
    select,
    textarea {
      display: block;
    }
    label {
      margin: 15px 0 5px;
    }
    input[type='text'],
    input[type='password'],
    input[type='email'] {
      width: 306px;
      height: 18px;
    }
    select {
      width: 276px;
      height: 28px;
      line-height: 28px;
    }
    .btn-user-form {
      width: 100%;
      margin-top: 15px;
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
      display: none;
      position: relative;
      left: 280px;
      top: -27px;
      padding: 5px 30px 5px 0;
      height: 16px;
      background: url(~assets/images/loading_s16.gif) no-repeat 10px 4px;
    }
    h3 {
      text-transform: uppercase;
      font-family: @font-family-600, sans-serif;
    }

    input.wedding_date {
      background: #fff url(~assets/images/wedding-date-icon_20190129.png) right 10px no-repeat;
    }
  }
}
</style>
