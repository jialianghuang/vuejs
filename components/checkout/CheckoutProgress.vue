<template>
  <div class="checkout-progress">
    <div :class="progress" class="progress">
      <div class="progress1">
        <span class="progress_block">1</span>
        <span class="progress_txt">{{ nl('page_checkout_confirm_order') }}</span>
      </div>
      <div class="progress3">
        <span class="progress_block">2</span>
        <span class="progress_txt">{{ nl('page_checkout_order_complete') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'CheckoutProgress',
  data() {
    return {}
  },
  computed: {
    ...mapState('checkout', ['orderInfo', 'progressId']),
    fromReviewPage() {
      return this.orderInfo.checkoutAction === 'review_editing'
    },
    progress() {
      if (this.progressId == 2) {
        return 'progress-2'
      } else if (this.$route.name == 'checkoutSuccess') {
        return 'progress-3'
      } else {
        return this.fromReviewPage ? 'progress-2' : 'progress-1'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.checkout-progress {
  font-family: @font-family-500, sans-serif;
  color: var(--color-121212);
  .pay-page-title {
    padding: 18px 0 10px;
    letter-spacing: 1px;
    font-size: 16px;
    font-family: @font-family-600, sans-serif;
    text-transform: uppercase;
  }
  .tips_under_headings .container {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    width: auto;
    height: 40px;
    background: #fefceb;
    padding: 0 25px 0 15px;
    border: 1px solid #f4ecdd;
    margin: 5px 0 20px;
  }
  .progress {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 67px;
    &.progress-3 {
      margin-top: 50px;
      margin-bottom: 50px;
    }
    .progress2,
    .progress3 {
      margin-left: 40px;
    }
    .progress_block {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: #ccc;
      color: #ffffff;
      font-family: @font-family-500;
      border-radius: 50%;
      line-height: 20px;
      text-align: center;
    }
    .progress_txt {
      margin-left: 10px;
      color: #999;
      font-family: @font-family-500;
    }
    &.progress-1 {
      .progress1 {
        .progress_block {
          background: var(--color-121212);
        }
        .progress_txt {
          color: var(--color-121212);
        }
      }
    }
    &.progress-2 {
      .progress1,
      .progress2 {
        .progress_block {
          background: var(--color-121212);
        }
        .progress_txt {
          color: var(--color-121212);
        }
      }
    }
    &.progress-3 {
      .progress1,
      .progress2,
      .progress3 {
        .progress_block {
          background: var(--color-121212);
        }
        .progress_txt {
          color: var(--color-121212);
        }
      }
    }
  }
}
</style>
