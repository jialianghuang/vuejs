<template>
  <transition name="fade">
    <az-overlay :zIndex="zIndex" :overlayStyle="overlayStyle">
      <div class="loading-icon"></div>
    </az-overlay>
  </transition>
</template>

<script>
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'

export default {
  name: 'AzLoading',
  components: {
    AzOverlay
  },
  props: {
    // 之前这个组件写死  zIndex 为 1001 ，但是现在有需求会出现弹窗里面弹弹窗的情况，loading 组件的z-index要高于第一层弹窗，所以改成可自定义，默认还是1001
    zIndex: {
      type: Number,
      default: 1001
    }
  },
  computed: {
    overlayStyle() {
      const res = { 'background-color': 'rgba(255, 255, 255, 0.3)' }
      return res
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.loading-icon {
  display: inline-block;
  width: 35px;
  height: 35px;
  background: url('~assets/images/loading.png') center center no-repeat;
  background-size: 100% 100%;
  animation: rotate 1s infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-box {
  margin-top: 300px;
  align-self: start;
  width: 200px;
  height: 150px;
  text-align: center;

  .skeleton-bac-animation {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, hsla(0, 0%, 100%, 0), hsla(0, 0%, 100%, 0.5) 50%, hsla(0, 0%, 100%, 0) 80%);
    background-size: 30% 100%;
    background-repeat: no-repeat;
    animation: backpos 0.9s ease-in-out 0s infinite;
  }

  @keyframes backpos {
    0% {
      background-position-x: -200px;
    }
    to {
      background-position-x: calc(200px + 100%);
    }
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
