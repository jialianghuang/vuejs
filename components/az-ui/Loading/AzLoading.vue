<template>
  <transition name="fade">
    <az-overlay v-if="value" :zIndex="12" :overlayStyle="overlayStyle" :lockScroll="false">
      <div v-if="msgFlag" class="loading-box">
        <az-icon class="icon-lby_retry" icon-class="icon-lby_retry"></az-icon>
        <div class="loading-text">Failed to load</div>
        <div @click="reloadPage" class="retry-btn">RETRY</div>
      </div>
    </az-overlay>
  </transition>
</template>

<script>
import AzOverlay from './../Overlay/AzOverlay'
export default {
  name: 'AzLoading',
  components: {
    AzOverlay
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    msgFlag: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    overlayStyle() {
      let res = { 'background-color': 'rgba(255, 255, 255, 0.3)', position: 'absolute' }
      if (this.msgFlag) {
        res = { 'background-color': 'rgba(255, 255, 255, 0.8)' }
      }
      return res
    }
  },
  methods: {
    reloadPage() {
      location.reload()
    }
  }
}
</script>

<style lang="less" scoped>
.loading-box {
  margin-top: 300px;
  align-self: start;
  width: 200px;
  height: 150px;
  text-align: center;
  .icon-lby_retry {
    font-size: 40px;
    color: #666;
    fill: currentColor;
  }
  .loading-text {
    margin-top: 16px;
    font-family: @font-family-500, sans-serif;
    font-size: 13px;
    color: var(--color-121212);
    text-align: center;
  }
  .retry-btn {
    margin-top: 26px;
    display: inline-block;
    width: 160px;
    height: 36px;
    font-family: @font-family-600, sans-serif;
    font-size: 14px;
    color: #fff;
    line-height: 36px;
    background: #d68f95;
    cursor: pointer;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
