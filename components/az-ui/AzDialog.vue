<template>
  <transition name="fade">
    <div v-if="visible" @click.self="clickMask" class="az-dialog">
      <div :style="{ width: width, height: height }" class="az-dialog-content">
        <button @click="clickClose" aria-label="Close button" class="btn-close">
          <az-icon icon-class="icon-icon_style_gallery_off" class="icon-close"></az-icon>
        </button>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
/**
 * 统一弹框交互组件
 * 注意：凡是居中弹框交互的需求，均可用此组件，不要用Popup文件夹下的组件，有坑
 */
export default {
  name: 'AzDialog',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 背景遮罩是否可点击
    maskEnable: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    // 是否限制滚动
    scrollLimit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {
    visible(e) {
      if (this.scrollLimit) {
        const m = function(e) {
          e.preventDefault()
        }
        if (e) {
          // 禁止页面滚动
          document.body.style.overflow = 'hidden'
          document.addEventListener('touchmove', m, false)
        } else {
          // 放开页面滚动
          document.body.style.overflow = ''
          document.removeEventListener('touchmove', m, false)
        }
      }
    }
  },
  methods: {
    clickClose() {
      this.$emit('update:visible', false)
      this.$emit('onClose', true)
    },
    clickMask() {
      if (this.maskEnable) {
        this.clickClose()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.az-dialog {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 12;
  overflow: hidden;
  &-content {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 440px;
    padding: 40px;
    transform: translate(-50%, -50%);
    background-color: #fff;
    .btn-close {
      width: 30px;
      height: 30px;
      padding: 7.5px;
      position: absolute;
      right: 7.5px;
      top: 7.5px;
      border: none;
      &:focus {
        background: #fff;
      }
      .icon-close {
        width: 15px;
        height: 15px;
        fill: var(--color-121212);
      }
    }
  }
}
</style>
