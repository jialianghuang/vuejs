<template>
  <az-overlay @click="layerClose('outside')" :z-index="zIndex" :lockScroll="lockScroll">
    <div :style="{ width, height, padding }" class="az-popup-box">
      <div v-if="showCloseIcon && showClose" @click="layerClose('inside')" class="layer-close">
        <az-icon icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
      </div>
      <h2 v-if="title" class="layer-title">
        {{ title }}<az-icon v-if="showIcon" class="icon-ok" icon-class="icon-all_tick" fill="var(--color-5fa452)" />
      </h2>
      <div class="layer-content">
        <slot></slot>
      </div>
    </div>
  </az-overlay>
</template>

<script>
import AzOverlay from './../Overlay/AzOverlay'
export default {
  name: 'AzPopupLayer',
  components: {
    AzOverlay
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 12
    },
    width: {
      required: true,
      type: String,
      default: '50vw'
    },
    height: {
      required: true,
      type: String,
      default: '80vh'
    },
    title: {
      required: false,
      type: String,
      default: ''
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    padding: {
      type: String,
      default: '40px'
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    // 是否展示关闭按钮
    showCloseIcon: {
      type: Boolean,
      default: true
    },
    // 正整数，是否延迟显示关闭按钮，默认0，即不延迟显示，例如：3（表示延迟3s）
    delayClose: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showClose: false // 是否显示右上角的关闭图标，默认不显示，组件加载后，根据delayClose参数修改状态
    }
  },
  mounted() {
    // 判断delayClose是否大于0，如果大于0，说明需要延迟显示关闭图标
    if (this.delayClose > 0) {
      // 延迟几秒后显示关闭图标
      setTimeout(() => {
        this.showClose = true
      }, this.delayClose * 1000)
    } else {
      // 如果不大于0，直接显示关闭图标，不需要延迟
      this.showClose = true
    }
  },
  methods: {
    layerClose(position) {
      this.$emit('close', position)
    }
  }
}
</script>

<style lang="less" scoped>
.az-popup-box {
  position: relative;
  z-index: 10;
  background-color: #fff;
  padding: 40px;
  max-height: calc(80vh + 40px);
  overflow-y: auto;
  .layer-close {
    position: absolute;
    top: 0;
    right: 0;
    border: 15px solid transparent;
    line-height: 15px;
    font-size: 15px;
    z-index: 10;
    cursor: pointer;
  }
  .layer-title {
    padding-bottom: 5px;
    margin-bottom: 20px;
    color: var(--color-121212);
    font-size: 16px;
    font-family: @font-family-600;
    text-transform: uppercase;
    border-bottom: 1px solid #ccc;
    .icon-ok {
      margin-left: 10px;
    }
  }
}
</style>
