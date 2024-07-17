<template>
  <div>
    <!--  退款判断是不是oxxo -->
    <popup-oxxo-refund v-if="popupOxxoRefundShow" @handleSubmit="cancelOrder" @handleClose="handleClose"></popup-oxxo-refund>
    <az-overlay v-else :zIndex="12">
      <div id="cancel-order-dialog" v-if="!type">
        <p class="reason-title">{{ nl('page_cancel_reason') }}:</p>
        <select id="cancel-reason" v-model="cancelReason" name="reason">
          <option value="Select Cancellation Reason">{{ nl('page_cancel_reason_select') }}</option>
          <option value="Order Created by Mistake">{{ nl('page_cancel_reason_create_mistake') }}</option>
          <option value="Need to Change Shipping Address">{{ nl('page_cancel_reason_change_address') }}</option>
          <option value="Need to Change Color/Size/Style">{{ nl('page_cancel_reason_change_color_size_style') }}</option>
          <option value="Item(s) Would Not Arrive on Time">{{ nl('page_cancel_reason_not_arrive_on_time') }}</option>
          <option value="Not Going to Event Anymore">{{ nl('page_cancel_reason_not_event_anymore') }}</option>
          <option value="Don’t Want Anymore">{{ nl('page_cancel_reason_not_want') }}</option>
          <option value="Other">{{ nl('page_ticket_cancel_other') }}</option>
        </select>
        <svg class="icon select_title-icon">
          <use xlink:href="#icon-lby_expand_arrow_down"></use>
        </svg>
        <p class="tips">
          <span>{{ nl('page_email_note') }}</span> {{ nl('page_cancel_reason_result') }}
        </p>
        <p class="btns">
          <button @click="closeLayer" class="btn back">{{ nl('page_common_back') }}</button>
          <!-- <span v-show="cancelLoading" class="loading"></span> -->
          <button @click="cancelOrder()" :class="{ loading: cancelLoading }" class="btn continue">
            {{ cancelLoading ? nl('page_common_open') : nl('page_common_continue') }}
          </button>
        </p>
        <span @click="closeLayer" class="dialog-close">
          <az-icon icon-class="iconic-close-appdownload"></az-icon>
        </span>
      </div>
      <div id="canel-order-success" v-else>
        <div v-if="type == 'cancelOrderSuccess'" class="success">
          <az-icon class="icon icon-ok" icon-class="icon-ok" />
          <div class="content">
            {{ nl('page_cancel_result_canceled') }}
          </div>
        </div>
        <div v-else class="fail">
          <az-icon class="icon icon-failed" icon-class="icon-failed" />
          <div class="content">
            {{ nl('page_cancel_result_not_canceled') }}
          </div>
        </div>
        <span @click="closeLayer" class="dialog-close">
          <az-icon icon-class="iconic-close-appdownload"></az-icon>
        </span>
      </div>
    </az-overlay>
  </div>
</template>

<script>
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
import PopupOxxoRefund from '@/components/order/PopupOxxoRefund'

export default {
  name: 'CancelOrderLayer',
  components: {
    AzOverlay,
    PopupOxxoRefund
  },
  props: {
    orderSn: {
      type: String,
      default: ''
    },
    isOxxoPay: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cancelReason: 'Select Cancellation Reason',
      cancelLoading: false,
      type: '',
      popupOxxoRefundShow: false
    }
  },
  methods: {
    cancelOrder(bankInfo) {
      //  oxxo的取消订单，需要加弹框，点击弹框的保存，才会调取消接口，否则是未取消
      if (this.isOxxoPay && !bankInfo) {
        this.popupOxxoRefundShow = true
        return
      }
      this.cancelLoading = true
      let params = {
        order_sn: this.orderSn,
        reason: this.cancelReason === 'Select Cancellation Reason' ? '' : this.cancelReason
      }
      if (bankInfo) {
        params = { ...params, ...bankInfo }
      }
      this.$axios.$post(`/1.0/order/cancel`, params).then((res) => {
        this.cancelLoading = false
        if (res.code === 0) {
          this.popupOxxoRefundShow = false
          if (res.data.url.includes('cancelOrderSuccess')) {
            this.type = 'cancelOrderSuccess'
          } else if (res.data.url.includes('cancelOrderFail')) {
            this.type = 'cancelOrderFail'
          } else {
            window.location.href = res.data.url
          }
        } else if (res.code === 1) {
          alert(res.msg)
          window.location.reload()
        } else {
          window.location.reload()
        }
      })
    },
    handleClose() {
      this.popupOxxoRefundShow = false
    },
    closeLayer() {
      this.$store.commit('order/setCancelOrderLayerShow', false)
    }
  }
}
</script>

<style lang="less" scoped>
#cancel-order-dialog {
  position: relative;
  background: #fff;
  padding: 40px 40px 35px;
  p.reason-title {
    font-family: @font-family-600;
    font-size: 14px;
    text-transform: uppercase;
    padding-bottom: 10px;
  }

  select {
    width: 365px;
    height: 40px;
    margin-bottom: 10px;
    padding: 0 10px;
    appearance: none;
    border: 1px solid #ccc;
    cursor: pointer;
  }

  p.tips {
    width: 365px;
    margin-bottom: 30px;
    span {
      color: @theme;
    }
  }

  p.btns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn {
      width: 176px;
      margin: 0;
      padding: 0;
      height: 40px;
      line-height: 40px;
      text-transform: uppercase;
      font-size: 14px;
      font-family: @font-family-600;
    }
    .back {
      background: #fff;
      border: solid 1px #ccc;
      color: #666;
      font-size: 12px;
      &:hover {
        background: #eee;
      }
    }
    .continue {
      font-size: 14px;
      background: var(--color-121212);
      color: #fff;
      border: none;
      text-transform: uppercase;
      &:hover {
        background: var(--color-1e1e1e);
      }
      &.loading {
        // background: #666;
        opacity: 0.3;
      }
    }
  }

  span.loading {
    display: inline-block;
    width: 32px;
    height: 32px;
    background: url('~assets/images/loading_1.gif') no-repeat;
  }
  .dialog-close {
    position: absolute;
    top: 17px;
    right: 15px;
    display: block;
    width: 16px;
    height: 16px;
    cursor: pointer;
    font-size: 16px;
  }
  .select_title-icon {
    position: absolute;
    top: 85px;
    right: 55px;
    z-index: 2;
    font-size: 10px;
    width: 10px;
    height: 10px;
  }
}
#canel-order-success {
  position: relative;
  background: #fff;
  padding: 68px 40px;
  text-align: center;
  .icon-ok,
  .icon-failed {
    width: 40px;
    height: 40px;
    font-size: 40px;
  }
  .content {
    font-size: 13px;
    color: var(--color-121212);
    line-height: 18px;
    width: 368px;
    margin-top: 20px;
    text-align: left;
  }
  .dialog-close {
    position: absolute;
    top: 15px;
    right: 15px;
    display: block;
    width: 16px;
    height: 16px;
    cursor: pointer;
    font-size: 16px;
  }
}
</style>
