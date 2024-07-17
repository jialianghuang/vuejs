<template>
  <az-popup-layer :zIndex="12" @close="handleClose()" :width="'365px'" height="auto">
    <div class="gift-card-verify-content">
      <h3>{{ nl('page_gfit_card_verify_title') }}</h3>
      <p>{{ nl('page_gfit_card_verify_resend_desc', null, { toEmail: userInfoEmail }) }}</p>
      <h4>{{ nl('page_gift_card_enter_ptp') }}</h4>
      <input v-model="giftCardverifyCode" type="text" />
      <az-button @click="handleSubmit" class="btn btn-default">
        {{ submitFlag ? `${nl('page_order_progress_processing')}...` : nl('page_common_continue') }}
      </az-button>
      <span @click="handleResend">{{ nl('page_gift_card_resend_ptp') }}</span>
    </div>
  </az-popup-layer>
</template>

<script>
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import AzButton from '@/components/az-ui/Button/AzButton'
export default {
  name: 'PopupGiftCardVerify',
  components: {
    AzPopupLayer,
    AzButton
  },
  props: {},
  data() {
    return {
      submitFlag: false,
      giftCardverifyCode: ''
    }
  },
  created() {
    this.handleResend('default')
  },
  methods: {
    handleClose() {
      this.$store.commit('giftCard/setPopupGiftCardVerifyShow', false)
    },
    // 提交验证码
    handleSubmit() {
      if (!this.giftCardverifyCode) {
        alert(this.nl('page_gift_card_verify_code_is_empty'))
        return
      }
      this.submitFlag = true
      this.$emit('handleVerifySubmit', this.giftCardverifyCode)
    },
    // 重新获取验证码
    handleResend(type) {
      this.$axios.$get('/1.0/user/verification-code').then((res) => {
        // 弹框出现时，默认发送一次验证码，不做提示
        if (type == 'default') return
        if (res.code == 0) {
          alert(this.nl('page_gift_card_verify_code_resend_success'))
        } else {
          alert(res.msg)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .az-popup-box {
  min-width: unset;
}
.btn {
  cursor: pointer;
}
.gift-card-verify-content {
  width: 365px;
  background: #ffffff;
  h3 {
    font-family: @font-family-600;
    font-size: 14px;
  }
  h4 {
    font-family: @font-family-600;
    font-size: 13px;
    margin-top: 10px;
  }
  p {
    margin-top: 10px;
  }
  input {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    margin-top: 10px;
  }
  .btn {
    width: 100%;
    margin-top: 15px;
  }
  span {
    margin-top: 15px;
    text-decoration: underline;
    display: block;
    text-align: center;
    cursor: pointer;
  }
}
</style>
