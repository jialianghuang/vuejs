<template>
  <az-overlay @click="overlayClick" :z-index="overlayZIndex" :overlayStyle="overlayStyle">
    <div :class="`az-popup-${position}`" :style="{ width, ...styles }" class="az-popup-box">
      <slot></slot>
    </div>
  </az-overlay>
</template>

<script>
import AzOverlay from './../Overlay/AzOverlay'
export default {
  name: 'AzPopup',
  components: {
    AzOverlay
  },
  props: {
    overlayZIndex: {
      type: Number,
      default: 1
    },
    position: {
      // 暂时只支持 top/center/bottom
      type: String,
      default: 'center'
    },
    width: {
      type: String,
      default: '100%'
    },
    styles: {
      type: Object,
      default: () => {}
    },
    overlayStyle: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  methods: {
    overlayClick() {
      this.$emit('close-on-click-overlay')
    }
  }
}
</script>

<style lang="less" scoped>
.az-popup-box {
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  &.az-popup-top {
    align-self: flex-start;
  }
  &.az-popup-center {
    align-self: center;
  }
  &.az-popup-bottom {
    align-self: flex-end;
  }
}
</style>
