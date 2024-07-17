<template>
  <div id="ca-payment-dialog" v-if="caPaymentDialogShow">
    <div class="dialog-bg">
      <div class="submit_img">
        <img src="~assets/images/checkout/checkout_loading.gif" alt="loading" />
      </div>
      <div class="submit_text">{{ caPaymentDialogText }}</div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'CaPaymentDialog',
  computed: {
    ...mapState('checkout', ['caPaymentDialogText', 'caPaymentDialogShow'])
  },
  methods: {
    closeDialog() {
      this.$store.commit('checkout/setCaPaymentDialogShow', false)
    }
  }
}
</script>
<style lang="less" scoped>
#ca-payment-dialog {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  .dialog-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 300px;
    height: 160px;
    background: #e6e6e6;
    .submit_img {
      margin-top: 30px;
      text-align: center;
      img {
        width: 48px;
        height: 48px;
        vertical-align: middle;
      }
    }
    .submit_text {
      margin: 22px 50px 0;
      color: var(--color-121212);
      font-size: 13px;
      text-align: center;
      font-family: @font-family-500;
    }
  }
}
</style>
