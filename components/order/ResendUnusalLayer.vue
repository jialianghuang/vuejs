<template>
  <div>
    <az-popup-layer :zIndex="12" @close="closeLayer()" width="auto" height="auto" class="resend-unusal-dialog">
      <div class="resend-unusal-dialog-content">
        <div v-html="nl('page_order_gift_card_resend_unusal_tips')" class="txt"></div>
        <az-button @click="closeLayer()" :text="nl('page_common_confirm')" class="btn"></az-button>
        <div v-html="nl('page_order_gift_card_resend_customer_txt')" class="customer-box"></div>
      </div>
    </az-popup-layer>
  </div>
</template>

<script>
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import AzButton from '@/components/az-ui/AzButton'

export default {
  name: 'ResendUnusalLayer',
  components: {
    AzPopupLayer,
    AzButton
  },
  props: {},
  data() {
    return {}
  },
  methods: {
    closeLayer() {
      this.$store.commit('order/setResendUnusalLayerShow', false)
    }
  }
}
</script>

<style lang="less" scoped>
.resend-unusal-dialog {
  .resend-unusal-dialog-content {
    width: 365px;
    text-align: center;
    .txt {
      font-size: 13px;
      line-height: 22px;
      color: var(--color-121212);
    }
    .btn {
      width: 100%;
      font-size: 14px;
      line-height: 19px;
      padding: 10.5px 10px;
      font-family: @font-family-600;
      margin: 20px 0 15px;
      text-transform: uppercase;
      box-sizing: border-box;
    }
    .customer-box {
      font-size: 14px;
      line-height: 22px;
      color: var(--color-121212);
      /deep/a {
        text-decoration: underline;
        color: var(--color-121212) !important;
      }
    }
  }
}
</style>
