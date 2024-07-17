<template>
  <div @click="closeToast()" class="azazie-toast">
    <div class="toast-box">
      <div class="toast-content">
        <div :class="{ failed: !success }" class="content-top"></div>
        <div class="content-text">
          <span v-if="!success">{{ nl('page_azazie_perks_toast_text1') }}</span>
          <span v-else>{{ nl('page_azazie_perks_toast_text2') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AzazieToast',
  props: {
    success: {
      type: [String, Boolean],
      default: () => ''
    }
  },
  methods: {
    closeToast() {
      this.$emit('closeToast')
    }
  }
}
</script>

<style lang="less" scoped>
.azazie-toast {
  position: fixed;
  background: transparent;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: @popuy-z-index;
  .toast-box {
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    width: 400px;
    height: 200px;
    top: calc(50% + 80px);
    left: calc(50% - 6px);
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .toast-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .content-top {
        width: 50px;
        height: 50px;
        background: #fff url(~assets/images/rights/success.png) no-repeat;
        background-size: 100% 100%;
        border-radius: 100%;
        border: 1px solid var(--color-121212);
        background-origin: border-box;
        &.failed {
          background: #ccc url(~assets/images/rights/failed.png) no-repeat;
          background-size: 100% 100%;
          border: none;
        }
      }
      .content-text {
        margin-top: 30px;
        height: 18px;
        font-size: 13px;
        font-family: @font-family-500;
        color: #fff;
        line-height: 18px;
        &::after {
          content: '...';
          height: 100%;
          letter-spacing: 1px;
        }
      }
    }
  }
}
</style>
