<template>
  <div class="my-dashboard">
    <div class="my-dashboard-title">
      <span class="title">{{ nl('page_ambassador_dashboard') }}</span>
      <span>{{ nl('page_influencer_last_updated_on') }}: {{ dashboardData.lastUpdateDate }}</span>
    </div>
    <div class="my-dashboard-data grey">
      <div class="my-dashboard-data-item">
        <span class="data-name">{{ nl('page_ambassador_link_clicks') }}</span>
        <span class="data-value">{{ dashboardData.viewCnt }}</span>
      </div>
      <div class="my-dashboard-data-item">
        <span class="data-name">{{ nl('page_influencer_number_of_visitors') }}</span>
        <span class="data-value">{{ dashboardData.viewDeviceCnt }}</span>
      </div>
    </div>
    <div class="my-dashboard-data pink">
      <div class="my-dashboard-data-item">
        <span class="data-name">{{ nl('page_influencer_pending_number_users') }}</span>
        <span class="data-value">{{ dashboardData.pendingPaidUsers }}</span>
      </div>
      <div class="my-dashboard-data-item">
        <span class="data-name">{{ nl('page_influencer_pending_order_quantity') }}</span>
        <span class="data-value">{{ dashboardData.pendingOrderQty }}</span>
      </div>
      <div class="my-dashboard-data-item">
        <span class="data-name">{{ nl('page_influencer_pending_order_amount') }}</span>
        <span class="data-value">{{ dashboardData.pendingOrderAmount }}</span>
      </div>
    </div>
    <div class="my-dashboard-data yellow">
      <div class="my-dashboard-data-item">
        <span class="data-name">{{ nl('page_influencer_valid_number_users') }}</span>
        <span class="data-value">{{ dashboardData.validPaidUsers }}</span>
      </div>
      <div class="my-dashboard-data-item">
        <span class="data-name">{{ nl('page_influencer_valid_order_quantity') }}</span>
        <span class="data-value">{{ dashboardData.validOrderQty }}</span>
      </div>
      <div class="my-dashboard-data-item">
        <span class="data-name">{{ nl('page_influencer_valid_order_amount') }}</span>
        <span class="data-value">{{ dashboardData.validOrderAmount }}</span>
      </div>
    </div>
    <div class="my-dashboard-data blue">
      <div class="my-dashboard-data-item">
        <span class="data-name">{{ nl('page_influecner_pending_commissioin_amount') }}</span>
        <span class="data-value">{{ dashboardData.pendingCommission }}</span>
      </div>
      <div class="my-dashboard-data-item">
        <span class="data-name">{{ nl('page_influencer_valid_commission_amount') }}</span>
        <span class="data-value">{{ dashboardData.validCommission }}</span>
      </div>
      <div class="my-dashboard-data-item">
        <span class="data-name">{{ nl('page_influencer_paid_commission_amount') }}</span>
        <span class="data-value">{{ dashboardData.paidCommission }}</span>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 网红，门店中心数据展示区组件
 */
export default {
  props: {
    dashboardData: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
<style lang="less" scoped>
.my-dashboard {
  margin-top: 30px;
  &-title {
    font-size: 13px;
    margin-bottom: 20px;
    .title {
      font-family: @font-family-600;
      text-transform: uppercase;
      color: @theme-color;
      border-bottom: 3px solid @theme-color;
      margin-right: 20px;
    }
  }

  &-data {
    display: flex;
    align-items: center;
    &-item {
      width: 291px;
      height: 70px;
      padding: 12px;
      box-sizing: border-box;
      background-color: var(--color-f1e9e6);
      margin-right: 15px;
      margin-bottom: 15px;
      text-transform: capitalize;
      &:last-of-type {
        margin-right: 0px;
      }
      .data-value {
        font-size: 16px;
        font-family: @font-family-600;
        line-height: normal;
        letter-spacing: 0.32px;
        display: block;
        margin-top: 2px;
      }
    }
    &.grey {
      .my-dashboard-data-item {
        background-color: var(--color-f9f9f9);
      }
    }
    &.pink {
      .my-dashboard-data-item {
        background-color: var(--color-f1e9e6);
      }
    }
    &.yellow {
      .my-dashboard-data-item {
        background-color: var(--color-fcf7da);
      }
    }
    &.blue {
      .my-dashboard-data-item {
        background-color: #edf6fc;
      }
    }
  }
}
</style>
