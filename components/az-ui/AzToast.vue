<template>
  <div
    :class="[locateMode, { 'az-toast-show': toastShow, 'az-toast--top': position === 'top', 'az-toast--bottom': position === 'bottom' }]"
    class="az-toast"
  >
    <div class="az-toast__text">{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: 'AzToast',
  props: {
    message: {
      required: true,
      type: String
    },
    duration: {
      type: Number,
      default: 1500
    },
    position: {
      type: String,
      default: 'middle' // top/middle/bottom
    },
    locateMode: {
      type: String,
      default: 'global' // global/self   global指针对整个页面定位，self针对当前组件
    }
  },
  data() {
    return {
      timer: null,
      toastShow: false
    }
  },
  created() {},
  methods: {
    show() {
      if (this.timer) return
      this.toastShow = true
      this.timer = setTimeout(() => {
        this.toastShow = false
        this.timer = null
        this.$emit('toastHide')
      }, this.duration)
    }
  }
}
</script>

<style scoped lang="less">
.az-toast {
  align-items: center;
  justify-content: center;
  box-sizing: content-box;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  display: none;
  z-index: 99;
  &.self {
    position: absolute;
  }

  &-show {
    display: flex;
  }

  &__text {
    width: max-content;
    background: rgba(0, 0, 0, 0.8);
    padding: 15px;
    font-size: 13px;
    text-align: center;
    font-family: @font-family-500;
    color: var(--color-ffffff);
    white-space: pre-wrap;
    box-sizing: border-box;
  }

  &--top {
    top: 30%;
    align-items: flex-start;
  }

  &--bottom {
    top: auto;
    bottom: 20%;
    align-items: flex-end;
  }
}
</style>
