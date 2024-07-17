<template>
  <az-popup-layer :z-index="16" :title="nl('page_reset_desc')" @close="$emit('close')" width="418px" height="374px">
    <div class="forget-password-layer">
      <forget-password @toCreateAccount="toCreate" @close="$emit('close')" :belong="'dialog'"></forget-password>
    </div>
  </az-popup-layer>
</template>

<script>
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import ForgetPassword from '@/components/user/ForgetPassword'
export default {
  name: 'NewForgetPassword',
  languageKeys: ['page_reset_desc', ...ForgetPassword.languageKeys],
  components: {
    AzPopupLayer,
    ForgetPassword
  },
  methods: {
    toCreate() {
      this.$emit('close')
      this.$emit('toCreateAccount')
    }
  }
}
</script>

<style lang="less" scoped>
.forget-password-layer {
  /deep/ .fs-content {
    padding: 30px 50px 0 50px;
    .control-group {
      position: relative;
    }
    // .btn-success {
    //   background: var(--color-121212);
    //   color: #fff;
    //   border: none;
    //   text-transform: uppercase;
    // }
    .loading-btn {
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
      width: 256px;
    }
    select {
      width: 276px;
      height: 28px;
      line-height: 28px;
    }
    .btn-user-form {
      width: 100%;
      // padding: 12px 10px;
      // font-weight: 600;
      // letter-spacing: 1px;
    }
    form .btn-user-form {
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
      margin-bottom: 30px;
    }
  }
}
</style>
