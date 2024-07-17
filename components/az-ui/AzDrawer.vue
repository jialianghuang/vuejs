<template>
  <transition name="fade">
    <div v-if="visible" @click.self="clickMask" class="az-drawer">
      <transition @before-enter="transitionInit" @enter="transitionEnter" @leave="transitionLeave">
        <div v-show="show" :class="position" class="az-drawer-main">
          <div class="az-drawer-title">
            <span>{{ title }}</span>
            <button @click="clickClose" aria-label="Close button" class="btn-close">
              <az-icon icon-class="icon-icon_style_gallery_off" class="icon-close"></az-icon>
            </button>
          </div>
          <slot></slot>
        </div>
      </transition>
    </div>
  </transition>
</template>
<script>
/**
 * 抽屉组件
 * 从右侧或者左侧弹出内容
 */
export default {
  props: {
    // 是否可用，控制组件显示隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 位置，默认right
    position: {
      type: String,
      default: 'right'
    },
    // 遮罩是否可以点击
    maskEnable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false
    }
  },
  watch: {
    visible(e) {
      let delay = 0
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
        delay = 300
      }
      setTimeout(() => {
        this.show = e
      }, delay)
    }
  },
  created() {
    this.show = this.visible
  },
  methods: {
    transitionInit(el) {
      if (this.position === 'left') {
        el.style.transform = 'translateX(-100%)'
      } else if (this.position === 'right') {
        el.style.transform = 'translateX(100%)'
      }
    },
    transitionEnter(el) {
      // eslint-disable-next-line no-unused-expressions
      el.offsetWidth
      el.style.transform = 'translateX(0)'
      el.style.transition = 'all 0.3s'
    },
    transitionLeave(el) {
      if (this.position === 'left') {
        el.style.transform = 'translateX(-100%)'
      } else if (this.position === 'right') {
        el.style.transform = 'translateX(100%)'
      }
      el.style.transition = 'all 0.3s'
    },
    // 关闭组件
    clickClose() {
      this.show = false
      setTimeout(() => {
        this.$emit('onClose')
      }, 300)
    },
    // 点击遮罩，遮罩可用的情况下，点击触发关闭
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
.az-drawer {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 15;
  &-main {
    position: absolute;
    top: 0px;
    bottom: 0px;
    background: #fff;
    transition: all 0.3s;
    &.right {
      right: 0px;
    }
    &.left {
      left: 0px;
    }
  }
  &-title {
    padding: 0px 45px 0px 15px;
    height: 49px;
    border-bottom: 1px solid #ccc;
    font-family: @font-family-600;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn-close {
      width: 30px;
      height: 30px;
      padding: 7px;
      position: absolute;
      right: 15px;
      top: 10px;
      border: none;
      &:focus {
        background: #fff;
      }
      .icon-close {
        width: 16px;
        height: 16px;
        fill: #666;
      }
    }
  }
}
</style>
