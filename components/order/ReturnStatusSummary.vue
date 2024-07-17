<template>
  <div class="pay-summary">
    <div class="order-summary-amount-info">
      <div class="order-summary-container">
        <div class="item clearfix mt-0">
          <span class="item-left fl">{{ nl('page_common_subtotal') }}</span>
          <span class="item-right fr">
            {{ returnSummaryInfo.subtotal_display }}
          </span>
        </div>
        <div v-if="returnSummaryInfo.adjustments && returnSummaryInfo.adjustments.shipping_fee" class="item clearfix">
          <span class="item-left fl">{{ nl('page_orders_shipping_fee') }}</span>
          <span class="item-right fr">{{ returnSummaryInfo.adjustments.shipping_fee_display }}</span>
        </div>
        <div v-if="returnSummaryInfo.adjustments && returnSummaryInfo.adjustments.tax_fee" class="item clearfix">
          <span class="item-left fl">{{ nl('page_revie_tax') }}</span>
          <span class="item-right fr">{{ returnSummaryInfo.adjustments.tax_fee_display }}</span>
        </div>
        <div v-if="returnSummaryInfo.adjustments && returnSummaryInfo.adjustments.coupon" class="item clearfix">
          <span class="item-left fl">{{ nl('page_checkout_coupon') }} </span>
          <span class="item-right fr">{{ returnSummaryInfo.adjustments.coupon_display }}</span>
        </div>
        <div v-if="returnSummaryInfo.adjustments && returnSummaryInfo.adjustments.return_shipping_fee" class="item clearfix">
          <span class="item-left fl">
            {{ nl('page_return_shipping_fee') }}
            <AzQuestionIcon :popTips="nl('page_return_please_check_here')" ec="" el="" />
          </span>
          <span class="item-right fr">{{ returnSummaryInfo.adjustments.return_shipping_fee_display }} </span>
        </div>
        <div v-if="returnSummaryInfo.adjustments && returnSummaryInfo.adjustments.restocking_fee" class="item clearfix">
          <span class="item-left fl">{{ nl('page_orders_restocking_fee') }}</span>
          <span class="item-right fr">{{ returnSummaryInfo.adjustments.restocking_fee_display }}</span>
        </div>
        <div v-if="returnSummaryInfo.adjustments && returnSummaryInfo.adjustments.rush_fee" class="item clearfix">
          <span class="item-left fl">{{ nl('page_cart_rush_fee') }}</span>
          <span class="item-right fr">{{ returnSummaryInfo.adjustments.rush_fee_display }}</span>
        </div>
        <div class="item clearfix total-item">
          <span class="item-left fl total-txt">{{ isCompleteApply ? nl('page_orders_refund') : nl('page_orders_estimated_refund') }}</span>
          <span class="item-right fr total-txt">
            {{ returnSummaryInfo.total_display }}
          </span>
        </div>
      </div>
      <!-- 退款渠道以及金额 -->
      <template v-if="isCompleteApply">
        <div class="order-summary-bottom">
          <template v-for="(item, index) in returnSummaryInfo.distributions">
            <div :key="`distributions_${index}`" v-if="item.show_refund_method" class="item">
              <span>{{ item.show_refund_method }}:</span>
              <span>{{ item.amount_display }}</span>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import AzQuestionIcon from '@/components/az-ui/AzQuestionIcon'

export default {
  name: 'ReturnStatusSummary',
  components: { AzQuestionIcon },
  props: {
    returnSummaryInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    isCompleteApply: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  methods: {}
}
</script>

<style lang="less" scoped>
.mt-0 {
  margin-top: 0 !important;
}
.pay-summary {
  width: 100%;
  display: flex;
  margin-left: auto;
  .order-summary-amount-info {
    width: 100%;
    .order-summary-container {
      .item {
        font-size: 13px;
        font-family: @font-family-500;
        color: var(--color-121212);
        line-height: 18px;
        margin-top: 5px;
        .shipping-free {
          text-transform: uppercase;
          color: var(--color-121212);
        }
        .item-left {
          text-transform: capitalize;
        }
        .item-right {
          white-space: nowrap;
          margin-left: 15px;
        }
      }
      .total-txt {
        font-family: @font-family-600;
        color: var(--color-121212);
      }
    }
    .order-summary-bottom {
      color: #ccc;
      border-top: 1px dotted #ccc;
      padding-top: 10px;
      margin-top: 10px;
      text-align: right;
      .item {
        margin-bottom: 5px;
        text-transform: capitalize;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
