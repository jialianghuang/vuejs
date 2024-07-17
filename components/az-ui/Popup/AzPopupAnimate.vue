<template>
  <div class="az-popup-box">
    <transition :name="transitionName">
      <div v-if="isVisible" :class="`az-popup-${position}`" :style="{ ...popupStyle }" class="az-popup">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AzPopupAnimate',
  components: {},
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    position: {
      // 暂时只支持 bottom/left/right
      type: String,
      default: 'bottom'
    },
    popupStyle: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    transitionName() {
      return `slide${this.position[0].toUpperCase()}${this.position.slice(1)}`
    }
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
  .az-popup {
    position: fixed;
    bottom: 0;
    width: 100%;
    max-height: 100%;
    overflow-y: auto;
    // border-radius: 4px;
    &.az-popup-left {
      left: 0;
      right: auto;
      // border-radius: 0 4px 4px 0;
    }
    &.az-popup-right {
      right: 0;
      left: auto;
      // border-radius: 4px 4px 0 0;
    }
    &.az-popup-bottom {
      top: auto;
      bottom: 0;
      // border-radius: 4px 4px 0 0;
    }
  }
}
@keyframes slideBottomIn {
  0% {
    transform: translate3d(0, 100%, 0);
  }
  to {
    transform: translateZ(0);
  }
}
@keyframes slideBottomOut {
  0% {
    transform: translateZ(0);
  }
  to {
    transform: translate3d(0, 100%, 0);
  }
}

@keyframes slideLeftIn {
  0% {
    transform: translate3d(-100%, 0, 0);
  }
  to {
    transform: translateZ(0);
  }
}
@keyframes slideLeftOut {
  0% {
    transform: translateZ(0);
  }
  to {
    transform: translate3d(-100%, 0, 0);
  }
}

@keyframes slideRightIn {
  0% {
    transform: translate3d(100%, 0, 0);
  }
  to {
    transform: translateZ(0);
  }
}
@keyframes slideRightOut {
  0% {
    transform: translateZ(0);
  }
  to {
    transform: translate3d(100%, 0, 0);
  }
}

.slideBottom-enter-active,
.slideBottom-leave-active,
.slideLeft-enter-active,
.slideLeft-leave-active,
.slideRight-enter-active,
.slideRight-leave-active {
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-timing-function: cubic-bezier(0.445, 0.05, 0.55, 0.95);
}

.slideBottom-enter-active {
  animation-name: slideBottomIn;
}
.slideBottom-leave-active {
  animation-name: slideBottomOut;
}

.slideLeft-enter-active {
  animation-name: slideLeftIn;
}
.slideLeft-leave-active {
  animation-name: slideLeftOut;
}

.slideRight-enter-active {
  animation-name: slideRightIn;
}
.slideRight-leave-active {
  animation-name: slideRightOut;
}
</style>
