<template>
  <div class="order-b returned-information">
    <div class="return-status-title">{{ nl('page_orders_return_information') }}</div>
    <div class="returned-information-content">
      <div class="info-item ">
        <h3 class="item-title">{{ nl('page_orders_refund_method') }}:</h3>
        <div class="item-txt">{{ showRefundMethodStr }}</div>
      </div>
      <div class="info-item">
        <h3 class="item-title">{{ nl('page_orders_application_time') }}:</h3>
        <div class="item-txt ">{{ returnApplyInfo.createTime }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReturnedInformation',
  components: {},
  props: {
    returnApplyInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    showRefundMethodStr() {
      let showRefundMethodArr = []
      if (this.returnApplyInfo && this.returnApplyInfo.showRefundMethod) {
        showRefundMethodArr = this.returnApplyInfo.showRefundMethod.map((item) => {
          return item.paymentName
        })
      }
      return showRefundMethodArr.join(' + ')
    }
  }
}
</script>

<style lang="less" scoped>
.returned-information {
  .returned-information-content {
    display: flex;
    padding: 15px;
    .info-item {
      width: 290px;
      font-size: 13px;
      line-height: 18px;
      .item-title {
        font-family: @font-family-600;
        margin-bottom: 10px;
        text-transform: capitalize;
      }
      .item-txt {
        font-family: @font-family-500;
        text-transform: capitalize;
      }
    }
  }
}
</style>
