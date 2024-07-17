<template>
  <az-popup-layer :lockScroll="true" :z-index="16" :title="nl('page_login_sign_in')" @close="signLayerClose" width="836px" height="543px">
    <div class="sign-layer-box">
      <sign-in :source="source" @layerToCreate="toCreateAccount" @layerToForget="toForget" :belong="'dialog'"></sign-in>
    </div>
  </az-popup-layer>
</template>

<script>
import SignIn from '@/components/user/SignIn'
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
// import { mapState } from 'vuex'

/**
 * 登录弹框组件
 * 弹出展示登录注册功能
 */
export default {
  name: 'NewSignLayer',
  languageKeys: ['page_login_sign_in', ...SignIn.languageKeys],
  components: {
    AzPopupLayer,
    SignIn
  },
  props: {
    source: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.setDataLayer({
      action: 'view',
      category: 'PC_GuestCheckout',
      label: 'PCB_PopupSignIn_View'
    })
  },
  methods: {
    toCreateAccount() {
      this.setDataLayer({
        action: 'click',
        category: 'PC_GuestCheckout',
        label: 'PCB_CreateAccount_Click'
      })
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
    width: 736px;
    padding: 30px 49px 0 49px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    // .btn-theme {
    //   background: var(--color-121212);
    //   color: #fff;
    //   border: none;
    //   text-transform: uppercase;
    // }
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
          border-bottom: 1px solid @theme;
        }
      }
    }
    .fsc-right {
      padding: 0 0 117px 50px;
      width: 318px;
      border-left: solid 1px #ccc;
      p,
      li {
        line-height: 16px;
      }
      p {
        margin: 20px 0 30px;
      }
      ul {
        padding-top: 15px;
      }
      li {
        svg {
          // font-size: 12px;
        }
        p {
          display: inline-block;
          margin: 0;
          margin-left: 3px;
        }
        &:nth-child(1) {
          margin-top: 0;
        }
        &:last-of-type {
          margin-bottom: 0;
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
      margin-top: 15px;
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
      margin: 10px 0 5px;
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
      // padding: 12px 10px;
      // font-weight: 600;
      // letter-spacing: 1px;
    }
    // form .btn-user-form {
    //   margin-top: 15px;
    // }
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

    a {
      color: var(--color-121212);
      &:hover {
        color: @theme !important;
      }
    }

    input.wedding_date {
      background: #fff url(~assets/images/wedding-date-icon_20190129.png) right 10px no-repeat;
    }
  }
}
</style>
